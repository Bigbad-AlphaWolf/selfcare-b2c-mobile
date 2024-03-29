import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  BASE64_MARKER = ';base64,';

  constructor() {}

  async convertBase64ToBlob(base64: string) {
    const base64Response = await fetch(`${base64}`);
    return base64Response.blob();
  }

  removeBase64Prefix(base64: string) {
    if (base64 && base64.length) {
      return base64.split(',')[1];
    }
  }
}
