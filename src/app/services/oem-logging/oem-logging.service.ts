import {Injectable} from '@angular/core';
import {BatchAnalyticsService} from '../batch-analytics/batch-analytics.service';

@Injectable({
  providedIn: 'root'
})
export class OemLoggingService {
  constructor(private batchService: BatchAnalyticsService) {}

  setUserAttribute(data: {keyAttribute: string; valueAttribute: any}) {
    this.batchService.setUserAttribute(data);
    //Firebase Analytics set method for user attributes
  }

  registerUserID(hashName: string) {
    this.batchService.registerID(hashName);
    //Firebase Analytics set userID
  }

  registerEvent(
    eventName: string,
    infos: {
      dataName: string;
      dataValue: string;
    }[]
  ) {
    this.batchService.registerEvent(eventName, null, infos);
    //Firebase Analytics registerEventMethod
  }
}
