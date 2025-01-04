define([
		"dojo/_base/declare",
		"dijit/form/Button",
		"dijit/_TemplatedMixin",
		"dijit/_WidgetsInTemplateMixin",
		"ecm/model/Desktop",
		"ecm/MessagesMixin",
		"ecm/widget/dialog/BaseDialog",
		"ecm/widget/DatePicker",
		"eDUPluginDojo/EDUCompareVersionReport",
		"dojox/grid/EnhancedGrid",
		"dojox/grid/enhanced/plugins/DnD",
		"dojox/grid/enhanced/plugins/Menu",
		"dojox/grid/enhanced/plugins/IndirectSelection",
		"dojox/grid/enhanced/plugins/NestedSorting",
		"dojo/data/ItemFileWriteStore",
		"dojox/grid/cells/_base",
		"dijit/Tooltip",
		"dojo/text!eDUPluginDojo/templates/EDUCompareVersionDialog.html"
	],
	function(declare, Button, _TemplatedMixin, _WidgetsInTemplateMixin, 
			Desktop,MessagesMixin,BaseDialog,DatePicker,EDUCompareVersionReport,
			EnhancedGrid,DnD,Menu,IndirectSelection,NestedSorting,ItemFileWriteStore,
			_base,Tooltip,template) {
	return declare("eDUPluginDojo.EDUCompareVersionDialog", [ BaseDialog], {
		widgetsInTemplate: true,
		contentString: template,
		_closeDate: null,
		_items: null,
		_repository: null,
		myGrid: null,
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
			this._repository = repository;
			this._items = items;
			var dummyData, versionStore, myGridDiv, repositoryId;
			repositoryId = this._items[0].repository.id;
		
			try {
				this.myGrid = dijit.byId("_eDUPlugin_myGrid1");
				console.debug ("try to get this.myGrid 8");
				if (this.myGrid) {
					this.myGrid.destroyRecursive();
					this.myGrid = null;
				}
			} catch (err) {
				console.debug ("in show, err.message:- " + err.message);
			}

			this._createGrid();
			
			dummyData = {"items":[]};
			versionStore = new dojo.data.ItemFileWriteStore({
				data: dummyData
			});			
			console.debug ("versionStore 8");
			
			var versions, version, i;
			
			// need to do eval in order to convert the string to object
			versions = eval(response.Versions);
			// console.debug ("eval versions");
			console.debug (versions.length);
			for (i=0; i<versions.length; i++) {
				// console.debug(i);
				version = versions[i];
				// console.dir (version);
				console.debug ("version.Version=" + version.Version);
				var newVersion = versionStore.newItem(
					{
						"DateCreated":version.DateCreated,
						"DocumentTitle":version.MimeType + ";" + version.DocumentTitle,
						"DocumentTitle2":version.DocumentTitle,
						"Version":version.Version,
						"Creator":version.Creator,
						"DocID":version.DocID,
						"DocumentClass":version.DocumentClass,
						"ObjectStoreID":version.ObjectStoreID,
						"RepositoryId":repositoryId
					}
				);
			}
			versionStore.save();		
			console.debug("versionStore.save() 8");
			this.myGrid.setStore (versionStore);					
			console.debug("this.myGrid.setStore 8");
			
			// must place myGrid into this.containerNode work
			// if place in a div of the diaglog html does not work
			dojo.place(this.myGrid.domNode,this.containerNode,'first');
			console.debug("myGrid dojo.placed this.containerNode 8");
			
			this.myGrid.startup();		
			console.debug("this.myGrid.startup 8");				
			this.myGrid._refresh();			
			console.debug("this.myGrid.refresh 8");		
		
			this.inherited("show", []);
			/*
			// change the size of the dialog
			dojo.style(this.containerNode, {
				width: "500px",
				height: "300px"
			});	
			console.debug ("has modified this.containerNode width, height");
			*/	
			
		},
		_onClickOk: function() {
			// alert ("OK 18");
			var i, selected, data, status;
			
	        selected = this.myGrid.selection.getSelected();
			// console.debug(selected.length);
			if (selected.length < 2 || selected.length > 2) {
				alert ("Please select 2 document versions for comparison.")
				return;
			}
			
			var params = new Object();
			params.ServiceType = "CompareVersions";
			params.server = this._items[0].repository.id;
			params.serverType = this._items[0].repository.type;
			params.ndocs = 2;
			for(i = 0; i < selected.length; i++) {
				// console.dir(selected[i]);
				// the original sample java script want DocID0 to be in the format
				// of document class symbolic name, object store id, document id
				params["docID"+i] = selected[i].DocumentClass + "," + selected[i].ObjectStoreID + "," + selected[i].DocID[0];
			}
			console.dir(params);
			var thisDialog = this;

			ecm.model.Request.invokePluginService("EDUPlugin",
					"EDUCompareVersionService",
			{
					requestParams : params,
					requestCompleteCallback : function(response) {
						console.dir(response);
						report = response.Report;
						var reportDialog = new EDUCompareVersionReport;
						reportDialog.addReport(report);
					}
			});
			this.onCancel();
		},
		_createGrid: function() {
			
			var gridLayout = 
				[[
				{	
					field: "DocumentTitle",
					name: "Title",
					width: "auto",
					formatter:  function (value) { 
						var documentTitle = value.substring (value.indexOf(";")+1,value.length);
						var mimeType = value.substring (0,value.indexOf(";"));
						var imgTag = "";
						var imgValue = "";
						
						if (mimeType == "application\/vnd.ms-powerpoint" || mimeType == "application\/vnd.openxmlformats-officedocument.presentationml.presentation")
							imgValue = "ftPresentation64.png";
						else if (mimeType == "application\/msword" || mimeType == "application\/vnd.openxmlformats-officedocument.wordprocessingml.document")
							imgValue = "ftWordProcessing64.png";
						else if (mimeType == "image\/gif" || mimeType == "image\/jpeg" || mimeType == "image\/bmp" || mimeType == "image\/png" || mimeType == "image\/tiff")
							imgValue = "ftGraphic64.png";
						else if (mimeType == "application\/pdf")
							imgValue = "ftPdf64.png";
						else
							imgValue = "ftDefault64.png";
		
						imgTag = "<img src='" + "/navigator/ecm/widget/resources/images/" + imgValue + "' alt='NA' height='12' width='12'>";
						return imgTag + documentTitle;    
					},				
					editable: false,
					type: dojox.grid.cells.Cell
				},
				{
					field: "DocumentTitle2",
					name: "DocumentTitle2",
					hidden:true
				},
				{
					field: "Version",
					name: "Version",
					width: "auto",
					editable: false,
					type: dojox.grid.cells.Cell
				},			{
					field: "Creator",
					name: "Created By",
					width: "auto",
					editable: false,
					type: dojox.grid.cells.Cell
				},
				{
					field: "DateCreated",
					name: "Date Created",
					width: "auto",
					editable: false,
					type: dojox.grid.cells.Cell
				},			
				{
					field:"DocID",
					name: "DocID",
					hidden:true
				},			
				{
					field:"DocumentClass",
					name: "DocumentClass",
					hidden:true
				},			
				{
					field:"ObjectStoreID",
					name: "ObjectStoreID",
					hidden:true
				},			
				{
					field:"RepositoryId",
					name: "RepositoryId",
					hidden:true
				}]];	
			
			this.myGrid = new EnhancedGrid( {
				id: "_EDUPlugin_myGrid1",
				query: {},
				autoHeight: false,
				rowsPerPage: "5",
				structure: gridLayout,
				plugins: {
					indirectSelection: 
					{
						headerSelector:true, 
						name:"selectVersion", 
						width:"15px", 
						styles:"text-align: center;"
						}
				}
			}, dojo.create("div", {style: "margin: 0px auto 0px auto; text-align: left; height: 150px; width: 700px"}) );	
			console.debug ("this.myGrid 8");
			
			dojo.connect(this.myGrid,"onRowDblClick",this,function(evt) {
				// alert ("onRowDblClick 88");
				var item = this.myGrid.getItem(evt.rowIndex);
				// console.dir (item);
				data = {};
				data.docid = item.DocID[0];
				data.template_name = item.DocumentClass[0];
				data.repositoryId = item.RepositoryId[0];
				this._viewContent (data);			
				// this.myGrid._refresh();			
			});
		},
		_viewContent: function(data) {
			console.debug ("in _viewContent");	
			// repositoryId is not the object store name or object store symbolic name
			// it is the id of the repository that is created in ICN
			var url =  "/navigator/bookmark.jsp?" +
				"repositoryId=" + data.repositoryId + "&docid=" + data.docid + "&template_name=" + data.template_name;
			var width = window.screen.availWidth*0.6;
			var height = window.screen.availHeight*0.6;
			var left = (window.screen.width-width)/2;
			var top = (window.screen.height-height)/2;
			var args = "toolbar=no,location=no,menubar=no,resizable=yes,scrollbars=yes,status=yes," + 
				"width="+width+",height="+height+",top="+top+",left="+left;
			window.open(url,"",args);
		}
	});
});
