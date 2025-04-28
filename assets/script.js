// Effet de frappe pour les messages de l'IA
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.innerHTML = '';
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// Gestion du chat
document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chatMessages');
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendMessage');

    // Ajuster automatiquement la hauteur du textarea
    userInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });

    // Fonction pour ajouter un message
    function addMessage(message, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'ai-message'}`;
        
        if (isUser) {
            messageDiv.textContent = message;
        } else {
            // Effet de frappe pour les messages de l'IA
            typeWriter(messageDiv, message);
        }
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Gestionnaire d'envoi de message
    async function handleSend() {
        const message = userInput.value.trim();
        if (!message) return;

        // Ajouter le message de l'utilisateur
        addMessage(message, true);
        userInput.value = '';
        userInput.style.height = 'auto';

        try {
            // Simuler l'envoi au webhook (à remplacer par votre URL réelle)
            const response = await fetch('[INSERT YOUR N8N WEBHOOK URL]', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message })
            });

            if (!response.ok) throw new Error('Erreur réseau');

            // Simuler une réponse (à remplacer par la vraie réponse du webhook)
            const aiResponse = "Je comprends votre besoin. Voici un plan d'action personnalisé pour digitaliser votre entreprise...";
            addMessage(aiResponse);

        } catch (error) {
            addMessage("Désolé, une erreur est survenue. Veuillez réessayer plus tard.");
            console.error('Erreur:', error);
        }
    }

    // Événements
    sendButton.addEventListener('click', handleSend);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    });
});

// Animation du fond dégradé
document.addEventListener('mousemove', (e) => {
    const hero = document.querySelector('.hero');
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    
    hero.style.background = `linear-gradient(
        ${135 + x * 30}deg,
        #2563eb ${y * 20}%,
        #1e40af ${100 - y * 20}%
    )`;
});

// Animation fluide du défilement
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});