package com.keel.smartdrawing.fiori;

import java.util.ArrayList;
import java.util.List;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import java.util.List;
import org.apache.cordova.PluginResult;
import org.json.JSONException;
import org.json.JSONObject;
import org.json.JSONArray;

/**
 * This class gets called from Android at the moment when Smart Drawing app is sending back a broadcast
 * intent with list fo drawings supported by requested equipment that was requested with intent call
 * "com.keelsolution.action.CHECK_EQUIPMENT" to Smart Drawing. 
 * This class uses singleto to get access to context of caller and passes back response sent by 
 * Smart Drawing app. This is not optimized for concurrent checks for different equipment, as 
 * it holds in singleton only one (latest) caller context 
 */
public class CheckEquipmentResponseReceiver extends BroadcastReceiver {
	
	public static final String TAG = "com.keel.smartdrawing.fiori";
	public static final String KEEL_INTENT_ACTION_EXTRA_DRAWING_LIST = "com.keelsolution.action.extra.DRAWING_LIST";
	
	
	@Override
	public void onReceive(Context context, Intent intent) {
		
		try {
			SingletonContextContainer singletonContextContainer = SingletonContextContainer.getInstance(context);
		
		
			List<String> intentResult = intent.getStringArrayListExtra(KEEL_INTENT_ACTION_EXTRA_DRAWING_LIST);
			String jsonResult;
			if (intentResult != null){
				Log.v(TAG, "SMD received:" +  intentResult.toString());	
				jsonResult = intentResult.toString();
				
			} else {
				Log.v(TAG, "SMD received without extras key DRAWING_LIST");
				jsonResult = "[]";
			}
		
			if (singletonContextContainer.onCanShowEquipmentContext != null)
			{
				PluginResult result = new PluginResult(PluginResult.Status.OK, jsonResult);
		    	result.setKeepCallback(false); //finsih with callback
		    	singletonContextContainer.onCanShowEquipmentContext.sendPluginResult(result);
				singletonContextContainer.onCanShowEquipmentContext = null;
			};
		} catch (Exception e){

			e.printStackTrace();
		}
	}
}
