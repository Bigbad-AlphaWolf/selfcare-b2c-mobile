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

    @Override
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);
        System.out.println("hahahaha plugin initializeed");
        this.initDimelo();
    }

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if ("testPlugin".equals(action)) {
            System.out.println("haha u can smile Papa");
            return true;
        }
        return false;
    }

    public void initDimelo() {
        Context context = this.cordova.getActivity().getApplicationContext();
        Dimelo dimelo = Dimelo.setup(context);
        dimelo.initWithApiSecret("bb1e6f640bebc7e05863ff1117d44bc0def05726c9d6a3d503dddfcd50cf16d1", "sonatel", null);
        dimelo.setUserName("John Doe");



        JSONObject authInfo = new JSONObject();
        try {
            authInfo.put("CustomerId", "0123456789");
            authInfo.put("Dimelo", "Rocks!");
        } catch (JSONException e) {}

        dimelo.setAuthenticationInfo(authInfo);

        Dimelo.getInstance().openRcActivity(this.cordova.getActivity());

        System.out.println(dimelo);
    }

}