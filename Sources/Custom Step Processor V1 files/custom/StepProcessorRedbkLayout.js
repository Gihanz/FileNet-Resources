define([
"dojo/_base/declare",
"dojo/_base/lang",
"dojo/_base/connect",
"ecm/LoggerMixin",
"ecm/widget/process/_ProcessorMixin",
"ecm/widget/process/StepProcessorLayout",
"dojo/text!./templates/StepProcessorRedbkLayout.html",
"ecm/model/AttachmentItem",
"ecm/model/ContentItem",
"ecm/model/WorkItem",
"ecm/model/WorkItemProcessor"
], function(declare, lang, connect, LoggerMixin, _ProcessorMixin, 
StepProcessorLayout, template,AttachmentItem,ContentItem,WorkItem, WorkItemProcessor) {
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
				
			/*	 if ( attachments[i].isInstanceOf(ecm.model.AttachmentItem) ) {
				attachments[i].retrieveAttachmentContents(false, false, function(results) {
					var attachmentContents = [].concat(results.getItems());
 
				if ( attachmentContents.length > 0 )
						{
				this.contentViewer.open(attachmentContents[0]);
					}
				// Add this to force a resize
				this.contentViewer.viewerEditContainer.onLoaded();
				});
}   */
			}
			this.logExit("startup-custom");
		},
		_onOkCompleted: function(response) {
			this.logEntry("_onOkCompleted");
			if (window.opener && this._checkHost()) {
				if (this.processorButtonBar.isGetNextEnabled()) {
					this._closing = false;
					this._loadNextWorkItem(response); // Load next item			
					this._isGetNextEnabled = true;
				} else {
					this._onStepActionCompleted(response); // All done
				}
			} else {
				this._onStepActionCompleted(response); // All done
			}
			this.logExit("_onOkCompleted");
		},
	  _loadNextWorkItem: function(response) {
	   //  alert("new ok completed");
	   console.log("NeResponcse",response);
		console.log("Next work Item _workItem ",this._workItem);
			this.logEntry("_loadNextWorkItem");
		
			var title =this._getTitle(this._workItem);
			//var currentwindow =window;
			var currentwindow = window.opener.ecm.widget.dialog.stepProcessorWindow._openStepWindows[title];
		console.log("currentwindow ",currentwindow);
			var currentwindow2 =parent.window.opener.ecm.widget.dialog.stepProcessorWindow._openStepWindows[title];
			console.log("parent window ",currentwindow2);
		//var currentwindow2 = window.ecm.widget.dialog.stepProcessorWindow._openStepWindows[title];
		//console.log("currentwindow2 ",currentwindow2);
			var currentItem = parent.window.opener.ecm.widget.dialog.stepProcessorWindow.getCurrentItem(this._workItem);
			console.log("currentItem ",currentItem);
			//var currentItem= this._workItem;
			this.workItemProcessor = new WorkItemProcessor(currentItem);
			console.log("workItemProcessor ",this.workItemProcessor);
			//this.workItemProcessor.getPreviousItem(lang.hitch(this, function(item) {
			//console.log("previous item ",item);
			//}));

			this.workItemProcessor.getNextItem(lang.hitch(this, function(item) {
			console.log("nextitem ",item);
				if (item) {
					if (this._isSameApplication(currentItem, item)) {
						this.viewTabContainer.selectChild(this.propertiesContainer);
						var repository = ecm.model.desktop.getRepository(item.repository.id); // Using repository from the step processor desktop
						this._loadWorkItem(repository, item["wobNum"], item["queueName"], lang.hitch(this, function() {
							window.opener.ecm.widget.dialog.stepProcessorWindow.onStepProcessorNewItemLoaded(currentItem, item);
						}));
					} else { // Need to redirect to the new step processor
						this.logDebug("_loadNextWorkItem", "Open work item using external step processor.");
						connect.disconnect(this._messageAddedHandler);
						this._statusDialog.show();
						window.opener.ecm.widget.dialog.stepProcessorWindow._openNextWorkItemUsingExternalProcessor(currentItem, item);
					}
				} else { // no more item
					if (this._onHideNoMoreItemsMessageDialog) {
						this.disconnect(this._onHideNoMoreItemsMessageDialog);
					}
					if (this._messageDialog) {
						this._messageDialog.destroyRecursive();
					}
					this._messageDialog = new ecm.widget.dialog.MessageDialog({
						text: this._messages.process_no_more_items
					});
					this._onHideNoMoreItemsMessageDialog = this.connect(this._messageDialog, "onHide", function() {
						this._onStepActionCompleted(response);
					});
					this._messageDialog.show();
				}
			}));

			this.logExit("_loadNextWorkItem");
		},
		_getTitle: function(item) {
			var id = item.id;
			var queueName = item.queueName;
			var prefix;
			if (queueName) {
				if (queueName == "Tracker") {
					prefix = "tracker_";
				} else {
					prefix = "step_";
				}
			} else {
				prefix = "launch_";
				id = item.F_VWVersion;
				if (id == null) {
					id = item.workflowVersion; // Will be same value as vwVersion
				}
				if (id == null) {
					id = item.id;
				}
			}

			if (id == null) {
				id = item.vsId;
			}
			var title = prefix + id.replace(/[{,\-,},~,\t,\/]/g, ""); // Remove some characters that can not be in window title
			this.logInfo("_getTitle", "title = " + title);
			return title;
		},
	});
});

