define([ "dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/dom-geometry",
	"dojo/dom-style",
	"icm/base/BasePageWidget",
	"",
	"",
	"icm/widget/menu/MenuManager",
	"",
	"",
	"icm/base/BaseActionContext"], function(declare, lang, domGeom, domStyle, BasePageWidget,
		, , MenuManager, , , BaseActionContext){

    return declare("icm.custom.pgwidget.customWidget.CustomPageWidget", [contentPaneWidget, BasePageWidget, BaseActionContext], {

    	contentPaneEventListener: null,
    	topToolbar: null,
    	menu: null,

		/**
		 *
		 */
		postCreate: function(){
			this.inherited(arguments);
			this.contentPaneEventListener = new eventListener(this);
			this.contentPaneEventListener.initContentPane();
			
			//set your context defined for CustomContext so that action can get it for running as required;
			this.setActionContext("CustomContext", {customProperty: true});
			
			
			
			 if (!this.topToolbar)
             {
                 this.topToolbar = new toolBar({
             	     //consistent to the id value of the toolbar's definition in the page widget definition json file;
                 });
				  //set the toolbar as a content of the page widget in order to get the action configuration from page widget		
                 

                 // activate toolbar
                 
             }
			 
			 if (!this.menu)
             {
                 this.menu = new ContextualMenu({
             	     //consistent to the id value of the contextualMenu's definition in the page widget definition json file;
                 });
				 
				 //append the menu in the page widget in order to get the action configuration from page widget		 
				
				 
				 //set the target reference of the contextualMenu so that it can bound to the target point;
				
				//set your context defined for CustomContext so that action configured in contextualMenu can get it for running as required;
			    //That is another way to set the action context. If the target is grid, the following method could be called automatically;
			    

                 // activate menu
                 
             }

		},



		/**
		 * Handler for icm.Custom event.
		 *
		 * @param payload
		 *        	paylod of the event
		 */
		handleICM_CustomEvent: function(payload){
			if(!payload){
				return;
			}
			this.logInfo("handleSearchCasesEvent", payload);
			
		},



	});
});