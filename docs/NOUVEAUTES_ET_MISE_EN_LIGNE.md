# Hoyo Cards : récapitulatif et mise en ligne

## Mise en ligne (à chaque nouvelle version)
1. Dézippez `astrolabe-site-v21b.zip` **par-dessus** votre dossier local du site (acceptez de remplacer). Votre fichier `config.js` n'est pas dans le zip : il reste intact.
2. Ouvrez GitHub Desktop : les fichiers modifiés apparaissent à gauche. Écrivez un titre (ex. « v13 ») puis **Commit to main**, puis **Push origin**.
3. Sur github.com, dépôt du site → onglet **Actions** → « Mise à jour » → **Run workflow** (met à jour cartes, raretés et données).
4. Supabase (une seule fois par nouveauté) → **SQL Editor** → collez le contenu de `supabase/schema_v6.sql` puis **Run** ; faites pareil avec `supabase/schema_v7.sql` (photos de profil).
5. Attendez 1 à 2 minutes, puis sur le site faites **Ctrl+F5** (sur mobile : fermez et rouvrez l'application).

## Ce qui a été ajouté depuis le début de Hoyo Cards
- v9 : Hoyo Cards, un site de cartes dans le site : boosters gratuits (1 toutes les 10 min, 10 en réserve), 5 jeux HoYoverse.
- v10 : boutique (éclats ✦ gagnés gratuitement), boosters par jeu et Prestige, succès, catalogue, ma collection, classement, combat automatique, sons, finitions Holo/Shiny/Dorée/Éclipse, vitrine sur le profil.
- v11 : images Genshin, habillage spectaculaire.
- v12 : raretés selon les tier lists actuelles, animation d'ouverture par univers, carte de la semaine, puce de réserve et compte à rebours, visuel de secours.
- v13 : tutoriel d'installation en application (iPhone, Android, ordinateur), nouveaux cadres de carte colorés par rareté avec pastille du jeu, finition en pastille, résumé du personnage, onglet Portfolio (couverture personnalisable, pages à tourner), photo de profil importée.
- v21 : Hoyo Cards accueille **Wuthering Waves** (60 persos), **Reverse: 1999** (121) et **Umamusume** (61) : boosters dédiés, scènes d’ouverture, rareté d’après les tier lists d’octobre 2026, descriptifs façon Pokédex, finitions Holo/Shiny/Dorée/Éclipse. Cartes plus belles (cadres, reflets, rayons à l’ouverture des belles cartes). **Correctif important** : la synchronisation cloud ne peut plus écraser vos cartes par une sauvegarde vide (cause des « 0 carte sur téléphone »). Les images des nouveaux jeux sont téléchargées par l’Action « cartes » (lancez-la une fois) ; sans image, la carte est dessinée.
- v20 : intro de bienvenue plus courte (2,5 s, passe toute seule, une fois toutes les 6 h), bandeau « Aujourd’hui » sur l’accueil (boosters prêts, récompense du jour, défis), filtres repliables sur mobile, accueil mobile compacté, onglet admin « Contenu signalé », images chargées à la demande, finitions visuelles.
- v19 : bouton ☁ de synchronisation des cartes (en haut de Hoyo Cards) qui indique si la sauvegarde marche ; un même compte sur 2 appareils compte pour 1 seul joueur en ligne.
- v18 : **les cartes sont sauvegardées dans le compte** : même collection sur téléphone et PC. SQL à exécuter une fois : `supabase/schema_v10.sql`. Ouvrez Hoyo Cards d'abord sur l'appareil qui a vos cartes.
- v17 : **Réseau social** (menu « Réseau social ») : publications avec image (build, guide, bug, question…), j'aime, commentaires, signalements ; **amis** (demande par nom d'utilisateur, bouton « + Ami » sur les profils publics) ; **chat** (salon général + messages privés entre amis) ; **joueurs en ligne** affichés en haut du site.
  - **SQL à exécuter une fois** : `supabase/schema_v9.sql` (Supabase > SQL Editor > Run). Le compteur « en ligne » n'a besoin d'aucun SQL.
  - Modération : les signalements arrivent dans la table `content_reports` (Table Editor) ; l'administrateur peut supprimer publications, commentaires et messages.
- v16 : Hoyo Cards, profil, paramètres et favoris exigent maintenant d'être connecté (sinon page « Connectez-vous »). Déconnecté, l'en-tête n'affiche plus que « Se connecter ».
- v15 : combats limités à 3 par semaine, économie d'éclats ralentie (boosters plus chers, récompenses réduites, quotidiennes qui reviennent chaque jour avec bonus de série), **Marché des joueurs** (échange/vente de doublons, commission 10 %), profil refait (onglets Aperçu / Vitrine / Star Rail / Cartes / Portfolio / Objectifs), **vitrine de cartes** choisie directement dans le site, page publique de profil refaite, probabilités des cartes dans « Statistiques », images Honkai Impact 3rd depuis le wiki Fandom (via GitHub Actions, voir ci-dessous).
  - **SQL à exécuter une fois** dans Supabase > SQL Editor : `supabase/schema_v8.sql` (marché). Sans cela, l'onglet Marché affiche « indisponible ».
  - Images Honkai Impact 3rd, Wuthering Waves, Reverse: 1999 et Umamusume : lancez le workflow « Actions » (Run workflow). Images © Fandom et ayants droit (Kuro Games, Bluepoch, Cygames, HoYoverse), non testé depuis mon environnement ; si Fandom bloque, les cartes restent dessinées.
- v14 : dos de carte aux couleurs du site, ouverture carte par carte façon Pokémon (booster qui se déchire), cartes d'ouverture agrandies, descriptif « Pokédex » des personnages (`data/card_desc.json`, 276 sur 362 pour l'instant), ajout automatique au portfolio avec filtres (jeu, rareté, finition), grand bandeau Hoyo Cards sur l'accueil, entrée « NEW » dans le menu et bouton flottant.
