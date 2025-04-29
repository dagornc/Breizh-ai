// Configuration des API
const apiConfig = {
    openai: {
        key: process.env.OPENAI_API_KEY || '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',
        model: 'gpt-4',
        maxTokens: 150,
        temperature: 0.7
    },
    emailjs: {
        publicKey: 'zcpUCFdECPiiDuUk-',
        serviceID: 'mail_breizh.ai',
        templateID: 'template_contact'
    }
};

export default apiConfig;