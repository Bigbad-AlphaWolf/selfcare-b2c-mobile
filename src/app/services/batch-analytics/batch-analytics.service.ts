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
    try {
      batch.setConfig({ androidAPIKey: BATCH_ANDROID_API_KEY, iOSAPIKey: BATCH_IOS_API_KEY });
      batch.start();
      if (isIOS) {
        batch.push.setiOSShowForegroundNotifications(true);
        batch.push.registerForRemoteNotifications();
      }
    } catch (error) {
      console.log('err', error);
    }
  }

  registerID(hashUserName: string) {
    try {
      batch.user
        .getEditor()
        .setIdentifier(hashUserName) // Set to `null` if you want to remove the identifier.
        .save();
    } catch (error) {
      console.log('err', error);
    }
  }

  setUserAttribute(payload: { keyAttribute: string; valueAttribute: any }) {
    try {
      batch.user
        .getEditor()
        .setAttribute(payload.keyAttribute, payload.valueAttribute) // Set to `null` if you want to remove the identifier.
        .save();
    } catch (error) {
      console.log('err', error);
    }
  }
  removeUseraAttribute(keyAttribute: string) {
    if (batch) {
      batch.user
        .getEditor()
        .removeAttribute(keyAttribute) // Set to `null` if you want to remove the identifier.
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
    try {
      if (infos && infos?.length) {
        let data = new batch.user.eventData();
        infos.forEach(item => {
          data.put(item.dataName, item.dataValue);
        });
        batch.user.trackEvent(eventName, null, data);
      }
    } catch (error) {
      console.log('err', error);
    }
  }

  addValueToCollectionTag(collectionName: string, addedValue: string) {
    try {
      batch.user
        .getEditor()
        .addTag(collectionName, addedValue) // Add a tag to the "collectionName" collection
        .save();
    } catch (error) {}
  }

  removeValueToCollectionTag(collectionName: string, value: string) {
    try {
      batch.user
        .getEditor()
        .removeTag(collectionName, value) // Remove it a tag to the "collectionName" collection
        .save();
    } catch (error) {}
  }

  optOut() {
    try {
      batch.optOutAndWipeData();
    } catch (error) {}
  }
}
