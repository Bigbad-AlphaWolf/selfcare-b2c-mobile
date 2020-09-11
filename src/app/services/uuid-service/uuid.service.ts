import { Injectable } from '@angular/core';
import * as SecureLS from 'secure-ls';
import { of } from 'rxjs';
const ls = new SecureLS({ encodingType: 'aes' });

@Injectable({
    providedIn: 'root'
})
export class UuidService {
    constructor() {}

    generateRandomUuid() {//deprecier
        const uuid = ls.get('X-UUID');
        return of(uuid);
    }
}
