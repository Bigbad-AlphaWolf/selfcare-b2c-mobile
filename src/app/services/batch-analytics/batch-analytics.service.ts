import {Injectable} from '@angular/core';
import {environment} from 'src/environments/environment';

const {BATCH_ANDROID_API_KEY} = environment;
declare var batch;

@Injectable({
  providedIn: 'root'
})
export class BatchAnalyticsService {
  constructor() {}

  initBatchConfig() {
    batch.setConfig({androidAPIKey: BATCH_ANDROID_API_KEY});
    batch.start();
  }

  registerID(hashUserName: string) {
    console.log('register', hashUserName);

    batch.user
      .getEditor()
      .setIdentifier(hashUserName) // Set to `null` if you want to remove the identifier.
      .save();
  }
}
