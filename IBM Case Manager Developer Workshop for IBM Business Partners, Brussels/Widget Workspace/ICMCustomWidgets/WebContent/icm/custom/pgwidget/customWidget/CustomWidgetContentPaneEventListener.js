define(["dojo/_base/declare",
	"dojo/_base/lang",
	"icm/base/Constants",
	"icm/model/Case",
	"ecm/LoggerMixin"],
	function(declare, lang, Constants, Case, LoggerMixin){
    return declare("icm.custom.pgwidget.customWidget.CustomWidgetContentPaneEventListener", [LoggerMixin], {

	contentPane: null,
	searchTemplate: null,

	// An array of ever selected cases. This is used to refresh the case items when properties are changed.
	caseEditableArray: [],

    constructor: function(contentPane){
        this.contentPane = contentPane;
    },

	displayPayload: function(payload) {
        
	},

	initContentPane: function()	{
		this.contentPane.showContentNode();
		
		
	}


});
});
