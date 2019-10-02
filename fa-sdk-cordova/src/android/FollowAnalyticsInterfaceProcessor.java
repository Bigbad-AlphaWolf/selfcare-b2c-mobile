package cordova.plugin.followanalytics;

import android.content.*;
import android.util.*;
import com.followanalytics.FollowAnalytics;
import org.apache.cordova.*;
import org.json.*;

import java.lang.Boolean;
import java.lang.Double;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import com.followapps.android.webview.*;

public class FollowAnalyticsInterfaceProcessor {

    private static final String KEY_LOG_EVENT =                     "logEvent";
    private static final String KEY_LOG_ERROR =                     "logError";
    private static final String REGISTER_FOR_PUSH =                 "registerForPush";
    private static final String ACTION_GET_DEVICE_ID =              "getDeviceId";
    private static final String ACTION_GET_USER_ID =                "getUserId";
    private static final String ACTION_SET_USER_ID =                "setUserId";
    private static final String ACTION_UNSET_USER_ID =              "unsetUserId";

    private static final String ACTION_SET_PUSH_ENABLED=            "setPushNotificationsEnabled";

    private static final String ACTION_PAUSE_CAMPAIGNS =            "pauseCampaignDisplay";
    private static final String ACTION_RESUME_CAMPAIGNS =           "resumeCampaignDisplay";

    private static final String ACTION_IN_APP_GET_ALL =            "InAppgetAll";
    private static final String ACTION_IN_APP_GET =                "InAppget";
    private static final String ACTION_IN_APP_MARK_READ =          "InAppmarkAsRead";
    private static final String ACTION_IN_APP_MARK_UNREAD =        "InAppmarkAsUnread";
    private static final String ACTION_IN_APP_DELETE =             "InAppdelete";

    private static final String ACTION_PUSH_GET_ALL =              "PushgetAll";
    private static final String ACTION_PUSH_GET =                  "Pushget";
    private static final String ACTION_PUSH_MARK_READ =            "PushmarkAsRead";
    private static final String ACTION_PUSH_MARK_UNREAD =          "PushmarkAsUnread";
    private static final String ACTION_PUSH_DELETE =               "Pushdelete";

    private static final String ATTR_LAST_NAME =                    "setLastName";
    private static final String ATTR_FIRST_NAME =                   "setFirstName";
    private static final String ATTR_EMAIL =                        "setEmail";
    private static final String ATTR_CITY =                         "setCity";
    private static final String ATTR_BIRTH_DATE =                   "setDateOfBirth";
    private static final String ATTR_PROFILE_PICTURE =              "setProfilePictureUrl";
    private static final String ATTR_GENDER =                       "setGender";
    private static final String ATTR_COUNTRY =                      "setCountry";
    private static final String ATTR_REGION =                       "setRegion";

    private static final String ATTR_ACTION_CLEAR =                 "clear";
    private static final String ATTR_ACTION_SET_ADD =               "addToSet";
    private static final String ATTR_ACTION_SET_REMOVE =            "removeFromSet";
    private static final String ATTR_ACTION_SET_CLEAR =             "clearSet";


    private static final String ATTR_ACTION_BOOLEAN =               "setBoolean";
    private static final String ATTR_ACTION_STRING =                "setString";
    private static final String ATTR_ACTION_NUMBER =                "setNumber";
    private static final String ATTR_SET_DATE =                     "setDate";
    private static final String ATTR_SET_DATE_TIME =                "setDateTime";

    private static final String ACTION_GET_OPTIN_ANALYTICS =        "getOptInAnalytics";
    private static final String ACTION_SET_OPTIN_ANALYTICS =        "setOptInAnalytics";
    private static final String ACTION_REQUESTACCESSTODATA =        "requestToAccessMyData";
    private static final String ACTION_REQUESTDATADELETION =        "requestToDeleteMyData";

    private static final String ACTION_DATAWALLET_IS_READ       =   "DataWalletIsRead";
    private static final String ACTION_DATAWALLET_SET_IS_READ   =   "DataWalletSetIsRead";
    private static final String ACTION_DATAWALLET_GET_POLICY    =   "DataWalletGetPolicy";

    public static final String DATE_FORMAT = "yyyy-MM-dd";
    public static final String DATE_TIME_FORMAT = "yyyy-MM-dd'T'kk:mm:ssZ";


    public boolean process(CordovaPlugin plugin, String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if (KEY_LOG_EVENT.equals(action)) {
            String eventDetail = null;
            if(args.length() > 1){
                eventDetail = args.getString(1);
            }
            FollowAnalytics.logEvent(args.getString(0),eventDetail);
            return true;
        }

        if (KEY_LOG_ERROR.equals(action)) {
            String errorDetail = null;
            final String errorName = args.getString(0);
            if(args.length() > 1){
                errorDetail = args.getString(1);
            }
            FollowAnalytics.logError(errorName, errorDetail);
            return true;
        }

        if (REGISTER_FOR_PUSH.equals(action)) {
            return true;
        }

        if (ACTION_GET_DEVICE_ID.equals(action)) {
            return sendEvent(callbackContext, FollowAnalytics.getDeviceId());
        }

        if (ACTION_GET_USER_ID.equals(action)) {
            return sendEvent(callbackContext, FollowAnalytics.getUserId());
        }

        if (ACTION_IN_APP_GET_ALL.equals(action)) {
            return sendEvent(callbackContext, new InAppWebViewLogger().getAll());
        }

        if (ACTION_IN_APP_GET.equals(action)) {
            return sendEvent(callbackContext,new InAppWebViewLogger().get(args.getString(0)));
        }

        if (ACTION_IN_APP_MARK_READ.equals(action)) {
            JSONArray array = args.getJSONArray(0);
            String [] ids = new String [array.length()];
            for(int i = 0 ; i< array.length();i++){
                ids [i] = array.getString(i);
            }
            FollowAnalytics.InApp.markAsRead(ids);
            return true;
        }

        if (ACTION_IN_APP_MARK_UNREAD.equals(action)) {
            JSONArray array = args.getJSONArray(0);
            String [] ids = new String [array.length()];
            for(int i = 0 ; i< array.length();i++){
                ids [i] = array.getString(i);
            }
            FollowAnalytics.InApp.markAsUnread(ids);
            return true;
        }

        if (ACTION_IN_APP_DELETE.equals(action)) {
            JSONArray array = args.getJSONArray(0);
            String [] ids = new String [array.length()];
            for(int i = 0 ; i< array.length();i++){
                ids [i] = array.getString(i);
            }
            FollowAnalytics.InApp.delete(ids);
            return true;
        }

       if (ACTION_PUSH_GET_ALL.equals(action)) {
            return sendEvent(callbackContext, new PushWebViewLogger().getAll());
        }

        if (ACTION_PUSH_GET.equals(action)) {
            final String id = args.getString(0);
            return sendEvent(callbackContext,new PushWebViewLogger().get(id));
        }

        if (ACTION_PUSH_MARK_READ.equals(action)) {
            JSONArray array = args.getJSONArray(0);
            String [] ids = new String [array.length()];
            for(int i = 0 ; i< array.length();i++){
                ids [i] = array.getString(i);
            }
            FollowAnalytics.Push.markAsRead(ids);
            return true;
        }

        if (ACTION_PUSH_MARK_UNREAD.equals(action)) {
            JSONArray array = args.getJSONArray(0);
            String [] ids = new String [array.length()];
            for(int i = 0 ; i< array.length();i++){
                ids [i] = array.getString(i);
            }
            FollowAnalytics.Push.markAsUnread(ids);
            return true;
        }

        if (ACTION_PUSH_DELETE.equals(action)) {
            JSONArray array = args.getJSONArray(0);
            String [] ids = new String [array.length()];
            for(int i = 0 ; i< array.length();i++){
                ids [i] = array.getString(i);
            }
            FollowAnalytics.Push.delete(ids);
            return true;
        }

        if (ACTION_SET_USER_ID.equals(action)) {
            FollowAnalytics.setUserId(args.getString(0));
            return true;
        }

        if (ACTION_UNSET_USER_ID.equals(action)) {
            FollowAnalytics.setUserId(null);
            return true;
        }

        if (ACTION_SET_PUSH_ENABLED.equals(action)) {
            Object o =args.get(0);
            if(!(o instanceof Boolean)){
                o = Boolean.TRUE;
            }
            FollowAnalytics.setPushNotificationsEnabled(args.getBoolean(0));
            return true;
        }
        if (ACTION_PAUSE_CAMPAIGNS.equals(action)) {
            FollowAnalytics.InApp.pauseCampaignDisplay();
            return true;
        }
        if (ACTION_RESUME_CAMPAIGNS.equals(action)) {
            FollowAnalytics.InApp.resumeCampaignDisplay();
            return true;
        }



        if (ATTR_FIRST_NAME.equals(action)) {
            FollowAnalytics.UserAttributes.setFirstName(args.getString(0));
            return true;
        }

        if (ATTR_LAST_NAME.equals(action)) {
            FollowAnalytics.UserAttributes.setLastName(args.getString(0));
            return true;
        }

        if (ATTR_EMAIL.equals(action)) {
            FollowAnalytics.UserAttributes.setEmail(args.getString(0));
            return true;
        }

        if (ATTR_CITY.equals(action)) {
            FollowAnalytics.UserAttributes.setCity(args.getString(0));
            return true;
        }

        if (ATTR_BIRTH_DATE.equals(action)) {
            Object value = args.get(0);
            if(value == null){
                FollowAnalytics.UserAttributes.setDateOfBirth(null);
                return true;
            }
            Date date = parseDate(value, DATE_FORMAT);
            if(date != null){
                FollowAnalytics.UserAttributes.setDateOfBirth(date);
                return true ;
            }
            android.util.Log.w("FollowApps", "Cannot parse  the value " + args.get(1) + " to date");
            return true;
        }


        if (ATTR_PROFILE_PICTURE.equals(action)) {
            FollowAnalytics.UserAttributes.setProfilePictureUrl(args.getString(0));
            return true;
        }

        if (ATTR_GENDER.equals(action)) {
            FollowAnalytics.UserAttributes.setGender(args.getInt(0));
            return true;
        }
        if (ATTR_COUNTRY.equals(action)) {
            FollowAnalytics.UserAttributes.setCountry(args.getString(0));
            return true;
        }
        if (ATTR_REGION.equals(action)) {
            FollowAnalytics.UserAttributes.setRegion(args.getString(0));
            return true;
        }


        if (ATTR_ACTION_BOOLEAN.equals(action)) {
            FollowAnalytics.UserAttributes.setBoolean(args.getString(0), args.getBoolean(1));
            return true;
        }
        if (ATTR_ACTION_NUMBER.equals(action)) {
            final String key = args.getString(0);
            Object object = args.get(1);
            if(object == null ){
                Integer integer = null;
                FollowAnalytics.UserAttributes.setNumber(key, integer);
            }
            if(object instanceof  Integer){
                FollowAnalytics.UserAttributes.setNumber(key, (Integer) object);
            }
            if(object instanceof  Long){
                FollowAnalytics.UserAttributes.setNumber(key, (Long) object);
            }

            if(object instanceof  Double){
                FollowAnalytics.UserAttributes.setNumber(key, (Double) object);
            }

            return true;
        }

        if (ATTR_ACTION_STRING.equals(action)) {
            FollowAnalytics.UserAttributes.setString(args.getString(0), args.getString(1));
            return true;
        }

        if (ATTR_SET_DATE.equals(action)) {
            Object value = args.get(1);
            if(value == null){
                FollowAnalytics.UserAttributes.setDate(args.getString(0), null);
                return true;
            }
            Date date = parseDate(value, DATE_FORMAT);
            if(date != null){
                FollowAnalytics.UserAttributes.setDate(args.getString(0), date);
                return true ;
            }
            android.util.Log.w("FollowApps", "Cannot parse  the value " + args.get(1) + " to date");
            return true;
        }

        if (ATTR_SET_DATE_TIME.equals(action)) {
            Object value = args.get(1);
            if(value == null){
                FollowAnalytics.UserAttributes.setDateTime(args.getString(0), null);
                return true;
            }
            Date date = parseDate(value, DATE_TIME_FORMAT);
            if(date != null){
                FollowAnalytics.UserAttributes.setDateTime(args.getString(0),date);
                return true ;
            }
            android.util.Log.w("FollowApps","Cannot parse  the value "+args.get(1)+ " to date");
            return true;
        }

        if (ATTR_ACTION_CLEAR.equals(action)) {
            FollowAnalytics.UserAttributes.clear(args.getString(0));
            return true;
        }
        if (ATTR_ACTION_SET_CLEAR.equals(action)) {
            FollowAnalytics.UserAttributes.clearSet(args.getString(0));
            return true;
        }

        if (ATTR_ACTION_SET_ADD.equals(action)) {
            final String key = args.getString(0);
            for (int i = 1 ;i< args.length();i++){
                FollowAnalytics.UserAttributes.addToSet(key, args.getString(i));
            }
            return true;
        }
        if (ATTR_ACTION_SET_REMOVE.equals(action)) {
            FollowAnalytics.UserAttributes.removeFromSet(args.getString(0), args.getString(1));
            return true;
        }

        if (ACTION_GET_OPTIN_ANALYTICS.equals(action)) {
            return sendEvent(callbackContext, String.valueOf(FollowAnalytics.getOptInAnalytics()));
        }

        if (ACTION_SET_OPTIN_ANALYTICS.equals(action)) {
            Object o = args.get(0);
            if(!(o instanceof Boolean)){
                o = Boolean.TRUE;
            }
            FollowAnalytics.setOptInAnalytics((Boolean)o);
            return true;
        }

        if (ACTION_REQUESTACCESSTODATA.equals(action)) {
            FollowAnalytics.GDPR.requestToAccessMyData();
            return true;
        }

        if (ACTION_REQUESTDATADELETION.equals(action)) {
            FollowAnalytics.GDPR.requestToDeleteMyData();
            return true;
        }

        if (ACTION_DATAWALLET_SET_IS_READ.equals(action)) {
            Object o = args.get(0);
            if(!(o instanceof Boolean)){
                o = Boolean.TRUE;
            }
            FollowAnalytics.DataWallet.setIsRead((Boolean)o);
            return true;
        }

        if (ACTION_DATAWALLET_IS_READ.equals(action)) {
            return sendEvent(callbackContext, String.valueOf(FollowAnalytics.DataWallet.isRead()));
        }

        if (ACTION_DATAWALLET_GET_POLICY.equals(action)) {
            String policy = "Currently not available. Expected for version 7.0";
            return sendEvent(callbackContext, policy);
        }

        return false;
    }
    private Date parseDate(Object value, String format){
        if(value instanceof Date){
            return (Date)value;
        }
        try{
            return new SimpleDateFormat(format, Locale.US).parse(value.toString());
        }catch (Exception e){
            return null;
        }
    }
    public  boolean sendEvent(CallbackContext callbackContext,String data) {
        PluginResult result = new PluginResult(PluginResult.Status.OK, data);
        result.setKeepCallback(true);
        callbackContext.sendPluginResult(result);
        return true;
    }

}
