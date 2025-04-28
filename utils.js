export const errorHandling = {
    async handleError(error, context) {
        console.error(`Erreur dans ${context}:`, error);
        
        // Log l'erreur pour le débogage
        if (error.stack) {
            console.error('Stack trace:', error.stack);
        }

        // Retourner un message d'erreur approprié
        return error.message || 'Une erreur inattendue est survenue';
    }
};