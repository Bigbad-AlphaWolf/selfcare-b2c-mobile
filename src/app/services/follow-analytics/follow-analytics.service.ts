import { Injectable } from '@angular/core';
declare var FollowAnalytics: any;

@Injectable({
  providedIn: 'root'
})
export class FollowAnalyticsService {
  logState = false;
  logErrorState = false;
  constructor() {}

  registerEventFollow(event: string, type: 'error' | 'event', params?: any) {
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
    if (typeof FollowAnalytics !== 'undefined') {
      FollowAnalytics.setUserId(hashUserName);
    }
  }

  setFirstName(firstName: string) {
    if (typeof FollowAnalytics !== 'undefined') {
    }
  }

  setLastName(lastName: string) {
    if (typeof FollowAnalytics !== 'undefined') {
    }
  }

  setString(key: string, value: string) {
    if (typeof FollowAnalytics !== 'undefined') {
      FollowAnalytics.UserAttributes.setString(key, value);
    }
  }
}
