// Configuration par défaut si le module config n'est pas disponible
const defaultConfig = {
    darkMode: {
        autoSwitch: true
    }
};

export class ThemeManager {
    constructor() {
        this.darkModeEnabled = false;
        this.highContrastEnabled = false;
        this.fontSize = 'medium';
        this.config = defaultConfig;
        this.init();
    }

    init() {
        // Charger les préférences sauvegardées
        this.loadPreferences();
        
        // Initialiser le thème selon les préférences système
        this.initSystemPreferences();
        
        // Mettre en place les écouteurs d'événements
        this.setupEventListeners();
        
        // Appliquer les préférences initiales
        this.applyPreferences();
    }

    loadPreferences() {
        try {
            const preferences = JSON.parse(localStorage.getItem('theme-preferences')) || {};
            this.darkModeEnabled = preferences.darkMode ?? this.darkModeEnabled;
            this.highContrastEnabled = preferences.highContrast ?? this.highContrastEnabled;
            this.fontSize = preferences.fontSize ?? this.fontSize;
        } catch (error) {
            console.error('Erreur lors du chargement des préférences:', error);
        }
    }

    savePreferences() {
        try {
            const preferences = {
                darkMode: this.darkModeEnabled,
                highContrast: this.highContrastEnabled,
                fontSize: this.fontSize
            };
            localStorage.setItem('theme-preferences', JSON.stringify(preferences));
        } catch (error) {
            console.error('Erreur lors de la sauvegarde des préférences:', error);
        }
    }

    initSystemPreferences() {
        // Détecter la préférence de thème du système
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)');
        if (this.config.darkMode.autoSwitch) {
            this.darkModeEnabled = prefersDarkMode.matches;
        }

        // Détecter la préférence de contraste du système
        const prefersHighContrast = window.matchMedia('(prefers-contrast: more)');
        this.highContrastEnabled = prefersHighContrast.matches;

        // Détecter la préférence de mouvement réduit
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (prefersReducedMotion.matches) {
            document.documentElement.classList.add('reduced-motion');
        }
    }

    setupEventListeners() {
        // Écouter les changements de préférence système pour le thème sombre
        const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        darkModeMediaQuery.addEventListener('change', (e) => {
            if (this.config.darkMode.autoSwitch) {
                this.setDarkMode(e.matches);
            }
        });

        // Écouter les changements de préférence système pour le contraste
        const highContrastMediaQuery = window.matchMedia('(prefers-contrast: more)');
        highContrastMediaQuery.addEventListener('change', (e) => {
            this.setHighContrast(e.matches);
        });

        // Écouter les changements de préférence système pour le mouvement réduit
        const reducedMotionMediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        reducedMotionMediaQuery.addEventListener('change', (e) => {
            document.documentElement.classList.toggle('reduced-motion', e.matches);
        });

        // Ajouter les écouteurs pour les boutons de contrôle du thème
        document.getElementById('toggleDarkMode')?.addEventListener('click', () => this.toggleDarkMode());
        document.getElementById('toggleHighContrast')?.addEventListener('click', () => this.toggleHighContrast());
        document.getElementById('increaseFontSize')?.addEventListener('click', () => this.increaseFontSize());
        document.getElementById('decreaseFontSize')?.addEventListener('click', () => this.decreaseFontSize());
    }

    setDarkMode(enabled) {
        this.darkModeEnabled = enabled;
        this.applyDarkMode();
        this.savePreferences();
        
        // Émettre un événement personnalisé
        window.dispatchEvent(new CustomEvent('themechange', {
            detail: { darkMode: enabled }
        }));
    }

    setHighContrast(enabled) {
        this.highContrastEnabled = enabled;
        this.applyHighContrast();
        this.savePreferences();
        
        // Émettre un événement personnalisé
        window.dispatchEvent(new CustomEvent('contrastchange', {
            detail: { highContrast: enabled }
        }));
    }

    setFontSize(size) {
        if (['small', 'medium', 'large'].includes(size)) {
            this.fontSize = size;
            this.applyFontSize();
            this.savePreferences();
            
            // Émettre un événement personnalisé
            window.dispatchEvent(new CustomEvent('fontsizechange', {
                detail: { fontSize: size }
            }));
        }
    }

    applyPreferences() {
        this.applyDarkMode();
        this.applyHighContrast();
        this.applyFontSize();
    }

    applyDarkMode() {
        document.documentElement.classList.toggle('dark-mode', this.darkModeEnabled);
        
        // Mettre à jour les méta-tags
        const themeColor = this.darkModeEnabled ? '#1F2937' : '#FFFFFF';
        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', themeColor);
        
        // Mettre à jour les images qui ont des versions sombres
        document.querySelectorAll('img[data-dark-src]').forEach(img => {
            const darkSrc = img.getAttribute('data-dark-src');
            const lightSrc = img.getAttribute('data-light-src') || img.getAttribute('src');
            img.src = this.darkModeEnabled && darkSrc ? darkSrc : lightSrc;
        });
    }

    applyHighContrast() {
        document.documentElement.classList.toggle('high-contrast', this.highContrastEnabled);
        
        // Ajuster les couleurs pour un meilleur contraste
        if (this.highContrastEnabled) {
            document.documentElement.style.setProperty('--text-opacity', '1');
            document.documentElement.style.setProperty('--border-opacity', '1');
        } else {
            document.documentElement.style.removeProperty('--text-opacity');
            document.documentElement.style.removeProperty('--border-opacity');
        }
    }

    applyFontSize() {
        const sizes = {
            small: '0.875',
            medium: '1',
            large: '1.125'
        };
        
        document.documentElement.style.setProperty('--base-font-size', `${sizes[this.fontSize]}rem`);
        document.documentElement.setAttribute('data-font-size', this.fontSize);
    }

    // API publique
    toggleDarkMode() {
        this.setDarkMode(!this.darkModeEnabled);
    }

    toggleHighContrast() {
        this.setHighContrast(!this.highContrastEnabled);
    }

    increaseFontSize() {
        const sizes = ['small', 'medium', 'large'];
        const currentIndex = sizes.indexOf(this.fontSize);
        if (currentIndex < sizes.length - 1) {
            this.setFontSize(sizes[currentIndex + 1]);
        }
    }

    decreaseFontSize() {
        const sizes = ['small', 'medium', 'large'];
        const currentIndex = sizes.indexOf(this.fontSize);
        if (currentIndex > 0) {
            this.setFontSize(sizes[currentIndex - 1]);
        }
    }

    resetPreferences() {
        this.darkModeEnabled = false;
        this.highContrastEnabled = false;
        this.fontSize = 'medium';
        this.applyPreferences();
        this.savePreferences();
    }
}

// Créer et exporter une instance par défaut
const themeManager = new ThemeManager();
export default themeManager;