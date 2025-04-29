import config from '../config.js';

class EmailService {
    constructor() {
        this.templateParams = {
            name: '',
            email: '',
            message: '',
            subject: '',
            company: '',
            phone: '',
            to_email: 'contact@breizh.ai'
        };
        this.serviceID = 'service_4mj53p6';  // ID du service EmailJS
        this.templateID = 'template_contact';  // ID du template EmailJS
        this.publicKey = 'zcpUCFdECPiiDuUk-';  // Clé publique EmailJS
    }

    async sendEmail(formData) {
        try {
            console.log('Tentative d\'envoi avec EmailJS:', {
                serviceID: this.serviceID,
                templateID: this.templateID,
                params: formData
            });

            // Préparation des paramètres
            this.templateParams = {
                name: formData.userName,
                email: formData.userEmail,
                message: formData.userMessage,
                subject: formData.userSubject,
                company: formData.userCompany || 'Non spécifié',
                phone: formData.userPhone || 'Non spécifié',
                to_email: 'contact@breizh.ai'
            };

            // Envoi de l'email via EmailJS
            const response = await emailjs.send(
                this.serviceID,
                this.templateID,
                this.templateParams,
                this.publicKey
            );

            console.log('Réponse EmailJS:', response);

            if (response.status === 200) {
                return {
                    success: true,
                    message: 'Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.'
                };
            } else {
                throw new Error('Erreur lors de l\'envoi du message');
            }
        } catch (error) {
            console.error('Erreur EmailJS:', error);
            return {
                success: false,
                error: 'Une erreur est survenue lors de l\'envoi du message. Veuillez réessayer plus tard ou nous contacter par téléphone.'
            };
        }
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    validateFormData(formData) {
        const errors = {};

        if (!formData.userName || formData.userName.trim().length < 2) {
            errors.name = 'Le nom doit contenir au moins 2 caractères';
        }

        if (!formData.userEmail || !this.validateEmail(formData.userEmail)) {
            errors.email = 'Veuillez entrer une adresse email valide';
        }

        if (!formData.userSubject || formData.userSubject.trim().length < 5) {
            errors.subject = 'Le sujet doit contenir au moins 5 caractères';
        }

        if (!formData.userMessage || formData.userMessage.trim().length < 10) {
            errors.message = 'Le message doit contenir au moins 10 caractères';
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }
}

export default new EmailService(); 