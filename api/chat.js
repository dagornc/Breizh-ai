import config from '../config.js';
import { errorHandling } from '../utils.js';
import openaiService from '../services/openai.js';

class ChatAPI {
    constructor() {
        this.baseURL = config.site.url + '/api';
        this.endpoints = {
            chat: '/chat',
            history: '/chat/history',
            feedback: '/chat/feedback'
        };
        this.conversationHistory = [];
        this.isProcessing = false;
        console.log('ChatAPI initialisé');
    }

    async sendMessage(message) {
        if (this.isProcessing) {
            console.log('Une requête est déjà en cours de traitement');
            return {
                success: false,
                error: 'Une requête est déjà en cours de traitement'
            };
        }

        try {
            this.isProcessing = true;
            console.log('Envoi du message:', message);

            // Vérification de la longueur du message
            if (!message || message.trim().length === 0) {
                throw new Error('Le message ne peut pas être vide');
            }

            if (message.length > config.chat.maxMessageLength) {
                throw new Error(`Le message ne peut pas dépasser ${config.chat.maxMessageLength} caractères`);
            }

            // Appel à l'API OpenAI
            const response = await openaiService.generateResponse(
                message,
                openaiService.formatConversationHistory(this.conversationHistory)
            );

            console.log('Réponse reçue:', response);

            if (!response.success) {
                throw new Error(response.error);
            }

            // Ajouter les messages à l'historique
            this.conversationHistory.push(
                { isUser: true, content: message },
                { isUser: false, content: response.message }
            );

            // Limiter la taille de l'historique
            if (this.conversationHistory.length > config.chat.maxMessages * 2) {
                this.conversationHistory = this.conversationHistory.slice(-config.chat.maxMessages * 2);
            }

            console.log('Historique mis à jour, nombre de messages:', this.conversationHistory.length);

            return {
                success: true,
                data: {
                    message: response.message,
                    usage: response.usage
                }
            };
        } catch (error) {
            console.error('Erreur dans sendMessage:', error);
            const errorDetails = await errorHandling.handleError(error, 'sendMessage');
            return {
                success: false,
                error: errorDetails
            };
        } finally {
            this.isProcessing = false;
        }
    }

    async getHistory() {
        try {
            const response = await fetch(this.baseURL + this.endpoints.history);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return {
                success: true,
                data: data
            };
        } catch (error) {
            const errorDetails = await errorHandling.handleError(error, 'getHistory');
            return {
                success: false,
                error: errorDetails
            };
        }
    }

    async sendFeedback(messageId, feedback) {
        try {
            const response = await fetch(this.baseURL + this.endpoints.feedback, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    messageId,
                    feedback
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return {
                success: true,
                data: data
            };
        } catch (error) {
            const errorDetails = await errorHandling.handleError(error, 'sendFeedback');
            return {
                success: false,
                error: errorDetails
            };
        }
    }

    // Méthode pour analyser le contexte du message
    analyzeContext(message) {
        const keywords = {
            devis: ['devis', 'estimation', 'prix', 'tarif', 'coût'],
            facture: ['facture', 'paiement', 'règlement', 'comptabilité'],
            projet: ['projet', 'développement', 'création', 'mise en place'],
            support: ['problème', 'aide', 'assistance', 'support', 'bug'],
            formation: ['formation', 'apprentissage', 'tutoriel', 'guide']
        };

        const context = {};
        Object.entries(keywords).forEach(([category, words]) => {
            context[category] = words.some(word => 
                message.toLowerCase().includes(word.toLowerCase())
            );
        });

        return context;
    }

    // Méthode pour générer une réponse personnalisée basée sur le contexte
    generateContextualResponse(context) {
        const responses = {
            devis: "Je peux vous aider à établir un devis personnalisé. Pouvez-vous me donner plus de détails sur votre projet ?",
            facture: "Je peux vous aider avec la gestion de vos factures. Que souhaitez-vous faire exactement ?",
            projet: "Parlons de votre projet. Quels sont vos objectifs principaux ?",
            support: "Je suis là pour vous aider. Pouvez-vous décrire le problème que vous rencontrez ?",
            formation: "Je peux vous guider dans votre apprentissage. Quel aspect souhaitez-vous approfondir ?"
        };

        // Trouver la catégorie la plus pertinente
        const activeCategories = Object.entries(context)
            .filter(([_, isActive]) => isActive)
            .map(([category]) => category);

        if (activeCategories.length === 0) {
            return "Comment puis-je vous aider aujourd'hui ?";
        }

        return responses[activeCategories[0]];
    }

    // Méthode pour gérer les suggestions de réponse
    generateSuggestions(context) {
        const suggestions = {
            devis: [
                "Demander un devis détaillé",
                "Voir les tarifs",
                "Planifier un rendez-vous"
            ],
            facture: [
                "Gérer mes factures",
                "Voir mes paiements",
                "Configurer la facturation automatique"
            ],
            projet: [
                "Démarrer un nouveau projet",
                "Voir les étapes clés",
                "Consulter des exemples"
            ],
            support: [
                "Contacter le support",
                "Consulter la FAQ",
                "Signaler un problème"
            ],
            formation: [
                "Accéder aux tutoriels",
                "Voir le programme",
                "Réserver une session"
            ]
        };

        const activeCategories = Object.entries(context)
            .filter(([_, isActive]) => isActive)
            .map(([category]) => category);

        if (activeCategories.length === 0) {
            return [
                "Explorer nos services",
                "Demander un devis",
                "Contacter un conseiller"
            ];
        }

        return suggestions[activeCategories[0]];
    }

    clearHistory() {
        this.conversationHistory = [];
        console.log('Historique de conversation effacé');
    }

    getConversationHistory() {
        return this.conversationHistory;
    }
}

export default new ChatAPI(); 