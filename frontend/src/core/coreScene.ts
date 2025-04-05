export class CoreScene extends Phaser.Scene {
    resizeViewPort(
        width: number = 1,
        height: number = 1,
        InterfaceResizeNeeded = true
    ) {
        const screenWidth = this.scale.width;
        const screenHeight = this.scale.height;

        const zoomX = screenWidth / width;
        const zoomY = screenHeight / height;
        const zoom = Math.min(zoomX, zoomY);

        const newWidth = width * zoom;
        const newHeight = height * zoom;

        if (newWidth !== this.scale.width || newHeight !== this.scale.height) {
            this.scale.resize(newWidth, newHeight);
            this.cameras.main.setZoom(zoom); // Appliquer le zoom si la caméra est prête
        }
        if (InterfaceResizeNeeded) {
            this.resizeElements();
        }
    }

    resizeElements() {
        if (!this.cameras.main) {
            return;
        }
        // Redimensionner les éléments de la scène
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        // Redimensionner et réajuster la position de tous les éléments
        this.children.list.forEach((child) => {
            // Si c'est une image, on ajuste la taille
            if (child instanceof Phaser.GameObjects.Image) {
                child.setDisplaySize(this.scale.width, this.scale.height);
            }

            // Si c'est un texte, on ajuste sa position
            if (child instanceof Phaser.GameObjects.Text) {
                child.setPosition(centerX, centerY - 100); // Réajuster la position
            }

            // Si c'est un conteneur (comme un bouton), on réajuste la position
            if (child instanceof Phaser.GameObjects.Container) {
                child.setPosition(centerX, centerY); // Réajuster la position du conteneur
            }
        });
    }

    createButton(
        x: number,
        y: number,
        text: string,
        color: string,
        onClick: () => void
    ): Phaser.GameObjects.Container {
        // Créer le texte du bouton
        const buttonText = this.add
            .text(0, 0, text, {
                font: "20px Arial",
                color: "#FFFFFF",
                backgroundColor: color,
                padding: { left: 15, right: 15, top: 10, bottom: 10 },
            })
            .setOrigin(0.5);

        // Créer le conteneur du bouton
        const button = this.add.container(x, y, [buttonText]);

        // Ajuster la taille du conteneur pour qu'il s'adapte au texte
        const padding = 20; // Ajuste si nécessaire
        button.setSize(
            buttonText.width + padding * 2,
            buttonText.height + padding
        );

        // Création de la hitbox du bouton (en utilisant la position du conteneur du bouton)
        const hitArea = new Phaser.Geom.Rectangle(
            0, // X de la hitbox centrée sur le conteneur du bouton
            0, // Y de la hitbox centrée sur le conteneur du bouton
            button.width, // Largeur de la hitbox
            button.height // Hauteur de la hitbox
        );

        // Définir la zone interactive avec la méthode contains pour détecter l'interaction
        button.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);
        button.setScrollFactor(0); // Assurer que le bouton ne se déplace pas avec la caméra

        // Clic sur le bouton
        button.on("pointerdown", () => {
            console.log("Button clicked!"); // Débogage
            onClick(); // Appeler la fonction onClick
        });

        // Effet au survol
        button.on("pointerover", () => {
            console.log("Hover over button");
            buttonText.setStyle({ backgroundColor: "#cc0000" }); // Changer la couleur de fond au survol
        });

        // Effet au survol de la souris
        button.on("pointerout", () => {
            console.log("Hover out button");
            buttonText.setStyle({ backgroundColor: color }); // Revenir à la couleur initiale
        });

        return button;
    }

    createContainer(
        title: string,
        titleColor: string = "#FFFFFF",
        bgColor: number,
        x: number = 0,
        y: number = 0,
        height: number = 300,
        width: number = 200,
        borderColor: number
    ) {
        const newContainer = this.add.container(
            this.scale.width / 2,
            this.scale.height / 2
        );
        newContainer.setSize(300, 200);
        newContainer.setScrollFactor(0);

        // 🔲 Création du fond du pop-up
        const background = this.add.graphics();
        background.fillStyle(bgColor, 0.8); // Fond noir semi-transparent
        background.fillRoundedRect(x, y, height, width); // Fond arrondi

        // 🔴 Ajout d'un contour rouge
        if (borderColor) {
            background.lineStyle(4, 0xff0000, 1);
            background.strokeRoundedRect(x, y, height, width);
        }

        //background.setDepth(-1); // Met le fond derrière tout

        // 📝 Texte principal du pop-up
        const popupText = this.add
            .text(0, -50, title, {
                font: "24px Arial",
                color: titleColor,
            })
            .setOrigin(0.5);

        newContainer.add([background, popupText]);
    }

    CreatePopUp() {}
}

