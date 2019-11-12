import { Injectable } from '@angular/core';
declare var FollowAnalytics: any;

@Injectable({
  providedIn: 'root'
})
export class FollowAnalyticsService {
  logState = false;
  logErrorState = false;
  constructor() {}

  registerEventFollow(event: string, type: string, params?: any) {
    if (typeof FollowAnalytics !== 'undefined') {
      if (type === 'error') {
        FollowAnalytics.logError(event, params);
        this.logErrorState = true;
      } else {
        this.logState = true;
        FollowAnalytics.logEvent(event, params);
      }
    }
  }

  registerId(hashUserName: string) {
    FollowAnalytics.setUserId(hashUserName);
  }
}
