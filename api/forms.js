import config from '../config.js';
import { validation, errorHandling } from '../utils.js';
import emailService from '../services/email.js';

class FormsAPI {
    constructor() {
        this.baseURL = config.site.url + '/api';
        this.endpoints = {
            contact: '/contact',
            newsletter: '/newsletter'
        };
    }

    // Validation du formulaire de contact
    validateContactForm(formData) {
        const errors = {};
        const fields = ['name', 'email', 'subject', 'message'];

        fields.forEach(field => {
            const value = formData[field];
            const rules = config.forms.validation[field];
            const error = validation.validateField(value, rules);
            
            if (error) {
                errors[field] = error;
            }
        });

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }

    // Envoi du formulaire de contact
    async sendContactForm(formData) {
        try {
            // Validation des données
            const validation = emailService.validateFormData(formData);
            if (!validation.isValid) {
                return {
                    success: false,
                    errors: validation.errors
                };
            }

            // Envoi de l'email via EmailJS
            const response = await emailService.sendEmail(formData);
            
            if (!response.success) {
                throw new Error(response.error);
            }

            return {
                success: true,
                message: response.message
            };
        } catch (error) {
            const errorDetails = await errorHandling.handleError(error, 'sendContactForm');
            return {
                success: false,
                error: errorDetails
            };
        }
    }

    // Inscription à la newsletter
    async subscribeNewsletter(email) {
        try {
            // Validation de l'email
            if (!validation.validateEmail(email)) {
                return {
                    success: false,
                    error: {
                        message: 'Adresse email invalide'
                    }
                };
            }

            const response = await fetch(this.baseURL + this.endpoints.newsletter, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
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
            const errorDetails = await errorHandling.handleError(error, 'subscribeNewsletter');
            return {
                success: false,
                error: errorDetails
            };
        }
    }

    // Gestion des fichiers joints
    async handleFileUpload(file) {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch(this.baseURL + '/upload', {
                method: 'POST',
                body: formData
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
            const errorDetails = await errorHandling.handleError(error, 'handleFileUpload');
            return {
                success: false,
                error: errorDetails
            };
        }
    }

    // Validation des fichiers joints
    validateFile(file) {
        const maxSize = 5 * 1024 * 1024; // 5MB
        const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];

        if (file.size > maxSize) {
            return {
                isValid: false,
                error: 'Le fichier ne doit pas dépasser 5MB'
            };
        }

        if (!allowedTypes.includes(file.type)) {
            return {
                isValid: false,
                error: 'Format de fichier non supporté. Formats acceptés : JPG, PNG, PDF'
            };
        }

        return {
            isValid: true
        };
    }

    // Formatage des données du formulaire
    formatFormData(formData) {
        const formatted = {};

        // Nettoyage et formatage des champs texte
        ['name', 'email', 'subject', 'message'].forEach(field => {
            if (formData[field]) {
                formatted[field] = formData[field].trim();
            }
        });

        // Formatage de la date
        formatted.submittedAt = new Date().toISOString();

        // Ajout des métadonnées
        formatted.metadata = {
            userAgent: navigator.userAgent,
            language: navigator.language,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };

        return formatted;
    }

    // Gestion des erreurs de formulaire
    handleFormErrors(errors) {
        const errorMessages = {
            name: {
                required: 'Le nom est requis',
                minLength: 'Le nom doit contenir au moins 2 caractères',
                maxLength: 'Le nom ne doit pas dépasser 50 caractères'
            },
            email: {
                required: 'L\'email est requis',
                invalid: 'L\'email n\'est pas valide'
            },
            subject: {
                required: 'Le sujet est requis',
                minLength: 'Le sujet doit contenir au moins 5 caractères',
                maxLength: 'Le sujet ne doit pas dépasser 100 caractères'
            },
            message: {
                required: 'Le message est requis',
                minLength: 'Le message doit contenir au moins 10 caractères',
                maxLength: 'Le message ne doit pas dépasser 1000 caractères'
            }
        };

        return Object.entries(errors).reduce((acc, [field, error]) => {
            acc[field] = errorMessages[field][error] || 'Erreur de validation';
            return acc;
        }, {});
    }

    // Réinitialisation du formulaire
    resetForm(formElement) {
        formElement.reset();
        
        // Réinitialisation des états visuels
        const inputs = formElement.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.classList.remove('valid', 'invalid');
            const errorElement = input.parentElement.querySelector('.error-message');
            if (errorElement) {
                errorElement.remove();
            }
        });

        // Réinitialisation des fichiers joints
        const fileInputs = formElement.querySelectorAll('input[type="file"]');
        fileInputs.forEach(input => {
            input.value = '';
            const preview = input.parentElement.querySelector('.file-preview');
            if (preview) {
                preview.innerHTML = '';
            }
        });
    }
}

export default new FormsAPI(); 