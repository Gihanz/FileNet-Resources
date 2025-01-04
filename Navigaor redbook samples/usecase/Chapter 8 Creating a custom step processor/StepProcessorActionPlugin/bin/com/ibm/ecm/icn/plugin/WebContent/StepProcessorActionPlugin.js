require(["dojo/_base/declare",
         "dojo/_base/lang",
         "ecm/widget/viewer/ContentViewer" ],
function(declare, lang, ContentViewer ) {	
    lang.setObject("stepProcessorAction", function (repository, items, callback, teamspace, resultSet, parameterMap) {			
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
});
});