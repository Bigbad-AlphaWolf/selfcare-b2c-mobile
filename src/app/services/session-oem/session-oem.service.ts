import { Injectable } from '@angular/core';
import * as SecureLS from 'secure-ls';
import { CODE_CLIENT, PROFIL, FORMULE, CODE_FORMULE } from 'src/app/utils/constants';
const ls = new SecureLS({ encodingType: "aes" });

@Injectable({
  providedIn: 'root'
})
export class SessionOem {

  constructor() { }

  static get PHONE(){
    return ls.get("currentPhoneNumber");
  }

  static get CODE_CLIENT(){
    return ls.get(CODE_CLIENT);
  }
  static get PROFIL(){
    return ls.get(PROFIL);
  }
  static get FORMULE(){
    return ls.get(FORMULE);
  }
  static get CODE_FORMULE(){
    return ls.get(CODE_FORMULE);
  }
}
