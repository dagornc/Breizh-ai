const config = {
    // Configuration du site
    site: {
        url: 'http://localhost:8000',
        name: 'Breizh AI',
        description: 'Votre partenaire en transformation digitale en Bretagne',
        contact: {
            email: 'contact@breizh.ai',
            phone: '+33 (0)6 12 98 01 52'
        }
    },
    // Configuration du mode sombre
    darkMode: {
        enabled: true,
        auto: true,
        storageKey: 'theme-preference',
        className: 'dark-mode',
        autoSwitch: true,
        defaultTheme: 'light',
        transitionDuration: 300
    },

    // Configuration de l'accessibilité
    // Configuration du chat
    chat: {
        maxMessageLength: 1000,
        maxMessages: 50,
        typingDelay: 30,
        responseTimeout: 30000,
        retryAttempts: 3,
        contextTimeout: 1800000, // 30 minutes
        statusMessages: {
            online: 'En ligne',
            typing: 'En train d\'écrire...',
            offline: 'Hors ligne'
        },
        typingIndicatorDelay: 1000,
        messageDisplayDelay: 300
    },

    accessibility: {
        focusVisible: true,
        reducedMotion: true,
        highContrast: false,
        highContrastMode: false,
        fontSize: {
            min: 14,
            max: 20,
            step: 2
        }
    }
};

export default config;