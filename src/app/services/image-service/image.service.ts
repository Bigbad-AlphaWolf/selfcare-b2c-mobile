import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor() { }

  dataURItoBlob(dataURI) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/png' });
    return blob;
 }

 convertBase64ToImageObject(base64: string, filename: string) {
  const imageBlob = this.dataURItoBlob(base64);
  const imageFile = new File([imageBlob], filename, { type: 'image/jpeg' });
  console.log('blob', new Blob([imageBlob], {type: 'image/jpeg'}));

  return imageFile;
 }

 displayImage(file: any) {
  const generatedImage = window.URL.createObjectURL(file);
  window.open(generatedImage);
 }
}
