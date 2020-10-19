import { Injectable } from '@angular/core';
import * as SecureLS from 'secure-ls';
import { v4 as uuidv4 } from 'uuid';
const ls = new SecureLS({ encodingType: 'aes' });

@Injectable({
  providedIn: 'root',
})
export class UuidService {
  constructor() {}

  getUuid() {
    let uuid = ls.get('X-UUID');
    if (uuid && uuid !== '') {
      ls.set('X-UUID', uuid);
      return uuid;
    }
    let deviceInfo = window['device'];
    if (deviceInfo && deviceInfo.uuid && deviceInfo.uuid !== '') {
      ls.set('X-UUID', uuid);
      uuid = deviceInfo.uuid;
      return uuid;
    }
    uuid = uuidv4();
    ls.set('X-UUID', uuid);
    return uuid;
  }
}
