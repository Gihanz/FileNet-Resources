/**
 * Licensed Materials - Property of IBM (C) Copyright IBM Corp. 2012 US Government Users Restricted Rights - Use,
 * duplication or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/aspect",
	"dojo/window",
	"dijit/_Widget",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
	"dijit/layout/ContentPane",
	"ecm/LoggerMixin",
	"ecm/Messages",
	"ecm/model/Desktop",
	"ecm/model/ContentClass",
	"ecm/widget/CommonPropertiesPane",
	"dojo/text!./templates/WorkItemPropertiesPane.html"
],

function(declare, lang, array, aspect, win, _Widget, _TemplatedMixin, _WidgetsInTemplateMixin, ContentPane, LoggerMixin, Messages, Desktop, ContentClass, CommonPropertiesPane, template) {

	/**
	 * @name ecm.widget.process.WorkItemPropertiesPane
	 * @class Provides a widget that is used to view or edit the properties of a work item.
	 * @augments dijit._Widget
	 */
	return declare("ecm.widget.process.WorkItemPropertiesPane", [
		_Widget,
		_TemplatedMixin,
		_WidgetsInTemplateMixin,
		LoggerMixin
	], {
		/** @lends ecm.widget.process.WorkItemPropertiesPane.prototype */

		templateString: template,
		widgetsInTemplate: true,

		_messages: ecm.messages,
		_templateId: "",
		_workItem: null,

		postCreate: function() {
			this.inherited(arguments);
			this.own(aspect.after(this._commonProperties, "onChange", lang.hitch(this, "onChange"), true));
			this.own(aspect.after(this._commonProperties, "onRetrySave", lang.hitch(this, "onRetrySave"), true));

			lang.mixin(this._commonProperties, {
				_setupDependentAttribute: function(attributeDefinitions, item, reason, attributeDefinition, field) {
					var methodName = "WorkItemPropertiesPane._setupDependentAttribute";
					this.logEntry(methodName, "attributeDefinition: " + attributeDefinition.id);
					var self = this;
					var setValuesFunc = {
						setValues: function(values) {
							var methodName = "WorkItemPropertiesPane.setValues";
							self.logEntry(methodName);
							// Don't make a call to retrieve dependent attributes if:
							//		- Rendering attributes (not a user-driven change)
							//		- Already retrieving dependent attributes
							//		- The value did not change
							if (self._renderingAttributes || self._retrievingDependentAttributesField) {
								return;
							}

							var defaultValues = lang.isArray(attributeDefinition.defaultValue) ? attributeDefinition.defaultValue : [
								attributeDefinition.defaultValue
							];
							if (values.length == defaultValues.length && array.every(values, function(value, i) {
								return value === defaultValues[i];
							})) {
								return;
							}

							// Guard against entering while a retrieve is in progress (setValues() is called for both onBlur and onChange).
							self._retrievingDependentAttributesField = field;
							var attributes = {};

							// Get the properties from the controls and include the hidden properties too
							var properties = self.getPropertiesJSON(true, true, false);
							for (var i = 0; i < properties.length; i++) {
								if (properties[i].dataType == "xs:attachment") {
									// Remove the attachments from the properties list
									properties.splice(i, 1);
									i--;
								} else {
									self.logDebug(methodName, "prop set " + properties[i].name + " to " + properties[i].value);
									attributes[properties[i].name] = properties[i].value;
								}
							}

							// Update the attribute value for this field.
							if (attributeDefinition.cardinality == "SINGLE") {
								// if single value property value is formated in array notation, convert it to non-array
								if (values.length == 1) {
									attributes[attributeDefinition.id] = values[0];
								} else {
									attributes[attributeDefinition.id] = values;
								}
							} else {
								attributes[attributeDefinition.id] = values;
							}

							self.logDebug(methodName, "attr " + attributeDefinition.id + " set to " + attributes[attributeDefinition.id]);

							// Update the attribute definition default values from the field values.
							array.forEach(attributeDefinitions, function(attrDef) {
								if (attributes[attrDef.id] !== undefined) {
									attrDef.defaultValue = attributes[attrDef.id];
								}
							});

							// Handle restoring focus to the field that currently has focus,
							// and prevent the return of focus ("refocus") from the status dialog 
							// or focus will go to the first focusable element in the dialog, 
							// causing the dialog to scroll to the top.
							if (self._displayStatusDialogEventHandle == null) {
								var lastFocusedFieldName;
								self._displayStatusDialogEventHandle = aspect.after(Desktop, "onDisplayStatusDialog", lang.hitch(this, function(statusDialog) {
									// Disconnect & cleanup.
									if (self._displayStatusDialogEventHandle != null) {
										self._displayStatusDialogEventHandle.remove();
										delete self._displayStatusDialogEventHandle;
									}
									// The attribute field that has focus will be destroyed, so disable refocus.
									self._statusDialogRefocus = statusDialog.refocus;
									statusDialog.refocus = false;

									// Remember the last focused field.
									lastFocusedFieldName = self.getFocusedFieldName();

									// Handle status dialog hide.
									self._hideStatusDialogEventHandle = aspect.after(Desktop, "onHideStatusDialog", lang.hitch(this, function(statusDialog) {
										// Disconnect & cleanup.
										if (self._hideStatusDialogEventHandle != null) {
											self._hideStatusDialogEventHandle.remove();
											delete self._hideStatusDialogEventHandle;
										}

										var _statusDialog = statusDialog;

										// Allow time for the status dialog to close before resetting "refocus" and restoring the focus.
										setTimeout(function() {
											// Restore the original refocus setting.
											_statusDialog.refocus = self._statusDialogRefocus;
											delete self._statusDialogRefocus;

											// Restore the focus.
											if (lastFocusedFieldName) {
												self.setFieldFocus(lastFocusedFieldName);
											}
											_statusDialog = null;
										}, 100);
									}), true);
								}), true);
							}

							// Call into the WorkItem object to retrieve dependent parameters, it uses a "pseudo" ContentClass so
							// we can not call into the ContentClass to retrieve these dependent parameters.
							item.retrieveDependentParameters(attributes, function(newAttributeDefinitions) {
								// Disconnect the connection to status dialog open here if it hasn't been disconnected yet (no status dialog was displayed).
								if (self._displayStatusDialogEventHandle != null) {
									self._displayStatusDialogEventHandle.remove();
									delete self._displayStatusDialogEventHandle;
								}

								self._updateDependentAttributeRenderings(newAttributeDefinitions, attributeDefinitions, item, reason);

								delete self._retrievingDependentAttributesField;
								// Resume save is handled in renderAttributes().
							}, function(response) {
								delete self._retrievingDependentAttributesField;
								delete self._retrySave;
								self._propertiesAreInvalid = true;
							});
							self.logExit(methodName);
						}
					};

					// note, originally this included onKeyUp and onMouseUp, but these cause issues for dependent choice lists (over-updating, wiping out errors)
					var callSetValueFunction = lang.hitch(this, "_callSetValue", field, setValuesFunc);
					field.own(aspect.after(field, "onChange", callSetValueFunction, true));
					field.own(aspect.after(field, "onBlur", callSetValueFunction, true));
					this.logExit(methodName);
				}
			});

			lang.mixin(this._commonProperties, {
				_updateDependentAttributeRenderings: function(newAttributeDefinitions, currentAttributeDefinitions, item, reason) {
					this.logEntry("WorkItemPropertiesPane._updateDependentAttributeRenderings");

					// For better performance, create a lookup by id on the new attribute definitions.
					var attrDefNdx;
					var newAttrDef;
					var newAttrDefsById = {};
					for (attrDefNdx in newAttributeDefinitions) {
						newAttrDef = newAttributeDefinitions[attrDefNdx];
						newAttrDefsById[newAttrDef.id] = newAttrDef;
					}

					var currentAttrDefsById = {};

					for (attrDefNdx in currentAttributeDefinitions) {
						var oldAttrDef = currentAttributeDefinitions[attrDefNdx];
						currentAttrDefsById[oldAttrDef.id] = oldAttrDef;
						var newAttrDef = newAttrDefsById[oldAttrDef.id];
						if (newAttrDef && newAttrDef.updated) {
							// mix the updated attribute def into the new one to obtain the updates
							// Note: The flags tested avoid overriding properties that did not change
							if (newAttrDef.updatedLabel) {
								oldAttrDef.name = newAttrDef.label;
							}
							if (newAttrDef.updatedDefaultValue) {
								oldAttrDef.defaultValue = newAttrDef.defaultValue;
							}
							if (newAttrDef.updatedReadOnly) {
								oldAttrDef.readOnly = newAttrDef.readOnly;
							}
							if (newAttrDef.updatedRequired) {
								oldAttrDef.required = newAttrDef.required;
							}
							if (newAttrDef.updatedHidden) {
								oldAttrDef.hidden = newAttrDef.hidden;
							}
							if (newAttrDef.updatedMinValue) {
								oldAttrDef.minValue = newAttrDef.minValue;
							}
							if (newAttrDef.updatedMaxValue) {
								oldAttrDef.maxValue = newAttrDef.maxValue;
							}
							if (newAttrDef.updatedMinEntry) {
								oldAttrDef.minLength = newAttrDef.minEntry;
							}
							if (newAttrDef.updatedMaxEntry) {
								oldAttrDef.maxLength = newAttrDef.maxEntry;
							}
							if (newAttrDef.updatedFormat) {
								oldAttrDef.format = newAttrDef.format;
							}
							if (newAttrDef.updatedFormatDescription) {
								oldAttrDef.formatDescription = newAttrDef.formatDescription;
							}
							if (newAttrDef.updatedChoiceList) {
								// If the choice list is set to "default" then use the original choice list.
								if (newAttrDef.choiceList == "default") {
									oldAttrDef.choiceList = null;
									if (oldAttrDef.contentClass) {
										var classAttr = oldAttrDef.contentClass.attributeDefinitionsById[oldAttrDef.id];
										if (classAttr && classAttr.choiceList) {
											oldAttrDef.choiceList = classAttr.choiceList;
										}
									}
								} else {
									oldAttrDef.choiceList = newAttrDef.choiceList;
								}
							}
							if (newAttrDef.updatedHasDependentAttributes) {
								oldAttrDef.hasDependentAttributes = newAttrDef.hasDependentAttributes;
							}

							// clear choice list cache in case choice list was changed
							oldAttrDef.validChoiceList = undefined;
						}

					}

					// Add any new attribute definitions that were missing from the old attribute definitions.
					for ( var attrDefNdx in newAttributeDefinitions) {
						newAttrDef = newAttributeDefinitions[attrDefNdx];
						if (currentAttrDefsById[newAttrDef.id] === undefined) {
							// If the choice list is set to "default" then use the original classs choice list.
							if (newAttrDef.choiceList == "default") {
								newAttrDef.choiceList = null;
								if (newAttrDef.contentClass) {
									var classAttr = newAttrDef.contentClass.attributeDefinitionsById[newAttrDef.id];
									if (classAttr && classAttr.choiceList) {
										newAttrDef.choiceList = classAttr.choiceList;
									}
								}
							}
							currentAttributeDefinitions.push(newAttrDef);
							currentAttrDefsById[newAttrDef.id] = newAttrDef;
						}
					}

					// Remember the currently invalid fields so they can be re-validated after they are recreated.
					var invalidFieldsPropertyIdMap = this._propertyEditors.getInvalidFieldsPropertyIdMap();

					// Remember which properties were touched by the user.
					var blurredFields = {};
					array.forEach(this._propertyEditors.getFields(), function(field) {
						if (field._hasBeenBlurred) {
							blurredFields[field.name] = field._hasBeenBlurred;
						}
					});

					this._updatingDependentAttributeRendering = true;
					this.renderAttributes(currentAttributeDefinitions, item, reason, this._itemIsReadOnly);

					// Restore which properties were touched by the user.
					// Re-validate the touched fields so that the error status is displayed if the value is invalid.
					array.forEach(this._propertyEditors.getFields(), function(field) {
						if (blurredFields[field.name]) {
							field._hasBeenBlurred = true;
							if (typeof field.validate === "function") {
								field.validate();
							}
						}
					});

					// The fields have been recreated. Validate those that were previously invalid.
					this._propertyEditors.validateFieldsUsingPropertyIdMap(invalidFieldsPropertyIdMap);

					this.logExit("WorkItemPropertiesPane._updateDependentAttributeRenderings");
				}
			});
		},

		/**
		 * Sets the work item for the properties display.
		 * 
		 * @param item
		 *            A {@link ecm.model.WorkItem} object.
		 */
		setItem: function(item) {
			this.logEntry("setItem");
			this._workItem = item;
			this.repository = item.repository;
			this._workClass = this._workItem.getWorkClass();

			this._retrieveAttributes();
			this.logExit("setItem");
		},

		_retrieveAttributes: function() {
			this.logEntry("_retrieveAttributes");
			this._workClass.retrieveAttributeDefinitions(lang.hitch(this, function(attributeDefinitions) {
				this._commonProperties.setRepository(this._workItem.repository);
				if (this._workItem.hasDependentAttributes()) {
					// Call into the WorkItem object to retrieve dependent parameters, it uses a "pseudo" ContentClass so
					// we can not call into the ContentClass to retrieve these dependent parameters.

					// Create a copy of the attribute definitions so that we don't modify the class attribute definitions.
					var attrDefs = [];
					var attrDefsById = {};
					var attrDef;
					for ( var attrDefNdx in attributeDefinitions) {
						attrDef = attributeDefinitions[attrDefNdx];
						// Clone the attribute definition. The content class reference is copied.
						// Also create a map by attribute id for faster lookup.
						attrDef = attrDef.clone();
						attrDefs.push(attrDef);
						attrDefsById[attrDef.id] = attrDef;
					}

					this._workItem.retrieveDependentParameters(this._workItem.attributes, lang.hitch(this, function(newAttributeDefinitions) {

						// Apply the dependent attribute changes
						for (var i = 0; i < newAttributeDefinitions.length; i++) {
							var newAttrDef = newAttributeDefinitions[i];
							var oldAttrDef = attrDefsById[newAttrDef.id];
							if (oldAttrDef) {
								if (newAttrDef && newAttrDef.updated) {
									// mix the updated attribute def into the new one to obtain the updates
									// Note: The flags tested avoid overriding properties that did not change
									if (newAttrDef.updatedLabel) {
										oldAttrDef.name = newAttrDef.label;
									}
									if (newAttrDef.updatedDefaultValue) {
										oldAttrDef.defaultValue = newAttrDef.defaultValue;
									}
									if (newAttrDef.updatedReadOnly) {
										oldAttrDef.readOnly = newAttrDef.readOnly;
									}
									if (newAttrDef.updatedRequired) {
										oldAttrDef.required = newAttrDef.required;
									}
									if (newAttrDef.updatedHidden) {
										oldAttrDef.hidden = newAttrDef.hidden;
									}
									if (newAttrDef.updatedMinValue) {
										oldAttrDef.minValue = newAttrDef.minValue;
									}
									if (newAttrDef.updatedMaxValue) {
										oldAttrDef.maxValue = newAttrDef.maxValue;
									}
									if (newAttrDef.updatedMinEntry) {
										oldAttrDef.minLength = newAttrDef.minEntry;
									}
									if (newAttrDef.updatedMaxEntry) {
										oldAttrDef.maxLength = newAttrDef.maxEntry;
									}
									if (newAttrDef.updatedFormat) {
										oldAttrDef.format = newAttrDef.format;
									}
									if (newAttrDef.updatedFormatDescription) {
										oldAttrDef.formatDescription = newAttrDef.formatDescription;
									}
									if (newAttrDef.updatedChoiceList) {
										// Keep the original choice list if the choice list is set to the special value "default".
										if (newAttrDef.choiceList != "default") {
											oldAttrDef.choiceList = newAttrDef.choiceList;
										}
									}
									if (newAttrDef.updatedHasDependentAttributes) {
										oldAttrDef.hasDependentAttributes = newAttrDef.hasDependentAttributes;
									}
									oldAttrDef.validChoiceList = undefined;
								}
							} else {
								newAttrDef.validChoiceList = undefined;
								attrDefs.push(newAttrDef);
								attrDefsById[newAttrDef.id] = newAttrDef;
							}
						}

						this._commonProperties.renderAttributes(attrDefs, this._workItem, "editParameters");
						setTimeout(lang.hitch(this, function() {
							this.onCompleteRendering();
						}), 100);
					}));
				} else {
					this._commonProperties.renderAttributes(attributeDefinitions, this._workItem, "editParameters");
					setTimeout(lang.hitch(this, function() {
						this.onCompleteRendering();
					}), 100);
				}
			}));
			this.logExit("_retrieveAttributes");
		},

		/**
		 * An event function called after the widget is finished rendering.
		 */
		onCompleteRendering: function() {
			this._focusFirstField();
		},

		_focusFirstField: function() {
			this.logEntry("_focusFirstField");
			var _this = this;
			setTimeout(function() {
				if (_this._commonProperties.getFields() && _this._commonProperties.getFields().length > 0) {
					_this._commonProperties.getFields()[0].focus();
				}
			}, 300);
			this.logExit("_focusFirstField");
		},

		/**
		 * Checks the work item properties list for having valid values.
		 * 
		 * @param focus
		 *            A boolean value indicating if the error field (if any) should be set as focus.
		 * @param onEditStatus
		 *            A boolean value indicating if we are editing the properties
		 * @param onSaveStatus
		 *            A boolean value indicating if we are saving the properties
		 * @returns {Boolean} true if there are no validation errors, false otherwise.
		 */
		validate: function(focus, onEditStatus, onSaveStatus) {
			this.logEntry("validate");
			focus = focus == undefined ? true : false;
			var errorField = this._commonProperties.validateAll(onEditStatus, onSaveStatus);
			if (errorField) {
				if (focus) {
					setTimeout(function() {
						// Scroll into view before setting focus so that tooltips are not dismissed by the scroll.
						win.scrollIntoView(errorField.domNode);
						errorField.focus();
					}, 300);
				}
			}
			this.logExit("validate");
			return errorField;
		},

		/**
		 * Sets a properties field error state.
		 * 
		 * @param fieldName
		 *            A string hold the field name.
		 * @param errorMessage
		 *            A string hold the error message text to display.
		 * @param errorValue
		 *            The error value.
		 */
		setFieldError: function(fieldName, errorMessage, errorValue) {
			this._commonProperties.setFieldError(fieldName, errorMessage, errorValue);
		},

		/**
		 * Sets a properties field focus state.
		 * 
		 * @param fieldName
		 *            A string hold the field name.
		 */
		setFieldFocus: function(fieldName) {
			this._commonProperties.setFieldFocus(fieldName);
		},

		/**
		 * Returns the pseudo {@link ecm.model.ContentClass} object holding the work item property attributes.
		 * 
		 * @returns {ecm.model.ContentClass} object holding pseudo class.
		 */
		getContentClass: function() {
			return this._contentClass;
		},

		/**
		 * Returns the work item properties in a JSON format.
		 * 
		 * @returns {Object} holding property data.
		 */
		getPropertiesJSON: function() {
			// Include all read only, hidden, and empty property values.
			var propertiesJSON = this._commonProperties.getPropertiesJSON(true, true, false);
			// Remove the attachment properties they are listed as "hidden" and CommonProperties doesn't know what they are so we handle them separately.
			for (var i = 0; i < propertiesJSON.length; i++) {
				if (propertiesJSON[i].dataType == "xs:attachment") {
					propertiesJSON.splice(i, 1);
					i--;
				}
			}
			return propertiesJSON;
		},

		/**
		 * Returns a boolean value true indicating whether there are property fields to display.
		 * 
		 * @returns {Boolean} true if there are property fields to display, false otherwise.
		 */
		hasDisplayedFields: function() {
			var fields = this._commonProperties.getFields();
			if (fields && fields.length > 0) {
				return true;
			} else {
				return false;
			}
		},

		/**
		 * Function to resize the widget.
		 */
		resizeIt: function() {
			this._borderContainer.resize();
		},

		// override
		onChange: function() {
		},

		/**
		 * This event is fired when a save operation can be retried. See {@link ecm.widget.CommonPropertiesPane}
		 * <code>onRetrySave</code>.
		 */
		onRetrySave: function() {
		},

		destroy: function() {
			this.repository = null;
			this._workClass = null;
			this._workItem = null;
			this.inherited(arguments);
		},

		_nop: null
	});
});
