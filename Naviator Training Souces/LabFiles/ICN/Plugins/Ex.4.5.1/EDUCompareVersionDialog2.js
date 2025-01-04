define([
		"dojo/_base/declare",
		"dijit/Dialog",
		"dijit/_TemplatedMixin",
		"dijit/_WidgetsInTemplateMixin",
		"dojo/text!eDUPluginDojo/templates/EDUCompareVersionDialog.html"
	],
	function(declare, Dialog, _TemplatedMixin, _WidgetsInTemplateMixin, template) {
	return declare("eDUPluginDojo.EDUCompareVersionDialog", [ Dialog, _TemplatedMixin, _WidgetsInTemplateMixin], {
		widgetsInTemplate: true,
		templateString: template,
		_closeDate: null,
		_items: null,
		_repository: null,
		postCreate: function() {
			this.inherited(arguments);
			this.setTitle("EDU Compare Version");
			this.setIntroText("Select 2 document versions for comparison.");
			this.setSize (700,300);		
			console.debug ("this.setSize");
			this.okButton = this.addButton("Ok", "_onClickOk", false, true);
			console.log("Postcreate completed");
		},
		show: function(repository, items, response) {
			alert("Show called");
			this._repository = repository;
			this._items = items;
			var dummyData, versionStore, myGridDiv, repositoryId;
			repositoryId = this._items[0].getRepository().getId();
		}
	});
});
