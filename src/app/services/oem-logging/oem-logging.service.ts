import { Injectable } from '@angular/core';
import { FirebaseAnalytics } from '@ionic-native/firebase-analytics/ngx';
import { BatchAnalyticsService } from '../batch-analytics/batch-analytics.service';

@Injectable({
  providedIn: 'root',
})
export class OemLoggingService {
  constructor(
    private batchService: BatchAnalyticsService,
    private firebaseAnalytics: FirebaseAnalytics
  ) {}

  setUserAttribute(data: { keyAttribute: string; valueAttribute: any }) {
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
    // this.batchService.registerEvent(eventName, null, infos);
    // this.registerEventWithFirebase(eventName, infos);
  }

  registerEventWithFirebase(
    eventName: string,
    infos: {
      dataName: string;
      dataValue: string;
    }[]
  ) {
    const content = {};
    infos.forEach((item) => {
      content[item.dataName] = item.dataValue;
    });
    this.firebaseAnalytics.logEvent(eventName, content).then((res) => {});
  }
}
