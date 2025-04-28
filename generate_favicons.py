import os
import cairosvg
from PIL import Image

# Assurez-vous que le dossier images existe
os.makedirs('assets/images', exist_ok=True)

# Liste des tailles à générer
sizes = {
    'favicon.ico': (32, 32),
    'favicon-16x16.png': (16, 16),
    'favicon-32x32.png': (32, 32),
    'apple-touch-icon.png': (180, 180),
    'android-chrome-192x192.png': (192, 192),
    'android-chrome-512x512.png': (512, 512)
}

# Convertir SVG en PNG pour chaque taille
svg_path = 'assets/images/favicon.svg'
for filename, size in sizes.items():
    output_path = f'assets/images/{filename}'
    
    if filename.endswith('.ico'):
        # Pour favicon.ico, d'abord créer un PNG
        temp_png = 'assets/images/temp.png'
        cairosvg.svg2png(url=svg_path, write_to=temp_png, output_width=size[0], output_height=size[1])
        # Convertir PNG en ICO
        img = Image.open(temp_png)
        img.save(output_path, format='ICO')
        os.remove(temp_png)
    else:
        # Pour les autres, convertir directement en PNG
        cairosvg.svg2png(url=svg_path, write_to=output_path, output_width=size[0], output_height=size[1])

print("Favicons générés avec succès !") 