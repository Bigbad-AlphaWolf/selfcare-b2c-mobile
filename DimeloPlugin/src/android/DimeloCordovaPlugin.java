package cordova.plugin.dimelo;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.json.JSONArray;
import org.json.JSONException;

import android.app.AlertDialog;
import android.content.DialogInterface;

import com.dimelo.dimelosdk.main.Chat;
import com.dimelo.dimelosdk.main.Dimelo;
import android.content.Context;

import org.json.JSONException;
import org.json.JSONObject;

public class DimeloCordovaPlugin extends CordovaPlugin {

    Dimelo dimelo;

    @Override
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);
        this.initDimelo();
    }

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if ("openChat".equals(action)) {
            String username = args.getString(0);
            String customerId = args.getString(1);
            openChat(username, customerId);
            return true;
        }
        return false;
    }

    public void initDimelo() {
        System.out.println("dimelo plugin initialized");
        Context context = this.cordova.getActivity().getApplicationContext();
        this.dimelo = Dimelo.setup(context);
				this.dimelo.setThreadsEnabled(true);
        this.dimelo.initWithApiSecret("65537b4ddf7eea735bad06e7d4a7e4dffa4935ce97736cdf40cb1e8318b68987", "sonatel", null);
    }

    public void openChat(String username, String customerId) {
        System.out.println("dimelo chat opened");
        // final String username = params.getString(0);
        // final String customerId = params.getString(1);
        this.dimelo.setUserName(username);
        JSONObject authInfo = new JSONObject();
        try {
            authInfo.put("CustomerId", customerId);
            // authInfo.put("Dimelo", "Rocks!");
        } catch (JSONException e) {}
        this.dimelo.setAuthenticationInfo(authInfo);
        Dimelo.getInstance().openRcActivity(this.cordova.getActivity());
    }

}