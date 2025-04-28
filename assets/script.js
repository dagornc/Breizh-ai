import chatAPI from '../api/chat.js';
import OpenAIService from '../services/openai.js';

// Configuration des performances
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM chargé, initialisation...');
    
    // Initialisation des composants
    initializeComponents();
    
    // Initialisation du chat
    initChat();
});

// Gestionnaire central des composants
function initializeComponents() {
    console.log('Initialisation des composants...');

    // Initialisation des particules
    initParticles();

    // Initialisation des animations
    initAnimations();

    // Initialisation du défilement fluide
    initSmoothScroll();

    // Initialisation du formulaire de contact
    initContact();
}

// Initialisation des particules
function initParticles() {
    const particlesConfig = {
        particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: '#ffffff' },
            shape: { type: 'circle' },
            opacity: {
                value: 0.5,
                random: false,
                anim: { enable: true, speed: 1, opacity_min: 0.1, sync: false }
            },
            size: {
                value: 3,
                random: true,
                anim: { enable: true, speed: 2, size_min: 0.1, sync: false }
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: '#ffffff',
                opacity: 0.4,
                width: 1
            },
            move: {
                enable: true,
                speed: 2,
                direction: 'none',
                random: false,
                straight: false,
                out_mode: 'out',
                bounce: false,
                attract: { enable: true, rotateX: 600, rotateY: 1200 }
            }
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: { enable: true, mode: 'grab' },
                onclick: { enable: true, mode: 'push' },
                resize: true
            },
            modes: {
                grab: { distance: 140, line_linked: { opacity: 1 } },
                push: { particles_nb: 4 }
            }
        },
        retina_detect: true,
        fps_limit: 60
    };

    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', particlesConfig);
    }
}

// Système d'animations optimisé
function initAnimations() {
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                requestAnimationFrame(() => {
                    entry.target.classList.add('reveal');
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                });
                animationObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px'
    });

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        animationObserver.observe(el);
    });

    // Animation de la navbar au scroll
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScrollTop = scrollTop;
    }, { passive: true });
}

// Défilement fluide
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            
            if (target) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Système de chat
function initChat() {
    const input = document.querySelector('#userInput');
    const sendButton = document.querySelector('#sendMessage');
    const clearButton = document.querySelector('#clearChat');
    const messagesContainer = document.querySelector('.chat-messages');

    if (!input || !sendButton || !clearButton || !messagesContainer) {
        console.error('Éléments manquants:', {
            input: !!input,
            sendButton: !!sendButton,
            clearButton: !!clearButton,
            messagesContainer: !!messagesContainer
        });
        return;
    }

    console.log('Éléments trouvés, configuration des événements...');

    // Système de messages
    const chatSystem = {
        messages: [],
        addMessage: function(content, isUser = false) {
            console.log('Ajout message:', { content, isUser });
            const message = document.createElement('div');
            message.classList.add('message', isUser ? 'user-message' : 'ai-message');
            message.textContent = content;
            messagesContainer.appendChild(message);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            this.messages.push({ isUser, content });
        }
    };

    // Gestion du statut
    function updateStatus(status) {
        const statusDot = document.querySelector('.status-dot');
        const statusText = document.querySelector('.status-text');
        
        if (!statusDot || !statusText) {
            console.error('Éléments de statut non trouvés');
            return;
        }
        
        const statusConfig = {
            online: { color: '#10B981', text: 'En ligne' },
            typing: { color: '#FCD34D', text: 'En train d\'écrire...' },
            offline: { color: '#EF4444', text: 'Hors ligne' }
        };

        const config = statusConfig[status] || statusConfig.online;
        statusDot.style.backgroundColor = config.color;
        statusText.textContent = config.text;
    }

    // Envoi de message
    async function handleSendMessage() {
        console.log('Tentative d\'envoi de message');
        const messageText = input.value.trim();
        
        if (!messageText) {
            console.log('Message vide, annulation');
            return;
        }

        console.log('Envoi du message:', messageText);

        // Désactiver l'interface
        input.disabled = true;
        sendButton.disabled = true;
        updateStatus('typing');

        // Afficher le message utilisateur
        chatSystem.addMessage(messageText, true);
        input.value = '';

        try {
            console.log('Appel OpenAI...');
            const response = await OpenAIService.sendMessage(messageText, chatSystem.messages);
            console.log('Réponse reçue:', response);

            if (response.success) {
                updateStatus('online');
                chatSystem.addMessage(response.message);
            } else {
                throw new Error(response.error || 'Erreur de communication');
            }
        } catch (error) {
            console.error('Erreur:', error);
            updateStatus('offline');
            chatSystem.addMessage("Désolé, une erreur est survenue. Veuillez réessayer plus tard.");
        } finally {
            // Réactiver l'interface
            input.disabled = false;
            sendButton.disabled = false;
            input.focus();
        }
    }

    // Configuration des événements
    input.addEventListener('keypress', (event) => {
        console.log('Touche pressée:', event.key);
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSendMessage();
        }
    });

    sendButton.addEventListener('click', () => {
        console.log('Bouton d\'envoi cliqué');
        handleSendMessage();
    });

    clearButton.addEventListener('click', () => {
        console.log('Effacement de la conversation');
        messagesContainer.innerHTML = '';
        chatSystem.messages = [];
        chatSystem.addMessage("Bonjour ! Je suis Morgan, votre assistant digital. Comment puis-je vous aider aujourd'hui ?");
    });

    // Message de bienvenue
    console.log('Ajout du message de bienvenue');
    chatSystem.addMessage("Bonjour ! Je suis Morgan, votre assistant digital. Comment puis-je vous aider aujourd'hui ?");
}

// Système de contact amélioré
function initContact() {
    console.log('Initialisation du formulaire de contact...');
    
    const form = document.querySelector('.contact-form');
    if (!form) {
        console.error('Formulaire de contact non trouvé');
        return;
    }

    const inputs = form.querySelectorAll('input, textarea');
    const submitButton = form.querySelector('.submit-button');
    const formStatus = form.querySelector('.form-status');

    // Configuration EmailJS
    const emailjsConfig = {
        serviceID: 'service_4mj53p6',
        templateID: 'template_4b3egvw',
        publicKey: 'zcpUCFdECPiiDuUk-'
    };

    // Validation des champs
    function validateForm() {
        let isValid = true;
        const errors = {};

        inputs.forEach(input => {
            const value = input.value.trim();
            const isRequired = !input.hasAttribute('optional');

            if (isRequired && !value) {
                errors[input.id] = 'Ce champ est requis';
                isValid = false;
            } else if (input.type === 'email' && value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    errors[input.id] = 'Email invalide';
                    isValid = false;
                }
            }
        });

        return { isValid, errors };
    }

    // Affichage des erreurs
    function showErrors(errors) {
        inputs.forEach(input => {
            const container = input.parentElement;
            const errorSpan = container.querySelector('.error-message') || document.createElement('span');
            
            if (errors[input.id]) {
                errorSpan.className = 'error-message';
                errorSpan.textContent = errors[input.id];
                if (!container.querySelector('.error-message')) {
                    container.appendChild(errorSpan);
                }
                container.classList.add('error');
            } else {
                if (container.querySelector('.error-message')) {
                    container.querySelector('.error-message').remove();
                }
                container.classList.remove('error');
            }
        });
    }

    // Mise à jour du statut du formulaire
    function updateFormStatus(message, isError = false) {
        if (formStatus) {
            formStatus.textContent = message;
            formStatus.className = `form-status ${isError ? 'error' : 'success'}`;
        }
    }

    // Gestion de l'envoi
    async function handleSubmit(e) {
        e.preventDefault();
        console.log('Tentative d\'envoi du formulaire...');

        // Validation
        const { isValid, errors } = validateForm();
        if (!isValid) {
            console.log('Validation échouée:', errors);
            showErrors(errors);
            return;
        }

        // Préparation de l'interface
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
        updateFormStatus('');

        try {
            // Préparation des données
            const formData = {
                email: form.querySelector('#userEmail').value,
                from_email: 'contact@breizh.ai',
                from_name: form.querySelector('#userName').value,
                company: form.querySelector('#userCompany').value || 'Non spécifié',
                phone: form.querySelector('#userPhone').value || 'Non spécifié',
                subject: form.querySelector('#userSubject').value,
                message: form.querySelector('#userMessage').value
            };

            console.log('Envoi via EmailJS:', formData);

            // Envoi via EmailJS
            const response = await emailjs.send(
                emailjsConfig.serviceID,
                emailjsConfig.templateID,
                formData,
                emailjsConfig.publicKey
            );

            console.log('Réponse EmailJS:', response);

            // Succès
            submitButton.innerHTML = '<i class="fas fa-check"></i> Message envoyé !';
            submitButton.classList.add('success');
            updateFormStatus('Votre message a été envoyé avec succès !');
            
            // Réinitialisation du formulaire
            form.reset();
            setTimeout(() => {
                submitButton.innerHTML = 'Envoyer';
                submitButton.classList.remove('success');
                submitButton.disabled = false;
                updateFormStatus('');
            }, 3000);

        } catch (error) {
            console.error('Erreur lors de l\'envoi:', error);
            submitButton.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Erreur';
            submitButton.classList.add('error');
            updateFormStatus('Une erreur est survenue lors de l\'envoi. Veuillez réessayer.', true);

            setTimeout(() => {
                submitButton.innerHTML = 'Réessayer';
                submitButton.classList.remove('error');
                submitButton.disabled = false;
            }, 3000);
        }
    }

    // Nettoyage des erreurs lors de la saisie
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            const container = input.parentElement;
            container.classList.remove('error');
            const errorSpan = container.querySelector('.error-message');
            if (errorSpan) {
                errorSpan.remove();
            }
        });
    });

    // Ajout de l'événement submit
    form.addEventListener('submit', handleSubmit);

    console.log('Formulaire de contact initialisé');
    return { form };
}

// Exportation pour utilisation dans d'autres modules si nécessaire
export default {
    name: 'Chat System',
    version: '1.0.0'
};