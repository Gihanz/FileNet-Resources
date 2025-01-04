define([
		"dojo/_base/declare",
		"dijit/Dialog",
		"dijit/_TemplatedMixin",
		"dijit/_WidgetsInTemplateMixin",
		"dojo/text!eDUPluginDojo/templates/EDUCompareVersionReport.html"
	],
/**
 * @name eDUPluginDojo.EDUCompareVersionReport
 * @class
 * @augments dijit.Dialog
 */
	function(declare, Dialog, _TemplatedMixin, _WidgetsInTemplateMixin, template) {
		return declare("eDUPluginDojo.EDUCompareVersionReport", [ Dialog, _TemplatedMixin, _WidgetsInTemplateMixin], {
			templateString: template,
			widgetsInTemplate: true,

			constructor: function() {
			},

			postCreate: function() {
				this.inherited(arguments);
			},
			
			addReport: function(report) {
				dojo.style(this.containerNode, {
					width: "800px",
					height: "600px"
				});	
				this.reportDiv.innerHTML = report;
				this.show();
			},

			clearReport: function(evt) {
				this.reportDiv.innerHTML = "";
			}
			
		});

});
