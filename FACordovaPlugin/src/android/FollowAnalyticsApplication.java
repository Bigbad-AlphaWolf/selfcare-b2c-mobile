package cordova.plugin.followanalytics;

import android.app.Application;
import com.followanalytics.FollowAnalytics;

public class FollowAnalyticsApplication extends Application {

    @Override
    public void onCreate() {
        super.onCreate();
        FollowAnalytics.init(this.getApplicationContext(), new FollowAnalytics.Configuration() {
            {
                apiKey = null;
                isVerbose = false;
                maxBackgroundTimeWithinSession = 120;
            }
        });
    }
}
