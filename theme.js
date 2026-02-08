// COMPLETE MULTILINGUAL TRANSLATIONS FOR ENTIRE PORTFOLIO
const translations = {
    fr: {
        // Navigation
        home: 'Accueil',
        projects: 'Projets',
        experience: 'Expérience',
        games: 'Jeu',
        contact: 'Contact',
        // Hero Section
        availableBadge: 'Disponible pour de nouveaux projets',
        heroGreeting: 'Bonjour, je suis',
        heroSubtitle: 'Ingénieur Informatique spécialisé en développement logiciel, sécurité des systèmes et architecture distribuée',
        yearsExp: 'Années d\'expérience',
        projectsCount: 'Projets réalisés',
        expertiseDomains: 'Domaines d\'expertise',
        viewProjects: 'Voir mes projets',
        contactMe: 'Me contacter',
        expertsCard: 'Expertise & Compétences',
        programmingLangs: 'Langages de Programmation',
        frameworks: 'Frameworks & Web Services',
        databases: 'Données & Outils',
        // Projects Section
        projectsTitle: 'Projets',
        projectsDesc: 'Découvrez mes réalisations dans différents domaines',
        allProjects: 'Tous les projets',
        webHardware: 'Développement Web & Hardware (plus de projet sur mon GIT)',
        dataScience: 'Data Science (plus de projet sur mon GIT)',
        machineLearning: 'Machine Learning',
        noProjects: 'Aucun projet trouvé dans cette catégorie',
        // Experience Section
        experienceTitle: 'Professionnel',
        experienceDesc: 'Mon évolution professionnelle',
        presentDate: '2025 - Présent',
        softwareEngineerRD: 'Software Engineer - R&D Engineer',
        onnetSecuritySystem: 'Onet Sécurité Système',
        softwareEngineer: 'Software Engineer',
        cdi: 'CDI',
        internship: 'Stage',
        internshipPosition: 'Ingénieur Informatique - Stagiaire',
        softwareEngineerIntern: 'Software Engineer - Stagiaire',
        experienceDate2: '2023 - 2025',
        experienceDate3: 'Mai - Sept 2023',
        telem: 'TELEM',
        // Games Section
        gamePortfolio: 'Portfolio Interactif',
        gameInstructions: 'Explore mon portfolio en mode jeu - Utilise les flèches ou ZQSD pour te déplacer',
        gameHint2: '💡 Approche-toi des éléments pour interagir avec eux!',
        gameComputerLegend: '💻 Ordinateur = Projets',
        gameLibraryLegend: '📚 Bibliothèque = Compétences',
        gamePhoneLegend: '☎️ Téléphone = Contact',
        moreGames: '🎮 Plus de Jeux',
        // Contact Section
        contactTogether: 'Travaillons Ensemble',
        contactSubtitle: 'Je suis toujours ouvert à de nouvelles opportunités et collaborations',
        emailLabel: 'Email',
        linkedinLabel: 'LinkedIn',
        linkedinConnect: 'Connectons-nous',
        githubLabel: 'GitHub',
        viewProjectsGit: 'Voir mes projets',
        // Footer
        footerTagline: 'Ingénieur Informatique passionné par l\'innovation',
        footerCopyright: '© 2025 Mouad El Kbabty. Tous droits réservés.',
    },
    en: {
        // Navigation
        home: 'Home',
        projects: 'Projects',
        experience: 'Experience',
        games: 'Games',
        contact: 'Contact',
        // Hero Section
        availableBadge: 'Available for new projects',
        heroGreeting: 'Hello, I\'m',
        heroSubtitle: 'Software Engineer specialized in software development, systems security and distributed architecture',
        yearsExp: 'Years of experience',
        projectsCount: 'Projects completed',
        expertiseDomains: 'Areas of expertise',
        viewProjects: 'View my projects',
        contactMe: 'Contact me',
        expertsCard: 'Skills & Expertise',
        programmingLangs: 'Programming Languages',
        frameworks: 'Frameworks & Web Services',
        databases: 'Data & Tools',
        // Projects Section
        projectsTitle: 'Projects',
        projectsDesc: 'Discover my work across various domains',
        allProjects: 'All projects',
        webHardware: 'Web & Hardware Development (more projects on my GitHub)',
        dataScience: 'Data Science (more projects on my GitHub)',
        machineLearning: 'Machine Learning',
        noProjects: 'No projects found in this category',
        // Experience Section
        experienceTitle: 'Experience',
        experienceDesc: 'My professional journey',
        presentDate: '2025 - Present',
        softwareEngineerRD: 'Software Engineer - R&D Engineer',
        onnetSecuritySystem: 'Onet System Security',
        softwareEngineer: 'Software Engineer',
        cdi: 'Full-time',
        internship: 'Internship',
        internshipPosition: 'Software Engineer',
        softwareEngineerIntern: 'Software Engineer',
        experienceDate2: '2023 - 2025',
        experienceDate3: 'May - Sept 2023',
        telem: 'TELEM',
        // Games Section
        gamePortfolio: 'Interactive Portfolio',
        gameInstructions: 'Explore my portfolio in game mode - Use arrow keys or ZQSD to move',
        gameHint2: '💡 Get close to elements to interact with them!',
        gameComputerLegend: '💻 Computer = Projects',
        gameLibraryLegend: '📚 Library = Skills',
        gamePhoneLegend: '☎️ Phone = Contact',
        moreGames: '🎮 More Games',
        // Contact Section
        contactTogether: 'Let\'s Work Together',
        contactSubtitle: 'I\'m always open to new opportunities and collaborations',
        emailLabel: 'Email',
        linkedinLabel: 'LinkedIn',
        linkedinConnect: 'Let\'s connect',
        githubLabel: 'GitHub',
        viewProjectsGit: 'View my projects',
        // Footer
        footerTagline: 'Software Engineer passionate about innovation',
        footerCopyright: '© 2025 Mouad El Kbabty. All rights reserved.',
    }
};

// Initialize theme and language
let currentLang = localStorage.getItem('language') || 'fr';
let isDarkMode = localStorage.getItem('theme') !== 'light';

function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    if (!isDarkMode) {
        document.body.classList.add('light-mode');
        if (themeToggle) themeToggle.textContent = '☀️';
    } else {
        document.body.classList.remove('light-mode');
        if (themeToggle) themeToggle.textContent = '🌙';
    }
}

function toggleTheme() {
    isDarkMode = !isDarkMode;
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    initTheme();
}

function initLanguage() {
    document.documentElement.lang = currentLang;
    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
        langToggle.textContent = currentLang === 'fr' ? 'EN' : 'FR';
    }
    updateAllContent();
}

function toggleLanguage() {
    currentLang = currentLang === 'fr' ? 'en' : 'fr';
    localStorage.setItem('language', currentLang);
    initLanguage();
}

function updateAllContent() {
    // Update nav links with data-fr and data-en attributes
    document.querySelectorAll('.nav-links a').forEach(link => {
        const key = currentLang === 'fr' ? 'data-fr' : 'data-en';
        const text = link.getAttribute(key);
        if (text) link.textContent = text;
    });

    // Update ALL elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[currentLang][key]) {
            // Check if element contains SVG (company name with icon)
            const svg = el.querySelector('svg');
            if (svg) {
                // Preserve SVG only, replace everything else
                el.innerHTML = svg.outerHTML + translations[currentLang][key];
            } 
            // Check if element contains gradient-text span
            else if (el.querySelector('.gradient-text')) {
                const gradientText = el.querySelector('.gradient-text');
                el.textContent = translations[currentLang][key];
                el.appendChild(gradientText);
            } 
            else {
                el.textContent = translations[currentLang][key];
            }
        }
    });

    // Update buttons and links
    document.querySelectorAll('[data-i18n-button]').forEach(el => {
        const key = el.getAttribute('data-i18n-button');
        if (translations[currentLang][key]) {
            const span = el.querySelector('span');
            if (span) {
                span.textContent = translations[currentLang][key];
            } else {
                el.textContent = translations[currentLang][key];
            }
        }
    });

    // Update placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (translations[currentLang][key]) {
            el.placeholder = translations[currentLang][key];
        }
    });
}

// Scroll animations
function observeScrollElements() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('[data-scroll]').forEach(el => {
        observer.observe(el);
    });
}

// Parallax effect
function handleParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    const scrollY = window.scrollY;

    parallaxElements.forEach(el => {
        const speed = el.getAttribute('data-parallax') || 0.5;
        el.style.transform = `translateY(${scrollY * speed}px)`;
    });
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initLanguage();
    observeScrollElements();
    
    const themeToggle = document.getElementById('themeToggle');
    const langToggle = document.getElementById('langToggle');
    
    if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
    if (langToggle) langToggle.addEventListener('click', toggleLanguage);
});

window.addEventListener('scroll', () => {
    handleParallax();
});

// Smooth scroll for nav links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});
