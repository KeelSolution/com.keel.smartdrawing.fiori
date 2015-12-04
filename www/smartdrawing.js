/**
 * Cordova Smart Drawing integration plugin
 */

/**
 * Smart Drawing cordova/kapsel plugin enables Fiori apps to integarte with drawings provided by Smart Drawing app which shows drawing
 * using native code and enables end user interact fiori app from the drawing itself.
 * While running under the cordova/phonegap the plugin is accessible by the path window.plugins.SmartDrawing .
 * @class SmartDrawing
 */
(function (cordova) {

	/*global location, hasher, window */

	/**
	 * Instance of Smart Drawing corcova/kapsel plugin
	 */
	var SmartDrawing = function () {};

	/* private memebers */

	/**
	 * List of observers that interested to respond on 'check object action' event from Smart Drawing app. See also {@link SmartDrawing.onCheckObjectAction}
	 * and {@link SmartDrawing.removeOnCheckObjectAction}
	 * @member SmartDrawing~observerCheckObjectAction
	 */
	var observerCheckObjectAction = {};

	//store the reference to object
	var that = this;

	//hash history pair before INTENT call from Smart Drawing app to Firoi client was initiated
	var appIntentHash = "";
	var appOldHash = "";

	//Constant hash value added to URL has if call to Fiori is treggerd by Android intent
	var INTENT_HASH_LABEL = "KEELSMARTDRAWINGINTENT";

	//Firoi catalog with SMD enabled apps
	var FIORI_SMD_CATALOG_LABEL = "Smart Drawing Integrated";

	/* types */

	/**
	 * @typedef {Object} EquipmentData - Container object with information about single equipment that shall be passed to Smart Drawing
	 * @property {string} equipmentId - ID of the equipment to be shown.
	 * @property {string} color - Hex color code which smart drawing shall use to highlight equipment (e.g. "#ff0000" for red highlight).
	 * @property {string} [status] - Status description of the object (optional).
	 * @property {EquipmentProperty[]} [info] - List of equipment properties that shall be show by smart drawing when user tap on equipment. This property is optional.
	 * @property {EquipmentDocument[]} [documents] - List of documents connected with this equipment (e.g. manuals, pictures and so on). This property is optional.
	 */

	/**
	 * @typedef {Object} EquipmentProperty - Equipment property definition used in Smart Drawing to show additional data about equipment.
	 * @property {string} name - Display name of the property.
	 * @property {string} value - Property value.
	 */

	/**
	 * @typedef {Object} EquipmentDocument - Dcument attached to equipment. This information is used by Smart Drawing app to show attachments to equipment
	 * in information panal - every attachment gets its icon based on thumbnail (if available) or url content.
	 * @property {string} name - Display name of the document.
	 * @property {string} value - URL address to document for download. If user ins mart drawing taps on document icon Smart Drawing app will open URL
	 * provided in this property to show referenced document
	 * @property {string} [thumbnail] - Optional thumbnail of the document.
	 */

	/**
	 * @typedef {Object} DrawingDescription - Description of Smart Drawing object.
	 * @property {string} drawingId - Smart Drawing Id.
	 * @property {string} drawingName - Smart Drawing name or description.
	 */

	/**
	 * @typedef {Object} ActionCheckContext - Context information about equipment currently shown in Smart Drawing app. Fiori apps can look into this
	 * context and use its data to decide if they want to send back an information about 'actions' they can do about this equipment.
	 * @property {string} equipmentId - Id of equipment that is currently selected by user in Smart Drawing app.
	 */

	/**
	 * @typedef {Object} ApplicationContext - Information about application and action that is sent back to Smart Drawing app in order to render action
	 * item in information panel of currently displayed equipment. This object also contains an information that will be send back to the aplication if
	 * user decides to tap on this action inside Smart Drawing UI.
	 * @property {string} [equipmentId] - Id of equipment that was analyzed by application and to which proposed action is related.
	 * @property {string} name - Application name or description. This shall be a short name as action icon does nto take too much space on
	 * screen - e.g. "Inspector".
	 * @property {string} actionLabel - Action that can be performed on analyzed equipment. This shall be a short name as action icon does nto take too much space on
	 * screen - e.g. "Perform inspection" or "Review inspection".
	 * @property {string} [imageBase64] - Base64 encoded string with image that describes the action at the best.
	 * @property {FioriAppContext} callbackContext - String with call context that will be sent back to application when user tap on action button inside Smart Drawing app -
	 * for example hash part of URL to route Firoi lounchpad to proper application and open correct data there - e.g. "myworkorders-view&/MaintenanceOrderSet('820266')".
	 */

	/**
	 * @typedef {string} FioriAppContext - String with call context that will be sent back to application when user tap on action button inside Smart Drawing app -
	 * for example hash part of URL to route Firoi lounchpad to proper application and open correct data there - e.g. "myworkorders-view&/MaintenanceOrderSet('820266')".
	 */

	/*   methods */

	/**
	 *
	 * Shows equipment in Smart Drawing app using native platform capabilities. The app will open drawing, highlight equipment and zoom
	 * the drawing to see equipment.
	 * Basic information about equipment known to Smart Drawing app will be shown in Information panel. A caller can also supply own
	 * information to be shown using label and equipmentData parameters.
	 * Before showing, you can check by Smart Drawing if equipment can be shown using  {@link SmartDrawing.canShowEquipment|canShowEquipment} function.
	 *
	 * @param {string} label - Label of the info block in smart drawing information section.
	 * @param {EquipmentData} equipmentData - Information about equipment that shall be shown on Smart Drawing, at minimum it shall include equipmentId of equipment to be shown. 
	 * See explanation of {@link EquipmentData} object fields for more information..
	 * @param {callbackFail} [fail] - Callback function called in case of failure in Smart Drawing app or plugin.
	 * @function SmartDrawing.showEquipment
	 */
	SmartDrawing.prototype.showEquipment = function (label, equipmentData, fail) {
		return cordova.exec(
			function (args) {},
			function (args) {
			if (fail)
				fail(args);
		},
			"SmartDrawing",
			"showEquipment",
			[{
					"label" : label,
					"equipmentId" : equipmentData.equipmentId,
					"equipments" : [equipmentData]
				}
			]);
	};
	/**
	 * This callback is displayed as part of the SmartDrawing class and used to return back error message in any kind of failure.
	 *
	 * @callback callbackFail
	 * @param {string} err - Error message from Smart Drawing.
	 */

	/**
	 * Shows drawing in Smart Drawing app using native platform capabilities. Before showing, you can check by smart darwing if drawing can be shown using  {@link SmartDrawing.canShowDrawing|canShowDrawing} function.
	 *
	 * @param {string} drawingId - ID of the drawing to show.
	 * @param {callbackFail} [fail] - Callback function called in case of failure in Smart Drawing app or plugin.
	 * @function SmartDrawing.showDrawing
	 */
	SmartDrawing.prototype.showDrawing = function (drawingId, fail) {
		return cordova.exec(
			function (args) {},
			function (args) {
			if (fail)
				fail(args);
		},
			"SmartDrawing",
			"showEquipment",
			[{
					"drawingId" : drawingId
				}
			]);
	};

	/**
	 * Shows list of equipment in Smart Drawing app using native platform capabilities. The app will open drawing, highlight all equipment with corresponding colors
	 * and zoom the drawing in a way to put all shown equipment into visible area.
	 * When user tap on some equipment highlighted, basic information about known to Smart Drawing app will be shown in Information panel. A caller has also possibility to supply own
	 * information to be shown using label and equipmentArr parameters.
	 * Before showing, you can check by Smart Drawing if equipment can be shown using  {@link SmartDrawing.canShowEquipment|canShowEquipment} function.
	 *
	 * @example
	 *	var sEquipmentId = this.getView().getBindingContext().getProperty("Equipmentid");
	 *	var sDrawingId = this.getView().getBindingContext().getProperty("Drawingid");
	 *
	 *	//prepare JSON data
	 *	var equipment = {
	 *		equipmentId: sEquipmentId,
	 *		color: "#ff0000",
	 *		status: "Active",
	 *		info: []
	 *	};
	 *
	 *	var equipmentArr = [];
	 *	equipmentArr.push(equipment);
	 *
	 *	//call Smart Drawing plugin
	 *	if (window.plugins && window.plugins.SmartDrawing) {
	 *		window.plugins.SmartDrawing.showData("Fiori work order", sDrawingId, equipmentArr,
	 *			//failure
	 *			function(err) {
	 *				MessageToast.show("SmartDrawing plugin call failed " + err);
	 *			});
	 *   }
	 *
	 * @param {string} label - Label of the info block in smart drawing information section.
	 * @param {EquipmentData[]} equipmentArr - Array of equipment data that shall be shown to smart drawing, at minimum it shall include equipmentId of 
	 * equipment to be shown. See explanation of {@link EquipmentData} object fields for more information.
	 * @param {callbackFail} [fail] - Callback function called in case of failure in Smart Drawing app or plugin.
	 * @function SmartDrawing.showData
	 */
	SmartDrawing.prototype.showData = function (label, drawingId, equipmentArr, fail) {
		return cordova.exec(
			function (args) {},
			function (args) {
			if (fail)
				fail(args);
		},
			"SmartDrawing",
			"showEquipment",
			[{
					"label" : label,
					"drawingId" : drawingId,
					"equipments" : equipmentArr
				}
			]);
	};

	/**
	 * This function checks if the given equipmentId is known to SmartDrawing app and returns the list of Smart Drawing Ids and descriptions where this equipment can be found.
	 *
	 * @example
	 *	var sEquipmentId = view.getBindingContext().getProperty("Equipmentid");
	 *	if (window.plugins && window.plugins.SmartDrawing) {
	 *
	 *		window.plugins.SmartDrawing.canShowEquipment(sEquipmentId,
	 *			//result
	 *			function(result) {
	 *
	 *				var drawingsArr = JSON.parse(result);
	 *
	 *					for (var i = 0, len = drawingsArr.length; i<len; i++){
	 *						var drawing = drawingsArr[i];
	 *						var oButton = new sap.m.Button({
	 *							text : "Open " + drawing.drawingName,
	 *							icon : "images/SD_logo_black_48.png",
	 *							width : "100%",
	 *							press : showSmartDrawing(drawing.drawingId);
	 *						});
	 *						view.byId("smartDrawingButtons").addContent(oButton);
	 *					}
	 *			},
	 *			//failure
	 *			function(err) {
	 *				MessageToast.show("SmartDrawing plugin call failed " + err);
	 *			});
	 *	}
	 *
	 * @param {string} equipmentId - ID of the equipment.
	 * @param {callbackCanShowEquipment} result - Callback function with results of check. See description of the {@link callbackCanShowEquipment} function for parameter details
	 * @param {callbackFail} fail - Callback function called in case of failure in Smart Drawing app or plugin.
	 * @function SmartDrawing.canShowEquipment
	 */
	SmartDrawing.prototype.canShowEquipment = function (equipmentId, result, fail) {
		return cordova.exec(
			function (args) {
			result(args);
		},
			function (args) {
			fail(args);
		},
			"SmartDrawing",
			"canShowEquipment",
			[{
					"id" : equipmentId
				}
			]);
	};
	/**
	 * This callback is displayed as part of the SmartDrawing class and describes the receiver for check results if equipment is known to Smart Drawing app and can be shown at any of drawings.
	 *
	 * @param {DrawingDescription[]} drawingArr - List of objects containing drawingId and drawingName. In case if equipment is not known to Smart Drawing app this list will have a length of zero.
	 * @callback callbackCanShowEquipment
	 */

	/**
	 * This function checks if the given drawingId is known to SmartDrawing app and returns true/false value in result callback.
	 * @param {string} drawingId - ID of the drawing to show.
	 * @param {callbackCanShowDrawing} result - Callback function with results of check. See description of the {@link callbackCanShowDrawing} function for parameter details
	 * @param {callbackFail} fail - Callback function called in case of failure in Smart Drawing app or plugin.
	 * @function SmartDrawing.canShowDrawing
	 */
	SmartDrawing.prototype.canShowDrawing = function (drawingId, result, fail) {
		return cordova.exec(
			function (args) {
			result(args);
		},
			function (args) {
			fail(args);
		},
			"SmartDrawing",
			"canShowDrawing",
			[{
					"id" : drawingId
				}
			]);
	};
	/**
	 * This callback is displayed as part of the SmartDrawing class and describes the receiver for check results if drawing with givent Id is known to Smart Drawing app and can be shown.
	 *
	 * @param {boolean} canShowDrawing - Boolean value if drawing with given Id can be shown by Smart Drawing app.
	 * @callback callbackCanShowDrawing
	 */

	 
	/**
	 * This event listener receives notification from the Smart Drawing app that user opened some equipment for view and app is checking what additional
	 * actions other apps can provide to user on currently selected equipment. Fiori apps that are interested in responding to Smart Drawing and wants
	 * to show their actions in Smart Drawing informational panel shall subscribe to this event by calling this function and pass inside their own callback
	 * function of type {@link callbackCheckObjectAction}.
	 * This callback has parameter actionNotifier (type {@link SmartDrawing~actionNotifier}) and if, after analysis, Fiori app decides to show its action and icon inside
	 * Smart Drawing UI, it shall invoke a callback {@link SmartDrawing~actionNotifier} and pass inside app decsriptions like name, action, icon and call context
	 * inside {@link ApplicationContext} data object. This descriptor is later used by Smart Drawing app to render action on information panel inside
	 * Smart Drawing app and its property callContext will be passed back from Smart Drawing to plugin as part of 'Open Fiori App' event in case user taps on given action.
	 * See details of {@link callbackCheckObjectAction} for further information on parameters and response required. To remove your listener use {@link SmartDrawing.removeOnCheckObjectAction}.
	 *
	 * <ol>
	 *
	 * The execution flow is like this:
	 *
	 * <li>User taps on some object (for example equipment) in Smart Drawing app.</li>
	 *
	 * <li>Smart Drawing app is sending broadcast intent to every Android app interested about object selected on smart drawing.</li>
	 *
	 * <li>Plugin responds on this broadcast intent and calls every subscriber that registerd to in with {@link SmartDrawing.onCheckObjectAction}, passing inside
	 * {@link ActionCheckContext} object.</li>
	 *
	 * <li>Subscriber inside of {@link callbackCheckObjectAction} checks if the object selected in Smart Drawing app is in any interest to him and in case it can propose some
	 * action to get done on the selected object (for example show active work orders for selected equipment) prepares the response {@link ApplicationContext} object
	 * and calls the {@link SmartDrawing~actionNotifier} to notify Smart Drawing app and draw the action element in information panel for selected equipment.</li>
	 *
	 * <li>Plugin passes this information to Smart Drawing app so inside Smart Drawing app corresponding action will be added in information panel for currently selected equipment.</li>
	 *
	 * <li>If inside Smart Drawing app user decides to execute proposed action and taps on action button in information panel, the call to Smart Drawing plugin
	 * will be initiated and property <i>callbackContext</i> from {@link ApplicationContext} will be returned back to {@link SmartDrawing~onOpenFioriApp}.</li>
	 *
	 *</ol>
	 *
	 * @example
	 *	//Subscribe for events from Smart Drawing to test if particular equipment id is known and will be handled
	 *	// by Fiori app in Component.js init() method. Do not forget to unsubscribe from it in exit() method.
	 *
	 *  // ... somewhere in init():
	 *	if (window.plugins && window.plugins.SmartDrawing) {
	 *		var appId = this.getMetadata().getManifest()["sap.app"].id;
	 *		
	 *		window.plugins.SmartDrawing.onCheckObjectAction(appId, function(callContext, actionNotifier){
	 *			
	 *			//at the moment send back the subscription immediatelly without checking the model/server
	 *			if ((callContext) && (callContext.equipmentId)) {
	 *				
	 *				//Obtain cross app navigation interface
	 *				var fgetService =  sap.ushell && sap.ushell.Container && sap.ushell.Container.getService;
	 *				var oCrossAppNavigator = fgetService && fgetService("CrossApplicationNavigation");
	 *				
	 *				var appContext = {
	 *					"equipmentId"	: callContext.equipmentId,
	 *					"name" : "My work order app",
	 *					"actionLabel" : "Call directly app",	
	 *					//keel fiori icon
	 *					"imageBase64" : "iVBORw0KGgoAAAANSUhEUgA...",  //replace with your image in base64 encoding
	 *					"callbackContext" : oCrossAppNavigator.hrefForAppSpecificHash("SMD_call") 
	 *				};
	 *				
	 *				actionNotifier(appContext);
	 *			}
	 *			
	 *		});
	 *		
	 *	}	
	 *
	 *
	 *  // ...somewhere in exit():
	 *	//remove listener for onCheckObjectAction
	 *	if (window.plugins && window.plugins.SmartDrawing) {
	 *		var appId = this.getMetadata().getManifest()["sap.app"].id;
	 *		
	 *		window.plugins.SmartDrawing.removeOnCheckObjectAction(appId);
	 *	}
	 *
	 *
	 * @param {string} appId - Fiori app id that registers for event notification.
	 * @param {callbackCheckObjectAction} callback - Event listener to check object and decide if Fiori app is interested to subscribe action to passed object.
	 * @function SmartDrawing.onCheckObjectAction
	 */
	SmartDrawing.prototype.onCheckObjectAction = function (appId, callback) {

		var group = observerCheckObjectAction[appId] || (observerCheckObjectAction[appId] = []);

		group.push(callback);

		//let plugin know that we are interested to receive notification from Smart Drawing app
		return cordova.exec(
			//success
			function (equipmentId) {

			if (!equipmentId) {
				return; //skip any null or empty equipment values
			}

			sap.Logger.info("SmartDrawing::onCheckObjectAction received from Smart drawing app for equipmentId= " + equipmentId, "SmartDrawing");
			var callContext = {};
			callContext.equipmentId = equipmentId;

			if (observerCheckObjectAction[appId] && observerCheckObjectAction[appId].length) {
				for (var i = observerCheckObjectAction[appId].length - 1; i >= 0; i--) {
					//notify every observer about check object action
					observerCheckObjectAction[appId][i].call(this, callContext, actionNotifier);
				}
			}

		},
			//error
			function (args) {},
			"SmartDrawing",
			"onCheckObjectAction",
			[]);
	};
	/**
	 * This callback is displayed as part of the SmartDrawing class and describes the event listener that receives notification from Smart Drawing app
	 * that some object (equipment or location) is at the moment selected by user in Smart Drawing app, so Fiori app can react to it, analyze if app can provide
	 * any helpful action to this equipment/location to end user and, if yes, pass back information about action Firoi app can do with currently selected equipment.
	 *
	 * @param {ActionCheckContext} callContext - Context describing what object was selected on Smart Drawing so Fiori app can analyse it and decide if it wants to.
	 * @param {SmartDrawing~actionNotifier} actionNotifier - Callback to plugin that Fiori app can execute some action on selected equipment.
	 * @callback callbackCheckObjectAction
	 */

	 
	/**
	 * This function removes event listener for receiving notification from the Smart Drawing app about equipment opened on Smart Drawing app set by
	 * {@link SmartDrawing.onCheckObjectAction}.
	 *
	 * @param {string} appId - Fiori app id that registers for event notification.
	 * @param {callbackCheckObjectAction} [callback] - Registered callback, if empty/not passed all callbacks will be removed for given appId
	 * @function SmartDrawing.removeOnCheckObjectAction
	 */
	SmartDrawing.prototype.removeOnCheckObjectAction = function (appId, callback) {
		if (!observerCheckObjectAction[appId]) {
			return;
		}

		if (callback) {
			var index = observerCheckObjectAction[appId].indexOf(callback);
			if (~index) {
				that.observerCheckObjectAction[appId].splice(index, 1);
			}
		} else {
			delete observerCheckObjectAction[appId];
		};
	};
	

	/**
	 * Simple android native Toast message function - can be used to reaise notificatio or during development to test interaction with Smart Drawing plugin.
	 *
	 * @example
	 *	if (window.plugins && window.plugins.SmartDrawing) {
	 *		window.plugins.SmartDrawing.showToast("Hello world");
	 *	}
	 *
	 * @param {string} message - Toast message.
	 * @param {callbackSuccess} [success] - Callback function called in case of success call to Smart Drawing plugin.
	 * @param {callbackFail} [fail] - Callback function called in case of failure in Smart Drawing app or plugin.
	 * @function SmartDrawing.showToast
	 */
	SmartDrawing.prototype.showToast = function (message, success, fail) {
		return cordova.exec(
			function (args) {
			if (success)
				success(args);
		},
			function (args) {
			if (fail)
				fail(args);
		},
			"SmartDrawing",
			"showToast",
			[{
					"title" : "SmartDrawing says: ",
					"message" : message
				}
			]);
	};

	
	/**
	 * This function notifies Smart Drawing app that some action can be executed by Fiori app on currently selected equipment.
	 * Fiori apps that is interested to show up for this equipment will call this function from {@link SmartDrawing.onCheckObjectAction} listener and in case
	 * object is suitable and Fiori app wants to show its icon on Smart Drawing informational panel than Firoi app will call {@link SmartDrawing~actionNotifier}
	 * function with {@link ApplicationContext} data object. This object contains all information required by Smart Drawing app to render action icon and also
	 * has property <i>"callbackContext"</i> with application specific information that is sent back with event 'Open Fiori App' and processed by listener {@link SmartDrawing~onOpenFioriApp}
	 * in case user taps on given action.
	 * <br/><br/>
	 * <b>Note:</b> When forming {@link ApplicationContext} object properties we expect Fiori app to store in <i>"callbackContext"</i> property the shell hash for Fiori launchpad
	 * pointing to the application and its view. This information will be used by listener to "Open Fiori App" event inside plugin in order to force Fiori launchpad
	 * open the application to user.
	 * See details of {@link ApplicationContext} for further information about structure of response object that shall be passed to Smart Drawing app from plugin.
	 *
	 * @param {ApplicationContext} appContext - Context describing what object was selected on Smart Drawing so Fiori app can analyse it and decide if it wants to.
	 * @function SmartDrawing~actionNotifier
	 */
	var actionNotifier = function (appContext) {
		sap.Logger.info("SmartDrawing::actionNotifier - Fiori app can execute action [" + JSON.stringify(appContext) + "]", "SmartDrawing");
		return cordova.exec(
			//success
			function () {},
			//error
			function (args) {},
			"SmartDrawing",
			"actionNotifier",
			[appContext]);
	};
	

	/**
	 * This function notifies Smart Drawing plugin about subscribers to 'on check action' event that
	 * shall be always sent back to Smart Drawing (e.g. their action is always visible and do nto require
	 * any checks inside Fiori app).
	 * <br/>
	 * In order to let Fiori app unconditionally subscribe to 'on check action' it is required to
	 * add in app tile configuration for Firoi launchpad following additional navigation properties:
	 * <ul>
	 * <li><b>SMD_imageBase64</b> - Define this property and inside default value provide base64 content or URL to
	 * image that shall be used as icon for app tile inside Smart Drawing app. The URL can be full quialified or
	 * relative URL pointing to Fiori app internal resources.</li>
	 * <li><b>SMD_actionType</b> - So far only value <i>always</i> is supported. This value shall be put as default
	 * value and will tell plugin to subscribe the app to all 'on check action' events automatically.</li>
	 * <li>Checkbox <b>Allow additional user-defined parameters</b> shall be set to 'true' for passing other
	 * parameters to app from plugin during the app call.</li>
	 * </ul>
	 *
	 * <b>Note:</b> other app information like name, subtitle, sematic object and action will be read from tile
	 * configuration and must be maintained there.
	 *
	 * For property configuration see SAP Help (https://help.hana.ondemand.com/cloud_portal/frameset.htm?abb7e8ccfc684f0e975322326981ae62.html).
	 *
	 * @param {Object} smdSubscribers - Object with property names like app subscriber has and app context.
	 * object (type {@link ApplicationContext}) as property value.
	 * @function SmartDrawing~subscribeResponsesOnCheckAction
	 */
	var subscribeResponsesOnCheckAction = function (smdSubscribers) {

		/**
		 * Here is a callback object to have a single callback to fire once all complete or let each have their own callback and fire them
		 * all once all complete.
		 */
		var ChainedRequestsCompleted = (function () {
			var dataArr,
			numRequestToComplete,
			requestsCompleted,
			callBacks;

			return function (options) {
				if (!options) {
					options = {};
				}

				numRequestToComplete = options.numRequest || 0;
				requestsCompleted = options.requestsCompleted || 0;
				callBacks = [];
				dataArr = [];
				var fireCallbacks = function () {
					for (var i = 0; i < callBacks.length; i++) {
						callBacks[i](dataArr);
					}
				};
				if (options.singleCallback) {
					callBacks.push(options.singleCallback);
				}

				this.addCallbackToQueue = function (isComplete, callback) {
					if (isComplete) {
						requestsCompleted++;
					}
					if (callback) {
						callBacks.push(callback);
					}
					if (requestsCompleted === numRequestToComplete) {
						fireCallbacks();
					}
				};
				this.requestComplete = function (isComplete, data) {
					if (isComplete) {
						requestsCompleted++;
						dataArr.push(data);
					}
					if (requestsCompleted === numRequestToComplete) {
						fireCallbacks(dataArr);
					}
				};
				this.setCallback = function (callback) {
					callBacks.push(callback);
				};
			};
		})();

		/**
		 * convertImgToBase64
		 * @ param  {String}   hash - application hash
		 * @ param  {String}   url
		 * @ param  {Function} callback
		 * @ param  {String}   [outputFormat='image/png']
		 */
		var convertImgToBase64 = function (hash, url, callback, outputFormat) {

			var img = new Image();
			//img.crossOrigin = 'Anonymous';
			img.onload = function () {
				var canvas = document.createElement('CANVAS');
				var ctx = canvas.getContext('2d');
				canvas.height = this.height;
				canvas.width = this.width;
				ctx.drawImage(this, 0, 0);
				var dataURL = canvas.toDataURL(outputFormat || 'image/png');
				//to remove the 'data:image/jpg;base64,FFFF...' later from using the toDataURL()
				//function (or PNG version data:image/png;base64,') and have only the raw base4 data string,
				//split the result string at the comma and take the second half
				callback(hash, dataURL.split(',')[1]);
				canvas = null;
			};
			img.onerror = function () {
				//return empty string
				callback(hash, "");
			};

			// Always use absolute paths relative to our own component
			// (relative paths might fail if running in the Fiori Launchpad)
			if (url.indexOf("http") > -1) {
				//expect full qualified URL
				img.src = url;
			} else {
				//expect relative url
				img.src = url;
			};
		};

		//check if we need to load any images and howmany of them
		var imgToLoad = 0;
		for (var key in smdSubscribers) {
			if (smdSubscribers[key].imageUrl) {
				imgToLoad = imgToLoad + 1;
			}
		};

		//If some app images shall be first loaded and converted to base64 proceed with convertion before
		//storing the data
		if (imgToLoad > 0) {
			//load some images first and than let plugin know about subscription

			// initialize here
			var requestCallback = new ChainedRequestsCompleted({
					numRequest : imgToLoad,
					singleCallback : (function (smdSubscribers) {
						return function (dataArr) {

							//process data array and copy base64 content
							for (var i = 0; i < dataArr.length; i++) {
								if (smdSubscribers && smdSubscribers[dataArr[i].hash] && dataArr[i].base64) {
									smdSubscribers[dataArr[i].hash].imageBase64 = dataArr[i].base64;
								}
							}

							//process results and let plugin know about subscription
							var actions = [];
							for (key in smdSubscribers) {
								actions.push(smdSubscribers[key]);
							}

							//cordova call
							cordova.exec(
								function (args) {},
								function (args) {},
								"SmartDrawing",
								"subscribeResponsesOnCheckAction",
								actions);

						}
					})(smdSubscribers)
				});

			for (var key2 in smdSubscribers) {
				if (smdSubscribers[key2].imageUrl) {
					convertImgToBase64(key2, smdSubscribers[key2].imageUrl,
						function (hash, base64Img) {

						requestCallback.requestComplete(true, {
							hash : hash,
							base64 : base64Img
						});
					});
				}
			};

		} else {
			//let plugin know about subscription

			var actions = [];
			for (key in smdSubscribers) {
				actions.push(smdSubscribers[key]);
			}

			//cordova call
			cordova.exec(
				function (args) {},
				function (args) {},
				"SmartDrawing",
				"subscribeResponsesOnCheckAction",
				actions);

		};

	};

	/**
	 * This is internal event listener that is used by Smart Drawing plugin to receive actions from Smart Drawing app
	 * re-route/run corresponding app in Fiori. The listener is registered at the moment when plugin initializes (see {@link SmartDrawing~onDeviceReady}) and is active as long as Fiori app is working.
	 * In most cases it is not needed to redefine it as all required work is already done for user.
	 *
	 * <ol>
	 * The execution flow is like following:
	 *
	 * <li>Inside Smart Drawing app, when some equipment is selected and informational panel is shown user taps on some action proposed from Fiori app.</li>
	 *
	 * <li>Smart Drawing app triggers Android intent to Fiori Client app providing the {@link FioriAppContext} information.</li>
	 *
	 * <li>Callback {@link callbackOpenFioriApp} registered by plugin with {@link  SmartDrawing~onOpenFioriApp} is called with  {@link FioriAppContext}.</li>
	 *
	 * <li>Inside callback plugins adds a new hash entry in Fiori sap.ushell.Container.servces.ShellNavigation.hashChanger in order to mark the
	 * moment when user entered the Firoi client.</li>
	 *
	 * <li>Plugin calls sap.ushell.servces.CrossApplicationNavigation in order to havigate to hash passed in {@link FioriAppContext}.</li>
	 *
	 * <li>User works inside Fiori app, open some views, drill down to details or change to another objects.</li>
	 *
	 * <li>At same point of time user wants to return back to Smart Drawing app and uses Fiori 'back' buttons or Android 'back' button to return from Fiori app (and Firoi client) to Smart Drawing.</li>
	 *
	 * <li>The hash filter function registerd with {@link SmartDrawing~subscribeFioriReady} identifies that Fiori reached in history the hash with flag plugin added at p.4 and calls plugin function
	 * {@link SmartDrawing~returnToSmartDrawingApp}.</li>
	 *
	 * <li>{@link SmartDrawing~returnToSmartDrawingApp} triggers Android native fucntionality to hide Fiori Client app and put in front the Smart Drawing app.</li>
	 *
	 *</ol>
	 *
	 * @param {callbackOpenFioriApp} callback - Callback function with results of check. See description of the {@link callbackOpenFioriApp} function for parameter details
	 * @param {callbackFail} fail - Callback function called in case of failure in Smart Drawing app or plugin during subscription to event.
	 * @function SmartDrawing~onOpenFioriApp
	 */
	var onOpenFioriApp = function (callback, fail) {
		return cordova.exec(
			function (args) {
			callback(args);
		},
			function (args) {
			fail(args);
		},
			"SmartDrawing",
			"onOpenFioriApp",
			[]);
	};
	/**
	 * This callback is displayed as part of the SmartDrawing class and describes the event listener that receives notification from Smart Drawing plugin
	 * about call to some of the Fiori apps. See below description of properties passed in {@link FioriAppContext} type.
	 *
	 * @param {FioriAppContext} appContext - Context describing which app to call and what parameters to use.
	 * @callback callbackOpenFioriApp
	 */

	/**
	 * This is internal function that is used to change in android from Fiori client back to Smart Drawing app.
	 * When intent from Smart Drawing app to Fiori Client app is initiated inside lisetner {@link SmartDrawing~onOpenFioriApp}
	 * (subscribed in {@link SmartDrawing~onDeviceReady}) plugin will add in history a special url hash part to mark entry
	 * point from Smart Drawing app intent in navigation history. When user pressed 'back' in Fiori client and reached this
	 * hash value plugin will call our function to return from Firoi Client app back to Smart Drawing app insted of traversing
	 * further down in history.
	 * See also description of {@link SmartDrawing~onOpenFioriApp}, checking of the hash part of url is made inside of {@link SmartDrawing~subscribeFioriReady}.
	 * @function SmartDrawing~returnToSmartDrawingApp
	 */
	var returnToSmartDrawingApp = function () {
		return cordova.exec(
			function (args) {},
			function (args) {},
			"SmartDrawing",
			"returnToSmartDrawingApp",
			[]);
	};

	/**
	 * This is internal function subscribes to hash processing finter inside of sap.ushell.Container.servces.ShellNavigation
	 * and checks if by traversing the history we are getting to the url with hash part with label that it was inserted during
	 * Smart Drawing app intent call to Firoi client. If this situation occur plugin will redirect Firoi client ot home page and
	 * trigger Android to put Smart Drawing app in front of user as from the user perspective this is a natural screen flow.
	 * See also description of {@link SmartDrawing~onOpenFioriApp} for execution flow and further information.
	 * @function SmartDrawing~subscribeFioriReady
	 */
	var subscribeFioriReady = function () {

		if (sap.ushell && sap.ushell.Container && sap.ushell.Container.getService && sap.ushell.Container.getService("ShellNavigation")) {

			sap.Logger.info("SAPUI5 is ready - subscribe to Fiori specific stuff", "SmartDrawing");

			//1. subscribe to hash changed events
			hasher.changed.add(function (newHash, oldHash) {
				sap.Logger.info("CHANGE hash values - from: " + oldHash + ", to: " + newHash, "SmartDrawing");

				if ((oldHash.indexOf(INTENT_HASH_LABEL) > -1) && (appOldHash === newHash)) {
					//history back triggered from the screen started by SMD INTENT call -> return back to Smart Drawing
					sap.Logger.info("BACK identified to screen before SMD intent was called - from: " + oldHash + ", to: " + newHash, "SmartDrawing");

					//do async call, so Fiori launchpad has time to revert to previous screen
					//setTimeout(function () {

                        /*
						//back in History one more time
						var fgetService = sap.ushell && sap.ushell.Container && sap.ushell.Container.getService;
						var oCrossAppNavigator = fgetService && fgetService("CrossApplicationNavigation");

						oCrossAppNavigator.historyBack();
                        */


						appIntentHash = "";
                        appOldHash = "";

						returnToSmartDrawingApp();

					//}, 0);

				}

			}, that); //parse hash changes


			//2. subscribe to onOpenFioriApp event, so we can open Fiori tile from within
			//launchpad
			onOpenFioriApp(
				//result
				function (urlHashPart) {
				// When sending the information about action to smart drawing from Firoi apps we expect apps to send to
				// Smart Drawing also their Fiori Lounchpad shell hash part inside of callContext property of
				// the ApplicationContext object. Here we will receive this shall hash part back, so we tell
				// Fiori launchpad to switch to corresponding application/view


				sap.Logger.info("SmartDrawing::onOpenFioriApp= [" + urlHashPart + "]", 'SmartDrawing');

				var fgetService = sap.ushell && sap.ushell.Container && sap.ushell.Container.getService;
				var oCrossAppNavigator = fgetService && fgetService("CrossApplicationNavigation");

				//support hashes like:
				//	 "#myworkorders-view&/EquipmentDetails//EquipmentSet(Orderid='820265',Equipmentid='10073018')"
				//	 "#myworkorders-view&/MaintenanceOrderSet('820266')"


				//Since user might want to get back from Firoi app to smart drawing we need to catch the moment
				// when user navigates back in history to the time when he 'arrived' to fiori client app from
				// smart drawing app. In order to do this we put in history stach additional hash with our parameter inside:
				//We add 'KEELSMARTDRAWINGINTENT' to called hash and will look for this string monitoring hash changes,
				// so we know navigation to here happened from Smart Drawing intent and as soon as we will get back from
				// history to this point we know we have to return back to Smart Drawing app

				var navHash = "";
				appOldHash = hasher.getHash();





				//unparse has part :
				var oHash = sap.ushell.Container.getService("URLParsing").parseShellHash(urlHashPart);
				//add own parameter to mark that we enter the app from Smart Drawing intent
				oHash.params[INTENT_HASH_LABEL] = [""];
				navHash = sap.ushell.Container.getService("URLParsing").constructShellHash(oHash);

				//trigger ushell navigation to has with our param - this will make entry in history, so we know from this point we
				//need to return back
				oCrossAppNavigator.toExternal({
					target : {
						shellHash : navHash
					}
				});

//				//since app might have its own logic - now skip this namvigation and nvigate to url as it was passed - this will make sure we do not
//				//break app logic if it uses params for something inside
//				oCrossAppNavigator.toExternal({
//					target : {
//						shellHash : urlHashPart
//					}
//				});

				//store this pair of hashes locally so we can identify navigation 'back' action when monotiring hashes
				//in subscribeFioriReady() function
				sap.Logger.info("STORE hash values when SMD INTENT was called - from: " + appOldHash + ", to: " + navHash, "SmartDrawing");

				appIntentHash = navHash;

			},
				//failure
				function (err) {
				sap.Logger.error("SmartDrawing plugin call for onOpenFioriApp failed " + err, 'SmartDrawing');
			});

			//3. check the Fiori Launchpad if we have any Firoi apps that want directly subscribe to any Smart Drawing calls:
			var fgetService = sap.ushell && sap.ushell.Container && sap.ushell.Container.getService;
			var oShell = fgetService && fgetService("LaunchPage");

			oShell.getCatalogs().done((function (aGroups) {

					for (var i = 0; i < aGroups.length; i++) {

						//check if there are any apps attached to 'Smart Drawing Integrated' catalog - they will be always shown
						if  ((aGroups[i].name && aGroups[i].name === FIORI_SMD_CATALOG_LABEL) || (aGroups[i].title && aGroups[i].title === FIORI_SMD_CATALOG_LABEL)){
							//for every tile get parameters, and based on it decide what to do with tile
							var fgetService = sap.ushell && sap.ushell.Container && sap.ushell.Container.getService;
                            var oNav =  fgetService && fgetService("NavTargetResolution");

							var promiseArr = [];
							for (var j = 0; j < aGroups[i].tiles.length; j++) {

								if (aGroups[i].tiles[j].chipData && aGroups[i].tiles[j].chipData.configuration){

									var tileConfiguration = JSON.parse(aGroups[i].tiles[j].chipData.configuration);
									if ( tileConfiguration && tileConfiguration["tileConfiguration"] ) {
										var config = JSON.parse(tileConfiguration["tileConfiguration"])
										if (config.navigation_target_url){

											promiseArr.push(oNav.resolveHashFragment(config.navigation_target_url).then(
													(function(config){
														return function(oObj){
															//return JSON object with app URL & resolved hash URL parameters
															return { configuration : config,
																	 resolveHash : oObj   };
														}
													})(config)
												));
										}
									}
								}
							}

							jQuery.when.apply(jQuery, promiseArr).then(function() {

                                        //iterate over arguments and make sure  we pick all Smart Drawing relevant ones
                                        var smdSubscribers = {};

                                        for (var i = 0;i<arguments.length;i++){
                                        	if (arguments[i].resolveHash && arguments[i].resolveHash.url){
                                        		//get params part
                                        		var params = "";
                                        		if (arguments[i].resolveHash.url.indexOf("?")> -1){
                                        	   		params = arguments[i].resolveHash.url.split("?",2)[1];//take part after ?
                                        	   	} else {
                                        	   		params = arguments[i].resolveHash.url;
                                        	   	}
                                        	   	//split params into pairs
                                        	   	var oParam = JSON.parse('{"' + decodeURI(params).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');

                                        	   	var smdApplication = {}; //see type {@link ApplicationContext}

                                        	   	if (oParam.SMD_actionType){

													//simple validation for supported parameters
													if ( oParam.SMD_actionType !== "always" && oParam.SMD_actionType !== "service")
													{
														sap.Logger.error("SmartDrawing plugin do not support tile action type = " + oParam.SMD_actionType, 'SmartDrawing');
														continue; //ignore unsupported values
													}

                                        	   		//basic tile information
                                        	   		smdApplication.smdActionType = oParam.SMD_actionType;
													smdApplication.name = arguments[i].configuration.display_title_text;
													smdApplication.actionLabel = arguments[i].configuration.display_subtitle_text;
													smdApplication.callbackContext = arguments[i].configuration.navigation_target_url;

													//fill information about base64 icon
													if (oParam.SMD_imageBase64){
														smdApplication.imageBase64 = oParam.SMD_imageBase64;
													}

													//fill information about url to icon
													if (oParam.SMD_imageUrl){
														smdApplication.imageUrl = oParam.SMD_imageUrl;
													}
													/* Future support -> use Fiori icons from font
													else if (configuration.display_icon_url){
														//take url from Fiori
														smdApplication.imageUrl = configuration.display_icon_url;
													}
													*/

													//if no image - use default Keel placeholder
													if (!smdApplication.imageBase64 && !smdApplication.imageUrl){
														//Keel's Fiori icon
														smdApplication.imageBase64 = "iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAACXBIWXMAAAsTAAALEwEAmpwYAABGQWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMwNjcgNzkuMTU3NzQ3LCAyMDE1LzAzLzMwLTIzOjQwOjQyICAgICAgICAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIKICAgICAgICAgICAgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiCiAgICAgICAgICAgIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiCiAgICAgICAgICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIKICAgICAgICAgICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICAgICAgICAgICB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIgogICAgICAgICAgICB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyI+CiAgICAgICAgIDx4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ+eG1wLmRpZDoxREMzNkI2MjY4NURFMTExQkRENkU5QjY0RDAyOTUzQTwveG1wTU06T3JpZ2luYWxEb2N1bWVudElEPgogICAgICAgICA8eG1wTU06RG9jdW1lbnRJRD5hZG9iZTpkb2NpZDpwaG90b3Nob3A6NDdmOGM5OWEtODRhNC0xMWU1LTk4NDUtYTExNzEzMTAxNjJjPC94bXBNTTpEb2N1bWVudElEPgogICAgICAgICA8eG1wTU06SW5zdGFuY2VJRD54bXAuaWlkOmVlN2QxNzYxLTU4MWUtMjk0Yy1hN2E0LWZiNTJmMWY1MDRlZDwveG1wTU06SW5zdGFuY2VJRD4KICAgICAgICAgPHhtcE1NOkRlcml2ZWRGcm9tIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgPHN0UmVmOmluc3RhbmNlSUQ+eG1wLmlpZDphZDcyMTkzMi1iODEyLTAxNGUtOTYzOS0zY2NmNTE4MWM0ZWQ8L3N0UmVmOmluc3RhbmNlSUQ+CiAgICAgICAgICAgIDxzdFJlZjpkb2N1bWVudElEPmFkb2JlOmRvY2lkOnBob3Rvc2hvcDozYWU2NDM5ZS02YjdiLTExZTUtYTA0YS05NjgxZTVmZjk3Mjc8L3N0UmVmOmRvY3VtZW50SUQ+CiAgICAgICAgICAgIDxzdFJlZjpvcmlnaW5hbERvY3VtZW50SUQ+eG1wLmRpZDoxREMzNkI2MjY4NURFMTExQkRENkU5QjY0RDAyOTUzQTwvc3RSZWY6b3JpZ2luYWxEb2N1bWVudElEPgogICAgICAgICA8L3htcE1NOkRlcml2ZWRGcm9tPgogICAgICAgICA8eG1wTU06SGlzdG9yeT4KICAgICAgICAgICAgPHJkZjpTZXE+CiAgICAgICAgICAgICAgIDxyZGY6bGkgcmRmOnBhcnNlVHlwZT0iUmVzb3VyY2UiPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6YWN0aW9uPnNhdmVkPC9zdEV2dDphY3Rpb24+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDppbnN0YW5jZUlEPnhtcC5paWQ6MDYzNmI2ODEtZDUyNy1hMDRhLWJhZWItN2IxOWMzYTVkNTFlPC9zdEV2dDppbnN0YW5jZUlEPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6d2hlbj4yMDE1LTEwLTA1VDE3OjAzOjQxKzAyOjAwPC9zdEV2dDp3aGVuPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6c29mdHdhcmVBZ2VudD5BZG9iZSBQaG90b3Nob3AgQ0MgMjAxNSAoV2luZG93cyk8L3N0RXZ0OnNvZnR3YXJlQWdlbnQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpjaGFuZ2VkPi88L3N0RXZ0OmNoYW5nZWQ+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICAgICA8cmRmOmxpIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmFjdGlvbj5jb252ZXJ0ZWQ8L3N0RXZ0OmFjdGlvbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OnBhcmFtZXRlcnM+ZnJvbSBpbWFnZS9wbmcgdG8gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcDwvc3RFdnQ6cGFyYW1ldGVycz4KICAgICAgICAgICAgICAgPC9yZGY6bGk+CiAgICAgICAgICAgICAgIDxyZGY6bGkgcmRmOnBhcnNlVHlwZT0iUmVzb3VyY2UiPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6YWN0aW9uPmRlcml2ZWQ8L3N0RXZ0OmFjdGlvbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OnBhcmFtZXRlcnM+Y29udmVydGVkIGZyb20gaW1hZ2UvcG5nIHRvIGFwcGxpY2F0aW9uL3ZuZC5hZG9iZS5waG90b3Nob3A8L3N0RXZ0OnBhcmFtZXRlcnM+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICAgICA8cmRmOmxpIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmFjdGlvbj5zYXZlZDwvc3RFdnQ6YWN0aW9uPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6aW5zdGFuY2VJRD54bXAuaWlkOjVhZmRlMzBjLWExMzctNzM0ZS05NWUyLTg2NDRkODA4ZTk2Yjwvc3RFdnQ6aW5zdGFuY2VJRD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OndoZW4+MjAxNS0xMC0wNVQxNzowMzo0MSswMjowMDwvc3RFdnQ6d2hlbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OnNvZnR3YXJlQWdlbnQ+QWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpPC9zdEV2dDpzb2Z0d2FyZUFnZW50PgogICAgICAgICAgICAgICAgICA8c3RFdnQ6Y2hhbmdlZD4vPC9zdEV2dDpjaGFuZ2VkPgogICAgICAgICAgICAgICA8L3JkZjpsaT4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDphY3Rpb24+c2F2ZWQ8L3N0RXZ0OmFjdGlvbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0Omluc3RhbmNlSUQ+eG1wLmlpZDphZDcyMTkzMi1iODEyLTAxNGUtOTYzOS0zY2NmNTE4MWM0ZWQ8L3N0RXZ0Omluc3RhbmNlSUQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDp3aGVuPjIwMTUtMTEtMDZUMTc6MzQ6NTgrMDE6MDA8L3N0RXZ0OndoZW4+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpzb2Z0d2FyZUFnZW50PkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE1IChXaW5kb3dzKTwvc3RFdnQ6c29mdHdhcmVBZ2VudD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmNoYW5nZWQ+Lzwvc3RFdnQ6Y2hhbmdlZD4KICAgICAgICAgICAgICAgPC9yZGY6bGk+CiAgICAgICAgICAgICAgIDxyZGY6bGkgcmRmOnBhcnNlVHlwZT0iUmVzb3VyY2UiPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6YWN0aW9uPmNvbnZlcnRlZDwvc3RFdnQ6YWN0aW9uPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6cGFyYW1ldGVycz5mcm9tIGFwcGxpY2F0aW9uL3ZuZC5hZG9iZS5waG90b3Nob3AgdG8gaW1hZ2UvcG5nPC9zdEV2dDpwYXJhbWV0ZXJzPgogICAgICAgICAgICAgICA8L3JkZjpsaT4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDphY3Rpb24+ZGVyaXZlZDwvc3RFdnQ6YWN0aW9uPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6cGFyYW1ldGVycz5jb252ZXJ0ZWQgZnJvbSBhcHBsaWNhdGlvbi92bmQuYWRvYmUucGhvdG9zaG9wIHRvIGltYWdlL3BuZzwvc3RFdnQ6cGFyYW1ldGVycz4KICAgICAgICAgICAgICAgPC9yZGY6bGk+CiAgICAgICAgICAgICAgIDxyZGY6bGkgcmRmOnBhcnNlVHlwZT0iUmVzb3VyY2UiPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6YWN0aW9uPnNhdmVkPC9zdEV2dDphY3Rpb24+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDppbnN0YW5jZUlEPnhtcC5paWQ6MTNlNTRkMzMtNDkxNi05YTRhLWI2MjctMzVkMmVkODUwOGQzPC9zdEV2dDppbnN0YW5jZUlEPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6d2hlbj4yMDE1LTExLTA2VDE3OjM0OjU4KzAxOjAwPC9zdEV2dDp3aGVuPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6c29mdHdhcmVBZ2VudD5BZG9iZSBQaG90b3Nob3AgQ0MgMjAxNSAoV2luZG93cyk8L3N0RXZ0OnNvZnR3YXJlQWdlbnQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpjaGFuZ2VkPi88L3N0RXZ0OmNoYW5nZWQ+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICAgICA8cmRmOmxpIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmFjdGlvbj5zYXZlZDwvc3RFdnQ6YWN0aW9uPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6aW5zdGFuY2VJRD54bXAuaWlkOmVlN2QxNzYxLTU4MWUtMjk0Yy1hN2E0LWZiNTJmMWY1MDRlZDwvc3RFdnQ6aW5zdGFuY2VJRD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OndoZW4+MjAxNS0xMS0wNlQxNzozNToyOSswMTowMDwvc3RFdnQ6d2hlbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OnNvZnR3YXJlQWdlbnQ+QWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpPC9zdEV2dDpzb2Z0d2FyZUFnZW50PgogICAgICAgICAgICAgICAgICA8c3RFdnQ6Y2hhbmdlZD4vPC9zdEV2dDpjaGFuZ2VkPgogICAgICAgICAgICAgICA8L3JkZjpsaT4KICAgICAgICAgICAgPC9yZGY6U2VxPgogICAgICAgICA8L3htcE1NOkhpc3Rvcnk+CiAgICAgICAgIDx4bXA6Q3JlYXRvclRvb2w+QWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpPC94bXA6Q3JlYXRvclRvb2w+CiAgICAgICAgIDx4bXA6Q3JlYXRlRGF0ZT4yMDE1LTA5LTI1VDA5OjAxOjQ3KzAyOjAwPC94bXA6Q3JlYXRlRGF0ZT4KICAgICAgICAgPHhtcDpNb2RpZnlEYXRlPjIwMTUtMTEtMDZUMTc6MzU6MjkrMDE6MDA8L3htcDpNb2RpZnlEYXRlPgogICAgICAgICA8eG1wOk1ldGFkYXRhRGF0ZT4yMDE1LTExLTA2VDE3OjM1OjI5KzAxOjAwPC94bXA6TWV0YWRhdGFEYXRlPgogICAgICAgICA8ZGM6Zm9ybWF0PmltYWdlL3BuZzwvZGM6Zm9ybWF0PgogICAgICAgICA8cGhvdG9zaG9wOkNvbG9yTW9kZT4zPC9waG90b3Nob3A6Q29sb3JNb2RlPgogICAgICAgICA8cGhvdG9zaG9wOkRvY3VtZW50QW5jZXN0b3JzPgogICAgICAgICAgICA8cmRmOkJhZz4KICAgICAgICAgICAgICAgPHJkZjpsaT5hZG9iZTpkb2NpZDpwaG90b3Nob3A6M2FlNjQzOWUtNmI3Yi0xMWU1LWEwNGEtOTY4MWU1ZmY5NzI3PC9yZGY6bGk+CiAgICAgICAgICAgICAgIDxyZGY6bGk+eG1wLmRpZDowMzdGN0VBREU3Q0YxMUUzQjM0MDhCRjJEOTA3MTI5MzwvcmRmOmxpPgogICAgICAgICAgICAgICA8cmRmOmxpPnhtcC5kaWQ6MjkxM0YzMDZBRDMyRTQxMUE5ODNGRTA1MjYxNjdDQ0U8L3JkZjpsaT4KICAgICAgICAgICAgPC9yZGY6QmFnPgogICAgICAgICA8L3Bob3Rvc2hvcDpEb2N1bWVudEFuY2VzdG9ycz4KICAgICAgICAgPHRpZmY6T3JpZW50YXRpb24+MTwvdGlmZjpPcmllbnRhdGlvbj4KICAgICAgICAgPHRpZmY6WFJlc29sdXRpb24+NzIwMDAwLzEwMDAwPC90aWZmOlhSZXNvbHV0aW9uPgogICAgICAgICA8dGlmZjpZUmVzb2x1dGlvbj43MjAwMDAvMTAwMDA8L3RpZmY6WVJlc29sdXRpb24+CiAgICAgICAgIDx0aWZmOlJlc29sdXRpb25Vbml0PjI8L3RpZmY6UmVzb2x1dGlvblVuaXQ+CiAgICAgICAgIDxleGlmOkNvbG9yU3BhY2U+NjU1MzU8L2V4aWY6Q29sb3JTcGFjZT4KICAgICAgICAgPGV4aWY6UGl4ZWxYRGltZW5zaW9uPjk2PC9leGlmOlBpeGVsWERpbWVuc2lvbj4KICAgICAgICAgPGV4aWY6UGl4ZWxZRGltZW5zaW9uPjk2PC9leGlmOlBpeGVsWURpbWVuc2lvbj4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAog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";
													}

													//if this is dynamic tile - get a URL to check if Fiori app is applicable for
													// current context - this is made by calling the oData URL with two additional filter parameters objectId and objectType
													// e.g. if dynamic tile url is like "/sap/opu/odata/sap/ZPM_ORDER_SRV/MaintenanceOrderSet/$count" and user taped on equipment
													// with number 11000123 at Smart Drawing, the plugin will initiate an oData request to URL like
													// "/sap/opu/odata/sap/ZPM_ORDER_SRV/MaintenanceOrderSet/$count?filter= objectId eq 111020292 and objectType eq 'EQUI'"
													// if such url will return a non-zero value teh tile will be shown on Smart Drawing info panel
													if (arguments[i].configuration.service_url){
														smdApplication.serviceUrl = arguments[i].configuration.service_url;
													}

													//add to final list
                                                    smdSubscribers[smdApplication.callbackContext] = smdApplication;
                                        	   	}

                                        	}
                                        }

                                        //subscribe Fiori apps in plugin
										if (!jQuery.isEmptyObject(smdSubscribers)) {
											subscribeResponsesOnCheckAction(smdSubscribers);
										};



                            });
                        }
                    }

				}).bind(that));

		} else {
			setTimeout(subscribeFioriReady, 200); //wait 200ms and try again
			return;
		};

	};

	/**
	 * Internal function used to prepare smart drawing plugin to work, is called after plugin Java and JS content is fully loaded.
	 *
	 * @function SmartDrawing~onDeviceReady
	 */
	var onDeviceReady = function () {
		sap.Logger.info('Cordova container initialized, start Smart Drawing pluging initialization', 'SmartDrawing');

		//run async call & wait when UI5 framework is loaded and set up
		subscribeFioriReady();

	};

	window.SmartDrawing = new SmartDrawing();

	//Backwards compatibility
	window.plugins = window.plugins || {};
	window.plugins.SmartDrawing = window.SmartDrawing;

	//Init plugin
	document.addEventListener('deviceready', onDeviceReady);

})(window.PhoneGap || window.Cordova || window.cordova);
