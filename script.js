
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
            showPage(p); renderGrille(); renderStg(); renderOilLib(); renderOilSelect(); renderRecipe(); renderProj(); fillStgSelect(); toggleHeaderEdit(isAdmin); loadSubHeader(); runSoap();
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
            let s100 = 0; document.getElementById('displayGTitle').innerText = mainT;
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
            document.getElementById('t100').innerText = s100; document.getElementById('t20').innerText = (s100/5).toFixed(2);
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
            projData.forEach((pr, i) => {
                tb.innerHTML += `<tr>
                    <td class="fw-bold">${pr.titre}</td><td>${pr.stg}</td><td>${pr.qte || '-'}</td><td>${pr.date || '-'}</td>
                    <td class="no-print">
                        <button onclick="viewProj(${i})" class="btn btn-sm btn-info p-0 px-1" title="Voir"><i class="bi bi-eye"></i></button>
                        <button onclick="editProj(${i})" class="btn btn-sm btn-warning p-0 px-1" title="Modifier"><i class="bi bi-pencil"></i></button>
                        <button onclick="delProj(${i})" class="btn btn-sm btn-danger p-0 px-1" title="Supprimer">X</button>
                        <button onclick="downloadOneProj(${i})" class="btn btn-sm btn-dark p-0 px-1" title="Télécharger"><i class="bi bi-download"></i></button>
                    </td></tr>`;
            });
            if(projData.length === 0) tb.innerHTML = `<tr><td colspan="5" class="text-center text-muted">Aucune fiche enregistrée.</td></tr>`;
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
            if(current) {
                const found = stData.findIndex(s => s.nom === current);
                if(found >= 0) sel.value = found;
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
            const pr = {
                titre: document.getElementById('projTitre').value,
                stg: document.getElementById('projStg').value,
                spec: document.getElementById('projSpec').value,
                grp: document.getElementById('projGrp').value,
                date: document.getElementById('projDate').value,
                qte: document.getElementById('projQte').value,
                ing: projIngredients.slice(),
                procTitre: document.getElementById('projProcTitre').value,
                steps: projSteps.slice(),
                mat: projMateriels.slice(),
                desc: document.getElementById('projDesc').value
            };
            if(!pr.titre) { alert("Le nom du produit est obligatoire"); return; }
            pr.photo = projPhotoData || "";
            // pièces jointes (document)
            const f = document.getElementById('projFile');
            if(f.files && f.files.length) {
                const r = new FileReader();
                r.onload = (e) => {
                    pr.file = e.target.result; pr.fname = f.files[0].name;
                    commitProj(idx, pr);
                };
                r.readAsDataURL(f.files[0]);
            } else {
                if(idx != "-1" && projData[idx]) { pr.file = projData[idx].file; pr.fname = projData[idx].fname; }
                commitProj(idx, pr);
            }
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
            document.getElementById('projTitre').value = pr.titre || "";
            document.getElementById('projStg').value = pr.stg || "";
            document.getElementById('projSpec').value = pr.spec || "";
            document.getElementById('projGrp').value = pr.grp || "";
            document.getElementById('projDate').value = pr.date || "";
            document.getElementById('projQte').value = pr.qte || "";
            projIngredients = (Array.isArray(pr.ing) ? pr.ing : [pr.ing]).filter(Boolean);
            document.getElementById('projProcTitre').value = pr.procTitre || "";
            projSteps = (pr.steps || []).slice();
            projMateriels = (Array.isArray(pr.mat) ? pr.mat : [pr.mat]).filter(Boolean);
            renderIng(); renderSteps(); renderMat();
            // rendre le select en lisibilité
            if(pr.stg) { const f = stData.findIndex(s => s.nom === pr.stg); const sel = document.getElementById('projStgSel'); if(sel && f>=0) sel.value = f; }
            document.getElementById('projDesc').value = pr.desc || "";
            document.getElementById('projEditIdx').value = i;
            document.getElementById('btnProjSave').innerText = "Update";
            document.getElementById('projDetail').classList.add('d-none');
            // charger la photo existante
            if(pr.photo) {
                projPhotoData = pr.photo;
                document.getElementById('projPhotoImg').src = pr.photo;
                document.getElementById('projPhotoPrev').classList.remove('d-none');
            } else {
                removeProjPhoto();
            }
        }
        function delProj(i) { projData.splice(i,1); localStorage.setItem('db_pr', JSON.stringify(projData)); renderProj(); }
        function clearProjForm() {
            ['projTitre','projStg','projSpec','projGrp','projDate','projQte','projDesc','projFile','projPhoto','projStep','projIngInp','projMatInp','projProcTitre'].forEach(id => {
                const el = document.getElementById(id); if(el) el.value = "";
            });
            projPhotoData = "";
            projSteps = [];
            projIngredients = [];
            projMateriels = [];
            document.getElementById('projStepIdx').value = "-1";
            document.getElementById('btnStepSave').innerText = "Ajouter";
            document.getElementById('projIngIdx').value = "-1";
            document.getElementById('btnIngSave').innerText = "Ajouter";
            document.getElementById('projMatIdx').value = "-1";
            document.getElementById('btnMatSave').innerText = "Ajouter";
            renderSteps(); renderIng(); renderMat();
            document.getElementById('projPhotoPrev').classList.add('d-none');
            document.getElementById('projPhotoImg').src = "";
            const psel = document.getElementById('projStgSel'); if(psel) psel.value = "-1";
            document.getElementById('projEditIdx').value = "-1";
            document.getElementById('btnProjSave').innerText = "Ajouter";
        }
        function viewProj(i) {
            const pr = projData[i];
            projDetailIdx = i;
            const b = document.getElementById('projDetailBody');
            let stepsHtml = "";
            if(pr.steps && pr.steps.length) {
                stepsHtml = `<p><b>${pr.procTitre || 'Procédé de fabrication'} :</b><ol>`;
                pr.steps.forEach(st => { stepsHtml += `<li>${st}</li>`; });
                stepsHtml += `</ol></p>`;
            }
            let ingHtml = "";
            if(Array.isArray(pr.ing) && pr.ing.length) {
                ingHtml = `<p><b>Ingrédients / Formulation :</b><ul>`;
                pr.ing.forEach(x => { ingHtml += `<li>${x}</li>`; });
                ingHtml += `</ul></p>`;
            }
            let matHtml = "";
            if(Array.isArray(pr.mat) && pr.mat.length) {
                matHtml = `<p><b>Matériel utilisé :</b><ul>`;
                pr.mat.forEach(x => { matHtml += `<li>${x}</li>`; });
                matHtml += `</ul></p>`;
            }
            b.innerHTML = `
                ${pr.photo ? `<div class="text-center mb-2"><img src="${pr.photo}" class="img-thumbnail" style="max-height:200px"></div>` : ''}
                <p><b>Produit :</b> ${pr.titre}</p>
                <p><b>Stagiaire :</b> ${pr.stg || '-'} (<b>Spécialité :</b> ${pr.spec || '-'}, <b>Groupe :</b> ${pr.grp || '-'})</p>
                <p><b>Date :</b> ${pr.date || '-'} &nbsp; <b>Quantité :</b> ${pr.qte || '-'}</p>
                ${ingHtml}
                ${stepsHtml}
                ${matHtml}
                ${pr.desc ? `<p><b>Présentation du produit :</b><br>${String(pr.desc).replace(/\n/g,'<br>')}</p>` : ''}
                ${pr.file ? `<p><b>Pièce jointe :</b> ${pr.fname || 'document'}<br><img src="${pr.file}" class="img-fluid mt-1" style="max-height:180px"></p>` : ''}
            `;
            document.getElementById('projDetail').classList.remove('d-none');
        }
        function ficheText(pr) {
            let steps = "-";
            if(pr.steps && pr.steps.length) {
                steps = pr.steps.map((s, i) => `${i+1}. ${s}`).join("\n");
            }
            let ings = "-";
            if(Array.isArray(pr.ing) && pr.ing.length) {
                ings = pr.ing.map((x, i) => `${i+1}. ${x}`).join("\n");
            }
            let mats = "-";
            if(Array.isArray(pr.mat) && pr.mat.length) {
                mats = pr.mat.map((x, i) => `${i+1}. ${x}`).join("\n");
            }
            return `PROJET DE FORMATION - FICHE TECHNIQUE & AFFICHE
============================================
NOM DU PRODUIT : ${pr.titre}
STAGIAIRE : ${pr.stg || '-'}
SPÉCIALITÉ : ${pr.spec || '-'}    GROUPE : ${pr.grp || '-'}
DATE : ${pr.date || '-'}
QUANTITÉ : ${pr.qte || '-'}

--------------------------------------------------------
INGRÉDIENTS / FORMULATION :
${ings}
--------------------------------------------------------
${pr.procTitre || 'PROCÉDÉ DE FABRICATION'} :
${steps}
--------------------------------------------------------
MATÉRIEL UTILISÉ :
${mats}
--------------------------------------------------------
PRÉSENTATION DU PRODUIT :
${pr.desc || '-'}
--------------------------------------------------------
Pièce jointe : ${pr.fname || '-'}

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
            let steps = (pr.steps || []).map((s, n) => `<li>${s}</li>`).join('');
            let ings = (Array.isArray(pr.ing) ? pr.ing : []).map((x, n) => `<li>${x}</li>`).join('');
            let mats = (Array.isArray(pr.mat) ? pr.mat : []).map((x, n) => `<li>${x}</li>`).join('');
            w.document.write(`<html><head><title>${pr.titre}</title><style>
                body{font-family:Arial;margin:20px;color:#222}
                h2{border-bottom:3px solid #006633;padding-bottom:5px;color:#006633}
                img{max-height:180px;border:1px solid #ccc;padding:4px}
                li{margin-bottom:4px}
                .lbl{font-weight:bold;color:#006633}
            </style></head><body>
                ${pr.photo ? `<img src="${pr.photo}">` : ''}
                <h2>FICHE PROJET - ${pr.titre}</h2>
                <p><span class="lbl">Stagiaire :</span> ${pr.stg || '-'} &nbsp; <span class="lbl">Spécialité :</span> ${pr.spec || '-'} &nbsp; <span class="lbl">Groupe :</span> ${pr.grp || '-'}</p>
                <p><span class="lbl">Date :</span> ${pr.date || '-'} &nbsp; <span class="lbl">Quantité :</span> ${pr.qte || '-'}</p>
                ${ings ? `<h4>Ingrédients / Formulation</h4><ul>${ings}</ul>` : ''}
                <h4>${pr.procTitre || 'Procédé de fabrication'}</h4><ol>${steps || '<li>-</li>'}</ol>
                ${mats ? `<h4>Matériel utilisé</h4><ul>${mats}</ul>` : ''}
                <h4>Présentation du produit</h4><p>${(pr.desc || '-').replace(/\n/g,'<br>')}</p>
                <p><span class="lbl">Pièce jointe :</span> ${pr.fname || '-'}</p>
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
    