require(["dojo/_base/declare",
         "dojo/_base/lang",
		 "ecm/model/Request",
		 "eDUPluginDojo/EDUCompareVersionDialog"
	],

	function(declare, lang, Request,EDUCompareVersionDialog) {
		lang.setObject("compareVersionFunction", function (repository, items) {
			console.debug ("compareVersionFunction 1");
			var params = new Object();
			params.ServiceType = "GetVersions";
			console.dir(items);
			params.server = items[0].repository.id;
			params.serverType = items[0].repository.type;
			params.ndocs = items.length;
			for (var i in items) {
				params["docID"+i] = items[i].id;
			}
			console.dir (params);
			Request.invokePluginService("EDUPlugin", "EDUCompareVersionService", 
			{
				requestParams: params,			    		
				requestCompleteCallback: function(response) {
					console.dir(response);
					var getDateDialog = new EDUCompareVersionDialog();
					console.dir(getDateDialog);
					getDateDialog.show(repository, items, response);
					getDateDialog = null;
				}
			});
		});

});
