/**
 * Licensed Materials - Property of IBM (C) Copyright IBM Corp. 2012 US Government Users Restricted Rights - Use,
 * duplication or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/connect",
	"dojo/_base/sniff",
	"dojo/aspect",
	"dojo/dom-style",
	"dojo/dom-class",
	"dijit/_Widget",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
	"dijit/form/SimpleTextarea",
	"dijit/layout/ContentPane",
	"dijit/layout/TabContainer",
	"idx/html",
	"../../LoggerMixin",
	"../../Messages",
	"./ProcessorLayout",
	"./_ProcessorMixin",
	"./ProcessorButtonBar",
	"./WorkItemPropertiesPane",
	"./WorkItemAttachmentsPane",
	"./TrackerHistoryPane",
	"../dialog/ReassignToUserDialog",
	"../dialog/MessageDialog",
	"ecm/model/WorkItem",
	"ecm/model/WorkItemProcessor",
	"dojo/text!./templates/StepProcessorLayout.html"
],

function(declare, lang, connect, has, aspect, domStyle, domClass, _Widget, _TemplatedMixin, _WidgetsInTemplateMixin, SimpleTextarea, ContentPane, TabContainer, idxHtml, LoggerMixin, Messages, ProcessorLayout, _ProcessorMixin, ProcessorButtonBar, WorkItemPropertiesPane, WorkItemAttachmentsPane, TrackerHistoryPane, ReassignToUserDialog, MessageDialog, WorkItem, WorkItemProcessor, template) {

	/**
	 * @name ecm.widget.process.StepProcessorLayout
	 * @class Provides the basic layout for step processors.
	 * @augments ecm.widget.process.ProcessorLayout, ecm.widget.process._ProcessorMixin
	 */
	return declare("ecm.widget.process.StepProcessorLayout", [
		_Widget,
		_TemplatedMixin,
		_WidgetsInTemplateMixin,
		ProcessorLayout,
		_ProcessorMixin,
		LoggerMixin
	], {
		/** @lends ecm.widget.process.StepProcessorLayout.prototype */

		widgetsInTemplate: true,
		contentString: template,

		postCreate: function() {
			this.logEntry("postCreate");
			this.inherited(arguments);

			this.own(aspect.after(this.workItemPropertiesPane, "onCompleteRendering", lang.hitch(this, "onCompleteRendering"), true));
			this.own(aspect.after(this.workItemPropertiesPane, "onChange", lang.hitch(this, "_onChangeProperties"), true));
			this.own(aspect.after(this.workItemPropertiesPane, "onRetrySave", lang.hitch(this, function() {
				this.onOk.apply(this, this._retrySaveArguments);
				delete this._retrySaveArguments;
			})));

			// Connect to tab container select events.
			this._connectTabContainer();

			if (this._checkHost()) {
				this._isGetNextEnabled = this._getRequestParam("isGetNextEnabled") ? this._getRequestParam("isGetNextEnabled") == "true" : false;
				this.processorButtonBar.showGetNextCheckBox(this._isGetNextEnabled);
			}
			this.processorButtonBar.showSaveButton();
			this.saveButton = this.processorButtonBar.saveButton;

			this.logExit("postCreate");
		},

		_connectTabContainer: function() {
			this.viewTabContainer.watch("selectedChildWidget", lang.hitch(this, function(name, oldPane, newPane) {
				if (oldPane && newPane.dojoAttachPoint == "attachmentsContainer") {
					domClass.toggle(this.viewTabContainer.domNode, "ecmStepTabContainerBorder");
				} else if (oldPane && newPane.dojoAttachPoint == "propertiesContainer") {
					domClass.toggle(this.viewTabContainer.domNode, "ecmStepTabContainerBorder");
				} else if (oldPane && newPane.dojoAttachPoint == "historyContainer") {
					domClass.toggle(this.viewTabContainer.domNode, "ecmStepTabContainerBorder");
					this.workItemHistoryPane.render();
				}
			}));
		},

		_isSameApplication: function(workItem, newWorkItem) {
			var sameHost = this._checkHost();
			if (sameHost && workItem.F_StepLocation == newWorkItem.F_StepLocation) { // Do additional href check for exact application matching.
				return window.location.href.indexOf(newWorkItem.F_StepBaseurl) == 0;
			} else {
				return false;
			}
		},

		/**
		 * Creates a {@link ecm.model.WorkItem} object from the passed in parameter information.
		 * 
		 * @param repository
		 *            A {@link ecm.model.Repository} object.
		 */
		createWorkItem: function(repository) {
			this.logEntry("createWorkItem");
			var wobNum = this._getRequestParam("wobNum");
			var queueName = this._getRequestParam("queueName");
			if (wobNum && queueName) {
				queueName = decodeURIComponent(queueName);
				this._loadWorkItem(repository, wobNum, queueName);
			} else {
				this.logError("createWorkItem", "URL parameters for wobNum and queueName are missing.");
			}

			this.logExit("createWorkItem");
		},

		_getBackgroundRequest: function() {
			// Under IE8 the status dialog may keep the window from being released if the window is closed after the request completes.
			// If this is IE8 and the window doesn't stay open, execute the request in the background.
			return (has("ie") < 9 && !(window.opener && this._checkHost() && this.processorButtonBar.isGetNextEnabled()));
		},

		_loadNextWorkItem: function(response) {
			this.logEntry("_loadNextWorkItem");
			var currentItem = window.opener.ecm.widget.dialog.stepProcessorWindow.getCurrentItem(this._workItem);
			this.workItemProcessor = new WorkItemProcessor(currentItem);
			this.workItemProcessor.getNextItem(lang.hitch(this, function(item) {
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
						this._onHideNoMoreItemsMessageDialog.remove();
						delete this._onHideNoMoreItemsMessageDialog;
					}
					if (this._messageDialog) {
						this._messageDialog.destroyRecursive();
					}
					this._messageDialog = new ecm.widget.dialog.MessageDialog({
						text: this._messages.process_no_more_items
					});
					this._onHideNoMoreItemsMessageDialog = aspect.after(this._messageDialog, "onHide", lang.hitch(this, function() {
						this._onStepActionCompleted(response);
					}), true);
					this._messageDialog.show();
				}
			}));

			this.logExit("_loadNextWorkItem");
		},

		_loadWorkItem: function(repository, wobNum, queueName, callback) {
			this.logEntry("_loadWorkItem");
			this._workItem = new ecm.model.WorkItem({
				id: wobNum,
				name: queueName,
				queueName: queueName,
				wobNum: wobNum,
				repository: repository
			});

			// Fix visibility problem with first tab contents after dojo 1.9 upgrade
			domClass.remove(this.propertiesContainer.domNode.parentNode, "dijitHidden");
			domClass.add(this.propertiesContainer.domNode.parentNode, "dijitVisible");

			this._workItem.retrieveStepParameters(lang.hitch(this, function(item) {
				this.updateView();
				if (callback) {
					callback();
				}
			}));
			this.logExit("_loadWorkItem");
		},

		/**
		 * Updates the widgets with the current work item property information for rendering.
		 */
		updateView: function() {
			this.logEntry("updateView");
			this._setWindowTitle();

			// Check to see if we need both Attachments and History tabs, remove them if not
			if (this.hasAttachment()) {
				this.createAttachmentsPane();
				this.workItemAttachmentsPane.setItem(this._workItem);
			} else {
				if (this.viewTabContainer.getIndexOfChild(this.attachmentsContainer) != -1) {
					this.viewTabContainer.removeChild(this.attachmentsContainer);
				}
			}

			if (this.canRenderHistoryPane()) {
				this.createHistoryPane();
				this.workItemHistoryPane.setItem(this._workItem);
			} else {
				if (this.viewTabContainer.getIndexOfChild(this.historyContainer) != -1) {
					this.viewTabContainer.removeChild(this.historyContainer);
				}
			}

			this.subjectText.innerHTML = idxHtml.escapeHTML(this._workItem.getValue("F_Subject"));
			this.deadline.innerHTML = this._workItem.getDisplayValue("F_Deadline");
			var originatorDisplayName = this._workItem.getDisplayValue("F_OriginatorDisplayName");
			if (!originatorDisplayName || originatorDisplayName.length == 0) // Fall back to short name if display name is blank
				originatorDisplayName = this._workItem.getDisplayValue("F_Originator");
			this.launchedby.innerHTML = idxHtml.escapeHTML(originatorDisplayName);
			this.receivedOn.innerHTML = this._workItem.getDisplayValue("F_StepReceived");
			this.stepName.innerHTML = idxHtml.escapeHTML(this._workItem.getValue("F_StepName"));

			var instructions = this._workItem.getValue("F_Instructions");
			if (instructions) {
				this.instructionsText.set('value', instructions);
			} else {
				domStyle.set(this.showInstructions.domNode, "display", "none");
				domStyle.set(this.instructionsText.domNode, "display", "none");
				this.resizeIt();
			}

			// Remove all buttons
			this.processorButtonBar.removeAll();
			this.addProcessButtons();
			this.own(aspect.after(this, "onProcessButtonsCreated", lang.hitch(this, function() {
				this.workItemPropertiesPane.setItem(this._workItem);
				if (this.workItemPropertiesPane.resizeIt) {
					this.workItemPropertiesPane.resizeIt();
				}
			}), true));

			this.logExit("updateView");
		},

		/**
		 * Dynamically construct the Attachments tab container pane and add it to the view tab container.
		 * 
		 * @since 2.0.3
		 */
		createAttachmentsPane: function() {
			if (this.viewTabContainer.getIndexOfChild(this.attachmentsContainer) == -1) {
				this.attachmentsContainer = new ContentPane({
					region: "center",
					title: this._messages.process_attachments,
					'dojoAttachPoint': 'attachmentsContainer'
				});
				this.workItemAttachmentsPane = new WorkItemAttachmentsPane({
					region: "center",
					'class': "centerPane",
					'dojoAttachPoint': 'workItemAttachmentsPane'
				});
				this.attachmentsContainer.addChild(this.workItemAttachmentsPane);
				this.viewTabContainer.addChild(this.attachmentsContainer);
			}
		},

		/**
		 * Dynamically construct the History tab container pane and add it to the view tab container.
		 * 
		 * @since 2.0.3
		 */
		createHistoryPane: function() {
			if (this.viewTabContainer.getIndexOfChild(this.historyContainer) == -1) {
				this.historyContainer = new ContentPane({
					region: "center",
					title: this._messages.process_tracker_history,
					'dojoAttachPoint': 'historyContainer'
				});
				this.workItemHistoryPane = new TrackerHistoryPane({
					region: "center",
					'class': "centerPane",
					'dojoAttachPoint': 'workItemHistoryPane'
				});
				this.historyContainer.addChild(this.workItemHistoryPane);
				this.viewTabContainer.addChild(this.historyContainer);
			}
		},

		/**
		 * Checks work item to determine if the history pane should be rendered.
		 * 
		 * @returns {Boolean} A value of <code>true</code> if the history pane can be rendered, <code>false</code>
		 *          otherwise.
		 * @since 2.0.3
		 */
		canRenderHistoryPane: function() {
			return this._workItem.can_view_history;
		},

		/**
		 * Checks the work item properties pane properties list for having valid values.
		 * 
		 * @param focus
		 *            A boolean value indicating if the error field (if any) should be set as focus.
		 * @param onEditStatus
		 *            A boolean value indicating if we are editing the properties.
		 * @param onSaveStatus
		 *            A boolean value indicating if we are saving the properties.
		 * @returns {Boolean} A value of <code>true</code> if the property values are valid, <code>false</code>
		 *          otherwise.
		 */
		isValid: function(focus, onEditStatus, onSaveStatus) {
			var errorField = this.workItemPropertiesPane.validate(focus, onEditStatus, onSaveStatus);
			if (errorField) {
				this.viewTabContainer.selectChild(this.propertiesContainer);
				return false;
			} else {
				return true;
			}
		},

		_onChangeProperties: function() {
			this.logEntry("_onChangeProperties");
			var isValid = this.isValid(false, false, false);
			this.saveButton.set("disabled", !isValid);
			if (this._responseButtons) {
				if (this._responseButtons instanceof Array) {
					for ( var i in this._responseButtons) {
						var button = this._responseButtons[i];
						button.set("disabled", !isValid);
					}
				} else {
					this._responseButtons.set("disabled", !isValid);
				}
			}
			if (this._movetoInboxButton) {
				this._movetoInboxButton.set("disabled", !isValid);
			}
			if (this._returnButton) {
				this._returnButton.set("disabled", !isValid);
			}
			if (this._reassignButton) {
				this._reassignButton.set("disabled", !isValid);
			}
			this.logExit("_onChangeProperties");
		},

		_showInstructions: function() {
			var disabled = this.instructionsText.disabled;
			if (disabled == true) {
				this.instructionsText.disabled = false;
				this.showInstructions.set('label', this.messages.process_hide_instructions);
				domStyle.set(this.instructionsText.domNode, "display", "");
			} else {
				this.instructionsText.disabled = true;
				this.showInstructions.set('label', this.messages.process_show_instructions);
				domStyle.set(this.instructionsText.domNode, "display", "none");
			}
			this.resizeIt();
		},

		/**
		 * Creates the <strong>Move to In-basket</strong>, <strong>Return</strong>, and <strong>Reassign</strong>
		 * buttons (if appropriate) and inserts them into the button bar at bottom of page.
		 */
		addProcessButtons: function() {
			this.logEntry("addProcessButtons");
			ecm.model.desktop.loadMenuActions("StepProcessorToolbarP8", lang.hitch(this, function(actions) {
				var buttonAdded = false;
				var queueType = this._workItem.queue_type;
				for ( var i in actions) {
					var action = actions[i];
					if (action.id == "MoveToInbox") {
						if (this._movetoInboxButton) {
							this._movetoInboxButton.destroyRecursive();
							this._movetoInboxButton = null;
						}
						if (queueType && queueType == "processQueue") {
							this._movetoInboxButton = this.processorButtonBar.createMovetoInboxButton(lang.hitch(this, this.onMovetoInbox));
							buttonAdded = true;
						}
					} else if (action.id == "ReturnToSender") {
						if (this._returnButton) {
							this._returnButton.destroyRecursive();
							this._returnButton = null;
						}
						if (queueType && queueType == "userQueue") {
							if (this._workItem.can_return) {
								this._returnButton = this.processorButtonBar.createReturnButton(lang.hitch(this, this.onReturn));
								buttonAdded = true;
							}
						}
					} else if (action.id == "Reassign") {
						if (this._returnButton) {
							this._returnButton.destroyRecursive();
							this._returnButton = null;
						}
						if (this._workItem.can_reassign) {
							this._returnButton = this.processorButtonBar.createReassignButton(lang.hitch(this, this.onReassign));
							buttonAdded = true;
						}
					}
				}
				this.processorButtonBar.addSeparator(buttonAdded);
				this.addResponseButtons(this.processorButtonBar, false, this._messages.process_complete_button_label);
				this.resizeIt();
				this.onProcessButtonsCreated();
			}));
			this.logExit("addProcessButtons");
		},

		/**
		 * An event function that is called when the processor layout has completed adding the processor buttons at the
		 * bottom of the page.
		 */
		onProcessButtonsCreated: function() {
		},

		/**
		 * Function to resize the widget.
		 */
		resizeIt: function() {
			this.mainBorderContainer.resize();
			this.stepContentPane.resize();
		},

		/**
		 * An event function that is called when the processor layout has completed rendering.
		 */
		onCompleteRendering: function() {
			this._setFocus();
			this._onChangeProperties();
		},

		_setFocus: function() {
			if (this.workItemPropertiesPane.hasDisplayedFields() == false) {
				this.saveButton.focus();
			}
		},

		/**
		 * Calls <code>onOk</code> event handler to save the processor information before moving the item to the
		 * user's in-basket.
		 */
		onMovetoInbox: function() {
			// Call into the WorkItem to save and move the step
			this.logEntry("onMovetoInbox");
			this._workItem.setValue("F_Responses", "");
			this.onOk(false, lang.hitch(this, function(response) {
				this._workItem.moveToInbox(lang.hitch(this, function() {
					this._onOkCompleted(response);
				}), [
					this._workItem
				], false, lang.hitch(this, function() {
					this._closing = false;
				}), this._getBackgroundRequest());
			}));
			this.logExit("onMovetoInbox");
		},

		/**
		 * Calls <code>onOk</code> event handler to save the processor information before returning the item.
		 */
		onReturn: function() {
			// Call into the WorkItem to save and move the step
			this.logEntry("onReturn");
			this._workItem.setValue("F_Responses", "");
			this.onOk(false, lang.hitch(this, function(response) {
				this._workItem.returnToSender(lang.hitch(this, function() {
					this._onOkCompleted(response);
				}), false, lang.hitch(this, function() {
					this._closing = false;
				}), this._getBackgroundRequest());
			}));
			this.logExit("onReturn");
		},

		/**
		 * Calls <code>onOk</code> event handler to save the processor information before reassigning the item to the
		 * new user.
		 */
		onReassign: function() {
			// Call into the WorkItem to save and move the step
			this.logEntry("onReassign");
			this._workItem.setValue("F_Responses", "");
			var callback = lang.hitch(this, function(user, displayName, delegate) {
				this.onOk(false, lang.hitch(this, function(response) {
					this._workItem.reassign(user, displayName, delegate, lang.hitch(this, function() {
						this._onOkCompleted(response);
					}), [
						this._workItem
					], false, lang.hitch(this, function() {
						this._closing = false;
					}), this._getBackgroundRequest());
				}));
			});
			if (this._reassignDialog) {
				this._reassignDialog.destroyRecursive();
			}
			this._reassignDialog = new ecm.widget.dialog.ReassignToUserDialog({
				repository: this._workItem.repository,
				items: [
					this._workItem
				],
				invokeAction: false,
				callback: callback
			});
			this._reassignDialog.show();
			this.logExit("onReassign");
		},

		/**
		 * Calls <code>onOk</code> event handler to save the processor information.
		 */
		onSave: function() {
			// Call into the WorkItem to save the step information (will not dispatch)
			this.logEntry("onSave");
			this.onOk(false);
			this.logExit("onSave");
		},

		/**
		 * Saves the modified processor information and if requested, will dispatch the work item.
		 * 
		 * @param dispatch
		 *            A boolean value indicating whether to dispatch the item after saving it's values.
		 * @param callback
		 *            A callback function that is called after the item information has been saved.
		 */
		onOk: function(dispatch, callback) {
			this.logEntry("onOk");
			this._retrySaveArguments = arguments;
			if (this.isValid(true, false, true)) {
				if (this._closing) {
					return;
				}
				this._closing = true;

				var properties = this.workItemPropertiesPane.getPropertiesJSON();
				// if there is a response add it in to the properties collection
				var response = this._workItem.getValue("F_Responses");
				if (response) {
					properties.push(this.getStringField("F_Responses", response));
				}
				if (this.hasAttachment()) {
					var attachments = this.workItemAttachmentsPane.getModifiedAttachments();
					for (i = 0; i < attachments.length; i++) {
						properties.push(attachments[i]); // add any modified attachments to list
					}
				}
				// Push in special properties for EDS integration
				properties.push(this.getSystemField("workclassName", this._workItem.workclass_name));
				properties.push(this.getSystemField("sheetName", this._workItem.sheet_name));
				properties.push(this.getSystemField("stepName", this._workItem.step_name));
				// Check for the optional EDS service parameter and if set pass it along
				var edsService = this._workItem[this._workItem.EDS_Serice];
				if (edsService) {
					properties.push(this.getSystemField(this._workItem.EDS_Service, edsService));
				}

				this._workItem.completeStep(properties, dispatch, lang.hitch(this, function(item, response) {
					if (response && response.fieldErrors) {
						this.logInfo("onOk_callback", "There are field " + response.fieldErrors.length + " validation errors.");
						this._closing = false;
						for (var i = 0; i < response.fieldErrors.length; i++) {
							var fieldError = response.fieldErrors[i];
							this.workItemPropertiesPane.setFieldError(fieldError.symbolicName, fieldError.errorMessage, fieldError.invalidItems);
						}
						// set focus on first field error
						//this.logInfo("onOk_callback", "Set focus on first error field " + fieldErrors[0].symbolicName);
						//this.workItemPropertiesPane._commonProperties.getFields()[0].focus();
						//setTimeout(function() {
						//	this.workItemPropertiesPane.setFieldFocus(fieldErrors[0].symbolicName);
						//}, 300);
					} else {
						if (callback) {
							this.logInfo("onOk_callback", "Completed successfully, calling callback function.");
							callback(item);
						} else {
							this._onOkCompleted(item);
						}
					}
				}), false, lang.hitch(this, function() {
					this._closing = false;
				}), !callback && this._getBackgroundRequest());
				this.logExit("onOk");
			}
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

		_onStepActionCompleted: function(response) {
			this.logEntry("_onStepActionCompleted");
			if (window.opener && this._checkHost()) {
				this._setStatusMessage(this._workItem);
				window.opener.ecm.widget.dialog.stepProcessorWindow.onStepProcessorWindowCompleted(this._workItem);
			} else {
				this._handleCloseMessage();
			}
			this._closeWindow();
			this.logExit("_onStepActionCompleted");
		},

		/**
		 * Cancels the operation and unlocks the work item.
		 */
		onCancel: function() {
			this.logEntry("onCancel");
			if (this._closing) {
				return;
			}
			this._closing = true;

			this._workItem.unlockStep(true, lang.hitch(this, function(response) {
				this._cancelStepCompleted(response);
			}), false, lang.hitch(this, function() {
				this._closing = false;
			}), this._getBackgroundRequest());
			this.logExit("onCancel");
		},

		_cancelStepCompleted: function(response) {
			this.logEntry("_cancelStepCompleted");
			if (window.opener && this._checkHost()) {
				this._setStatusMessage(this._workItem);
				window.opener.ecm.widget.dialog.stepProcessorWindow.onStepProcessorWindowCancelled(this._workItem, this._isGetNextEnabled);
			} else {
				this._handleCloseMessage();
			}
			this._closeWindow();
			this.logExit("_cancelStepCompleted");
		},

		destroy: function() {
			if (this._onHideNoMoreItemsMessageDialog) {
				this._onHideNoMoreItemsMessageDialog.remove();
				delete this._onHideNoMoreItemsMessageDialog;
			}
			if (this._messageDialog) {
				this._messageDialog.destroyRecursive();
				this._messageDialog = null;
			}
			if (this._reassignDialog) {
				this._reassignDialog.destroyRecursive();
				this._reassignDialog = null;
			}

			if (this.attachmentsContainer) {
				this.attachmentsContainer.destroyRecursive();
				this.attachmentsContainer = null;
			}
			if (this.historysContainer) {
				this.historysContainer.destroyRecursive();
				this.historysContainer = null;
			}

			// Buttons created by the processorButtonBar are owned by the processorButtonBar.
			this._movetoInboxButton = null;
			this._returnButton = null;
			this._reassignButton = null;

			this.workItemProcessor = null;
			this._workItem = null;
			this.inherited(arguments);
		}
	});
});
