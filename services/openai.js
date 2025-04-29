import config from '../config/index.js';

// Service OpenAI pour le frontend
const OpenAIService = {
    // Configuration
    apiKey: config.api.openai.key,
    systemPrompt: `Tu es Morgan, un ingénieur de la société bretonne Breizh AI, spécialisée en services digitaux pour les artisans bretons. 
    Tu adoptes un ton professionnel et poli. En tant qu'expert en IA et en transformation digitale, tu aides les artisans à moderniser leurs processus 
    et à adopter les meilleures solutions numériques. Tu connais parfaitement les besoins spécifiques des artisans bretons et les solutions technologiques 
    adaptées à leur métier.`,

    // Méthodes principales
    async sendMessage(message, conversationHistory = []) {
        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: config.api.openai.model,
                    messages: [
                        { role: 'system', content: this.systemPrompt },
                        ...conversationHistory.map(msg => ({
                            role: msg.isUser ? 'user' : 'assistant',
                            content: msg.content
                        })),
                        { role: 'user', content: message }
                    ],
                    temperature: config.api.openai.temperature,
                    max_tokens: config.api.openai.maxTokens
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'Erreur de communication avec OpenAI');
            }

            const data = await response.json();
            return {
                success: true,
                message: data.choices[0].message.content
            };
        } catch (error) {
            console.error('Erreur OpenAI:', error);
            return {
                success: false,
                error: error.message || 'Désolé, une erreur est survenue lors de la génération de la réponse.'
            };
        }
    },

    // Formater l'historique de conversation pour OpenAI
    formatConversationHistory(history) {
        return history.map(msg => ({
            role: msg.isUser ? 'user' : 'assistant',
            content: msg.content
        }));
    },

    // Générer une réponse via l'API OpenAI
    async generateResponse(message, conversationHistory = []) {
        return this.sendMessage(message, conversationHistory);
    }
};

export default OpenAIService;