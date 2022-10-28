import { Injectable } from '@angular/core';
import { FirebaseAnalytics } from '@ionic-native/firebase-analytics/ngx';
import { BatchAnalyticsService } from '../batch-analytics/batch-analytics.service';

export enum ANALYTICS_PROVIDER {
  ALL = 'ALL',
  BATCH = 'BACTH',
  FIREBASE_ANALYTICS = 'FIREBASE_ANALYTICS',
}
@Injectable({
  providedIn: 'root',
})
export class OemLoggingService {
  constructor(private batchService: BatchAnalyticsService, private firebaseAnalytics: FirebaseAnalytics) {}

  setUserAttribute(data: { keyAttribute: string; valueAttribute: any }) {
    try {
      this.batchService.setUserAttribute(data);
      this.firebaseAnalytics.setUserProperty(data.keyAttribute, data.valueAttribute.toString()).then(res => {
        console.log(res);
      });
    } catch (error) {
      console.log('error', error);
    }

    //this.followAnalytics.setString(data.keyAttribute, data.valueAttribute);
  }

  removeUserAttribute(keyAttribute: string) {
    this.batchService.removeUseraAttribute(keyAttribute);
  }
  registerUserID(hashName: string) {
    this.batchService.registerID(hashName);
    this.firebaseAnalytics.setUserId(hashName).then(res => {
      console.log(res);
    });
    //this.followAnalytics.registerId(hashName);
    //Firebase Analytics set userID
  }

  registerEvent(
    eventName: string,
    infos: {
      dataName: string;
      dataValue: string;
    }[] = [],
    logFor: ANALYTICS_PROVIDER = ANALYTICS_PROVIDER.FIREBASE_ANALYTICS
  ) {
    if (logFor === ANALYTICS_PROVIDER?.ALL || logFor === ANALYTICS_PROVIDER?.BATCH) {
      this.batchService.registerEvent(eventName, null, infos);
    }
    this.registerEventWithFirebase(eventName, infos);
  }

  registerEventWithFirebase(
    eventName: string,
    infos: {
      dataName: string;
      dataValue: string;
    }[] = []
  ) {
    const content = {};
    infos?.forEach(item => {
      content[item.dataName] = item.dataValue;
    });
    try {
      this.firebaseAnalytics.logEvent(eventName, content).then(res => {});
    } catch (error) {}
  }

  addValueToCollectionTag(collectionName: string, addedValue: string) {
    this.batchService.addValueToCollectionTag(collectionName, addedValue);
  }

  removeValueToCollectionTag(collectionName: string, value: string) {
    this.batchService.removeValueToCollectionTag(collectionName, value);
  }
}
