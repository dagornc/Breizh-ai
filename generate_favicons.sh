#!/bin/bash

# Création du dossier images s'il n'existe pas
mkdir -p assets/images

# Création d'une image de base avec un B stylisé
convert -size 512x512 xc:none \
    -fill '#2563eb' \
    -draw "roundrectangle 0,0 512,512 50,50" \
    -font Arial-Bold -pointsize 300 -fill white \
    -gravity center -draw "text 0,0 'B'" \
    -fill white -draw "circle 400,400 400,440" \
    -fill white -draw "circle 350,350 350,375" \
    -fill white -draw "circle 450,350 450,365" \
    assets/images/favicon-base.png

# Génération des différentes tailles
convert assets/images/favicon-base.png -resize 16x16 assets/images/favicon-16x16.png
convert assets/images/favicon-base.png -resize 32x32 assets/images/favicon-32x32.png
convert assets/images/favicon-base.png -resize 180x180 assets/images/apple-touch-icon.png
convert assets/images/favicon-base.png -resize 192x192 assets/images/android-chrome-192x192.png
convert assets/images/favicon-base.png -resize 512x512 assets/images/android-chrome-512x512.png

# Création du favicon.ico (qui contient plusieurs tailles)
convert assets/images/favicon-16x16.png assets/images/favicon-32x32.png assets/images/favicon.ico

# Nettoyage
rm assets/images/favicon-base.png

echo "Favicons générés avec succès !" 