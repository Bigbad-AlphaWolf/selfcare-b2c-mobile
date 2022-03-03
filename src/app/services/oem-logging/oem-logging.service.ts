import { Injectable } from '@angular/core';
import { FirebaseAnalytics } from '@ionic-native/firebase-analytics/ngx';
import { BatchAnalyticsService } from '../batch-analytics/batch-analytics.service';
import { FollowAnalyticsService } from '../follow-analytics/follow-analytics.service';

@Injectable({
  providedIn: 'root',
})
export class OemLoggingService {
  constructor(
    private batchService: BatchAnalyticsService,
    private firebaseAnalytics: FirebaseAnalytics,
    private followAnalytics: FollowAnalyticsService
  ) {}

  setUserAttribute(data: { keyAttribute: string; valueAttribute: any }) {
    this.batchService.setUserAttribute(data);
    this.firebaseAnalytics
      .setUserProperty(data.keyAttribute, data.valueAttribute.toString())
      .then((res) => {
        console.log(res);
      });
    this.followAnalytics.setString(data.keyAttribute, data.valueAttribute);
  }

  registerUserID(hashName: string) {
    this.batchService.registerID(hashName);
    this.firebaseAnalytics.setUserId(hashName).then((res) => {
      console.log(res);
    });
    this.followAnalytics.registerId(hashName);
    //Firebase Analytics set userID
  }

  registerEvent(
    eventName: string,
    infos: {
      dataName: string;
      dataValue: string;
    }[],
    tagWithBatch?,
    tagWithFollow = true
  ) {
    if (tagWithBatch) {
      this.batchService.registerEvent(eventName, null, infos);
    }
    if (tagWithFollow) {
      const data = {};
      infos?.forEach((element) => {
        data[element.dataName] = element.dataValue;
      });
      this.followAnalytics.registerEventFollow(eventName, 'event', data);
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
    infos?.forEach((item) => {
      content[item.dataName] = item.dataValue;
    });
    this.firebaseAnalytics.logEvent(eventName, content).then((res) => {});
  }
}
