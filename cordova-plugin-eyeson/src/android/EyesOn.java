/*
       Licensed to the Apache Software Foundation (ASF) under one
       or more contributor license agreements.  See the NOTICE file
       distributed with this work for additional information
       regarding copyright ownership.  The ASF licenses this file
       to you under the Apache License, Version 2.0 (the
       "License"); you may not use this file except in compliance
       with the License.  You may obtain a copy of the License at

         http://www.apache.org/licenses/LICENSE-2.0

       Unless required by applicable law or agreed to in writing,
       software distributed under the License is distributed on an
       "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
       KIND, either express or implied.  See the License for the
       specific language governing permissions and limitations
       under the License.
*/
package com.softathome.eyeson.cordova;

import java.util.TimeZone;

import org.apache.cordova.CordovaWebView;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaInterface;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.v3d.equalcore.external.EQCoreStatus;
import com.v3d.equalcore.external.bootstrap.EQConnectionCallbacks;
import com.v3d.equalcore.external.bootstrap.EQualOneApiClient;
import com.v3d.equalcore.external.exception.EQError;
import com.v3d.equalcore.external.manager.EQAgentInformationManager;
import com.v3d.equalcore.external.manager.EQManagerInterface;
import com.v3d.equalcore.external.manager.EQPermissionsManager;
import com.v3d.equalcore.external.manager.agentinformation.EQConfigurationListener;

import android.content.Context;
import android.util.Log;

import android.provider.Settings;

public class EyesOn extends CordovaPlugin implements EQConnectionCallbacks {
    public static final String TAG = "EyesOn";

    private String ERROR = "EQ-ERROR";
    private String INFO = "EQ-INFO";
    private String WARNING = "EQ-WARNING";

    private Context context;
    //EQUAL ONE MANAGERS
    private EQAgentInformationManager mAgentInformationManager;
    private EQPermissionsManager mPermissionsManager;

    private EQualOneApiClient mCoreClient;
    private boolean mIsConnected;

    /**
     * Constructor.
     */
    public EyesOn() {

    }

    /**
     * Sets the context of the Command. This can then be used to do things like
     * get file paths associated with the Activity.
     *
     * @param cordova The context of the main Activity.
     * @param webView The CordovaWebView Cordova is running in.
     */
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);
        context = this.cordova.getActivity().getApplicationContext();
    }

    /**
     * Executes the request and returns PluginResult.
     *
     * @param action            The action to execute.
     * @param args              JSONArry of arguments for the plugin.
     * @param callbackContext   The callback id used when calling back into JavaScript.
     * @return                  True if the action was valid, false if not.
     */
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {

        if ("initAgent".equals(action)) {
            Log.i(INFO, "initAgent");
            mCoreClient = new EQualOneApiClient.Builder(context).addCallback(this).build();
            mCoreClient.connect();
            callbackContext.success();

        } else if ("startAgent".equals(action)) {
            if(mIsConnected) {
                Log.i(INFO, "startAgent");
                mCoreClient.enable(true);
                callbackContext.success();
            }
            else {
                callbackContext.error("Core client not connected yet.");
            }

		} else if ("updateConfiguration".equals(action)) {
            if(mIsConnected) {

                Log.i(INFO, "Updating configuration");
                mAgentInformationManager.updateConfiguration(new EQConfigurationListener() {
                    @Override
                    public void onUpdated(long timestamp) {
                        Log.i(INFO, "onUpdated::" + timestamp);
                        callbackContext.success((int) timestamp);
                    }

                    @Override
                    public void onUptodate() {
                        Log.i(INFO, "onUptodate");
                        callbackContext.success();
                    }

                    @Override
                    public void onError(EQError eqError) {
                        Log.e(ERROR, "onError::" + eqError.getErrorCode() + "::" + eqError.getErrorMessage());
                        callbackContext.error(eqError.getErrorMessage());
                    }
                });
            }
            else {
                callbackContext.error("Core client not connected yet.");
            }

        } else if ("getDqaId".equals(action)) {
            if (mIsConnected) {
                Log.i(INFO, "DQA ID::" + mAgentInformationManager.getDqaId());
                callbackContext.success(mAgentInformationManager.getDqaId());
            } else {
                callbackContext.error("Core client not connected yet.");
            }

        }  else if ("getDqaStatus".equals(action)) {
            Log.i(INFO, "DQA Status::" + mCoreClient.getStatus());
            callbackContext.success(mCoreClient.getStatus());

        }  else if ("getDataCollectStatus".equals(action)) {
            Log.i(INFO, "Data Collect Status::" + mCoreClient.isEnable());
            if(mCoreClient.isEnable()) {
                callbackContext.success("true");
            } else {
                callbackContext.success("false");
            }

        } else if ("onPermissionChanged".equals(action)) {
            if (mIsConnected) {
                Log.i(INFO, "onPermissionChanged");
                mPermissionsManager.onPermissionsChanged();
                callbackContext.success();
            } else {
                callbackContext.error("Core client not connected yet.");
            }

        }

		else {
			return false;
		}

        return true;
    }

    //********************************************
    // EQ CONNECTION CALLBACKS
    //********************************************

    @Override
    public void onConnected() {
        Log.i(INFO, this.getClass().getSimpleName() + "::onConnected");
        mIsConnected = true;
				//mCoreClient.enable(true);
        initialiseManagers();
    }

    @Override
    public void onDisconnected(int pCause) {
        mIsConnected = false;
        if(pCause == CAUSE_PROTECTION_ENABLED) {
            Log.e(ERROR,  this.getClass().getSimpleName() + "::onDisconnected::CAUSE_PROTECTION_ENABLED");
        }
        else {
            Log.e(ERROR,  this.getClass().getSimpleName() + "::onDisconnected::CAUSE_NORMAL");
        }
    }


	//********************************************
    // INITIALISATION METHODS
    //********************************************
    public void initialiseManagers() {
        mAgentInformationManager = (EQAgentInformationManager) mCoreClient.getManager(EQManagerInterface.AGENT_INFORMATION);
        mPermissionsManager = (EQPermissionsManager) mCoreClient.getManager(EQManagerInterface.PERMISSION);
    }

}
