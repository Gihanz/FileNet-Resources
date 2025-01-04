define(["dojo/_base/declare","dojo/_base/lang","dojo/dom-style", "dojo/aspect","dijit/registry", "controller/BaseController"], function(declare, lang, domStyle, aspect, registry) {
return declare("WorkView", [BaseController],{
	loadWorkitems:function(listItem){ 
		getTransitionManager().performSegue(listItem, "WorkView", "view/WorkView.html",null,getCtrlInstance('WorkView'));
     },
     
     addItem: function(item,view) {
    	 var listItem = new dojox.mobile.ListItem({
    		 label: item.name,
    		 clickable: 'true',
             rightIcon: (item.locked) ? 'images/CheckedOut.png' : null
         });
         aspect.after(listItem,"onClick", lang.hitch(this, "showProperties", item, listItem));
         listItem.placeAt(view.containerNode);
     },
     
     onAfterTransition:function(view, moveTo, direction, transition, context, method){
    	 var destinationView = registry.byId('workItems'); destinationView.destroyDescendants();

    	 commonMIlayer = getMILA();

    	 if (commonMIlayer.currentRepository.repositoryId !=                  				 
    		 ecm.model.desktop.defaultRepositoryId){ commonMIlayer.setCurrentRepository(ecm.model.desktop.defaultRepositoryId);
    	 }
    	 
    	 startProgressIndicator(null, false); 
    	 commonMIlayer.retrieveWorkItems(lang.hitch(this,function(wItems) {
    		 for (var i in wItems.items) { 
    			 this.addItem(wItems.items[i],destinationView);
    		 }
    		 stopProgressIndicator(true);
          }));
     },
                    				 
     showProperties: function(wItem, listItem) {
    	 var sysProps = registry.byId("SystemPropertiesList"); var propHeading = registry.byId('propertiesHeading'); var propsView = registry.byId("propertiesView");
         var labelString = wItem.name;
         if (labelString != null && labelString.length > 13){ 
        	 labelString = labelString.substr(0,13) + "...";
         }
         propHeading.set('label', labelString); 
         propHeading.backButton.set("moveTo", "WorkView"); 
         propHeading.backButton.onClick = function() { 
        	 domStyle.set(registry.byId("SystemPropertiesList").domNode,'visibility','visible'); 
        	 domStyle.set(registry.byId('editPropertiesButton').domNode, 'visibility', 'visible');
        };
        domStyle.set(registry.byId('editPropertiesButton').domNode,'visibili ty', 'hidden');
        domStyle.set(registry.byId('systemPropertiesTitle').domNode, 'visibility','hidden');
        domStyle.set(sysProps.domNode, 'visibility','hidden');
        sysProps.destroyDescendants(); registry.byId("PropertiesList").destroyDescendants();
        for(var key in wItem.attributes) {
        	if(wItem.attributes[key]) {
            	addPropertyListItem([key,wItem.attributes[key]],'user'); 
            }
        }
        //scroll to top 
        dojo.setStyle(propsView.containerNode, {
        	webkitTransform: '',
            top: 0,
            left: 0
        });
        listItem.transitionTo('propertiesView');
    }
                    	 
                    	 
}); 
});
