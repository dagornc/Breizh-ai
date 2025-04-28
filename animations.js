import config from './config.js';
import { animation, performance } from './utils.js';

class AnimationManager {
    constructor() {
        this.isEnabled = config.animations.enabled;
        this.reducedMotion = config.animations.reducedMotion;
        this.observers = new Map();
        this.animations = new Map();
        
        this.init();
    }

    init() {
        if (!this.isEnabled) return;

        // Initialisation des animations au scroll
        this.initScrollAnimations();
        
        // Initialisation des animations de la navbar
        this.initNavbarAnimations();
        
        // Initialisation des animations des particules
        this.initParticlesAnimation();
        
        // Initialisation des animations du chat
        this.initChatAnimations();
        
        // Initialisation des animations des formulaires
        this.initFormAnimations();
    }

    // Animations au scroll
    initScrollAnimations() {
        const options = {
            root: null,
            rootMargin: config.animations.scrollMargin,
            threshold: config.animations.scrollThreshold
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    requestAnimationFrame(() => {
                        this.playEntryAnimation(entry.target);
                    });
                }
            });
        }, options);

        document.querySelectorAll('.animate-on-scroll').forEach(element => {
            observer.observe(element);
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
        });

        this.observers.set('scroll', observer);
    }

    // Animations de la navbar
    initNavbarAnimations() {
        const navbar = document.querySelector('.navbar');
        let lastScroll = 0;

        const handleScroll = performance.throttle(() => {
            const currentScroll = window.pageYOffset;
            
            // Animation de masquage/affichage
            if (currentScroll > lastScroll && currentScroll > 100) {
                animation.animate(navbar, [
                    { transform: 'translateY(0)' },
                    { transform: 'translateY(-100%)' }
                ], { duration: 300 });
            } else {
                animation.animate(navbar, [
                    { transform: 'translateY(-100%)' },
                    { transform: 'translateY(0)' }
                ], { duration: 300 });
            }

            // Animation de l'arrière-plan
            if (currentScroll > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            lastScroll = currentScroll;
        }, 100);

        window.addEventListener('scroll', handleScroll);
    }

    // Animation des particules
    initParticlesAnimation() {
        const particlesConfig = {
            particles: {
                number: {
                    value: config.particles.density,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: document.documentElement.classList.contains('dark-mode') 
                        ? config.particles.color.dark 
                        : config.particles.color.light
                },
                shape: {
                    type: 'circle'
                },
                opacity: {
                    value: 0.5,
                    random: false,
                    anim: {
                        enable: true,
                        speed: 1,
                        opacity_min: 0.1,
                        sync: false
                    }
                },
                size: {
                    value: 3,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 2,
                        size_min: 0.1,
                        sync: false
                    }
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: document.documentElement.classList.contains('dark-mode')
                        ? config.particles.color.dark
                        : config.particles.color.light,
                    opacity: 0.4,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: config.particles.speed,
                    direction: 'none',
                    random: false,
                    straight: false,
                    out_mode: 'out',
                    bounce: false,
                    attract: {
                        enable: true,
                        rotateX: 600,
                        rotateY: 1200
                    }
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: {
                        enable: true,
                        mode: 'grab'
                    },
                    onclick: {
                        enable: true,
                        mode: 'push'
                    },
                    resize: true
                },
                modes: {
                    grab: {
                        distance: 140,
                        line_linked: {
                            opacity: 1
                        }
                    },
                    push: {
                        particles_nb: 4
                    }
                }
            },
            retina_detect: true,
            fps_limit: 60
        };

        particlesJS('particles-js', particlesConfig);
    }

    // Animations du chat
    initChatAnimations() {
        const chatContainer = document.querySelector('.chat-container');
        const messages = chatContainer.querySelector('.chat-messages');

        // Animation d'apparition des messages
        const messageObserver = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.classList && node.classList.contains('message')) {
                        animation.fadeIn(node);
                        this.scrollToBottom(messages);
                    }
                });
            });
        });

        messageObserver.observe(messages, { childList: true });
        this.observers.set('chat', messageObserver);
    }

    // Animations des formulaires
    initFormAnimations() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            const inputs = form.querySelectorAll('input, textarea');
            
            inputs.forEach(input => {
                // Animation du label
                input.addEventListener('focus', () => {
                    const label = input.parentElement.querySelector('label');
                    if (label) {
                        animation.animate(label, [
                            { transform: 'translateY(0)', fontSize: '1rem' },
                            { transform: 'translateY(-1.5rem)', fontSize: '0.8rem' }
                        ], { duration: 200 });
                    }
                });

                // Animation de validation
                input.addEventListener('blur', () => {
                    if (input.value.trim() !== '') {
                        animation.animate(input, [
                            { borderColor: '#4B5563' },
                            { borderColor: '#10B981' }
                        ], { duration: 200 });
                    }
                });
            });
        });
    }

    // Utilitaires d'animation
    playEntryAnimation(element) {
        const delay = element.dataset.delay || 0;
        
        setTimeout(() => {
            animation.animate(element, [
                { opacity: 0, transform: 'translateY(20px)' },
                { opacity: 1, transform: 'translateY(0)' }
            ], {
                duration: config.animations.defaultDuration,
                easing: config.animations.defaultEasing
            });
        }, delay);
    }

    scrollToBottom(element) {
        animation.animate(element, [
            { scrollTop: element.scrollTop },
            { scrollTop: element.scrollHeight }
        ], {
            duration: 300,
            easing: 'ease-out'
        });
    }

    // Gestion des animations
    pauseAllAnimations() {
        this.animations.forEach(animation => animation.pause());
    }

    resumeAllAnimations() {
        this.animations.forEach(animation => animation.play());
    }

    // Nettoyage
    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
        this.animations.clear();
    }
}

export default new AnimationManager(); 