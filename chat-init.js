document.addEventListener("DOMContentLoaded", () => {
    const bubble = document.getElementById("momo-bubble");
    const windowEl = document.getElementById("momo-window");
    const closeBtn = document.getElementById("momo-close");
    const sendBtn = document.getElementById("momo-send");
    const input = document.getElementById("momo-text");
    const messagesContainer = document.getElementById("momo-messages");

    // État du bot
    let isWindowOpen = false;

    // Base de connaissances (Améliorée)
    const knowledgeBase = [
        {
            keywords: ["projet", "portfolio", "réalisations", "travaux", "création"],
            response: "J'ai plusieurs projets phares ! 🚀 Notamment une architecture **NATS sécurisée** et une migration **SSO/SAML**. Tu veux voir la section Projets ?",
            action: { text: "Voir les projets", link: "#projets" }
        },
        {
            keywords: ["parcours", "étude", "diplome", "formation", "université", "fac"],
            response: "Mon parcours est atypique ! 🎓 J'ai commencé par des **Maths (L1-L2)** avant de bifurquer vers la **MIAGE (L3 & Master)** à Grenoble Alpes (Mention Bien 🏆).",
            action: null
        },
        {
            keywords: ["techno", "stack", "langage", "java", "rust", "js", "framework"],
            response: "Ma stack préférée : **Java (Spring Boot)** pour le solide, **Rust** pour la perf, et **Angular/Vue** pour le front. Je touche aussi au **C#** et à la **Data Science**.",
            action: { text: "Voir les compétences", link: "#stats" }
        },
        {
            keywords: ["contact", "mail", "email", "joindre", "embaucher", "stage", "cdi"],
            response: "Tu veux qu'on travaille ensemble ? Excellente idée ! 🤝 Tu peux me contacter par mail ou sur LinkedIn.",
            action: { text: "Me contacter", link: "#contact" }
        },
        {
            keywords: ["jeu", "game", "jouer", "interactif"],
            response: "Tu as vu mon **Bureau Interactif** ? C'est un Point & Click caché dans le site. Essaie-le !",
            action: { text: "Jouer maintenant", link: "#game" }
        },
        {
            keywords: ["salut", "bonjour", "hello", "hi", "yo", "coucou"],
            response: "Salut ! 👋 Je suis l'assistant virtuel de Mouad. Comment puis-je t'aider aujourd'hui ?",
            action: null
        },
        {
            keywords: ["merci", "cool", "super", "top"],
            response: "Avec plaisir ! N'hésite pas si tu as d'autres questions. ✨",
            action: null
        }
    ];

    // Mots-clés par défaut si aucune correspondance
    const defaultResponses = [
        "Je ne suis pas sûr d'avoir compris 🤔 Essaie de me demander mes **projets**, mon **parcours** ou mes **compétences**.",
        "Intéressant... Mais je suis un bot spécialisé ! Demande-moi plutôt ce que je sais faire en **Java** ou **Rust**.",
        "Je suis encore en apprentissage 🤖 Peux-tu reformuler ? Tu cherches peut-être à me **contacter** ?"
    ];

    // --- FONCTIONS ---

    function toggleChat() {
        isWindowOpen = !isWindowOpen;
        if (isWindowOpen) {
            windowEl.classList.add("active");
            windowEl.style.display = "flex"; // Fallback
            bubble.style.opacity = "0";
            bubble.style.pointerEvents = "none";
            input.focus();
            
            // Message de bienvenue si vide
            if (messagesContainer.children.length === 0) {
                setTimeout(() => addBotMessage("Salut ! 👋 Je suis Momo Bot. Pose-moi une question sur mon parcours ou mes projets !"), 500);
            }
        } else {
            windowEl.classList.remove("active");
            setTimeout(() => windowEl.style.display = "none", 300); // Wait for transition
            bubble.style.opacity = "1";
            bubble.style.pointerEvents = "auto";
        }
    }

    function scrollToBottom() {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function addUserMessage(text) {
        const msgDiv = document.createElement("div");
        msgDiv.className = "message user";
        msgDiv.textContent = text;
        messagesContainer.appendChild(msgDiv);
        scrollToBottom();
    }

    function addBotMessage(text, action = null) {
        // Indicateur de frappe (Typing indicator)
        const typingDiv = document.createElement("div");
        typingDiv.className = "message bot typing";
        typingDiv.innerHTML = "<span>.</span><span>.</span><span>.</span>";
        messagesContainer.appendChild(typingDiv);
        scrollToBottom();

        // Délai aléatoire pour simuler la réflexion (500ms à 1500ms)
        const delay = Math.random() * 500 + 600;

        setTimeout(() => {
            typingDiv.remove(); // Enlever l'indicateur

            const msgDiv = document.createElement("div");
            msgDiv.className = "message bot";
            // Convertir le Markdown simple (**gras**) en HTML
            msgDiv.innerHTML = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            messagesContainer.appendChild(msgDiv);

            // Ajouter un bouton d'action si présent
            if (action) {
                const btn = document.createElement("button");
                btn.className = "chat-action-btn";
                btn.textContent = action.text;
                btn.onclick = () => {
                    window.location.href = action.link;
                    // Sur mobile, on ferme le chat après clic
                    if(window.innerWidth < 768) toggleChat();
                };
                messagesContainer.appendChild(btn);
            }

            scrollToBottom();
            
            // Petit son de notification (optionnel, à activer si tu as un fichier son)
            // new Audio('pop.mp3').play().catch(() => {}); 
        }, delay);
    }

    function handleInput() {
        const text = input.value.trim();
        if (!text) return;

        addUserMessage(text);
        input.value = "";

        // Logique de réponse "Fuzzy"
        const lowerText = text.toLowerCase();
        let match = knowledgeBase.find(item => 
            item.keywords.some(keyword => lowerText.includes(keyword))
        );

        if (match) {
            addBotMessage(match.response, match.action);
        } else {
            const randomDefault = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
            addBotMessage(randomDefault);
        }
    }

    // --- EVENT LISTENERS ---

    bubble.addEventListener("click", toggleChat);
    closeBtn.addEventListener("click", toggleChat);

    sendBtn.addEventListener("click", handleInput);
    input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") handleInput();
    });
    
});