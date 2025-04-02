export class CoreScene extends Phaser.Scene {
    resizeViewPort(width: number = 1, height: number = 1) {
        const screenWidth = this.scale.width;
        const screenHeight = this.scale.height;

        const zoomX = screenWidth / width;
        const zoomY = screenHeight / height;
        const zoom = Math.min(zoomX, zoomY);

        const newWidth = width * zoom;
        const newHeight = height * zoom;

        // 🔹 Empêcher le redimensionnement si la taille ne change pas
        if (newWidth !== this.scale.width || newHeight !== this.scale.height) {
            this.scale.resize(newWidth, newHeight);
            this.cameras.main.setZoom(zoom);
        }
    }
}

