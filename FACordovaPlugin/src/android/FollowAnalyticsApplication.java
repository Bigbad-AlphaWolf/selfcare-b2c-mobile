package cordova.plugin.followanalytics;

import android.app.Application;
import android.util.Log;

import com.followanalytics.FollowAnalytics;

import org.json.JSONException;
import org.json.JSONObject;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Locale;
import java.util.Map;
import java.util.TimeZone;


public class FollowAnalyticsApplication extends Application { 

private Boolean onConsoleLog = false;
private Boolean onMessageReceived = false;
private static Boolean onNativeInAppButtonTapped = false;
private static Boolean onNotificationTapped = false;

    @Override
    public void onCreate() {
        super.onCreate();
        FollowAnalytics.init(this.getApplicationContext(), new FollowAnalytics.Configuration() {
{

}

            public void onConsoleLog(String message, FollowAnalytics.Severity severity, String[] tags) {
                if(onConsoleLog) {
                    try {
                        JSONObject data = new JSONObject();
                        data.put("message", message);
                        data.put("severity", severity);
                        data.put("tags", tags);
                        FollowAnalyticsCordovaPlugin.gWebView.loadUrl("javascript:FollowAnalytics.emit('onConsoleLog', " + data + ")");
                    } catch (Exception e) {
                        Log.e("FollowAnalytics","onConsoleLog: " + e.getMessage());
                    }
                }
            }

            public void onNotificationReceived(FollowAnalytics.Message message) {
                if(onMessageReceived) {
                    DateFormat dateFormat = new SimpleDateFormat("yyyy'-'MM'-'dd'T'HH':'mm':'ss'.'SSSZZZZ", Locale.US);
                    dateFormat.setTimeZone(TimeZone.getTimeZone("UTC"));

                    JSONObject data = FollowAnalyticsInterfaceProcessor.messageToJSON(message);

                    try {
                        data.put("event", "onMessageReceived");
                    } catch (JSONException e){
                        Log.e("FollowAnalytics", "onNotificationReceived: " + e.getMessage());
                    }

                    FollowAnalyticsCordovaPlugin.sendEventIfNeeded(data.toString());

                }
            }

            private  JSONObject convertMapToJson(Map<String,String> map) {
                JSONObject obj = new JSONObject();
                try {
                    for (Map.Entry<String, String> entry : map.entrySet()) {
                        obj.put(entry.getKey(),entry.getValue());
                    }
                }catch (Exception e){

                }
                return obj;
            }

        });
    }

    public static Boolean onNativeInAppButtonTapped() {
        return onNativeInAppButtonTapped;
    }

    public static Boolean onNotificationTapped() {
        return onNotificationTapped;
    }
}
