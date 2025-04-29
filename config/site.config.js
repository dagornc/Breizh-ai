// Configuration du site
const siteConfig = {
    name: 'Breizh AI',
    description: 'Votre partenaire en transformation digitale en Bretagne',
    contact: {
        email: 'contact@breizh.ai',
        phone: '+33 (0)6 12 98 01 52'
    },
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
        }
    }
};

export default siteConfig;