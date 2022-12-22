import { Injectable } from '@angular/core';
import { EyesOn } from 'cordova-plugin-eyeson/ngx';

@Injectable({
  providedIn: 'root',
})
export class EyesonSdkService {
  constructor(private eyeson: EyesOn) {}

  initAgent() {
    return this.eyeson.initAgent();
  }

  startAgent() {
    return this.eyeson.startAgent();
  }

  getEyesOnDqaIdInfos() {
    return this.eyeson.getDqaId();
  }

  onUpdatePermissions() {
    return this.eyeson.onPermissionChanged();
  }

  getConfiguration() {
    return this.eyeson.getDataCollectStatus();
  }
}
