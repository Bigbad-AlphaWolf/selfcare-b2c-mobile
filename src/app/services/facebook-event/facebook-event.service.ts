import { Injectable } from '@angular/core';
import { FacebookCustomEvent } from 'src/app/models/enums/facebook-custom-event.enum';
import { FacebookEvent } from 'src/app/models/enums/facebook-event.enum';
declare let fbq:Function;
@Injectable({
  providedIn: 'root'
})
export class FacebookEventService {

  constructor() { }

  fbCustomEvent(event:FacebookCustomEvent, data:any){ 
    fbq('trackCustom', event.toString(), data);
  }

  fbEvent(event:FacebookEvent, data:any){ 
    fbq('track', event.toString(), data);
  }
}
