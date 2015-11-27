# Fiori Smart Drawing collaboration plugin

The [SMART Drawings application](http://keelsolution.com/smart-drawings/) from Keel allows you to click directly on objects on a drawing, thereby activating a visual image of the equipment, including technical data such as specifications or maintenance data. The SMART Drawings application provides a more intuitive and visual way to search for information. It is designed to make it easier for SAP users to view and manage technical data as graphical content. With the software, you can search, browse through, view and manage your technical asset data directly from a drawing. It facilitates work processes in engineering and maintenance by using an interactive graphical format.

<img alt="Example of Fiori app showing its inspection progress and information about particular equipment inside Smart drawing app" width="600" src="img/Smart_Drawing_action%20items.png"  title="Example of Fiori app showing its inspection progress and information about particular equipment inside Smart drawing app">

Smart Drawing can collaborate with other apps to do a task and to achieve shared goals. It can be used in recursive processes where two or more apps work together to achieve common goal — for example check status of work orders on drawing, visualize inspection results or progress by sharing information about equipment on arrangement drawing.
Collaboration between another applications and Smart Drawing app can be achieved using deep links or using an SDK provided by Keel. The deep link integration allows user to call Smart Drawing directly from another application without integrating any SDK. This increases greater flexibility by allowing user use it like a normal hyperlinks in web pages, emails or documents but has limited functionality as it commands to Smart Drawing app to open some drawing or show some object on drawing without checking if the given drawing/object exist, was cached and is generally known by the app.

Collaboration that utilizes SDK allows apps perform much closer data exchange between Smart Drawing and collaborator app - examples of such collaboration can be seen in Keel's Inspector App and Data Collection App to simplify for end user the process if identification of equipment, data collection and monitoring progress of data collection process.

As well there are integration plugin written for SAP Fiori client that is discussed below and lets Fiori apps communicate with Smart Drawing app very closely allowing them to show objects on drawings, generate dashboards of check information and subscribe to action calls from Smart Drawing app. More detailed description of collaboration patterns and some examples can be seen in [Keel documentation](https://wiki.keelsolution.com/pages/viewpage.action?pageId=46204053#)

## Basic usage of Smart Drawing plugin

After Smart Drawing plugin is integrated in Firoi Client every Fiori app can have access to it. [API document](http://keelsolution.github.io/com.keel.smartdrawing.fiori/SmartDrawing.html) describes in details how to perform calls to Smart Drawing app from Fiori app, the most typical examples are given below:

* Fiori app can check if an object (equipment, location) can be shown at any kind of drawings. See example below on how check if particular equipment can be shown on drawing:
```javascript
	var sEquipmentId = view.getBindingContext().getProperty("Equipmentid");
	if (window.plugins && window.plugins.SmartDrawing) {

		window.plugins.SmartDrawing.canShowEquipment(sEquipmentId,
			//result
			function(result) {

				var drawingsArr = JSON.parse(result);

					for (var i = 0, len = drawingsArr.length; i<len; i++){
						var drawing = drawingsArr[i];
						var oButton = new sap.m.Button({
							text : "Open " + drawing.drawingName,
							icon : "images/SD_logo_black_48.png",
							width : "100%",
							press : showSmartDrawing(drawing.drawingId);
						});
						view.byId("smartDrawingButtons").addContent(oButton);
					}
			},
			//failure
			function(err) {
				MessageToast.show("SmartDrawing plugin call failed " + err);
			});
	}
```	

* Fiori app can call a Smart Drawing app to show some object on drawing (equipment or location), center on it and show custom context information about object shown
```javascript	
	var sEquipmentId = this.getView().getBindingContext().getProperty("Equipmentid");

	//prepare JSON data
	var equipment = {
		equipmentId: sEquipmentId,
		color: "#ff0000",
		status: "Active",
		info: [{"name":"My Property", "value":"My Value"}]
	};

	//call Smart Drawing plugin to show equipment and center on it
	if (window.plugins && window.plugins.SmartDrawing) {
		window.plugins.SmartDrawing.showEquipment("Equipment from Fiori", equipment
			//failure
			function(err) {
				MessageToast.show("SmartDrawing plugin call failed " + err);
			});
	}
```  

* Fiori app can call a Smart Drawing app as dashboard and color objects on drawing in different colors based on their statuses in Fiori app
```javascript	
	var sEquipmentId = this.getView().getBindingContext().getProperty("Equipmentid");
	var sDrawingId = this.getView().getBindingContext().getProperty("Drawingid");

	//prepare JSON data
	var equipment = {
		equipmentId: sEquipmentId,
		color: "#ff0000",
		status: "Active",
		info: [{"name":"My Property", "value":"My Value"}]
	};

	var equipmentArr = [];
	equipmentArr.push(equipment);

	//call Smart Drawing plugin
	if (window.plugins && window.plugins.SmartDrawing) {
		window.plugins.SmartDrawing.showData("Equipment status from Fiori", sDrawingId, equipmentArr,
			//failure
			function(err) {
				MessageToast.show("SmartDrawing plugin call failed " + err);
			});
	}
```  

* Fiori app can subscribe to event that user selected some object on drawing and propose custom action on this object
```javascript	
	//Subscribe for events from Smart Drawing to test if particular equipment id is known and will be handled
	// by Fiori app in Component.js init() method. Do not forget to unsubscribe from it in exit() method.

	// ... somewhere in init():
	if (window.plugins && window.plugins.SmartDrawing) {
		var appId = this.getMetadata().getManifest()["sap.app"].id;
		
		window.plugins.SmartDrawing.onCheckObjectAction(appId, function(callContext, actionNotifier){
			
			//at the moment send back the subscription immediatelly without checking the model/server
			if ((callContext) && (callContext.equipmentId)) {
				
				//Obtain cross app navigation interface
				var fgetService =  sap.ushell && sap.ushell.Container && sap.ushell.Container.getService;
				var oCrossAppNavigator = fgetService && fgetService("CrossApplicationNavigation");
				
				var appContext = {
					"equipmentId"	: callContext.equipmentId,
					"name" : "My work order app",
					"actionLabel" : "Call directly app",	
					//keel fiori icon
					"imageBase64" : "iVBORw0KGgoAAAANSUhEUgA...",  //replace with your image in base64 encoding
					"callbackContext" : oCrossAppNavigator.hrefForAppSpecificHash("SMD_call") 
				};
				
				actionNotifier(appContext);
			}
			
		});
		
	}	

	// ...somewhere in exit():
	//remove listener for onCheckObjectAction
	if (window.plugins && window.plugins.SmartDrawing) {
		var appId = this.getMetadata().getManifest()["sap.app"].id;
		
		window.plugins.SmartDrawing.removeOnCheckObjectAction(appId);
	}
```

* Fiori app can register to be called automatically to check every action in Smart Drawing directly from SAP Fiori launchpad setup - for details see [configuration steps here](https://wiki.keelsolution.com/display/SMD/SAP+Fiori+Launchpad+configuration+for+default+action+subscription+in+Smart+Drawing+app). 

# Plugin integration

## SAP Fiori Client

The SAP Fiori Client is a native mobile application runtime container for SAP Fiori built using Kapsel plugins. The SAP Fiori Client provides access to native device functionality via plugins such as the ability to scan a barcode, take a picture, access the calendar, print or take a voice recording as well as providing the ability to use enterprise services of the SMP server. 

For additional details see [SAP Fiori Client](http://help.sap.com/fiori-client), [SAP Fiori Client in Getting Started with Kapsel](http://scn.sap.com/docs/DOC-56080) or [SAP Fiori Client in SAP Mobile Platform](http://help.sap.com/saphelp_smp309sdk/helpdata/en/b2/99923cc0b94400acab320c812cc026/content.htm)

## Preparation

The SAP Fiori Client script supports the Android and iOS operating systems, note that current version of Smart Drawing plugin only supports *Android* version.

In order to create the SAP Fiori Client application, you will need access to a properly configured Cordova development environment.
For the Android version of the application, the environment should include an installation of the latest compatible version of the Android Developer Tools (ADT).

With the platform SDKs installed, you will also need a functional Cordova development environment. To install a Cordova development, perform the following steps:
1.	Install Git (http://git-scm.com/)

2.	Install node.js (http://nodejs.org/)

3.	Install Apache Cordova, the command will differ depending on whether the development environment is running Windows or Macintosh OS X. On Windows, open a terminal window and issue the following command:

	```npm install -g cordova@5.1.1```
	
4. Finally, install the SMP SDK using the installation settings appropriate for your environment (since you're reading this document, it's assumed this step has already been completed).
Creation of the SAP Fiori client is explained well in SAP documentation links provided above or you can refer to Keel documentation article [Building SAP Fiori Client with Smart Drawing app integration](https://wiki.keelsolution.com/display/SMD/DEVELOPMENT%3A+Building+SAP+Fiori+Client+with+Smart+Drawing+app+integration)



## Adding Smart Drawing plugin

1.	Open folder with your custom Fiori Client project from command line

2.	Add Smart Drawing Fiori plugin from GitHub running following in command line - this will get latest stable version of plugin from GitHub

	```cordova plugin add https://github.com/KeelSolution/com.keel.smartdrawing.fiori.git```

3.	Copy the files to the platform directory by running
	
	```cordova prepare```
	
4.	Some versions of cordova does not apply preferences during prepare phase so check manually if launch mode in Android manifest was set to "singleTask". In order to do it open file under the path <fiori client project>\platforms\android\AndroidManifest.xml in any XML or text editor and search for activity named "MainActivity" here check if launch mode attribute has following value:

	  ```
	  android:launchMode="singleTask"
	  ```
	  
5.	Use Android Studio or ADT command line to deploy and run the project. Or run following command from console to build project using cordova command line:
     
    ```
	cordova platform update android
	cordova build android
    ```

