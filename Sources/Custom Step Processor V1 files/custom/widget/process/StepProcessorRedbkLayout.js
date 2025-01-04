define([
"dojo/_base/declare",
"dojo/_base/lang",
"dojo/_base/connect",
"ecm/LoggerMixin",
"ecm/widget/process/_ProcessorMixin",
"ecm/widget/process/StepProcessorLayout",
"dojo/text!./templates/StepProcessorRedbkLayout.html",
"ecm/model/AttachmentItem",
"ecm/model/ContentItem"
], function(declare, lang, connect, LoggerMixin, _ProcessorMixin, 
StepProcessorLayout, template,AttachmentItem,ContentItem) {
	/**
* @name custom.widget.process.StepProcessorRedbkLayout
* @class Provides a custom layout for step processors.
* @augments custom.widget.process.StepProcessorLayout
*/
	return declare("custom.widget.process.StepProcessorRedbkLayout", [
	StepProcessorLayout	
	], {
		/** @lends custom.widget.process.StepProcessorRedbkLayout.prototype */
		// widgetsInTemplate: Boolean
		//  Set this to true if your widget contains other widgets
		widgetsInTemplate: true,
		contentString: template,
		contentContainer: null,
		contentViewer: null,
		// postCreate() is called to override the superclass.
		postCreate: function() {
			this.logEntry("postCreate-custom");
			this.inherited(arguments);
			this.logExit("postCreate-custom");
		},
		// startup() is called to create the create and place the 
		// Content Viewer instance, resize the Content Viewer layout 
		// and override the default Viewer toolbar text.
		startup: function() {
			this.logEntry("startup-custom");
			this.inherited(arguments);
			console.log("Test the logging 1");
			// if an instance of the Content Viewer doesn't exist then create one 
			if (this.contentViewer == null) {
				var bidiDir = "ltr"; // left-to-right for English locale as default.
				
				var language = dojo.locale;
				if ((language.indexOf("ar") === 0) || (language.indexOf("he") === 
							0) || (language.indexOf("iw") === 0)) {
					bidiDir = "rtl"; // Use right-to-left for Arabic locale.
				}
				dojo['require']("ecm.widget.viewer.ContentViewer");
				var tabStyle = "margin: 0px; padding: 0px; width: 100%; height: 100%;";
				// create an instance of the Content Viewer
				this.logDebug("startup-custom", "instantiate CV");
				this.contentViewer = new ecm.widget.viewer.ContentViewer({
				style: tabStyle,
				isEntireWindow: false,
				dir: bidiDir,
				lang: language
				});
				// place the Content Viewer on the step processor page 
				this.logDebug("startup-custom", "place CV in the step processor page");
				this.contentContainer = dojo.byId("contentViewer");
				this.contentContainer.appendChild(this.contentViewer.domNode);
				// resize the Content Viewer layout
				this.logDebug("startup-custom", "resizing the CV layout");
				this.contentViewer.startup();
				// set the text on the Content Viewer toolbar
				this.logDebug("startup-custom", "set the text on the CV toolbar");
				this.contentViewer.viewerToolbarText.innerHTML = "Viewer";
					console.log("Step Content Pane ",this.stepContentPane);
				// ????????????????????????//////     detect splitter movement and resize container   comment 
				this.connect(this.stepContentPane._splitterWidget.domNode,"onmouseup", function() {
					if (this.contentViewer != null) {
						this.contentViewer._winResizeEnd();
					}
				});
				
				 if ( attachments[i].isInstanceOf(ecm.model.AttachmentItem) ) {
				attachments[i].retrieveAttachmentContents(false, false, function(results) {
					var attachmentContents = [].concat(results.getItems());
 
				if ( attachmentContents.length > 0 )
						{
				this.contentViewer.open(attachmentContents[0]);
					}
				// Add this to force a resize
				this.contentViewer.viewerEditContainer.onLoaded();
				});
             } 
			}
			this.logExit("startup-custom");
		},
	});
});

