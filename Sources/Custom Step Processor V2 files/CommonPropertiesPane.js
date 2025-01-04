/**
 * Licensed Materials - Property of IBM (C) Copyright IBM Corp. 2012, 2014 US Government Users Restricted Rights - Use,
 * duplication or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */
define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/dom-class",
	"dojo/dom-style",
	"dojo/dom-construct",
	"dojo/dom-geometry",
	"dojo/keys",
	"dojo/string",
	"dojo/window",
	"dojo/data/ItemFileReadStore",
	"dojo/data/ItemFileWriteStore",
	"dojo/store/DataStore",
	"dijit/registry",
	"dijit/_Widget",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
	"dijit/layout/ContentPane",
	"dijit/Tooltip",
	"../Messages",
	"../LoggerMixin",
	"../model/AttributeDefinition",
	"../model/Desktop",
	"../model/EntryTemplate",
	"./_PropertiesPaneMixin",
	"./ChildComponentPropertiesPane",
	"./FilteringSelect",
	"./HoverHelp",
	"./PropertyEditors",
	"./SinglePropertyEditorFactory",
	"dojo/text!./templates/CommonPropertiesPane.html"
],

function(declare, //
lang, //
array, //
domClass, //
domStyle, //
domConstruct, //
domGeom, //
keys, //
string, //
win, //
ItemFileReadStore, //
ItemFileWriteStore, //
DataStore, //
registry, //
_Widget, //
_TemplatedMixin, //
_WidgetsInTemplateMixin, //
ContentPane, //
Tooltip, //
Messages, //
LoggerMixin, //
AttributeDefinition, //
Desktop, //
EntryTemplate, //
_PropertiesPaneMixin, //
ChildComponentPropertiesPane, //
FilteringSelect, //
HoverHelp, //
PropertyEditors, //
SinglePropertyEditorFactory, //
template) {

	/**
	 * @name ecm.widget.CommonPropertiesPane
	 * @class Provides a widget that is used to view and edit properties. This widget can be used in dialog boxes for
	 *        adding documents, creating folders, and editing properties.
	 * @augments dijit._Widget, ecm.widget._PropertiesPaneMixin
	 */
	return declare("ecm.widget.CommonPropertiesPane", [
		_Widget,
		_TemplatedMixin,
		_WidgetsInTemplateMixin,
		_PropertiesPaneMixin,
		LoggerMixin
	], {
		/** @lends ecm.widget.CommonPropertiesPane.prototype */

		templateString: template,
		widgetsInTemplate: true,
		tooltipPosition: [
			"above",
			"below",
			"after",
			"before"
		],

		/**
		 * A boolean value. It is <code>true</code> if the value of one or more property fields has changed.
		 */
		fieldschanged: false,

		/**
		 * An object used to retrieve dependent properties. Used in multi item editing.
		 */
		dependentPropertyObject: null,

		_messages: ecm.messages,
		_factory: null,
		_properties: null,
		_multiEditReadOnlyTooltip: null,
		_showHiddenProperties: false,
		_itemIsReadOnly: false,

		postCreate: function() {
			this.inherited(arguments);
			this._factory = new SinglePropertyEditorFactory();
			this._propertyEditors = new PropertyEditors();
		},

		destroy: function() {
			this._cleanUp();

			this._propertyEditors = null;
			this._factory = null;

			this.inherited(arguments);
		},

		destroyTooltipWidgets: function() {
			if (this._hoverHelpArray) {
				for ( var i in this._hoverHelpArray) {
					this._hoverHelpArray[i].destroyRecursive();
				}
				this._hoverHelpArray = null;
			}

			if (this._tooltipArray) {
				for ( var i in this._tooltipArray) {
					this._tooltipArray[i].destroyRecursive();
				}
				this._tooltipArray = null;
			}

			if (this._multiEditReadOnlyTooltip)
				this._multiEditReadOnlyTooltip.destroyRecursive();
		},

		/**
		 * @private
		 */
		_cleanUp: function(rendering) {
			this.logEntry("_cleanUp");

			if (rendering && this._attributesInputArea.firstChild) {
				// Lock down the current size while attribute widgets are removed and recreated
				// to prevent unnecessary scrolling.
				var marginBox = domGeom.getMarginBox(this._attributesInputArea);
				domStyle.set(this._attributesInputArea, {
					"width": marginBox.w + "px",
					"height": marginBox.h + "px"
				});
			}

			this.destroyTooltipWidgets();

			if (this._attributesInputArea && this._attributesInputArea.firstChild) {
				// Remove and destroy existing attribute widgets
				while (this._attributesInputArea.firstChild) {
					this._attributesInputArea.removeChild(this._attributesInputArea.firstChild);
				}
			}

			if (this._propertyEditors) {
				this._propertyEditors.destroyFields();
			}

			if (this._childComponents) {
				for (var i = 0; i < this._childComponents.length; i++) {
					this._childComponents[i].destroyRecursive();
				}
				this._childComponents = null;
			}
			this.onClearedRendering();
			this.logExit("_cleanUp");
		},

		/**
		 * Clears the current property rendering.
		 */
		clearRendering: function() {
			this.logEntry("clearRendering");
			this._cleanUp();
			this.logExit("clearRendering");
		},

		/**
		 * Determines whether the attribute will be shown.
		 */
		isAttributeShown: function(attributeDefinition, item) {
			return !attributeDefinition.system && (this._showHiddenProperties || (!attributeDefinition.hidden && (!item || !item.isAttributeHidden(attributeDefinition.id))));
		},

		/**
		 * Creates the appropriate control based on the provided arguments. This is done so that subclasses can override
		 * and provide a different implementation if needed.
		 */
		createControl: function(kwArgs, attributeDefinition, callback) {
			if (lang.isFunction(callback)) {
				this._factory.createSinglePropertyEditor(kwArgs, function(editor) {
					callback(editor);
				});
			} else {
				return this._factory.createSinglePropertyEditor(kwArgs);
			}
		},

		/**
		 * Set the value control column width, can be overridden. Default is 300px (for most controls).
		 */
		getControlValueWidthClass: function(kwArgs) {
			if (kwArgs.cardinality && (kwArgs.cardinality == "LIST" || kwArgs.cardinality == "MULTI")) {
				return "propertyDropDownValue";
			} else if (kwArgs.choiceListNested == true) {
				return "propertyChoiceDropDownValue";
			} else if (kwArgs.dataType == "xs:string") {
				return "propertyStringValue";
			} else if (kwArgs.dataType == "xs:integer" || kwArgs.dataType == "xs:short" || kwArgs.dataType == "xs:long" || kwArgs.dataType == "xs:decimal" || kwArgs.dataType == "xs:double") {
				return "propertyNumericValue";
			} else if (kwArgs.dataType == "xs:boolean") {
				return "propertyBooleanValue";
			}
			return null;
		},

		/**
		 * Renders the attributes.
		 * 
		 * @param attributeDefinitions
		 *            An array of {@link ecm.model.AttributeDefinition} objects. Provides the definitions for the
		 *            attributes in the <code>item</code> parameter.
		 * @param item
		 *            A {@link ecm.model.ContentItem} object.
		 * @param reason
		 *            The reason for displaying properties. Pass <code>"create"</code> when creating a new content
		 *            item, <code>"checkin"</code> when checking in a content item, <code>"editProperties"</code>
		 *            when editing the properties of a content item, or <code>"multiEditProperties"</code> when
		 *            editing the properties of multiple content items.
		 * @param isReadOnly
		 *            Pass <code>true</code> if the entire item is read only.
		 * @param params
		 *            A object containing additional parameters. (@since 2.0.3)
		 */
		renderAttributes: function(attributeDefinitions, item, reason, isReadOnly, params) {
			this.logEntry("renderAttributes");

			this.onAttributesRendering(attributeDefinitions);

			if (!this._updatingDependentAttributeRendering) {
				delete this._propertiesAreInvalid;
			} else {
				delete this._updatingDependentAttributeRendering;
			}

			// Update the internal read only setting.
			this._itemIsReadOnly = isReadOnly;
			this._renderingAttributes = true;

			var lastFocusedFieldName = this.getFocusedFieldName();
			this._cleanUp(true);
			this.attributeDefinitions = attributeDefinitions;

			var tableClass = "propertyTable";
			var labelCellClass = "propertyRowLabel";
			var valueCellClass = "propertyRowValue";
			if (reason == "multiEditProperties") {
				tableClass += " multiEditPropertiesTable";
				labelCellClass += " multiEditPropertyCell";
				valueCellClass += " multiEditPropertyCell";
			}

			var table = domConstruct.create("table", {
				'role': 'presentation',
				'class': tableClass
			}, this._attributesInputArea);
			var tbody = domConstruct.create("tbody", {}, table);
			for ( var i in attributeDefinitions) {
				(lang.hitch(this, function(attributeDefinition) {
					if (this.isAttributeShown(attributeDefinition, item)) {

						var widgetId = this.id + "_" + attributeDefinition.id + new Date().getTime();

						var tr = domConstruct.create("tr", {}, tbody);
						var tdLabel = domConstruct.create("td", {
							'class': labelCellClass
						}, tr);
						var span = domConstruct.create("span", {
							"class": "required",
							innerHTML: attributeDefinition.required ? "*" : ""
						}, tdLabel);
						var label = domConstruct.create("label", {
							'for': widgetId
						}, tdLabel);
						// Not using innerHTML, due to content = "<test>aa" causes issues with innerHTML
						var labelData = string.substitute(this._messages.append_colon, [
							attributeDefinition.name
						]);
						label.appendChild(document.createTextNode(labelData));
						var readOnly = this._factory.getFieldIsReadOnly(attributeDefinition, item, reason, isReadOnly);
						if (readOnly) {
							domClass.add(label, "labelReadOnly");
						}
						var tdValue = domConstruct.create("td", {
							'class': valueCellClass
						}, tr);

						var attrDataType = attributeDefinition.dataType;
						var attrDataFormat = attributeDefinition.format;

						// Hide the time portion of date time properties for P8 if configured in the desktop.
						if (attributeDefinition.repositoryType == "p8" && ecm.model.desktop.enableHideTimePortion && attrDataType == "xs:timestamp") {
							attrDataFormat = ecm.model.desktop.valueFormatter.getDefaultFormat("xs:date");
						}

						var attrValues;

						if ((reason == "editProperties" || reason == "viewEditProperties" || reason == "multiEditProperties") && (attributeDefinition.repositoryType == "p8" || attributeDefinition.repositoryType == "cm" || attributeDefinition.repositoryType == "cmis")) {
							// When editing properties under P8, CM and CMIS, dependent attribute definitions are retrieved. 
							// The attribute definition contains the value we should use.
							// The value may be from the item's current property value, or the value entered by the user, or the class default value,
							// or the value set by a property filter. 
							attrValues = attributeDefinition.defaultValue;
						} else {
							if (item) {
								attrValues = item.getValue(attributeDefinition.id);
							}
							// If the attribute value is not yet set or is set to an empty value and the attribute definition requires a value,
							// then use the attribute definition default value.
							if (typeof attrValues === "undefined" || (attributeDefinition.required && AttributeDefinition.isValueEmpty(attrValues))) {
								attrValues = attributeDefinition.defaultValue;
							}
						}

						// If no value is assigned, assign the empty value.
						// If the value is undefined or null...
						if (attrValues == null) {
							attrValues = [];
						} else {
							// The attribute value must be an array. 
							// Both array tests are needed because instanceof Array does not recognize arrays created under a different window.
							if (!((attrValues instanceof Array) || (!attrValues.propertyIsEnumerable('length') && (typeof attrValues === 'object') && (typeof attrValues.length === 'number')))) {
								attrValues = [
									attrValues
								];
							}
						}

						if (attributeDefinition.contentClass && attributeDefinition.contentClass.repository)
							this.repository = attributeDefinition.contentClass.repository;

						var kwArgs = {
							id: widgetId,
							dataType: attrDataType,
							dataFormat: attrDataFormat,
							readOnly: readOnly,
							values: attrValues,
							valueTimeZoneOffset: (item && item.attributeValueTimeZoneOffsets) ? item.attributeValueTimeZoneOffsets[attributeDefinition.id] : attributeDefinition.valueTimeZoneOffset,
							invalidMessage: attributeDefinition.formatDescription && lang.replace(this._messages.property_invalid_with_format, [
								attributeDefinition.formatDescription
							]),
							minValue: attributeDefinition.minValue,
							minValueTimeZoneOffset: attributeDefinition.minValueTimeZoneOffset,
							maxValue: attributeDefinition.maxValue,
							maxValueTimeZoneOffset: attributeDefinition.maxValueTimeZoneOffset,
							maxLength: attributeDefinition.maxLength,
							minLength: attributeDefinition.minLength,
							cardinality: attributeDefinition.cardinality,
							uniqueValues: attributeDefinition.uniqueValues,
							requiredClass: attributeDefinition.requiredClass,
							choiceList: attributeDefinition.getChoiceList(true),
							choiceListNested: attributeDefinition.isChoiceListNested(),
							required: attributeDefinition.required,
							repositoryType: attributeDefinition.repositoryType,
							name: attributeDefinition.id,
							label: attributeDefinition.name,
							description: attributeDefinition.description,
							repository: this.repository, // Required by the user group selector.
							attributeDefinition: attributeDefinition,
							valueOptions: attributeDefinition.getAllowedValuesSelectOptions(),
							multiSelect: false,
							promptText: attributeDefinition.promptText, // Will override normal prompt that would be dynamically created from meta data.
							// For CMIS.
							openChoice: attributeDefinition.openChoice,
							propertyEditor: attributeDefinition.propertyEditor,
							isSystem: attributeDefinition.system,
							tooltipPosition: attributeDefinition.tooltipPosition || this.tooltipPosition
						};

						var clearNode = null;
						if (reason == "multiEditProperties") {

							// Make the required parameter false, so we don't get validation errors
							// when the user doesn't enter a value. For re-rendering, retain the required
							// parameter if the new value is blank, using a flag set previously.
							if (attributeDefinition._multiSelectUseRequiredValue == "undefined" || attributeDefinition._multiSelectUseRequiredValue == null || attributeDefinition._multiSelectUseRequiredValue == false) {
								kwArgs.required = false;
							}
							kwArgs.multiSelect = true;

							var tdClear = domConstruct.create("td", {
								'class': 'propertyRowClear'
							}, tr);
							if (attributeDefinition.required == false && readOnly == false) {
								clearNode = domConstruct.create("span", {
									id: this.id + attributeDefinition.id,
									tabIndex: 0
								}, tdClear);
								domClass.add(clearNode, "ecmClearLink");
								clearNode.innerHTML = ecm.messages.properties_clear_label;
								var fieldName = attributeDefinition.id;
								this.connect(clearNode, "onclick", lang.hitch(this, function(e) {
									this.onClearProperty(kwArgs, clearNode);
								}));
								this.connect(clearNode, "onkeydown", lang.hitch(this, function(e) {
									// Clear if enter.
									if (e.keyCode == 13) {
										this.onClearProperty(kwArgs, clearNode);
										Tooltip.hide(clearNode);
									}
								}));

								this._createTooltip(clearNode, ecm.messages.properties_clear_tooltip);
							}

							var tdAppend = domConstruct.create("td", {
								'class': 'propertyRowAppend'
							}, tr);
							var self = this;
							if (attributeDefinition.readOnly == false && (attributeDefinition.cardinality.toUpperCase() == "LIST" || attributeDefinition.cardinality.toUpperCase() == "MULTI")) {
								// Destroy old append checkboxes if they were created previously.
								var oldCheckbox = registry.byId(this.id + attributeDefinition.id + "append");
								if (oldCheckbox != null) {
									oldCheckbox.destroyRecursive();
								}

								var checkBoxDisabled = true;
								if (attrValues.length > 1) {
									checkBoxDisabled = false;
								} else if (attrValues.length == 1 && attrValues[0].length > 0) {
									checkBoxDisabled = false;
								}

								var appendCheckBox = new dijit.form.CheckBox({
									name: attributeDefinition.id + "append",
									id: this.id + attributeDefinition.id + "append",
									checked: false,
									disabled: checkBoxDisabled,
									onClick: function() {
										self.onAppendClick(attributeDefinition.id, this.get("checked"));
									}
								});
								tdAppend.appendChild(appendCheckBox.domNode);

								var appendLabel = domConstruct.create("label", {
									'for': appendCheckBox.id,
									innerHTML: ecm.messages.multi_edit_append_checkbox_label
								}, tdAppend);

								this._createTooltip(appendCheckBox.id, ecm.messages.multi_edit_append_checkbox_tooltip);
							}
						}

						// For group attributes that have voting approval.
						if (attributeDefinition.dataType == "xs:group") {
							this._setupVotingAttribute(item, kwArgs, attributeDefinition);
						}

						//a function that is called when the create control is completed
						//it is created within the closure to avoid passing all the parameters
						var createControlCompletedFunction = lang.hitch(this, function(field) {
							// If appropriate, adjust the field value control widths to better fit the page/dialog display (makes the value controls wider)
							if (reason != "multiEditProperties" && reason != "viewEditProperties") {
								var widthClass = this.getControlValueWidthClass(kwArgs);
								if (widthClass != null) {
									if (field.setDropDownClass) {
										field.setDropDownClass(widthClass);
									} else {
										domClass.add(field.domNode, widthClass);
									}
								}
							}

							this._propertyEditors.appendField(field);

							var hoverHelp = this._createHoverHelp(field.getPromptText());
							tdLabel.appendChild(hoverHelp.domNode);
							if (field.setHoverHelp) {
								field.setHoverHelp(hoverHelp);
							}

							tdValue.appendChild(field.domNode);

							// For dependent attributes, setup a handler for when the attribute value changes.
							// Some widgets fire a change event when focus passes through when the widget is read only.
							// Don't setup the handler for read only fields.
							if (!readOnly && attributeDefinition.hasDependentAttributes) {
								this._setupDependentAttribute(attributeDefinitions, item, reason, attributeDefinition, field, params);
							}

							// Any changes to the handling below should also be applied to ChildComponentPropertiesPane.js _createDataRow(). 
							if (attributeDefinition.dataType == "xs:reference") {
								this.connect(field, "onClick", "onClickReferenceAttribute");
							} else {
								this.connect(field, "onKeyPress", "_onKey");
								this.connect(field, "onKeyUp", "_onKey");
								this.connect(field, "onKeyDown", "_onKey");
								this.connect(field.domNode, "onpaste", lang.hitch(this, function(evt) {
									// Allow the paste to finish before firing the change notification.
									setTimeout(lang.hitch(this, function() {
										this.onPropertyChanged(evt);
									}), 0);
								}));
								if (attributeDefinition.dataType == "xs:date" || attributeDefinition.dataType == "xs:time" || attributeDefinition.dataType == "xs:timestamp" || attributeDefinition.dataType == "xs:boolean") {
									// There is a slight delay before date/time fields send out an onChange notification for the initial value assignment.
									// Allow some time for that to happen before connecting the onPropertyChange() event, or the initial value assignment
									// will be treated as a user change.
									setTimeout(lang.hitch(this, function() {
										this.connect(field, "onChange", "onPropertyChanged"); // For pickers.
									}), 100);
								} else if (attributeDefinition.dataType == "xs:group" || attributeDefinition.dataType == "xs:user") {
									this.connect(field, "onChange", "onPropertyChanged"); // User-group picker should send out onChange for validation.
								} else if (attributeDefinition.getChoiceList() != null || (lang.isArray(attributeDefinition.allowedValues) && attributeDefinition.allowedValues.length > 0)) {
									// Delay connecting the onChange handler to avoid a false positive during the initial value assignment
									setTimeout(lang.hitch(this, function() {
										this.connect(field, "onChange", "onPropertyChanged"); // Choice list fields should send out onChange for validation.
									}), 100);
									this.connect(field, "onBlur", function() {
										// Handle blur as a change event for FilteringSelect.
										// Needed to remove from propertyEditors invalidFields collection. RTC 41032.
										if (this.fieldschanged == true) {
											this._propertyEditors.validateField(field);
											this.onPropertyChanged();
										}
									});
								} else if (attributeDefinition.cardinality == "LIST") {
									this.connect(field, "onChange", "onPropertyChanged"); // Fields with value lists should send out onChange for validation.
								}
							}

							if (attributeDefinition.markingList) {
								this.connect(field, "onChange", "onMarkingPropertyChange"); // Marking list. 
							}

							if (reason == "multiEditProperties") {
								// Listen for an event so we know when cleared properties have been set to a value.
								this.connect(field, "onChange", lang.hitch(this, function() {
									this._onPropertyValueChanged(kwArgs, clearNode);
								}));

								// For read only properties, add "Read only" text when in multi edit mode.
								if (readOnly) {
									var field = this._propertyEditors.getFieldWithName(kwArgs.name);

									if (field.displayReadOnlyText) {
										field.displayReadOnlyText();
									} else {
										field.set("placeHolder", ecm.messages.properties_value_read_only);
									}

									// Add a tooltip that JAWS can read informing the user the property is read only.
									this.connect(field, "_onFocus", function() {
										if (this._multiEditReadOnlyTooltip) {
											this._multiEditReadOnlyTooltip.destroyRecursive();
										}
										this._multiEditReadOnlyTooltip = new Tooltip({
											label: string.substitute(ecm.messages.multi_edit_properties_readonly_tooltip_text, [
												attributeDefinition.name
											])
										});
										this._multiEditReadOnlyTooltip.open(field.domNode);
									});

									this.connect(field, "onBlur", function() {
										if (this._multiEditReadOnlyTooltip) {
											this._multiEditReadOnlyTooltip.close();
										}
									});
								}
							}
							field.attributeDefinition = attributeDefinition;
							this.onPropertyRendered(tr, field);
						});

						//in order to maintain backwards compatibility, only the new custom property editors will be called via the callback.
						//all other fields creates and retrieves a control synchronously.
						if (kwArgs.propertyEditor && kwArgs.propertyEditor.length > 0) {
							this.createControl(kwArgs, attributeDefinition, createControlCompletedFunction);
						} else {
							var field = this.createControl(kwArgs, attributeDefinition);
							createControlCompletedFunction(field);
						}
					}
				}))(attributeDefinitions[i]);
			}

			// Clear the fixed size that maintained the attribute input area size while 
			// the widgets were removed and recreated.
			domStyle.set(this._attributesInputArea, {
				"width": "",
				"height": ""
			});

			// Don't consider rendering complete until the form finishes applying values.
			setTimeout(lang.hitch(this, function() {
				if (lastFocusedFieldName) {
					this.setFieldFocus(lastFocusedFieldName);
				}
				delete this._renderingAttributes;
				this.onCompleteRendering();
				if (this._retrySave) {
					delete this._retrySave;
					this.onRetrySave();
				}
			}), 100);

			this.logExit("renderAttributes");
		},

		/**
		 * @private
		 */
		_onPropertyValueChanged: function(kwArgs, clearNode) {
			var field = this._propertyEditors.getFieldWithName(kwArgs.name);
			if (kwArgs.cardinality == "SINGLE" && kwArgs.choiceListNested == false) {
				if (kwArgs.dataType == "xs:boolean") {
					if (field.value != 0) {
						field.set("placeHolder", "");
						this.onPropertyValueSet(kwArgs);
						if (clearNode != null) {
							domStyle.set(clearNode, "display", "inline");
						}
					}
				} else if (field != null && field.value != null && field.value.toString().length > 0) {
					// Since they entered a value, reset the control so it is no longer cleared.
					if (kwArgs.dataType == "xs:timestamp" || kwArgs.dataType == "xs:date" || kwArgs.dataType == "xs:time") {
						field.set("placeHolder", kwArgs.dataFormat);
					} else {
						field.set("placeHolder", "");
					}
					if (clearNode != null) {
						domStyle.set(clearNode, "display", "inline");
					}
					this.onPropertyValueSet(kwArgs);
				}
			} else {
				this.onPropertyValueSet(kwArgs);
				if (clearNode != null) {
					domStyle.set(clearNode, "display", "inline");
				}

				// Ensable/disable the append checkbox.
				var appendCheckbox = registry.byId(this.id + kwArgs.name + "append");
				if (appendCheckbox) {
					if (field != null && field.value != null && field.value.toString().length > 0) {
						appendCheckbox.set("disabled", false);
					} else {
						appendCheckbox.set("checked", false);
						appendCheckbox.set("disabled", true);
						this.onAppendClick(kwArgs.name, false);
					}
				}
			}
		},

		/**
		 * Called when a property is cleared in multi edit mode.
		 */
		onClearProperty: function(kwArgs, clearNode) {
			var field = this._propertyEditors.getFieldWithName(kwArgs.name);
			if (field != null) {

				// Hide the clear link.
				if (clearNode != null) {
					domStyle.set(clearNode, "display", "none");
				}

				if (kwArgs.cardinality == "SINGLE") {
					if (kwArgs.choiceListNested == false) {

						// If the control supports a placeholder, use it.
						if (kwArgs.dataType == "xs:timestamp" || kwArgs.dataType == "xs:time" || kwArgs.dataType == "xs:date") {
							field.set("value", null);
						} else if (kwArgs.dataType == "xs:boolean") {
							field.set("value", 0);
						} else {
							field.set("value", "");
						}
						field.set("placeHolder", ecm.messages.properties_value_empty);
					} else {
						field.setMultiSelectClear(kwArgs);
					}
				} else {
					// Disable the append checkbox.
					var appendCheckbox = registry.byId(this.id + kwArgs.name + "append");
					if (appendCheckbox) {
						appendCheckbox.set("checked", false);
						appendCheckbox.set("disabled", true);
						this.onAppendClick(kwArgs.name, false);
					}
					field.setMultiSelectClear(kwArgs);
				}
				this.onPropertyChanged();
			}
		},

		/**
		 * @private
		 */
		_setupDependentAttribute: function(attributeDefinitions, item, reason, attributeDefinition, field, params) {
			var methodName = "_setupDependentAttribute";
			this.logEntry(methodName, "attributeDefinition: " + attributeDefinition.id);
			var self = this;
			var setValuesFunc = {
				setValues: function(values) {
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

					// Guard against entering while a retrieve is already in progress.
					// This setValues() method is connected to both the onBlur and onChange events below,
					// so may be called twice for some widgets. If only onChange or onBlur are connected
					// to widgets then the _retrievingDependentAttributesField field and test should be removed.
					self._retrievingDependentAttributesField = field;
					var attributes = {};
					// Send the complete set of properties.
					// Include all read only, hidden, and empty property values.
					var properties = [];
					if (reason == "multiEditProperties" && self.dependentPropertyObject != null) {
						// Get properties from the dependentPropertyObject first, then replace any with those
						// entered by the user.
						var propertyObject = new Object();
						for (objectPropertyIndex in self.dependentPropertyObject.attributes) {
							var property = new Object();
							property.name = objectPropertyIndex;
							property.value = self.dependentPropertyObject.attributes[objectPropertyIndex];
							property.dataType = self.dependentPropertyObject.attributeTypes[objectPropertyIndex];
							property.label = self.dependentPropertyObject.attributeLabels[objectPropertyIndex];
							propertyObject[objectPropertyIndex] = property;
						}

						// Ignore empty property values.
						var userProperties = self.getPropertiesJSON(true, true, true);
						for (userPropertyIndex in userProperties) {
							var userProperty = userProperties[userPropertyIndex];
							propertyObject[userProperty.name] = userProperty;
						}

						for (propertyIndex in propertyObject) {
							properties.push(propertyObject[propertyIndex]);
						}

					} else {
						properties = self.getPropertiesJSON(true, true, false);
					}

					for ( var i in properties) {
						self.logDebug(methodName, "prop set " + properties[i].name + " to " + properties[i].value);
						attributes[properties[i].name] = properties[i].value;
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

					var childComponentValues = self.getChildComponentValues();

					// Handle restoring focus to the field that currently has focus,
					// and prevent the return of focus ("refocus") from the status dialog 
					// or focus will go to the first focusable element in the dialog, 
					// causing the dialog to scroll to the top.
					if (self._displayStatusDialogEventHandle == null) {
						var lastFocusedFieldName;
						self._displayStatusDialogEventHandle = self.connect(Desktop, "onDisplayStatusDialog", function(statusDialog) {
							// Disconnect & cleanup.
							if (self._displayStatusDialogEventHandle != null) {
								self.disconnect(self._displayStatusDialogEventHandle);
								delete self._displayStatusDialogEventHandle;
							}
							// The attribute field that has focus will be destroyed, so disable refocus.
							self._statusDialogRefocus = statusDialog.refocus;
							statusDialog.refocus = false;

							// Remember the last focused field.
							lastFocusedFieldName = self.getFocusedFieldName();

							// Handle status dialog hide.
							self._hideStatusDialogEventHandle = self.connect(Desktop, "onHideStatusDialog", function(statusDialog) {
								// Disconnect & cleanup.
								if (self._hideStatusDialogEventHandle != null) {
									self.disconnect(self._hideStatusDialogEventHandle);
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
							});
						});
					}

					var context = {};
					if (reason == "create")
						context.action = "addItem";
					else if (reason == "editParameters")
						context.action = "workflow";
					else
						context.action = reason;
					if (params && params.entryTemplate) {
						context.entryTemplateId = params.entryTemplate.id;
						context.entryTemplateName = params.entryTemplate.name;
						if (params.entryTemplate.repository._isP8()) {
							context.entryTemplateVsId = params.entryTemplate.vsId;
						} else if (entryTemplate.repository._isCM()) {
							context.entryTemplateItemId = params.entryTemplate.itemId;
						}
					}

					attributeDefinition.contentClass.retrieveDependentAttrDefs({
						attributes: attributes,
						context: context,
						childComponentValues: childComponentValues,
						callback: function(newAttributeDefinitions, newChildCompDefs, newChildComponents) {
							// Disconnect the connection to status dialog open here if it hasn't been disconnected yet (no status dialog was displayed).
							if (self._displayStatusDialogEventHandle != null) {
								self.disconnect(self._displayStatusDialogEventHandle);
								delete self._displayStatusDialogEventHandle;
							}

							self._updateDependentAttributeRenderings(newAttributeDefinitions, attributeDefinitions, reason, attributes);

							if (newChildCompDefs) {
								self.renderChildComponents(newChildCompDefs, item, false, newChildComponents, reason);
							}

							delete self._retrievingDependentAttributesField;
							// Resume save is handled in renderAttributes().
						},
						isBackgroundRequest: false,
						onError: function(response) {
							delete self._retrievingDependentAttributesField;
							delete self._retrySave;
							self._propertiesAreInvalid = true;
						}
					});
				}
			};

			// Originally this included onKeyUp and onMouseUp, but these caused issues for dependent choice lists (over-updating, erasing errors).
			var callSetValueFunction = lang.hitch(this, "_callSetValue", field, setValuesFunc);
			field.connect(field, "onChange", callSetValueFunction);
			// onBlur may be needed for widget cases that do not fire an onChange.
			// If this onBlur connect is removed, or if either onChange or onBlur are connected for each
			// widget instead of both, then the _retrievingDependentAttributes used above may be removed.
			field.connect(field, "onBlur", callSetValueFunction);

			this.logExit(methodName);
		},

		/**
		 * @private
		 */
		_callSetValue: function(field, targetObject) {
			var methodName = "_callSetValue";
			this.logEntry(methodName, "targetObject: " + targetObject.declaredClass);
			if (!field._isDestroying) { // onChange() is called during destroy
				// If the value is invalid, do not update the value and dp not invoke dependent attribute handling.
				if ((targetObject && targetObject.setValues && field && field.getValueAsArray) && (!field.isValid || field.isValid())) {
					this.logDebug(methodName, "set field: " + field.name + " values: " + field.getValueAsArray());
					targetObject.setValues(field.getValueAsArray());
				}
			}
			this.logExit(methodName);
		},

		/**
		 * @private
		 */
		_setupVotingAttribute: function(item, kwArgs, attributeDefinition) {
			if (attributeDefinition.getMetaData("votingParameter")) {
				kwArgs.votingParameter = attributeDefinition.getMetaData("votingParameter");
				kwArgs.votingNumber = attributeDefinition.getMetaData("votingNumber");
			}
		},

		/**
		 * @private
		 */
		_createHoverHelp: function(promptText) {
			var hoverHelp = new HoverHelp({
				message: promptText
			});
			hoverHelp.startup();
			if (!this._hoverHelpArray) {
				this._hoverHelpArray = [];
			}
			this._hoverHelpArray.push(hoverHelp);
			return hoverHelp;
		},

		/**
		 * @private
		 */
		_createTooltip: function(nodeOrId, label) {
			var tooltip = new Tooltip({
				connectId: nodeOrId,
				label: label,
				position: this.tooltipPosition
			});
			if (!this._tooltipArray)
				this._tooltipArray = [];
			this._tooltipArray.push(tooltip);
		},

		/**
		 * @private
		 */
		_updateDependentAttributeRenderings: function(newAttributeDefinitions, currentAttributeDefinitions, reason, oldAttributes) {
			var methodName = "_updateDependentAttributeRenderings";
			this.logEntry(methodName);

			// For better performance, create a lookup by id on the new attribute definitions.
			var attrDefNdx;
			var newAttrDef;
			var newAttrDefsById = {};
			for (attrDefNdx in newAttributeDefinitions) {
				newAttrDef = newAttributeDefinitions[attrDefNdx];
				newAttrDefsById[newAttrDef.id] = newAttrDef;
			}

			// For multi item edit, get the current values in the editors. We'll either use them or use the updated values,
			// depending on if they are different from the original values.
			var displayedPropertiesById = {};
			if (reason == "multiEditProperties") {
				var displayedProperties = this.getPropertiesJSON(true, true, false);
				for (displayedPropertyIndex in displayedProperties) {
					displayedPropertiesById[displayedProperties[displayedPropertyIndex].name] = displayedProperties[displayedPropertyIndex];
				}
			}

			var currentAttrDefsById = {};

			for (attrDefNdx in currentAttributeDefinitions) {
				var oldAttrDef = currentAttributeDefinitions[attrDefNdx];
				currentAttrDefsById[oldAttrDef.id] = oldAttrDef;
				var newAttrDef = newAttrDefsById[oldAttrDef.id];
				if (newAttrDef && newAttrDef.updated) {

					// If the choice list is set to "default" then use the original class choice list.
					// This needs to be handled here, before the multiEditProperties handling.
					if (newAttrDef.updatedChoiceList && newAttrDef.choiceList == "default") {
						newAttrDef.choiceList = null;
						if (oldAttrDef.contentClass) {
							var classAttr = oldAttrDef.contentClass.attributeDefinitionsById[oldAttrDef.id];
							if (classAttr && classAttr.choiceList) {
								newAttrDef.choiceList = classAttr.choiceList;
							}
						}
					}
				}

				if (reason == "multiEditProperties") {

					// See if the old and new values are equal.
					var valuesSame = false;
					if (newAttrDef.cardinality == "SINGLE") {
						if (oldAttributes[oldAttrDef.id] == newAttrDef.defaultValue) {
							valuesSame = true;
						}
					} else if (newAttrDef.cardinality == "LIST" && newAttrDef.defaultValue != null && oldAttributes[oldAttrDef.id] != null) {
						if (newAttrDef.defaultValue.length == oldAttributes[oldAttrDef.id].length) {
							valuesSame = true;
							for ( var index in newAttrDef.defaultValue) {
								var attributeDefValue = newAttrDef.defaultValue[index];
								var objectValue = oldAttributes[oldAttrDef.id][index];
								if (objectValue != attributeDefValue) {
									valuesSame = false;
									break;
								}
							}
						}
					}

					// For multi item editing, display a blank value unless the new value is different the old
					// one, or the user has changed the value.
					if (valuesSame == true) {
						var origDefaultValue = newAttrDef.defaultValue;
						var checkForClear = false;
						if (displayedPropertiesById[oldAttrDef.id] != null) {
							newAttrDef.defaultValue = displayedPropertiesById[oldAttrDef.id].value;
							newAttrDef.updated = true;
							newAttrDef.updatedDefaultValue = true;
							checkForClear = true;
						} else {
							newAttrDef.defaultValue = oldAttrDef.defaultValue;
							newAttrDef.updated = true;
							newAttrDef.updatedDefaultValue = true;
							checkForClear = true;
						}

						// If we set the new value to blank, see if we need to handle it like a clear if the originial default
						// value isn't in the choice list.
						if (checkForClear == true && newAttrDef.choiceList != null) {
							var foundChoice = false;
							for ( var choiceIndex in newAttrDef.choiceList.choices) {
								var choice = newAttrDef.choiceList.choices[choiceIndex];
								if (choice.value == origDefaultValue) {
									foundChoice = true;
									break;
								}
							}
							if (foundChoice == false) {
								this._clearNewPropertyValue(newAttrDef);

								// Set a flag to force the user to enter a value if the property is required 
								// and EDS cleared it.
								if (newAttrDef.required == true) {
									oldAttrDef._multiSelectUseRequiredValue = true;
								}
							}
						}
					} else if (newAttrDef.defaultValue == "") {
						// If the new value is empty but the old one isn't treat like a clear.
						this._clearNewPropertyValue(newAttrDef);

						// Set a flag to force the user to enter a value if the property is required 
						// and EDS cleared it.
						if (newAttrDef.required == true) {
							oldAttrDef._multiSelectUseRequiredValue = true;
						}
					}
				} // if reason= multiproperties

				// mix the updated attribute def into the new one to obtain the updates
				// Note: The flags tested avoid overriding properties that did not change

				if (newAttrDef && newAttrDef.updated) {
					// The handling of choiceList = "default" is up above, before the multiEditProperties handling.
					this._mapAttributeSettings(oldAttrDef, newAttrDef, null, reason, null);
				}
			}

			// Add any new attribute definitions that were missing from the old attribute definitions.
			for ( var attrDefNdx in newAttributeDefinitions) {
				newAttrDef = newAttributeDefinitions[attrDefNdx];
				if (currentAttrDefsById[newAttrDef.id] === undefined) {
					// If this is the entry template builder, exclude attributes if they are system defined or set to hidden in the class definition.
					if (reason == "entryTemplateBuilder" && newAttrDef.system || (!newAttrDef.updatedHidden && newAttrDef.hidden)) {
						continue;
					}
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
			this.renderAttributes(currentAttributeDefinitions, null, reason, this._itemIsReadOnly);

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

			this.logExit(methodName);
		},

		/**
		 * @private
		 */
		_clearNewPropertyValue: function(newAttrDef) {
			var clearNode = dojo.byId(this.id + newAttrDef.id);
			if (clearNode != null) {
				var kwArgs = {
					name: newAttrDef.id,
					dataType: newAttrDef.dataType,
					cardinality: newAttrDef.cardinality,
					choiceListNested: newAttrDef.isChoiceListNested(),
					required: newAttrDef.required,
					choiceList: newAttrDef.getChoiceList(true)
				};
				this.onClearProperty(kwArgs, clearNode);
			}
		},

		/**
		 * Clears child component values
		 * 
		 * @param: childComponentId String id of the child component to clear.
		 */
		ClearChildComponent: function(childComponentId) {
			for ( var childCompIndex in this._childComponents) {
				var childComponentPane = this._childComponents[childCompIndex];
				if (childComponentPane.childComponentDefinition.id == childComponentId) {
					childComponentPane.Clear();
				}
			}
		},

		/**
		 * Renders the child components.
		 * 
		 * @param childCompDefinitions
		 *            An array of {@link ecm.model.ChildComponentDefinition} objects.
		 * @param item
		 *            The {@link ecm.model.ContentItem}.
		 * @param isReadOnly
		 *            A value of <code>true</code> if the entire item should be treated as read only.
		 * @param newChildComponents
		 *            An array of {@link ecm.model.ChildComponent} objects for the item.
		 */
		renderChildComponents: function(childCompDefinitions, item, isReadOnly, newChildComponents, reason) {
			var methodName = "renderChildComponents";
			this.logEntry(methodName, "item: " + (item ? item.name : "null"));
			this._childComponents = [];
			if (childCompDefinitions) {
				for ( var i in childCompDefinitions) {
					var childCompDefinition = childCompDefinitions[i];
					if (!item || !item.isChildComponentHidden(childCompDefinition.id)) {
						if (childCompDefinition.hasAttributes()) {
							var newChildComponent = this._getChildComponent(childCompDefinition.id, newChildComponents);
							var multiSelectEdit = (reason != undefined && reason == "multiEditProperties") ? true : false;
							var childComponentPropertiesPane = new ChildComponentPropertiesPane({
								_factory: this._factory,
								childComponentDefinition: childCompDefinition,
								childComponentItem: newChildComponent ? newChildComponent : (item ? item.getChildComponent(childCompDefinition.id) : null),
								readOnly: (isReadOnly == undefined) ? false : isReadOnly,
								multiSelectEdit: multiSelectEdit
							});
							this._childComponents.push(childComponentPropertiesPane);
							this._attributesInputArea.appendChild(childComponentPropertiesPane.domNode);

							this.connect(childComponentPropertiesPane, "onChange", "onPropertyChanged");
							this.connect(childComponentPropertiesPane, "onClickReferenceAttribute", "onClickReferenceAttribute");
							this.connect(childComponentPropertiesPane, "onNew", "onNewChildComponent");
							this.connect(childComponentPropertiesPane, "onClear", "onChildComponentCleared");
							this.connect(childComponentPropertiesPane, "onAppendClicked", "onAppendChildComponentClicked");
							this.connect(childComponentPropertiesPane, "onMultiEditChildComponentChange", "onMultiEditChildComponentChange");
						}
					}
				}
			}
			this.logExit(methodName);
		},

		/**
		 * @private
		 */
		_getChildComponent: function(id, childComponents) {
			if (childComponents) {
				for ( var i in childComponents) {
					var childComponent = childComponents[i];
					if (childComponent.name == id) {
						return childComponent;
					}
				}
			}
			return null;
		},

		/**
		 * Retrieves the array of child component values.
		 * 
		 * @return An array of child component values. Each entry contains the set of values for the corresponding child
		 *         component, in order.
		 */
		getChildComponentValues: function() {
			var array = [];
			if (this._childComponents) {
				for (var i = 0; i < this._childComponents.length; i++) {
					array[i] = this._childComponents[i].getValues();
				}
			}
			return array;
		},

		/**
		 * Handles resizing the common properties pane.
		 */
		resize: function(changeSize) {
			if (this._childComponents) {
				for (var i = 0; i < this._childComponents.length; i++) {
					this._childComponents[i].resize(changeSize);
				}
			}
		},

		/**
		 * Checks if the property fields contain valid values.
		 * 
		 * @param onEditStatus
		 *            A boolean value. If <code>true</code>, item properties are being modified. Only required
		 *            property fields and property fields that have been modified are checked.
		 * @param onSaveStatus
		 *            A boolean value. If <code>true</code>, changes are being saved. The first property field widget
		 *            from the list of property fields with invalid values is returned.
		 * @return Returns <code>null</code> if all checked property fields contain valid values. Otherwise, returns
		 *         the first property field widget that contains an invalid value.
		 */
		validateAll: function(onEditStatus, onSaveStatus) {
			this.logEntry("validateAll");
			var errorField = null;
			if (this._propertiesAreInvalid == true) {
				var fields = this.getFields();
				if (fields.length > 0) {
					return fields[0];
				}
			}
			if (onEditStatus && onEditStatus == true) {
				errorField = this.validateChangedField();
				// Add any invalid required fields to the invalid field list.
				this.validateRequiredFields();
				// If the current field passes, still need to check for other invalid fields.
				if (!errorField) {
					errorField = this.getFirstInvalidField();
				}
			} else {
				if (onSaveStatus && onSaveStatus == true) {
					errorField = this.getFirstInvalidField();
					if (!errorField) {
						errorField = this.validate();
					}
				} else {
					errorField = this.validate();
				}
			}

			if (!errorField && this._childComponents) {
				for (var i = 0; i < this._childComponents.length; i++) {
					var childComponent = this._childComponents[i];
					if (childComponent.multiSelectEdit == false || childComponent.multiEditChanged == true) {
						// Only validate changed child components when in multi item edit.
						errorField = childComponent.validate(onEditStatus, onSaveStatus);
						if (errorField) {
							break;
						}
					}
				}
			}

			// If there is no field error and the properties are being saved, treat a field with an in-progress EDS call as invalid.
			// This allows the EDS call to complete and the EDS updates to be applied.
			if (!errorField && onSaveStatus && this._retrievingDependentAttributesField) {
				errorField = this._retrievingDependentAttributesField;
				this._retrySave = true;
			}
			this.logExit("validateAll");
			return errorField;
		},

		/**
		 * @private
		 */
		_onKey: function(evt) {
			if (evt.keyCode != keys.TAB && evt.keyCode != keys.F1) {
				this.onPropertyChanged(evt);
			}
		},

		/**
		 * Retrieves the properties pane property editors.
		 * 
		 * @return A {@link ecm.widget.PropertyEditors} object.
		 */
		getPropertyEditors: function() {
			return this._propertyEditors;
		},

		/**
		 * Retrieves the properties pane property fields.
		 * 
		 * @return An array of field widgets.
		 */
		getFields: function() {
			return this._propertyEditors._fields;
		},

		/**
		 * Retrieves the field widget for the property named <code>fieldName</code>.
		 * 
		 * @param fieldName
		 *            The string Id of the property.
		 * @return The field widget for the property. The value <code>null</code> is returned if the property field is
		 *         not found.
		 */
		getFieldWithName: function(fieldName) {
			return this._propertyEditors.getFieldWithName(fieldName);
		},

		/**
		 * Returns whether the field widget for the property named <code>fieldName</code> is displayed (not hidden).
		 * 
		 * @param fieldName
		 *            The string Id of the property.
		 * @return True if the field is displayed in the property table.
		 */
		isFieldDisplayed: function(fieldName) {
			if (this._propertyEditors.getFieldWithName(fieldName)) {
				return true;
			} else {
				return false;
			}
		},

		/**
		 * Retrieves the field widget for the property identified by one of the property Id strings in
		 * <code>fieldNames</code>. Each property Id string in the array is checked against the property fields,
		 * starting with the first property Id string, until a matching property field is found.
		 * 
		 * @param fieldNames
		 *            An array of property Id strings.
		 * @return The first matching field widget is returned. The value <code>null</code> is returned if no matching
		 *         property field is found for any of the string Ids.
		 */
		getFieldWithEitherName: function(fieldNames) {
			return this._propertyEditors.getFieldWithEitherName(fieldNames);
		},

		/**
		 * Retrieves the property Id string for the first property field that contains text values.
		 * 
		 * @return A property Id string.
		 */
		getFirstTextPropertyName: function() {
			return this._propertyEditors.getFirstTextPropertyName();
		},

		/**
		 * Retrieves the first property field widget that has an invalid value.
		 * 
		 * @return A property field widget.
		 */
		getFirstInvalidField: function() {
			return this._propertyEditors.getFirstInvalidField();
		},

		/**
		 * Returns the name of the field that has focus.
		 * 
		 * @return The property Id string.
		 */
		getFocusedFieldName: function() {
			return this._propertyEditors.getFocusedFieldName();
		},

		/**
		 * Places focus in the property field identified by <code>fieldName</code>, if found. This is typically used
		 * to set the focus on a field that has an invalid value.
		 * 
		 * @param fieldName
		 *            The property Id string.
		 */
		setFieldFocus: function(fieldName) {
			var field = this._propertyEditors.getEditableFieldWithName(fieldName);
			if (field) {
				setTimeout(function() {
					// Scroll into view before setting focus so that tooltips are not dismissed by the scroll.
					win.scrollIntoView(field.domNode);
					field.focus();
				}, 300);
			}
		},

		/**
		 * Retrieves the value for the property field identified by <code>fieldName</code>.
		 * 
		 * @param fieldName
		 *            The property Id string.
		 * @return The value for the property field.
		 */
		getPropertyValue: function(fieldName) {
			return this._propertyEditors.getPropertyValue(fieldName);
		},

		/**
		 * Sets the value for the property field identified by <code>fieldName</code>.
		 * 
		 * @param fieldName
		 *            The property Id string.
		 * @param value
		 *            The new value for the property field.
		 */
		setPropertyValue: function(fieldName, value) {
			return this._propertyEditors.setPropertyValue(fieldName, value);
		},

		/**
		 * Sets the displayed value for the property field identified by <code>fieldName</code>. The actual value
		 * might be different.
		 * 
		 * @param fieldName
		 *            The property Id string.
		 * @param displayValue
		 *            The new display value for the property field.
		 */
		setPropertyDisplayedValue: function(fieldName, displayValue) {
			return this._propertyEditors.setPropertyDisplayedValue(fieldName, displayValue);
		},

		/**
		 * Retrieves the property values JSON string. See {@link ecm.widget.PropertyEditors}
		 * <code>getPropertiesJSON</code> for more details.
		 * 
		 * @param includeReadonly
		 *            A boolean value. If <code>true</code>, values for read only properties are included. Otherwise
		 *            read only property values are excluded from the JSON.
		 * @param includeHidden
		 *            A boolean value. if <code>true</code>, values for hidden properties are included. The parameter
		 *            <code>excludeEmptyValues</code> also applies to hidden properties.
		 * @param excludeEmptyValues
		 *            A boolean value. If <code>true</code>, properties with empty values are excluded.
		 * @return The JSON string for the current state of the properties.
		 */
		getPropertiesJSON: function(includeReadonly, includeHidden, excludeEmptyValues) {
			var properties = this._propertyEditors.getPropertiesJSON(includeReadonly, excludeEmptyValues);

			// Hidden properties do not have property editors. Use the value from the attribute definition. 
			if (includeHidden) {
				this._getHiddenPropertiesJSON(properties, this.attributeDefinitions, excludeEmptyValues);
			}

			return properties;
		},

		/**
		 * Enables or disables each data type <code>"xs:reference"</code> property field if it is not read only.
		 * 
		 * @param disableField
		 *            A boolean value. If a property field is not read only and contains data type
		 *            <code>"xs:reference"</code>, then the property field is disabled if <code>disableField</code>
		 *            is <code>true</code> or enabled if <code>disableField</code> is <code>false</code>. If the
		 *            field is read only or is not for data type <code>"xs:reference"</code> then no change is made to
		 *            the field.
		 */
		setDisabledNavigation: function(disableField) {
			var fields = this.getFields();
			for ( var i in fields) {
				var field = fields[i];
				if (!field.isReadOnly() && field.dataType == "xs:reference") {
					field.set("disabled", disableField);
				}
			}
		},

		/**
		 * Validates all of the property fields.
		 * 
		 * @return Returns <code>null</code> if all property fields contain valid values. Otherwise, returns the first
		 *         property field widget that contains an invalid value.
		 */
		validate: function() {
			return this._propertyEditors.validate();
		},

		/**
		 * Validates the changed property fields.
		 * 
		 * @return Returns <code>null</code> if all the changed property fields contain valid values. Otherwise,
		 *         returns the first changed property field widget that contains an invalid value.
		 */
		validateChangedField: function() {
			this._propertyEditors.validateChangedField();
		},

		/**
		 * Validates the required property fields.
		 * 
		 * @return Returns <code>null</code> if all required fields contain valid values. Otherwise, returns the first
		 *         required field that contains an invalid value.
		 * @since 2.0.2
		 */
		validateRequiredFields: function() {
			return this._propertyEditors.validateRequiredFields();
		},

		/**
		 * Assigns an error to a property field.
		 * 
		 * @param fieldName
		 *            A property Id string.
		 * @param errorMessage
		 *            The error message string.
		 * @param errorValue
		 *            The invalid value.
		 */
		setFieldError: function(fieldName, errorMessage, errorValue) {
			// Check regular properties.
			var field = this._propertyEditors.getEditableFieldWithName(fieldName);
			if (field) {
				field.setCustomValidationError(errorMessage);
				// Indicate that this field has had focus so that it is checked.
				field.focused = true;
			}

			// Check child components.
			if (fieldName.indexOf("[") > 0) {
				if (this._childComponents) {
					for (var i = 0; i < this._childComponents.length; i++) {
						var childComponent = this._childComponents[i];
						// If the field is in this child component...
						if (fieldName.indexOf(childComponent.childComponentDefinition.id + "/") == 0) {
							childComponent.setFieldError(fieldName, errorMessage, errorValue);
						}
					}
				}
			}
		},

		/**
		 * Retrieves the display value from the property field identified by <code>fieldName</code>.
		 * 
		 * @param fieldName
		 *            A property Id string
		 * @return The display value string.
		 */
		getPropertyDisplayValue: function(fieldName) {
			var methodName = "getPropertyDisplayValue";
			this.logEntry(methodName, "fieldName: " + fieldName);
			var field = this._propertyEditors.getFieldWithName(fieldName);
			var value = "";
			if (field != null) {
				value = field.get("displayedValue");
				if (value == null) {
					// Use the "value" instead.
					value = field.get("value");
				}
			}
			this.logExit(methodName, "displayedValue: " + value);
			return value;
		},

		/**
		 * This event method is called after a property has been rendered.
		 * 
		 * @param row
		 *            The rendered property row that contains the field.
		 * @param field
		 *            The field widget that was rendered in the property row.
		 */
		onPropertyRendered: function(row, field) {
		},

		/**
		 * This event method is called after the properties have been rendered.
		 */
		onCompleteRendering: function() {
		},

		/**
		 * This event method is called after a properties rendering has been cleared.
		 */
		onClearedRendering: function() {
		},

		/**
		 * This event method is called before the attributes are rendered.
		 */
		onAttributesRendering: function(attributeDefinitions) {

		},

		/**
		 * This event method is called after a property value is changed. Records that a field was changed and calls the
		 * properties pane <code>onChange</code> event method.
		 * 
		 * @param evt
		 *            An event object.
		 */
		onPropertyChanged: function(evt) {
			this.fieldschanged = true;
			this.onChange(evt);
		},

		/**
		 * This event method is called after a change in the property pane.
		 */
		onChange: function() {
		},

		/**
		 * Called when a property value is changed to a non empty value. Used in multi item property editing.
		 */
		onPropertyValueSet: function(kwArgs) {
		},

		/**
		 * This event method is called after a marking property value is changed. (IBM FileNet P8 only)
		 */
		onMarkingPropertyChange: function() {
		},

		/**
		 * Fired when the a child component is cleared in multi edit mode.
		 * 
		 * @param: childComponentId String id of child component
		 */
		onChildComponentCleared: function(childComponentId) {
		},

		/**
		 * Fired when the a new child component is added in multi edit mode.
		 * 
		 * @param: childComponentId String id of child component
		 */
		onNewChildComponent: function(childComponentId) {
		},

		/**
		 * Fired when the append childcomponet checkbox is clicked in multi edit mode.
		 */
		onAppendChildComponentClicked: function(childComponentId, checked) {
		},

		/**
		 * This event method is called after the user clicks on a reference attribute.
		 */
		onClickReferenceAttribute: function(evt) {
		},

		/**
		 * When a property change is applied to a field with dependent properties by the user attempting to save the
		 * changes, the save is interrupted by returning the field as being invalid until the EDS call completes. This
		 * event is fired after the EDS call returns and the EDS changes are applied so that the save operation can be
		 * retried.
		 */
		onRetrySave: function() {
		},

		/**
		 * Fired when the user clicks the Append checkbox for a multi value property in multi edit mode.
		 * 
		 * @param attributeDefId
		 *            String ID value of the attribute for the checkbox clicked.
		 * @param checked
		 *            Boolean indicating whether the checkbox is checked or unchecked.
		 */
		onAppendClick: function(attributeDefId, checked) {
		},

		onMultiEditChildComponentChange: function(childComponentId) {
		}

	});
});
