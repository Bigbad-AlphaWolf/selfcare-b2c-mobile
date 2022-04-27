import {Injectable} from '@angular/core';
import * as SecureLS from 'secure-ls';
const ls = new SecureLS({encodingType: 'aes'});

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  constructor() {}

  saveToLocalStorage(key: string, data: any) {
    ls.set(key, data);
  }

  clearFromLocalStorage(key: string) {
    ls.remove(key);
  }

  getFromLocalStorage(key: string) {
    return ls.get(key);
  }
}
