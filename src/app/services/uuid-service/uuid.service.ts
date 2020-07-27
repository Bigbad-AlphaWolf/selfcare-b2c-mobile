import { Injectable } from '@angular/core';
import * as Fingerprint2 from 'fingerprintjs2';
import * as SecureLS from 'secure-ls';
import { of, Observable } from 'rxjs';
const ls = new SecureLS({ encodingType: 'aes' });

@Injectable({
    providedIn: 'root'
})
export class UuidService {
    constructor() {}

    generateRandomUuid() {
        const fingerprint = ls.get('X-UUID');
        if (fingerprint) {
            return of(fingerprint);
        }
        return new Observable(obs => {
            Fingerprint2.get(components => {
                const values = components.map(component => {
                    return component.value;
                });
                const x_uuid = Fingerprint2.x64hash128(values.join(''), 31);
                ls.set('X-UUID', x_uuid);
                obs.next(x_uuid);
            });
        });
    }
}
