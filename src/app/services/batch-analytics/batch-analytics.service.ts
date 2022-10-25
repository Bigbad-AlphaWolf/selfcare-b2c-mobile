import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const { BATCH_ANDROID_API_KEY, BATCH_IOS_API_KEY } = environment;
declare var batch;

@Injectable({
  providedIn: 'root',
})
export class BatchAnalyticsService {
  constructor() {}

  initBatchConfig(isIOS?: boolean) {
    batch.setConfig({ androidAPIKey: BATCH_ANDROID_API_KEY, iOSAPIKey: BATCH_IOS_API_KEY });
    batch.start();
    if (isIOS) {
      batch.push.setiOSShowForegroundNotifications(true);
      batch.push.registerForRemoteNotifications();
    }
  }

  registerID(hashUserName: string) {
    if (batch) {
      batch.user
        .getEditor()
        .setIdentifier(hashUserName) // Set to `null` if you want to remove the identifier.
        .save();
    }
  }

  setUserAttribute(payload: { keyAttribute: string; valueAttribute: any }) {
    if (batch) {
      batch.user
        .getEditor()
        .setAttribute(payload.keyAttribute, payload.valueAttribute) // Set to `null` if you want to remove the identifier.
        .save();
    }
  }

  registerTag(collectionName: string, tagName: string) {
    if (batch) {
      batch.user
        .getEditor()
        .addTag(collectionName, tagName) // Add a tag to the "actions" collection
        .save();
    }
  }

  registerEvent(eventName: string, label?: string, infos?: { dataName: string; dataValue: string }[]) {
    if (batch) {
      let data = new batch.user.eventData();
      infos.forEach(item => {
        data.put(item.dataName, item.dataValue);
      });
      batch.user.trackEvent(eventName, null, data);
    }
  }
}
