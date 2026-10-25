# Hoyo Cards : récapitulatif et mise en ligne

## Mise en ligne (à chaque nouvelle version)
1. Dézippez `astrolabe-site-v13.zip` **par-dessus** votre dossier local du site (acceptez de remplacer). Votre fichier `config.js` n'est pas dans le zip : il reste intact.
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
