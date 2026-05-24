/* ============================================================
   LinguaFlow – Internationalization (DE / EN / FR)
   ============================================================ */

'use strict';

const Translations = {
  de: {
    'nav.about': 'Über mich',
    'nav.courses': 'Kurse',
    'nav.pricing': 'Preise',
    'nav.login': 'Anmelden',
    'nav.book': 'Jetzt buchen',
    'hero.tag': '#1 Online-Sprachtrainer',
    'hero.h1': 'Sprich <span>Englisch &amp; Französisch</span> – flüssig und selbstsicher',
    'hero.p': 'Persönliche 1:1-Stunden mit Ralph Terhardt, KI-gestützte Ausspracheanalyse und ein flexibles Buchungssystem, das sich deinem Alltag anpasst.',
    'hero.cta1': '<i class="fas fa-play-circle"></i> Kostenlos testen',
    'hero.cta2': 'Mehr erfahren <i class="fas fa-arrow-down"></i>',
    'hero.card.title': 'Deine nächste Stunde',
    'hero.card.sub': 'Live-Video mit deinem Trainer',
    'hero.stat.students': 'Schüler',
    'hero.stat.rating': 'Bewertung',
    'hero.stat.exp': 'Erfahrung',
    'hero.stat.success': 'Erfolgsquote',
    'hero.badge1': 'Stunde bestätigt – Morgen 17:00',
    'hero.badge2': 'Aussprache: +12% diese Woche',
    'feat.tag': 'Warum LinguaFlow?',
    'feat.h2': 'Alles was du brauchst, um eine Sprache wirklich zu lernen',
    'feat.p': 'Modernes Lernen kombiniert mit persönlicher Betreuung – für echte Ergebnisse.',
    'feat.1.title': 'Live Video-Unterricht',
    'feat.1.p': 'Persönliche 1:1-Stunden direkt im Browser – ohne App-Download. HD-Video, klares Audio und interaktive Materialien.',
    'feat.2.title': 'KI-Ausspracheanalyse',
    'feat.2.p': 'Unsere KI hört dir zu, analysiert deine Aussprache in Echtzeit und zeigt dir genau, welche Laute du verbessern kannst.',
    'feat.3.title': 'Flexible Terminbuchung',
    'feat.3.p': 'Buche Stunden wann immer es dir passt – morgens, abends oder am Wochenende. Einfache Online-Buchung in Minuten.',
    'feat.4.title': 'Lernfortschritt tracken',
    'feat.4.p': 'Detaillierte Berichte nach jeder Stunde. Sieh genau, wie dein Vokabular, deine Grammatik und Aussprache wachsen.',
    'feat.5.title': 'Hausaufgaben & Übungen',
    'feat.5.p': 'Maßgeschneiderte Aufgaben zwischen den Stunden, abgestimmt auf dein Level und deine Lernziele.',
    'feat.6.title': 'Kostenlose Probestunde',
    'feat.6.p': 'Überzeug dich selbst! Buche deine erste Stunde kostenlos und erlebe, wie effektiv das LinguaFlow-System ist.',
    'about.tag': 'Über mich',
    'about.h2': 'Dein Trainer für Englisch &amp; Französisch',
    'about.p1': 'Hallo! Ich bin Ralph Terhardt – zertifizierter Sprachtrainer mit über 8 Jahren Erfahrung im Online- und Präsenzunterricht.',
    'about.p2': 'Mein Unterrichtsansatz verbindet klassische Methodik mit modernen Technologien: KI-gestützte Ausspracheanalyse, interaktive Materialien und eine warme, unterstützende Lernumgebung.',
    'about.p3': 'Ob du für eine Reise, den Job, ein Examen oder einfach aus Leidenschaft lernst – ich passe den Unterricht an deine Ziele und deinen Alltag an.',
    'about.trainer': 'Zertifizierter Sprachtrainer',
    'about.exp': 'Jahre Erfahrung',
    'courses.tag': 'Kursangebot',
    'courses.h2': 'Welche Sprache möchtest du lernen?',
    'courses.p': 'Von Anfänger bis Fortgeschrittene – alle Levels, alle Ziele.',
    'courses.en.sub': 'Britisches & Amerikanisches Englisch',
    'courses.fr.sub': 'Pariser & Allgemeines Français',
    'courses.price': 'ab €39 <span>/ Stunde</span>',
    'courses.book': 'Buchen',
    'courses.en.f1': 'Allgemein-Englisch & Konversation',
    'courses.en.f2': 'Business-Englisch & Präsentationen',
    'courses.en.f3': 'Prüfungsvorbereitung (IELTS, TOEFL, CAE)',
    'courses.en.f4': 'Aussprache & Akzentreduzierung',
    'courses.en.f5': 'Schreiben & E-Mail-Korrespondenz',
    'courses.fr.f1': 'Allgemein-Französisch & Konversation',
    'courses.fr.f2': 'Reise-Französisch & Kultur',
    'courses.fr.f3': 'DELF/DALF Prüfungsvorbereitung',
    'courses.fr.f4': 'Französische Phonetik & Nasallaute',
    'courses.fr.f5': 'Lesen & Hörverständnis',
    'test.tag': 'Erfahrungen',
    'test.h2': 'Was meine Schüler sagen',
    'test.p': 'Echte Meinungen von Menschen, die ich begleiten durfte.',
    'test.1.text': '„Ralph hat mir geholfen, meinen IELTS-Test mit Band 8.0 zu bestehen. Seine Methode ist sehr strukturiert, aber gleichzeitig macht es richtig Spaß. Die KI-Ausspracheanalyse ist der absolute Gamechanger!"',
    'test.1.name': 'Lena Müller',
    'test.1.sub': 'Englisch B2 → C1 · München',
    'test.2.text': '„Ich lerne seit 6 Monaten Französisch bei Ralph und bin beeindruckt, wie schnell meine Fortschritte sind."',
    'test.2.name': 'Felix Krause',
    'test.2.sub': 'Französisch A2 → B1 · Hamburg',
    'test.3.text': '„Für mein Job-Interview auf Englisch hat mir Ralph in nur 4 Wochen so viel gebracht."',
    'test.3.name': 'Sarah Beck',
    'test.3.sub': 'Business-Englisch · Berlin',
    'price.tag': 'Preise',
    'price.h2': 'Transparente Preise, kein Kleingedrucktes',
    'price.p': 'Wähle das Paket, das zu dir passt. Jederzeit kündbar.',
    'price.popular': 'Beliebteste Wahl',
    'price.starter': 'Starter',
    'price.starter.period': 'pro Stunde',
    'price.pro': 'Pro',
    'price.pro.period': 'pro Monat · 4 Stunden',
    'price.premium': 'Premium',
    'price.premium.period': 'pro Monat · 8 Stunden',
    'price.cta.starter': 'Starten',
    'price.cta.pro': 'Jetzt buchen',
    'price.cta.premium': 'Premium wählen',
    'price.f.lang1': '1 Sprache (Englisch oder Französisch)',
    'price.f.video': 'Live Video-Unterricht',
    'price.f.materials': 'Digitale Lernmaterialien',
    'price.f.progress': 'Fortschrittsberichte',
    'price.f.progress2': 'Detaillierte Fortschrittsberichte',
    'price.f.progress3': 'Ausführliche Lernberichte',
    'price.f.ai': 'KI-Ausspracheanalyse',
    'price.f.hw': 'Hausaufgaben-Feedback',
    'price.f.hw2': 'Wöchentliches Hausaufgaben-Feedback',
    'price.f.hw3': 'Tägliches Feedback & Support',
    'price.f.priority': 'Priority-Buchung',
    'price.f.priority2': 'Priority-Buchung & Flexibilität',
    'price.f.lang2': '1 oder 2 Sprachen',
    'price.f.lang3': 'Beide Sprachen inklusive',
    'price.f.materials2': 'Alle Lernmaterialien',
    'footer.desc': 'Deine Plattform für Online-Sprachunterricht in Englisch und Französisch. Persönlich, modern und effektiv.',
    'footer.courses': 'Kurse',
    'footer.platform': 'Plattform',
    'footer.contact': 'Kontakt',
    'footer.hours': 'Mo–Sa 8–21 Uhr',
    'footer.location': 'Deutschland, Online',
    'footer.copy': '© 2025 LinguaFlow – Ralph Terhardt. Alle Rechte vorbehalten.',
    'footer.privacy': 'Datenschutz',
    'footer.imprint': 'Impressum',
    'footer.terms': 'AGB',
  },

  en: {
    'nav.about': 'About',
    'nav.courses': 'Courses',
    'nav.pricing': 'Pricing',
    'nav.login': 'Log in',
    'nav.book': 'Book now',
    'hero.tag': '#1 Online Language Trainer',
    'hero.h1': 'Speak <span>English &amp; French</span> – fluently and confidently',
    'hero.p': 'Personal 1:1 lessons with Ralph Terhardt, AI-powered pronunciation analysis, and a flexible booking system that fits your schedule.',
    'hero.cta1': '<i class="fas fa-play-circle"></i> Try for free',
    'hero.cta2': 'Learn more <i class="fas fa-arrow-down"></i>',
    'hero.card.title': 'Your next lesson',
    'hero.card.sub': 'Live video with your trainer',
    'hero.stat.students': 'Students',
    'hero.stat.rating': 'Rating',
    'hero.stat.exp': 'Experience',
    'hero.stat.success': 'Success rate',
    'hero.badge1': 'Lesson confirmed – Tomorrow 17:00',
    'hero.badge2': 'Pronunciation: +12% this week',
    'feat.tag': 'Why LinguaFlow?',
    'feat.h2': 'Everything you need to truly learn a language',
    'feat.p': 'Modern learning combined with personal guidance – for real results.',
    'feat.1.title': 'Live Video Lessons',
    'feat.1.p': 'Personal 1:1 lessons directly in your browser – no app download needed.',
    'feat.2.title': 'AI Pronunciation Analysis',
    'feat.2.p': 'Our AI listens to you, analyses your pronunciation in real time.',
    'feat.3.title': 'Flexible Scheduling',
    'feat.3.p': 'Book lessons whenever it suits you.',
    'feat.4.title': 'Track Your Progress',
    'feat.4.p': 'Detailed reports after every lesson.',
    'feat.5.title': 'Homework & Exercises',
    'feat.5.p': 'Tailor-made tasks between lessons.',
    'feat.6.title': 'Free Trial Lesson',
    'feat.6.p': 'Book your first lesson for free.',
    'about.tag': 'About me',
    'about.h2': 'Your trainer for English &amp; French',
    'about.p1': "Hi! I'm Ralph Terhardt – a certified language trainer with over 8 years of experience.",
    'about.p2': 'My teaching approach combines classical methodology with modern technology.',
    'about.p3': "Whether you're learning for travel, work, an exam or simply out of passion – I adapt my lessons to your goals.",
    'about.trainer': 'Certified Language Trainer',
    'about.exp': 'Years of experience',
    'courses.tag': 'Course offer',
    'courses.h2': 'Which language do you want to learn?',
    'courses.p': 'From beginner to advanced – all levels, all goals.',
    'courses.en.sub': 'British & American English',
    'courses.fr.sub': 'Parisian & General French',
    'courses.price': 'from €39 <span>/ hour</span>',
    'courses.book': 'Book',
    'courses.en.f1': 'General English & Conversation',
    'courses.en.f2': 'Business English & Presentations',
    'courses.en.f3': 'Exam preparation (IELTS, TOEFL, CAE)',
    'courses.en.f4': 'Pronunciation & Accent Reduction',
    'courses.en.f5': 'Writing & Email Correspondence',
    'courses.fr.f1': 'General French & Conversation',
    'courses.fr.f2': 'Travel French & Culture',
    'courses.fr.f3': 'DELF/DALF Exam Preparation',
    'courses.fr.f4': 'French Phonetics & Nasal Sounds',
    'courses.fr.f5': 'Reading & Listening Comprehension',
    'test.tag': 'Testimonials',
    'test.h2': 'What my students say',
    'test.p': "Real opinions from people I've had the pleasure of working with.",
    'test.1.text': '"Ralph helped me pass my IELTS test with Band 8.0. The AI pronunciation analysis is an absolute game changer!"',
    'test.1.name': 'Lena Müller',
    'test.1.sub': 'English B2 → C1 · Munich',
    'test.2.text': ""I've been learning French with Ralph for 6 months and I'm amazed at how fast my progress is."",
    'test.2.name': 'Felix Krause',
    'test.2.sub': 'French A2 → B1 · Hamburg',
    'test.3.text': '"Ralph helped me so much in just 4 weeks preparing for my English job interview."',
    'test.3.name': 'Sarah Beck',
    'test.3.sub': 'Business English · Berlin',
    'price.tag': 'Pricing',
    'price.h2': 'Transparent pricing, no fine print',
    'price.p': 'Choose the plan that works for you. Cancel anytime.',
    'price.popular': 'Most popular',
    'price.starter': 'Starter',
    'price.starter.period': 'per hour',
    'price.pro': 'Pro',
    'price.pro.period': 'per month · 4 hours',
    'price.premium': 'Premium',
    'price.premium.period': 'per month · 8 hours',
    'price.cta.starter': 'Get started',
    'price.cta.pro': 'Book now',
    'price.cta.premium': 'Choose Premium',
    'price.f.lang1': '1 language (English or French)',
    'price.f.video': 'Live video lessons',
    'price.f.materials': 'Digital learning materials',
    'price.f.progress': 'Progress reports',
    'price.f.progress2': 'Detailed progress reports',
    'price.f.progress3': 'In-depth learning reports',
    'price.f.ai': 'AI pronunciation analysis',
    'price.f.hw': 'Homework feedback',
    'price.f.hw2': 'Weekly homework feedback',
    'price.f.hw3': 'Daily feedback & support',
    'price.f.priority': 'Priority booking',
    'price.f.priority2': 'Priority booking & flexibility',
    'price.f.lang2': '1 or 2 languages',
    'price.f.lang3': 'Both languages included',
    'price.f.materials2': 'All learning materials',
    'footer.desc': 'Your platform for online language lessons in English and French.',
    'footer.courses': 'Courses',
    'footer.platform': 'Platform',
    'footer.contact': 'Contact',
    'footer.hours': 'Mon–Sat 8am–9pm',
    'footer.location': 'Germany, Online',
    'footer.copy': '© 2025 LinguaFlow – Ralph Terhardt. All rights reserved.',
    'footer.privacy': 'Privacy Policy',
    'footer.imprint': 'Imprint',
    'footer.terms': 'Terms',
  },

  fr: {
    'nav.about': 'À propos',
    'nav.courses': 'Cours',
    'nav.pricing': 'Tarifs',
    'nav.login': 'Connexion',
    'nav.book': 'Réserver',
    'hero.tag': '#1 Professeur de langue en ligne',
    'hero.h1': 'Parlez <span>anglais &amp; français</span> – couramment et avec assurance',
    'hero.p': "Cours particuliers 1:1 avec Ralph Terhardt, analyse de prononciation par IA et un système de réservation flexible qui s'adapte à votre quotidien.",
    'hero.cta1': '<i class="fas fa-play-circle"></i> Essai gratuit',
    'hero.cta2': 'En savoir plus <i class="fas fa-arrow-down"></i>',
    'hero.card.title': 'Votre prochain cours',
    'hero.card.sub': 'Vidéo en direct avec votre formateur',
    'hero.stat.students': 'Élèves',
    'hero.stat.rating': 'Évaluation',
    'hero.stat.exp': 'Expérience',
    'hero.stat.success': 'Taux de réussite',
    'hero.badge1': 'Cours confirmé – Demain 17h00',
    'hero.badge2': 'Prononciation : +12% cette semaine',
    'feat.tag': 'Pourquoi LinguaFlow ?',
    'feat.h2': "Tout ce qu'il vous faut pour vraiment apprendre une langue",
    'feat.p': 'Apprentissage moderne combiné à un suivi personnalisé.',
    'feat.1.title': 'Cours vidéo en direct',
    'feat.1.p': 'Cours particuliers 1:1 directement dans votre navigateur.',
    'feat.2.title': 'Analyse de prononciation par IA',
    'feat.2.p': 'Notre IA vous écoute, analyse votre prononciation en temps réel.',
    'feat.3.title': 'Réservation flexible',
    'feat.3.p': 'Réservez des cours quand vous le souhaitez.',
    'feat.4.title': 'Suivre sa progression',
    'feat.4.p': 'Rapports détaillés après chaque cours.',
    'feat.5.title': 'Devoirs & exercices',
    'feat.5.p': "Exercices personnalisés entre les cours.",
    'feat.6.title': "Cours d'essai gratuit",
    'feat.6.p': "Réservez votre premier cours gratuitement.",
    'about.tag': 'À propos de moi',
    'about.h2': 'Votre formateur en anglais &amp; français',
    'about.p1': "Bonjour ! Je suis Ralph Terhardt – formateur en langues certifié avec plus de 8 ans d'expérience.",
    'about.p2': 'Mon approche pédagogique combine méthodologie classique et technologies modernes.',
    'about.p3': "Que vous appreniez pour un voyage, le travail ou un examen – j'adapte les cours à vos objectifs.",
    'about.trainer': 'Formateur en langues certifié',
    'about.exp': "Ans d'expérience",
    'courses.tag': 'Offre de cours',
    'courses.h2': 'Quelle langue voulez-vous apprendre ?',
    'courses.p': 'Du débutant au avancé – tous les niveaux, tous les objectifs.',
    'courses.en.sub': 'Anglais britannique et américain',
    'courses.fr.sub': 'Français parisien et général',
    'courses.price': 'à partir de 39 € <span>/ heure</span>',
    'courses.book': 'Réserver',
    'courses.en.f1': 'Anglais général & conversation',
    'courses.en.f2': 'Anglais des affaires & présentations',
    'courses.en.f3': 'Préparation aux examens (IELTS, TOEFL, CAE)',
    'courses.en.f4': "Prononciation & réduction d'accent",
    'courses.en.f5': 'Rédaction & correspondance e-mail',
    'courses.fr.f1': 'Français général & conversation',
    'courses.fr.f2': 'Français de voyage & culture',
    'courses.fr.f3': 'Préparation DELF/DALF',
    'courses.fr.f4': 'Phonétique française & sons nasaux',
    'courses.fr.f5': 'Lecture & compréhension orale',
    'test.tag': 'Témoignages',
    'test.h2': 'Ce que disent mes élèves',
    'test.p': "Avis authentiques de personnes que j'ai eu le plaisir d'accompagner.",
    'test.1.text': "« Ralph m'a aidé à obtenir un Band 8.0 à mon test IELTS. »",
    'test.1.name': 'Lena Müller',
    'test.1.sub': 'Anglais B2 → C1 · Munich',
    'test.2.text': "« J'apprends le français avec Ralph depuis 6 mois et je suis impressionné par la rapidité de mes progrès. »",
    'test.2.name': 'Felix Krause',
    'test.2.sub': 'Français A2 → B1 · Hambourg',
    'test.3.text': "« Ralph m'a apporté énormément en seulement 4 semaines pour préparer mon entretien d'embauche en anglais. »",
    'test.3.name': 'Sarah Beck',
    'test.3.sub': 'Anglais des affaires · Berlin',
    'price.tag': 'Tarifs',
    'price.h2': 'Tarifs transparents, sans surprise',
    'price.p': 'Choisissez la formule qui vous convient. Résiliable à tout moment.',
    'price.popular': 'Le plus populaire',
    'price.starter': 'Starter',
    'price.starter.period': 'par heure',
    'price.pro': 'Pro',
    'price.pro.period': 'par mois · 4 heures',
    'price.premium': 'Premium',
    'price.premium.period': 'par mois · 8 heures',
    'price.cta.starter': 'Commencer',
    'price.cta.pro': 'Réserver',
    'price.cta.premium': 'Choisir Premium',
    'price.f.lang1': '1 langue (anglais ou français)',
    'price.f.video': 'Cours vidéo en direct',
    'price.f.materials': 'Supports pédagogiques numériques',
    'price.f.progress': 'Rapports de progression',
    'price.f.progress2': 'Rapports de progression détaillés',
    'price.f.progress3': "Rapports d'apprentissage complets",
    'price.f.ai': 'Analyse de prononciation par IA',
    'price.f.hw': 'Correction des devoirs',
    'price.f.hw2': 'Correction hebdomadaire des devoirs',
    'price.f.hw3': 'Retours quotidiens & support',
    'price.f.priority': 'Réservation prioritaire',
    'price.f.priority2': 'Réservation prioritaire & flexibilité',
    'price.f.lang2': '1 ou 2 langues',
    'price.f.lang3': 'Les deux langues incluses',
    'price.f.materials2': 'Tous les supports pédagogiques',
    'footer.desc': 'Votre plateforme de cours de langue en ligne en anglais et en français.',
    'footer.courses': 'Cours',
    'footer.platform': 'Plateforme',
    'footer.contact': 'Contact',
    'footer.hours': 'Lun–Sam 8h–21h',
    'footer.location': 'Allemagne, en ligne',
    'footer.copy': '© 2025 LinguaFlow – Ralph Terhardt. Tous droits réservés.',
    'footer.privacy': 'Politique de confidentialité',
    'footer.imprint': 'Mentions légales',
    'footer.terms': 'CGU',
  }
};

// ============================================================
// I18n Engine
// ============================================================

const I18n = {
  lang: 'de',
  supported: ['de', 'en', 'fr'],

  init() {
    const saved = localStorage.getItem('lf_lang');
    const browser = navigator.language.slice(0, 2);
    this.lang = (saved && this.supported.includes(saved))
      ? saved
      : (this.supported.includes(browser) ? browser : 'de');
    this.apply();
    this.renderSwitcher();
    this.bindAllButtons();
  },

  bindAllButtons() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', () => this.setLang(btn.dataset.lang));
    });
  },

  t(key) {
    const lang = Translations[this.lang] || Translations.de;
    return lang[key] ?? Translations.de[key] ?? key;
  },

  apply() {
    document.documentElement.lang = this.lang;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      el.textContent = this.t(key);
    });
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.getAttribute('data-i18n-html');
      el.innerHTML = this.t(key);
    });
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === this.lang);
    });
  },

  setLang(lang) {
    if (!this.supported.includes(lang)) return;
    this.lang = lang;
    localStorage.setItem('lf_lang', lang);
    this.apply();
  },

  renderSwitcher() {
    const flags = { de: '\u{1F1E9}\u{1F1EA}', en: '\u{1F1EC}\u{1F1E7}', fr: '\u{1F1EB}\u{1F1F7}' };
    const labels = { de: 'Deutsch', en: 'English', fr: 'Français' };

    document.querySelectorAll('.lang-switcher').forEach(switcher => {
      if (!switcher.querySelector('.lang-btn')) {
        switcher.innerHTML = this.supported.map(lang => `
          <button class="lang-btn${lang === this.lang ? ' active' : ''}"
                  data-lang="${lang}"
                  title="${labels[lang]}"
                  aria-label="${labels[lang]}">
            ${flags[lang]}
          </button>
        `).join('');
      }
      switcher.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === this.lang);
        btn.addEventListener('click', () => this.setLang(btn.dataset.lang));
      });
    });
  }
};

window.LF = window.LF || {};
window.LF.I18n = I18n;
