/**
 * Licensed Materials - Property of IBM (c) Copyright IBM Corp. 2012 All Rights Reserved.
 * 
 * US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP Schedule Contract with
 * IBM Corp.
 * 
 * DISCLAIMER OF WARRANTIES :
 * 
 * Permission is granted to copy and modify this Sample code, and to distribute modified versions provided that both the
 * copyright notice, and this permission notice and warranty disclaimer appear in all copies and modified versions.
 * 
 * THIS SAMPLE CODE IS LICENSED TO YOU AS-IS. IBM AND ITS SUPPLIERS AND LICENSORS DISCLAIM ALL WARRANTIES, EITHER
 * EXPRESS OR IMPLIED, IN SUCH SAMPLE CODE, INCLUDING THE WARRANTY OF NON-INFRINGEMENT AND THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE. IN NO EVENT WILL IBM OR ITS LICENSORS OR SUPPLIERS BE LIABLE FOR
 * ANY DAMAGES ARISING OUT OF THE USE OF OR INABILITY TO USE THE SAMPLE CODE, DISTRIBUTION OF THE SAMPLE CODE, OR
 * COMBINATION OF THE SAMPLE CODE WITH ANY OTHER CODE. IN NO EVENT SHALL IBM OR ITS LICENSORS AND SUPPLIERS BE LIABLE
 * FOR ANY LOST REVENUE, LOST PROFITS OR DATA, OR FOR DIRECT, INDIRECT, SPECIAL, CONSEQUENTIAL, INCIDENTAL OR PUNITIVE
 * DAMAGES, HOWEVER CAUSED AND REGARDLESS OF THE THEORY OF LIABILITY, EVEN IF IBM OR ITS LICENSORS OR SUPPLIERS HAVE
 * BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
 */
define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/connect",
	"ecm/LoggerMixin",
	"ecm/widget/process/_ProcessorMixin",
	"ecm/widget/process/StepProcessorLayout",
	"ecm/custom/widget/process/WorkItemAttachmentsPane",
	"dojo/text!./templates/CustomStepProcessorLayout.html",
	"idx/html",
	"dojo/dom-style",
	"dojo/dom-class",
	"ecm/model/Request"

],
function(declare, lang, connect, LoggerMixin, _ProcessorMixin, StepProcessorLayout,WorkItemAttachmentsPane, template,idxHtml, domStyle, domClass,request) {

	/**
	 * @name ecm.custom.widget.process.CustomStepProcessorLayout
	 * @class Provides a custom layout for step processors.
	 * @augments ecm.widget.process.StepProcessorLayout
	 */

	var tth =null;
	 var count = 0;
	return declare("ecm.custom.widget.process.CustomStepProcessorLayout", [
		StepProcessorLayout			
	], {
		/** @lends ecm.custom.widget.process.CustomStepProcessorLayout.prototype */

		// widgetsInTemplate: Boolean
		// 		Set this to true if your widget contains other widgets
		widgetsInTemplate: true,
		contentString: template,
		contentContainer: null,    
		contentViewer: null,
		  
		
		
		// postCreate() is called to override the superclass.
		postCreate: function() {
			this.logEntry("postCreate");
			this.inherited(arguments);

			this.connect(this.workItemPropertiesPane, "onCompleteRendering", "onCompleteRendering");
			this.connect(this.workItemPropertiesPane, "onChange", "_onChangeProperties");
		    this.connect(this.workItemPropertiesPane, "onChange", "_onChangeProperties");
			// Connect to tab container select events.
			//this._connectTabContainer();

			if (this._checkHost()) {
				this._isGetNextEnabled = this._getRequestParam("isGetNextEnabled") ? this._getRequestParam("isGetNextEnabled") == "true" : false;
				this.processorButtonBar.showGetNextCheckBox(this._isGetNextEnabled);
			}
			this.processorButtonBar.showSaveButton();
			this.saveButton = this.processorButtonBar.saveButton;
			
			this.logExit("postCreate");
		},

			_loadNextWorkItem: function(response) {
			this.logEntry("_loadNextWorkItem");
			var currentItem = window.opener.ecm.widget.dialog.stepProcessorWindow.getCurrentItem(this._workItem);
			this.workItemProcessor = new WorkItemProcessor(currentItem);
			this.workItemProcessor.getNextItem(lang.hitch(this, function(item) {
				if (item) {
					if (this._isSameApplication(currentItem, item)) {
						//this.viewTabContainer.selectChild(this.propertiesContainer);
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

			updateView: function() {
			this.logEntry("updateView");
			this._setWindowTitle();

			// Check to see if we need both Attachments and History tabs, remove them if not
			if (this.hasAttachment()) {
				/**if (this.viewTabContainer.getIndexOfChild(this.attachmentsContainer) == -1) {
					this.viewTabContainer.addChild(this.attachmentsContainer);
				}*/
				this.workItemAttachmentsPane.setItem(this._workItem);
			} else {
				/**if (this.viewTabContainer.getIndexOfChild(this.attachmentsContainer) != -1) {
					this.viewTabContainer.removeChild(this.attachmentsContainer);
				}*/
			}

			if (this._workItem.can_view_history) {
				/**if (this.viewTabContainer.getIndexOfChild(this.historyContainer) == -1) {
					this.viewTabContainer.addChild(this.historyContainer);
				}*/
				
				this.workItemHistoryPane.setItem(this._workItem);
				this.workItemHistoryPane.render();
			} else {
				/**if (this.viewTabContainer.getIndexOfChild(this.historyContainer) != -1) {
					this.viewTabContainer.removeChild(this.historyContainer);
				}*/
			}

			this.subjectText.innerHTML = idxHtml.escapeHTML(this._workItem.getValue("F_Subject"));
			this.deadline.innerHTML = this._workItem.getDisplayValue("F_Deadline");
		this.launchedby.innerHTML = idxHtml.escapeHTML(this._workItem.getDisplayValue("F_Originator"));
			this.receivedOn.innerHTML = this._workItem.getDisplayValue("F_StepReceived");
		this.stepName.innerHTML = idxHtml.escapeHTML(this._workItem.getValue("F_StepName"));

			var instructions = this._workItem.getValue("F_Instructions");
			if (instructions) {
				this.instructionsText.set('value', instructions);
			} else {
				domStyle.set(this.showInstructions.domNode, "display", "none");
				domStyle.set(this.instructionsText.domNode, "display", "none");
				this._resizeIt();
			}

			// Remove all buttons
			this.processorButtonBar.removeAll();
			this.addProcessButtons();
			this.connect(this, "_onProcessButtonsCreated", function() {
				this.workItemPropertiesPane.setItem(this._workItem);

				// Fix visibility problem with first tab contents after dojo 1.7 upgrade
				domClass.remove(this.propertiesContainer.domNode, "dijitHidden");
				domClass.add(this.propertiesContainer.domNode, "dijitVisible");

				if (this.workItemPropertiesPane.resizeIt) {
					this.workItemPropertiesPane.resizeIt();
				}
			});

			this.logExit("updateView");
		},
	
		isValid: function(focus, onEditStatus, onSaveStatus) {
			var errorField = this.workItemPropertiesPane.validate(focus, onEditStatus, onSaveStatus);
			if (errorField) {
				//this.viewTabContainer.selectChild(this.propertiesContainer);
				return false;
			} else {
				return true;
			}
		},


		// startup() is called to create the create and place the Content Viewer instance, resize the Content Viewer layout and override the default Viewer toolbar text.
		startup: function()  {

			this.logEntry("startup-custom");
			this.inherited(arguments);

			this.connect(this, "_onProcessButtonsCreated", function() {
				this.workItemPropertiesPane.setItem(this._workItem);

				//this.additionalWorkItemPropertiesPane.setItem(this._workItem);

				// Fix visibility problem with first tab contents after dojo 1.7 upgrade
				domClass.remove(this.propertiesContainer.domNode, "dijitHidden");
				domClass.add(this.propertiesContainer.domNode, "dijitVisible");

				if (this.workItemPropertiesPane.resizeIt) {
					this.workItemPropertiesPane.resizeIt();
				}
			});
			//this.additionalWorkItemPropertiesPane.setItem(this._workItem);

			// if an instance of the Content Viewer doesn't exist then create one 
			if (this.contentViewer == null)
			{
				var bidiDir = "ltr";                      // left-to-right for English locale as default.
				var language = dojo.locale;
				if ((language.indexOf("ar") === 0) || (language.indexOf("he") === 0) || (language.indexOf("iw") === 0)) 
				{
					bidiDir = "rtl";                      // Use right-to-left for Arabic locale.
				}
				
				dojo['require']("ecm.widget.viewer.ContentViewer");
				
				var tabStyle = "margin: 0px; padding: 0px; width: 100%; height: 100%;";

				// create an instance of the Content Viewer	
				
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
			//	this.contentViewer.open(items[0]);
               
			//	this.contentViewer._open(item[0], openInBackground, false)
				this.contentViewer.startup();				
				
				// set the text on the Content Viewer toolbar
				this.logDebug("startup-custom", "set the text on the CV toolbar");
				this.contentViewer.viewerToolbarText.innerHTML= "Viewer";

				// detect splitter movement and resize container
				this.connect(this.stepContentPane._splitterWidget.domNode, "onmouseup", function() {
					if (this.contentViewer != null)	{
						this.contentViewer._winResizeEnd();
					}				
				});
			}
			
			this.logExit("startup-custom");

         var th = this;
		this.connect(this.workItemPropertiesPane, "onCompleteRendering", "onCompleteRendering");

		},
	
		onCompleteRendering: function(){
			if(count == 0)
			{
			this.workItemPropertiesPane._workItem.retrieveAttachments(this.retrieveAttachments);
			}
			count++;
		},

		retrieveAttachments:function(resultSet)

		{

			var th = this;

			var openItems = function(resultSet)
		{
			
			if(resultSet.items.length > 0)
			{

				var item = resultSet.items[0]; 
				
				th.contentViewer.open(item,false);
			}
		}
			if(resultSet.items.length > 0)
			{

				var item = resultSet.items[0]; 
				item.retrieveAttachmentContents(false,true,openItems);
				
				
			}

		},
		
		_addDocumets:function()
		{
		//Custom Dialog Box
		
		
		//console.log(this._workItem.attributes.CaseID);
					
					//console.log("Sandeep P "+window.location.search);
					//console.log("Abhinav P "+window.location);
					var serviceParams = new Object(); //ADD THIS SATEMENT

					var caseId = this._workItem.attributes.CaseID;
					
		serviceParams.CaseID = caseId;
		serviceParams.Url = window.location.search;
		request.invokePluginService("CustomSPViewPlugin","CustomDialogBox",
				{
			requestParams:serviceParams,
			requestCompleteCallback: function(response) {
			alert(response.response);
			//console.log("ICN PLUGIN :: "+response.response);
			var reloadFlag = null;
			reloadFlag = response.reload;
			alert(reloadFlag);

			if(reloadFlag == "YES")
				{
				window.location.reload(true);
				}else
				{
					window.location.reload(false);
				}
		}
		});
					
		}
		
		
	});	

	
});