"use strict";
const http=require("http");
const fs=require("fs");
const path=require("path");

const RACINE=__dirname;
const DOSSIER_DONNEES=path.join(RACINE,"data");
if(!fs.existsSync(DOSSIER_DONNEES)){fs.mkdirSync(DOSSIER_DONNEES);}

const TYPES={
  ".html":"text/html; charset=utf-8",
  ".css":"text/css; charset=utf-8",
  ".js":"application/javascript; charset=utf-8",
  ".json":"application/json; charset=utf-8",
  ".png":"image/png",
  ".jpg":"image/jpeg",
  ".jpeg":"image/jpeg",
  ".gif":"image/gif",
  ".ico":"image/x-icon",
  ".svg":"image/svg+xml"
};

function envoyer(rep,code,contenu,type){
  rep.writeHead(code,{"Content-Type":type||"text/plain; charset=utf-8","Cache-Control":"no-store"});
  rep.end(contenu);
}

const serveur=http.createServer(function(req,rep){
  let chemin="";
  try{chemin=decodeURIComponent(new URL(req.url,"http://localhost").pathname);}catch(e){envoyer(rep,400,"Requête invalide");return;}

  if(req.method==="POST"&&chemin==="/api/sauvegarde"){
    let corps="";
    req.on("data",function(c){corps+=c;if(corps.length>5e6){req.destroy();}});
    req.on("end",function(){
      try{
        const payload=JSON.parse(corps);
        const cle=String(payload.cle||"").replace(/[^A-Za-z0-9_-]/g,"");
        if(!cle){envoyer(rep,400,"Clé invalide");return;}
        const fichier=path.join(DOSSIER_DONNEES,cle+".json");
        fs.writeFileSync(fichier,JSON.stringify(payload.donnees,null,2),"utf8");
        envoyer(rep,200,JSON.stringify({ok:true}),"application/json; charset=utf-8");
      }catch(e){
        envoyer(rep,500,"Erreur : "+e.message);
      }
    });
    return;
  }

  if(chemin==="/api/donnees"){
    const resultat={};
    fs.readdirSync(DOSSIER_DONNEES).forEach(function(f){
      if(path.extname(f).toLowerCase()===".json"){
        try{resultat[path.basename(f,".json")]=JSON.parse(fs.readFileSync(path.join(DOSSIER_DONNEES,f),"utf8"));}catch(e){}
      }
    });
    envoyer(rep,200,JSON.stringify(resultat),"application/json; charset=utf-8");
    return;
  }

  let fichier=chemin==="/"?"index.html":chemin.replace(/^\/+/,"");
  const cible=path.join(RACINE,fichier);
  if(cible!==RACINE&&!cible.startsWith(RACINE+path.sep)){envoyer(rep,403,"Accès refusé");return;}
  if(!fs.existsSync(cible)||!fs.statSync(cible).isFile()){envoyer(rep,404,"Fichier introuvable");return;}
  const ext=path.extname(cible).toLowerCase();
  envoyer(rep,200,fs.readFileSync(cible),TYPES[ext]||"application/octet-stream");
});

const PORT=process.env.PORT||8080;
serveur.listen(PORT,function(){
  console.log("Serveur démarré : http://localhost:"+PORT+"  —  Les données sont enregistrées dans le dossier data/ du projet.");
});