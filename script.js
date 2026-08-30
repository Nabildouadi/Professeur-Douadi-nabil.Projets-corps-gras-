
        // --- DATA ---
        let mainT = localStorage.getItem('db_t') || "FABRICATION DE SAVON À BASE DE CITRONNELLE";
        let grData = JSON.parse(localStorage.getItem('db_g')) || [
            { comp: "Préparation", crit: "Poste de travail", n: ["Exc","Bien","Moy","Ins"], note: 0 },
            { comp: "Sécurité", crit: "Port des EPI", n: ["Respecté","Oublis","Peu respecté","Nul"], note: 0 }
        ];
        let stData = JSON.parse(localStorage.getItem('db_s')) || [];
        let oilData = JSON.parse(localStorage.getItem('db_oil')) || [
            { nom: "Huile d'Olive", sap: 0.134, koh: 0.188, ins: 109 },
            { nom: "Huile de Coco", sap: 0.190, koh: 0.266, ins: 258 },
            { nom: "Huile de Palme", sap: 0.141, koh: 0.198, ins: 145 },
            { nom: "Beurre de Karité", sap: 0.128, koh: 0.179, ins: 116 },
            { nom: "Huile de Ricin", sap: 0.128, koh: 0.180, ins: 95 },
            { nom: "Huile de Tournesol", sap: 0.134, koh: 0.188, ins: 63 },
            { nom: "Huile d'Amande Douce", sap: 0.139, koh: 0.195, ins: 97 },
            { nom: "Cire d'Abeille", sap: 0.069, koh: 0.097, ins: 84 }
        ];
        let recipe = JSON.parse(localStorage.getItem('db_recipe')) || [];
        let projData = JSON.parse(localStorage.getItem('db_pr')) || [];
        let projDetailIdx = -1;
        let projPhotoData = "";
        let projSteps = [];
        let projIngredients = [];
        let projMateriels = [];
        let sigIdx = -1;
        let sigData = [
            { l: "Filière / Spécialité", v: "Corps gras (Chimie industrielle)" },
            { l: "Module", v: "Fabrication de produits cosmétiques et savonnerie artisanale" },
            { l: "Niveau", v: "À adapter selon le public (stagiaires, apprenants, lycée technique)" },
            { l: "Durée", v: "2 heures (1 séance)" },
            { l: "Code compétence", v: "C – Fabriquer un savon glycériné aromatisé selon un cahier des charges" },
            { l: "Effectif", v: "Travail individuel ou en binôme (groupes de 10 à 16 apprenants)" }
        ];
        let mpIdx = -1;
        let mpData = [
            { n: "Base de savon glycérinée (« melt and pour »), transparente ou blanche", q: "500 g", o: "Découpée en cubes de 2 cm pour une fonte homogène" },
            { n: "Cannelle en poudre", q: "1 à 2 c. à café (≈ 6 g)", o: "Effet exfoliant doux et coloration naturelle brun-orangé" },
            { n: "Huile essentielle de cannelle (Cinnamomum verum)", q: "10 à 15 gouttes", o: "Dosage à respecter : irritante à forte concentration" },
            { n: "Huile végétale nourrissante (amande douce, olive…)", q: "1 c. à café (≈ 5 mL)", o: "Surgraissage : améliore le confort d'usage" },
            { n: "Colorant cosmétique (facultatif)", q: "Quelques gouttes / pincée", o: "Nuance ambrée, à ajouter progressivement" },
            { n: "Alcool à 70° (vaporisateur)", q: "Q.S.", o: "Élimine les bulles d'air en surface après coulage" }
        ];
        let mat2Idx = -1;
        let mat2Data = [
            "Bain-marie (ou four à micro-ondes)","Bécher ou récipient résistant à la chaleur","Spatule / agitateur","Moules à savon (silicone)","Balance de précision (± 0,1 g)","Vaporisateur d'alcool","Thermomètre de cuisine (0–100 °C)","Gants de protection thermique","Lunettes de protection","Blouse de laboratoire","Gants à usage unique (nitrile)","Fiche de sécurité des matières premières (FDS)"
        ];
        let opIdx = -1;
        let opData = [            "Préparer et vérifier le poste de travail : matériel, matières premières, EPI, fiche de suivi.",
            "Découper la base de savon glycérinée en petits cubes réguliers d'environ 2 cm.",
            "Faire fondre la base au bain-marie (ou par cycles courts au micro-ondes) en surveillant la température : ne pas dépasser 70 °C.",
            "Une fois la base entièrement liquide, retirer du feu et laisser tiédir légèrement (environ 55–60 °C).",
            "Incorporer la cannelle en poudre en remuant doucement pour obtenir une répartition homogène de la couleur et de la texture.",
            "Ajouter l'huile essentielle de cannelle et l'huile végétale de surgraissage, puis mélanger sans fouetter (pour limiter les bulles d'air).",
            "Vaporiser légèrement d'alcool à 70° la surface du mélange afin d'éliminer les bulles résiduelles.",
            "Couler le mélange dans les moules en silicone préalablement vaporisés d'alcool.",
            "Vaporiser à nouveau la surface, puis laisser refroidir à température ambiante pendant 1 à 2 heures (ou 30 minutes au réfrigérateur).",
            "Démouler délicatement le savon une fois durci et vérifier son aspect général.",
            "Nettoyer et ranger le poste de travail ; renseigner la fiche de suivi de fabrication."
        ];
        let grCompIdx = -1;
        let grCompData = JSON.parse(localStorage.getItem('db_gr_comp')) || [
            { comp: "C1 – Organisation du poste de travail", indic: "Poste préparé, matériel complet, tenue et EPI conformes avant le début du TP", bareme: "/2", note: "" },
            { comp: "C2 – Respect des règles d'hygiène et de sécurité", indic: "Port des EPI, manipulation prudente du bain-marie et de l'HE de cannelle, gestion des déchets", bareme: "/3", note: "" },
            { comp: "C3 – Maîtrise du protocole de fusion", indic: "Température de fonte contrôlée (≤ 70 °C), pas de surchauffe ni de brûlure de la base", bareme: "/3", note: "" },
            { comp: "C4 – Dosage et incorporation des additifs", indic: "Quantités de cannelle et d'huile essentielle conformes à la fiche, incorporation homogène", bareme: "/4", note: "" },
            { comp: "C5 – Qualité du produit fini", indic: "Savon homogène, sans bulles majeures, couleur et odeur régulières, démoulage réussi", bareme: "/4", note: "" },
            { comp: "C6 – Autonomie et méthode", indic: "Suit les étapes dans l'ordre, sollicite l'aide à bon escient, respecte le temps imparti", bareme: "/2", note: "" },
            { comp: "C7 – Compte rendu et analyse", indic: "Fiche de suivi renseignée, écarts justifiés, réponses aux questions de synthèse", bareme: "/2", note: "" }
        ];
        let qstIdx = -1;
        let qstOpts = [];
        let qstData = JSON.parse(localStorage.getItem('db_gr_qst')) || [
            { q: "Pourquoi ne faut-il pas dépasser 70 °C lors de la fonte de la base glycérinée ?", opts: ["Éviter d'abîmer le moule", "Éviter la surchauffe et la brûlure de la base glycérinée", "Accélérer la prise du savon", "Diminuer le prix de revient"], good: "Éviter la surchauffe et la brûlure de la base glycérinée", bar: 2, sel: "", ans: false },
            { q: "Quel est le rôle de la glycérine dans les propriétés hydratantes du savon obtenu ?", opts: ["Elle rend le savon plus dur", "Elle attire et retient l'eau sur la peau (humectant)", "Elle colore le savon", "Elle accélère la saponification"], good: "Elle attire et retient l'eau sur la peau (humectant)", bar: 2, sel: "", ans: false },
            { q: "Quelles précautions justifient un dosage limité de l'huile essentielle de cannelle ?", opts: ["Elle est très coûteuse", "Elle peut irriter la peau à forte concentration", "Elle altère le démoulage", "Elle empêche la prise du savon"], good: "Elle peut irriter la peau à forte concentration", bar: 2, sel: "", ans: false },
            { q: "Quelle variante de la formule permet d'obtenir un savon plus crémeux ?", opts: ["Ajouter de la cannelle en excès", "Augmenter le surgraissage (huile végétale nourrissante)", "Baisser la température de fonte", "Utiliser un colorant ambré"], good: "Augmenter le surgraissage (huile végétale nourrissante)", bar: 2, sel: "", ans: false },
            { q: "Que faut-il faire pour éviter les bulles d'air en surface du savon ?", opts: ["Remuer vigoureusement", "Vaporiser de l'alcool à 70° sur la surface", "Chauffer au-delà de 80 °C", "Ajouter de l'eau"], good: "Vaporiser de l'alcool à 70° sur la surface", bar: 2, sel: "", ans: false }
        ];
        let isAdmin = false;

        // --- AUTH ---
        function loginAdmin() {
            if(document.getElementById('userAdmin').value === "Profdouadi" && document.getElementById('passAdmin').value === "08082012") {
                isAdmin = true; startApp('page-stg');
            } else alert("Username ou Password incorrect");
        }
        function loginStg() {
            const u = document.getElementById('userStg').value;
            const p = document.getElementById('passStg').value;
            const found = stData.find(s => s.tel === u && s.mdp === p);
            if(found) { isAdmin = false; startApp('page-grille'); } else alert("Identifiants incorrects");
        }
        function startApp(p) {
            document.getElementById('mainNav').style.display = "block";
            document.getElementById('page-login').classList.remove('active');
            if(isAdmin) {
                document.getElementById('grilleAdminTools').classList.remove('d-none');
                document.getElementById('soapAdminTools').classList.remove('d-none');
                document.getElementById('adminConfigTab').style.display = "block";
                document.getElementById('nav-stg').style.display = "block";
                document.getElementById('nav-grille').style.display = "block";
            } else {
                document.getElementById('grilleAdminTools').classList.add('d-none');
                document.getElementById('soapAdminTools').classList.add('d-none');
                document.getElementById('adminConfigTab').style.display = "none";
                document.getElementById('nav-stg').style.display = "none";
                document.getElementById('nav-grille').style.display = "none";
            }
            showPage(p); renderGrille(); renderStg(); renderOilLib(); renderOilSelect(); renderRecipe(); renderProj(); fillStgSelect(); fillSoapSelect(); fillGrSelect(); toggleHeaderEdit(isAdmin); loadSubHeader(); runSoap(); renderSig(); renderMp(); renderMat2(); renderOp(); renderGrComp(); renderQst();
        }

        // --- NAVIGATION ---
        function showPage(id, el) {
            document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
            document.getElementById(id).classList.add('active');
            document.querySelectorAll('.nav-link').forEach(n => n.classList.remove('active'));
            if(el) el.classList.add('active');
        }

        // --- STAGIAIRES ---
        function autoMdpStg() {
            const t = document.getElementById('stgTel').value;
            if(t.length >= 4) document.getElementById('stgMdp').value = t.slice(-4);
        }
        function saveStg() {
            const idx = document.getElementById('stgEditIdx').value;
            const s = { nom: document.getElementById('stgNom').value, spec: document.getElementById('stgSpec').value, sem: document.getElementById('stgSem').value, grp: document.getElementById('stgGrp').value, tel: document.getElementById('stgTel').value, mdp: document.getElementById('stgMdp').value };
            if(idx == "-1") stData.push(s); else stData[idx] = s;
            localStorage.setItem('db_s', JSON.stringify(stData)); clearStgForm(); renderStg();
        }
        function renderStg() {
            const tb = document.getElementById('tbodyStg'); if(!tb) return; tb.innerHTML = "";
            stData.forEach((s, i) => {
                tb.innerHTML += `<tr><td>${s.nom}</td><td>${s.spec}</td><td>${s.sem}</td><td>${s.grp}</td><td>${s.tel}</td><td>${s.mdp}</td>
                <td><button onclick="editStg(${i})" class="btn btn-sm btn-warning p-0 px-1"><i class="bi bi-pencil"></i></button>
                <button onclick="stData.splice(${i},1);localStorage.setItem('db_s',JSON.stringify(stData));renderStg()" class="btn btn-sm btn-danger p-0 px-1">X</button></td></tr>`;
            });
        }
        function editStg(i) {
            const s = stData[i]; document.getElementById('stgNom').value = s.nom; document.getElementById('stgSpec').value = s.spec;
            document.getElementById('stgTel').value = s.tel; document.getElementById('stgMdp').value = s.mdp;
            document.getElementById('stgEditIdx').value = i; document.getElementById('btnStgSave').innerText = "Update";
        }
        function clearStgForm() { document.querySelectorAll('#page-stg input').forEach(i => i.value=""); document.getElementById('stgEditIdx').value = "-1"; document.getElementById('btnStgSave').innerText = "Ajouter"; }

        // --- GRILLE ---
        function updateGTitle(v) { mainT = v; localStorage.setItem('db_t', v); renderGrille(); }
        function renderGrille() {
            const tb = document.getElementById('tbodyGrille'); tb.innerHTML = "";
            let s100 = 0; const dgt = document.getElementById('displayGTitle'); if(dgt) dgt.innerText = mainT;
            grData.forEach((r, i) => {
                s100 += parseFloat(r.note);
                tb.innerHTML += `<tr><td>${i+1}</td><td class="fw-bold">${r.comp}</td><td>${r.crit}</td>
                <td class="bg-exc small">${r.n[0]}</td><td class="bg-bien small">${r.n[1]}</td><td class="bg-moy small">${r.n[2]}</td><td class="bg-ins small">${r.n[3]}</td>
                <td><input type="number" value="${r.note}" onchange="upNote(${i},this.value)" class="form-control form-control-sm text-center"></td>
                <td class="fw-bold">${(r.note/5).toFixed(1)}</td>
                <td class="no-print admin-only ${isAdmin?'':'d-none'}">
                <button onclick="edGr(${i})" class="btn btn-sm btn-warning p-0 px-1">M</button>
                <button onclick="grData.splice(${i},1);saveGr()" class="btn btn-sm btn-danger p-0 px-1">X</button></td></tr>`;
            });
            const t100 = document.getElementById('t100'); if(t100) t100.innerText = s100;
            const t20 = document.getElementById('t20'); if(t20) t20.innerText = (s100/5).toFixed(2);
            document.querySelectorAll('.admin-only').forEach(el => isAdmin ? el.classList.remove('d-none') : el.classList.add('d-none'));
        }
        function upNote(i,v) { grData[i].note = v; saveGr(); }
        function saveGrilleRow() {
            const idx = document.getElementById('editRowIdx').value;
            const r = { comp: document.getElementById('inComp').value, crit: document.getElementById('inCrit').value, n: document.getElementById('inLevels').value.split(','), note: 0 };
            if(idx == "-1") grData.push(r); else grData[idx] = r;
            saveGr(); document.getElementById('editRowIdx').value = "-1";
        }
        function edGr(i) {
            const r = grData[i]; document.getElementById('inComp').value = r.comp; document.getElementById('inCrit').value = r.crit;
            document.getElementById('inLevels').value = r.n.join(','); document.getElementById('editRowIdx').value = i;
        }
        function saveGr() { localStorage.setItem('db_g', JSON.stringify(grData)); renderGrille(); }
        function grNote() {
            let s = 0; grData.forEach(r => { const n = parseFloat(r.note) || 0; s += n; });
            return (s/5).toFixed(2);
        }
        // --- GRILLE COMPÉTENCES TP (modifiable) ---
        function renderGrComp() {
            const tb = document.getElementById('grCompBody'); if(!tb) return; tb.innerHTML = "";
            let total = 0;
            grCompData.forEach((r, i) => {
                const n = parseFloat(r.note) || 0; total += n;
                tb.innerHTML += `<tr>
                    <td class="fw-bold">${r.comp}</td><td>${r.indic}</td><td>${r.bareme}</td>
                    <td class="text-center">${r.note || ''}</td>
                    <td class="no-print">
                        <button onclick="editGrComp(${i})" class="btn btn-sm btn-warning p-0 px-1" title="Modifier"><i class="bi bi-pencil"></i></button>
                        <button onclick="delGrComp(${i})" class="btn btn-sm btn-danger p-0 px-1" title="Supprimer">X</button>
                    </td></tr>`;
            });
            const tt = document.getElementById('grCompTotal'); if(tt) tt.innerText = (total/5).toFixed(2);
            if(grCompData.length === 0) tb.innerHTML = `<tr><td colspan="5" class="text-center text-muted">Aucun critère.</td></tr>`;
        }
        function saveGrComp() {
            const comp = document.getElementById('grComp').value.trim();
            const indic = document.getElementById('grIndic').value.trim();
            const bareme = document.getElementById('grBareme').value.trim();
            const note = document.getElementById('grNote').value;
            const idx = parseInt(document.getElementById('grCompIdx').value);
            if(!comp) { alert("Saisissez un critère de compétence"); return; }
            const r = { comp: comp, indic: indic, bareme: bareme, note: note };
            if(idx == -1) grCompData.push(r); else grCompData[idx] = r;
            saveGrCompData();
            document.getElementById('grCompIdx').value = "-1";
            document.getElementById('btnGrCompSave').innerText = "Ajouter";
            ['grComp','grIndic','grBareme','grNote'].forEach(id => document.getElementById(id).value = "");
            renderGrComp();
        }
        function editGrComp(i) {
            const r = grCompData[i];
            document.getElementById('grComp').value = r.comp;
            document.getElementById('grIndic').value = r.indic || "";
            document.getElementById('grBareme').value = r.bareme || "";
            document.getElementById('grNote').value = r.note || "";
            document.getElementById('grCompIdx').value = i;
            document.getElementById('btnGrCompSave').innerText = "Sauvegarder";
            document.getElementById('grComp').focus();
        }
        function delGrComp(i) { grCompData.splice(i,1); saveGrCompData(); renderGrComp(); }
        function saveGrCompData() { localStorage.setItem('db_gr_comp', JSON.stringify(grCompData)); }
        // --- QUESTIONS DE SYNTHÈSE (QCM + correction auto + barème admin) ---
        function renderQst() {
            const list = document.getElementById('qstList'); if(!list) return; list.innerHTML = "";
            let total = 0, max = 0;
            const isProf = isAdmin;
            qstData.forEach((q, i) => {
                max += parseFloat(q.bar) || 0;
                const bar = parseFloat(q.bar) || 0;
                const optsHtml = q.opts.map(o => {
                    const isGood = isProf && q.ans && o === q.good;
                    const isBad = isProf && q.ans && q.sel === o && o !== q.good;
                    let cls = 'form-check';
                    if(isGood) cls += ' text-success fw-bold';
                    if(isBad) cls += ' text-danger';
                    const mark = isGood ? ' ✅' : (isBad ? ' ❌' : '');
                    return `<div class="${cls}">
                        <input class="form-check-input" type="radio" name="qst${i}" value="${o}"
                            ${q.sel===o?'checked':''} ${q.ans?'disabled':''} onclick="pickQst(${i},this.value)">
                        <label class="form-check-label">${o}${mark}</label>
                    </div>`;
                }).join('');
                // pilote du statut différent selon prof/stagiaire
                let statusHtml = '';
                if(isProf) {
                    if(q.ans) statusHtml = q.sel === q.good ? `<span class="badge bg-success">Bonne réponse ${bar} pt</span>` : `<span class="badge bg-danger">Fausse réponse (0/${bar})</span>`;
                    else statusHtml = `<span class="badge bg-secondary">réponse attendue</span>`;
                } else {
                    statusHtml = q.ans ? `<span class="badge bg-secondary">réponse enregistrée</span>` : `<span class="badge bg-secondary">choisir une réponse</span>`;
                }
                const cardCls = isProf && q.ans ? (q.sel===q.good?'border-success':'border-danger') : '';
                // boutons d'édition : seulement prof
                const editBtns = isProf ? `<span class="no-print d-flex gap-1">
                            <button onclick="editQst(${i})" class="btn btn-sm btn-warning p-0 px-1" title="Modifier"><i class="bi bi-pencil"></i></button>
                            <button onclick="delQst(${i})" class="btn btn-sm btn-danger p-0 px-1" title="Supprimer">X</button>
                        </span>` : '';
                // boutons correction : seulement prof
                const corrBtns = isProf ? `<span class="no-print">
                            <button class="btn btn-sm btn-outline-success" onclick="correctQst(${i})">Corriger</button>
                            <button class="btn btn-sm btn-outline-danger" onclick="resetQst(${i})">Réinitialiser</button>
                        </span>` : '';
                list.innerHTML += `<div class="card p-2 mb-2 ${cardCls}">
                    <div class="d-flex justify-content-between align-items-start">
                        <b>Q${i+1}.</b> <span class="flex-grow-1 ms-2">${q.q} <span class="text-muted">(${bar} pt)</span></span>
                        ${editBtns}
                    </div>
                    <div class="mt-1">${optsHtml}</div>
                    <div class="mt-1 d-flex justify-content-between align-items-center">
                        <span class="small">${statusHtml}</span>
                        ${corrBtns}
                    </div>
                </div>`;
                if(isProf && q.ans && q.sel === q.good) total += bar;
            });
            const tt = document.getElementById('qstTotal'); if(tt) tt.innerText = isProf ? `${total} / ${max}` : 'Correction réservée au professeur';
            if(qstData.length === 0) { list.innerHTML = `<div class="text-muted text-center">Aucune question.</div>`; const tt2 = document.getElementById('qstTotal'); if(tt2) tt2.innerText = '0 / 0'; }
        }
        function renderQstOpts() {
            const div = document.getElementById('qstOptList'); if(!div) return;
            div.innerHTML = qstOpts.map((o, i) =>
                `<span class="badge bg-secondary me-1 mb-1">${i+1}. ${o} <a href="#" onclick="event.preventDefault();qstOpts.splice(${i},1);renderQstOpts();" class="text-white">&times;</a></span>`
            ).join('');
            if(qstOpts.length === 0) div.innerHTML = `<span class="text-muted">Options : aucune</span>`;
        }
        function addQstOpt() {
            const inp = document.getElementById('qstOpt');
            const v = inp.value.trim();
            if(!v) return;
            qstOpts.push(v); inp.value = ""; renderQstOpts();
        }
        function editQst(i) {
            const q = qstData[i];
            document.getElementById('qstName').value = q.q;
            document.getElementById('qstBareme').value = q.bar;
            document.getElementById('qstGood').value = q.good;
            qstOpts = (q.opts || []).slice(); renderQstOpts();
            document.getElementById('qstIdx').value = i;
            document.getElementById('btnQstSave').innerText = "Sauvegarder";
            document.getElementById('qstName').focus();
        }
        function resetQstForm() {
            document.getElementById('qstName').value = "";
            document.getElementById('qstOpt').value = "";
            document.getElementById('qstBareme').value = "";
            document.getElementById('qstGood').value = "";
            document.getElementById('qstIdx').value = "-1";
            document.getElementById('btnQstSave').innerText = "Ajouter";
            qstOpts = []; renderQstOpts();
        }
        function saveQst() {
            const name = document.getElementById('qstName').value.trim();
            const bar = document.getElementById('qstBareme').value;
            const good = document.getElementById('qstGood').value.trim();
            const idx = parseInt(document.getElementById('qstIdx').value);
            if(!name) { alert("Saisissez l'énoncé de la question"); return; }
            if(qstOpts.length < 2) { alert("Ajoutez au moins 2 options"); return; }
            if(!good) { alert("Indiquez la bonne réponse"); return; }
            const rec = { q: name, opts: qstOpts.slice(), good: good, bar: parseFloat(bar) || 1, sel: "", ans: false };
            if(idx == -1) qstData.push(rec); else qstData[idx] = rec;
            saveQstData(); resetQstForm(); renderQst();
        }
        function delQst(i) { qstData.splice(i,1); saveQstData(); renderQst(); }
        function saveQstData() { localStorage.setItem('db_gr_qst', JSON.stringify(qstData)); }
        function pickQst(i, v) { qstData[i].sel = v; qstData[i].ans = false; renderQst(); }
        function correctQst(i) {
            const q = qstData[i];
            if(!q.sel) { alert("Le stagiaire doit choisir une réponse avant la correction"); return; }
            q.ans = true; saveQstData(); renderQst();
        }
        function resetQst(i) { qstData[i].sel = ""; qstData[i].ans = false; saveQstData(); renderQst(); }
        function resetAllQstAnswers() {
            if(!confirm("Réinitialiser toutes les réponses des stagiaires ?")) return;
            qstData.forEach(q => { q.sel = ""; q.ans = false; });
            saveQstData(); renderQst();
        }

        // --- SOAP ---
        const SOAP_Q = [
            { k: "Dureté", r: "29–54" },
            { k: "Pouvoir nettoyant", r: "12–22" },
            { k: "Conditionnement", r: "44–69" },
            { k: "Moussant", r: "14–46" },
            { k: "Crémeux", r: "16–48" },
            { k: "Iode", r: "41–70" }
        ];
        function renderOilLib() {
            const tb = document.getElementById('tbodyOilLib'); if(!tb) return; tb.innerHTML = "";
            oilData.forEach((o, i) => {
                tb.innerHTML += `<tr>
                    <td>${i+1}</td><td class="fw-bold">${o.nom}</td>
                    <td>${o.sap ? o.sap.toFixed(3) : '-'}</td>
                    <td>${o.koh ? o.koh.toFixed(3) : '-'}</td>
                    <td>${o.ins || '-'}</td>
                    <td class="no-print">
                        <button onclick="edOilLib(${i})" class="btn btn-sm btn-warning p-0 px-1"><i class="bi bi-pencil"></i></button>
                        <button onclick="delOilLib(${i})" class="btn btn-sm btn-danger p-0 px-1">X</button>
                    </td></tr>`;
            });
            renderOilSelect();
        }
        function saveOilLib() {
            const idx = document.getElementById('oilEditLibIdx').value;
            const o = {
                nom: document.getElementById('inOilName').value.trim(),
                sap: parseFloat(document.getElementById('inOilSap').value) || 0,
                koh: parseFloat(document.getElementById('inOilFap').value) || 0,
                ins: parseFloat(document.getElementById('inOilIns').value) || 0
            };
            if(!o.nom || !o.sap) { alert("Nom et SAP NaOH obligatoires"); return; }
            if(idx == "-1") oilData.push(o); else oilData[idx] = o;
            localStorage.setItem('db_oil', JSON.stringify(oilData)); clearOilLibForm(); renderOilLib();
        }
        function edOilLib(i) {
            const o = oilData[i];
            document.getElementById('inOilName').value = o.nom;
            document.getElementById('inOilSap').value = o.sap;
            document.getElementById('inOilFap').value = o.koh || "";
            document.getElementById('inOilIns').value = o.ins || "";
            document.getElementById('oilEditLibIdx').value = i;
            document.getElementById('btnOilSave').innerText = "Update";
        }
        function delOilLib(i) { oilData.splice(i,1); localStorage.setItem('db_oil', JSON.stringify(oilData)); renderOilLib(); }
        function clearOilLibForm() {
            document.getElementById('inOilName').value = "";
            document.getElementById('inOilSap').value = "";
            document.getElementById('inOilFap').value = "";
            document.getElementById('inOilIns').value = "";
            document.getElementById('oilEditLibIdx').value = "-1";
            document.getElementById('btnOilSave').innerText = "Ajouter";
        }
        function renderOilSelect() {
            const sel = document.getElementById('oilSelect'); if(!sel) return;
            sel.innerHTML = "";
            oilData.forEach((o, i) => {
                const opt = document.createElement('option');
                opt.value = i; opt.text = `${o.nom} (SAP ${o.sap ? o.sap.toFixed(3) : '-'}, INS ${o.ins || '-'})`;
                sel.appendChild(opt);
            });
            sel.onchange = showOilInfo;
            showOilInfo();
        }
        function showOilInfo() {
            const sel = document.getElementById('oilSelect'); if(!sel) return;
            const i = parseInt(sel.value); const o = oilData[i];
            if(!o) { document.getElementById('oilSelectedInfo').innerHTML = 'Sélectionnez une huile.'; return; }
            document.getElementById('oilSelectedInfo').innerHTML =
                `<b>${o.nom}</b><br>SAP NaOH : ${o.sap ? o.sap.toFixed(3) : '-'} · SAP KOH : ${o.koh ? o.koh.toFixed(3) : '-'}<br>INS : ${o.ins || '-'}`;
        }
        function addOilToRecipe() {
            const i = parseInt(document.getElementById('oilSelect').value);
            const o = oilData[i]; if(!o) return;
            const exist = recipe.find(r => r.id === i);
            if(exist) { exist.pct = (parseFloat(exist.pct) || 0) + 1; }
            else recipe.push({ id: i, pct: 1 });
            saveRecipe();
        }
        function resetRecipe() { recipe = []; saveRecipe(); }
        function removeOilFromRecipe(ri) { recipe.splice(ri,1); saveRecipe(); }
        function editRecipeLine(ri) {
            const r = recipe[ri]; const o = oilData[r.id];
            document.getElementById('inLineNom').value = o ? o.nom : "";
            document.getElementById('inLinePct').value = r.pct;
            document.getElementById('soapEditLineIdx').value = ri;
            document.getElementById('soapEditTools').classList.remove('d-none');
        }
        function confirmEditLine() {
            const ri = parseInt(document.getElementById('soapEditLineIdx').value);
            if(ri < 0) return;
            const pct = parseFloat(document.getElementById('inLinePct').value) || 0;
            recipe[ri].pct = pct;
            document.getElementById('soapEditTools').classList.add('d-none');
            saveRecipe();
        }
        function saveRecipe() { localStorage.setItem('db_recipe', JSON.stringify(recipe)); renderRecipe(); }
        function renderRecipe() {
            const tb = document.getElementById('tbodyRecipe'); if(!tb) return; tb.innerHTML = "";
            const w = parseFloat(document.getElementById('soapWeight').value) || 0;
            let totPct = 0;
            recipe.forEach((r, ri) => {
                const o = oilData[r.id] || { nom: "Huile ?", sap: 0 };
                const pct = parseFloat(r.pct) || 0; totPct += pct;
                const g = (w * pct) / 100;
                tb.innerHTML += `<tr>
                    <td class="fw-bold">${o.nom}</td>
                    <td><input type="number" class="form-control form-control-sm text-center" style="width:70px" value="${pct == 0 ? '' : pct}" onchange="upRecipePct(${ri},this.value)"></td>
                    <td>${g.toFixed(1)}</td>
                    <td class="no-print">
                        <button onclick="editRecipeLine(${ri})" class="btn btn-sm btn-warning p-0 px-1"><i class="bi bi-pencil"></i></button>
                        <button onclick="removeOilFromRecipe(${ri})" class="btn btn-sm btn-danger p-0 px-1">X</button>
                    </td></tr>`;
            });
            const tp = document.getElementById('recTotPct');
            const tg = document.getElementById('recTotG');
            const recMsg = document.getElementById('recMsg');
            if(recipe.length === 0) {
                tp.innerText = "0.00"; tg.innerText = "0.000";
                recMsg.classList.remove('d-none');
            } else {
                tp.innerText = totPct.toFixed(2); tg.innerText = ((w * totPct) / 100).toFixed(2);
                recMsg.classList.add('d-none');
            }
            runSoap();
        }
        function upRecipePct(ri, v) { recipe[ri].pct = parseFloat(v) || 0; saveRecipe(); }
        function runSoap() {
            const w = parseFloat(document.getElementById('soapWeight').value) || 0;
            const sf = 1 - ((parseFloat(document.getElementById('soapSF').value) || 0)/100);
            const waterPct = parseFloat(document.getElementById('soapWater').value) || 38;
            const lyeF = parseFloat(document.getElementById('soapLye').value) || 0.141;
            let na = 0;
            recipe.forEach(r => {
                const o = oilData[r.id]; if(!o) return;
                na += (w * ((parseFloat(r.pct)||0)/100)) * (o.sap || o.koh || 0);
            });
            na *= sf;
            const eau = (w * waterPct) / 100;
            document.getElementById('resNaoh').innerText = na.toFixed(2);
            document.getElementById('resEau').innerText = eau.toFixed(2);
            // Qualités
            const qb = document.getElementById('qualitiesList'); if(!qb) return;
            const lyeIsKoh = (lyeF > 0.15);
            let html = "";
            const kcalc = (n, d) => d ? (n / d).toFixed(1) : "0.0";
            // INS moyen
            let insW = 0, totPct = 0;
            recipe.forEach(r => {
                const o = oilData[r.id]; if(!o) return;
                const p = parseFloat(r.pct) || 0; totPct += p;
                if(p > 0) insW += (p * (o.ins || 0));
            });
            const avgIns = totPct > 0 ? (insW / totPct) : 0;
            html += `<div class="d-flex justify-content-between small"><span>INS (réf 160)</span><b>${avgIns.toFixed(0)}</b></div>`;
            // Dureté SAP à 50% coco+palme approx
            let sat = 0;
            recipe.forEach(r => {
                const o = oilData[r.id]; if(!o) return;
                const p = parseFloat(r.pct) || 0;
                if(/coco|palme|beurre|karite|tallow|grasse/i.test(o.nom)) sat += p;
            });
            const satPct = totPct > 0 ? (sat / totPct * 100) : 0;
            html += `<div class="d-flex justify-content-between small"><span>Graisses saturées</span><b>${satPct.toFixed(0)}%</b></div>`;
            html += `<div class="d-flex justify-content-between small"><span>Graisses insaturées</span><b>${(100-satPct).toFixed(0)}%</b></div>`;
            // Ligne soude/eau
            html += `<hr class="my-1"><div class="small text-muted">Soude ${lyeIsKoh ? 'KOH' : 'NaOH'} : ${na.toFixed(2)} g · Eau : ${eau.toFixed(2)} g</div>`;
            qb.innerHTML = html;
        }

        // --- FICHE PROJET ---
        function renderProj() {
            const tb = document.getElementById('tbodyProj'); if(!tb) return; tb.innerHTML = "";
            let autoNote = null;
            try { autoNote = grNote(); } catch(e) {}
            projData.forEach((pr, i) => {
                const note = (pr.qte && pr.qte != '-') ? pr.qte : (autoNote != null ? autoNote : '-');
                const saved = (pr.qte && pr.qte != '-') ? 'disabled' : '';
                tb.innerHTML += `<tr>
                    <td class="fw-bold">${pr.stg || pr.stagiaire || '-'}</td><td>${pr.spec || '-'}</td><td>${pr.grp || '-'}</td><td>${pr.date || '-'}</td><td class="text-center">${note}</td>
                    <td class="no-print">
                        <button onclick="viewProj(${i})" class="btn btn-sm btn-info p-0 px-1" title="Voir"><i class="bi bi-eye"></i></button>
                        <button onclick="saveProjNote(${i})" ${saved} class="btn btn-sm btn-success p-0 px-1" title="Sauvegarder la note (depuis la grille)"><i class="bi bi-save"></i></button>
                        <button onclick="printOneProj(${i})" class="btn btn-sm btn-primary p-0 px-1" title="Imprimer la fiche"><i class="bi bi-printer"></i></button>
                        <button onclick="editProj(${i})" class="btn btn-sm btn-warning p-0 px-1" title="Modifier"><i class="bi bi-pencil"></i></button>
                        <button onclick="delProj(${i})" class="btn btn-sm btn-danger p-0 px-1" title="Supprimer">X</button>
                        <button onclick="downloadOneProj(${i})" class="btn btn-sm btn-dark p-0 px-1" title="Télécharger"><i class="bi bi-download"></i></button>
                    </td></tr>`;
            });
            if(projData.length === 0) tb.innerHTML = `<tr><td colspan="6" class="text-center text-muted">Aucune fiche enregistrée.</td></tr>`;
        }
        function saveProjNote(i) {
            const pr = projData[i]; if(!pr) return;
            let n = null; try { n = grNote(); } catch(e) {}
            pr.qte = (n != null ? n : '');
            localStorage.setItem('db_pr', JSON.stringify(projData));
            const b = document.getElementById('projDetailBody');
            if(pr.qte) alert("Note sauvegardée : " + pr.qte + " /20");
            renderProj(); viewProj(i);
        }
        function fillStgSelect() {
            const sel = document.getElementById('projStgSel'); if(!sel) return;
            const current = document.getElementById('projStg').value;
            sel.innerHTML = `<option value="-1">-- Sélectionner un stagiaire --</option>`;
            stData.forEach((s, i) => {
                const opt = document.createElement('option');
                opt.value = i;
                opt.text = `${s.nom} (${s.grp ? 'Grp '+s.grp : '-'} - ${s.spec || '-'})`;
                sel.appendChild(opt);
            });
            if(stData.length === 0) sel.innerHTML += `<option value="-1" disabled>Aucun stagiaire enregistré</option>`;
            // présélectionner si le nom correspond déjà
            let preselect = -1;
            if(current) {
                const found = stData.findIndex(s => s.nom === current);
                if(found >= 0) preselect = found;
            }
            // sinon présélection automatique du premier stagiaire (remplissage auto)
            if(preselect < 0 && stData.length > 0) preselect = 0;
            if(preselect >= 0) {
                sel.value = preselect;
                fillStgProj();
            }
        }
        function fillStgProj() {
            const sel = document.getElementById('projStgSel');
            const i = parseInt(sel.value);
            if(i >= 0 && stData[i]) {
                const s = stData[i];
                document.getElementById('projStg').value = s.nom || "";
                document.getElementById('projSpec').value = s.spec || "";
                document.getElementById('projGrp').value = s.grp || "";
            }
        }
        function fillSoapSelect() {
            const sel = document.getElementById('soapStgSel'); const inx = document.getElementById('soapStgIdx'); if(!sel || !inx) return;
            const current = parseInt(inx.value) || -1;
            sel.innerHTML = `<option value="-1">-- Stagiaire --</option>`;
            stData.forEach((s, i) => {
                const opt = document.createElement('option');
                opt.value = i;
                opt.text = s.nom || ('Stagiaire ' + (i+1));
                sel.appendChild(opt);
            });
            if(stData.length === 0) sel.innerHTML += `<option value="-1" disabled>Aucun stagiaire</option>`;
            let preselect = current;
            if(preselect < 0 && stData.length > 0) preselect = 0;
            if(preselect >= 0) { sel.value = preselect; fillSoapStg(); }
        }
        function fillSoapStg() {
            const sel = document.getElementById('soapStgSel'); const inx = document.getElementById('soapStgIdx');
            const i = parseInt(sel.value);
            if(!inx) return;
            inx.value = i;
            if(i >= 0 && stData[i]) {
                const s = stData[i];
                document.getElementById('soapStgNom').value = s.nom || "";
                document.getElementById('soapStgSpec').value = s.spec || "";
                document.getElementById('soapStgSem').value = s.sem || "";
                document.getElementById('soapStgGrp').value = s.grp || "";
            } else {
                ['soapStgNom','soapStgSpec','soapStgSem','soapStgGrp'].forEach(id => { const e = document.getElementById(id); if(e) e.value = ""; });
            }
        }
        function fillGrSelect() {
            const sel = document.getElementById('grStgSel'); const inx = document.getElementById('grStgIdx'); if(!sel || !inx) return;
            const current = parseInt(inx.value) || -1;
            sel.innerHTML = `<option value="-1">-- Stagiaire --</option>`;
            stData.forEach((s, i) => {
                const opt = document.createElement('option');
                opt.value = i;
                opt.text = s.nom || ('Stagiaire ' + (i+1));
                sel.appendChild(opt);
            });
            if(stData.length === 0) sel.innerHTML += `<option value="-1" disabled>Aucun stagiaire</option>`;
            let preselect = current;
            if(preselect < 0 && stData.length > 0) preselect = 0;
            if(preselect >= 0) { sel.value = preselect; fillGrStg(); }
        }
        function fillGrStg() {
            const sel = document.getElementById('grStgSel'); const inx = document.getElementById('grStgIdx');
            const i = parseInt(sel.value);
            if(!inx) return;
            inx.value = i;
            if(i >= 0 && stData[i]) {
                const s = stData[i];
                document.getElementById('grStgNom').value = s.nom || "";
                document.getElementById('grStgSpec').value = s.spec || "";
                document.getElementById('grStgSem').value = s.sem || "";
                document.getElementById('grStgGrp').value = s.grp || "";
            } else {
                ['grStgNom','grStgSpec','grStgSem','grStgGrp'].forEach(id => { const e = document.getElementById(id); if(e) e.value = ""; });
            }
        }
        function renderSteps() {
            const list = document.getElementById('projStepsList'); if(!list) return;
            list.innerHTML = "";
            projSteps.forEach((st, i) => {
                const div = document.createElement('div');
                div.className = 'input-group input-group-sm mb-1';
                div.innerHTML = `
                    <span class="input-group-text">${i+1}</span>
                    <input type="text" class="form-control" value="${st}" readonly>
                    <button class="btn btn-warning" onclick="editStep(${i})" title="Modifier"><i class="bi bi-pencil"></i></button>
                    <button class="btn btn-danger" onclick="delStep(${i})" title="Supprimer">X</button>`;
                list.appendChild(div);
            });
        }
        function addStep() {
            const inp = document.getElementById('projStep');
            const idx = parseInt(document.getElementById('projStepIdx').value);
            const v = inp.value.trim();
            if(!v) { alert("Saisissez le texte de l'étape"); return; }
            if(idx == -1) projSteps.push(v); else projSteps[idx] = v;
            document.getElementById('projStepIdx').value = "-1";
            document.getElementById('btnStepSave').innerText = "Ajouter";
            inp.value = "";
            renderSteps();
        }
        function editStep(i) {
            document.getElementById('projStep').value = projSteps[i];
            document.getElementById('projStepIdx').value = i;
            document.getElementById('btnStepSave').innerText = "Update";
            document.getElementById('projStep').focus();
        }
        function delStep(i) { projSteps.splice(i,1); renderSteps(); }
        // --- INGRÉDIENTS ---
        function renderIng() {
            const list = document.getElementById('projIngList'); if(!list) return;
            list.innerHTML = "";
            projIngredients.forEach((it, i) => {
                const div = document.createElement('div');
                div.className = 'input-group input-group-sm mb-1';
                div.innerHTML = `
                    <span class="input-group-text">${i+1}</span>
                    <input type="text" class="form-control" value="${it}" readonly>
                    <button class="btn btn-warning" onclick="editIng(${i})" title="Modifier"><i class="bi bi-pencil"></i></button>
                    <button class="btn btn-danger" onclick="delIng(${i})" title="Supprimer">X</button>`;
                list.appendChild(div);
            });
        }
        function addIng() {
            const inp = document.getElementById('projIngInp');
            const idx = parseInt(document.getElementById('projIngIdx').value);
            const v = inp.value.trim();
            if(!v) { alert("Saisissez un ingrédient"); return; }
            if(idx == -1) projIngredients.push(v); else projIngredients[idx] = v;
            document.getElementById('projIngIdx').value = "-1";
            document.getElementById('btnIngSave').innerText = "Ajouter";
            inp.value = "";
            renderIng();
        }
        function editIng(i) {
            document.getElementById('projIngInp').value = projIngredients[i];
            document.getElementById('projIngIdx').value = i;
            document.getElementById('btnIngSave').innerText = "Update";
            document.getElementById('projIngInp').focus();
        }
        function delIng(i) { projIngredients.splice(i,1); renderIng(); }
        // --- FICHE SIGNALÉTIQUE ---
        function renderSig() {
            const tb = document.getElementById('sigBody'); if(!tb) return;
            tb.innerHTML = "";
            sigData.forEach((it, i) => {
                tb.innerHTML += `<tr><td class="fw-bold">${it.l}</td><td>${it.v}</td>
                    <td class="no-print">
                        <button onclick="editSig(${i})" class="btn btn-sm btn-warning p-0 px-1" title="Modifier"><i class="bi bi-pencil"></i></button>
                        <button onclick="delSig(${i})" class="btn btn-sm btn-danger p-0 px-1" title="Supprimer">X</button>
                    </td></tr>`;
            });
            if(sigData.length === 0) tb.innerHTML = `<tr><td colspan="3" class="text-center text-muted">Aucune ligne.</td></tr>`;
        }
        function addSig() {
            const l = document.getElementById('sigLabel').value.trim();
            const v = document.getElementById('sigValue').value.trim();
            const idx = parseInt(document.getElementById('sigIdx').value);
            if(!l) { alert("Saisissez un libellé"); return; }
            if(idx == -1) sigData.push({ l: l, v: v }); else sigData[idx] = { l: l, v: v };
            document.getElementById('sigIdx').value = "-1";
            document.getElementById('btnSigSave').innerText = "Ajouter";
            document.getElementById('sigLabel').value = "";
            document.getElementById('sigValue').value = "";
            renderSig();
        }
        function editSig(i) {
            document.getElementById('sigLabel').value = sigData[i].l;
            document.getElementById('sigValue').value = sigData[i].v;
            document.getElementById('sigIdx').value = i;
            document.getElementById('btnSigSave').innerText = "Update";
            document.getElementById('sigLabel').focus();
        }
        function delSig(i) { sigData.splice(i,1); renderSig(); }
        // --- MATIÈRES PREMIÈRES ---
        function renderMp() {
            const tb = document.getElementById('mpBody'); if(!tb) return;
            tb.innerHTML = "";
            mpData.forEach((it, i) => {
                tb.innerHTML += `<tr><td>${it.n}</td><td>${it.q}</td><td>${it.o}</td>
                    <td class="no-print">
                        <button onclick="editMp(${i})" class="btn btn-sm btn-warning p-0 px-1" title="Modifier"><i class="bi bi-pencil"></i></button>
                        <button onclick="delMp(${i})" class="btn btn-sm btn-danger p-0 px-1" title="Supprimer">X</button>
                    </td></tr>`;
            });
            if(mpData.length === 0) tb.innerHTML = `<tr><td colspan="4" class="text-center text-muted">Aucune matière première.</td></tr>`;
        }
        function addMp() {
            const n = document.getElementById('mpName').value.trim();
            const q = document.getElementById('mpQte').value.trim();
            const o = document.getElementById('mpObs').value.trim();
            const idx = parseInt(document.getElementById('mpIdx').value);
            if(!n) { alert("Saisissez une désignation"); return; }
            if(idx == -1) mpData.push({ n: n, q: q, o: o }); else mpData[idx] = { n: n, q: q, o: o };
            document.getElementById('mpIdx').value = "-1";
            document.getElementById('btnMpSave').innerText = "Ajouter";
            document.getElementById('mpName').value = ""; document.getElementById('mpQte').value = ""; document.getElementById('mpObs').value = "";
            renderMp();
        }
        function editMp(i) {
            document.getElementById('mpName').value = mpData[i].n;
            document.getElementById('mpQte').value = mpData[i].q;
            document.getElementById('mpObs').value = mpData[i].o;
            document.getElementById('mpIdx').value = i;
            document.getElementById('btnMpSave').innerText = "Update";
            document.getElementById('mpName').focus();
        }
        function delMp(i) { mpData.splice(i,1); renderMp(); }
        // --- MATÉRIEL ---
        function renderMat2() {
            const list = document.getElementById('mat2List'); if(!list) return;
            list.innerHTML = "";
            mat2Data.forEach((it, i) => {
                const div = document.createElement('div');
                div.className = 'input-group input-group-sm mb-1';
                div.innerHTML = `<span class="input-group-text">${i+1}</span>
                    <input type="text" class="form-control" value="${it}" readonly>
                    <button class="btn btn-warning" onclick="editMat2(${i})" title="Modifier"><i class="bi bi-pencil"></i></button>
                    <button class="btn btn-danger" onclick="delMat2(${i})" title="Supprimer">X</button>`;
                list.appendChild(div);
            });
        }
        function addMat2() {
            const inp = document.getElementById('mat2Name');
            const idx = parseInt(document.getElementById('mat2Idx').value);
            const v = inp.value.trim();
            if(!v) { alert("Saisissez un matériel"); return; }
            if(idx == -1) mat2Data.push(v); else mat2Data[idx] = v;
            document.getElementById('mat2Idx').value = "-1";
            document.getElementById('btnMat2Save').innerText = "Ajouter";
            inp.value = "";
            renderMat2();
        }
        function editMat2(i) {
            document.getElementById('mat2Name').value = mat2Data[i];
            document.getElementById('mat2Idx').value = i;
            document.getElementById('btnMat2Save').innerText = "Update";
            document.getElementById('mat2Name').focus();
        }
        function delMat2(i) { mat2Data.splice(i,1); renderMat2(); }
        // --- MODE OPÉRATOIRE ---
        function renderOp() {
            const list = document.getElementById('opList'); if(!list) return;
            list.innerHTML = "";
            const ol = document.createElement('ol');
            ol.className = 'small mb-0';
            opData.forEach((it, i) => {
                const li = document.createElement('li');
                li.innerHTML = `${it}
                    <span class="no-print float-end">
                        <button onclick="editOp(${i})" class="btn btn-sm btn-warning p-0 px-1" title="Modifier"><i class="bi bi-pencil"></i></button>
                        <button onclick="delOp(${i})" class="btn btn-sm btn-danger p-0 px-1" title="Supprimer">X</button>
                    </span>`;
                ol.appendChild(li);
            });
            list.appendChild(ol);
        }
        function addOp() {
            const inp = document.getElementById('opName');
            const idx = parseInt(document.getElementById('opIdx').value);
            const v = inp.value.trim();
            if(!v) { alert("Saisissez une étape du mode opératoire"); return; }
            if(idx == -1) opData.push(v); else opData[idx] = v;
            document.getElementById('opIdx').value = "-1";
            document.getElementById('btnOpSave').innerText = "Ajouter";
            inp.value = "";
            renderOp();
        }
        function editOp(i) {
            document.getElementById('opName').value = opData[i];
            document.getElementById('opIdx').value = i;
            document.getElementById('btnOpSave').innerText = "Sauvegarder";
            document.getElementById('opName').focus();
        }
        function delOp(i) { opData.splice(i,1); renderOp(); }
        // --- MATÉRIEL ---
        function renderMat() {
            const list = document.getElementById('projMatList'); if(!list) return;
            list.innerHTML = "";
            projMateriels.forEach((it, i) => {
                const div = document.createElement('div');
                div.className = 'input-group input-group-sm mb-1';
                div.innerHTML = `
                    <span class="input-group-text">${i+1}</span>
                    <input type="text" class="form-control" value="${it}" readonly>
                    <button class="btn btn-warning" onclick="editMat(${i})" title="Modifier"><i class="bi bi-pencil"></i></button>
                    <button class="btn btn-danger" onclick="delMat(${i})" title="Supprimer">X</button>`;
                list.appendChild(div);
            });
        }
        function addMat() {
            const inp = document.getElementById('projMatInp');
            const idx = parseInt(document.getElementById('projMatIdx').value);
            const v = inp.value.trim();
            if(!v) { alert("Saisissez un matériel"); return; }
            if(idx == -1) projMateriels.push(v); else projMateriels[idx] = v;
            document.getElementById('projMatIdx').value = "-1";
            document.getElementById('btnMatSave').innerText = "Ajouter";
            inp.value = "";
            renderMat();
        }
        function editMat(i) {
            document.getElementById('projMatInp').value = projMateriels[i];
            document.getElementById('projMatIdx').value = i;
            document.getElementById('btnMatSave').innerText = "Update";
            document.getElementById('projMatInp').focus();
        }
        function delMat(i) { projMateriels.splice(i,1); renderMat(); }
        function saveProj() {
            const idx = document.getElementById('projEditIdx').value;
            const stg = document.getElementById('projStg').value;
            const pr = {
                titre: stg || "Fiche TP Savon Glycérine & Cannelle",
                stg: stg,
                spec: document.getElementById('projSpec').value,
                grp: document.getElementById('projGrp').value,
                date: document.getElementById('projDate').value,
                qte: document.getElementById('projQte').value
            };
            if(!pr.stg) { alert("Veuillez sélectionner un stagiaire"); return; }
            commitProj(idx, pr);
        }
        function prevProjPhoto(input) {
            const file = input.files && input.files[0];
            if(!file) return;
            const r = new FileReader();
            r.onload = (e) => {
                projPhotoData = e.target.result;
                document.getElementById('projPhotoImg').src = projPhotoData;
                document.getElementById('projPhotoPrev').classList.remove('d-none');
            };
            r.readAsDataURL(file);
        }
        function removeProjPhoto() {
            projPhotoData = "";
            document.getElementById('projPhoto').value = "";
            document.getElementById('projPhotoPrev').classList.add('d-none');
            document.getElementById('projPhotoImg').src = "";
        }
        function commitProj(idx, pr) {
            if(idx == "-1") projData.push(pr); else projData[idx] = pr;
            localStorage.setItem('db_pr', JSON.stringify(projData));
            clearProjForm(); renderProj();
        }
        function editProj(i) {
            const pr = projData[i];
            document.getElementById('projStg').value = pr.stg || "";
            document.getElementById('projSpec').value = pr.spec || "";
            document.getElementById('projGrp').value = pr.grp || "";
            document.getElementById('projDate').value = pr.date || "";
            document.getElementById('projQte').value = pr.qte || "";
            if(pr.stg) { const f = stData.findIndex(s => s.nom === pr.stg); const sel = document.getElementById('projStgSel'); if(sel && f>=0) sel.value = f; }
            document.getElementById('projEditIdx').value = i;
            document.getElementById('btnProjSave').innerText = "Update";
            document.getElementById('projDetail').classList.add('d-none');
        }
        function delProj(i) { projData.splice(i,1); localStorage.setItem('db_pr', JSON.stringify(projData)); renderProj(); }
        function clearProjForm() {
            ['projStg','projSpec','projGrp','projDate','projQte'].forEach(id => {
                const el = document.getElementById(id); if(el) el.value = "";
            });
            const psel = document.getElementById('projStgSel'); if(psel) psel.value = "-1";
            document.getElementById('projEditIdx').value = "-1";
            document.getElementById('btnProjSave').innerText = "Ajouter";
        }
        function viewProj(i) {
            const pr = projData[i];
            projDetailIdx = i;
            const b = document.getElementById('projDetailBody');
            b.innerHTML = `
                <p><b>Fiche TP :</b> Fabrication d'un savon à base de glycérine et de cannelle</p>
                <p><b>Stagiaire :</b> ${pr.stg || '-'} (<b>Spécialité :</b> ${pr.spec || '-'}, <b>Groupe :</b> ${pr.grp || '-'})</p>
                <p><b>Date :</b> ${pr.date || '-'} &nbsp; <b>Note obtenue :</b> ${pr.qte || '-'} /20</p>
            `;
            document.getElementById('projDetail').classList.remove('d-none');
        }
        function ficheText(pr) {
            return `FICHE DE TRAVAUX PRATIQUES (TP)
Fabrication d'un savon à base de glycérine et de cannelle
Approche Par Compétences (APC)
============================================
NOM DU STAGIAIRE : ${pr.stg || '-'}
SPECIALITE : ${pr.spec || '-'}
GROUPE : ${pr.grp || '-'}
DATE : ${pr.date || '-'}
NOTE OBTENUE : ${pr.qte || '-'} /20

Document pédagogique modifiable - à adapter au niveau,
à l'effectif et au référentiel de compétences de l'établissement.

Généré le ${new Date().toLocaleString()}`;
        }
        function downloadOneProj(i) {
            const pr = projData[i];
            const blob = new Blob([ficheText(pr)], { type: 'text/plain;charset=utf-8' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = (pr.titre || 'fiche').replace(/[\\/:*?"<>|]/g, '_') + '.txt';
            a.click(); URL.revokeObjectURL(a.href);
        }
        function downloadAllProj() {
            if(projData.length === 0) { alert("Aucune fiche à télécharger"); return; }
            let all = "";
            projData.forEach((pr, i) => { all += `===== FICHE ${i+1} =====\n` + ficheText(pr) + "\n\n"; });
            const blob = new Blob([all], { type: 'text/plain;charset=utf-8' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = 'toutes_les_fiches_techniques.txt';
            a.click(); URL.revokeObjectURL(a.href);
        }
        function printOneProj(i) {
            const pr = projData[i]; if(!pr) return;
            const w = window.open('', '_blank', 'width=800,height=600');
            w.document.write(`<html><head><title>Fiche TP - ${pr.stg}</title><style>
                body{font-family:Arial;margin:20px;color:#222;line-height:1.6}
                h2{border-bottom:3px solid #006633;padding-bottom:5px;color:#006633;margin-bottom:15px}
                .lbl{font-weight:bold;color:#006633}
                table{width:100%;border-collapse:collapse;margin-top:10px}
                td,th{border:1px solid #333;padding:6px;text-align:left}
            </style></head><body>
                <h2>FICHE DE TRAVAUX PRATIQUES (TP)<br><span style="font-size:16px;color:#333;font-weight:normal">Fabrication d'un savon à base de glycérine et de cannelle — APC</span></h2>
                <table>
                    <tr><td class="lbl" style="width:30%">Stagiaire</td><td>${pr.stg || '-'}</td></tr>
                    <tr><td class="lbl">Spécialité</td><td>${pr.spec || '-'}</td></tr>
                    <tr><td class="lbl">Groupe</td><td>${pr.grp || '-'}</td></tr>
                    <tr><td class="lbl">Date</td><td>${pr.date || '-'}</td></tr>
                    <tr><td class="lbl">Note obtenue</td><td>${pr.qte || '-'} /20</td></tr>
                </table>
                <p style="margin-top:20px;font-style:italic">Document pédagogique modifiable - à adapter au niveau, à l'effectif et au référentiel de compétences de l'établissement.</p>
                <p><small>Imprimé le ${new Date().toLocaleString()}</small></p>
            </body></html>`);
            w.document.close(); w.focus(); w.print();
        }
        function printProj() {
            if(projData.length === 0) { alert("Aucune fiche à imprimer"); return; }
            const w = window.open('', '_blank', 'width=800,height=600');
            let rows = "";
            projData.forEach((pr, i) => {
                rows += `<tr><td>${i+1}</td><td><b>${pr.titre}</b></td><td>${pr.stg || '-'}</td><td>${pr.qte || '-'}</td><td>${pr.date || '-'}</td></tr>`;
            });
            w.document.write(`<html><head><title>Fiches Projet</title><style>
                body{font-family:Arial;margin:20px;color:#222}
                h2{border-bottom:3px solid #006633;padding-bottom:5px;color:#006633}
                table{border-collapse:collapse;width:100%}
                td,th{border:1px solid #333;padding:6px;text-align:left}
                th{background:#f0f0f0}
            </style></head><body>
                <h2>Liste des Fiches Projet</h2>
                <table><thead><tr><th>N°</th><th>Produit</th><th>Stagiaire</th><th>Quantité</th><th>Date</th></tr></thead><tbody>${rows}</tbody></table>
                <p><small>Total : ${projData.length} fiche(s) - Imprimé le ${new Date().toLocaleString()}</small></p>
            </body></html>`);
            w.document.close(); w.focus(); w.print();
        }

        // --- CONFIG ---
        function upImg(id, input) {
            const r = new FileReader();
            r.onload = (e) => { document.getElementById(id).src = e.target.result; localStorage.setItem('img_'+id, e.target.result); };
            r.readAsDataURL(input.files[0]);
        }
        function changeHeaderImg(id) {
            document.getElementById(id === 'imgLeft' ? 'fileLeft' : 'fileRight').click();
        }
        function loadImgs() {
            if(localStorage.getItem('img_imgLeft')) document.getElementById('imgLeft').src = localStorage.getItem('img_imgLeft');
            if(localStorage.getItem('img_imgRight')) document.getElementById('imgRight').src = localStorage.getItem('img_imgRight');
        }
        function toggleHeaderEdit(admin) {
            document.querySelectorAll('.photo-edit').forEach(el => el.classList.toggle('d-none', !admin));
        }
        function saveConfig() {
            const p = document.getElementById('cfgPrimary').value;
            const n = document.getElementById('cfgNav').value;
            const b = document.getElementById('cfgBody').value;
            localStorage.setItem('cfg_primary', p);
            localStorage.setItem('cfg_nav', n);
            localStorage.setItem('cfg_body', b);
            applyColors(p, n, b);
            const st = document.getElementById('cfgSubText').value;
            const ss = document.getElementById('cfgSubSize').value;
            localStorage.setItem('cfg_subtext', st);
            localStorage.setItem('cfg_subsize', ss);
            document.getElementById('subHeaderText').textContent = st;
            document.getElementById('subHeaderText').style.fontSize = ss + 'px';
            alert("Configuration et couleurs sauvegardéés !");
        }
        function resetConfig() {
            applyTheme('#006633','#2c3e50','#f4f7f6');
        }
        function applyTheme(p, n, b) {
            document.getElementById('cfgPrimary').value = p;
            document.getElementById('cfgNav').value = n;
            document.getElementById('cfgBody').value = b;
            applyColors(p, n, b);
            localStorage.setItem('cfg_primary', p);
            localStorage.setItem('cfg_nav', n);
            localStorage.setItem('cfg_body', b);
        }
        function previewColors() {
            applyColors(document.getElementById('cfgPrimary').value,
                        document.getElementById('cfgNav').value,
                        document.getElementById('cfgBody').value);
        }
        function applyColors(p, n, b) {
            const root = document.documentElement;
            root.style.setProperty('--primary-color', p);
            root.style.setProperty('--nav-bg', n);
            root.style.setProperty('--body-bg', b);
            document.body.style.backgroundColor = b;
        }
        function loadColors() {
            const p = localStorage.getItem('cfg_primary') || '#006633';
            const n = localStorage.getItem('cfg_nav') || '#2c3e50';
            const b = localStorage.getItem('cfg_body') || '#f4f7f6';
            document.getElementById('cfgPrimary').value = p;
            document.getElementById('cfgNav').value = n;
            document.getElementById('cfgBody').value = b;
            applyColors(p, n, b);
            if(!localStorage.getItem('cfg_primary')) {
                localStorage.setItem('cfg_primary', p);
                localStorage.setItem('cfg_nav', n);
                localStorage.setItem('cfg_body', b);
            }
        }
        function loadRecipe() {
            if(recipe.length && typeof renderRecipe === 'function') renderRecipe();
        }

        function loadSubHeader() {
            const st = localStorage.getItem('cfg_subtext');
            const ss = localStorage.getItem('cfg_subsize');
            if(st != null) { document.getElementById('subHeaderText').textContent = st; }
            if(ss != null) {
                document.getElementById('subHeaderText').style.fontSize = ss + 'px';
                const sl = document.getElementById('cfgSubSize'); if(sl) sl.value = ss;
                const lb = document.getElementById('cfgSubSizeLbl'); if(lb) lb.textContent = ss + ' px';
            }
            const inp = document.getElementById('cfgSubText'); if(inp && st != null) inp.value = st;
        }
        window.onload = function() { loadImgs(); loadColors(); loadSubHeader(); loadRecipe(); };
    