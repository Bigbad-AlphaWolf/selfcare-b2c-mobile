package cordova.plugin.followanalytics;

import android.util.Log;
import org.json.JSONObject;
import android.content.Context;

import com.followanalytics.FollowAnalytics;
import com.followapps.android.internal.push.DefaultMessageHandler;
import java.lang.Exception;
import java.util.Map;

import org.json.JSONException;

public class CustomMessageHandler extends DefaultMessageHandler {

    private String EXTRA_NOTIFICATION_LOCAL_ID = "com.followapps.internal.EXTRA_NOTIFICATION_LOCAL_ID";
    private String FANotificationDefaultActionIdentifier = "com.followanalytics.FANotificationDefaultActionIdentifier";

    @Override
    public void onPushMessageClicked(Context context, String url, Map<String, String> data) {
        if(FollowAnalyticsApplication.onNotificationTapped()){

            String identifier = data.get(EXTRA_NOTIFICATION_LOCAL_ID);
            data.remove(EXTRA_NOTIFICATION_LOCAL_ID);
            data.remove("com.followapps.internal.EXTRA_NOTIFICATION_DL_URL");

            JSONObject nativeSdkParams  = convertMapToJson(data);

            JSONObject pluginParams = new JSONObject();

            try {
                pluginParams.put("parameters", nativeSdkParams);
                pluginParams.put("messageId", identifier);
                pluginParams.put("openingUrl", url);
                pluginParams.put("identifier", FANotificationDefaultActionIdentifier);

                pluginParams.put("event", "onNotificationTapped");

                FollowAnalyticsCordovaPlugin.sendEventIfNeeded(pluginParams.toString());
            } catch (JSONException e) {
                Log.e("error", "FollowAnalyticsOnNotificationTapped: " + e);
            }

            super.onPushMessageClicked(context, url, data);
        }
    }

    @Override
    public void onPushMessageClicked(Context context, Map<String, String> data, String actionIdentifier) {
        if(FollowAnalyticsApplication.onNotificationTapped()){

            String identifier = data.get(EXTRA_NOTIFICATION_LOCAL_ID);
            data.remove(EXTRA_NOTIFICATION_LOCAL_ID);
            data.remove("com.followapps.internal.EXTRA_NOTIFICATION_DL_URL");

            JSONObject nativeSdkParams  = convertMapToJson(data);

            JSONObject pluginParams = new JSONObject();

            try {
                pluginParams.put("parameters", nativeSdkParams);
                pluginParams.put("messageId", identifier);
                pluginParams.put("identifier", actionIdentifier);

                pluginParams.put("event", "onNotificationTapped");

                FollowAnalyticsCordovaPlugin.sendEventIfNeeded(pluginParams.toString());
            } catch (JSONException e) {
                Log.e("error", "FollowAnalyticsOnNotificationTapped: " + e);
            }

            super.onPushMessageClicked(context, data, actionIdentifier);
        }
    }

    @Override
    public void onPushMessageClicked(Context context, String url, Map<String, String> data, String actionIdentifier) {
        if(FollowAnalyticsApplication.onNotificationTapped()){

            String identifier = data.get(EXTRA_NOTIFICATION_LOCAL_ID);
            data.remove(EXTRA_NOTIFICATION_LOCAL_ID);
            data.remove("com.followapps.internal.EXTRA_NOTIFICATION_DL_URL");

            JSONObject nativeSdkParams  = convertMapToJson(data);

            JSONObject pluginParams = new JSONObject();

            try {
                pluginParams.put("parameters", nativeSdkParams);
                pluginParams.put("messageId", identifier);
                pluginParams.put("openingUrl", url);
                pluginParams.put("identifier", actionIdentifier);

                pluginParams.put("event", "onNotificationTapped");

                FollowAnalyticsCordovaPlugin.sendEventIfNeeded(pluginParams.toString());
            } catch (JSONException e) {
                Log.e("error", "FollowAnalyticsOnNotificationTapped: " + e);
            }

            super.onPushMessageClicked(context, url, data, actionIdentifier);
        }
    }

    @Override
    public void onPushMessageClicked(Context context, Map<String, String> data) {
        if(FollowAnalyticsApplication.onNotificationTapped()){

            String identifier = data.get(EXTRA_NOTIFICATION_LOCAL_ID);
            data.remove(EXTRA_NOTIFICATION_LOCAL_ID);
            data.remove("com.followapps.internal.EXTRA_NOTIFICATION_DL_URL");

            JSONObject nativeSdkParams  = convertMapToJson(data);

            JSONObject pluginParams = new JSONObject();

            try {
                pluginParams.put("parameters", nativeSdkParams);
                pluginParams.put("messageId", identifier);
                pluginParams.put("identifier", FANotificationDefaultActionIdentifier);

                pluginParams.put("event", "onNotificationTapped");

                FollowAnalyticsCordovaPlugin.sendEventIfNeeded(pluginParams.toString());
            } catch (JSONException e) {
                Log.e("error", "FollowAnalyticsOnNotificationTapped: " + e);
            }

            super.onPushMessageClicked(context, data);
        }
    }

    @Override
    public void onInAppMessageClicked(Context context, String buttonText, Map<String, String> data) {
        if(FollowAnalyticsApplication.onNativeInAppButtonTapped()) {
            JSONObject pluginParams = new JSONObject();

            try {
                pluginParams.put("parameters", convertMapToJson(data));
            } catch (JSONException e) {
                Log.e("FollowAnalytics", "onInAppMessageClicked: " + e.getMessage());
            }

            FollowAnalyticsCordovaPlugin.gWebView.loadUrl("javascript:FollowAnalytics.emit('onNativeInAppButtonTapped', " + pluginParams.toString() + ")");

            super.onInAppMessageClicked(context,buttonText,data);
        }
    }

    private static JSONObject convertMapToJson(Map<String,String> map) {
        JSONObject obj = new JSONObject();
        try {
            for (Map.Entry<String, String> entry : map.entrySet()) {
                obj.put(entry.getKey(),entry.getValue());
            }
        }catch (Exception e){

        }
        return obj;
    }
}


