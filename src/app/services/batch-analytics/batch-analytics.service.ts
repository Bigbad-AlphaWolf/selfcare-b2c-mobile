import {Injectable} from '@angular/core';
import {environment} from 'src/environments/environment';

const {BATCH_ANDROID_API_KEY, BATCH_IOS_API_KEY} = environment;
declare var batch;

@Injectable({
  providedIn: 'root'
})
export class BatchAnalyticsService {
  constructor() {}

  initBatchConfig(isIOS?: boolean) {
    batch.setConfig({androidAPIKey: BATCH_ANDROID_API_KEY, iOSAPIKey: BATCH_IOS_API_KEY});
    batch.start();
    if (isIOS) batch.push.registerForRemoteNotifications();
  }

  registerID(hashUserName: string) {
    batch.user
      .getEditor()
      .setIdentifier(hashUserName) // Set to `null` if you want to remove the identifier.
      .save();
  }

  registerTag(collectionName: string, tagName: string) {
    batch.user
      .getEditor()
      .addTag(collectionName, tagName) // Add a tag to the "actions" collection
      .save();
  }

  registerEvent(eventName: string, label?: string, data?: any) {
    batch.user.trackEvent(eventName);
  }
}
