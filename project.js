const projects = [
    {
        id: 1,
        title: "Système de Sécurité NATS",
        category: "web-hardware",
        categoryLabel: "Web & Hardware",
        icon: "🔐",
        description: "Migration complète d'une architecture TCP vers NATS avec authentification multi-niveaux (username/pwd, Nkey, certificats mTLS) pour renforcer la sécurité inter-serveurs.",
        technologies: ["Rust", "Java", "NATS", "mTLS", "Tomcat"]
    },
    {
        id: 2,
        title: "Application de Gestion de Licences",
        category: "web-hardware",
        categoryLabel: "Web & Hardware",
        icon: "🎫",
        description: "Développement d'une application robuste pour la gestion centralisée des licences du serveur principal avec suivi en temps réel et validation automatique.",
        technologies: ["Java", "Spring Boot", "PostgreSQL", "REST API"]
    },
    {
        id: 3,
        title: "Migration Architecture J2EE",
        category: "web-hardware",
        categoryLabel: "Web & Hardware",
        icon: "🔄",
        description: "Refonte complète d'un client lourd Delphi vers une architecture moderne Java/J2EE 3-tiers avec interface Vue.js, amélioration des performances et de la maintenabilité.",
        technologies: ["Java J2EE", "Hibernate", "Vue.js", "Apache Tomcat", "SQL Server"]
    },
    {
        id: 4,
        title: "Système d'Authentification SSO",
        category: "web-hardware",
        categoryLabel: "Web & Hardware",
        icon: "🔑",
        description: "Implémentation d'une solution d'authentification unifiée avec Spring Security, intégration LDAP et SAML pour Single Sign-On (SSO) d'entreprise.",
        technologies: ["Spring Security", "LDAP", "SAML", "Java", "OAuth2"]
    },
    {
        id: 5,
        title: "Outil de Déchiffrement de Logs",
        category: "web-hardware",
        categoryLabel: "Web & Hardware",
        icon: "📝",
        description: "Création d'une application spécialisée pour le déchiffrement et l'analyse automatisée des logs système avec détection d'anomalies et génération de rapports.",
        technologies: ["C#", ".NET", "Cryptographie", "Parsing"]
    },
    
    {
        id: 6,
        title: "Analyse Prédictive des Incidents de Sécurité",
        category: "data-science",
        categoryLabel: "Data Science",
        icon: "📊",
        description: "Développement d'un système d'analyse prédictive pour identifier les patterns d'incidents de sécurité et anticiper les menaces potentielles basé sur l'historique des logs.",
        technologies: ["Python", "Pandas", "NumPy", "Matplotlib", "SQL"]
    },
    {
        id: 7,
        title: "Dashboard Analytics en Temps Réel",
        category: "data-science",
        categoryLabel: "Data Science",
        icon: "📈",
        description: "Création d'un tableau de bord interactif pour la visualisation en temps réel des métriques de performance système et des indicateurs de sécurité critiques.",
        technologies: ["Python", "Plotly", "Dash", "PostgreSQL", "Redis"]
    },
    {
        id: 8,
        title: "Système de Reporting Automatisé",
        category: "data-science",
        categoryLabel: "Data Science",
        icon: "📋",
        description: "Automatisation de la génération de rapports hebdomadaires avec extraction, transformation et visualisation des données de production et de sécurité.",
        technologies: ["Python", "Pandas", "Seaborn", "Jupyter", "Excel"]
    },
    {
        id: 10,
        title: "Modèle de Classification des Menaces",
        category: "machine-learning",
        categoryLabel: "Machine Learning",
        icon: "🎯",
        description: "Application d'analyse intelligente de documents PDF exploitant Mistral AI via Hugging Face Spaces. Implémente un système RAG (Retrieval-Augmented Generation) avec vectorisation des documents, permettant la recherche sémantique multi-documents, l'extraction ciblée d'informations et un système de Question-Answering contextuel. Utilise FAISS pour l'indexation vectorielle haute performance, LangChain pour l'orchestration LLM, et PyPDF2 pour l'extraction de texte. Capable de traiter simultanément des dizaines de documents et de fournir des réponses synthétiques en croisant les informations sources.",
        technologies: ["Python", "Mistral AI ", "LangChain", "FAISS","PyPDF2"]
    },
    {
        id: 11,
        title: "Système de Recommandation Intelligent",
        category: "machine-learning",
        categoryLabel: "Machine Learning",
        icon: "💡",
        description: "Création d'un système de recommandation basé sur l'apprentissage automatique pour suggérer des configurations de sécurité optimales selon le contexte d'utilisation.",
        technologies: ["Python", "Neural Networks", "Keras", "Content-Based Filtering"]
    }
];

function renderProjects(filter = 'all') {
    const projectsGrid = document.getElementById('projectsGrid');
    const noProjectsMessage = document.getElementById('noProjects');
    
    const filteredProjects = filter === 'all' 
        ? projects 
        : projects.filter(project => project.category === filter);
    
    projectsGrid.innerHTML = '';
    
    if (filteredProjects.length === 0) {
        noProjectsMessage.style.display = 'block';
        return;
    } else {
        noProjectsMessage.style.display = 'none';
    }
    
    filteredProjects.forEach((project, index) => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        projectCard.style.animationDelay = `${index * 0.1}s`;
        
        projectCard.innerHTML = `
            <div class="project-image">
                ${project.icon}
            </div>
            <div class="project-content">
                <div class="project-header">
                    <h3>${project.title}</h3>
                    <span class="project-category">${project.categoryLabel}</span>
                </div>
                <p>${project.description}</p>
                <div class="project-tech">
                    ${project.technologies.map(tech => 
                        `<span class="tech-tag">${tech}</span>`
                    ).join('')}
                </div>
            </div>
        `;
        
        projectsGrid.appendChild(projectCard);
    });
    
    setTimeout(() => {
        document.querySelectorAll('.project-card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 50);
        });
    }, 50);
}

document.addEventListener('DOMContentLoaded', () => {
    renderProjects('all');
    
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            button.classList.add('active');
            
            const filter = button.getAttribute('data-filter');
            
            renderProjects(filter);
        });
    });
});