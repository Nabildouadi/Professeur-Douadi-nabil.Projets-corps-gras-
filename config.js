"use strict";
/*
=====================================================================
  CONFIGURATION VERCEL KV — SAUVEGARDE EN LIGNE (cloud)
=====================================================================

Ce fichier permet de sauvegarder TOUTES les données de votre projet
sur le stockage Vercel KV (Redis) quand le site est hébergé sur
Vercel. Votre site reste sur Vercel ; Vercel KV est simplement le
« cahier » où les données sont écrites, séparé du site lui-même.

SANS configuration, l'application fonctionne normalement mais les
données restent uniquement dans chaque navigateur (localStorage).
Dès que vous remplissez les 2 valeurs ci-dessous, toutes les données
sont partagées entre tous les visiteurs du site.

COMMENT OBTENIR SES VALEURS : (dans votre compte Vercel)
  1. Allez sur  https://vercel.com/dashboard  et connectez-vous.
  2. Ouvrez votre projet  « Professeur-Douadi-nabil.Projets... ».
  3. Dans le menu du haut : « Storage » (ou « Stockage »).
  4. Cliquez sur « Create Database » > choisissez  « KV »  (Redis).
  5. Donnez un nom, choisissez une région proche de vous, validez.
  6. Une fois la base créée, ouvrez l'onglet  « .env.local »
     (ou l'onglet « Connect » / « Variables »).
  7. Copiez les 2 valeurs affichées :
        - KV_REST_API_URL      -> COLLER DANS KV_URL
        - KV_REST_API_TOKEN    -> COLLER DANS KV_TOKEN
     (Ce sont les URL + jeton d'accès REST de votre base KV.)
  8. Retournez sur votre site : tout est maintenant sauvegardé sur
     le cloud automatiquement (☁️).

REMARQUE IMPORTANTE SUR LES FICHIERS :
  - modifiez ce fichier config.js sur VOTRE ORDINATEUR,
  - puis téléversez-le sur GitHub (Add file > Upload files)
    pour remplacer l'ancien, et Vercel redéploiera tout seul.

Si vous ne voulez pas encore utiliser le cloud, laissez les valeurs
« COLLER_ICI_... » inchangées : le site fonctionnera en local.
=====================================================================
*/

window.KV_CONFIG = {
  URL: "COLLER_ICI_VOTRE_KV_REST_API_URL",
  TOKEN: "COLLER_ICI_VOTRE_KV_REST_API_TOKEN",
  CLE: "sauvegarde"
};
