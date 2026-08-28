"use strict";

const FACTOR_KOH_NAOH = 40.00 / 56.11;
const DENSITE_HUILE = 0.92;

function afficherApercuHuile(){
  var idx=parseInt(document.getElementById("formHuile").value,10);
  var div=document.getElementById("infoHuileSelect");
  if(isNaN(idx)||!HUILES[idx]){div.style.display="none";return;}
  var h=HUILES[idx];
  var ag=h.ag||[0,0,0,0,0,0,0,0];
  var mouss=Math.min(ag[0]+ag[1]+ag[4]+ag[5],100);
  var nett=Math.min(ag[0]+ag[1],100);
  var onct=Math.min(ag[4]+ag[5]+ag[6]+ag[7],100);
  var durt=Math.min(ag[0]+ag[1]+ag[2]+ag[3],100);
  var longv=Math.min(ag[0]+ag[1]+ag[2]+ag[3],100);
  var stab=Math.min(ag[0]+ag[1]+ag[2]+ag[3]+ag[5]+ag[4],100);
  document.getElementById("infoHuileNom").textContent=h.nom;
  document.getElementById("infoHuileSAP").textContent=h.sap;
  document.getElementById("infoHuileMouss").textContent=mouss+"%";
  document.getElementById("infoHuileNett").textContent=nett+"%";
  document.getElementById("infoHuileOnct").textContent=onct+"%";
  document.getElementById("infoHuileDurt").textContent=durt+"%";
  document.getElementById("infoHuileLong").textContent=longv+"%";
  document.getElementById("infoHuileStab").textContent=stab+"%";
  div.style.display="block";
}

const HUILES_BASE = [
  { nom:"Amande douce",            sap:190, ag:[0,0,7,2,0,69,20,0] },
  { nom:"Arachide",                sap:192, ag:[0,0,11,2,0,47,32,0] },
  { nom:"Argan",                   sap:192, ag:[0,0,12,6,0,45,37,0] },
  { nom:"Avocat",                  sap:187, ag:[0,0,12,3,0,60,12,0] },
  { nom:"Beurre de cacao",         sap:194, ag:[0,0,26,34,0,34,2,0] },
  { nom:"Beurre de karité",        sap:180, ag:[0,0,4,42,0,46,7,0] },
  { nom:"Canola (Colza)",          sap:174, ag:[0,0,4,2,0,62,21,10] },
  { nom:"Chanvre",                 sap:189, ag:[0,0,7,2,0,12,55,22] },
  { nom:"Coco (Coprah)",           sap:258, ag:[48,19,9,3,0,7,2,0] },
  { nom:"Coton",                   sap:196, ag:[0,1,25,2,0,17,53,0] },
  { nom:"Germes de blé",           sap:184, ag:[0,0,14,1,0,20,55,0] },
  { nom:"Jojoba",                  sap:97,  ag:[0,0,1,0,0,12,2,0] },
  { nom:"Lin",                     sap:189, ag:[0,0,6,3,0,18,15,56] },
  { nom:"Macadamia",               sap:195, ag:[0,0,9,2,0,59,2,0] },
  { nom:"Neem",                    sap:195, ag:[0,0,17,16,0,50,13,0] },
  { nom:"Nigelle",                 sap:189, ag:[0,0,12,2,0,23,52,0] },
  { nom:"Noix",                    sap:189, ag:[0,0,7,2,0,22,58,10] },
  { nom:"Olive",                   sap:189, ag:[0,0,14,3,0,66,15,1] },
  { nom:"Palme",                   sap:199, ag:[0,1,44,5,0,40,10,0] },
  { nom:"Pépins de raisin",        sap:181, ag:[0,0,7,4,0,16,70,0] },
  { nom:"Ricin",                   sap:180, ag:[0,0,1,1,90,4,4,0] },
  { nom:"Saindoux (Porc)",         sap:194, ag:[0,1,27,12,0,47,11,0] },
  { nom:"Sésame",                  sap:187, ag:[0,0,9,4,0,41,45,0] },
  { nom:"Soja",                    sap:189, ag:[0,0,11,4,0,24,54,7] },
  { nom:"Suif (Bœuf)",             sap:198, ag:[0,3,26,22,0,43,3,0] },
  { nom:"Tournesol",               sap:189, ag:[0,0,6,5,0,20,68,0] }
];
let HUILES=(function(){try{return HUILES_BASE.concat(JSON.parse(localStorage.getItem("cs_huiles"))||[]);}catch(e){return HUILES_BASE.slice();}})();

function fmt(n){
  return Number(n).toLocaleString("fr-FR",{minimumFractionDigits:2,maximumFractionDigits:2});
}

function remplirSelectForm(){
  const sel=document.getElementById("formHuile");
  sel.innerHTML="";
  HUILES.forEach(function(h,i){
    const o=document.createElement("option");
    o.value=i; o.textContent=h.nom+" — SAP "+h.sap;
    sel.appendChild(o);
  });
}

let ingredients=[];
let ligneSelectionnee=null;

function rendreTable(){
  var tbody=document.getElementById("corpsTable");
  tbody.innerHTML="";
  var total=0;
  ingredients.forEach(function(ing){total+=ing.poids;});
  ingredients.forEach(function(ing,i){
    var h=HUILES[ing.idx];
    var tr=document.createElement("tr");
    if(i===ligneSelectionnee)tr.className="ligne-active";
    tr.style.cursor="pointer";
    tr.dataset.i=i;
    tr.onclick=function(){selectionnerLigne(i);};
    var pct=total>0?(ing.poids/total*100):0;
    tr.innerHTML='<td>'+h.nom+'</td>'+
      '<td><b>'+fmt(ing.poids)+' g</b></td>'+
      '<td class="pct">'+(total>0?fmt(pct)+'%':'—')+'</td>'+
      '<td class="sap">'+h.sap+'</td>'+
      '<td><button class="btn danger" style="padding:4px 10px;font-size:.8em;" onclick="event.stopPropagation();supprimerLigne('+i+')">✖</button></td>';
    tbody.appendChild(tr);
  });
}

function selectionnerLigne(i){
  ligneSelectionnee=i;
  var ing=ingredients[i];
  document.getElementById("formHuile").value=ing.idx;
  document.getElementById("formPoids").value=ing.poids;
  rendreTable();
}

window.supprimerLigne=function(i){
  if(!ingredients[i])return;
  if(!confirm("Supprimer cet ingrédient de la recette ?"))return;
  ingredients.splice(i,1);
  if(ligneSelectionnee===i)ligneSelectionnee=null;
  else if(ligneSelectionnee!==null&&ligneSelectionnee>i)ligneSelectionnee--;
  document.getElementById("formPoids").value="";
  rendreTable();
  calculer();
};

window.ajouterIngredient=function(){
  var idx=parseInt(document.getElementById("formHuile").value,10);
  var q=parseFloat(document.getElementById("formPoids").value);
  if(isNaN(idx)){alert("Choisissez d'abord un corps gras dans la liste.");return;}
  if(isNaN(q)||q<=0){alert("Saisissez une quantité valide.");return;}
  ingredients.push({idx:idx,poids:q});
  ligneSelectionnee=ingredients.length-1;
  document.getElementById("formPoids").value="";
  rendreTable();
  calculer();
};

window.modifierIngredient=function(){
  if(ligneSelectionnee===null||!ingredients[ligneSelectionnee]){alert("Cliquez d'abord sur une ligne du tableau pour la sélectionner.");return;}
  var idx=parseInt(document.getElementById("formHuile").value,10);
  var q=parseFloat(document.getElementById("formPoids").value);
  if(isNaN(idx)){alert("Choisissez un corps gras dans la liste.");return;}
  if(isNaN(q)||q<=0){alert("Saisissez une quantité valide.");return;}
  ingredients[ligneSelectionnee]={idx:idx,poids:q};
  ligneSelectionnee=null;
  document.getElementById("formPoids").value="";
  rendreTable();
  calculer();
};

window.supprimerIngredient=function(){
  if(ligneSelectionnee===null||!ingredients[ligneSelectionnee]){alert("Cliquez d'abord sur une ligne du tableau pour la sélectionner.");return;}
  if(!confirm("Supprimer cet ingrédient de la recette ?"))return;
  ingredients.splice(ligneSelectionnee,1);
  ligneSelectionnee=null;
  document.getElementById("formPoids").value="";
  rendreTable();
  calculer();
};

function afficherErreur(msg){
  const el=document.getElementById("msgErreur");
  if(msg){el.textContent=msg;el.style.display="block";}
  else{el.style.display="none";}
}

function calculer(){
  var lignes=ingredients.filter(function(ing){return ing.poids>0;});
  var totalHuiles=lignes.reduce(function(s,l){return s+l.poids;},0);

  var surgras=Math.min(Math.max(parseFloat(document.getElementById("surgras").value)||0,0),20);
  var purete=Math.min(Math.max(parseFloat(document.getElementById("purete").value)||100,80),100);
  var eauPctVal=Math.max(parseFloat(document.getElementById("eauPct").value)||0,0);
  var hePctVal=Math.max(parseFloat(document.getElementById("hePct").value)||0,0);
  var estKoh=document.getElementById("typeBase").value==="koh";

  document.querySelectorAll("#corpsTable tr").forEach(function(tr){
    var i=parseInt(tr.dataset.i,10);
    var q=(ingredients[i]&&ingredients[i].poids)||0;
    var pctCell=tr.querySelector(".pct");
    if(totalHuiles>0&&q>0){
      pctCell.textContent=fmt(q/totalHuiles*100)+"%";
    }else{
      pctCell.textContent="—";
    }
  });

  var blocRes=document.getElementById("blocResultats");
  var blocProp=document.getElementById("blocProprietes");

  if(totalHuiles<=0){
    blocRes.style.display="none";
    blocProp.style.display="none";
    afficherErreur("Veuillez saisir le poids d'au moins un corps gras.");
    return;
  }
  afficherErreur("");

  var basePure=0;
  lignes.forEach(function(l){
    basePure+=l.poids*HUILES[l.idx].sap/1000*FACTOR_KOH_NAOH;
  });
  basePure*=1-surgras/100;
  var baseFinale=basePure/(purete/100);
  var eau=totalHuiles*eauPctVal/100;
  var huilesEss=totalHuiles*hePctVal/100;
  var baseAffichee=estKoh?basePure*56.11/40/(purete/100):baseFinale;

  var AG_NOMS=["Acide laurique","Acide myristique","Acide palmitique","Acide stéarique","Acide ricinoléique","Acide oléique","Acide linoléique","Acide linolénique"];
  var moy=[0,0,0,0,0,0,0,0];
  lignes.forEach(function(l){
    var h=HUILES[l.idx];
    for(var k=0;k<8;k++) moy[k]+=h.ag[k]*l.poids/totalHuiles;
  });

  var mouss=Math.min(moy[0]+moy[1]+moy[4]+moy[5],100);
  var nett=Math.min(moy[0]+moy[1],100);
  var onct=Math.min(moy[4]+moy[5]+moy[6]+moy[7],100);
  var durt=Math.min(moy[0]+moy[1]+moy[2]+moy[3],100);
  var longv=Math.min(moy[0]+moy[1]+moy[2]+moy[3],100);
  var stab=Math.min(moy[0]+moy[1]+moy[2]+moy[3]+moy[5]+moy[4],100);

  var corpsRes=document.getElementById("corpsResultats");
  corpsRes.innerHTML="";
  var resultats=[
    {p:"Soude",v:fmt(baseAffichee)+" g",r:""},
    {p:"Huile",v:fmt(totalHuiles)+" g",r:""},
    {p:"Eau",v:fmt(eau)+" g",r:""},
    {p:"Huiles essentielles",v:fmt(huilesEss)+" g",r:""},
    {p:"Moussant",v:fmt(mouss)+"%",r:"14–46"},
    {p:"Nettoyant",v:fmt(nett)+"%",r:"12–22"},
    {p:"Onctuosité",v:fmt(onct)+"%",r:"44–69"},
    {p:"Dureté",v:fmt(durt)+"%",r:"29–54"},
    {p:"Longévité",v:fmt(longv)+"%",r:"25–50"},
    {p:"Stabilité",v:fmt(stab)+"%",r:"16–48"}
  ];
  resultats.forEach(function(r){
    var tr=document.createElement("tr");
    tr.innerHTML='<td><b>'+r.p+'</b></td><td>'+r.v+'</td><td>'+r.r+'</td>';
    corpsRes.appendChild(tr);
  });

  var corpsAc=document.getElementById("corpsAcides");
  corpsAc.innerHTML="";
  for(var k2=0;k2<8;k2++){
    var grams=totalHuiles*moy[k2]/100;
    var tr2=document.createElement("tr");
    tr2.innerHTML='<td>'+AG_NOMS[k2]+'</td><td>'+fmt(grams)+' g</td>';
    corpsAc.appendChild(tr2);
  }

  blocRes.style.display="block";
  blocProp.style.display="block";
}

function preset(nom){
  ingredients=[];
  if(nom==="castille"){
    var i1=HUILES.findIndex(function(h){return h.nom==="Olive";});
    ingredients.push({idx:i1,poids:500});
  }else{
    ingredients.push({idx:HUILES.findIndex(function(h){return h.nom==="Olive";}),poids:210});
    ingredients.push({idx:HUILES.findIndex(function(h){return h.nom.startsWith("Coco");}),poids:150});
    ingredients.push({idx:HUILES.findIndex(function(h){return h.nom==="Palme";}),poids:140});
  }
  ligneSelectionnee=null;
  document.getElementById("formPoids").value="";
  rendreTable();
  calculer();
}

function toutEffacer(){
  ingredients=[];
  ligneSelectionnee=null;
  document.getElementById("formPoids").value="";
  rendreTable();
  calculer();
}

document.addEventListener("DOMContentLoaded",function(){
  document.getElementById("dateJour").textContent=
    new Date().toLocaleDateString("fr-FR",{weekday:"long",year:"numeric",month:"long",day:"numeric"});
  ["typeBase","surgras","purete","eauPct","hePct"].forEach(function(id){
    document.getElementById(id).addEventListener("change",calculer);
  });
  document.getElementById("formHuile").addEventListener("change",afficherApercuHuile);
  remplirSelectForm();
  preset("basique");
});

"use strict";
var __mem={};
try{
  localStorage.setItem("__test","1");
  localStorage.removeItem("__test");
}catch(e){
  window.localStorage={
    getItem:function(k){return Object.prototype.hasOwnProperty.call(__mem,k)?__mem[k]:null;},
    setItem:function(k,v){__mem[k]=String(v);},
    removeItem:function(k){delete __mem[k];}
  };
}
window.addEventListener("error",function(ev){
  var b=document.getElementById("barreErreur");
  if(b){
    b.style.display="block";
    b.textContent="⚠ Erreur technique : "+(ev.message||"inconnue")+" — l'application continue en mode dégradé.";
  }
});
const CLE_COMPTES="cs_comptes", CLE_SESSION="cs_session", CLE_FOND="cs_fond", CLE_LOGO="cs_logo", CLE_TLOGO="cs_tlogo", CLE_MLOGO="cs_mlogo", CLE_PHOTOG="cs_photog", CLE_PHOTOD="cs_photod";
let modeLogin="connexion";

function lireJSON(cle){try{return JSON.parse(localStorage.getItem(cle));}catch(e){return null;}}

const CLES_SYNCHRO=["cs_projets","cs_profils","cs_eval","cs_huiles","cs_admin","cs_specialites","cs_photos"];
function synchroniserFichier(cle,v){
  if(CLES_SYNCHRO.indexOf(cle)<0)return;
  try{
    fetch("api/sauvegarde",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({cle:cle,donnees:v})}).catch(function(){});
  }catch(e){}
}
function ecrireJSON(cle,v){
  try{localStorage.setItem(cle,JSON.stringify(v));}catch(e){}
  synchroniserFichier(cle,v);
}
function chargerDonneesProjet(cb){
  try{
    fetch("api/donnees").then(function(r){return r.json();}).then(function(donnees){
      Object.keys(donnees).forEach(function(cle){try{localStorage.setItem(cle,JSON.stringify(donnees[cle]));}catch(e){}});
      cb(donnees);
    }).catch(function(){cb(null);});
  }catch(e){cb(null);}
}
function rafraichirToutesDonnees(){
  try{rendreProjets();}catch(e){}
  try{rendreProfils();}catch(e){}
  try{rendreEval();}catch(e){}
  try{majDatalistSpecs();}catch(e){}
  try{rendreSpecialites();}catch(e){}
  try{
    const hu=lireJSON("cs_huiles");
    if(Array.isArray(hu)&&hu.length){HUILES=HUILES_BASE.concat(hu);remplirSelectForm();}
  }catch(e){}
  try{rendreApercuPhotos();}catch(e){}
}
function listeComptes(){return lireJSON(CLE_COMPTES)||[];}
function erreurLogin(msg){document.getElementById("erreurLogin").textContent=msg;}

window.basculerOnglet=function(m){
  modeLogin=m;
  document.getElementById("ongletConnexion").classList.toggle("actif",m==="connexion");
  document.getElementById("ongletAdmin").classList.toggle("actif",m==="admin");
  const principal=(m!=="admin");
  document.getElementById("formPrincipal").style.display=principal?"block":"none";
  document.getElementById("formAdmin").style.display=principal?"none":"block";
  erreurLogin("");
  document.getElementById("erreurAdmin").textContent="";
  try{
    document.getElementById("admUser").value=lireAdmin().user;
  }catch(e){console.error(e);}
};

window.soumettreLogin=function(ev){
  ev.preventDefault();
  const tel=document.getElementById("logTel").value.replace(/[\s.\-]/g,"");
  const mdp=document.getElementById("logMdp").value;

  if(!tel||!mdp){erreurLogin("⚠ Veuillez remplir tous les champs.");return false;}
  if(!/^0[5-7][0-9]{8}$/.test(tel)){erreurLogin("⚠ Téléphone invalide (mobile algérien : 05, 06 ou 07 + 8 chiffres).");return false;}

  let c=listeProfils().find(function(x){return x.tel===tel;});
  if(!c){
    c=(lireJSON(CLE_COMPTES)||[]).find(function(x){return x.tel===tel;});
  }
  if(!c){erreurLogin("⚠ Aucun compte pour ce numéro. Contactez l'administrateur.");return false;}
  if(c.mdp!==mdp){erreurLogin("⚠ Mot de passe incorrect : saisissez les 4 derniers chiffres de votre numéro.");return false;}

  ecrireJSON(CLE_SESSION,{nom:c.nom,prenom:c.prenom,tel:c.tel,groupe:(c.groupe||""),sem:(c.sem||"")});
  ouvrirSession();
  return false;
};

const CLE_ADMIN="cs_admin";
function lireAdmin(){
  const a=lireJSON(CLE_ADMIN);
  return (a&&a.user)?a:{user:"Profdouadi",mdp:"08082012"};
}

window.reinitialiserAdmin=function(){
  if(!confirm("Rétablir les identifiants administrateur par défaut ?"))return;
  try{localStorage.removeItem(CLE_ADMIN);}catch(e){}
  ecrireJSON(CLE_ADMIN,{user:"Profdouadi",mdp:"08082012"});
  document.getElementById("admUser").value="";
  document.getElementById("admMdp").value="";
  document.getElementById("admMdp").focus();
  document.getElementById("erreurAdmin").textContent="✅ Identifiants administrateur réinitialisés.";
};

window.soumettreAdmin=function(ev){
  if(ev&&ev.preventDefault)ev.preventDefault();
  const u=(document.getElementById("admUser").value||"").trim().toLowerCase();
  const m=(document.getElementById("admMdp").value||"").trim();
  const ref=lireAdmin();
  if(!u||!m){
    document.getElementById("erreurAdmin").textContent="⚠ Veuillez saisir l'identifiant et le mot de passe.";
    return false;
  }
  if(u!==String(ref.user).trim().toLowerCase()||m!==String(ref.mdp).trim()){
    document.getElementById("erreurAdmin").textContent=
      "⚠ Identifiant ou mot de passe incorrect. Identifiant attendu : "+ref.user;
    return false;
  }
  ecrireJSON(CLE_SESSION,{admin:true,user:ref.user});
  ouvrirSession();
  return false;
};

window.changerInfosAdmin=function(){
  const cur=lireAdmin();
  const ident=document.getElementById("adminIdentifiant").value.trim();
  const anc=document.getElementById("adminAncien").value;
  const n1=document.getElementById("adminNouveau").value;
  const n2=document.getElementById("adminConfirme").value;
  const msg=document.getElementById("msgAdmin");
  if(anc!==cur.mdp){msg.textContent="⚠ Ancien mot de passe incorrect.";return;}
  if(!ident){msg.textContent="⚠ L'identifiant ne peut pas être vide.";return;}
  if(n1.length<6){msg.textContent="⚠ Le nouveau mot de passe doit contenir au moins 6 caractères.";return;}
  if(n1!==n2){msg.textContent="⚠ La confirmation ne correspond pas au nouveau mot de passe.";return;}
  ecrireJSON(CLE_ADMIN,{user:ident,mdp:n1});
  ["adminAncien","adminNouveau","adminConfirme"].forEach(function(id){document.getElementById(id).value="";});
  ecrireJSON(CLE_SESSION,{admin:true,user:ident});
  document.getElementById("texteUser").textContent="👑 Administrateur : "+ident;
  msg.textContent="✅ Identifiants administrateur mis à jour.";
};

function ouvrirSession(){
  const s=lireJSON(CLE_SESSION);
  if(!s)return;
  if(typeof s!=="object"||(!s.admin&&!s.prenom)){
    try{localStorage.removeItem(CLE_SESSION);}catch(e){}
    return;
  }
  document.body.classList.add("connecte");
  document.body.classList.toggle("admin",!!s.admin);
  document.getElementById("badgeUser").hidden=false;
  if(s.admin){
    document.getElementById("texteUser").textContent="👑 Administrateur : "+s.user;
    majOperateur({prenom:"Administrateur",nom:s.user,groupe:""});
    document.getElementById("blocAdminMdp").style.display="block";
    document.getElementById("adminIdentifiant").value=s.user;
  }else{
    document.getElementById("texteUser").textContent="👤 "+s.prenom+" "+s.nom+(s.groupe?" • Gr. "+s.groupe:"")+" • "+s.tel;
    majOperateur(s);
    document.getElementById("blocAdminMdp").style.display="none";
  }
}

function majOperateur(s){
  if(!s||typeof s!=="object"||!s.prenom)return;
  const op=document.getElementById("resOperateur");
  if(op)op.textContent=s.prenom+" "+s.nom.toUpperCase()+(s.groupe?" — Groupe "+s.groupe:"");
}

window.deconnexion=function(){
  try{localStorage.removeItem(CLE_SESSION);}catch(e){}
  document.body.classList.remove("connecte");
  document.body.classList.remove("admin");
  document.getElementById("badgeUser").hidden=true;
  document.getElementById("blocAdminMdp").style.display="none";
  document.getElementById("logMdp").value="";
  erreurLogin("");
};

function afficherPhoto(boiteId,src){
  document.getElementById(boiteId).innerHTML=src
    ?'<img src="'+src+'" alt="Photo">'
    :'<div class="photo-vide">📷<small>Ajouter une photo</small></div>';
}
window.supprimerPhoto=function(){
  try{localStorage.removeItem(CLE_LOGO);}catch(e){}
  afficherPhoto("boiteLogo",null);
};

function afficherMiniPhoto(boiteId,src){
  document.getElementById(boiteId).innerHTML=src
    ?'<img src="'+src+'" alt="Photo">'
    :'<div class="mini-ph-vide">📷</div>';
}

function appliquerTaille(cadreId,sliderId,valId,v){
  v=parseInt(v,10);
  if(isNaN(v))return;
  v=Math.min(Math.max(v,70),240);
  const c=document.getElementById(cadreId);
  if(!c)return;
  c.style.width=v+"px";
  c.style.height=v+"px";
  const s=document.getElementById(sliderId);
  if(s)s.value=v;
  const t=document.getElementById(valId);
  if(t)t.textContent=v;
}
window.changerTailleLogo=function(v){
  appliquerTaille("cadreLogo","tailleLogo","valTailleLogo",v);
  try{localStorage.setItem(CLE_TLOGO,String(v));}catch(e){}
};

function appliquerModele(cadreId,selectId,val){
  const c=document.getElementById(cadreId);
  if(!c)return;
  const valides=["arrondi","cercle","carre","ovale","hexagone","pilule"];
  if(valides.indexOf(val)<0)val="arrondi";
  c.className="cadre-media cadre-3d modele-"+val;
  const s=document.getElementById(selectId);
  if(s)s.value=val;
}
window.changerModele=function(val){
  appliquerModele("cadreLogo","modeleLogo",val);
  try{localStorage.setItem(CLE_MLOGO,val);}catch(e){}
};

function reduireImage(dataUrl,max,cb){
  const img=new Image();
  img.onload=function(){
    const r=Math.min(1,max/Math.max(img.width,img.height));
    if(r>=1){cb(dataUrl);return;}
    const cv=document.createElement("canvas");
    cv.width=Math.round(img.width*r);cv.height=Math.round(img.height*r);
    cv.getContext("2d").drawImage(img,0,0,cv.width,cv.height);
    cb(cv.toDataURL("image/png"));
  };
  img.src=dataUrl;
}
function chargerMedia(input,cle,boite){
  const f=input.files&&input.files[0];
  if(!f)return;
  const rd=new FileReader();
  rd.onload=function(ev){
    reduireImage(ev.target.result,480,function(d){
      try{localStorage.setItem(cle,d);}catch(e){}
      afficherPhoto(boite,d);
    });
  };
  rd.readAsDataURL(f);
}
function appliquerFond(c){
  document.documentElement.style.setProperty("--fond",c);
  document.getElementById("apercuFond").value=c;
}

window.imprimerResultats=function(){
  if(document.getElementById("blocResultats").style.display==="none"){
    alert("Veuillez d'abord saisir une recette avant d'imprimer.");
    return;
  }
  document.body.classList.add("impression-resultats");
  window.print();
  setTimeout(function(){document.body.classList.remove("impression-resultats");},400);
};

const CLE_PROFILS="cs_profils";
let profilSelectionne=null;

const CLE_SPECIALITES="cs_specialites";
const SPEC_DEFAUT=["Cosmétologie","Esthétique","Coiffure","Couture","Cuisine","Pâtisserie"];
let specSelectionnee=null;

function listeSpecialites(){
  let l=lireJSON(CLE_SPECIALITES);
  if(!Array.isArray(l)||l.length===0){l=SPEC_DEFAUT.slice();ecrireJSON(CLE_SPECIALITES,l);}
  return l;
}
function majDatalistSpecs(){
  const dl=document.getElementById("listeSpecs");
  if(!dl)return;
  dl.innerHTML=listeSpecialites().map(function(s){
    return '<option value="'+s.replace(/"/g,"&quot;")+'"></option>';
  }).join("");
}
function rendreSpecialites(){
  const box=document.getElementById("specsApercu");
  if(!box)return;
  box.innerHTML="";
  listeSpecialites().forEach(function(s,i){
    const b=document.createElement("button");
    b.type="button";
    b.className="chip-spec"+(i===specSelectionnee?" active":"");
    b.textContent=s;
    b.onclick=function(){selectionnerSpec(i);};
    box.appendChild(b);
  });
}
function selectionnerSpec(i){
  specSelectionnee=i;
  document.getElementById("specNom").value=listeSpecialites()[i]||"";
  rendreSpecialites();
}
window.ajouterSpec=function(){
  const nom=document.getElementById("specNom").value.trim();
  if(!nom){alert("Veuillez saisir le nom de la spécialité.");return;}
  const specs=listeSpecialites();
  if(specs.some(function(x){return x.toLowerCase()===nom.toLowerCase();})){alert("Cette spécialité existe déjà dans la liste.");return;}
  specs.push(nom);
  ecrireJSON(CLE_SPECIALITES,specs);
  specSelectionnee=specs.length-1;
  document.getElementById("specNom").value="";
  majDatalistSpecs();
  rendreSpecialites();
};
window.modifierSpec=function(){
  if(specSelectionnee===null){alert("Cliquez d'abord sur une spécialité dans la liste ci-dessous pour la sélectionner.");return;}
  const nom=document.getElementById("specNom").value.trim();
  if(!nom){alert("Veuillez saisir le nom de la spécialité.");return;}
  const specs=listeSpecialites();
  if(specs.some(function(x,i){return i!==specSelectionnee&&x.toLowerCase()===nom.toLowerCase();})){alert("Cette spécialité existe déjà dans la liste.");return;}
  specs[specSelectionnee]=nom;
  ecrireJSON(CLE_SPECIALITES,specs);
  majDatalistSpecs();
  rendreSpecialites();
};
window.supprimerSpec=function(){
  if(specSelectionnee===null){alert("Cliquez d'abord sur la spécialité à supprimer.");return;}
  const specs=listeSpecialites();
  if(!confirm("Supprimer la spécialité « "+specs[specSelectionnee]+" » ?"))return;
  specs.splice(specSelectionnee,1);
  ecrireJSON(CLE_SPECIALITES,specs);
  specSelectionnee=null;
  document.getElementById("specNom").value="";
  majDatalistSpecs();
  rendreSpecialites();
};

function listeProfils(){return lireJSON(CLE_PROFILS)||[];}

function viderFormulaireProfil(){
  ["proNom","proPrenom","proSpec","proTel","proMdp"].forEach(function(id){document.getElementById(id).value="";});
  document.getElementById("proSem").value="";
  document.getElementById("proGroupe").value="";
  effacerBrouillonProfil();
}

function lireFormulaireProfil(){
  const nom=document.getElementById("proNom").value.trim();
  const prenom=document.getElementById("proPrenom").value.trim();
  const spec=document.getElementById("proSpec").value.trim();
  const tel=document.getElementById("proTel").value.replace(/[\s.\-]/g,"");
  const sem=document.getElementById("proSem").value;
  const grp=document.getElementById("proGroupe").value;
  if(!nom||!prenom||!spec){alert("Veuillez remplir le nom, le prénom et la spécialité.");return null;}
  if(!sem){alert("Veuillez choisir le semestre (S1 à S5).");return null;}
  if(!grp){alert("Veuillez choisir le groupe (1 à 9).");return null;}
  if(!/^0[5-7][0-9]{8}$/.test(tel)){alert("Téléphone invalide (mobile algérien : 05, 06 ou 07 + 8 chiffres).");return null;}
  const mdp=document.getElementById("proMdp").value.replace(/\D/g,"").slice(0,4);
  return {nom:nom,prenom:prenom,spec:spec,tel:tel,sem:sem,groupe:grp,mdp:(mdp||tel.slice(-4))};
}

let groupeMarque=null;
function majFiltreSpec(){
  const sel=document.getElementById("filtreSpec");
  if(!sel)return;
  const cur=sel.value;
  const specs={};
  listeProfils().forEach(function(p){if(p.spec)specs[p.spec]=1;});
  listeSpecialites().forEach(function(s){if(s)specs[s]=1;});
  const cles=Object.keys(specs).sort(function(a,b){return a.localeCompare(b,"fr");});
  sel.innerHTML='<option value="">Toutes les spécialités</option>'+cles.map(function(s){
    return '<option value="'+s.replace(/"/g,"&quot;")+'">'+s+"</option>";
  }).join("");
  if(cur&&specs[cur])sel.value=cur;
}
function rendreProfils(){
  const tb=document.getElementById("corpsProfils");
  if(!tb){
    try{majDatalistSpecs();}catch(e){}
    try{majFiltreSpec();}catch(e){}
    try{remplirComboStagiaires();}catch(e){}
    try{remplirComboSpecFiche();}catch(e){}
    return;
  }
  tb.innerHTML="";
  majFiltreSpec();
  const profils=listeProfils();
  const fG=document.getElementById("filtreGroupe").value;
  const fP=document.getElementById("filtreSpec")?document.getElementById("filtreSpec").value:"";
  const fS=document.getElementById("filtreSem")?document.getElementById("filtreSem").value:"";
  const vus=[];
  profils.forEach(function(p,i){
    if(fG&&String(p.groupe||"")!==fG)return;
    if(fS&&p.sem!==fS)return;
    if(fP&&p.spec!==fP)return;
    vus.push(i);
  });
  vus.sort(function(a,b){
    const A=profils[a],B=profils[b];
    return (A.spec||"zzz").localeCompare(B.spec||"zzz","fr")
      ||(A.sem||"z").localeCompare(B.sem||"z","fr")
      ||String(A.groupe||"99").localeCompare(String(B.groupe||"99"),"fr",{numeric:true})
      ||(A.nom+" "+A.prenom).localeCompare(B.nom+" "+B.prenom,"fr");
  });
  vus.forEach(function(idx){
    const p=profils[idx];
    const tr=document.createElement("tr");
    if(idx===profilSelectionne||(groupeMarque&&groupeMarque.has(idx)))tr.className="ligne-active";
    tr.style.cursor="pointer";
    tr.onclick=function(){selectionnerProfil(idx);};
    tr.innerHTML="<td>"+(idx+1)+"</td><td>"+p.nom+"</td><td>"+p.prenom+"</td>"+
      "<td><b>"+(p.groupe||"—")+"</b></td>"+
      "<td><b>"+(p.sem||"—")+"</b></td><td>"+p.spec+"</td><td>"+p.tel+"</td>"+
      "<td><b style=\"font-family:monospace;\">"+p.mdp+"</b></td>";
    tb.appendChild(tr);
  });
  let crit="";
  if(fP)crit+="Spécialité : "+fP+" — ";
  if(fS)crit+="Semestre : "+fS+" — ";
  if(fG)crit+="Groupe : "+fG+" — ";
  document.getElementById("compteProfils").textContent=
    (crit?("["+crit.replace(/ — $/,"")+"] "+vus.length+" stagiaire(s) affiché(s). — "):"")+
    profils.length+(profils.length>1?" profils enregistrés.":" profil enregistré.");
  const st={g:{},s:{},p:{}};
  profils.forEach(function(p){
    const g=p.groupe||"—";st.g[g]=(st.g[g]||0)+1;
    const sm=p.sem||"—";st.s[sm]=(st.s[sm]||0)+1;
    const sp=p.spec||"—";st.p[sp]=(st.p[sp]||0)+1;
  });
  function ligneStats(obj,trieNum){
    return Object.keys(obj).sort(function(a,b){
      if(trieNum)return a.localeCompare(b,"fr",{numeric:true});
      return a.localeCompare(b,"fr");
    }).map(function(k){return k+" : "+obj[k];}).join(" • ")||"—";
  }
  const el=document.getElementById("statsGroupes");
  if(el)el.innerHTML=
    "<b>Effectif :</b> "+profils.length+" / 80 stagiaires<br>"+
    "<b>Par spécialité :</b> "+ligneStats(st.p,false)+"<br>"+
    "<b>Par semestre :</b> "+ligneStats(st.s,true)+"<br>"+
    "<b>Par groupe :</b> "+ligneStats(st.g,true);
}
window.selectionnerGroupeFiltre=function(){
  const filtre=document.getElementById("filtreGroupe").value;
  if(!filtre){alert("Choisissez d'abord un groupe dans la liste « Organiser / filtrer ».");return;}
  const profils=listeProfils();
  groupeMarque=new Set(profils.map(function(p,i){return String(p.groupe||"")===filtre?i:-1;}).filter(function(x){return x>=0;}));
  if(groupeMarque.size===0){alert("Aucun stagiaire dans le groupe "+filtre+".");groupeMarque=null;}
  rendreProfils();
};

function selectionnerProfil(i){
  profilSelectionne=i;
  const p=listeProfils()[i];
  document.getElementById("proNom").value=p.nom;
  document.getElementById("proPrenom").value=p.prenom;
  document.getElementById("proSpec").value=p.spec;
  document.getElementById("proTel").value=p.tel;
  document.getElementById("proSem").value=p.sem||"";
  document.getElementById("proGroupe").value=p.groupe||"";
  document.getElementById("proMdp").value=p.mdp||"";
  sauvegardeAutoProfil();
  rendreProfils();
}

window.ajouterProfil=function(){
  const v=lireFormulaireProfil();
  if(!v)return;
  const profils=listeProfils();
  if(profils.length>=80){alert("Capacité maximale atteinte : 80 stagiaires.");return;}
  if(profils.some(function(x){return x.tel===v.tel;})){alert("Ce numéro existe déjà dans la liste.");return;}
  profils.push(v);
  ecrireJSON(CLE_PROFILS,profils);
  profilSelectionne=profils.length-1;
  viderFormulaireProfil();
  rendreProfils();
};

window.modifierProfil=function(){
  if(profilSelectionne===null){alert("Cliquez d'abord sur une ligne du tableau pour la sélectionner.");return;}
  const v=lireFormulaireProfil();
  if(!v)return;
  const profils=listeProfils();
  if(profils.some(function(x,i){return x.tel===v.tel&&i!==profilSelectionne;})){alert("Ce numéro est déjà utilisé par un autre profil.");return;}
  profils[profilSelectionne]=v;
  ecrireJSON(CLE_PROFILS,profils);
  rendreProfils();
};

window.supprimerProfil=function(){
  if(profilSelectionne===null){alert("Cliquez d'abord sur une ligne du tableau pour la sélectionner.");return;}
  if(!confirm("Supprimer ce profil ?"))return;
  const profils=listeProfils();
  profils.splice(profilSelectionne,1);
  ecrireJSON(CLE_PROFILS,profils);
  profilSelectionne=null;
  viderFormulaireProfil();
  rendreProfils();
};

const CLE_DRAFT_PROFIL="cs_draft_profil";
const CLE_AUTOSAVE_PROFIL="cs_autosave_profil";
let autoSauvegardeProfilActive=true;
try{autoSauvegardeProfilActive=localStorage.getItem(CLE_AUTOSAVE_PROFIL)!=="0";}catch(e){}

function effacerBrouillonProfil(){try{localStorage.removeItem(CLE_DRAFT_PROFIL);}catch(e){}}

function majInfoAutoSauvegardeProfil(){
  const bouton=document.getElementById("btnAutoSauvegardeProfil");
  const info=document.getElementById("autoSauvInfoProfil");
  const bar=bouton?bouton.closest(".autosave-bar"):null;
  if(bouton){
    bouton.textContent=autoSauvegardeProfilActive
      ?"💾 Sauvegarde automatique — Activée"
      :"💾 Sauvegarde automatique — Désactivée";
    bouton.classList.toggle("off",!autoSauvegardeProfilActive);
  }
  if(bar)bar.classList.toggle("off",!autoSauvegardeProfilActive);
  if(info){
    info.textContent=autoSauvegardeProfilActive
      ?"Vos modifications sont enregistrées automatiquement sur cet ordinateur."
      :"Sauvegarde automatique désactivée : pensez à cliquer sur « Ajouter » ou « Modifier » pour enregistrer.";
  }
}

function sauvegardeAutoProfil(){
  if(!autoSauvegardeProfilActive)return;
  if(!document.getElementById("proNom"))return;
  const rec={
    nom:document.getElementById("proNom").value.trim(),
    prenom:document.getElementById("proPrenom").value.trim(),
    spec:document.getElementById("proSpec").value.trim(),
    tel:document.getElementById("proTel").value.replace(/[\s.\-]/g,""),
    sem:document.getElementById("proSem").value,
    groupe:document.getElementById("proGroupe").value,
    mdp:document.getElementById("proMdp").value.replace(/\D/g,"").slice(0,4),
    sauvegardeAuto:heureCourante()
  };
  try{localStorage.setItem(CLE_DRAFT_PROFIL,JSON.stringify(rec));}catch(e){}
  if(profilSelectionne!==null){
    const profils=listeProfils();
    if(profils[profilSelectionne]&&rec.tel){
      profils[profilSelectionne].nom=rec.nom;
      profils[profilSelectionne].prenom=rec.prenom;
      profils[profilSelectionne].spec=rec.spec;
      profils[profilSelectionne].tel=rec.tel;
      profils[profilSelectionne].sem=rec.sem;
      profils[profilSelectionne].groupe=rec.groupe;
      profils[profilSelectionne].mdp=(rec.mdp||rec.tel.slice(-4));
      ecrireJSON(CLE_PROFILS,profils);
      rendreProfils();
    }
  }
  const info=document.getElementById("autoSauvInfoProfil");
  if(info)info.textContent="💾 Enregistré automatiquement à "+rec.sauvegardeAuto+".";
}

window.basculerAutoSauvegardeProfil=function(){
  autoSauvegardeProfilActive=!autoSauvegardeProfilActive;
  try{localStorage.setItem(CLE_AUTOSAVE_PROFIL,autoSauvegardeProfilActive?"1":"0");}catch(e){}
  majInfoAutoSauvegardeProfil();
  if(autoSauvegardeProfilActive)sauvegardeAutoProfil();
};

function restaurerBrouillonProfil(){
  if(!autoSauvegardeProfilActive)return;
  if(!document.getElementById("proNom"))return;
  let b=null;
  try{b=JSON.parse(localStorage.getItem(CLE_DRAFT_PROFIL));}catch(e){}
  if(!b)return;
  document.getElementById("proNom").value=b.nom||"";
  document.getElementById("proPrenom").value=b.prenom||"";
  document.getElementById("proSpec").value=b.spec||"";
  document.getElementById("proTel").value=b.tel||"";
  document.getElementById("proSem").value=b.sem||"";
  document.getElementById("proGroupe").value=b.groupe||"";
  document.getElementById("proMdp").value=b.mdp||"";
}

function initAutoSauvegardeProfil(){
  majInfoAutoSauvegardeProfil();
  ["proNom","proPrenom","proSpec","proSem","proGroupe","proTel","proMdp"].forEach(function(id){
    const el=document.getElementById(id);
    if(el){el.addEventListener("input",sauvegardeAutoProfil);el.addEventListener("change",sauvegardeAutoProfil);}
  });
  restaurerBrouillonProfil();
}

window.sauvegarderProfils=function(){
  const profils=listeProfils();
  const specs=listeSpecialites();
  ecrireJSON(CLE_PROFILS,profils);
  ecrireJSON(CLE_SPECIALITES,specs);
  sauvegardeAutoProfil();
  majDatalistSpecs();
  rendreSpecialites();
  const msg=document.getElementById("msgSauvegardeProfils");
  if(msg)msg.textContent="💾 "+profils.length+" profil(s) et "+specs.length+" spécialité(s) enregistrés à "+heureCourante()+".";
};

function rendrFiche(){
  try{majDatalistSpecs();}catch(e){}
  try{remplirComboStagiaires();}catch(e){}
  try{remplirComboSpecFiche();}catch(e){}
  try{rendreProfils();}catch(e){}
}
function specCombosRefresh(){
  rendrFiche();
}

let ficStagiaireSelection=null;

function viderFicheStagiaire(){
  ["ficNom","ficPrenom","ficSpec","ficTel","ficMdp"].forEach(function(id){document.getElementById(id).value="";});
  document.getElementById("ficSem").value="";
  document.getElementById("ficGroupe").value="";
  ficStagiaireSelection=null;
  const sel=document.getElementById("ficStagiaireSelect");
  if(sel)sel.value="";
}

function lireFicheStagiaire(){
  const nom=document.getElementById("ficNom").value.trim();
  const prenom=document.getElementById("ficPrenom").value.trim();
  const spec=document.getElementById("ficSpec").value.trim();
  const tel=document.getElementById("ficTel").value.replace(/[\s.\-]/g,"");
  const sem=document.getElementById("ficSem").value;
  const grp=document.getElementById("ficGroupe").value;
  if(!nom||!prenom||!spec){alert("Fiche stagiaire : veuillez remplir le nom, le prénom et la spécialité.");return null;}
  if(!sem){alert("Fiche stagiaire : choisissez le semestre (S1 à S5).");return null;}
  if(!grp){alert("Fiche stagiaire : choisissez le groupe (1 à 10).");return null;}
  if(!/^0[5-7][0-9]{8}$/.test(tel)){alert("Téléphone invalide (mobile algérien : 05, 06 ou 07 + 8 chiffres).");return null;}
  const mdp=document.getElementById("ficMdp").value.replace(/\D/g,"").slice(0,4);
  return {nom:nom,prenom:prenom,spec:spec,tel:tel,sem:sem,groupe:grp,mdp:(mdp||tel.slice(-4))};
}

function remplirComboStagiaires(){
  const sel=document.getElementById("ficStagiaireSelect");
  if(!sel)return;
  const profils=listeProfils();
  const avant=sel.value;
  sel.innerHTML='<option value="">— Choisir un stagiaire —</option>'+profils.map(function(p,i){
    return '<option value="'+i+'">'+p.prenom+' '+p.nom+' — Gr. '+(p.groupe||"—")+' • '+(p.sem||"—")+' • '+p.spec+'</option>';
  }).join("");
  if(avant&&profils[parseInt(avant,10)])sel.value=avant;
}

window.chargerStagiaireFiche=function(){
  const sel=document.getElementById("ficStagiaireSelect");
  const idx=parseInt(sel.value,10);
  if(isNaN(idx)||idx<0){viderFicheStagiaire();return;}
  const p=listeProfils()[idx];
  if(!p)return;
  document.getElementById("ficNom").value=p.nom;
  document.getElementById("ficPrenom").value=p.prenom;
  document.getElementById("ficSpec").value=p.spec;
  document.getElementById("ficTel").value=p.tel;
  document.getElementById("ficSem").value=p.sem||"";
  document.getElementById("ficGroupe").value=p.groupe||"";
  document.getElementById("ficMdp").value=p.mdp||"";
  ficStagiaireSelection=idx;
};

window.ajouterStagiaireFiche=function(){
  const v=lireFicheStagiaire();
  if(!v)return;
  const profils=listeProfils();
  if(profils.length>=80){alert("Capacité maximale atteinte : 80 stagiaires.");return;}
  if(profils.some(function(x){return x.tel===v.tel;})){alert("Ce numéro existe déjà dans la liste.");return;}
  profils.push(v);
  ecrireJSON(CLE_PROFILS,profils);
  ficStagiaireSelection=profils.length-1;
  viderFicheStagiaire();
  rendrFiche();
  document.getElementById("msgFicheStagiaire").textContent="✅ Stagiaire ajouté à "+heureCourante()+".";
};

window.modifierStagiaireFiche=function(){
  if(ficStagiaireSelection===null){alert("Choisissez d'abord un stagiaire dans la liste ci-dessus.");return;}
  const v=lireFicheStagiaire();
  if(!v)return;
  const profils=listeProfils();
  if(profils.some(function(x,i){return x.tel===v.tel&&i!==ficStagiaireSelection;})){alert("Ce numéro est déjà utilisé par un autre stagiaire.");return;}
  profils[ficStagiaireSelection]=v;
  ecrireJSON(CLE_PROFILS,profils);
  rendrFiche();
  document.getElementById("msgFicheStagiaire").textContent="✅ Stagiaire modifié à "+heureCourante()+".";
};

window.supprimerStagiaireFiche=function(){
  if(ficStagiaireSelection===null){alert("Choisissez d'abord un stagiaire dans la liste ci-dessus.");return;}
  const profils=listeProfils();
  if(!confirm("Supprimer ce stagiaire ?"))return;
  profils.splice(ficStagiaireSelection,1);
  ecrireJSON(CLE_PROFILS,profils);
  viderFicheStagiaire();
  rendrFiche();
  document.getElementById("msgFicheStagiaire").textContent="✅ Stagiaire supprimé.";
};

function remplirComboSpecFiche(){
  const sel=document.getElementById("ficSpecSelect");
  if(!sel)return;
  sel.innerHTML='<option value="">— Choisir —</option>'+listeSpecialites().map(function(s,i){
    return '<option value="'+i+'">'+s.replace(/"/g,"&quot;")+"</option>";
  }).join("");
}

window.chargerSpecFiche=function(){
  const sel=document.getElementById("ficSpecSelect");
  const idx=parseInt(sel.value,10);
  const specs=listeSpecialites();
  document.getElementById("ficSpecManage").value=(!isNaN(idx)&&specs[idx])?specs[idx]:"";
};

window.ajouterSpecFiche=function(){
  const nom=document.getElementById("ficSpecManage").value.trim();
  if(!nom){alert("Saisissez le nom de la spécialité.");return;}
  const specs=listeSpecialites();
  if(specs.some(function(x){return x.toLowerCase()===nom.toLowerCase();})){alert("Cette spécialité existe déjà.");return;}
  specs.push(nom);
  ecrireJSON(CLE_SPECIALITES,specs);
  document.getElementById("ficSpecManage").value="";
  specCombosRefresh();
  document.getElementById("msgFicheSpec").textContent="✅ Spécialité ajoutée.";
};

window.modifierSpecFiche=function(){
  const sel=document.getElementById("ficSpecSelect");
  const idx=parseInt(sel.value,10);
  const specs=listeSpecialites();
  if(isNaN(idx)||idx<0||!specs[idx]){alert("Choisissez d'abord une spécialité dans la liste.");return;}
  const nom=document.getElementById("ficSpecManage").value.trim();
  if(!nom){alert("Saisissez le nouveau nom.");return;}
  if(specs.some(function(x,i){return i!==idx&&x.toLowerCase()===nom.toLowerCase();})){alert("Cette spécialité existe déjà.");return;}
  specs[idx]=nom;
  ecrireJSON(CLE_SPECIALITES,specs);
  document.getElementById("ficSpecManage").value="";
  document.getElementById("ficSpecSelect").value="";
  specCombosRefresh();
  document.getElementById("msgFicheSpec").textContent="✅ Spécialité modifiée.";
};

window.supprimerSpecFiche=function(){
  const sel=document.getElementById("ficSpecSelect");
  const idx=parseInt(sel.value,10);
  const specs=listeSpecialites();
  if(isNaN(idx)||idx<0||!specs[idx]){alert("Choisissez d'abord la spécialité à supprimer.");return;}
  if(!confirm("Supprimer la spécialité « "+specs[idx]+" » ?"))return;
  specs.splice(idx,1);
  ecrireJSON(CLE_SPECIALITES,specs);
  document.getElementById("ficSpecManage").value="";
  document.getElementById("ficSpecSelect").value="";
  specCombosRefresh();
  document.getElementById("msgFicheSpec").textContent="✅ Spécialité supprimée.";
};

const CLE_PROJETS="cs_projets";
let projetSelectionne=null;

function listeProjets(){return lireJSON(CLE_PROJETS)||[];}

let prjPhotosCourantes=[];
let prjPhotoRemplace=-1;

function rendreApercuPhotos(){
  const ap=document.getElementById("prjPhotosApercu");
  ap.innerHTML="";
  prjPhotosCourantes.forEach(function(src,i){
    const d=document.createElement("div");
    d.style.cssText="position:relative;width:64px;height:64px;";
    d.innerHTML="<img src='"+src+"' alt='' style='width:100%;height:100%;object-fit:cover;border-radius:8px;box-shadow:0 3px 8px rgba(0,0,0,.25);'>"
      +"<button type='button' title='Supprimer' onclick='supprimerPhotoProjet("+i+")' style='position:absolute;top:-6px;right:-6px;width:20px;height:20px;border:none;border-radius:50%;background:#c0392b;color:#fff;font-size:.7em;cursor:pointer;'>✖</button>"
      +"<button type='button' title='Modifier' onclick='remplacerPhotoProjet("+i+")' style='position:absolute;bottom:-6px;right:-6px;width:20px;height:20px;border:none;border-radius:50%;background:#2980b9;color:#fff;font-size:.7em;cursor:pointer;'>✎</button>";
    ap.appendChild(d);
  });
  document.getElementById("prjPhotosInfo").textContent=
    prjPhotosCourantes.length===0?"Aucune photo":prjPhotosCourantes.length+" photo(s) sur 3";
}
window.supprimerPhotoProjet=function(i){
  prjPhotosCourantes.splice(i,1);
  rendreApercuPhotos();
  sauvegardeAuto();
};
window.remplacerPhotoProjet=function(i){
  prjPhotoRemplace=i;
  document.getElementById("prjPhotos").click();
};
function traiterFichiersPhotos(files){
  Array.prototype.forEach.call(files,function(f){
    if(!f||!f.type||f.type.indexOf("image")!==0)return;
    if(prjPhotosCourantes.length>=10&&prjPhotoRemplace<0){alert("Maximum 10 photos par projet.");return;}
    const rd=new FileReader();
    rd.onload=function(ev){
      reduireImage(ev.target.result,480,function(d){
        if(prjPhotoRemplace>=0){prjPhotosCourantes[prjPhotoRemplace]=d;prjPhotoRemplace=-1;}
        else if(prjPhotosCourantes.length<10){prjPhotosCourantes.push(d);}
        rendreApercuPhotos();
        sauvegardeAuto();
      });
    };
    rd.readAsDataURL(f);
  });
}

function viderFormulaireProjet(){
  ["prjTitre","prjObjectif","prjEncadrant","prjDesc"].forEach(function(id){document.getElementById(id).value="";});
  prjPhotosCourantes=[];
  prjPhotoRemplace=-1;
  effacerBrouillon();
  rendreApercuPhotos();
}

function lireFormulaireProjet(){
  const titre=document.getElementById("prjTitre").value.trim();
  const objectif=document.getElementById("prjObjectif").value.trim();
  if(!titre){alert("Veuillez remplir le titre du projet.");return null;}
  if(!objectif){alert("Veuillez remplir l'objectif du projet.");return null;}
  return {
    titre:titre,objectif:objectif,
    encadrant:document.getElementById("prjEncadrant").value.trim(),
    desc:document.getElementById("prjDesc").value.trim(),
    photos:prjPhotosCourantes.slice()
  };
}

function rendreProjets(){
  const tb=document.getElementById("corpsProjets");
  tb.innerHTML="";
  const projets=listeProjets();
  projets.forEach(function(p,i){
    const tr=document.createElement("tr");
    if(i===projetSelectionne)tr.className="ligne-active";
    tr.style.cursor="pointer";
    tr.onclick=function(){selectionnerProjet(i);};
    tr.innerHTML="<td>"+(i+1)+"</td><td>"+p.titre+"</td>"+
      "<td style='text-align:left;font-size:.85em;'>"+((p.objectif&&p.objectif.length>46)?p.objectif.slice(0,46)+"…":(p.objectif||"—"))+"</td>"+
      "<td>"+(p.encadrant||"—")+"</td>";
    tb.appendChild(tr);
  });
  document.getElementById("compteProjets").textContent=
    projets.length+(projets.length>1?" projets enregistrés.":" projet enregistré.");
}

function selectionnerProjet(i){
  projetSelectionne=i;
  const p=listeProjets()[i];
  document.getElementById("prjTitre").value=p.titre;
  document.getElementById("prjObjectif").value=p.objectif||"";
  document.getElementById("prjEncadrant").value=p.encadrant||"";
  prjPhotosCourantes=(p.photos||[]).slice();
  prjPhotoRemplace=-1;
  rendreApercuPhotos();
  document.getElementById("prjDesc").value=p.desc||"";
  sauvegardeAuto();
  rendreProjets();
}

window.ajouterProjet=function(){
  const v=lireFormulaireProjet();
  if(!v)return;
  const projets=listeProjets();
  projets.push(v);
  ecrireJSON(CLE_PROJETS,projets);
  projetSelectionne=projets.length-1;
  viderFormulaireProjet();
  rendreProjets();
};

window.modifierProjet=function(){
  if(projetSelectionne===null){alert("Cliquez d'abord sur une ligne du tableau pour la sélectionner.");return;}
  const v=lireFormulaireProjet();
  if(!v)return;
  const projets=listeProjets();
  projets[projetSelectionne]=v;
  ecrireJSON(CLE_PROJETS,projets);
  rendreProjets();
};

window.supprimerProjet=function(){
  if(projetSelectionne===null){alert("Cliquez d'abord sur une ligne du tableau pour la sélectionner.");return;}
  if(!confirm("Supprimer ce projet ?"))return;
  const projets=listeProjets();
  projets.splice(projetSelectionne,1);
  ecrireJSON(CLE_PROJETS,projets);
  projetSelectionne=null;
  viderFormulaireProjet();
  rendreProjets();
};

window.imprimerProjets=function(){
  if(listeProjets().length===0){alert("Aucun projet à imprimer.");return;}
  document.body.classList.add("impression-projets");
  window.print();
  setTimeout(function(){document.body.classList.remove("impression-projets");},400);
};

const CLE_DRAFT="cs_draft";
const CLE_AUTOSAVE="cs_autosave";
let autoSauvegardeActive=true;
try{autoSauvegardeActive=localStorage.getItem(CLE_AUTOSAVE)!=="0";}catch(e){}

function heureCourante(){
  return new Date().toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit",second:"2-digit"});
}
function lireBrouillon(){try{return JSON.parse(localStorage.getItem(CLE_DRAFT));}catch(e){return null;}}
function effacerBrouillon(){try{localStorage.removeItem(CLE_DRAFT);}catch(e){}}

function majInfoAutoSauvegarde(){
  const bouton=document.getElementById("btnAutoSauvegarde");
  const info=document.getElementById("autoSauvInfo");
  const bar=bouton?bouton.closest(".autosave-bar"):null;
  if(bouton){
    bouton.textContent=autoSauvegardeActive
      ?"💾 Sauvegarde automatique — Activée"
      :"💾 Sauvegarde automatique — Désactivée";
    bouton.classList.toggle("off",!autoSauvegardeActive);
  }
  if(bar)bar.classList.toggle("off",!autoSauvegardeActive);
  if(info){
    info.textContent=autoSauvegardeActive
      ?"Vos modifications sont enregistrées automatiquement sur cet ordinateur."
      :"Sauvegarde automatique désactivée : pensez à cliquer sur « Ajouter » ou « Modifier » pour enregistrer.";
  }
}

function sauvegardeAuto(){
  if(!autoSauvegardeActive)return;
  const rec={
    titre:document.getElementById("prjTitre").value.trim(),
    objectif:document.getElementById("prjObjectif").value.trim(),
    encadrant:document.getElementById("prjEncadrant").value.trim(),
    desc:document.getElementById("prjDesc").value.trim(),
    photos:prjPhotosCourantes.slice(),
    sauvegardeAuto:heureCourante()
  };
  try{localStorage.setItem(CLE_DRAFT,JSON.stringify(rec));}catch(e){}
  if(projetSelectionne!==null){
    const projets=listeProjets();
    if(projets[projetSelectionne]){
      projets[projetSelectionne].titre=rec.titre;
      projets[projetSelectionne].objectif=rec.objectif;
      projets[projetSelectionne].encadrant=rec.encadrant;
      projets[projetSelectionne].desc=rec.desc;
      projets[projetSelectionne].photos=rec.photos;
      ecrireJSON(CLE_PROJETS,projets);
      rendreProjets();
    }
  }
  const info=document.getElementById("autoSauvInfo");
  if(info)info.textContent="💾 Enregistré automatiquement à "+rec.sauvegardeAuto+".";
}

window.basculerAutoSauvegarde=function(){
  autoSauvegardeActive=!autoSauvegardeActive;
  try{localStorage.setItem(CLE_AUTOSAVE,autoSauvegardeActive?"1":"0");}catch(e){}
  majInfoAutoSauvegarde();
  if(autoSauvegardeActive)sauvegardeAuto();
};

function restaurerBrouillon(){
  if(!autoSauvegardeActive)return;
  const b=lireBrouillon();
  if(!b)return;
  document.getElementById("prjTitre").value=b.titre||"";
  document.getElementById("prjObjectif").value=b.objectif||"";
  document.getElementById("prjEncadrant").value=b.encadrant||"";
  document.getElementById("prjDesc").value=b.desc||"";
  prjPhotosCourantes=(b.photos||[]).slice();
  prjPhotoRemplace=-1;
  rendreApercuPhotos();
}

function initAutoSauvegarde(){
  majInfoAutoSauvegarde();
  ["prjTitre","prjObjectif","prjEncadrant","prjDesc"].forEach(function(id){
    const el=document.getElementById(id);
    if(el){el.addEventListener("input",sauvegardeAuto);el.addEventListener("change",sauvegardeAuto);}
  });
  restaurerBrouillon();
}

const CLE_EVAL="cs_eval";
let evalSelectionne=null;
const EVAL_DEFAUT=[
  {nom:"Dureté et fermeté du savon",max:3,note:0},
  {nom:"Pouvoir moussant",max:3,note:0},
  {nom:"Stabilité de la mousse",max:2,note:0},
  {nom:"Pouvoir nettoyant",max:3,note:0},
  {nom:"Douceur pour la peau",max:3,note:0},
  {nom:"Aspect, couleur et fini",max:2,note:0},
  {nom:"Odeur / parfum",max:2,note:0},
  {nom:"Temps de séchage (cure)",max:2,note:0}
];

function listeEval(){
  let l=lireJSON(CLE_EVAL);
  if(!Array.isArray(l)||l.length===0){l=EVAL_DEFAUT.map(function(c){return{nom:c.nom,max:c.max,note:0};});ecrireJSON(CLE_EVAL,l);}
  return l;
}

function appreciation(pct){
  if(pct>=85)return "Très bien";
  if(pct>=70)return "Bien";
  if(pct>=50)return "Moyen";
  return "Insuffisant";
}

function rendreEval(){
  const tb=document.getElementById("corpsEval");
  tb.innerHTML="";
  const crits=listeEval();
  crits.forEach(function(c,i){
    const tr=document.createElement("tr");
    if(i===evalSelectionne)tr.className="ligne-active";
    tr.style.cursor="pointer";
    tr.onclick=function(){selectionnerCritere(i);};
    tr.innerHTML="<td style='text-align:left;'>"+(i+1)+" — "+c.nom+"</td><td>/ "+c.max+"</td>"+
      "<td><input type='number' class='note-eval' value='"+c.note+"' min='0' max='"+c.max+"' step='0.25' onclick='event.stopPropagation()' oninput='majNote("+i+",this.value)'></td>"+
      "<td class='app-eval'>"+appreciation(c.max?c.note/c.max*100:0)+"</td>";
    tb.appendChild(tr);
  });
  const maxTotal=crits.reduce(function(s,c){return s+c.max;},0);
  const total=crits.reduce(function(s,c){return s+c.note;},0);
  const sur100=maxTotal?Math.round(total/maxTotal*100):0;
  document.getElementById("totalSur20").textContent=total+" / "+maxTotal;
  document.getElementById("totalSur100").textContent=sur100+" / 100";
  document.getElementById("mentionEval").innerHTML="<b>Mention :</b> "+appreciation(sur100)+" — "+sur100+"/100";
}

function selectionnerCritere(i){
  evalSelectionne=i;
  const c=listeEval()[i];
  document.getElementById("evCritNom").value=c.nom;
  document.getElementById("evCritMax").value=c.max;
  rendreEval();
}

window.majNote=function(i,v){
  const crits=listeEval();
  let n=parseFloat(v);
  if(isNaN(n))n=0;
  n=Math.min(Math.max(n,0),crits[i].max);
  crits[i].note=n;
  ecrireJSON(CLE_EVAL,crits);
  const tr=document.getElementById("corpsEval").children[i];
  tr.children[3].textContent=appreciation(crits[i].max?n/crits[i].max*100:0);
  calculerTotaux();
};
function calculerTotaux(){
  const crits=listeEval();
  const maxTotal=crits.reduce(function(s,c){return s+c.max;},0);
  const total=crits.reduce(function(s,c){return s+c.note;},0);
  const sur100=maxTotal?Math.round(total/maxTotal*100):0;
  document.getElementById("totalSur20").textContent=total+" / "+maxTotal;
  document.getElementById("totalSur100").textContent=sur100+" / 100";
  document.getElementById("mentionEval").innerHTML="<b>Mention :</b> "+appreciation(sur100)+" — "+sur100+"/100";
}
window.ajouterCritere=function(){
  const nom=document.getElementById("evCritNom").value.trim();
  let max=parseFloat(document.getElementById("evCritMax").value);
  if(!nom){alert("Veuillez saisir le nom du critère.");return;}
  if(isNaN(max)||max<=0||max>20){alert("Barème invalide (entre 0,5 et 20).");return;}
  const crits=listeEval();
  crits.push({nom:nom,max:max,note:0});
  ecrireJSON(CLE_EVAL,crits);
  document.getElementById("evCritNom").value="";
  evalSelectionne=crits.length-1;
  rendreEval();
};
window.modifierCritere=function(){
  if(evalSelectionne===null){alert("Cliquez d'abord sur une ligne du tableau pour la sélectionner.");return;}
  const nom=document.getElementById("evCritNom").value.trim();
  let max=parseFloat(document.getElementById("evCritMax").value);
  if(!nom){alert("Veuillez saisir le nom du critère.");return;}
  if(isNaN(max)||max<=0||max>20){alert("Barème invalide (entre 0,5 et 20).");return;}
  const crits=listeEval();
  crits[evalSelectionne].nom=nom;
  crits[evalSelectionne].max=max;
  if(crits[evalSelectionne].note>max)crits[evalSelectionne].note=max;
  ecrireJSON(CLE_EVAL,crits);
  rendreEval();
};
window.supprimerCritere=function(){
  if(evalSelectionne===null){alert("Cliquez d'abord sur une ligne du tableau pour la sélectionner.");return;}
  const crits=listeEval();
  if(crits.length<=1){alert("La grille doit contenir au moins un critère.");return;}
  if(!confirm("Supprimer ce critère ?"))return;
  crits.splice(evalSelectionne,1);
  ecrireJSON(CLE_EVAL,crits);
  evalSelectionne=null;
  document.getElementById("evCritNom").value="";
  rendreEval();
};
window.toutZeroEval=function(){
  const crits=listeEval();
  crits.forEach(function(c){c.note=0;});
  ecrireJSON(CLE_EVAL,crits);
  rendreEval();
};
window.viderEval=function(){
  ["evaSavon","evaApprenant","evaGroupe"].forEach(function(id){document.getElementById(id).value="";});
  toutZeroEval();
};
window.imprimerEvaluation=function(){
  document.body.classList.add("impression-evaluation");
  window.print();
  setTimeout(function(){document.body.classList.remove("impression-evaluation");},400);
};

(function init(){
  let logo=null;try{logo=localStorage.getItem(CLE_LOGO);}catch(e){}
  afficherPhoto("boiteLogo",logo);
  let pg=null;try{pg=localStorage.getItem(CLE_PHOTOG);}catch(e){}
  afficherMiniPhoto("boitePhotoG",pg);
  let pd=null;try{pd=localStorage.getItem(CLE_PHOTOD);}catch(e){}
  afficherMiniPhoto("boitePhotoD",pd);

  let fond="#f4f6f4";try{fond=localStorage.getItem(CLE_FOND)||fond;}catch(e){}
  appliquerFond(fond);

  let tl=null;try{tl=localStorage.getItem(CLE_TLOGO);}catch(e){}
  if(tl)appliquerTaille("cadreLogo","tailleLogo","valTailleLogo",tl);

  let ml=null;try{ml=localStorage.getItem(CLE_MLOGO);}catch(e){}
  appliquerModele("cadreLogo","modeleLogo",ml||"arrondi");

  document.getElementById("apercuFond").addEventListener("input",function(){
    appliquerFond(this.value);
    try{localStorage.setItem(CLE_FOND,this.value);}catch(e){}
  });
  document.querySelectorAll(".swatch").forEach(function(s){
    s.addEventListener("click",function(){
      appliquerFond(this.dataset.fond);
      try{localStorage.setItem(CLE_FOND,this.dataset.fond);}catch(e){}
    });
  });
  document.getElementById("fichierLogo").addEventListener("change",function(){chargerMedia(this,CLE_LOGO,"boiteLogo");this.value="";});
  document.getElementById("fichierPhotoG").addEventListener("change",function(){chargerMedia(this,CLE_PHOTOG,"boitePhotoG");this.value="";});
  document.getElementById("fichierPhotoD").addEventListener("change",function(){chargerMedia(this,CLE_PHOTOD,"boitePhotoD");this.value="";});
  document.getElementById("prjPhotos").addEventListener("change",function(){traiterFichiersPhotos(this.files);this.value="";});
  rendreApercuPhotos();
  initAutoSauvegarde();
  initAutoSauvegardeProfil();
  majDatalistSpecs();
  rendreSpecialites();

  try{
    document.getElementById("formPrincipal").addEventListener("submit",soumettreLogin);
    document.getElementById("formAdmin").addEventListener("submit",soumettreAdmin);
  }catch(e){console.error(e);}

  const EFFET_TILT_ACTIVE=false;
  if(EFFET_TILT_ACTIVE&&window.matchMedia("(hover:hover)").matches){
    document.querySelectorAll(".carte").forEach(function(cart){
      if(cart.id==="blocProjets")return;
      cart.addEventListener("mousemove",function(ev){
        const r=cart.getBoundingClientRect();
        const dx=(ev.clientX-r.left)/r.width-.5;
        const dy=(ev.clientY-r.top)/r.height-.5;
        cart.style.transform="perspective(900px) rotateY("+(dx*5).toFixed(2)+"deg) rotateX("+(-dy*5).toFixed(2)+"deg)";
      });
      cart.addEventListener("mouseleave",function(){cart.style.transform="";});
    });
  }

  try{
    if(!lireJSON(CLE_ADMIN)){
      ecrireJSON(CLE_ADMIN,{user:"Profdouadi",mdp:"08082012"});
    }
  }catch(e){console.error(e);}

  function initTitre(){
  const el=document.querySelector(".titre-modifiable");
  if(!el)return;
  const v=localStorage.getItem("cs_titre");
  if(v)el.textContent=v;
  el.onclick=function(){
    const nv=prompt("Modifier le titre :",el.textContent);
    if(nv&&nv.trim()){el.textContent=nv.trim();try{localStorage.setItem("cs_titre",nv.trim());}catch(e){}}
  };
}
try{rendreProfils();rendreProjets();rendreEval();rendreApercuPhotos();initTitre();}catch(e){console.error(e);}
  chargerDonneesProjet(function(donnees){
    if(donnees&&Object.keys(donnees).length){rafraichirToutesDonnees();}
  });
  try{ouvrirSession();}
  catch(e){
    console.error(e);
    document.body.classList.add("connecte");
    document.body.classList.remove("admin");
  }
})();

const ETAPES_MINI_PROJET=[
  { titre:"ÉTAPE 1 — PLANIFICATION",     texte:"Définition du thème du mini-projet, des objectifs attendus, des ressources nécessaires (matériaux, outils, matières premières) et du planning de réalisation." },
  { titre:"ÉTAPE 2 — PRÉPARATION",       texte:"Préparation du poste de travail, réunion du matériel et de l'équipement, respect des consignes de sécurité et organisation des étapes de fabrication." },
  { titre:"ÉTAPE 3 — FABRICATION",       texte:"Réalisation pratique du produit : pesée des matières, mélange et transformation, suivi de la méthode et ajustements en fonction des résultats obtenus." },
  { titre:"ÉTAPE 4 — CONTRÔLE QUALITÉ",  texte:"Vérification des caractéristiques du produit fini : aspect, texture, stabilité et conformité au cahier des charges, avec correction des éventuels défauts." },
  { titre:"ÉTAPE 5 — VALORISATION",      texte:"Présentation et valorisation du mini-projet : emballage, étiquetage, mise en valeur du produit et restitution orale devant le formateur et le groupe." }
];
window.afficherEtapeMini=function(index,btn){
  const step=ETAPES_MINI_PROJET[index];
  if(!step)return;
  const fiche=btn?btn.closest(".fiche-mini-projet"):document.getElementById("ficheMiniProjetLogin");
  if(!fiche)return;
  const titre=fiche.querySelector(".mp-detail-titre");
  const texte=fiche.querySelector(".mp-detail-texte");
  if(titre)titre.textContent=step.titre;
  if(texte)texte.textContent=step.texte;
  fiche.querySelectorAll(".mp-step").forEach(function(s){s.classList.remove("active");});
  if(btn)btn.classList.add("active");
};
window.basculerFicheMiniProjet=function(id){
  const f=document.getElementById(id||"ficheMiniProjetLogin");
  if(!f)return;
  f.style.display=(f.style.display==="block")?"none":"block";
};
