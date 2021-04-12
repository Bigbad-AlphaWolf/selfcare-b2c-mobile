package cordova.plugin.followanalytics;

import android.content.Intent;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;

import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaWebView;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CallbackContext;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.apache.cordova.PluginResult;
import com.followanalytics.internal.FollowAnalyticsInternal;
import com.followapps.android.internal.Hub;
import com.followanalytics.internal.FaInternalComponent;

/**
 * This class echoes a string called from JavaScript.
 */
public class FollowAnalyticsCordovaPlugin extends CordovaPlugin {

    private static CordovaWebView webView = null;

    protected static Boolean isInBackground = true;

    private static CallbackContext pushContext;
    public static CordovaWebView gWebView;
    private static String savedCallback = null;

    private static final String ACTION_HANDLE_CALLBACKS = "handleCallbacks";
    private static final String ACTION_OPEN_WEBVIEW = "openWebView";
    private static final String ACTION_IS_SDK_INITIALIZED = "isSdkInitialized";


    @Override
    public boolean execute(String action, JSONArray args, final CallbackContext cb) throws JSONException {
        pushContext = cb;
        gWebView = this.webView;

        if (ACTION_IS_SDK_INITIALIZED.equals(action)) {
            boolean followAnalyticsSDKinitialized = FollowAnalyticsInternal.componentInit(
                    new FaInternalComponent() {
                        @Override
                        public void init(Hub hub) {
                            //Doesn't do anything
                        }
                    }
            );
            if (followAnalyticsSDKinitialized) {
                PluginResult dataResult = new PluginResult(PluginResult.Status.OK, "");
                dataResult.setKeepCallback(true);
                cb.sendPluginResult(dataResult);
            } else {
                PluginResult dataResult = new PluginResult(PluginResult.Status.ERROR, "[FA] FollowAnalytics Android  SDK is not initialized.");
                dataResult.setKeepCallback(true);
                cb.sendPluginResult(dataResult);
            }
            return true;
        }

        if (ACTION_HANDLE_CALLBACKS.equals(action)) {
            if (savedCallback != null) {
                sendEventIfNeeded(savedCallback);
                savedCallback = null;
            }
            return true;
        }

        if (ACTION_OPEN_WEBVIEW.equals(action)) {

            if (args.length() == 0) {
                return true;
            }

            if (this.cordova == null || this.cordova.getActivity() == null) {
                return true;
            }

            Intent intent = new Intent(this.cordova.getActivity().getBaseContext(), FAWebViewActivity.class);
            intent.putExtra("url", args.getString(0));
            intent.putExtra("title", args.getString(1));

            if (args.getString(2) == "null" || args.getString(2) == null) {
                intent.putExtra("button", "close");
            } else {
                intent.putExtra("button", args.getString(2));
            }

            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            this.cordova.getActivity().getBaseContext().startActivity(intent);

            return true;
        }

        return new FollowAnalyticsInterfaceProcessor().process(this, action, args, pushContext);

    }

    public static boolean isInBackground() {
        return isInBackground;
    }

    public static boolean isActive() {
        return gWebView != null;
    }

    public static void sendEvent(JSONObject data) {
        try {
                String event = data.getString("event");
                data.remove("event");
                Handler handler = new Handler(Looper.getMainLooper());
                try {
                    handler.post(() -> webView.loadUrl("javascript:FollowAnalytics.emit('" + event +"'," + data.toString() + ")"));
                } catch (Exception e) {
                    Log.e("FollowAnalytics", "Error while sending JavaScript Event: " + e.getMessage());
                }

        } catch (JSONException exception) {
            Log.e("FollowAnalytics", "Error while sending Event: " + exception.getMessage());
        }

        PluginResult pluginResult = new PluginResult(PluginResult.Status.OK, data);
        pluginResult.setKeepCallback(true);
        pushContext.sendPluginResult(pluginResult);
    }

    public static void sendEventIfNeeded(String extras) {
        if (extras != null) {
            if (gWebView != null) {
                try {
                    sendEvent(new JSONObject(extras));
                } catch (Exception e) {
                    savedCallback = extras;
                }
            } else {
                savedCallback = extras;
            }
        }
    }

    @Override
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        FollowAnalyticsCordovaPlugin.webView = super.webView;
        isInBackground = false;
    }

    @Override
    public void onStart() {
        super.onStart();
        isInBackground = false;
    }


    @Override
    public void onPause(boolean multitasking) {
        super.onPause(multitasking);
        isInBackground = true;
    }

    @Override
    public void onResume(boolean multitasking) {
        super.onResume(multitasking);
        isInBackground = false;
    }

    @Override
    public void onDestroy() {
        isInBackground = true;
        gWebView = null;
    }
}
