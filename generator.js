#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Charger les configurations
const citiesConfig = JSON.parse(fs.readFileSync(path.join(__dirname, 'config', 'cities.json'), 'utf8'));
const professionsConfig = JSON.parse(fs.readFileSync(path.join(__dirname, 'config', 'professions.json'), 'utf8'));
const emailjsConfig = JSON.parse(fs.readFileSync(path.join(__dirname, 'config', 'emailjs.json'), 'utf8'));

/**
 * Fonction pour capitaliser la première lettre
 */
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Fonction pour obtenir l'adjectif du département
 */
function getDepartementAdjective(departement, capitalize = false) {
  const adjective = professionsConfig.departement_adjectives[departement] || 'locales';
  return capitalize ? adjective.charAt(0).toUpperCase() + adjective.slice(1) : adjective;
}

/**
 * Fonction pour générer les cartes de bénéfices
 */
function generateBenefitsCards(benefits, cssPrefix) {
  return benefits.map(benefit => `
                <div class="${cssPrefix}-benefit-card">
                    <div class="${cssPrefix}-benefit-icon">${benefit.icon}</div>
                    <h3 class="${cssPrefix}-benefit-title">${benefit.title}</h3>
                    <p class="${cssPrefix}-benefit-description">
                        ${benefit.description}
                    </p>
                </div>`).join('');
}

/**
 * Fonction pour générer la liste des fonctionnalités
 */
function generateFeaturesList(features, cssPrefix) {
  return features.map(feature => `
                        <li class="${cssPrefix}-feature-item">
                            <div class="${cssPrefix}-feature-icon">${feature.icon}</div>
                            <div class="${cssPrefix}-feature-content">
                                <h4>${feature.title}</h4>
                                <p>${feature.description}</p>
                            </div>
                        </li>`).join('');
}

/**
 * Fonction pour générer les cartes de témoignages
 */
function generateTestimonialsCards(testimonials, cssPrefix) {
  return testimonials.map(testimonial => `
                <div class="${cssPrefix}-testimonial-card">
                    <p class="${cssPrefix}-testimonial-quote">
                        "${testimonial.quote}"
                    </p>
                    <div class="${cssPrefix}-testimonial-author">
                        <div class="${cssPrefix}-testimonial-avatar">${testimonial.author_initials}</div>
                        <div class="${cssPrefix}-testimonial-info">
                            <h4>${testimonial.author_name}</h4>
                            <p>${testimonial.author_title}</p>
                        </div>
                    </div>
                </div>`).join('');
}

/**
 * Fonction pour remplacer les variables dans un texte
 */
function replaceVariables(text, variables) {
  let result = text;
  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(regex, value);
  }
  return result;
}

/**
 * Fonction principale pour générer une page
 */
function generatePage(citySlug, professionSlug) {
  // Trouver la ville
  const city = citiesConfig.cities.find(c => c.slug === citySlug);
  if (!city) {
    console.error(`❌ Ville "${citySlug}" non trouvée`);
    return null;
  }

  // Trouver la profession
  const profession = professionsConfig.professions[professionSlug];
  if (!profession) {
    console.error(`❌ Profession "${professionSlug}" non trouvée`);
    return null;
  }

  // Charger le template
  const templatePath = path.join(__dirname, 'templates', `${professionSlug}.html`);
  if (!fs.existsSync(templatePath)) {
    console.error(`❌ Template "${professionSlug}.html" non trouvé`);
    return null;
  }

  let template = fs.readFileSync(templatePath, 'utf8');

  // Préparer les variables de remplacement
  const cssPrefix = city.slug;
  const jsPrefix = city.slug;
  const departementAdjective = getDepartementAdjective(city.departement);
  const departementAdjectiveCapitalize = getDepartementAdjective(city.departement, true);

  const variables = {
    // Informations de la ville
    VILLE: city.name,
    VILLE_SLUG: city.slug,
    DEPARTEMENT: city.departement,
    DEPARTEMENT_CODE: city.departement_code,
    REGION: city.region,
    VOISIN_1: city.neighboring_cities[0] || '',
    VOISIN_2: city.neighboring_cities[1] || '',
    VOISIN_3: city.neighboring_cities[2] || '',
    VOISINES_LIST: city.neighboring_cities.join(', '),
    CODE_POSTAL: city.postal_code,

    // Adjectifs
    DEPARTEMENT_ADJECTIVE: departementAdjective,
    DEPARTEMENT_ADJECTIVE_CAPITALIZE: departementAdjectiveCapitalize,

    // Métier
    METIER: profession.name,
    METIER_TITLE: profession.metier_title,
    META_DESCRIPTION: profession.meta_description,

    // Préfixes CSS/JS
    CSS_PREFIX: cssPrefix,
    JS_PREFIX: jsPrefix,

    // EmailJS
    EMAILJS_USER_ID: emailjsConfig.emailjs.user_id,
    EMAILJS_SERVICE_ID: emailjsConfig.emailjs.service_id,
    EMAILJS_TEMPLATE_ID: emailjsConfig.emailjs.template_id,
    CONTACT_EMAIL: emailjsConfig.emailjs.contact_email,

    // Contenu Hero
    HERO_HIGHLIGHT: profession.hero_highlight,
    HERO_TITLE: replaceVariables(profession.hero_title, { VILLE: city.name, DEPARTEMENT: city.departement }),
    HERO_SUBTITLE: replaceVariables(profession.hero_subtitle, { VILLE: city.name, DEPARTEMENT: city.departement }),
    FORM_PLACEHOLDER: replaceVariables(profession.form_placeholder, { VILLE: city.name }),
    CTA_BUTTON: profession.cta_button,
    TRUST_BADGE: replaceVariables(profession.trust_badge, { DEPARTEMENT: city.departement }),

    // Section Pourquoi
    WHY_TITLE: replaceVariables(profession.why_title, { VILLE: city.name, CSS_PREFIX: cssPrefix }),
    WHY_SUBTITLE: replaceVariables(profession.why_subtitle, { DEPARTEMENT_ADJECTIVE: departementAdjective }),

    // Section Fonctionnalités
    FEATURES_TITLE: replaceVariables(profession.features_title, { DEPARTEMENT_ADJECTIVE: departementAdjective, CSS_PREFIX: cssPrefix }),
    FEATURES_SUBTITLE: replaceVariables(profession.features_subtitle, { DEPARTEMENT: city.departement }),

    // Mockup
    MOCKUP_TITLE: replaceVariables(profession.mockup_title, { DEPARTEMENT_ADJECTIVE_CAPITALIZE: departementAdjectiveCapitalize }),
    MOCKUP_TEXT: replaceVariables(profession.mockup_text, { VILLE: city.name, DEPARTEMENT: city.departement }),
    MOCKUP_BUTTON: profession.mockup_button,

    // Témoignages
    TESTIMONIALS_TITLE: replaceVariables(profession.testimonials_title, { DEPARTEMENT: city.departement, CSS_PREFIX: cssPrefix }),
    TESTIMONIALS_SUBTITLE: replaceVariables(profession.testimonials_subtitle, { DEPARTEMENT_ADJECTIVE: departementAdjective }),

    // CTA Final
    FINAL_CTA_TITLE: replaceVariables(profession.final_cta_title, { DEPARTEMENT: city.departement }),
    FINAL_CTA_TEXT: replaceVariables(profession.final_cta_text, { VILLE: city.name }),
    FINAL_CTA_BUTTON: profession.final_cta_button,

    // Email
    EMAIL_SUBJECT: replaceVariables(profession.email_subject, { VILLE: city.name }),
    EMAIL_MESSAGE_TEMPLATE: replaceVariables(profession.email_message_template, { VILLE: city.name })
  };

  // Générer les bénéfices
  const benefits = profession.benefits.map(b => ({
    icon: b.icon,
    title: replaceVariables(b.title, variables),
    description: replaceVariables(b.description, variables)
  }));
  variables.BENEFITS_CARDS = generateBenefitsCards(benefits, cssPrefix);

  // Générer les fonctionnalités
  const features = profession.features.map(f => ({
    icon: f.icon,
    title: replaceVariables(f.title, variables),
    description: replaceVariables(f.description, variables)
  }));
  variables.FEATURES_LIST = generateFeaturesList(features, cssPrefix);

  // Générer les témoignages
  const testimonials = profession.testimonials.map(t => ({
    quote: replaceVariables(t.quote, variables),
    author_initials: t.author_initials,
    author_name: t.author_name,
    author_title: replaceVariables(t.author_title, variables)
  }));
  variables.TESTIMONIALS_CARDS = generateTestimonialsCards(testimonials, cssPrefix);

  // Remplacer toutes les variables dans le template
  let output = replaceVariables(template, variables);

  return output;
}

/**
 * Fonction pour générer toutes les pages
 */
function generateAll() {
  console.log('🚀 Génération de toutes les pages...\n');

  let count = 0;
  const professions = Object.keys(professionsConfig.professions);

  citiesConfig.cities.forEach(city => {
    professions.forEach(professionSlug => {
      const html = generatePage(city.slug, professionSlug);
      if (html) {
        const outputDir = path.join(__dirname, 'output', professionSlug);
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true });
        }

        const outputPath = path.join(outputDir, `${city.slug}.html`);
        fs.writeFileSync(outputPath, html, 'utf8');
        console.log(`✅ ${professionSlug}/${city.slug}.html`);
        count++;
      }
    });
  });

  console.log(`\n✨ ${count} pages générées avec succès dans le dossier output/`);
}

/**
 * Fonction pour générer une seule page
 */
function generateSingle(citySlug, professionSlug) {
  console.log(`🚀 Génération de la page ${professionSlug} pour ${citySlug}...\n`);

  const html = generatePage(citySlug, professionSlug);
  if (html) {
    const outputDir = path.join(__dirname, 'output', professionSlug);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = path.join(outputDir, `${citySlug}.html`);
    fs.writeFileSync(outputPath, html, 'utf8');
    console.log(`✅ Page générée : ${outputPath}`);
  }
}

/**
 * Afficher l'aide
 */
function showHelp() {
  console.log(`
📚 Générateur de pages métier + ville

Usage:
  node generator.js                          Générer toutes les pages
  node generator.js --all                    Générer toutes les pages
  node generator.js <ville> <metier>         Générer une page spécifique
  node generator.js --help                   Afficher cette aide

Exemples:
  node generator.js                          Génère toutes les combinaisons
  node generator.js larochesuryon agence-web Génère la page agence web pour La Roche-sur-Yon
  node generator.js nantes agence-web        Génère la page agence web pour Nantes

Villes disponibles:
  ${citiesConfig.cities.map(c => c.slug).join(', ')}

Métiers disponibles:
  ${Object.keys(professionsConfig.professions).join(', ')}
`);
}

// Point d'entrée
const args = process.argv.slice(2);

if (args.length === 0 || args[0] === '--all') {
  generateAll();
} else if (args[0] === '--help' || args[0] === '-h') {
  showHelp();
} else if (args.length === 2) {
  generateSingle(args[0], args[1]);
} else {
  console.error('❌ Arguments invalides');
  showHelp();
  process.exit(1);
}
