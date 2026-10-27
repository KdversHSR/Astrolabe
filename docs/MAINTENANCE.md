# Astrolabe : guide d'installation et de maintenance

> Ce fichier regroupe les consignes techniques (Supabase, GitHub Actions, fichiers à mettre à jour). La présentation du projet est dans le [README](../README.md).


Tier list, builds, cônes de lumière, reliques, end game, favoris et comptes. Site statique (aucun serveur à gérer), mis à jour automatiquement chaque lundi.

## Comment ça marche
- `scripts/update.py` récupère les données : personnages, cônes, reliques et images (StarRailRes), builds et équipes (HSR Optimizer, licence MIT), tier list et end game (Game8, classements seulement avec lien vers la source). Il écrit `data/data.json` et `img/`.
- Si une source tombe en panne ou change de format, le script garde les anciennes données au lieu de casser le site.
- `data/manual.json` : calendrier end game, descriptions des modes, liens de guides. **À modifier à la main à chaque version** (2 minutes, directement sur GitHub).
- `data/banners.json` : bannières en cours (personnages, cônes, dates de début et de fin en UTC) et date de la prochaine version. **Les bannières sont maintenant récupérées automatiquement chaque lundi** (API communautaire Ennead). Ce fichier sert de secours si l’API ne répond pas, et contient les collaborations, la date de la prochaine version et son personnage (à mettre à jour à la main). Le site calcule tout seul les comptes à rebours.
- `data/events.json` : guides d’événements et de modes end game. Copiez le bloc « exemple » (il est masqué par `"hidden": true`) pour ajouter un événement avec dates, étapes, conseils et récompenses.
- `data/tier_notes.json` (facultatif) : pour afficher un badge d’éidolon particulier sur un personnage dans la tier list (par défaut **E0**, base du classement Game8). Exemple : `"Firefly": "E6"`.
- `data/tier_history.json` : géré automatiquement. Il garde les deux derniers classements pour afficher les flèches vertes (▲ monte), rouges (▼ baisse) et NEW. **Ne le modifiez pas.**
- `data/data_en.json` et `data/calc.json` : générés automatiquement (traduction anglaise, matériaux du calculateur).
- `data/versions.json` : résumés d’histoire par version (FR/EN). **À compléter à la main** à chaque nouvelle version : copiez un bloc, changez `v`, `t` (titre officiel), `d` (année-mois), `arc`, `fr`, `en`. `ok` : 0 à 3 (3 = vérifié).
- `data/curated_builds.json` : sets et équipes vérifiés à la main, utilisés quand la source n’en fournit pas.

## Mise en ligne (gratuit, environ 20 minutes)

### 1. Publier le site sur GitHub Pages
1. Créez un compte sur github.com, puis un dépôt **public** nommé `astrolabe`.
2. Envoyez-y tout le contenu de ce dossier (le dossier caché `.github` doit y être). Le plus simple, dans un terminal ouvert dans ce dossier :
   ```
   git init -b main
   git add -A
   git commit -m "Premier envoi"
   git remote add origin https://github.com/VOTRE-PSEUDO/astrolabe.git
   git push -u origin main
   ```
3. Sur GitHub : **Settings → Pages → Source : GitHub Actions**.
4. Onglet **Actions → Mise à jour hebdomadaire → Run workflow**. Attendez le rond vert (5 à 10 minutes).
5. Votre site est en ligne et public : `https://VOTRE-PSEUDO.github.io/astrolabe/`

### 2. Comptes et favoris (Supabase, gratuit)
1. Créez un compte sur supabase.com, puis **New project** (choisissez une région européenne).
2. **SQL Editor → New query** : collez le contenu de `supabase/schema.sql` → **Run**. Faites la même chose avec `supabase/schema_v2.sql` (profil et collection des joueurs), puis `supabase/schema_v3.sql` (profils publics, J'aime, signalements), puis `supabase/schema_v4.sql` (administration, retours des visiteurs, statistiques, équipes enregistrées), puis `supabase/schema_v5.sql` (suppression de compte/profil, protection de l’admin par 2FA), chacun dans une nouvelle requête et **dans cet ordre**.
3. **Project Settings → API** : copiez le *Project URL* et la clé *anon public*. Cette clé est faite pour être publique, la sécurité vient des règles du fichier SQL (chacun ne voit que ses favoris). Ne copiez jamais la clé *service_role*.
4. Collez les deux valeurs dans `config.js`, enregistrez, puis `git add -A && git commit -m "Config comptes" && git push`.
5. **Authentication → URL Configuration** : mettez l’adresse de votre site dans *Site URL* et dans *Redirect URLs*.
6. **Authentication → Providers → Email** : laissez la confirmation d’e-mail activée. Pour plus d’envois d’e-mails au-delà du quota gratuit, configurez un SMTP (Resend, Brevo…).
Les visiteurs sans compte gardent leurs favoris dans leur navigateur ; à la connexion, ils sont fusionnés avec le compte.

### 3. Mises à jour automatiques
- Le fichier `.github/workflows/update.yml` relance tout **chaque lundi à 05:00 UTC** : récupération des données, enregistrement dans le dépôt, redéploiement du site. Rien à faire.
- Pour forcer une mise à jour (nouvelle version du jeu) : **Actions → Run workflow**.
- Si une exécution échoue, GitHub vous envoie un e-mail ; le site reste en ligne avec les dernières données.
- À chaque nouvelle version : mettez à jour `data/manual.json` (version, calendrier) sur github.com (icône crayon).

### 4. Nom de domaine (facultatif)
Achetez un domaine, puis **Settings → Pages → Custom domain** et suivez les consignes DNS (enregistrement CNAME vers `VOTRE-PSEUDO.github.io`). Cochez *Enforce HTTPS*.

## Tester chez vous
```
pip install -r requirements.txt
python scripts/update.py
python -m http.server 8000     # puis ouvrez http://localhost:8000
```

## Points d’attention
- Les images et textes du jeu appartiennent à HoYoverse. Pour un site de fans non commercial c’est généralement toléré ; ajoutez des publicités ou une vente de services seulement après avoir vérifié leur politique.
- Game8 : le site ne reprend que le classement (noms et tiers), avec lien. Ne copiez pas leurs textes. Si vous voulez rester 100 % à l’abri, vous pouvez désactiver le scraping avec l’option `--no-scrape` dans le workflow et tenir `data/seed_tiers.json` à jour.
- Builds : ils viennent des préréglages communautaires de HSR Optimizer (MIT, auteur Fribbels). Gardez les crédits du pied de page.
- Environ 25 personnages n’ont pas de sets de reliques dans la source ; le site l’indique. Complétez-les dans `data/curated_builds.json` (noms anglais) si vous le souhaitez.

## Fonctions du site
Menu à gauche et recherche rapide (Ctrl + K), version **français / anglais**, tier list sur l’échelle **T0 → T4** (équivalences Game8 : SS = T0, S+ = T0.5, S = T1, A = T2, B = T3, C = T4), résumé de version, centre d’aide, tier list (vue d’ensemble, par rôle, Memory of Chaos, Pure Fiction, Apocalyptic Shadow) avec badges d’éidolon, éléments, voies et flèches de tendance, fiches personnage à onglets, cônes, reliques, comparateur, **calculateur de ressources**, **planificateur de tirages** (probabilités avec pity et 50/50), **équipes** enregistrables et partageables par lien, **statistiques** anonymes de la communauté, bannières avec comptes à rebours, événements, profil joueur et profils publics.

## Administration
1. Créez votre compte sur le site, puis dans Supabase → SQL Editor, lancez (en remplaçant l’adresse par la vôtre) :
   `insert into public.admins (user_id) select id from auth.users where email = 'VOTRE-ADRESSE' on conflict do nothing;`
2. Reconnectez-vous : une entrée **Administration** apparaît dans le menu (`#/admin`). Elle liste les retours des visiteurs (bouton « Signaler » en haut du site), les erreurs détectées automatiquement et les signalements de profils, avec les actions *marquer traité*, *supprimer* et *masquer le profil*.
3. Personne d’autre ne peut lire ces données : c’est la base de données qui l’impose, pas le site.

## Communauté et modération
Les profils publics sont désactivés par défaut. Les signalements arrivent dans la page Administration du site (et dans Supabase → Table Editor → `reports`). Pour masquer un profil abusif, utilisez le bouton « Masquer ce profil » de la page Administration.

## Connexion Discord et double authentification
- **2FA** : Supabase → Authentication → Multi-Factor : vérifiez que « TOTP » est activé. Ensuite chaque joueur l’active dans Mon profil → Paramètres → Sécurité du compte (QR code à scanner avec Google Authenticator, Authy…). Si l’administrateur l’active, la base exige le code pour toute action d’administration.
- **Discord** : https://discord.com/developers/applications → New Application → OAuth2 : copiez Client ID et Client Secret, et ajoutez dans *Redirects* l’adresse « Callback URL » indiquée par Supabase (Authentication → Providers → Discord). Collez Client ID/Secret dans Supabase, activez le fournisseur, puis ajoutez l’adresse de votre site dans Authentication → URL Configuration.

## Suppression de comptes
- Chaque joueur peut supprimer son profil public ou son compte entier (Mon profil → Paramètres → Zone sensible).
- L’administrateur peut supprimer un profil ou un compte (page Administration → signalements, et sur la page d’un profil public). Un administrateur ne peut pas être supprimé par ce biais.

## Équipes classées et fiches personnage
- La **Tier list des équipes** est calculée par le site (tiers Game8 des membres + équipes conseillées par HSR Optimizer) : ce n’est pas un classement publié par un autre site.
- Les onglets Stats, Dégâts et le curseur de niveau des compétences utilisent les chiffres du jeu (StarRailRes). Le simulateur de dégâts est une estimation d’un seul coup.


## Nouveautés v7
- **Paramètres** dans le menu de gauche : thème, couleur d’accent, taille du texte, densité, animations, langue, fuseau des dates, échelle de la tier list, éidolon par défaut, spoilers, page d’ouverture, compte (profil, sécurité, suppression) et export/import de vos données.
- **Équipes à 4** : si HSR Optimizer en liste moins de 4, le site complète avec une suggestion (case en pointillés).
- **Accueil** retravaillé (routine du jour enregistrée sur l’appareil) et menu coloré.
- **Résumé de version** illustré : `data/versions.json` (champs `hero`, `chars`, `cn`, `nf`, `ne`).

## Ce qui est automatique chaque lundi
Personnages, cônes, reliques, builds, équipes, tier list (Game8), images, flèches de tendance et **bannières**. Reste manuel : résumés d’histoire (`versions.json`), guides (`manual.json`), prochaine version (`banners.json › next`).

## Nouveautés v7.1
- **Statut des données** (page Aides et page Admin) : lit `data/status.json`, écrit à chaque mise à jour. Alerte si la tier list ou les bannières n’ont pas pu être rafraîchies, ou si les données ont plus de 9 jours. En cas d’échec du workflow, une *issue* « La mise à jour automatique a échoué » est créée sur GitHub (et GitHub vous écrit par e-mail).
- **Rappels de bannières** : bouton « Me rappeler 24 h avant la fin » (fichier calendrier .ics + notification si le site est ouvert).
- **Simulateur de tirages** sous le planificateur.
- **Mes équipes possibles** : équipes complètes, « presque prêtes » et personnages à tirer en priorité, d’après votre collection.
- **Synergie d’équipe** (score indicatif, rôles, alternatives) sur la page d’une équipe.
- **Application installable** (PWA : `manifest.webmanifest`, `sw.js`, icônes dans `img/`) avec mode hors-ligne.
- **Succès** sur le profil (et sur les profils publics, d’après les statistiques publiées).

## Équipes calculées (v7.2)
Le site calcule lui-même des équipes à partir de la synergie des kits (éléments, voies, mots-clés des compétences : Allégresse, DoT, Rupture, mémosprites…), du niveau de tier et des équipes de HSR Optimizer. Elles s’affichent sur la fiche de chaque personnage (« Équipes calculées par le site »), avec l’étiquette « calculée », et complètent la tier list des équipes. Ce n’est pas une IA en ligne ni une simulation de combat.

## Calendrier end game
Le calendrier (Memory of Chaos, Pure Fiction, Apocalyptic Shadow, Anomaly Arbitration) est maintenant récupéré chaque lundi via l’API ; `manual.json › schedule` ne sert plus que de secours.

## Prochaine version : teaser (v7.3)
La carte « Prochaine version » de l’accueil affiche le personnage à venir ; un clic ouvre la page `#/next` (ce qui est confirmé ou non, contexte, compte à rebours, sources). Les infos viennent de `data/banners.json › next` (champs `name`, `path`, `element`, `rarity`, `confirmed`, `story_fr/en`, `sources`). Chaque lundi, le workflow : (1) prend la vraie date dès que l’API des bannières annonce la bannière ; (2) relie le personnage à la base dès qu’il y est ajouté, ce qui affiche son art et son kit. L’histoire de la version, elle, reste à écrire à la main quand elle est annoncée.

## Aperçu de partage (v7.4)
Quand on colle le lien du site sur Discord, X ou WhatsApp, une carte avec le logo s’affiche (`img/og.jpg`). L’adresse complète du site est insérée automatiquement par le workflow (remplace `__SITE_URL__` dans `index.html`).

## Connexion Discord : activer ou désactiver
Elle est **désactivée** par défaut (inscription par e-mail uniquement). Pour la réactiver : dans `app.js`, remplacez `const USE_DISCORD = false;` par `true`, après avoir configuré Discord dans Supabase.

## Mentions légales et crédits (v7.6)
Pages `#/legal` (mentions légales + confidentialité) et `#/credits`, liées en bas du menu et dans la fenêtre de création de compte. Pour afficher votre pseudo et un contact public, remplissez `legal.editor` et `legal.contact` dans `data/manual.json` (facultatif). Game8 bloque les robots de GitHub : la tier list se met à jour à la demande (écrire à Claude « mets à jour la tier list »), la date de dernière vérification est dans `seed_tiers.json` et dans « Statut des données ».

## Nouveautés v8
- **Polices** : Cinzel / Jost / Rajdhani, hébergées dans `fonts/` (copiées par le workflow). Ce sont les alternatives libres les plus proches du style du jeu ; la police officielle n'est pas disponible.
- **Actualités du bandeau** : `data/manual.json › news`.
- **End game** : `data/manual.json › endgame › modes › moc|pf|as|aa` (phase, date de fin, boss, astuces). À mettre à jour à chaque changement de phase (~6 semaines). Pour afficher une image de boss, déposez-la dans `img/boss/` et ajoutez `"img": "img/boss/nom.webp"` au boss concerné.
- **Tier list équipement** (`#/gear/lc`) : calculée par le site à partir des builds, sans source externe.

## Nouveautés v9
- **Rappels** : bannières, événements (page Événements) et phases End game (`manual.json › endgame › modes › X › until_iso`, à mettre à jour avec la phase).
- **Évaluateur de reliques** (`#/relic`), **image de build** (bouton dans l'onglet Build), **compte à rebours** (`#/calendar`) : calculés par le site, sans source externe. La liste « absents depuis le plus longtemps » vient de `data/versions.json` et n'est pas une annonce de rediffusion.
- **Mobile** : barre de navigation en bas de l'écran sous 760 px.

## Gachadex (cartes à collectionner)
- Les personnages viennent de `data/cards.json`, reconstruit chaque semaine par `scripts/cards.py` (HSR : données du site ; Genshin et ZZZ : liste publique EnkaNetwork ; Honkai Impact 3rd et Tears of Themis : `data/cards_extra.json`, à compléter à la main).
- Pour ajouter un personnage : ajoutez une ligne dans `data/cards_extra.json` (id unique, jeu `g`, noms `n`/`ne`, rareté `r` = 4 ou 5, élément `e`).
- Images : HSR a ses portraits. Pour les autres jeux, le script tente de télécharger des illustrations dans `img/cards/` ; sinon la carte est dessinée (initiale + motif). Vous pouvez déposer vous-même `img/cards/<id>.webp` (même id que dans cards.json).
- Vitrine publique dans la Communauté : exécutez une fois `supabase/schema_v6.sql` dans Supabase (SQL Editor → Run). Sans cela, tout fonctionne, mais la vitrine reste visible uniquement par vous.
- Les cartes sont enregistrées dans le navigateur du joueur (export/import dans l'onglet Boosters). Rien n'est vérifié côté serveur : c'est un jeu pour le plaisir.

### Gachadex v2 (boutique, succès, classement)
- Monnaie : les « éclats » ✦, 100 % gratuits (connexion quotidienne, 3 défis par jour, combats, vente des doublons, succès). Aucune vraie monnaie.
- Boosters : 1 général gratuit toutes les 10 min (10 max), et en boutique : général 100 ✦, par jeu 150 ✦, Prestige 350 ✦. Les prix sont dans la constante PRICE de app.js (p14.js).
- Classement : lit les profils publics Supabase (colonne `cards`, voir schema_v6.sql). Sans Supabase, seul le rang personnel s'affiche.
- Sons : générés par le navigateur (aucun fichier), bouton 🔊 dans l'en-tête de Gachadex.
- Images des cartes : `python scripts/cards.py --art` télécharge les portraits Genshin (dépôt GitHub public miao-plugin) et tente ceux de Zenless Zone Zero (EnkaNetwork) ; Honkai Impact 3rd n'a pas de source libre trouvée : ses cartes restent dessinées. Vous pouvez déposer `img/cards/<id>.webp` à la main.

## Gachadex : raretés selon les tier lists
- `data/card_tiers.json` contient les tier lists (HSR : calculées depuis `data/data.json` ; Genshin et ZZZ : genshin.gg ; Honkai 3rd : game.guide, 22 oct. 2026).
- `python scripts/cards.py` (aussi lancé par la mise à jour hebdomadaire) écrit pour chaque carte un champ `q` : 4 = Légendaire … 0 = Commune. Tier la plus haute = Légendaire, la plus basse = Commune.
- Pour mettre à jour une tier list : modifier les noms dans `card_tiers.json`, relancer le workflow. Les personnages absents des listes (très récents) gardent une rareté tirée au hasard (stable) selon leurs étoiles.
- Les cartes déjà obtenues par les joueurs gardent leur identifiant : seule leur rareté affichée change.
