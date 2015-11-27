package com.keel.smartdrawing.fiori;

import java.util.ArrayList;
import java.util.List;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import org.apache.cordova.PluginResult;
import org.json.JSONException;
import org.json.JSONObject;
import org.json.JSONArray;

/**
 * This calss get called from android at the moment when Smart Drawing app is sending a broadcast
 * to every app that user selected some equipment on Smart Drawing. This will intiate a process of 
 * checking which apps can do something about this equipment and thus will 'post' information back 
 * about themself to Smart Drawing.
 * This infromation willl be rendered on Smart Darwing side as 'action buttons' in information panel 
 * which user can tap in order to call the app and execute the given action.
 * Check smartdrawing.js function SmartDrawing.onCheckObjectAction for implementation of callback to JS side.
 *  
 */
public class SupportedEquipmentsBroadcastReceiver extends BroadcastReceiver {
	
	public static final String TAG = "com.keel.smartdrawing.fiori";
	
	public static final String KEEL_INTENT_CALL_FIORI_ACTION = "com.keelsolution.action.CALL_FIORI";
	public static final String KEEL_INTENT_ACTION_EXTRA_EQUIPMENT_ID= "com.keelsolution.action.extra.equipmentId";
	public static final String KEEL_INTENT_ACTION_EXTRA_DATA = "com.keelsolution.smartdrawing.EXTRA";

	
	
	@Override
	public void onReceive(Context context, Intent intent) {


		
		String equipmentToCheck = intent.getStringExtra(KEEL_INTENT_ACTION_EXTRA_EQUIPMENT_ID);
		Log.v(TAG, "Received request from SmartDrawing app to check equipment " + equipmentToCheck);
		

		try {
		
			SingletonContextContainer singletonContextContainer = SingletonContextContainer.getInstance(context);

			
			//fire event to JS side if we have someone interested to listen on it
			if (singletonContextContainer.onCheckObjectActionContext != null)
			{
				PluginResult result = new PluginResult(PluginResult.Status.OK, equipmentToCheck);
		    	result.setKeepCallback(true);
		    	singletonContextContainer.onCheckObjectActionContext.sendPluginResult(result);
			};
			
			
			//check if any default actions shall be added
			JSONArray actions = singletonContextContainer.getActions();
			if (actions.length() > 0){
				//respond to Smart Drawing that our app can be called:
				Bundle resultExtras = getResultExtras(true);
				if (resultExtras == null){
					resultExtras = new Bundle();
				}
				
				ArrayList<String> arrayList = resultExtras.getStringArrayList(KEEL_INTENT_ACTION_EXTRA_DATA);
				if (arrayList == null){
		
					arrayList = new ArrayList<String>();
				}
				
				for (int i = 0; i < actions.length(); i++){
					JSONObject action = actions.getJSONObject(i);
					
					action.put("equipmentId", equipmentToCheck);
					action.put("packageName", context.getPackageName());
					action.put("action", KEEL_INTENT_CALL_FIORI_ACTION);
					
					arrayList.add(action.toString());
				}
				
			
				resultExtras.putStringArrayList(KEEL_INTENT_ACTION_EXTRA_DATA, arrayList);
				setResultExtras(resultExtras);
			}
		
		} catch (Exception e){

			e.printStackTrace();
		
		}
	
	}

}
