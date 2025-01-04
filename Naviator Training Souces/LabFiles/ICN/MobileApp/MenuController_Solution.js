/*
 *  Licensed Materials - Property of IBM
 *  5725-G92 (C) Copyright IBM Corp. 2011, 2012. All Rights Reserved.
 *  US Government Users Restricted Rights - Use, duplication or
 *  disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *
 *  This is the controller for the "mainMenue" view
 */

define(["dojo/_base/declare","dijit/registry", "dojo", "controller/browse/browse", "controller/BaseController"],
function(declare, registry, dojo, browse) {
	return declare("MenuController", [
       BaseController
	],{
     featuresList:null,
     desktopName:null,
     viewUrl:"view/mainMenu.html",
     
     constructor :function(){
         setBrowse(browse);
         getControllersManager().register('browse', browse);
         //loading controllers
         dojo.require('controller/favoritesview/FavoritesViewController');
         dojo.require('controller/searchview/SearchViewController');
         dojo.require('controller/searchtemplateview/SearchTemplateViewController');
         dojo.require('controller/workview/WorkViewController');

     },
  
	 ////////////////////////////////// API ///////////////////////////////
	 setFeaturesList:function(featuresList){
	   this.featuresList = featuresList;
	 },

     setDesktop:function(dsName){
	   this.desktopName = dsName;
	 },

     onBeforeTransition:function(){
	 },
	 
     onAfterTransition:function(){
    	 if (showingOpeninTabBar){
    			var menuTabView = registry.byId('menuOpenInTabBar');
    			menuTabView.set('label', openinLabel);
             document.getElementById("menuFileTypeIcon").src = openinIcon;
             dojo.style(menuTabView.domNode, {visibility:'visible'});
    	 }
         if (!isBui()) {
             if (this.desktopName != '') {
                 if (this.desktopName.length > 11){
                     registry.byId('menuHeadID').set('label', this.desktopName.substr(0,11) + "...");
                 }
                 else {
                     registry.byId('menuHeadID').set('label', this.desktopName);
                 }
             }
             else {
                 registry.byId('menuHeadID').set('label', '');
             }
         }

    	 var menuList = registry.byId("menuList");
    	 menuList.destroyDescendants();
         var featuresCounter = 0;
    	 dojo.forEach(this.featuresList, function(entry, index) {
    		 
    		 if(entry.display){
                 featuresCounter++;
    			 var labelText = entry.name;
    			 var iconPath = 'images/' + labelText.toLowerCase() + '.png';
//    			 if (labelText == 'Case Search'){
//                     continue;
//    				 iconPath = 'images/acm.png';
//    			 }
    			 var onClickFunction = function() {};
                 var knownMenu = false;
                 if (labelText == 'Work') {
                	 knownMenu = true;
                     onClickFunction = function() { getCtrlInstance('WorkView').loadWorkitems(this); };
                 }
    			 if (labelText == 'Browse'){
                     knownMenu = true;
                     onClickFunction = function() {getBrowse().loadRepositories(this);};
    			 }else if (labelText == 'Favorites'){
                     knownMenu = true;
                     onClickFunction = function() {getCtrlInstance('FavoritesView').loadFavorites(this);};
    			 }else if (labelText == 'Search'){
                     knownMenu = true;
                     onClickFunction = function() {getCtrlInstance('SearchView').loadSearchTemplates(this);};
    			 }
    			 else if (!isBui() && (labelText == 'Datacap')){
                     labelText = 'Capture';
                     knownMenu = true;
                     onClickFunction = function() {getTransitionManager().performSimpleSegue(getRegistry().byId('loginID'),'DatacapEditView');};
                 }
                 if (knownMenu){
                     var menuTab = new dojox.mobile.ListItem({
                         icon: iconPath,
                         label: labelText,
                         class: "mblListItem",
                         clickable:'true',
                         noArrow:true,
                         onClick:onClickFunction
                     });
                     menuTab.placeAt(menuList.containerNode);
                     menuTab.startup();
                 }
    		 }
		});
        if (featuresCounter == 0){
            showOkDialog("Desktop configuration error","No mobile features are available for this desktop.");
            return;
        }
    	 //adding Datacap hardcoded TODO
//		 var menuTab = new dojox.mobile.ListItem({
//             icon: 'images/datacap.png',
//             label: 'Datacap',
//            class: "mblListItem",
//             clickable:'true',
//             onClick:function() {getTransitionManager().performSimpleSegue(getRegistry().byId('loginID'),'MyView');}
//             //onClick:function() {getTransitionManager().performSegue(this,"DatacapEditView", "view/DatacapEditView.html", null, getControllersManager().getControllerInstance('DatacapView'));}
//         });
//		 menuTab.placeAt(menuList.containerNode);
//         menuTab.startup();
	 },
     addFavoriteOnServer:  function (){
        hide('addFavoriteDialog');
        var itemId = document.getElementById("itemToAddToFavorites").value;
        var repositoryId = commonMIlayer.getCurrentRepository().repositoryId;
        commonMIlayer = getMILA();
        startProgressIndicator();
        commonMIlayer.addToFavorites(itemId,registry.byId('aliasName').value,repositoryId,null, function(newfavorite) {
        },null);
    },
	 logOffDesktop:function(){
		   startProgressIndicator();
		   getMILA().logOff(function(done){
				getTransitionManager().performSimpleSegue(getRegistry().byId('logOffBtn'),"view/desktop.html");					
			});
	 }
   });
  }
);

	