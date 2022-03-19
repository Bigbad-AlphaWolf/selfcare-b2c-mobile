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
        dimelo.initWithApiSecret("b25dc90dcaed229e01ff8ffe", "sonatel", null);
        Dimelo.getInstance().openRcActivity(this.cordova.getActivity());
        System.out.println(dimelo);
    }

}