require(["dojo/_base/declare",
         "dojo/_base/lang"], 
function(declare, lang) {		
	/**
	 * Use this function to add any global JavaScript methods your plug-in requires.
	 */
lang.setObject("openAction", function(repository, items, callback, teamspace, resultSet, parameterMap) {
 /*
  * Add custom code for your action here. For example, your action might launch a dialog or call a plug-in service.
  */
	// action definition only permits one object in the array
	var item = items[0];
	// check if the item is a document
	if (!item.isFolder()) {
	// check if viewer instance exists 
	if (window.contentViewer != null) {
	// open the document in the viewer
	window.contentViewer.open(item);
	} 
	}
	console.log("Open");
});
lang.setObject("viewAction", function(repository, items, callback, teamspace, resultSet, parameterMap) {
 /*
  * Add custom code for your action here. For example, your action might launch a dialog or call a plug-in service.
  */
	
	// action definition only permits one object in the array
	var item = items[0];
	// check if the item is a document
	if (!item.isFolder()) {
	// check if viewer instance exists 
	if (window.contentViewer != null) {
	// open the document in the viewer
	window.contentViewer.preview(item,true);
	} 
	}
	console.log("Preview");
});
});
