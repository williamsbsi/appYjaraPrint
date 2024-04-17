interface IRGB {
    r: number;
    g: number;
    b: number;
    a: number;
}

/**
 * ESCPOS image
 */
export class ESCPOSImage {

    // Data
    private data: number[] = [];

    // Width
    private width: number = 0;

    // Height
    private height: number = 0;

    /**
     * Constructor
     * @param image 
     */
    constructor(image: HTMLImageElement) {
        // Set width 
        this.width = image.width;

        // Set height
        this.height = image.height;

        // Get image context
        let ctx = this.getContext(image);

        // Get data
        this.data = this.getBitData(ctx);
    }

    /**
     * Get bit data
     * @param ctx 
     */
    private getBitData(ctx: CanvasRenderingContext2D): number[] {
        // Init result
        let result: number[] = [];

        // Iterate rows
        for (let y = 0; y < this.height; y++) {
            // Iterate columns
            for (let x = 0; x < this.width; x++) {
                // Get pixel
                let pixel = ctx.getImageData(x, y, 1, 1).data;

                // Get rgb
                let rgb = this.getRGB(pixel);

                // Get rgb value
                let value = rgb.r + rgb.g + rgb.b;

                // Add bit to result
                result.push(value > 0 ? 0 : 1);
            }
        }

        // Return result
        return result;
    }

    /**
     * Get image context
     * @param image 
     */
    private getContext(image: HTMLImageElement): CanvasRenderingContext2D {
        // Create canvas
        var canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;

        // Set context
        var context = canvas.getContext('2d');
        context.drawImage(image, 0, 0);

        // Return context
        return context;
    }

    /**
     * Get RGB
     * @param pixel 
     */
    private getRGB(pixel: any): IRGB {
        // Return RGB
        return {
            r: pixel[0],
            g: pixel[1],
            b: pixel[2],
            a: pixel[3]
        }
    }

    /**
     * To raster
     */
    public toRaster() {
        // Init result
        let result = [];

        // Get width and height
        let width = this.width;
        let height = this.height;

        // N block lines
        let n = Math.ceil(width / 8);

        // Iterate
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < n; x++) {
                for (let b = 0; b < 8; b++) {
                    let i = x * 8 + b;

                    if (result[y * n + x] === undefined) {
                        result[y * n + x] = 0;
                    }

                    let c = x * 8 + b;

                    if (c < width) {
                        if (this.data[y * width + i]) {
                            result[y * n + x] += (0x80 >> (b & 0x7));
                        }
                    }
                }
            }
        }

        // Return result
        return {
            data: result,
            width: n,
            height: height
        };
    }   
}