//>>built

require({cache:{"samplePluginDojo/FeatureConfigurationPane":function () {
    define(["dojo/_base/declare", "dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin", "ecm/model/Desktop", "dojo/store/Memory", "ecm/widget/admin/PluginConfigurationPane", "dojo/text!./templates/FeatureConfigurationPane.html", "ecm/widget/ValidationTextBox", "ecm/widget/FilteringSelect", "ecm/widget/HoverHelp", "dijit/form/Textarea"], function (declare, _TemplatedMixin, _WidgetsInTemplateMixin, Desktop, MemoryStore, PluginConfigurationPane, template) {
        return declare("samplePluginDojo.FeatureConfigurationPane", [PluginConfigurationPane, _TemplatedMixin, _WidgetsInTemplateMixin], {templateString:template, widgetsInTemplate:true, load:function (callback) {
            if (this.configurationString) {
                this.jsonConfig = eval("(" + this.configurationString + ")");
                if (this.jsonConfig.configuration[0]) {
                    this.param1Field.set("value", this.jsonConfig.configuration[0].value);
                }
                if (this.jsonConfig.configuration[1]) {
                    this.param2Field.set("value", this.jsonConfig.configuration[1].value);
                }
            }
        }, save:function () {
            var configArray = [];
            var configString = {name:"param1Field", value:this.param1Field.get("value")};
            configArray.push(configString);
            configString = {name:"param2Field", value:this.param2Field.get("value")};
            configArray.push(configString);
            var configJson = {"configuration":configArray};
            this.configurationString = JSON.stringify(configJson);
        }, _onParamChange:function () {
            this.onSaveNeeded(true);
        }, validate:function () {
            if (!this.param1Field.isValid() || !this.param2Field.get("value")) {
                return false;
            }
            return true;
        }});
    });
}, "ecm/widget/admin/PluginRepositoryGeneralConfigurationPane":function () {
    define(["dojo/_base/declare", "dojo/_base/lang", "ecm/MessagesMixin", "dijit/layout/ContentPane"], function (declare, lang, MessagesMixin, ContentPane) {
        return declare("ecm.widget.admin.PluginRepositoryGeneralConfigurationPane", [ContentPane, MessagesMixin], {baseClass:"pluginPropertyTable", serverName:"", port:"", configurationString:null, load:function (repositoryConfig) {
        }, onSaveNeeded:function (saveNeeded) {
        }, validate:function () {
            return true;
        }, save:function (repositoryConfig) {
        }, getLogonParams:function (params) {
        }});
    });
}, "samplePluginDojo/SamplePropertyEditor":function () {
    define(["dojo/_base/declare", "dojo/dom-class", "dijit/_WidgetsInTemplateMixin", "dijit/form/Button", "ecm/widget/ValidationTextBox", "dojo/text!./templates/SamplePropertyEditor.html"], function (declare, domClass, _WidgetsInTemplateMixin, Button, ValidationTextBox, template) {
        return declare("samplePlugin.SamplePropertyEditor", [ValidationTextBox, _WidgetsInTemplateMixin], {templateString:template, widgetsInTemplate:true, postCreate:function () {
            this.inherited(arguments);
            this.set("readOnly", true);
            domClass.remove(this.domNode, this.baseClass);
            domClass.add(this.domNode, "samplePropertyEditor");
        }, _buttonClick:function (evt) {
            this.set("value", "user1");
        }});
    });
}, "samplePluginDojo/FileUploadCustomAction":function () {
    define(["dojo/_base/declare", "ecm/model/Action"], function (declare, Action) {
        return declare("samplePluginDojo.FileUploadCustomAction", [Action], {isEnabled:function (repository, listType, items, teamspace, resultSet) {
            var enabled = this.inherited(arguments);
            if (items[0].hasContent) {
                enabled &= items[0].hasContent();
            } else {
                enabled = false;
            }
            return enabled;
        }, isVisible:function (repository, listType) {
            return this.inherited(arguments);
        }});
    });
}, "samplePluginDojo/SampleFavoritesResultSet":function () {
    define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "ecm/model/FavoritesResultSet", "ecm/model/Item"], function (declare, lang, array, FavoritesResultSet, Item) {
        var SampleFavoritesResultSet = declare("samplePluginDojo.SampleFavoritesResultSet", [FavoritesResultSet], {getToolbarDef:function () {
            return "ContentListToolbar";
        }, });
        SampleFavoritesResultSet.createFromJSON = function (itemJSON) {
            if (itemJSON && itemJSON.items) {
                for (var i in itemJSON.items) {
                    if (itemJSON.items[i].name == "Sample") {
                        return new SampleFavoritesResultSet(itemJSON);
                    }
                }
            }
            return null;
        };
        if (FavoritesResultSet.registerFactory) {
            FavoritesResultSet.registerFactory(SampleFavoritesResultSet);
        }
        return SampleFavoritesResultSet;
    });
}, "samplePluginDojo/SampleFeaturePane":function () {
    define(["dojo/_base/declare", "dojo/_base/lang", "dojo/dom-attr", "dojo/dom-style", "dojo/dom-construct", "idx/layout/BorderContainer", "dijit/layout/ContentPane", "dijit/form/TextBox", "dijit/form/Button", "ecm/model/Request", "ecm/model/ResultSet", "ecm/widget/layout/_LaunchBarPane", "ecm/widget/layout/_RepositorySelectorMixin", "ecm/widget/listView/ContentList", "ecm/widget/listView/gridModules/RowContextMenu", "ecm/widget/listView/modules/Toolbar2", "ecm/widget/listView/modules/DocInfo", "ecm/widget/listView/gridModules/DndRowMoveCopy", "ecm/widget/listView/gridModules/DndFromDesktopAddDoc", "ecm/widget/listView/modules/Bar", "ecm/widget/listView/modules/ViewDetail", "ecm/widget/listView/modules/ViewMagazine", "ecm/widget/listView/modules/ViewFilmStrip", "dojo/text!./templates/SampleFeaturePane.html"], function (declare, lang, domAttr, domStyle, domConstruct, idxBorderContainer, ContentPane, TextBox, Button, Request, ResultSet, _LaunchBarPane, _RepositorySelectorMixin, ContentList, RowContextMenu, Toolbar, DocInfo, DndRowMoveCopy, DndFromDesktopAddDoc, Bar, ViewDetail, ViewMagazine, ViewFilmStrip, template) {
        return declare("samplePluginDojo.SampleFeaturePane", [_LaunchBarPane, _RepositorySelectorMixin], {templateString:template, widgetsInTemplate:true, postCreate:function () {
            this.logEntry("postCreate");
            this.inherited(arguments);
            domAttr.set(this.searchResults.domNode, "role", "region");
            domAttr.set(this.searchResults.domNode, "aria-label", this.messages.browse_content_list_label);
            this.searchResults.setContentListModules(this.getContentListModules());
            this.searchResults.setGridExtensionModules(this.getContentListGridModules());
            this.defaultLayoutRepositoryComponent = "others";
            this.setRepositoryTypes("cm,p8");
            this.createRepositorySelector();
            this.doRepositorySelectorConnections();
            if (this.repositorySelector.getNumRepositories() > 1) {
                domConstruct.place(this.repositorySelector.domNode, this.repositorySelectorArea, "only");
            }
            this.logExit("postCreate");
        }, setRepository:function (repository) {
            this.repository = repository;
            if (this.repositorySelector && this.repository) {
                this.repositorySelector.getDropdown().set("value", this.repository.id);
                if (this.repository.type == "cm") {
                    domStyle.set(this.p8HelpText, "display", "none");
                    domStyle.set(this.cm8HelpText, "display", "inline");
                } else {
                    if (this.repository.type == "p8") {
                        domStyle.set(this.cm8HelpText, "display", "none");
                        domStyle.set(this.p8HelpText, "display", "inline");
                    }
                }
            }
            this.clear();
        }, getContentListGridModules:function () {
            var array = [];
            array.push(DndRowMoveCopy);
            array.push(DndFromDesktopAddDoc);
            array.push(RowContextMenu);
            return array;
        }, getContentListModules:function () {
            var viewModules = [];
            viewModules.push(ViewDetail);
            viewModules.push(ViewMagazine);
            if (ecm.model.desktop.showViewFilmstrip) {
                viewModules.push(ViewFilmStrip);
            }
            var array = [];
            array.push(DocInfo);
            array.push({moduleClass:Bar, top:[[[{moduleClass:Toolbar}, {moduleClasses:viewModules, "className":"BarViewModules"}]]]});
            return array;
        }, loadContent:function () {
            this.logEntry("loadContent");
            if (!this.repository) {
                this.setPaneDefaultLayoutRepository();
                if (this.repository && this.repository.type == "cm") {
                    domStyle.set(this.p8HelpText, "display", "none");
                    domStyle.set(this.cm8HelpText, "display", "inline");
                } else {
                    if (this.repository && this.repository.type == "p8") {
                        domStyle.set(this.cm8HelpText, "display", "none");
                        domStyle.set(this.p8HelpText, "display", "inline");
                    }
                }
            } else {
                if (!this.isLoaded && this.repository && this.repository.connected) {
                    this.setRepository(this.repository);
                    this.isLoaded = true;
                    this.needReset = false;
                }
            }
            this.logExit("loadContent");
        }, reset:function () {
            this.logEntry("reset");
            if (this.repositorySelector && this.repository) {
                this.repositorySelector.getDropdown().set("value", this.repository.id);
            }
            this.needReset = false;
            this.logExit("reset");
        }, runSearch:function () {
            var requestParams = {};
            requestParams.repositoryId = this.repository.id;
            requestParams.repositoryType = this.repository.type;
            requestParams.query = this.queryString.get("value");
            Request.invokePluginService("SamplePlugin", "samplePluginSearchService", {requestParams:requestParams, requestCompleteCallback:lang.hitch(this, function (response) {
                response.repository = this.repository;
                var resultSet = new ResultSet(response);
                this.searchResults.setResultSet(resultSet);
            })});
        }, clear:function () {
            this.queryString.set("value", "");
            this.searchResults.reset();
        }});
    });
}, "samplePluginDojo/SamplePropertyFormatter":function () {
    define(["dojo/_base/declare", "dijit/_TemplatedMixin", "dijit/_Widget"], function (declare, _TemplatedMixin, _Widget) {
        return declare("samplePlugin.SamplePropertyFormatter", [_Widget, _TemplatedMixin], {templateString:"<div></div>", item:null, propertyName:null, data:null, postCreate:function () {
            if (this.data && this.data.indexOf("@") > 0) {
                this.domNode.innerHTML = "<a href=\"mailto:" + data + "\">" + data + "</a>";
            } else {
                this.domNode.innerHTML = this.data;
            }
        }});
    });
}, "samplePluginDojo/SampleItemPropertiesPaneExtension":function () {
    define(["dojo/_base/declare", "ecm/widget/ItemPropertiesPaneExtension", "ecm/widget/CommonPropertiesPane"], function (declare, ItemPropertiesPaneExtension, CommonPropertiesPane) {
        return declare("samplePluginDojo.SampleItemPropertiesPaneExtension", [ItemPropertiesPaneExtension], {postCreate:function () {
            this.inherited(arguments);
            this.set("title", "Sample Plugin Custom Properties");
            this._commonProperties = new CommonPropertiesPane();
            this.addChild(this._commonProperties);
        }, isEnabledFor:function (item) {
            return true;
        }, getPropertiesTitle:function () {
            return "Sample Properties";
        }, setItem:function (item) {
            this.item = item;
        }});
    });
}, "samplePluginDojo/asyncTasks/ICNSampleSearchTaskInformationPane":function () {
    define(["dojo/_base/declare", "dojo/_base/lang", "dojo/dom-style", "samplePluginDojo/asyncTasks/ICNSampleSearchTaskResultsPane", "ecm/widget/taskManager/BaseTaskInformationPane"], function (declare, lang, style, SampleSearchTaskResultsPane, BaseTaskInformationPane) {
        return declare("samplePluginDojo.asyncTasks.ICNSampleSearchTaskInformationPane", [BaseTaskInformationPane], {messages:ecm.messages, postCreate:function () {
            this.inherited(arguments);
        }, setUpTabs:function () {
            this.inherited(arguments);
            this.taskResultsPane = new SampleSearchTaskResultsPane({UUID:"results", title:this.messages.taskInformationPane_results, informationPane:this});
            this.taskPreviewTabContainer.addChild(this.taskResultsPane);
        }, setItem:function (item, onComplete, tabIdToOpen) {
            var _arguments = arguments;
            this.getDetails(lang.hitch(this, function () {
                if (item && item.results) {
                    this.taskResultsPane.createRendering(item);
                    style.set(this.taskResultsPane.controlButton.domNode, "display", "");
                } else {
                    style.set(this.taskResultsPane.controlButton.domNode, "display", "none");
                }
                this.inherited(_arguments);
            }));
        }});
    });
}, "samplePluginDojo/asyncTasks/ICNSampleSearchTaskDialog":function () {
    define(["dojo/_base/declare", "dojo/_base/lang", "dojo/dom-construct", "dojo/dom-style", "dojo/dom-class", "ecm/model/Desktop", "ecm/widget/search/SearchBuilderDialog", "ecm/widget/taskManager/BaseTaskCreationDialog", "ecm/util/_Dialog"], function (declare, lang, construct, style, domClass, Desktop, SearchBuilderDialog, BaseTaskCreationDialog, dialog) {
        return declare("samplePluginDojo.asyncTasks.ICNSampleSearchTaskDialog", [SearchBuilderDialog], {postCreate:function () {
            this.setMaximized(true);
            this.repository = Desktop.getAuthenticatingRepository();
            this.inherited(arguments);
            style.set(this.builder.searchResultsPane.domNode, "display", "none");
            style.set(this.builder.searchDefinition.resultsDisplayButton.domNode, "display", "none");
            style.set(this.builder.searchDefinition.resultsDisplayOptions.domNode, "display", "none");
            this.builder.searchDefinition.searchButton.onClick = lang.hitch(this, function () {
                this.baseTaskCreationDialog = new BaseTaskCreationDialog({asyncTaskType:this.asyncTaskType});
                this.baseTaskCreationDialog.show();
                dialog.manage(this.baseTaskCreationDialog);
                this.connect(this.baseTaskCreationDialog, "onBeforeScheduling", function () {
                    this._setTaskParameters();
                });
                this.connect(this.baseTaskCreationDialog, "onSchedulingFinished", function () {
                    this.onCancel();
                });
            });
            this.setTitle("Schedule Sample ICN Search Task");
        }, _setTaskParameters:function () {
            var template = this.builder.searchDefinition.searchTemplate;
            this.baseTaskCreationDialog.taskParameters.desktop = Desktop.id;
            this.baseTaskCreationDialog.taskParameters.repositoryId = template.repository.id;
            this.baseTaskCreationDialog.taskParameters.criterias = template.getQueryString();
            this.baseTaskCreationDialog.taskParameters.searchJsonPost = template.toJson(true);
        }});
    });
}, "samplePluginDojo/PopupDialog":function () {
    define(["dojo/_base/declare", "ecm/widget/dialog/BaseDialog", "dojo/text!./templates/PopupDialog.html"], function (declare, BaseDialog, template) {
        return declare("samplePluginDojo.PopupDialog", [BaseDialog], {contentString:template, widgetsInTemplate:true, postCreate:function () {
            this.inherited(arguments);
            this.setResizable(true);
            this.setMaximized(false);
            this.setTitle("Popup Dialog");
        }, show:function (src) {
            this.mainContent.src = src;
            this.inherited("show", []);
        }});
    });
}, "ecm/widget/admin/PluginRepositoryConfigurationParametersPane":function () {
    define(["dojo/_base/declare", "dojo/_base/lang", "ecm/MessagesMixin", "dijit/layout/ContentPane"], function (declare, lang, MessagesMixin, ContentPane) {
        return declare("ecm.widget.admin.PluginRepositoryConfigurationParametersPane", [ContentPane, MessagesMixin], {configurationString:null, load:function (onComplete) {
        }, onSaveNeeded:function (saveNeeded) {
        }, validate:function () {
            return true;
        }, save:function (onComplete) {
        }});
    });
}, "samplePluginDojo/asyncTasks/ICNSampleTaskCreationPane":function () {
    define(["dojo/_base/declare", "dojo/_base/lang", "dojo/dom-construct", "dojo/dom-style", "dojo/string", "dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin", "dijit/layout/ContentPane", "ecm/model/Desktop", "ecm/model/Request", "ecm/widget/UnselectableFolder", "ecm/widget/FolderSelectorCallback", "dojo/text!./templates/ICNSampleTaskCreationPane.html", "ecm/widget/search/SearchInDropDown"], function (declare, lang, construct, style, string, TemplatedMixin, WidgetsInTemplateMixin, ContentPane, Desktop, Request, UnselectableFolder, FolderSelectorCallback, contentString) {
        return declare("samplePluginDojo.asyncTasks.ICNSampleTaskCreationPane", [ContentPane, TemplatedMixin, WidgetsInTemplateMixin], {templateString:contentString, widgetsInTemplate:true, validate:function () {
            return true;
        }});
    });
}, "samplePluginDojo/SampleRepositoryConfigurationParametersPane":function () {
    define(["dojo/_base/declare", "dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin", "ecm/widget/ValidationTextBox", "ecm/widget/admin/PluginRepositoryConfigurationParametersPane", "dojo/text!./templates/SampleRepositoryConfigurationParametersPane.html"], function (declare, _TemplatedMixin, _WidgetsInTemplateMixin, ValidationTextBox, PluginRepositoryConfigurationParametersPane, template) {
        return declare("samplePluginDojo.SampleRepositoryConfigurationParametersPane", [PluginRepositoryConfigurationParametersPane, _TemplatedMixin, _WidgetsInTemplateMixin], {templateString:template, widgetsInTemplate:true, load:function (repositoryConfig) {
            var customProperties = repositoryConfig.getCustomProperties();
            if (customProperties) {
                var jsonConfig = eval("(" + customProperties + ")");
                this.param1Field.set("value", jsonConfig.configuration[0].value);
                this.param2Field.set("value", jsonConfig.configuration[1].value);
                this.param3Field.set("value", jsonConfig.configuration[2].value);
            }
        }, _onParamChange:function () {
            this.onSaveNeeded(true);
        }, validate:function () {
            if (!this.param1Field.isValid() || !this.param3Field.isValid()) {
                return false;
            }
            return true;
        }, save:function (repositoryConfig) {
            var configArray = [];
            var configString = {name:"param1Field", value:this.param1Field.get("value")};
            configArray.push(configString);
            configString = {name:"param2Field", value:this.param2Field.get("value")};
            configArray.push(configString);
            configString = {name:"param3Field", value:this.param3Field.get("value")};
            configArray.push(configString);
            var configJson = {"configuration":configArray};
            repositoryConfig.setCustomProperties(JSON.stringify(configJson));
        }});
    });
}, "samplePluginDojo/SampleRepositoryModel":function () {
    define(["dojo/_base/declare", "ecm/model/Repository", ], function (declare, Repository) {
        return declare("samplePluginDojo.SampleRepositoryModel", [Repository], {logon:function (password, callback, desktopId, synchronous, errorCallback, backgroundRequest) {
            this.inherited(arguments);
        }, canChangePassword:function () {
            if (this.connected && !this.useSSO) {
                return true;
            }
            return false;
        }});
    });
}, "samplePluginDojo/MessagesDialog":function () {
    define(["dojo/_base/declare", "ecm/widget/dialog/BaseDialog", "dojo/text!./templates/MessagesDialog.html"], function (declare, BaseDialog, template) {
        return declare("samplePluginDojo.MessagesDialog", [BaseDialog], {contentString:template, widgetsInTemplate:true, postCreate:function () {
            this.inherited(arguments);
            this.setResizable(true);
            this.setMaximized(false);
            this.setTitle("Messages");
            this.addButton("Clear", "clearMessages", false, true);
        }, addMessage:function (message) {
            this.clearMessages();
            if (typeof message == "string") {
                this.messagesTextarea.value += message + "\n";
            } else {
                this.messagesTextarea.value += message.text + "\n";
            }
            this.show();
        }, clearMessages:function (evt) {
            this.messagesTextarea.value = "";
        }});
    });
}, "samplePluginDojo/SampleFavoritesPane":function () {
    define(["dojo/_base/declare", "ecm/widget/layout/FavoritesPane", "ecm/widget/listView/modules/Breadcrumb", "ecm/widget/listView/modules/Toolbar2", "ecm/widget/listView/modules/DocInfo", "ecm/widget/listView/modules/FilterDataServer", "ecm/widget/listView/modules/Bar", "ecm/widget/listView/modules/ViewDetail", "ecm/widget/listView/modules/ViewMagazine", "ecm/widget/listView/modules/ViewFilmStrip", "ecm/widget/listView/modules/InlineMessage"], function (declare, FavoritesPane, Breadcrumb, Toolbar, DocInfo, FilterDataServer, Bar, ViewDetail, ViewMagazine, ViewFilmStrip, InlineMessage) {
        return declare("samplePluginDojo.SampleFavoritesPane", [FavoritesPane], {postCreate:function () {
            this.logEntry("postCreate");
            this.favoritesContent._viewCurrentName = "viewMagazine";
            this.inherited(arguments);
            this.logExit("postCreate");
        }, getContentListModules:function () {
            var viewModules = [];
            viewModules.push(ViewDetail);
            viewModules.push(ViewMagazine);
            if (ecm.model.desktop.showViewFilmstrip) {
                viewModules.push(ViewFilmStrip);
            }
            var array = [];
            array.push({moduleClass:Bar, top:[[[{moduleClass:Toolbar}, {moduleClasses:viewModules, "className":"BarViewModules"}]], [[{moduleClass:Breadcrumb}, {moduleClass:FilterDataServer, "className":"BarFilterData"}]], [[{moduleClass:InlineMessage}]]]});
            array.push({moduleClass:DocInfo, showSystemProps:false});
            return array;
        }});
    });
}, "samplePluginDojo/asyncTasks/ICNSampleSearchTaskResultsPane":function () {
    define(["dojo/_base/declare", "dojo/_base/lang", "dijit/layout/ContentPane", "dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin", "ecm/widget/listView/gridModules/SingleSort", "ecm/widget/listView/gridModules/DndRowCopy", "ecm/widget/listView/gridModules/DndFromDesktopAddDoc", "ecm/widget/listView/gridModules/RowContextMenu", "ecm/LoggerMixin", "dojo/text!./templates/ICNSampleSearchTaskResultsPane.html", "ecm/widget/listView/ContentList"], function (declare, lang, ContentPane, TemplatedMixin, WidgetsInTemplateMixin, SingleSort, DndRowCopy, DndFromDesktopAddDoc, RowContextMenu, LoggerMixin, templateString) {
        return declare("samplePluginDojo.asyncTasks.ICNSampleSearchTaskResultsPane", [ContentPane, TemplatedMixin, WidgetsInTemplateMixin, LoggerMixin], {templateString:templateString, widgetsInTemplate:true, messages:ecm.messages, postCreate:function () {
            this.searchResults.setGridExtensionModules(this.getContentListGridModules());
            this.searchResults.setContentListModules(this.getContentListModules());
        }, createRendering:function (item) {
            this.logEntry("createRendering");
            if (item && item.results) {
                item.results.repository = ecm.model.desktop.getAuthenticatingRepository();
                var results = ecm.model.ContentItem.createResultSet(item.results);
                this.searchResults.setResultSet(results);
            }
            this.logExit("createRendering");
        }, getContentListGridModules:function () {
            var array = [];
            array.push(SingleSort);
            array.push(RowContextMenu);
            return array;
        }, getContentListModules:function () {
            var array = [];
            require(["ecm/widget/listView/modules/Toolbar2", "ecm/widget/listView/modules/Bar", "ecm/widget/listView/modules/Breadcrumb", "ecm/widget/listView/modules/DocInfo", "ecm/widget/listView/modules/ViewDetail", "ecm/widget/listView/modules/ViewMagazine", "ecm/widget/listView/modules/ViewFilmStrip", "ecm/widget/listView/modules/TotalCount", "ecm/widget/listView/modules/InlineMessage"], lang.hitch(this, function (Toolbar, Bar, Breadcrumb, DocInfo, ViewDetail, ViewMagazine, ViewFilmStrip, TotalCount, InlineMessage) {
                var viewModules = [];
                viewModules.push(ViewDetail);
                viewModules.push(ViewMagazine);
                if (ecm.model.desktop.showViewFilmstrip) {
                    viewModules.push(ViewFilmStrip);
                }
                array.push({moduleClass:Bar, top:[[[{moduleClass:Toolbar}, {moduleClasses:viewModules, "className":"BarViewModules"}]], [[{moduleClass:Breadcrumb, rootPrefix:ecm.messages.showing_results + " "}]], [[{moduleClass:InlineMessage}]]], bottom:[[[{moduleClass:TotalCount}]]]});
            }));
            return array;
        }});
    });
}, "samplePluginDojo/SampleLayout":function () {
    define(["dojo/_base/declare", "ecm/model/Desktop", "ecm/model/Feature", "ecm/widget/layout/NavigatorMainLayout"], function (declare, Desktop, Feature, NavigatorMainLayout) {
        return declare("samplePluginDojo.SampleLayout", [NavigatorMainLayout], {getAvailableFeatures:function () {
            return [new Feature({id:"myfavorites", name:"Custom Favorites", separator:false, iconUrl:"favoritesLaunchIcon", featureClass:"ecm.widget.layout.FavoritesPane", popupWindowClass:null, featureTooltip:this.messages.launchbar_favorites, popupWindowTooltip:null, preLoad:false}), new Feature({id:"browsePane", name:Desktop.getConfiguredLabelsvalue("browse"), separator:false, iconUrl:"browseLaunchIcon", featureClass:"ecm.widget.layout.BrowsePane", popupWindowClass:"ecm.widget.layout.BrowseFlyoutPane", featureTooltip:this.messages.launchbar_browse, popupWindowTooltip:this.messages.launchbar_browse_popup, preLoad:false}), new Feature({id:"searchPane", name:Desktop.getConfiguredLabelsvalue("search"), separator:false, iconUrl:"searchLaunchIcon", featureClass:"ecm.widget.layout.SearchPane", popupWindowClass:"ecm.widget.layout.SearchFlyoutPane", featureTooltip:this.messages.launchbar_search, popupWindowTooltip:this.messages.launchbar_search_popup, preLoad:false}), new Feature({id:"manageTeamspaces", name:Desktop.getConfiguredLabelsvalue("workspaces"), separator:false, iconUrl:"teamspacesLaunchIcon", featureClass:"ecm.widget.layout.ManageTeamspacesPane", popupWindowClass:"ecm.widget.layout.TeamspaceFlyoutPane", featureTooltip:this.messages.launchbar_teamspaces, popupWindowTooltip:this.messages.launchbar_teamspaces_popup, preLoad:false}), new Feature({id:"workPane", name:Desktop.getConfiguredLabelsvalue("work"), separator:false, iconUrl:"workLaunchIcon", featureClass:"ecm.widget.layout.WorkPane", popupWindowClass:"ecm.widget.layout.WorkFlyoutPane", featureTooltip:this.messages.launchbar_work, popupWindowTooltip:this.messages.launchbar_work_popup, preLoad:false})];
        }});
    });
}, "samplePluginDojo/asyncTasks/ICNSampleTaskCreationDialog":function () {
    define(["dojo/_base/declare", "dojo/_base/lang", "dojo/dom-construct", "dojo/dom-style", "dojo/string", "ecm/model/Desktop", "ecm/model/Request", "ecm/widget/taskManager/BaseTaskCreationDialog", "samplePluginDojo/asyncTasks/ICNSampleTaskCreationPane", "dojo/text!./templates/ICNSampleTaskCreationDialog.html", "ecm/widget/search/SearchInDropDown"], function (declare, lang, construct, style, string, Desktop, Request, BaseTaskCreationDialog, ICNSampleTaskCreationPane, contentString) {
        return declare("samplePluginDojo.asyncTasks.ICNSampleTaskCreationDialog", [BaseTaskCreationDialog], {contentString:contentString, widgetsInTemplate:true, postCreate:function () {
            this.inherited(arguments);
            this.sampleTaskCreationPane = new ICNSampleTaskCreationPane();
            this.taskSchedulerPane.addTitlePaneSection("General", this.sampleTaskCreationPane, 0);
            this.repository = Desktop.getAuthenticatingRepository();
        }, onSchedule:function () {
            var valid = this.sampleTaskCreationPane.validate();
            if (valid == true) {
                this.inherited(arguments);
            }
        }});
    });
}, "samplePluginDojo/SampleDecorator":function () {
    define(["dojo/_base/lang"], function (lang) {
        lang.setObject("samplePluginEmailDecorator", function (data, rowId, rowIndex) {
            if (data && data.indexOf("@") > 0) {
                return "<a href=\"mailto:" + data + "\">" + data + "</a>";
            } else {
                return data;
            }
        });
    });
}, "samplePluginDojo/SampleFavorite":function () {
    define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "ecm/model/Favorite", "ecm/model/Item"], function (declare, lang, array, Favorite, Item) {
        var SampleFavorite = declare("samplePluginDojo.SampleFavorite", [Favorite], {getStateClass:function (state) {
            if (state == "locked") {
                return "ecmRecordIcon";
            } else {
                return this.inherited(arguments);
            }
        }, getMimeClass:function () {
            return "ftDeclareRecordEntryTemplate";
        }, getActionsMenuItemsType:function () {
            return "FavoriteTeamspaceContextMenu";
        }});
        SampleFavorite.createFromJSON = function (itemJSON) {
            if (itemJSON) {
                if (itemJSON.name == "Sample") {
                    return new SampleFavorite(itemJSON);
                }
            }
            return null;
        };
        if (Favorite.registerFactory) {
            Favorite.registerFactory(SampleFavorite);
        }
        return SampleFavorite;
    });
}, "samplePluginDojo/SampleRepositoryGeneralConfigurationPane":function () {
    define(["dojo/_base/declare", "dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin", "ecm/widget/ValidationTextBox", "ecm/widget/admin/PluginRepositoryGeneralConfigurationPane", "dojo/text!./templates/SampleRepositoryGeneralConfigurationPane.html"], function (declare, _TemplatedMixin, _WidgetsInTemplateMixin, ValidationTextBox, PluginRepositoryGeneralConfigurationPane, template) {
        return declare("samplePluginDojo.SampleRepositoryGeneralConfigurationPane", [PluginRepositoryGeneralConfigurationPane, _TemplatedMixin, _WidgetsInTemplateMixin], {templateString:template, widgetsInTemplate:true, load:function (repositoryConfig) {
            this.jsonFilenameField.set("value", repositoryConfig.getServerName());
        }, _onParamChange:function () {
            this.onSaveNeeded(true);
        }, validate:function () {
            if (!this.jsonFilenameField.isValid()) {
                return false;
            }
            return true;
        }, save:function (repositoryConfig) {
            repositoryConfig.setServerName(this.jsonFilenameField.get("value"));
        }, getLogonParams:function (params) {
            params.serverName = this.jsonFilenameField.get("value");
        }});
    });
}, "samplePluginDojo/ConfigurationPane":function () {
    define(["dojo/_base/declare", "dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin", "ecm/widget/ValidationTextBox", "dijit/Tooltip", "ecm/widget/admin/PluginConfigurationPane", "dojo/text!./templates/ConfigurationPane.html"], function (declare, _TemplatedMixin, _WidgetsInTemplateMixin, ValidationTextBox, HoverHelp, PluginConfigurationPane, template) {
        return declare("samplePluginDojo.ConfigurationPane", [PluginConfigurationPane, _TemplatedMixin, _WidgetsInTemplateMixin], {templateString:template, widgetsInTemplate:true, postCreate:function () {
            this.inherited(arguments);
        }, load:function (callback) {
            if (this.configurationString) {
                var jsonConfig = eval("(" + this.configurationString + ")");
                this.param1Field.set("value", jsonConfig.configuration[0].value);
                this.param2Field.set("value", jsonConfig.configuration[1].value);
                this.param3Field.set("value", jsonConfig.configuration[2].value);
            }
        }, _onParamChange:function () {
            var configArray = [];
            var configString = {name:"param1Field", value:this.param1Field.get("value")};
            configArray.push(configString);
            configString = {name:"param2Field", value:this.param2Field.get("value")};
            configArray.push(configString);
            configString = {name:"param3Field", value:this.param3Field.get("value")};
            configArray.push(configString);
            var configJson = {"configuration":configArray};
            this.configurationString = JSON.stringify(configJson);
            this.onSaveNeeded(true);
        }, validate:function () {
            if (!this.param1Field.isValid() || !this.param3Field.isValid()) {
                return false;
            }
            return true;
        }});
    });
}, "samplePluginDojo/CustomAction":function () {
    define(["dojo/_base/declare", "ecm/model/Action"], function (declare, Action) {
        return declare("samplePluginDojo.CustomAction", [Action], {isEnabled:function (repository, listType, items, teamspace, resultSet) {
            var enabled = this.inherited(arguments);
            if (enabled && items[0] && items[0].getContentType) {
                var mimeType = items[0].getContentType();
                enabled = (mimeType == "text/plain");
            }
            return enabled;
        }, isVisible:function (repository, listType) {
            return this.inherited(arguments);
        }});
    });
}, "samplePluginDojo/FileUploadPopupDialog":function () {
    define(["dojo/_base/declare", "dojo/_base/lang", "ecm/model/Request", "ecm/widget/dialog/BaseDialog", "dojo/text!./templates/FileUploadPopupDialog.html"], function (declare, lang, Request, BaseDialog, template) {
        return declare("samplePluginDojo.FileUploadPopupDialog", [BaseDialog], {contentString:template, widgetsInTemplate:true, _maxFileSize:1048576, _items:null, _repository:null, postCreate:function () {
            this.inherited(arguments);
            this.setResizable(true);
            this.setMaximized(false);
            this.setTitle("Custom Upload");
            this.setIntroText("Choose a file with which to replace the existing document content.");
            this._addButton = this.addButton("Add", "onAdd", true, true);
        }, show:function (repository, items) {
            this._items = items;
            this._repository = repository;
            this._addButton.set("disabled", true);
            this.inherited("show", []);
        }, isValid:function () {
            var valid = this._fileInput;
            valid = valid && (this._fileInput.value) && (this._fileInput.value.length > 0);
            return valid;
        }, onFileInputChange:function () {
            this._addButton.set("disabled", (this.isValid() ? false : true));
        }, onAdd:function () {
            var item = this._items[0];
            var reqParams = {desktop:ecm.model.desktop.id, serverType:this._repository.type, repositoryId:this._repository.id, docid:item.id, doc_name_attribute:item.getContentClass().nameAttribute, template_name:item.getContentClass().id, };
            var callback = lang.hitch(this, this._onAddCompleted);
            if (this._fileInput.files) {
                var file = this._fileInput.files[0];
                reqParams.mimetype = file.type;
                reqParams.parm_part_filename = (file.fileName ? file.fileName : file.name);
                var form = new FormData();
                form.append("file", file);
                Request.postFormToPluginService("SamplePlugin", "samplePluginFileUploadService", form, {requestParams:reqParams, requestCompleteCallback:callback});
            } else {
                var fileName = this._fileInput.value;
                if (fileName && fileName.length > 0) {
                    var i = fileName.lastIndexOf("\\");
                    if (i != -1) {
                        fileName = fileName.substr(i + 1);
                    }
                }
                reqParams.parm_part_filename = fileName;
                reqParams.plugin = "SamplePlugin";
                reqParams.action = "samplePluginFileUploadService";
                Request.ieFileUploadServiceAPI("plugin", "", {requestParams:reqParams, requestCompleteCallback:callback}, this._fileInputForm);
            }
        }, _onAddCompleted:function (response) {
            if (response.fieldErrors) {
                console.dir(response.fieldErrors);
            } else {
                if (this._items && this._items.length > 0 && response && response.mimetype) {
                    lang.mixin(this._items[0], response);
                    this._items[0].refresh();
                }
            }
            this.hide();
        }});
    });
}, "url:samplePluginDojo/templates/SampleFeaturePane.html":"<div class=\"ecmCenterPane\">\r\n\t<div data-dojo-type=\"idx/layout/BorderContainer\" data-dojo-props=\"gutters:true\">\r\n\t\t<div data-dojo-attach-point=\"searchArea\" data-dojo-type=\"dijit/layout/ContentPane\" \r\n\t\t\t\tdata-dojo-props=\"splitter:true,region:'top'\" class=\"sampleSearchArea\">\r\n\t\t\t<div data-dojo-attach-point=\"repositorySelectorArea\" class=\"sampleRepositorySelectorArea\"></div>\r\n\t\t\t<label for=\"${id}_queryString\" data-dojo-attach-point=\"cm8HelpText\" style=\"display:none\">Enter an XPath query to run below (for example, &quot;/NOINDEX&quot;)</label>\r\n\t\t\t<label for=\"${id}_queryString\" data-dojo-attach-point=\"p8HelpText\" style=\"display:none\">Enter an SQL query to run below (for example, &quot;SELECT * FROM Document&quot;)</label>\r\n\t\t\t<div class=\"sampleQueryInputArea\">\r\n\t\t\t\t<input id=\"${id}_queryString\" data-dojo-attach-point=\"queryString\" data-dojo-type=\"dijit/form/TextBox\"></input>\r\n\t\t\t\t<button data-dojo-attach-point=\"searchButton\" data-dojo-type=\"dijit/form/Button\" \r\n\t\t\t\t\t\tdata-dojo-attach-event=\"onClick: runSearch\" class=\"searchButton\">\r\n\t\t\t\t\t${messages.search}\r\n\t\t\t\t</button>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t\t<div data-dojo-attach-point=\"resultsArea\" data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props=\"region:'center'\">\r\n\t\t\t<div data-dojo-attach-point=\"searchResults\" data-dojo-type=\"ecm/widget/listView/ContentList\" \r\n\t\t\t\t\tdata-dojo-props=\"emptyMessage:'${messages.folder_is_empty}'\">\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t</div>\r\n</div>", "url:samplePluginDojo/asyncTasks/templates/ICNSampleTaskCreationPane.html":"<div class=\"ecmCommonPropertiesPane\" data-dojo-attach-point=\"containerNode\" data-dojo-type=\"dijit/layout/ContentPane\" style=\"width:100%; height:100%;\">\r\n\t<table class=\"propertyTable\" data-dojo-attach-point=\"searchInDropdownSection\">\r\n\t\t<tbody>\r\n\t\t\t<tr>\r\n\t\t\t\t<td class=\"propertyRowLabel\">\r\n\t\t\t\t\t<span class=\"ecmLabeledInputFieldRequired\">*</span>\r\n\t\t\t\t\t<label data-dojo-attach-point=\"containerLabel\" for=\"${id}_containerLabel\">Sample property:</label>\r\n\t\t\t\t</td>\r\n\t\t\t\t<td class=\"propertyRowValue\">\r\n\t\t\t\t\t<div id=\"${id}_updateBatchSizeTextBox\" data-dojo-type=\"dijit/form/NumberSpinner\" data-dojo-attach-point=\"number\" \r\n\t\t\t\t\t\tdata-dojo-props=\"constraints:{min:1,places:0}, trim: true, intermediateChanges: true, required: true\" style=\"width:150px;\"></div>\r\n\t\t\t\t</td>\r\n\t\t\t</tr>\r\n\t\t</tbody>\r\n\t</table>\r\n</div>", "url:samplePluginDojo/asyncTasks/templates/ICNSampleTaskCreationDialog.html":"<div class=\"ecmCommonPropertiesPane\" data-dojo-attach-point=\"contentContainerNode\" data-dojo-type=\"dijit/layout/ContentPane\" style=\"width:100%; height:100%;\">\r\n</div>", "url:samplePluginDojo/templates/PopupDialog.html":"<iframe data-dojo-attach-point=\"mainContent\" style=\"width:100%; height:100%;\"></iframe>\r\n", "url:samplePluginDojo/templates/ConfigurationPane.html":"<div>\r\n\r\nThe following configuration parameters are provided by the configuration component of the sample plug-in.\r\n\r\nYou can use the text in this area to introduce the configuration parameters. \r\n\r\n\t<table class=\"propertyTable\" role=\"presentation\">\r\n\t\t<tr>\r\n\t\t\t<td class=\"propertyRowLabel\">\r\n\t\t\t\t<span class=\"required\">*</span>\r\n\t\t\t\t<label id=\"${id}_param1label\" for=\"${id}_param1\">Parameter 1:</label>&nbsp;\r\n\t\t\t\t<div data-dojo-type=\"dijit/Tooltip\" data-dojo-props=\"connectId:'${id}_param1label'\" data-dojo-attach-point=\"param1FieldHelp\" >The asterisk indicates that this parameter is required. You can specify hover help for configuration parameters if you think users will need additional help when configuring your plug-in.</div>\r\n\t\t\t</td>\r\n\t\t\t<td class=\"propertyRowValue\">\r\n\t\t\t   <div id=\"${id}_param1\" data-dojo-attach-point=\"param1Field\" data-dojo-attach-event=\"onKeyUp: _onParamChange\" maxLength=\"64\" data-dojo-type=\"ecm.widget.ValidationTextBox\" required=\"true\" trim=\"true\" propercase=\"false\"></div>\r\n\t\t\t</td>\r\n\t\t</tr>\r\n\t\t<tr>\r\n\t\t\t<td class=\"propertyRowLabel\">\r\n\t\t\t\t<label for=\"${id}_param2\">Parameter 2:</label>&nbsp;\r\n\t\t\t</td>\r\n\t\t\t<td class=\"propertyRowValue\">\r\n\t\t\t   <div id=\"${id}_param2\" data-dojo-attach-point=\"param2Field\" data-dojo-attach-event=\"onKeyUp: _onParamChange\" maxLength=\"64\" data-dojo-type=\"ecm.widget.ValidationTextBox\" required=\"false\" trim=\"true\" propercase=\"false\"></div>\r\n\t\t\t</td>\r\n\t\t</tr>\r\n\t\t<tr>\r\n\t\t\t<td class=\"propertyRowLabel\">\r\n\t\t\t\t<span class=\"required\">*</span>\r\n\t\t\t\t<label for=\"${id}_param3\">Parameter 3:</label>&nbsp;\r\n\t\t\t</td>\r\n\t\t\t<td class=\"propertyRowValue\">\r\n\t\t\t   <div id=\"${id}_param3\" data-dojo-attach-point=\"param3Field\" data-dojo-attach-event=\"onKeyUp: _onParamChange\" maxLength=\"64\" data-dojo-type=\"ecm.widget.ValidationTextBox\" required=\"true\" trim=\"true\" propercase=\"false\"></div>\r\n\t\t\t</td>\r\n\t\t</tr>\r\n\t</table>\r\n</div>\r\n", "url:samplePluginDojo/templates/SampleRepositoryConfigurationParametersPane.html":"<div>\r\n\r\nThis is the sample plug-in repository configuration parameters pane. \r\n\r\n\t<table class=\"propertyTable\" role=\"presentation\">\r\n\t\t<tr>\r\n\t\t\t<td class=\"propertyRowLabel\">\r\n\t\t\t\t<span class=\"required\">*</span>\r\n\t\t\t\t<label for=\"${id}_param1\">Config Param 1:</label>&nbsp;\r\n\t\t\t</td>\r\n\t\t\t<td class=\"propertyRowValue\">\r\n\t\t\t   <div id=\"${id}_param1\" data-dojo-attach-point=\"param1Field\" data-dojo-attach-event=\"onKeyUp: _onParamChange\" maxLength=\"64\" data-dojo-type=\"ecm.widget.ValidationTextBox\" required=\"true\" trim=\"true\" propercase=\"false\"></div>\r\n\t\t\t</td>\r\n\t\t</tr>\r\n\t\t<tr>\r\n\t\t\t<td class=\"propertyRowLabel\">\r\n\t\t\t\t<label for=\"${id}_param2\">Config Param 2:</label>&nbsp;\r\n\t\t\t</td>\r\n\t\t\t<td class=\"propertyRowValue\">\r\n\t\t\t   <div id=\"${id}_param2\" data-dojo-attach-point=\"param2Field\" data-dojo-attach-event=\"onKeyUp: _onParamChange\" maxLength=\"64\" data-dojo-type=\"ecm.widget.ValidationTextBox\" required=\"false\" trim=\"true\" propercase=\"false\"></div>\r\n\t\t\t</td>\r\n\t\t</tr>\r\n\t\t<tr>\r\n\t\t\t<td class=\"propertyRowLabel\">\r\n\t\t\t\t<span class=\"required\">*</span>\r\n\t\t\t\t<label for=\"${id}_param3\">Config Param 3:</label>&nbsp;\r\n\t\t\t</td>\r\n\t\t\t<td class=\"propertyRowValue\">\r\n\t\t\t   <div id=\"${id}_param3\" data-dojo-attach-point=\"param3Field\" data-dojo-attach-event=\"onKeyUp: _onParamChange\" maxLength=\"64\" data-dojo-type=\"ecm.widget.ValidationTextBox\" required=\"true\" trim=\"true\" propercase=\"false\"></div>\r\n\t\t\t</td>\r\n\t\t</tr>\r\n\t</table>\r\n</div>\r\n", "url:samplePluginDojo/templates/SamplePropertyEditor.html":"<div class=\"dijit dijitReset dijitInline dijitLeft\" id=\"widget_${id}\" role=\"presentation\">\r\n\t<div class=\"dijit dijitReset dijitInline dijitLeft\" data-dojo-attach-point=\"stateNode\">\r\n\t\t<div class='dijitReset dijitValidationContainer'>\r\n\t\t\t<input class=\"dijitReset dijitInputField dijitValidationIcon dijitValidationInner\" value=\"&#935; \" type=\"text\" tabIndex=\"-1\" readonly=\"readonly\" role=\"presentation\"/>\r\n\t\t</div>\r\n\t\t<div class=\"dijitReset dijitInputField dijitInputContainer\">\r\n\t\t\t<input class=\"dijitReset dijitInputInner\" data-dojo-attach-point='textbox,focusNode' autocomplete=\"off\"\r\n\t\t\t\t${!nameAttrSetting} type='${type}'/>\r\n\t\t</div>\r\n\t</div>\r\n\t<button data-dojo-type=\"dijit/form/Button\" data-dojo-attach-point=\"sampleButton\" data-dojo-attach-event=\"onClick: _buttonClick\">Lookup</button>\r\n</div>", "url:samplePluginDojo/templates/FileUploadPopupDialog.html":"<form data-dojo-attach-point=\"_fileInputForm\" name=\"fileUploadForm\"\r\n\tenctype=\"multipart/form-data\" accept-charset=\"UTF-8\" method=\"post\" target=\"${id}_fileInputIFrame\">\r\n\t<!--IBM Content Navigator expects the input field name to be uploadFile. Use only uploadFile for the file input field name, and do not create variations such as ${id}_uploadFile.-->\r\n\t<input type=\"file\" required=\"true\" id=\"${id}_fileInput\" name=\"uploadFile\" class=\"fileInput\"\r\n\t\tdata-dojo-attach-point=\"_fileInput\" data-dojo-attach-event=\"onchange: onFileInputChange\"/>\r\n\t<iframe name=\"${id}_fileInputIFrame\" id=\"${id}_fileInputIFrame\" style=\"display: none\">\r\n\t</iframe>\r\n</form>\r\n", "url:samplePluginDojo/templates/SampleRepositoryGeneralConfigurationPane.html":"<div>\r\n\t<table class=\"propertyTable\" role=\"presentation\">\r\n\t\t<tr>\r\n\t\t\t<td class=\"propertyRowLabel\">\r\n\t\t\t\t<span class=\"required\">*</span>\r\n\t\t\t\t<label for=\"${id}_jsonFilename\">Sample Repository JSON File Name:</label>&nbsp;\r\n\t\t\t</td>\r\n\t\t\t<td class=\"propertyRowValue\">\r\n\t\t\t   <div id=\"${id}_jsonFilename\" data-dojo-attach-point=\"jsonFilenameField\" data-dojo-attach-event=\"onKeyUp: _onParamChange\" maxLength=\"64\" data-dojo-type=\"ecm.widget.ValidationTextBox\" required=\"true\" trim=\"true\" propercase=\"false\"></div>\r\n\t\t\t</td>\r\n\t\t</tr>\r\n\t</table>\r\n</div>\r\n", "url:samplePluginDojo/templates/MessagesDialog.html":"<textarea data-dojo-attach-point=\"messagesTextarea\" cols=\"60\" rows=\"10\"></textarea>\r\n", "url:samplePluginDojo/asyncTasks/templates/ICNSampleSearchTaskResultsPane.html":"<div data-dojo-type=\"dijit.layout.ContentPane\">\r\n\t<div data-dojo-attach-point=\"searchResults\" data-dojo-type=\"ecm.widget.listView.ContentList\" emptyMessage=\"${messages.no_results_were_found}\" selectFirstRowOnSetResult=false clearOnLogout=\"false\"></div>\r\n</div>", "url:samplePluginDojo/templates/FeatureConfigurationPane.html":"<div>\r\n\tThis is the sample feature plug-in configuration. \r\n\r\n\t<table class=\"propertyTable\" role=\"presentation\">\r\n\t\t<tr>\r\n\t\t\t<td class=\"propertyRowLabel\">\r\n\t\t\t\t<span class=\"required\">*</span>\r\n\t\t\t\t<label for=\"${id}_param1\">Config Param 1:</label>&nbsp;\r\n\t\t\t</td>\r\n\t\t\t<td class=\"propertyRowValue\">\r\n\t\t\t   <div id=\"${id}_param1\" data-dojo-attach-point=\"param1Field\" data-dojo-attach-event=\"onChange: _onParamChange\" maxLength=\"64\" data-dojo-type=\"ecm.widget.ValidationTextBox\" \r\n\t\t\t   \t\trequired=\"true\" trim=\"true\" propercase=\"false\" intermediateChanges=\"true\"></div>\r\n\t\t\t</td>\r\n\t\t</tr>\r\n\t\t<tr>\r\n\t\t\t<td class=\"propertyRowLabel\">\r\n\t\t\t\t<span class=\"required\">*</span>\r\n\t\t\t\t<label for=\"${id}_param2\">Config Param 2:</label>&nbsp;\r\n\t\t\t</td>\r\n\t\t\t<td class=\"propertyRowValue\">\r\n\t\t\t   <div id=\"${id}_param2\" data-dojo-attach-point=\"param2Field\" data-dojo-attach-event=\"onChange: _onParamChange\" data-dojo-type=\"dijit.form.Textarea\" \r\n\t\t\t   \t\trequired=\"true\" trim=\"true\" propercase=\"false\" intermediateChanges=\"true\"></div>\r\n\t\t\t</td>\r\n\t\t</tr>\r\n\t</table>\r\n</div>\r\n"}});
require(["dojo/_base/declare", "dojo/_base/lang", "ecm/model/Request", "ecm/model/EntryTemplate", "ecm/widget/ItemPropertiesPane", "samplePluginDojo/MessagesDialog", "samplePluginDojo/PopupDialog", "samplePluginDojo/SampleDecorator", "samplePluginDojo/FileUploadPopupDialog", "samplePluginDojo/SampleItemPropertiesPaneExtension", "samplePluginDojo/ConfigurationPane", "samplePluginDojo/CustomAction", "samplePluginDojo/FeatureConfigurationPane", "samplePluginDojo/FileUploadCustomAction", "samplePluginDojo/SampleFavoritesPane", "samplePluginDojo/SampleFeaturePane", "samplePluginDojo/SampleLayout", "samplePluginDojo/SamplePropertyEditor", "samplePluginDojo/SamplePropertyFormatter", "samplePluginDojo/SampleRepositoryConfigurationParametersPane", "samplePluginDojo/SampleRepositoryGeneralConfigurationPane", "samplePluginDojo/SampleRepositoryModel", "samplePluginDojo/asyncTasks/ICNSampleSearchTaskDialog", "samplePluginDojo/asyncTasks/ICNSampleSearchTaskInformationPane", "samplePluginDojo/asyncTasks/ICNSampleSearchTaskResultsPane", "samplePluginDojo/asyncTasks/ICNSampleTaskCreationDialog", "samplePluginDojo/asyncTasks/ICNSampleTaskCreationPane", "samplePluginDojo/SampleFavorite", "samplePluginDojo/SampleFavoritesResultSet"], function (declare, lang, Request, EntryTemplate, ItemPropertiesPane, MessagesDialog, PopupDialog, SampleDecorator, FileUploadPopupDialog, SampleItemPropertiesPaneExtension) {
    var messagesDialog = null;
    var popupDialog = null;
    var fileUploadPopupDialog = null;
    lang.setObject("samplePluginAction", function (repository, items) {
        if (!messagesDialog) {
            messagesDialog = new MessagesDialog();
        }
        messagesDialog.addMessage("The sample plugin action has been invoked.  " + items.length + " items selected.");
        messagesDialog.addMessage("Invoking the sample plugin's service..");
        var serviceParams = new Object();
        serviceParams.server = items[0].repository.id;
        serviceParams.serverType = items[0].repository.type;
        if (items[0].resultSet && items[0].resultSet.searchTemplate) {
            serviceParams.folder = items[0].resultSet.searchTemplate.id;
        }
        serviceParams.ndocs = items.length;
        for (var i in items) {
            serviceParams["docId" + i] = items[i].id;
        }
        Request.invokePluginService("SamplePlugin", "samplePluginService", {requestParams:serviceParams, requestCompleteCallback:function (response) {
            messagesDialog.addMessage("The sample plugin service completed, returning:\n" + dojo.toJson(response, true, "  "));
        }});
    });
    lang.setObject("samplePluginFilteredAction", function (repository, items) {
        if (!popupDialog) {
            popupDialog = new PopupDialog();
        }
        popupDialog.show("help/help.htm");
    });
    lang.setObject("samplePluginFileUploadAction", function (repository, items) {
        if (!fileUploadPopupDialog) {
            fileUploadPopupDialog = new FileUploadPopupDialog();
        }
        fileUploadPopupDialog.show(repository, items);
    });
    lang.setObject("samplePluginCustomWFAction", function (repository, items, callback, teamspace, resultSet, parameterMap) {
        console.debug("***** inside sample custom workflow action; printing parameters...");
        console.debug(repository);
        console.debug(items[0]);
        console.debug(parameterMap.stepRoutingLayout);
        alert("Custom Workflow action");
    });
    ItemPropertiesPane.addExtension(SampleItemPropertiesPaneExtension);
    EntryTemplate.registerModelIntegration("samplePluginDojo/SampleIntegrationConfiguration");
    EntryTemplate.registerControlRegistry("samplePluginDojo/SampleControlRegistry");
});

