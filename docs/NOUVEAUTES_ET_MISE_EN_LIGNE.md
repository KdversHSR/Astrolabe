# Foilvault : récapitulatif et mise en ligne

## Mise en ligne (à chaque nouvelle version)
1. Dézippez `astrolabe-site-v28.zip` **par-dessus** votre dossier local du site (acceptez de remplacer). Votre fichier `config.js` n'est pas dans le zip : il reste intact.
2. Ouvrez GitHub Desktop : les fichiers modifiés apparaissent à gauche. Écrivez un titre (ex. « v13 ») puis **Commit to main**, puis **Push origin**.
3. Sur github.com, dépôt du site → onglet **Actions** → « Mise à jour » → **Run workflow** (met à jour cartes, raretés et données).
4. Supabase (une seule fois par nouveauté) → **SQL Editor** → collez le contenu de `supabase/schema_v6.sql` puis **Run** ; faites pareil avec `supabase/schema_v7.sql` (photos de profil).
5. Attendez 1 à 2 minutes, puis sur le site faites **Ctrl+F5** (sur mobile : fermez et rouvrez l'application).

## Cette version (v24) : points importants
- **Images** : après la mise en ligne, lancez le workflow (étape 3) et laissez-le finir (jusqu'à 50 minutes la première fois : toutes les images sont refaites avec un meilleur cadrage). Ensuite, le fichier `data/img_report.json` du dépôt liste, jeu par jeu, les cartes qui n'ont toujours pas d'image.
- **Soutien (dons)** : ouvrez `data/support.json` et mettez votre lien Ko-fi / Liberapay / Tipeee / Buy Me a Coffee dans `"url"` (adresse en https://). Tant que `"url"` est vide, rien ne s'affiche. Rien ne se paie dans le jeu et aucun avantage n'est donné en échange.
- Le Portfolio est supprimé (les données restent dans les sauvegardes mais ne sont plus affichées).

## Ce qui a été ajouté depuis le début de Foilvault
- v9 : Foilvault, un site de cartes dans le site : boosters gratuits (1 toutes les 10 min, 10 en réserve), 5 jeux HoYoverse.
- v10 : boutique (éclats ✦ gagnés gratuitement), boosters par jeu et Prestige, succès, catalogue, ma collection, classement, combat automatique, sons, finitions Holo/Shiny/Dorée/Éclipse, vitrine sur le profil.
- v11 : images Genshin, habillage spectaculaire.
- v12 : raretés selon les tier lists actuelles, animation d'ouverture par univers, carte de la semaine, puce de réserve et compte à rebours, visuel de secours.
- v13 : tutoriel d'installation en application (iPhone, Android, ordinateur), nouveaux cadres de carte colorés par rareté avec pastille du jeu, finition en pastille, résumé du personnage, onglet Portfolio (couverture personnalisable, pages à tourner), photo de profil importée.
- v24 : nouveau nom **Foilvault** (ex-Hoyo Cards), accueil centré sur le jeu avec bloc communauté (offres du marché, top collectionneurs) et rappel Astrolabe, ouverture de booster embellie (cartes qui sortent du paquet, éclats, pilier de lumière), fond étoilé fixe, filtres modernes (Ma collection, Catalogue, Marché), classement avec podium, marché en vitrine, 5 combats par jour (1/2/4 ✦ par victoire), +45 succès, Portfolio supprimé, bloc de soutien optionnel, images : nouvelles sources (Fandom, AniList, Wikipédia, Enka), cadrage sans zoom, doublons Honkai Impact 3rd corrigés.
- v23 : ouverture des boosters repassée en 2D (rapide, ≈ 3 s), avec des effets selon la rareté : Rare (lueur + étincelles), Épique (rayons, onde, bandeau, tremblement), Légendaire / Dorée / Éclipse (flash, double onde, pluie d’étincelles, grand bandeau)
- v22 : boosters redessinés par jeu, nouvelles cartes (pleine image, secrètes dorées, Éclipse), 7 nouveaux jeux (Bleach BS, Dokkan, Endfield, FGO, Nikke, NTE, One Piece BR), bannière d’accueil animée, combats animés (≈7 s), vente de doublons filtrée avec confirmation, tri/filtres de collection, succès par catégorie, boutique groupée (×10), catalogue avec progression par jeu
- v21c : ouverture des boosters en vraie 3D (booster avec épaisseur qui suit la souris/le doigt, déchirure en volume, cartes avec tranche, retournement en arc, onde de choc pour les cartes rares).
- v21 : Foilvault accueille **Wuthering Waves** (60 persos), **Reverse: 1999** (121) et **Umamusume** (61) : boosters dédiés, scènes d’ouverture, rareté d’après les tier lists d’octobre 2026, descriptifs façon Pokédex, finitions Holo/Shiny/Dorée/Éclipse. Cartes plus belles (cadres, reflets, rayons à l’ouverture des belles cartes). **Correctif important** : la synchronisation cloud ne peut plus écraser vos cartes par une sauvegarde vide (cause des « 0 carte sur téléphone »). Les images des nouveaux jeux sont téléchargées par l’Action « cartes » (lancez-la une fois) ; sans image, la carte est dessinée.
- v20 : intro de bienvenue plus courte (2,5 s, passe toute seule, une fois toutes les 6 h), bandeau « Aujourd’hui » sur l’accueil (boosters prêts, récompense du jour, défis), filtres repliables sur mobile, accueil mobile compacté, onglet admin « Contenu signalé », images chargées à la demande, finitions visuelles.
- v19 : bouton ☁ de synchronisation des cartes (en haut de Foilvault) qui indique si la sauvegarde marche ; un même compte sur 2 appareils compte pour 1 seul joueur en ligne.
- v18 : **les cartes sont sauvegardées dans le compte** : même collection sur téléphone et PC. SQL à exécuter une fois : `supabase/schema_v10.sql`. Ouvrez Foilvault d'abord sur l'appareil qui a vos cartes.
- v17 : **Réseau social** (menu « Réseau social ») : publications avec image (build, guide, bug, question…), j'aime, commentaires, signalements ; **amis** (demande par nom d'utilisateur, bouton « + Ami » sur les profils publics) ; **chat** (salon général + messages privés entre amis) ; **joueurs en ligne** affichés en haut du site.
  - **SQL à exécuter une fois** : `supabase/schema_v9.sql` (Supabase > SQL Editor > Run). Le compteur « en ligne » n'a besoin d'aucun SQL.
  - Modération : les signalements arrivent dans la table `content_reports` (Table Editor) ; l'administrateur peut supprimer publications, commentaires et messages.
- v16 : Foilvault, profil, paramètres et favoris exigent maintenant d'être connecté (sinon page « Connectez-vous »). Déconnecté, l'en-tête n'affiche plus que « Se connecter ».
- v15 : combats limités à 3 par semaine, économie d'éclats ralentie (boosters plus chers, récompenses réduites, quotidiennes qui reviennent chaque jour avec bonus de série), **Marché des joueurs** (échange/vente de doublons, commission 10 %), profil refait (onglets Aperçu / Vitrine / Star Rail / Cartes / Portfolio / Objectifs), **vitrine de cartes** choisie directement dans le site, page publique de profil refaite, probabilités des cartes dans « Statistiques », images Honkai Impact 3rd depuis le wiki Fandom (via GitHub Actions, voir ci-dessous).
  - **SQL à exécuter une fois** dans Supabase > SQL Editor : `supabase/schema_v8.sql` (marché). Sans cela, l'onglet Marché affiche « indisponible ».
  - Images Honkai Impact 3rd, Wuthering Waves, Reverse: 1999 et Umamusume : lancez le workflow « Actions » (Run workflow). Images © Fandom et ayants droit (Kuro Games, Bluepoch, Cygames, HoYoverse), non testé depuis mon environnement ; si Fandom bloque, les cartes restent dessinées.
- v14 : dos de carte aux couleurs du site, ouverture carte par carte façon Pokémon (booster qui se déchire), cartes d'ouverture agrandies, descriptif « Pokédex » des personnages (`data/card_desc.json`, 276 sur 362 pour l'instant), ajout automatique au portfolio avec filtres (jeu, rareté, finition), grand bandeau Foilvault sur l'accueil, entrée « NEW » dans le menu et bouton flottant.

## v25
- Foilvault : 2 nouveaux jeux et boosters — **Persona 5: The Phantom X** (47 cartes) et **Bleach: Mirrors High** (30 cartes). Fichier `data/cards_games3.json`, généré par `scripts/newgames.py`.
- Nouvel onglet Astrolabe **Bleach : Mirrors High** (`#/bleach`) avec sa propre DA (noir/blanc/orange, uniquement sur cette page) : aperçu, tier list prévisionnelle (estimation), personnages, animé par arcs, système de jeu, événements (confirmé / probable, éditable dans `data/bmh.json`), calculateur d'invocations.
- Images : lancer Actions → Run workflow ; vérifier `data/img_report.json`.

## v26
- **Foilvault** remplace le nom Gachadex, avec sa propre identité visuelle (coffre-fort holographique : acier, hexagones, reflets irisés). Astrolabe et Bleach gardent la leur.
- Animations : les effets permanents des cartes légendaires sont figés hors de l'ouverture (ils ralentissaient la page quand la collection grossissait) ; mode allégé automatique sur mobile.
- Dokkan Battle retiré ; les joueurs qui avaient des cartes ou boosters Dokkan sont remboursés en éclats (10 ✦ par carte, 200 ✦ par booster).

## v27
- **Nouvelle ouverture « Rituel du coffre »** : on découpe le booster du doigt (ou d'un tap), les cartes se déploient face cachée (le halo trahit les plus rares), on les révèle une à une ou d'un coup, plan large pour épique et plus.
- **Page Bleach : Mirrors High** refaite (verre sombre, dégradés orange, grandes images d'arcs, « L'animé par arcs » en premier).
- **Menu** : Accueil (nouvelle page à 3 portes), Astrolabe, Foilvault, Bleach.
- **Images** : le script de cartes charge maintenant le casting complet des séries (Bleach, One Piece, Persona 5, Umamusume) et associe par nom exact ; toutes les images des wikis sont refaites au prochain passage d'Actions (`_v27.json`). Vérifiez `data/img_report.json` après.

## v28
- **Mobile comme une vraie application** (écrans ≤ 760 px uniquement ; PC et tablette inchangés) : barre du bas propre à chaque univers (Accueil / Astrolabe / Foilvault / Bleach) avec feuille « Plus », en-tête Foilvault compact, zones sûres iPhone (encoche, barre du bas), plein écran une fois installé, pas de zoom involontaire, cibles tactiles agrandies, vibrations sur Android pour les cartes rares.
- Installation : nouvelles icônes (Apple 180, maskable), raccourcis (Foilvault, Bleach, Tier list), scripts chargés en différé.
- **Fluidité PC + mobile** : fond étoilé, boosters, halos des cartes légendaires et en-têtes ne sont plus animés en permanence (charge au repos passée de 20-90 % à moins de 2 % sur les pages concernées) ; listes de cartes chargées par paquets de 60 au fil du défilement ; flou d'en-tête supprimé.

## v29 — mises à jour du lundi (Astrolabe, Foilvault, Bleach)
Le workflow « Mise à jour hebdomadaire » tourne déjà chaque lundi à 05:00 UTC (et à la main via Run workflow). Il fait maintenant :
1. **Astrolabe** : Game8 d'abord ; si Game8 bloque, **Prydwen** (https://www.prydwen.gg/star-rail/tier-list) en secours. Si les deux échouent, l'ancien classement reste.
2. **Bleach : Mirrors High** (`scripts/bmh_update.py`) : cherche des tier lists publiques, met à jour `data/bmh_tiers.json` si au moins 10 personnages sont reconnus, et inscrit la date de vérification sur la page. Pour imposer votre propre classement, ajoutez `"manual": true` dans ce fichier.
3. **Foilvault** : les images manquantes sont réessayées à chaque lundi ; un filtre qualité refuse désormais les images trop petites, les bannières, les aplats et les images quasi transparentes.
Limites : ces trois sources n'ont pas pu être testées depuis mon environnement (sites bloqués). Premier contrôle réel = premier Run workflow ; regardez `data/status.json`, `data/bmh.json` (champ `check`) et `data/img_report.json`.

## v30 — passage visuel (CSS uniquement, aucune donnée touchée)
Accueil : puces en losanges aux couleurs de chaque site, coins nets, statistiques alignées. Foilvault : niveau avec vraie barre de progression, récompense du jour mise en valeur (grand chiffre de série), vente de doublons rangée. Bleach : en-tête plus compact pour voir les arcs plus tôt. Global : en-tête opaque (plus de texte fantôme derrière), pastille Foilvault réduite sur ordinateur, focus clavier visible.

## v34–v35
- v34 : correctif de la grosse barre rouge (étiquette NOUVEAU étirée sur mobile pendant la mise en valeur d'une carte).
- v35 : 3 nouveaux jeux dans Foilvault (Blue Archive, Arknights, Azur Lane : 136 cartes, raretés estimées d'après la popularité ; images à récupérer via Run workflow, wikis Fandom) et « Albums par jeu » : à 25, 50, 75 et 100 % d'un jeu, on réclame des éclats et des boosters de ce jeu.

## v36
- Menu en deux niveaux : l'accueil ne montre que les 3 sites ; chaque site (Astrolabe, Foilvault, Bleach) a ensuite son propre menu.
- Foilvault : palette « Nuit & jade », barre de pitié (Légendaire garantie), cartes plus centrées sur l'illustration.
- Images ajoutées depuis des dépôts GitHub publics (script `scripts/gh_images.py`, lancé chaque lundi) : Blue Archive, Arknights, Azur Lane, Genshin, Zenless Zone Zero, Nikke (noms exacts seulement).

## v37 — Guides gacha (6 nouvelles pages)
Genshin Impact, Zenless Zone Zero, Wuthering Waves, Reverse: 1999, Neverness to Everness, Star Savior (page en préparation).
- Onglets de chaque jeu : Accueil, Personnages (filtres), fiches, Tier list, Équipes, Tirages (probabilités avec pitié et 50/50), Ma collection, Mécaniques & sources.
- Chaque jeu a sa propre direction artistique (couleurs, polices, illustration).
- Mise à jour du lundi : `scripts/gg_update.py` relit des tier lists publiques (Prydwen, genshin.gg). Les adresses n'ont pas pu être testées depuis mon environnement : si une source change, le classement précédent est conservé et la raison est écrite dans `data/gg_tiers.json` (champ `status`). Pour changer une source sans toucher au code : créer `data/gg_sources.json` (ex. `{"zzz":[["prydwen","https://..."]]}`).
- Tant qu'aucune source n'a répondu, les niveaux affichés sont l'estimation du site (popularité) et le site le dit.

## v38
- Onglet **Équipement** : armes et sets d'artéfacts (Genshin, en français), moteurs W et disques (ZZZ), avec icônes et effets. Source : dépôt open source genshin-optimizer (MIT), script `scripts/gg_equip.py` relancé chaque lundi. Pas de classement d'équipement (aucune source de tier list lisible trouvée).
- Onglet **Bannières & événements** : `scripts/gg_banners.mjs` utilise le paquet open source `gacha-calendar-core` (MIT) qui lit les annonces officielles/wikis chinois. Les textes restent en chinois. Non testé d'ici (réseau bloqué) : si une source ne répond pas, la page le dit.
- **Star Savior** : roster et tiers (44 personnages) recoupés à partir de deux tier lists publiques (ldshop.gg, driffle.com, juin 2026). Pas d'images.
- Wuthering Waves, Reverse: 1999, Neverness to Everness : pas de source d'équipement ni d'images trouvée pour le moment.
