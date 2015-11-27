package com.keel.smartdrawing.fiori;



import org.json.JSONArray;
import org.json.JSONException;
import java.lang.Exception;

import android.content.Context;
import android.content.SharedPreferences;
import android.content.SharedPreferences.Editor;
import android.preference.PreferenceManager;
import org.apache.cordova.CallbackContext;

/**
 * This class is data container for Smart drawing plugin assuring access to all shared data between activities, cordova plugin and broadcast receiver.
 */
public class SingletonContextContainer {

	private static final String PREFERENCE_DEFAULT_ACTIONS = "defaultActions";

	private static SingletonContextContainer INSTANCE;
	
	private Context context;

	private static SharedPreferences sharedPreferences;

	private static Editor editor;
	
	private String startFioriApp = null;

	//callbacks that are permanently listened by JS
	public CallbackContext onCheckObjectActionContext = null;
	
	public CallbackContext onOpenFioriAppContext = null;
	
	private SingletonContextContainer() {
	}
	

	public static SingletonContextContainer getInstance(Context context) throws Exception {
		
		if (INSTANCE == null){
			INSTANCE = new SingletonContextContainer();
			INSTANCE.context = context;
			
			sharedPreferences = PreferenceManager.getDefaultSharedPreferences(context);
			editor = sharedPreferences.edit();
		}
		
		return INSTANCE;
	}
	
	public void saveActions(JSONArray defaultActions){
		String json = defaultActions.toString();
	
		editor.putString(PREFERENCE_DEFAULT_ACTIONS, json).commit();
	}
	
	public JSONArray getActions(){
		String json = sharedPreferences.getString(PREFERENCE_DEFAULT_ACTIONS, "");
		JSONArray jsonArray;
		try {
			jsonArray = new JSONArray(json);
		} catch (JSONException e) {
			e.printStackTrace();
			jsonArray = new JSONArray();
		}
		
		return jsonArray;
	}
	
	public String getStartFioriApp(){
		return startFioriApp;
	}
	
	public void setStartFioriApp(String hash){
		startFioriApp = hash;
	}

}