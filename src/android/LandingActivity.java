package com.keel.smartdrawing.fiori;

import android.os.Bundle;
import android.util.Log;
import android.content.Intent;
import org.apache.cordova.*;
import android.widget.Toast;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import android.text.TextUtils;
import org.apache.cordova.PluginResult;
import com.keel.fiori.client.MainActivity;
import java.lang.Exception;

/**
 * This activity get called from Smart Drawing intent when user taps on action button in information panel of some equipment.
 * The tap in Smart drawing on action will cause an intent with special callbackContext sent to our receiver. Here we will read 
 * the context from intent and pass it down to JS side which will trigger navigation in Fiori launcpad to corresponding Fiori 
 * app and screen using a hash part of url that is passed in callbackContext. For details on this please look at internal function
 * SmartDrawing~onOpenFioriApp and subscription to this event in internal function SmartDrawing~onDeviceReady inside smartdrawing.js file.  
 */
public class LandingActivity extends CordovaActivity 
{
	public static final String TAG = "com.keel.smartdrawing.fiori";
	
	public static final String KEEL_INTENT_ACTION_EXTRA_CALLBACK_CONTEXT = "com.keelsolution.action.extra.CALLBACK_CONTEXT";
	
	
    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);

        Log.v(TAG, "Smart Drawing plugin -  LandingActivity - onCreate - intent:" + getIntent().toString());
        
        if (!getIntent().hasExtra(KEEL_INTENT_ACTION_EXTRA_CALLBACK_CONTEXT)){
        	Log.v(TAG, "Smart Drawing plugin -  LandingActivity - onCreate - no extras found -> finish");
        	return;
        }
        
        String jsonString = getIntent().getStringExtra(KEEL_INTENT_ACTION_EXTRA_CALLBACK_CONTEXT);
        if (TextUtils.isEmpty(jsonString)){  
        	Log.v(TAG, "Smart Drawing plugin -  LandingActivity - onCreate - empty extras received -> finish");
        	return;
        }
        
        Log.v(TAG, "Smart Drawing plugin -  LandingActivity - onCreate - extras:" + jsonString);
        
        
		//fire event to JS side if we have someone interested to listen on it
        try {
        	SingletonContextContainer singletonContextContainer = SingletonContextContainer.getInstance(getApplicationContext());
        	
    		if (singletonContextContainer.onOpenFioriAppContext != null)
    		{
    			PluginResult result = new PluginResult(PluginResult.Status.OK, jsonString);
    	    	result.setKeepCallback(true);//keep callback active as we use the same callback again for next even 
    	    	singletonContextContainer.onOpenFioriAppContext.sendPluginResult(result);
    		} else {
    			//no listener is registered yet to this action, store the app context and wait until listener is registered
    			singletonContextContainer.setStartFioriApp(jsonString);
    		};        

            //switch to MainActivity to show Fiori launchpad or started Fiori app
            Intent intent = new Intent(this, MainActivity.class);
            intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
            startActivity(intent);
        	
        } catch (Exception e)
        {
        	e.printStackTrace();
        }
 

        
        finish();
        
    }
	
	@Override
    public void onNewIntent(Intent smdIntent) {
    	
    	Log.v(TAG, "Smart Drawing plugin -  LandingActivity - onNewIntent" + smdIntent.getAction());
    	
        if (!smdIntent.hasExtra(KEEL_INTENT_ACTION_EXTRA_CALLBACK_CONTEXT)){
        	Log.v(TAG, "Smart Drawing plugin -  LandingActivity - onNewIntent - no extras found -> finish");
        	return;
        }
        
        String jsonString = smdIntent.getStringExtra(KEEL_INTENT_ACTION_EXTRA_CALLBACK_CONTEXT);
        if (TextUtils.isEmpty(jsonString)){  
        	Log.v(TAG, "Smart Drawing plugin -  LandingActivity - onNewIntent - empty extras received -> finish");
        	return;
        }
        
        Log.v(TAG, "Smart Drawing plugin -  LandingActivity - onNewIntent - extras:" + jsonString);
        
		//fire event to JS side if we have someone interested to listen on it
        try {
	        SingletonContextContainer singletonContextContainer = SingletonContextContainer.getInstance(getApplicationContext());
	        
			if (singletonContextContainer.onOpenFioriAppContext != null)
			{
				PluginResult result = new PluginResult(PluginResult.Status.OK, jsonString);
		    	result.setKeepCallback(true);//keep callback active as we use the same callback again for next even 
		    	singletonContextContainer.onOpenFioriAppContext.sendPluginResult(result);
			};        
	
	        //switch to MainActivity to show Fiori launchpad or started Fiori app
	        Intent intent = new Intent(this, MainActivity.class);
	        intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
	        startActivity(intent);
        } catch (Exception e)
        {
        	e.printStackTrace();
        }
    	 
        finish();
    }
}
