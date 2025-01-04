define([
	"dojo/_base/declare", 
	"dojo/_base/lang",
	"dojo/dom-class",
	"dijit/_WidgetsInTemplateMixin",
	"dijit/form/Button",
	"ecm/widget/ValidationTextBox",
	"ecm/widget/dialog/SelectUserGroupDialog",
	"dojo/text!./templates/EDUPropertyEditor.html"
],
function(declare, lang, domClass, _WidgetsInTemplateMixin, Button, ValidationTextBox, SelectUserGroupDialog, template) { 

	return declare("eDUPluginDojo.eduPropertyEditor", [
	   ValidationTextBox,
	   _WidgetsInTemplateMixin
	], {
		/** @lends eDUPluginDojo.eduPropertyEditor.prototype */

		templateString: template,
		widgetsInTemplate: true,
		
		postCreate: function() {
			this.inherited(arguments);
			this.set("readOnly", true);
			// Remove the base class from the domNode
			domClass.remove(this.domNode, this.baseClass);
			domClass.add(this.domNode, "eduPropertyEditor");
		},
		
		destroy: function() {
			this.inherited(arguments);
			
			if (this.userLookupDialog) {
				this.userLookupDialog.destroy();
				this.userLoookupDialog = null;
			}
		},
		
		_buttonClick: function(evt) {
			if (!this.userLookupDialog) {
				this.userLookupDialog = new SelectUserGroupDialog({
					queryMode: "users",
					selectionMode: "single",
					callback: lang.hitch(this, function(user) {
						this.set("value", user[0].displayName);
					})
				});
			}
			
			this.userLookupDialog.show(this.repository);
		}
	});
});
