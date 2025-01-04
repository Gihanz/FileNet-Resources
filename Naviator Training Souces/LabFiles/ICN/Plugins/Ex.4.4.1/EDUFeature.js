/**
 * Licensed Materials - Property of IBM (C) Copyright IBM Corp. 2012-2013 US Government Users Restricted Rights - Use,
 * duplication or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/dom-style",
	"dojo/_base/array",
	"dojo/dom-attr",
	"dojo/_base/connect",
	"dojo/dom-class",
	"dijit/layout/ContentPane",
	"dijit/layout/BorderContainer",
	"dijit/MenuBar",
	"dijit/PopupMenuBarItem",
	"dijit/MenuItem",
	"dijit/MenuSeparator",
	"idx/layout/BorderContainer",
	"ecm/model/Desktop",
	"ecm/widget/layout/BrowsePane",
	"ecm/widget/listView/ContentList",
	"ecm/widget/FolderTree",
	"ecm/widget/listView/modules/Bar",
	"ecm/widget/listView/modules/ViewDetail",
	"ecm/widget/listView/modules/ViewMagazine",
	"ecm/widget/listView/modules/ViewFilmStrip",
	"dojo/text!./templates/EDUFeature.html"
],

function(declare,
lang, 
domStyle, 
array,  
domAttr,
connect,
domClass,
ContentPane, 
BorderContainer, 
MenuBar,
PopupMenuBarItem,
MenuItem,
MenuSeparator,
idxBorderContainer, 
Desktop,
BrowsePane,
ContentList, 
FolderTree,
Bar,
ViewDetail,
ViewMagazine,
ViewFilmStrip,
template) {

	/**
	 * @name eDUPluginDojo.EDUFeature
	 * @class Provides a pane that is used to browse folders and documents.
	 * @augments ecm.widget.layout.BrowsePane
	 */
	return declare("eDUPluginDojo.EDUFeature", [ BrowsePane ], {
		/** @lends eDUPluginDojo.EDUFeature.prototype */

		templateString: template,
	
		widgetsInTemplate: true,
	
		constructor: function() {
			this.inherited(arguments);
			this._alterLayout();
		},
		
        /**
         * @override Removes unnecessary code relating to the repository selector
         */
		postCreate: function() {
			this.logEntry("postCreate");
			
			domAttr.set(this.folderContents.domNode, "role", "region");
			domAttr.set(this.folderContents.domNode, "aria-label", ecm.messages.browse_content_list_label);
			
			domAttr.set(this.folderTree.domNode, "role", "region");
			domAttr.set(this.folderTree.domNode, "aria-label", ecm.messages.browse_tree_label);
			domStyle.set(this.folderContents.topContainer.domNode, "display", "none");
			
			this.folderContents.setContentListModules(this.getContentListModules());
			this.folderContents.setGridExtensionModules(this.getContentListGridModules());
			this.connect(this.folderContents, "onModulesLoaded", lang.hitch(this, function() {
				var dndModule = this.folderContents.getGridModule("dnd");
				if (dndModule) {
					dndModule.row.setTree(this.folderTree._tree);
				}
			}));
			this.defaultLayoutRepositoryComponent = "others";
			this.doBrowseConnections();
			
			this.connect(Desktop, "onLogin", lang.hitch(this, function(repository) {
				this.setRepository(repository);
				this._createFileMenu();
			}));
			
			this.connect(this.folderContents, "onRowClick", lang.hitch(this, function(params, item, selectedItems) {
				this._createActionsMenu(this.folderContents.getSelectedItems());
			}));

			this.logExit("postCreate");
		},
		
		/**
		 * Returns the content list modules used by this view.
		 * 
		 * @return Array of content list modules.
		 */
		getContentListModules: function() {
			var viewModules = [];
			viewModules.push(ViewDetail);
			viewModules.push(ViewMagazine);
			viewModules.push(ViewFilmStrip);

			var array = [];
			array.push({
				moduleClass: Bar,
				top: [
					[
						[
							{
								moduleClasses: viewModules,
								"className": "BarViewModules"
							}
						]
					]
				]
			});
			return array;
		},
		
        /**
         * Hides the banner and message bar to give us a more "explorer" like view in IBM Content Navigator.
         */
		_alterLayout: function() {
			Desktop.getLayout(function(layout) {
				if (layout && layout.mainPane) {
					domStyle.set(layout.banner.domNode, "display", "none");
					
					var children = layout.mainPane.getChildren();
					array.forEach(children, function(child) {
						if (child.declaredClass == "ecm.widget.MessageBar") {
							domStyle.set(child.domNode, "display", "none");
						}
					});
				}
			});
		},
	
        /**
         * Cleans up a menu in the top menu bar.
         *
         * @param menu {@link dijit.Menu} object to clean.
         */
		_cleanupMenu: function(menu) {
			array.forEach(menu.getChildren(), function(child) {
				child.destroy();
			});
			this.fileMenuActions = [];
		},
		
        /**
         * Adds the actions in the tools context menu to the main file menu bar item.
         */
		_addToolsContextMenu: function() {
			Desktop.loadMenuActions("BannerToolsContextMenu", lang.hitch(this, function(actions) {
				array.forEach(actions, lang.hitch(this, function(action, index) {
					if (action.id == "Separator") {
						this.fileMenu.addChild(new MenuSeparator());
					} else {
						if (action.isVisible(this.repository)) {
							var menuItem = new MenuItem({
						          label: action.name,
						          action: action,
						          onClick: lang.hitch(this, function() {
						        	  action.performAction(this.repository);
						          })
							});
							this.fileMenuActions.push(menuItem);
							this.fileMenu.addChild(menuItem);
						}
					}
				}));
				
				connect.connect(Desktop, "onChange", this, "_updateMenuState");
				this._updateMenuState(Desktop);
			}));
		},
		
        /**
         * Adds user session context menu items to the file menu bar item.
         */
		_addUserSessionContextMenu: function() {
			Desktop.loadMenuActions("BannerUserSessionContextMenu", lang.hitch(this, function(actions) {
				array.forEach(actions, lang.hitch(this, function(action, index) {
					if (action.id == "Separator") {
						this.fileMenu.addChild(new MenuSeparator());
					} else {
						if (action.isVisible(this.repository)) {
							this.fileMenu.addChild(new MenuItem({
						          label: action.name,
						          action: action,
						          onClick: lang.hitch(this, function() {
						        	  action.performAction(this.repository);
						          })
							}));
						}
					}
				}));
			}));
		},
		
        /**
         * Creates the {@link dijit.MenuItem} objects for the file menu bar item.
         */
		_createFileMenu: function() {
			this._cleanupMenu(this.fileMenu);
			this._addToolsContextMenu();
			this.fileMenu.addChild(new MenuSeparator());
			this._addUserSessionContextMenu();
		},
	
        /**
         * Updates the states of the file menu bar items based on changes to the {@link ecm.model.Desktop} singleton object.
         *
         * @param updatedObject
         * 			 The object being verified. Only {@link ecm.model.Desktop} changes effect
         * 			 the file menu state.
         */
		_updateMenuState: function(updatedObject) {
			if (updatedObject == Desktop) {
				for ( var i in this.fileMenuActions) {
					var menuItem = this.fileMenuActions[i];
					if (menuItem && menuItem.action) {
						var canPerform = menuItem.action.canPerformAction(this.repository);
						menuItem.set('disabled', !canPerform);
					}
				}
			}
		},
		
        /**
         * Leverages the {@link ecm.widget.listView.gridModules.RowContextMenu} module on the {@link ecm.widget.listView.ContentList}
         * object to retrieve the action menu associated with the selected item(s). The context menu will be used to populate actions
         * in the top menu bar "actions" item.
         */
		_createActionsMenu: function(items) {
			this._cleanupMenu(this.actionMenu);
			
			if (items && items.length > 0 && this.folderContents.grid.rowContextMenu) {
				this.folderContents.grid.rowContextMenu.getMenu(items, lang.hitch(this, function(menu) {
					var menuChildren = menu.getChildren();
					for (var i in menuChildren) {
						var menuItem = menuChildren[i];
						this.actionMenu.addChild(menuItem);
					}
				}));
			}
		},
    
        /**
         * Handles a click on the "details" menu item in the "view" menu item.
         */
        _detailsViewClick: function() {
            var viewModule = this.folderContents.getContentListModule("viewDetail");
            if (viewModule) {
                viewModule._beforeChangeView();
                this.folderContents.onViewButtonClicked("viewDetail", viewModule.getCurrentViewName());
            }
        },
                   
        /**
         * Handles a click on the "magazine" menu item in the "view" menu item.
         */
        _magazineViewClick: function() {
            var viewModule = this.folderContents.getContentListModule("viewMagazine");
            if (viewModule) {
                viewModule._beforeChangeView();
                this.folderContents.onViewButtonClicked("viewMagazine", viewModule.getCurrentViewName());
            }
        },
                   
        /**
         * Handles a click on the "filmstrip" menu item in the "view" menu item.
         */
        _filmstripViewClick: function() {
            var viewModule = this.folderContents.getContentListModule("viewFilmStrip");
            if (viewModule) {
                viewModule._beforeChangeView();
                this.folderContents.onViewButtonClicked("viewFilmStrip", viewModule.getCurrentViewName());
            }
        }
	});
});
