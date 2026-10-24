# Astrolabe — site Honkai: Star Rail

Tier list, builds, cônes de lumière, reliques, end game, favoris et comptes. Site statique (aucun serveur à gérer), mis à jour automatiquement chaque lundi.

## Comment ça marche
- `scripts/update.py` récupère les données : personnages, cônes, reliques et images (StarRailRes), builds et équipes (HSR Optimizer, licence MIT), tier list et end game (Game8, classements seulement avec lien vers la source). Il écrit `data/data.json` et `img/`.
- Si une source tombe en panne ou change de format, le script garde les anciennes données au lieu de casser le site.
- `data/manual.json` : calendrier end game, descriptions des modes, liens de guides. **À modifier à la main à chaque version** (2 minutes, directement sur GitHub).
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
2. **SQL Editor → New query** : collez le contenu de `supabase/schema.sql` → **Run**.
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
