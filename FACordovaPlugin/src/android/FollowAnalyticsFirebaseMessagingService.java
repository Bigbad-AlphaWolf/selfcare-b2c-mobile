package cordova.plugin.followanalytics;

import com.followanalytics.FollowAnalytics;
import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;

public class FollowAnalyticsFirebaseMessagingService extends FirebaseMessagingService {
    @Override
    public void onMessageReceived(RemoteMessage remoteMessage) {
        FollowAnalytics.processFirebaseMessage(this, remoteMessage);
    }

    @Override
    public void onNewToken(String s){
        FollowAnalytics.setPushToken(s);
    }
}
