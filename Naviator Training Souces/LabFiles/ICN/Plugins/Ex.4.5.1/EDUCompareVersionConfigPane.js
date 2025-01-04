define([
		"dojo/_base/declare",
		"dijit/_TemplatedMixin",
		"dijit/_WidgetsInTemplateMixin",
		"ecm/widget/ValidationTextBox",
		"ecm/widget/admin/PluginConfigurationPane",
		"dojo/text!eDUPluginDojo/templates/EDUCompareVersionConfigPane.html"
	],
/**
* @name eDUPluginDojo.EDUCompareVersionConfigPane
* @class
* @augments ecm.widget.admin.PluginConfigurationPane
*/
	function(declare, _TemplatedMixin, _WidgetsInTemplateMixin, ValidationTextBox, PluginConfigurationPane, template) {

		return declare("eDUPluginDojo.EDUCompareVersionConfigPane", [ PluginConfigurationPane, _TemplatedMixin, _WidgetsInTemplateMixin], {
			templateString: template,
			widgetsInTemplate: true,
			
			postCreate: function() {
				this.inherited(arguments);
			},
		
			load: function(callback) {
			},
			
			_onParamChange: function() {
			},
			
			validate: function() {
				return true;
			}			
	});
});