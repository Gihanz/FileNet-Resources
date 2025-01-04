define(["dojo/_base/declare", 
        "ecm/model/Action"
    ],
	function(declare, Action) {

	return declare("eDUPluginDojo.EDUCompareVersionActionModel", [ Action ], {
	
		isEnabled: function(repository, listType, items, teamspace, resultSet) {
			var enabled = true;
			return enabled;
		},

		isVisible: function(repository, listType) {
			return true;
		}
	});
});