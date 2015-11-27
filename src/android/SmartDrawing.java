package com.keel.smartdrawing.fiori;

import org.apache.cordova.CordovaWebView;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaResourceApi;
import org.apache.cordova.PluginResult;
import org.apache.cordova.CordovaInterface;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.apache.cordova.CordovaActivity;
import android.util.Log;
import android.provider.Settings;
import android.widget.Toast;
import android.app.Activity;
import android.content.Intent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.os.Bundle;
import java.lang.Exception;

/**
* Cordova Smart Drawing integration plugin
*
* Smart Drawing cordova/kapsel plugin enables Fiori apps to integarte with drawings provided by Smart Drawing app which shows drawing using native 
* code and enables end user interact fiori app from the drawing itself.
*/
public class SmartDrawing extends CordovaPlugin {
	public static final String TAG = "com.keel.smartdrawing.fiori";
	public static final String INTENT_SMD_ACTION = "com.keelsolution.action.OPEN_DRAWING";
	public static final String INTENT_EXTRA_KEY = "com.keelsolution.smartdrawing.EXTRA";

	public static final String KEEL_INTENT_ACTION_CHECK_EQUIPMENT = "com.keelsolution.action.CHECK_EQUIPMENT";
	public static final String KEEL_INTENT_ACTION_EXTRA_EQUIPMENT_ID= "com.keelsolution.action.extra.equipmentId";
	
	public static final String KEEL_INTENT_ACTION_CHECK_DRAWING = "com.keelsolution.action.CHECK_DRAWING";
	public static final String KEEL_INTENT_ACTION_EXTRA_DRAWING_ID= "com.keelsolution.action.extra.drawingId";
	
	private static final String KEEL_INTENT_ACTION_SEND_SUPPORTED_INFO = "com.keelsolution.action.ACTION_SUPPORTED_INFO";
	private static final String KEEL_INTENT_EXTRA_ACTION_SUPPORTED_INFO = "com.keelsolution.action.extra.ACTION_SUPPORTED_INFO";
	
	public static final String KEEL_INTENT_CALL_FIORI_ACTION = "com.keelsolution.action.CALL_FIORI";
	
	public static final String KEEL_INTENT_ACTION_EXTRA_DRAWING_LIST = "com.keelsolution.action.extra.drawingList";
	
	public static final String ACTION_SHOW_TOAST = "showToast";
	//show
	public static final String ACTION_SHOW_EQUIPMENT = "showEquipment";
	public static final String ACTION_SHOW_DRAWING = "showDrawing";
	public static final String ACTION_SHOW_DATA = "showData";
	//check 
	public static final String ACTION_CANSHOW_EQUIPMENT = "canShowEquipment";
	public static final String ACTION_CANSHOW_DRAWING = "canShowDrawing";
	//JS subscription to SmartDrawing broadcast intents to check if we can do something with it
	public static final String ACTION_ON_CHECK_OBJECT_ACTION = "onCheckObjectAction";
	public static final String ACTION_ON_ACTION_NOTIFIER = "actionNotifier";
	public static final String ACTION_REGISTER_DEFAULT_ACTIONS = "subscribeResponsesOnCheckAction";
	//JS subscription to execute Fiori app open calls by plagin
	public static final String ACTION_ON_OPEN_FIORI_APP = "onOpenFioriApp";
	public static final String ACTION_RETURN_TO_SMART_DRAWING_APP = "returnToSmartDrawingApp";
	
	//data container
	private SingletonContextContainer singletonContextContainer;
	
	
	/**
	 * Constructor.
	 */
	public SmartDrawing() {
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
		Log.v(TAG, "Init Smart Drawing plugin");
		
		try{
			
			singletonContextContainer = SingletonContextContainer.getInstance(cordova.getActivity().getApplicationContext());
			
		} catch (Exception e){
			e.printStackTrace();
		}
		
	}
	
	/**
	 * Main entry point - A Cordova plugin always need a public boolean execute method. 
	 * This method is called by the framework whenever the function exec is called from a 
	 * piece of Javascript code. The Javascript exec function will then try to look for a
	 * matching function and plugin in the Java classes. If it finds one it will 
	 * trigger the execute function.
	 * https://cordova.apache.org/docs/en/3.5.0/guide_platforms_android_plugin.md.html#Android%20Plugins
	 */
	@Override
	public boolean execute(final String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
		try {
			//show on drawing some element
			if (ACTION_SHOW_EQUIPMENT.equals(action) || ACTION_SHOW_DRAWING.equals(action) || ACTION_SHOW_DATA.equals(action) ) { 
				JSONObject smdMessage = args.getJSONObject(0);
				
				showData(smdMessage, callbackContext);
				
                return true;
			}
			
			
			if (ACTION_CANSHOW_EQUIPMENT.equals(action) ) { 
								
                if (args.length() != 1) {
                    callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.INVALID_ACTION));
                    return false;
                }
                
                JSONObject arg_object = args.getJSONObject(0);
                canShowEquipment(arg_object.getString("id"), callbackContext);
                				
                return true;
			}
			
			if (ACTION_CANSHOW_DRAWING.equals(action) ) { 
				
                if (args.length() != 1) {
                    callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.INVALID_ACTION));
                    return false;
                }
                
                JSONObject arg_object = args.getJSONObject(0);
                canShowDrawing(arg_object.getString("id"), callbackContext);
                				
                return true;
			}
			
			if (ACTION_ON_CHECK_OBJECT_ACTION.equals(action) ) { 
				
				//store reference to single JS callback to raise notification about equipment check 
				// to every observer 
				if (singletonContextContainer.onCheckObjectActionContext == null){
	                singletonContextContainer.onCheckObjectActionContext = callbackContext;
	                
	                onCheckObjectAction(callbackContext);
				}
                				
                return true;
			}
			
			if (ACTION_ON_ACTION_NOTIFIER.equals(action) ) { 
				
				
                //let Smart drawing know about action we can execute (async call)
				
                if (args.length() != 1) {
                    callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.INVALID_ACTION));
                    return false;
                }
                
                JSONObject appContext = args.getJSONObject(0);
                actionNotifier(appContext, callbackContext);
                				
                return true;
			}
			
			if (ACTION_REGISTER_DEFAULT_ACTIONS.equals(action) ) { 
				
				//save default actions that will be sent to every 'check equipment action'
				singletonContextContainer.saveActions(args);
			
				return true;
				
			}
			
			if (ACTION_ON_OPEN_FIORI_APP.equals(action) ) { 
				
                singletonContextContainer.onOpenFioriAppContext = callbackContext;
				//register single callback to JS in order to open Firoi app provided in callbackparameters
                onOpenFioriApp(callbackContext);
                				
                return true;
			}
			
			if (ACTION_RETURN_TO_SMART_DRAWING_APP.equals(action) ) { 
				
				//return from cordova app to previous app in android stack
				returnToSmartDrawingApp(callbackContext);
                				
                return true;
			}
			
			
			
			if (ACTION_SHOW_TOAST.equals(action)) { 
				JSONObject arg_object = args.getJSONObject(0);
				
				showToast(arg_object.getString("title"), arg_object.getString("message"), callbackContext);
			
				return true;
			}
			
			callbackContext.error("Invalid action");
			return true;
		} catch(Exception e) {
			System.err.println("Exception: " + e.getMessage());
			callbackContext.error(e.getMessage());
			return true;
		}
	}
	
	
	/**
	 * Call smart drawing to check if equipment is known by the app
	 */
	private synchronized void canShowEquipment(final String equipmentId, final CallbackContext callbackContext) {

		cordova.getActivity().runOnUiThread(new Runnable() {
			public void run() {	
				
				Log.v(TAG, "SMD canShowEquipment: call for " +  equipmentId);
				
				Intent intent = new Intent(KEEL_INTENT_ACTION_CHECK_EQUIPMENT);
				intent.putExtra(KEEL_INTENT_ACTION_EXTRA_EQUIPMENT_ID, equipmentId);
				((CordovaActivity)cordova.getActivity()).sendOrderedBroadcast(intent, null, new CheckEquipmentResponseReceiver(callbackContext), null, Activity.RESULT_OK, null, null);
				
				//postpone result
				PluginResult result = new PluginResult(PluginResult.Status.NO_RESULT);
                result.setKeepCallback(true); //re-use the callback on intent events
                callbackContext.sendPluginResult(result);
			}
		});
	}
	
	private class CheckEquipmentResponseReceiver extends BroadcastReceiver{
		
		private CallbackContext callbackContext;
		
		CheckEquipmentResponseReceiver(CallbackContext context){
			callbackContext = context;
		}

		@Override
		public void onReceive(Context context, Intent intent) {

			Bundle resultExtras = getResultExtras(true);
			if (resultExtras!= null){
				
				Log.v(TAG, "SMD received:" +  resultExtras.getStringArrayList(KEEL_INTENT_ACTION_EXTRA_DRAWING_LIST).toString());
					
				//Toast.makeText(cordova.getActivity().getApplicationContext(), resultExtras.getStringArrayList(KEEL_INTENT_ACTION_EXTRA_DRAWING_LIST).toString(), Toast.LENGTH_LONG).show();
				
				PluginResult result = new PluginResult(PluginResult.Status.OK, resultExtras.getStringArrayList(KEEL_INTENT_ACTION_EXTRA_DRAWING_LIST).toString());
	        	result.setKeepCallback(false);
	        	callbackContext.sendPluginResult(result);
			}
		}
		
	}
	
	
	/**
	 * Call smart drawing to check if drawing is known by the app
	 */
	private synchronized void canShowDrawing(final String drawingId, final CallbackContext callbackContext) {

		cordova.getActivity().runOnUiThread(new Runnable() {
			public void run() {	
				
				Log.v(TAG, "SMD canShowDrawing: call for " +  drawingId);
				
				Intent intent = new Intent(KEEL_INTENT_ACTION_EXTRA_DRAWING_ID);
				intent.putExtra(KEEL_INTENT_ACTION_EXTRA_DRAWING_ID, drawingId);
				((CordovaActivity)cordova.getActivity()).sendOrderedBroadcast(intent, null, new CheckDrawingResponseReceiver(callbackContext), null, Activity.RESULT_OK, null, null);
				
				//postpone result
				PluginResult result = new PluginResult(PluginResult.Status.NO_RESULT);
                result.setKeepCallback(true); //re-use the callback on intent events
                callbackContext.sendPluginResult(result);
			}
		});
	}
	
	private class CheckDrawingResponseReceiver extends BroadcastReceiver{
		
		private CallbackContext callbackContext;
		
		CheckDrawingResponseReceiver(CallbackContext context){
			callbackContext = context;
		}
		
		@Override
		public void onReceive(Context context, Intent intent) {
			
			String resultString = "false";
			if (getResultCode() == Activity.RESULT_OK){
				resultString = "true";
			}
				
			//Toast.makeText(cordova.getActivity().getApplicationContext(), resultString, Toast.LENGTH_LONG).show();
			
			PluginResult result = new PluginResult(PluginResult.Status.OK, resultString);
        	result.setKeepCallback(false);
        	callbackContext.sendPluginResult(result);
		}		
	}
	
	
	
	
	/**
	 * Subscribe to SmartDrawing broadcast messages to check if app can do any action with particular 
	 * object that is at the moment shown on Smart Drawing screen.
	 */
	private synchronized void onCheckObjectAction(final CallbackContext callbackContext) {
		//context is alreadys saved in singleton in execute(), so just mark that we want to keep the cntext and can call 
		//the JS side if we receive any information from Smart Drawing

		cordova.getActivity().runOnUiThread(new Runnable() {
			public void run() {	
				
				Log.v(TAG, "SMD onCheckObjectAction call to JS");
								
				//postpone result
				PluginResult result = new PluginResult(PluginResult.Status.NO_RESULT);
                result.setKeepCallback(true); //re-use the callback on intent events
                callbackContext.sendPluginResult(result);
			}
		});
	}
	
	/** 
	* This function notifies Smart Drawing app that some action can be executed by Fiori app on currently selected equipment.
	* Fiori apps that is interested to show up for this equipment will call this function from {@link onCheckObjectAction} listener and in case 
	* object is suitable and Fiori app wants to show its icon on Smart Drawing informational panel than Firoi app will call {@link actionNotifier} 
	* function with ApplicationContext data object. This object contains all information required by Smart Drawing app to render action icon and also 
	* has property <i>"callbackContext"</i> with application specific information that is sent back with event 'Open Fiori App' and processed by listener {@link onOpenFioriApp} 
	* in case user taps on given action.
	* <br/><br/>
	* <b>Note:</b> When forming ApplicationContext object properties we expect Fiori app to store in <i>"callbackContext"</i> property the shell hash for Fiori launchpad 
	* pointing to the application and its view. This information will be used by listener to "Open Fiori App" event inside plugin in order to force Fiori launchpad
	* open the application to user. 
	*/
	private synchronized void actionNotifier(final JSONObject appContext, final CallbackContext callbackContext) {

		cordova.getActivity().runOnUiThread(new Runnable() {
			public void run() {	
				
				Log.v(TAG, "SMD actionNotifier with JSON:" +  appContext.toString());
				
				try {
					JSONObject intentExtra = new JSONObject(appContext.toString());
					//add intent information required to get a call back from SmartDrawing app
					intentExtra.put("packageName",((CordovaActivity)cordova.getActivity()).getPackageName());
					intentExtra.put("action",KEEL_INTENT_CALL_FIORI_ACTION);
					
					Log.v(TAG, "SMD actionNotifier send to SMD JSON:" +  intentExtra.toString());

					Intent intent = new Intent(KEEL_INTENT_ACTION_SEND_SUPPORTED_INFO);
					intent.putExtra(KEEL_INTENT_EXTRA_ACTION_SUPPORTED_INFO, intentExtra.toString());
					((CordovaActivity)cordova.getActivity()).sendBroadcast(intent);					

				} catch (JSONException e) {
					Log.e(TAG, e.toString());
					e.printStackTrace();
				}
				
				callbackContext.success();
			}
		});
		
	}	
	
	
	/**
	 * Event to SmartDrawing JS side that there is request to open some Fiori tile from Java side
	 */
	private synchronized void onOpenFioriApp(final CallbackContext callbackContext) {

		cordova.getActivity().runOnUiThread(new Runnable() {
			public void run() {	
				
				Log.v(TAG, "Subscription to onOpenFioriApp event registered from JS");
				
				PluginResult result;
				String appContext = "";
				if (singletonContextContainer.getStartFioriApp() != null){
					appContext = singletonContextContainer.getStartFioriApp();
					//reset value
					singletonContextContainer.setStartFioriApp(null);
					
					//call to open some app is already fired - get the context and trigger the listener
					result = new PluginResult(PluginResult.Status.OK, appContext);
				} else {
					//empty result
					result = new PluginResult(PluginResult.Status.NO_RESULT);
				}
				
				result.setKeepCallback(true);//keep callback active as we use the same callback again for next even 
                callbackContext.sendPluginResult(result);
                
			}
		});
	}
	

	/**
	 * Put Fiori client in back and return to previous app in Android stack
	 */
	private synchronized void returnToSmartDrawingApp(final CallbackContext callbackContext) {

		cordova.getActivity().runOnUiThread(new Runnable() {
			public void run() {	
				
				Log.v(TAG, "Return to Smart Drawing App called from JS");
				
				//finish current activity
				//((CordovaActivity)cordova.getActivity()).finish();
				((CordovaActivity)cordova.getActivity()).moveTaskToBack(true); 
				
				callbackContext.success();
			}
		});
	}
	
	
//    @Override
//    public void onNewIntent(Intent intent) {
//    	
//    }
	
	
	/**
	 * Call smart drawing to show data
	 */
	private synchronized void showData(final JSONObject smdMessage, final CallbackContext callbackContext) {

		cordova.getActivity().runOnUiThread(new Runnable() {
			public void run() {	
				
				Log.v(TAG, "JSON:" +  smdMessage.toString());
				
				Intent intent = new Intent(INTENT_SMD_ACTION);
				intent.putExtra(INTENT_EXTRA_KEY, smdMessage.toString());
				((CordovaActivity)cordova.getActivity()).startActivity(intent);
				
				callbackContext.success();
			}
		});
	}
	
	/**
	 * show native Toast in android 
	 */
	private synchronized void showToast(final String title, final String message, final CallbackContext callbackContext) {
		final int duration = Toast.LENGTH_SHORT;
		cordova.getActivity().runOnUiThread(new Runnable() {
			public void run() {
				Toast toast = Toast.makeText(cordova.getActivity().getApplicationContext(), title + ':' + message, duration);
				toast.show();
				callbackContext.success();
			}
		});
	}
	
}