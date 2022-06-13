
import * as THREE from "three";

export class Util {
    static padLeadingZeros(num, size) {
        var s = num+"";
        while (s.length < size) s = "0" + s;
        return s;
    }

    static createEmptyImageBitmap(width, height, backgroundColor)
    {
        return new Promise(function(resolve, reject) {
            let canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;        
            let context = canvas.getContext('2d');
            context.fillStyle = backgroundColor;        
            context.fillRect(0, 0, width, height);
            let imageData = context.getImageData(0, 0, width, height);            
            createImageBitmap(imageData)
                .then(image => {        
                    resolve(image);
                })
                .catch(error => {
                    reject(error);
                });
        });        
    }    

    static createImageBitmapFromDataUrl(dataUrl)
    {
        return new Promise(function(resolve, reject) {
            let image = document.createElement("img");                    
            image.src = dataUrl;
            image.onload = () => {
                createImageBitmap(image)
                    .then(imageBitmap => {        
                        resolve(imageBitmap);
                    })
                    .catch(error => {
                        reject(error);
                    });
            };
        });        
    }         

    static createBlobFromImageBitmap(image) {
        return new Promise(function(resolve, reject) {        
            let canvas = document.createElement('canvas');
            canvas.width = image.width;
            canvas.height = image.height;
            let context = canvas.getContext('2d');
            context.drawImage(image, 0, 0);        
            canvas.toBlob(blob => {            
                resolve(blob);
            });
        });
    }

    static createClonedImageBitmap(image)
    {
        return createImageBitmap(image);
    }

    static createImageBitmapFromFile(fileInfo) {
        return new Promise(function(resolve, reject) {        
            const reader = new FileReader();
            reader.onload = (e) => { 
                let dataUrl = e.target.result;                 
                new THREE.ImageLoader().load(
                    dataUrl,                
                    (image) => {
                        createImageBitmap(image, 0, 0, image.width, image.height)
                            .then(imageBitmap => {
                                resolve(imageBitmap);
                            })
                            .catch(error => {
                                reject(error);
                            });
                    },
                    undefined,
                    (err) => {
                        reject(JSON.stringify(reader.error));
                    }
                );
            };
            reader.onerror = (e) => {
                reject(JSON.stringify(reader.error));
            };     
            reader.readAsDataURL(fileInfo);
        });
    }

    static scanDataToPoints(robotPosX, robotPosY, directionAngle, data) {
        let points = []
        let angle0Rad = Math.PI * directionAngle / 180;

        for(let i=0; i<data.ranges.length; i++) {
            let dist = data.ranges[i];
            let angle = angle0Rad + data.angle_min + data.angle_increment * i;
            let x = robotPosX + Math.cos(angle) * dist;
            let y = robotPosY + Math.sin(angle) * dist; 
            points.push({x:x, y:y, z:0, intensity: (i < data.intensities.length ? data.intensities[i]: 0)});
        }
        return points;
    }

    static getColorR(color) {
        return (color & 0xff0000) >>> 16;
    }

    static getColorG(color) {
        return (color & 0x00ff00) >>> 8;
    }

    static getColorB(color) {
        return (color & 0x0000ff);
    }

    static getRGB(color) {
        return {r:Util.getColorR(color),g:Util.getColorG(color),b:Util.getColorB(color)}
    }

    static hexColorToInt(hexString) {                
        let color = new THREE.Color(hexString);
        return (color.r * 255 << 16) + (color.g * 255 << 8) + (color.b * 255);
    }

    static uuidv4() {
        return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
          (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
      }

    static quatToDegAngle(x,y,z,w) {
        let siny_cosp = 2 * (w * z + x * y);
        let cosy_cosp = 1 - 2 * (y * y + z * z);
        let rad = Math.atan2(siny_cosp, cosy_cosp);
        return rad / Math.PI * 180;
    }

    static readTextFromLocalFile(fileInfo) {
        return new Promise(function(resolve, reject) {        
            const reader = new FileReader();
            reader.onload = (e) => { 
                resolve(e.target.result);
                
            };
            reader.onerror = (e) => {
                reject(JSON.stringify(reader.error));
            };     
            reader.readAsText(fileInfo);
        });
    }    

    static readJsonFromLocalFile(fileInfo) {
        return new Promise(function(resolve, reject) {        
            const reader = new FileReader();
            reader.onload = (e) => { 
                let dataUrl = e.target.result;                 

                resolve(dataUrl);
                
            };
            reader.onerror = (e) => {
                reject(JSON.stringify(reader.error));
            };     
            reader.readAsDataURL(fileInfo);
        });
    }

    static isNumber(value) {
        if(typeof value === 'number') {
          return true;
        }
        else if(typeof value === 'string') {        
          let trimmedValue = value.trim();
          if(trimmedValue !== value) {
            return false;
          }
          if(trimmedValue === '') {
            return false;
          }
          return !isNaN(value);
        }
        else {
          return false;
        }
    }

}
