# 🚀 Générateur Métier + Ville

Outil d'automatisation pour générer des pages HTML de landing pages basées sur un template métier + ville. Parfait pour créer rapidement des pages SEO locales pour différentes villes et métiers.

## 📋 Fonctionnalités

- ✅ Génération automatique de pages HTML à partir de templates
- ✅ Support multi-villes et multi-métiers
- ✅ Variables dynamiques pour personnalisation complète
- ✅ Configuration centralisée (villes, métiers, EmailJS)
- ✅ Préfixes CSS/JS uniques par ville pour éviter les conflits
- ✅ Design responsive et moderne
- ✅ Intégration EmailJS pour formulaires de contact

## 🏗️ Structure du projet

```
generator-metier-ville/
├── config/
│   ├── cities.json          # Configuration des villes
│   ├── professions.json     # Configuration des métiers
│   └── emailjs.json         # Configuration EmailJS
├── templates/
│   └── agence-web.html      # Template pour agence web
├── output/                  # Dossier de sortie (généré)
│   └── agence-web/
│       ├── larochesuryon.html
│       ├── nantes.html
│       └── ...
├── generator.js             # Script générateur principal
├── package.json
└── README.md
```

## 🚦 Installation

1. Cloner le repository :
```bash
git clone <votre-repo>
cd generator-metier-ville
```

2. Aucune dépendance externe requise ! Le projet utilise uniquement Node.js natif.

## 📖 Utilisation

### Générer toutes les pages

Générer toutes les combinaisons ville × métier :

```bash
node generator.js
# ou
npm run generate
```

### Générer une page spécifique

Générer une seule page pour une ville et un métier :

```bash
node generator.js <ville-slug> <metier-slug>
```

Exemples :
```bash
node generator.js larochesuryon agence-web
node generator.js nantes agence-web
node generator.js paris agence-web
```

### Afficher l'aide

```bash
node generator.js --help
# ou
npm run help
```

## 🏙️ Villes disponibles

Le fichier `config/cities.json` contient actuellement :

- La Roche-sur-Yon (Vendée)
- Nantes (Loire-Atlantique)
- Angers (Maine-et-Loire)
- Paris (Paris)
- Lyon (Rhône)
- Marseille (Bouches-du-Rhône)
- Toulouse (Haute-Garonne)
- Bordeaux (Gironde)
- Lille (Nord)
- Rennes (Ille-et-Vilaine)

### Ajouter une ville

Éditez `config/cities.json` et ajoutez :

```json
{
  "name": "Votre Ville",
  "slug": "votreville",
  "departement": "Votre Département",
  "departement_code": "XX",
  "region": "Votre Région",
  "neighboring_cities": ["Ville1", "Ville2", "Ville3"],
  "postal_code": "XXXXX"
}
```

N'oubliez pas d'ajouter l'adjectif correspondant dans `config/professions.json` :

```json
"departement_adjectives": {
  "Votre Département": "adjectif-au-pluriel"
}
```

## 💼 Métiers disponibles

Actuellement disponible :
- **agence-web** : Agence de création de sites web

### Ajouter un nouveau métier

1. Créez un nouveau template dans `templates/votre-metier.html`
2. Ajoutez la configuration dans `config/professions.json`
3. Utilisez les variables dynamiques (voir ci-dessous)

## 🔧 Variables disponibles

### Variables de ville
- `{{VILLE}}` : Nom de la ville
- `{{VILLE_SLUG}}` : Slug de la ville (pour URLs)
- `{{DEPARTEMENT}}` : Nom du département
- `{{DEPARTEMENT_CODE}}` : Code du département
- `{{REGION}}` : Nom de la région
- `{{VOISIN_1}}`, `{{VOISIN_2}}`, `{{VOISIN_3}}` : Villes voisines
- `{{VOISINES_LIST}}` : Liste complète des villes voisines
- `{{CODE_POSTAL}}` : Code postal

### Variables d'adjectifs
- `{{DEPARTEMENT_ADJECTIVE}}` : Adjectif du département (ex: "vendéennes")
- `{{DEPARTEMENT_ADJECTIVE_CAPITALIZE}}` : Adjectif capitalisé (ex: "Vendéennes")

### Variables techniques
- `{{CSS_PREFIX}}` : Préfixe CSS unique par ville
- `{{JS_PREFIX}}` : Préfixe JS unique par ville

### Variables EmailJS
- `{{EMAILJS_USER_ID}}` : ID utilisateur EmailJS
- `{{EMAILJS_SERVICE_ID}}` : ID du service
- `{{EMAILJS_TEMPLATE_ID}}` : ID du template
- `{{CONTACT_EMAIL}}` : Email de contact

### Variables de contenu
Toutes définies dans `config/professions.json` :
- `{{HERO_TITLE}}`, `{{HERO_SUBTITLE}}`, etc.
- `{{WHY_TITLE}}`, `{{WHY_SUBTITLE}}`, etc.
- `{{FEATURES_TITLE}}`, `{{FEATURES_SUBTITLE}}`, etc.
- Et bien d'autres...

## 🎨 Personnalisation

### Modifier le design

Éditez directement le template HTML dans `templates/agence-web.html`. Les styles CSS sont intégrés dans le fichier.

### Modifier le contenu

Éditez `config/professions.json` pour changer :
- Les titres et sous-titres
- Les bénéfices et fonctionnalités
- Les témoignages
- Les textes de CTA

### Modifier EmailJS

Éditez `config/emailjs.json` avec vos identifiants EmailJS :

```json
{
  "emailjs": {
    "user_id": "votre_user_id",
    "service_id": "votre_service_id",
    "template_id": "votre_template_id",
    "contact_email": "votre@email.com"
  }
}
```

## 📤 Sortie

Les fichiers HTML générés sont créés dans le dossier `output/` :

```
output/
└── agence-web/
    ├── larochesuryon.html
    ├── nantes.html
    ├── paris.html
    └── ...
```

Chaque fichier est une page HTML complète, autonome et prête à être déployée.

## 🌐 Déploiement

Les pages générées peuvent être déployées sur :
- Serveur web classique (Apache, Nginx)
- Hébergement statique (Netlify, Vercel, GitHub Pages)
- WordPress (intégration HTML personnalisé)
- CDN (Cloudflare Pages, etc.)

## 💡 Exemples d'utilisation

### Générer toutes les pages pour une campagne SEO locale
```bash
node generator.js --all
```
Résultat : 10 villes × 1 métier = 10 pages HTML

### Générer une page pour un client spécifique
```bash
node generator.js nantes agence-web
```

### Ajouter une nouvelle ville et régénérer
1. Ajoutez la ville dans `config/cities.json`
2. Ajoutez l'adjectif dans `config/professions.json`
3. Exécutez : `node generator.js --all`

## 🐛 Debugging

Si une page ne se génère pas :
1. Vérifiez que le slug de la ville existe dans `config/cities.json`
2. Vérifiez que le slug du métier existe dans `config/professions.json`
3. Vérifiez que le template existe dans `templates/`
4. Consultez les messages d'erreur dans la console

## 🔐 Sécurité

- Ne commitez jamais vos vraies clés EmailJS dans un repo public
- Utilisez des variables d'environnement pour les données sensibles en production
- Le fichier `config/emailjs.json` devrait être ajouté à `.gitignore` en production

## 📝 Licence

MIT

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Commiter vos changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## 📞 Support

Pour toute question ou problème, ouvrez une issue sur GitHub.

---

Fait avec ❤️ par Web Starting
