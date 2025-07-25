# Breizh AI - Site Web

## 🎯 Projet
Site web professionnel pour Breizh AI, spécialisé dans les solutions d'intelligence artificielle.

## ✅ Corrections effectuées

### 1. **Nettoyage du code JavaScript**
- Suppression des `console.log` et `console.error` en production
- Optimisation du code de gestion des erreurs

### 2. **Correction des références d'images manquantes**
- Remplacement des images `Gemini_Generated_Image_x5r79mx5r79mx5r7 (1-4).jpg` par les images disponibles :
  - `ia-consulting-strategy.jpg`
  - `custom-ai-development.jpg`
  - `integration-deployment.jpg`
  - `data-analysis-bi.jpg`

- Correction des noms d'images avec majuscules :
  - `Dirigeant.jpg` → `dirigeant.jpg`
  - `Ingénieurs.jpg` → `ingenieurs.jpg`
  - `Managers du Digital.jpg` → `managers-digital.jpg`
  - `Artisan.jpg` → `artisan.jpg`

### 3. **Nettoyage des fichiers de sauvegarde**
- Conservation de seulement 3 fichiers de sauvegarde les plus récents
- Suppression des anciens fichiers de sauvegarde pour éviter la confusion

## 📁 Structure du projet

```
Breizh-ai/
├── index.html                    # Fichier principal (corrigé)
├── fond-anime.html              # Démo d'animation de fond
├── index copie 7.html           # Sauvegarde récente
├── index copie 9.html           # Sauvegarde récente
├── index copie 10.html          # Sauvegarde récente
├── cleanup_images.sh            # Script de correction d'images
├── cleanup_backups.sh           # Script de nettoyage des sauvegardes
├── README.md                    # Ce fichier
└── Images/                      # Toutes les images du site
    ├── logo-breizh-ai.png
    ├── favicon.png
    ├── artisan.jpg
    ├── dirigeant.jpg
    ├── ingenieurs.jpg
    ├── managers-digital.jpg
    ├── ia-consulting-strategy.jpg
    ├── custom-ai-development.jpg
    ├── integration-deployment.jpg
    └── data-analysis-bi.jpg
```

## 🚀 Démarrage

1. **Serveur local** :
   ```bash
   python3 -m http.server 8000
   ```
   Puis ouvrir http://localhost:8000

2. **Ouverture directe** :
   Ouvrir `index.html` dans un navigateur

## 🛠️ Scripts utiles

- `./cleanup_images.sh` : Corrige automatiquement les références d'images manquantes
- `./cleanup_backups.sh` : Nettoie les fichiers de sauvegarde

## ✅ Statut

- ✅ Code JavaScript nettoyé
- ✅ Images manquantes corrigées
- ✅ Fichiers de sauvegarde organisés
- ✅ Validation HTML OK
- ✅ Responsive design fonctionnel
- ✅ Animations de fond opérationnelles

## 📞 Contact

Pour toute question ou modification, contactez l'équipe Breizh AI. 