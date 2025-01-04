/* JavaScript content from mobile/MILayer.js in folder common */
/**
 * @name MILayer
 * @class Represents facade access object to the ecm layer.
 * @augments
 */


var MAX_POSITIVE_INT = 1e+127;
var MAX_NEGATIVE_INT = -MAX_POSITIVE_INT;

define("mila/MILayer",[
    "dojo/_base/declare",
    "dojo/_base/lang",
    "mila/nls/messages",
    "mila/AttributesValidator"
], function(declare, lang, messages, AttributesValidator) {
    return declare("MILayer", [], {
        constructor: function(id, name, desktopUrl) {
            this.logDebug("MILayer.constructor", "name=" + name + " desktopUrl=" + desktopUrl);
            this.id = id;
            this.name = name;
            this.mobileMode = true;
            this.debug = false;
            this.lastResultSet = null;
            this.currentSearchTemplate = null;
            this.favoritesResultSet = null;
            this.currentRepository = null;


            if (desktopUrl != null) {
                ecm.model.desktop.setServicesUrl(desktopUrl);
            }

            this.logDebug("exit MILayer.constructor");

        },


        /**
         * Returns desktop name.
         */
        getName: function() {
            return this.name;
        },

        /**
         * Returns the MIME class to (file type) mapping.
         */
        getMimeTypeToFileTypeMap: function(successCallBack) {
            if (successCallBack) {
                successCallBack(ecm.model.Item.MimeTypeToFileType);
            }
        },

        /*
         * Set basic authorization token which has foramt of "Basic base64(<user>:<passord>)"
         */
        setBasicAuthorizationToken:function(basicAuthorizationToken){
            ecm.model.Request.basicAuthorizationToken = basicAuthorizationToken;
        },

        /**
         * Set desktop URL
         */
        setDesktopServiceURL: function(desktopUrl) {
            //if desktopUrl ends with slash omit it.
            if(desktopUrl!=null && desktopUrl!=""){
                var lastIndex = desktopUrl.lastIndexOf("/");
                if((lastIndex != -1) && (lastIndex + 1 == desktopUrl.length)){
                    desktopUrl = desktopUrl.substring(0,desktopUrl.length-1);
                }
                ecm.model.desktop.setServicesUrl(desktopUrl);
            }
        },

        setTimeOut: function(timeout) {
            ecm.model.desktop.requestTimeout = timeout;
        },

        logDebug: function(message) {

        },


        isRepositoryConnected: function(repositoryId) {
            var repository = ecm.model.desktop.getRepository(repositoryId);

            if (repository == null) {
                var message = new ecm.model.Message({
                    level: 1,
                    number: 607,
                    text: "Repository with id [" + repository + "] is not found",
                });
                ecm.model.desktop.onMessageAdded(message);
                return false;
            }
            return repository.connected;
        },

        getCurrentRepositoryId: function() {
            if (this.currentRepository != null) {
                return this.currentRepository.repositoryId;
            } else {
                return null;
            }
        },

        getCurrentRepositoryWithCallBack: function(successCallBack) {
            if (this.currentRepository != null) {
                if (successCallBack) {
                    successCallBack(this.currentRepository);
                }
            } else {
                successCallBack(null);
            }
        },

        clearRepositoryCallBacksCache:function(repository){

            delete repository._retrieveContentClassesCallbacks;
            delete repository._retrieveItemCallbacks;

        },

        getLayout :function(){
            return ecm.model.desktop.layout;
        },

        isPluginLoaded :function(plugingId){
            return ecm.model.desktop.isPluginLoaded(plugingId);
        },


        setCurrentRepository: function(repositoryId) {

            var repository = ecm.model.desktop.getRepository(repositoryId);

            if (repository == null) {
                var message = new ecm.model.Message({
                    level: 1,
                    number: 607,
                    text: "Repository with id [" + repository + "] is not found",
                });
                ecm.model.desktop.onMessageAdded(message);
                return false;
            }


            this.currentRepository = repository;

            return true;
        },

        getCurrentRepository: function() {
            if (this.currentRepository == null) {
                var message = new ecm.model.Message({
                    level: 1,
                    number: 606,
                    text: "Current repository is not defined",
                });
                ecm.model.desktop.onMessageAdded(message);
                return null;
            }
            this.clearRepositoryCallBacksCache(this.currentRepository);
            return this.currentRepository;
        },

        isTextSearchSupported: function(repositoryId) {
            var repository = ecm.model.desktop.getRepository(repositoryId);
            if (repository == null) {
                var message = new ecm.model.Message({
                    level: 1,
                    number: 607,
                    text: "Repository with id [" + repositoryId + "] is not found",
                });
                ecm.model.desktop.onMessageAdded(message);
                return false;
            }
            var searchConfig = ecm.model.SearchConfiguration.getSearchConfiguration({repository: repository});
            return searchConfig.isTextSearchTypeSupported(repository.textSearchType);
        },

        /**
         * Connect to the specified repository.
         *
         * @param repositoryId
         *            repositoryId(optional) if the repositoryId is null and the this.connectRepository is not null
         *            reconnected to the this.connectRepository.
         * @param user
         *            authenticated user
         * @param user
         *            authenticated password
         * @param user
         *            successCallBack is called when the connection is established.
         */

        connectToRepository: function(repositoryId, user, pass, successCallBack) {
            var repository = null;
            if (repositoryId == null || repositoryId == "") {
                repository = this.currentRepository;
            } else {
                repository = ecm.model.desktop.getRepository(repositoryId);
            }

            if (repository == null) {
                var message = new ecm.model.Message({
                    level: 1,
                    number: 607,
                    text: "Repository with id [" + repository + "] is not found",
                });
                ecm.model.desktop.onMessageAdded(message);
                return false;
            }

            repository.userId=user;

            repository.logon(pass, dojo.hitch(this, function(returned_repository) {

                if (repository.connected) {
                    this.logDebug("connected succeded");
                    repository.refresh();

                    if (this.currentRepository == null)
                        ecm.model.desktop.setInitialRepository(repository);


                    this.currentRepository = repository;

                    if (successCallBack) {
                        successCallBack(returned_repository);
                    }
                }
            }));

        },

        getDesktopMobileFeaturesList: function(desktopID, successCallBack) {
            this.logDebug("MILayer.getDesktopMobileFeaturesList desktopID" + desktopID);


            this.getDesktop(desktopID, function(desktop) {

                ecm.model.admin.appCfg.getFeaturesList(desktopID, function(features) {

                    var featuresList=[];
                    for ( var i in features) {
                        featuresList.push(features[i]._attributes);
                    }


                    if (successCallBack)
                        successCallBack(featuresList);
                });



            }, null);



            this.logDebug("exit MILayer.getDesktopMobileFeaturesList");
            return true;
        },

        getDesktop201Config: function(desktopID, successCallBack) {
            this.logDebug("getDesktop201Config desktopID" + desktopID);
            //use old api for servers 2.0.1

            ecm.model.admin.appCfg.listConfig("desktop", lang.hitch(this, function(list) {
                var desktopConfig = null;
                for ( var i in list) {
                    var entry = list[i];
                    var id = entry.id ? entry.id : "" + i;
                    if(desktopID == id){

                        desktopConfig = ecm.model.admin.DesktopConfig.createDesktopConfig(id);
                        lang.mixin(desktopConfig, {
                            _attributes: entry
                        });
                    }
                }
                if (successCallBack) {
                    desktopConfigArr = {
                        "mobileAppAccess": desktopConfig.getMobileAppAccess(),
                        "addPhotoFromMobile": desktopConfig.getAddPhotoFromMobile(),
                        "addDocFoldersToRepo": desktopConfig.getAddDocFoldersToRepo(),
                        "openDocFromOtherApp": desktopConfig.getOpenDocFromOtherApp(),
                        "fileIntoFolder": desktopConfig.getFileIntoFolder()


                    };
                    successCallBack(desktopConfigArr);
                }

            }), "true");

            this.logDebug("MILayer.getDesktop201Config exit" + desktopID);
            return true;

        },
        getDesktopConfig: function(desktopID, successCallBack) {
            this.logDebug("MILayer.getDesktopConfig desktopID" + desktopID);


            // to be compatible with 2.0.1.
            var serverVersion = this.getServerVersion();
            if(serverVersion == null){
                var message = new ecm.model.Message({
                    level: 1,
                    number: 615,
                    text: messages.server_version_not_supported,
                });
                ecm.model.desktop.onMessageAdded(message);
                return false;
            }else if(serverVersion == "2.0.1"){
                return this.getDesktop201Config(ecm.model.desktop.id, successCallBack);
            }

            var desktopConfig = null;

            //if ecm.model.desktop.mobileAppAccess is null the desktop is not initialized.
            if (ecm.model.desktop.mobileAppAccess == null || ecm.model.desktop.name != desktopID) {

                this.getDesktop(desktopID, function(desktop) {

                    if (desktop.mobileAppAccess != undefined) {


                        desktopConfig = {
                            "mobileAppAccess": desktop.mobileAppAccess,
                            "addPhotoFromMobile": desktop.addPhotoFromMobile,
                            "addDocFoldersToRepo": desktop.addDocFoldersToRepo,
                            "openDocFromOtherApp": desktop.openDocFromOtherApp,
                            "fileIntoFolder": desktop.fileIntoFolder

                        };

                        if (successCallBack) {
                            successCallBack(desktopConfig);
                        }
                    } else {

                        //use old api for servers 2.0.1
                        ecm.model.admin.appCfg.getDesktopObjects(function(desktopConfigs) {
                            var desktopConfig = null;
                            dojo.forEach(desktopConfigs, function(entry, index) {
                                if ((desktopID == null || desktopID == "") && entry.getDefault() == ecm.messages.yes) {
                                    desktopConfig = entry;
                                }

                                if (desktopID == entry.id) {
                                    desktopConfig = entry;
                                }
                            });

                            if (successCallBack) {
                                desktopConfigArr = {
                                    "mobileAppAccess": desktopConfig.getMobileAppAccess(),
                                    "addPhotoFromMobile": desktopConfig.getAddPhotoFromMobile(),
                                    "addDocFoldersToRepo": desktopConfig.getAddDocFoldersToRepo(),
                                    "openDocFromOtherApp": desktopConfig.getOpenDocFromOtherApp(),
                                    "fileIntoFolder": desktopConfig.getFileIntoFolder()


                                };
                                successCallBack(desktopConfigArr);
                            }

                        });
                    }

                },/*failureCallBack*/null);

            } else {

                desktopConfig = {
                    "mobileAppAccess": ecm.model.desktop.mobileAppAccess,
                    "addPhotoFromMobile": ecm.model.desktop.addPhotoFromMobile,
                    "addDocFoldersToRepo": ecm.model.desktop.addDocFoldersToRepo,
                    "openDocFromOtherApp": ecm.model.desktop.openDocFromOtherApp,
                    "fileIntoFolder": ecm.model.desktop.fileIntoFolder

                };

                if (successCallBack) {
                    successCallBack(desktopConfig);
                }
            }

            this.logDebug("exit MILayer.getDesktopConfig");
            return true;
        },

        getDesktop: function(desktopID, successCallBack, failCallBack, onSessionExpiredCallBack) {

            this.logDebug("MILayer.getDesktop desktopID" + desktopID);

            //set error handler
            if (failCallBack)
                this.setOnCallBackFailed(failCallBack);

            if (onSessionExpiredCallBack)
                this.setOnSessionExpired(onSessionExpiredCallBack);

            this.setOnTimeOut(function(request){
                if(request && request.readyState!=4){
                    var message = new ecm.model.Message({
                        level: 1,
                        number: 610,
                        text: messages.network_error,
                        explanation:messages.timeout_occured
                    });
                    request.abort();
                    ecm.model.desktop.onMessageAdded(message);



                }else{
                    return;
                }

            });

            //check if desktop service url is set
            if(ecm.model.desktop.servicesUrl==null){
                var message = new ecm.model.Message({
                    level: 1,
                    number: 611,
                    text: "Specified Desktop service url is empty or null",
                });
                ecm.model.desktop.onMessageAdded(message);
            }


            this.loadDesktop(desktopID, dojo.hitch(this, function(desktop) {

                //if desktop has  not default repository return error
                if(desktop.getDefaultRepositoryId()==null){
                    var message = new ecm.model.Message({
                        level: 1,
                        number: 613,
                        text: messages.desktop_default_repository_not_found,
                        explanation:messages.desktop_default_repository_not_found_explanation
                    });
                    ecm.model.desktop.onMessageAdded(message);
                    return false;
                }

                if (successCallBack) {
                    this.logDebug("call MILayer.getDesktop infraCallBack");
                    successCallBack(desktop);
                }
            }));

            this.logDebug("exit MILayer.getDesktop");
            return true;
        },


        loadDesktop: function(desktopId, callback){
            ecm.model.desktop.id = desktopId || "";
            var self = this;

            var request = ecm.model.Request.invokeService("getDesktop", null, {
                desktop: ecm.model.desktop.id,
                useLastCache:"false"
            }, function(response) {
                self._desktopLoadCompleted(response, callback);
            }, false, false);

            return request;
        },

        _desktopLoadCompleted:function(response, callback){

            ecm.model.desktop.id = response.id;
            ecm.model.desktop.name = response.name;

            ecm.model.desktop.authenticationType = response.authenticationType || 2;

            ecm.model.desktop.connected = response.connected;
            ecm.model.desktop.userId = response.userid;
            ecm.model.desktop.userDisplayName = response.user_displayname;

            ecm.model.desktop.navigatorRelease = response.navigatorRelease;
            ecm.model.desktop.navigatorBuild = response.navigatorBuild;
            ecm.model.desktop.disableCookies = response.disableCookies || false;
            ecm.model.desktop.disableAutocomplete = response.disableAutocomplete || false;
            ecm.model.desktop.culturalCollation = response.culturalCollation || false;
            ecm.model.desktop.theme = response.theme;
            ecm.model.desktop.helpUrl = response.helpURL || document.location.protocol + "//" + document.location.host + "/wcdocs/";
            ecm.model.desktop.helpContext = response.helpContext;
            ecm.model.desktop.messageSearchUrl = response.messageSearchURL || "http://www.ibm.com/search/csass/search?q=";
            ecm.model.desktop.applicationName = response.applicationName || ecm.messages.product_name;
            ecm.model.desktop.loginLogoUrl = response.loginLogoURL;
            ecm.model.desktop.bannerLogoUrl = response.bannerLogoURL;
            ecm.model.desktop.loginInformationUrl = response.loginInformationURL;
            ecm.model.desktop.passwordRulesUrl = response.passwordRulesURL;
            ecm.model.desktop.bannerBackgroundColor = response.bannerBackgroundColor;
            ecm.model.desktop.bannerApplicationNameColor = response.bannerApplicationNameColor;
            ecm.model.desktop.bannerMenuColor = response.bannerMenuColor;
            ecm.model.desktop._authenticatingRepositoryId = response.authenticatingRepositoryId;
            ecm.model.desktop.defaultLayoutRepositories = response.defaultLayoutRepositories;

            ecm.model.desktop._additionalScript = response.additionalScript;
            ecm.model.desktop._additionalCss = response.additionalCss;
            ecm.model.desktop.layout = response.layout || "ecm.widget.layout.NavigatorMainLayout";
            ecm.model.desktop.maxNumberDocToAdd = response.maxNumberDocToAdd || 50;
            ecm.model.desktop.maxNumberDocToModify = response.maxNumberDocToModify || 50;
            ecm.model.desktop._actionHandler = response.actionHandler || "ecm.widget.layout.CommonActionsHandler";

            //taskManager
            ecm.model.desktop.taskManager.taskSecurityRoles = response.taskSecurityRoles;
            ecm.model.desktop.taskManager.serviceURL = response.taskManagerServiceURL;

            var defaultFeatureParamValue = ecm.model.desktop.getRequestParam("feature");
            var featureValueValid = false;
            if (response.features) {
                ecm.model.desktop.features = [];
                for ( var i = 0; i < response.features.length; i++) {
                    var featureI = new ecm.model.Feature(response.features[i]);
                    ecm.model.desktop.features.push(featureI);

                    if (!featureValueValid && defaultFeatureParamValue) {
                        if (featureI.id == defaultFeatureParamValue) {
                            featureValueValid = true;
                        }

                    }

                }
            }

            if (featureValueValid) {
                ecm.model.desktop.defaultFeature = defaultFeatureParamValue;
            } else {
                if (defaultFeatureParamValue) {

                    if (defaultFeatureParamValue != "ecmClientAdmin") {
                        ecm.model.desktop.addMessage(Message.createErrorMessage("feature_invalid", [
                            defaultFeatureParamValue
                        ]));
                        ecm.model.desktop.defaultFeature = response.defaultFeature;
                    } else {
                        ecm.model.desktop.defaultFeature = "ecmClientAdmin";
                    }

                } else {
                    ecm.model.desktop.defaultFeature = response.defaultFeature;
                }
            }

            ecm.model.desktop._role = response.role;
            ecm.model.desktop.showGlobalToolbar = response.showGlobalToolbar || false;
            ecm.model.desktop.preventCreateNewSearch = response.preventCreateNewSearch || false;
            ecm.model.desktop.preventCreateNewUnifiedSearch = response.preventCreateNewUnifiedSearch || false;
            ecm.model.desktop.showSecurity = response.showSecurity || false;
            ecm.model.desktop.fileIntoFolder = response.fileIntoFolder || false;
            ecm.model.desktop.enableThumbnails = true;
            if (response.enableThumbnails == false)
                ecm.model.desktop.enableThumbnails = false;
            ecm.model.desktop.showViewFilmstrip = true;
            if (response.showViewFilmstrip == undefined) {
                ecm.model.desktop.showViewFilmstrip = ecm.model.desktop.enableThumbnails;
            } else if (response.showViewFilmstrip == false)
                ecm.model.desktop.showViewFilmstrip = false;



            ecm.model.desktop.defaultRepositoryId = response.defaultRepositoryId;
            ecm.model.desktop.repositories = [];
            for ( var i in response.servers) {
                var repositoryJSON = response.servers[i];
                ecm.model.desktop.repositories.push(ecm.model.desktop.createRepository(repositoryJSON));
            }

            ecm.model.desktop.container = null;
            if (response.containers) {
                var containerJSON = response.containers;
                var container = new ecm.model.Container(containerJSON);
                container.userId = containerJSON.userID;
                container.userDisplayName = containerJSON.user_displayname;
                container.desktop = containerJSON.desktop;
                if (containerJSON.adminLayout) {
                    if (!containerJSON.adminLayout.featureTooltip)
                        containerJSON.adminLayout.featureTooltip = ecm.messages.launchbar_admin;

                    ecm.model.desktop.createAdminFeature(containerJSON.adminLayout);
                    if (ecm.model.desktop.adminFeature)
                        ecm.model.desktop.features.push(ecm.model.desktop.adminFeature);
                }

                if (ecm.model.desktop.authenticationType == 1 && container.connected) {
                    container.onConnected(container);
                    ecm.model.desktop.onLogin();
                }
            }

            ecm.model.desktop.container = container;
            if (response.tam_token)
                ecm.model.desktop._ssoTokenPresent = response.tam_token;
            ecm.model.desktop._plugins = response.plugins;
//            ecm.model.desktop._initializePlugins();

            // Mid-tier appServer information
            ecm.model.desktop.appServerOs = {
                name: response.appServerOSName,
                arch: response.appServerOSArch,
                version: response.appServerOSVersion,
                distroName: response.appServerOSDistroName,
                distroRelease: response.appServerOSDistroRelease
            };

            // mobile settings
            ecm.model.desktop.mobileAppAccess = response.mobileAppAccess;
            ecm.model.desktop.addPhotoFromMobile = response.addPhotoFromMobile;
            ecm.model.desktop.addDocFoldersToRepo = response.addDocFoldersToRepo;
            ecm.model.desktop.openDocFromOtherApp = response.openDocFromOtherApp;

            ecm.model.desktop.mobileFeatures = [];

            dojo.forEach(response.mobileFeatures, function(mobileFeatureJSON) {
                var mobileFeature = {};
                mobileFeature.id = mobileFeatureJSON.id;
                mobileFeature.name = mobileFeatureJSON.name;
                mobileFeature.display = mobileFeatureJSON.display;
                mobileFeature.url = mobileFeatureJSON.url;
                mobileFeature.iconFile = mobileFeatureJSON.iconFile;
                ecm.model.desktop.mobileFeatures.push(mobileFeature);
            }, ecm.model.desktop);


            ecm.model.desktop.onDesktopLoaded(response);
            if (callback) {
                callback(ecm.model.desktop);
            }
            ecm.model.desktop._checkForConnectedRepositories();

            ecm.model.desktop.onChange(ecm.model.desktop);
            ecm.model.desktop.logExit("_desktopLoaded");

        },


        logon: function(repositoryId, user, pass, successCallBack) {
            this.logDebug("MILayer.logon repositoryId=" + repositoryId + " user=" + user + " pass=" + pass);
            var repository = null;

            //init repository
            if (repositoryId == null || repositoryId == "") {
                repository = ecm.model.desktop.getDefaultRepository();
            } else {
                repository = ecm.model.desktop.getRepository(repositoryId);
            }

            if (repository == null) {
                var message = new ecm.model.Message({
                    level: 1,
                    number: 607,
                    text: "Repository with id [" + repository + "] is not found",
                });
                ecm.model.desktop.onMessageAdded(message);
                return false;
            }

            repository.userId = user;

            /*
             * To be compatible with 2.0.1 ecm.model.desktop.logon method not supported
             * the logon is done with initial repository where as in the server after version 2.0.1
             * the logon is done on the desktop level.
             */
            if(this.getServerVersion() == "2.0.1"){
                repository.logon(pass, dojo.hitch(this, function(returned_repository) {
                    if (repository.connected) {
                        this.logDebug("connected succeded");
                        repository.refresh();

                        if (this.currentRepository == null)
                            ecm.model.desktop.setInitialRepository(repository);


                        this.currentRepository = repository;

                        if(successCallBack) {
                            successCallBack(returned_repository);
                        }
                    }
                }));

            }else{

                ecm.model.desktop.setInitialRepository(repository);
                ecm.model.desktop.userId=user;

                ecm.model.desktop.logon(pass, dojo.hitch(this, function(returned_repository) {
                    if (repository.connected) {
                        this.logDebug("connected succeded");
                        repository.refresh();

                        if (this.currentRepository == null)
                            ecm.model.desktop.setInitialRepository(repository);


                        this.currentRepository = repository;

                        if(successCallBack) {
                            successCallBack(returned_repository);
                        }
                    }
                }));

            }

            return true;
        },

        logOff: function(successCallBack) {
            this.logDebug("MILayer.logOff");

            var repository = this.getCurrentRepository();

            if (repository == null) {
                repository = ecm.model.desktop.getDefaultRepository();
            }

            if (repository.connected) {
                repository.onDisconnected = successCallBack;
                repository.logoff();
            } else {
                if (successCallBack) {
                    successCallBack(repository);
                }
            }

            //log off from the desktop
            ecm.model.desktop.logoff();

            return true;

        },

        /**
         * The function is invoked when message is returned, the callback signature has one arguments
         * (ecm.model.Message)
         */
        setOnTimeOut: function(timeoutHandler) {
            ecm.model.desktop.onRequestTimeout = timeoutHandler;
        },

        /**
         * The function is invoked when message is returned, the callback signature has one arguments
         * (ecm.model.Message)
         */
        setOnCallBackFailed: function(failCallBack) {
            ecm.model.desktop.onMessageAdded = failCallBack;
        },

        /**
         * The function is invoked when the session is expired, the callback signature has two arguments
         * (ecm.model.Desktop,ecm.model.Message)
         */
        setOnSessionExpired: function(sessionExpired) {
            ecm.model.desktop.onSessionExpired = sessionExpired;
        },

        /**
         * Locks the specified items on the repository.
         *
         * @param items
         *            An array of item ids representing the items to lock.
         * @param callback
         *            A function invoked when the items have successfully been locked.
         */
        lockItems: function(/*Array*/items, templateName, successCallBack) {
            this.logDebug("MILayer.lockItems items=" + items);


            if(items==null || items.length==0 || templateName == null){
                successCallBack([]);
                return true;
            }


            var lockedItems = [];
            var repository = this.getCurrentRepository();

            if (repository == null) {
                return false;
            }

            if (!lang.isArray(items)) {
                lockedItems.push(new ecm.model.ContentItem({
                    id: items,
                    name: "ContentItem",
                    repository: repository,
                    template: templateName
                }));
            } else {
                for ( var i in items) {
                    lockedItems.push(new ecm.model.ContentItem({
                        id: items[i],
                        name: "ContentItem",
                        repository: repository,
                        template: templateName
                    }));
                }
            }

            repository.lockItems(lockedItems, function(itemJSON) {
                if (successCallBack) {
                    successCallBack(itemJSON);
                }
            });

            this.logDebug("exit MILayer.lockItems items");
        },

        /**
         * Unlocks the specified items on the repository.
         *
         * @param items
         *            An array of item ids representing the items to unlock.
         * @param callback
         *            A function invoked when the items have successfully been locked.
         */
        unLockItems: function(/*Array*/items, successCallBack) {
            this.logDebug("MILayer.unlockItems items=" + items);

            var repository = this.getCurrentRepository();

            if (repository == null) {
                return false;
            }

            //return empty array with callback
            if(items == null || (lang.isArray(items) && items.length==0)){
                if (successCallBack) {
                    successCallBack([]);
                }
            }

            if (!lang.isArray(items)) {
                repository.retrieveItem(items, function(retrievedItem) {
                    repository.unlockItems([
                        retrievedItem
                    ], function(itemsJSON) {
                        if (successCallBack) {
                            successCallBack(retrievedItem);
                        }
                    });
                });

            } else {
                var unLockedItems = [];
                for ( var i in items) {
                    repository.retrieveItem(items[i], function(retrievedItem) {

                        unLockedItems.push(retrievedItem);

                        if (i == (items.length - 1)) {
                            repository.unlockItems(unLockedItems, function(returnedUnlockedItems) {
                                if (successCallBack) {
                                    successCallBack(unLockedItems);
                                }
                            });
                        }
                    });
                }
            }

            this.logDebug("exit MILayer.unlockItems items");
        },

        retrieveFolderContentWithFolders: function(docid, filter_type, order_by, descending, noCache, successCallBack) {
            this.logDebug("MILayer.retrieveFolderContentWithFolders docid=" + docid + " filter_type=" + filter_type + " order_by=" + order_by);

            var repository = this.getCurrentRepository();

            if (repository == null) {
                return false;
            }

            repository.retrieveItem(docid, dojo.hitch(this, function(item) {
                this.logDebug("item=" + docid + " is retrieved.");

                if (null != item) {
                    item.retrieveFolderContents(/*foldersOnly*/false, dojo.hitch(this, function(resultSet) {
                        this.lastResultSet = resultSet;
                        if (successCallBack)
                            successCallBack(resultSet);

                    }), order_by, descending, noCache,/*teamspaceId*/null, filter_type,/*parent*/null);
                } else {
                    if (successCallBack)
                        successCallBack([]);
                }
            }), /*templateID*/null, /*version*/null, /*vsId*/null, /*objectStoreId*/null);

            this.logDebug("exit MILayer.retrieveFolderContentWithFolders");
            return true;
        },
        retrieveFolderContentWithOnlyFolders: function(docid, filter_type, order_by, descending, noCache, successCallBack) {
            this.logDebug("MILayer.retrieveFolderContentWithOnlyFolders docid=" + docid + " filter_type=" + filter_type + " order_by=" + order_by);

            var repository = this.getCurrentRepository();

            if (repository == null) {
                return false;
            }

            repository.retrieveItem(docid, dojo.hitch(this, function(item) {
                this.logDebug("item=" + docid + " is retrieved.");

                if (null != item) {
                    item.retrieveFolderContents(/*foldersOnly*/true, dojo.hitch(this, function(resultSet) {
                        this.lastResultSet = resultSet;
                        if (successCallBack)
                            successCallBack(resultSet);
                    }), order_by, descending, noCache,/*teamspaceId*/null, filter_type,/*parent*/null);
                } else {
                    if (successCallBack)
                        successCallBack([]);
                }
            }), /*templateID*/null, /*version*/null, /*vsId*/null, /*objectStoreId*/null);

            this.logDebug("exit MILayer.retrieveFolderContentWithOnlyFolders");
            return true;
        },

        retrieveItemAttributes: function(docid,template_name, successCallBack) {
            this.logDebug("MILayer.retrieveItemAttributes docid=" + docid);

            var repository = this.getCurrentRepository();

            if (repository == null) {
                return false;
            }

            //create empty ContentItem
            var contentItem = new ecm.model.ContentItem({
                id: docid,
                name: "ContentItem",
                repository: repository,
                template:template_name
            });

            contentItem.retrieveAttributes(dojo.hitch(this, function(results) {
                if (successCallBack)
                    successCallBack(results);
            }));

            this.logDebug("exit MILayer.retrieveItemAttributes");
            return true;
        },

        retrieveItem: function(docid, templateName, successCallBack) {
            this.logDebug("MILayer.retrieveItem docid=" + docid);

            var repository = this.getCurrentRepository();

            if (repository == null) {
                return false;
            }


            //clear all cach.
            this.clearRepositoryCallBacksCache(repository);

            repository.retrieveItem(docid, dojo.hitch(this, function(item) {
                this.logDebug("item=" + docid + " is retrieved.");
                if (successCallBack) {
                    successCallBack(item);
                }
            }), templateName, /*version*/null, /*vsId*/null, /*objectStoreId*/null);

            this.logDebug("exit MILayer.retrieveItemAttributes");
            return true;
        },

        retrieveFavoriteItem: function(docid, templateName,vsId,successCallBack){

            this.logDebug("MILayer.retrieveFavoriteItem docid=" + docid);

            var repository = this.getCurrentRepository();

            if (repository == null) {
                return false;
            }

            //clear all cach.
            //repository.refresh();
            this.clearRepositoryCallBacksCache(repository);

            if (templateName.toLowerCase() == 'search'){
                repository.retrieveSearchTemplate(docid,null, null,dojo.hitch(this, function(item) {
                    this.logDebug("item=" + docid + " is retrieved.");
                    if (successCallBack) {
                        successCallBack(item);
                    }
                }));
            }else{
                repository.retrieveItem(docid, dojo.hitch(this, function(item) {
                    this.logDebug("item=" + docid + " is retrieved.");
                    if (successCallBack) {
                        successCallBack(item);
                    }
                }), templateName,"released",vsId, null, "favorite");
            }


            this.logDebug("exit MILayer.retrieveFavoriteItem");
            return true;
        },

        retrieveItemAsLink: function(docid, templateName, successCallBack) {

            this.logDebug("MILayer.retrieveItemAsLink docid=" + docid);

            var repository = this.getCurrentRepository();

            if (repository == null) {
                return false;
            }

            //clear all cach.
            //repository.refresh();
            this.clearRepositoryCallBacksCache(repository);




            if(repository.type=="cmis"){
                var rootItemId = "/";

                repository.retrieveItem(rootItemId, dojo.hitch(this, function(rootFolder) {

                    rootFolder.retrieveFolderContents(/*foldersOnly*/false, dojo.hitch(this, function(resultSet) {

                        repository.retrieveItem(docid,dojo.hitch(this, function(item) {
                            var newResultSetList = [];
                            newResultSetList.push(item);

                            resultSet.items = newResultSetList;
                            resultSet.parentFolder  =  new ecm.model.ContentItem({
                                id: "Link",
                                name: "Link",
                                repository: repository
                            });

                            resultSet.continuationData=null;

                            resultSet.repository = repository;
                            if(successCallBack)
                                successCallBack(resultSet);
                        }));


                    }), null, false, true,/*teamspaceId*/null,"",/*parent*/null);
                }), null, null, null, repository.objectStore);

            }else{

                //create empty Search
                var searchOnTheFly = new ecm.model.SearchTemplate({
                    id: "Link",
                    name: "Link",
                    repository: repository,
                });
                if(repository.type == "cm") {
                    searchOnTheFly.objectType="folder";
                    var searchConfig = ecm.model.SearchConfiguration.getSearchConfiguration({repository: repository});
                    var rootId = this.getRootClassId(repository.id,searchOnTheFly.objectType);

                    this.getContentClassById(rootId,repository.repositoryId,dojo.hitch(this, function(cc) {
                        cc.retrieveAttributeDefinitions(function(attributeDefinitions) {
                            var ccId = cc.id;
                            var nameAtt = null;
                            if (attributeDefinitions) {
                                nameAtt = attributeDefinitions[0].contentClass.nameAttribute;
                                if(ccId=="$common") {
                                    nameAtt = attributeDefinitions[0].id;
                                }
                            }

                            searchOnTheFly.searchDocument(docid,dojo.hitch(this, function(resultSet) {
                                repository.retrieveItem(docid,dojo.hitch(this, function(item) {
                                    var newResultSetList = [];
                                    var newColumns=[];
                                    for (var i=0;i<resultSet.structure.cells[0].length;i++) {
                                        var curCell = resultSet.structure.cells[0][i];
                                        if(i<2 || curCell.field==nameAtt) {
                                            newColumns.push(curCell);
                                        }
                                    }

                                    //if the new columns doesn't contain name column add it explicitly
                                    if(newColumns.length==2){
                                        newColumns.push({"field":"{NAME}",
                                            "name":ecm.messages.Name,
                                            "sortable":"1",
                                            "width":"25em"});
                                        item.attributes["{NAME}"]=item.name;
                                    }

                                    resultSet.structure.cells[0]=newColumns;
                                    newResultSetList.push(item);
                                    resultSet.searchTemplate = searchOnTheFly;
                                    resultSet.items = newResultSetList;
                                    resultSet.parentFolder  =  new ecm.model.ContentItem({
                                        id: "Link",
                                        name: "Link",
                                        repository: repository
                                    });
                                    resultSet.repository = repository;
                                    if(successCallBack)
                                        successCallBack(resultSet);
                                }));
                            }));
                        });
                    }));
                } else {
                    searchOnTheFly.name = templateName;
                    searchOnTheFly.searchDocument(docid,dojo.hitch(this, function(resultSet) {
                        repository.retrieveItem(docid,dojo.hitch(this, function(item) {
                            var newResultSetList = [];
                            newResultSetList.push(item);

                            resultSet.items = newResultSetList;
                            resultSet.parentFolder  =  new ecm.model.ContentItem({
                                id: "Link",
                                name: "Link",
                                repository: repository
                            });
                            resultSet.repository = repository;
                            if(successCallBack)
                                successCallBack(resultSet);
                        }),templateName);
                    }));
                }


            }

            this.logDebug("exit MILayer.retrieveItemAsLink");
            return true;
        },


        retrieveContentClasses: function(filter_type, successCallBack) {
            this.logDebug("MILayer.retrieveContentClasses");

            var repository = this.getCurrentRepository();

            if (repository == null) {
                return false;
            }
            repository.retrieveContentClasses(function(contentClasses) {
                if (repository.type=="cm") {
                    if (filter_type == 'createFolder' || filter_type == 'createDocument'){
                        var availableClasses = [];
                        for(var i=0;i<contentClasses.length;i++){
                            if (contentClasses[i].hasPrivilege("privAddItem")
                                //The following condition ("hierarchical") should not not always be considered , but as far i saw it is
                                //more accurate to filter classes according to it
                                //                                && !contentClasses[i].hierarchical
                                //                                && contentClasses[i].hasPrivilege("privAddContent")
                                && ((filter_type == 'createFolder' && !contentClasses[i].notForFolders)
                                || (filter_type == 'createDocument' && !contentClasses[i].forFoldersOnly && contentClasses[i].storesContent)
                                )){
                                availableClasses.push(contentClasses[i]);
                            }
                        }
                        contentClasses = availableClasses;
                    }else{
                        //create 'all' pseudo class
                        var allClass = new ecm.model.ContentClass({
                            id:"$common",
                            name: ecm.messages.search_class_all_pseudo,
                            repository:repository,
                            pseudoClass:true
                        });
                        if (contentClasses[0].id != "$common") {
                            contentClasses.unshift(allClass);
                        }

                    }
                }
                if (successCallBack)
                    successCallBack(contentClasses);
            }, filter_type);

            this.logDebug("exit MILayer.retrieveContentClasses");
            return true;
        },

        getAttributesValidator: function(docId, template_name, isReadOnly, successCallBack) {
            this.logDebug("MILayer.getAttributesValidator");

            var repository = this.getCurrentRepository();

            if (repository == null) {
                return false;
            }

            this.retrieveItemUserAttributesDefinitions(docId, template_name, function(attributesDefinitions) {
                var attrValidation = new AttributesValidator(attributesDefinitions, isReadOnly, repository);
                if (successCallBack) {
                    successCallBack(attrValidation);
                }
            });

            this.logDebug("exit MILayer.getAttributesValidator");
        },

        retrieveItemUserAttributesDefinitions: function(docId, template_name, successCallBack) {
            this.logDebug("MILayer.retrieveItemAttributesDefinitions");

            var repository = this.getCurrentRepository();

            if (repository == null) {
                return false;
            }

            //create empty ContentItem
            var contentItem = new ecm.model.ContentItem({
                id: docId,
                name: "ContentItem",
                repository: repository,
                template: template_name
            });

            contentItem.retrieveAttributes(function(itemAttributes) {



                var contentClass = repository.getContentClass(contentItem.getContentClass().id);
                contentClass.name = contentItem.getContentClass().name;

                contentClass.retrieveAttributeDefinitions(function(attributeDefinitions) {

                    var userAttributes = [];

                    for ( var i in attributeDefinitions) {

                        var attributeDefinition = attributeDefinitions[i];
                        var cr = attributeDefinition.cardinality;

                        var isAttributeIsReadOnly = false;
                        if(contentItem.attributeReadOnly && contentItem.attributeReadOnly[attributeDefinition.id] === true){
                            attributeDefinition.readOnly=true;
                        }

                        if(attributeDefinition.maxValue!=null && attributeDefinition.maxValue==Number.MAX_VALUE){
                            attributeDefinition.maxValue = MAX_POSITIVE_INT;
                        }
                        if(attributeDefinition.minValue!=null && attributeDefinition.minValue<MAX_NEGATIVE_INT){
                            attributeDefinition.minValue = MAX_NEGATIVE_INT;
                        }
                        if (!attributeDefinition.hidden && !attributeDefinition.system) {
                            userAttributes.push(attributeDefinition);
                        }
                    }

                    if (successCallBack) {
                        successCallBack(userAttributes);
                    }
                });
            });

            this.logDebug("exit MILayer.retrieveItemAttributesDefinitions");
        },

        retrieveContentClassAttributeDefinitions: function(contentClassId,withSystem,successCallBack) {
            this.logDebug("MILayer.retrieveContentClassAttributeDefinitions");

            //param validation
            if(contentClassId==null || contentClassId==undefined){
                var message = new ecm.model.Message({
                    level: 1,
                    number: 602,
                    explanation: "Content class id no specified.",
                    text: "Content class no found."
                });
                ecm.model.desktop.onMessageAdded(message);
                return false;
            }


            var repository = this.getCurrentRepository();

            if (repository == null) {
                return false;
            }

            var contentClass = repository.getContentClass(contentClassId);

            contentClass.retrieveAttributeDefinitions(function(attributeDefinitions) {
                var userAttributes = [];

                for ( var i in attributeDefinitions) {
                    var attributeDefinition = attributeDefinitions[i];
                    if(attributeDefinition.maxValue!=null && attributeDefinition.maxValue>=MAX_POSITIVE_INT){
                        attributeDefinition.maxValue = MAX_POSITIVE_INT;
                    }
                    if(attributeDefinition.minValue!=null && attributeDefinition.minValue<MAX_NEGATIVE_INT){
                        attributeDefinition.minValue = MAX_NEGATIVE_INT;
                    }

                    if(!attributeDefinition.hidden && (!attributeDefinition.system || (attributeDefinition.system && withSystem))) {
                        userAttributes.push(attributeDefinition);
                    }
                }

                if (successCallBack) {
                    successCallBack(userAttributes);
                }
            });

            this.logDebug("exit MILayer.retrieveContentClassAttributeDefinitions");
            return true;
        },
        retrieveContentClassFullAttributeDefinitions: function(contentClassId,includeSC, successCallBack) {
            this.logDebug("MILayer.retrieveContentClassAttributeDefinitions");
            //param validation
            if(contentClassId==null || contentClassId==undefined){
                var message = new ecm.model.Message({
                    level: 1,
                    number: 602,
                    explanation: "Content class id no specified.",
                    text: "Content class no found."
                });
                ecm.model.desktop.onMessageAdded(message);
                return false;
            }
            var repository = this.getCurrentRepository();
            var searchConfig = ecm.model.SearchConfiguration.getSearchConfiguration({repository: repository});
            if (repository == null) {
                return false;
            }

            var contentClass = repository.getContentClass(contentClassId);


            contentClass.retrieveAttributeDefinitionsForSearches(function(attributeDefinitions) {
                var userAttributes = [];

                for ( var i in attributeDefinitions) {
                    var attributeDefinition = attributeDefinitions[i];
                    if (!attributeDefinition.hidden && attributeDefinition.name != 'Active Markings' && attributeDefinition.name != 'Coordinated Tasks' && attributeDefinition.searchable==true) {
                        if(attributeDefinition.maxValue!=null && attributeDefinition.maxValue>=Number.MAX_VALUE){
                            attributeDefinition.maxValue = MAX_POSITIVE_INT;
                        }
                        if(attributeDefinition.minValue!=null && attributeDefinition.minValue<MAX_NEGATIVE_INT){
                            attributeDefinition.maxValue = MAX_NEGATIVE_INT;
                        }
                        userAttributes.push(attributeDefinition);
                    }
                }

                if (successCallBack) {
                    successCallBack(userAttributes);
                }
            },includeSC);

            this.logDebug("exit MILayer.retrieveContentClassAttributeDefinitions");
            return true;
        },
        retrieveDependentAttributeDefinitions: function(classId, params, successCallBack) {
            this.logDebug("MILayer.retrieveDependentAttributeDefinitions");
            var repository = this.getCurrentRepository();
            var paramsF = lang.isString(params) ? eval("(" + params + ")") : params;
            this.getContentClassById(classId,repository.repositoryId,dojo.hitch(this, function(contentClass) {
                contentClass.retrieveDependentAttributeDefinitions(paramsF, null, function(attributeDefinitions){
                    var userAttributes = [];

                    for ( var i in attributeDefinitions) {
                        var attributeDefinition = attributeDefinitions[i];
                        if(attributeDefinition.maxValue!=null && attributeDefinition.maxValue>=MAX_POSITIVE_INT){
                            attributeDefinition.maxValue = MAX_POSITIVE_INT;
                        }
                        if(attributeDefinition.minValue!=null && attributeDefinition.minValue<MAX_NEGATIVE_INT){
                            attributeDefinition.minValue = MAX_NEGATIVE_INT;
                        }

                        if(!attributeDefinition.hidden && (!attributeDefinition.system)) {
                            userAttributes.push(attributeDefinition);
                        }
                    }

                    if (successCallBack) {
                        successCallBack(userAttributes);
                    }
                }, false, function(error){
                    //              successCallBack(null);
                });
            }));
            this.logDebug("exit retrieveDependentAttributeDefinitions");
            return true;
        },
        retrieveAttributeOperatorsDefinitions: function(params, successCallBack) {
            this.logDebug("MILayer.retrieveAttributeOperatorsDefinitions");
            var paramsF = lang.isString(params) ? eval("(" + params + ")") : params;
            var repository = this.getCurrentRepository();

            if (repository == null) {
                return false;
            }

            var searchConfig = ecm.model.SearchConfiguration.getSearchConfiguration({repository: repository});

            //        var operators = searchConfig.getOperators(params.dataType, operators.cardinality, params.choiceList, params.textSearchable,params.nullable,params.usesLongColumn,params.hasDependentAttributes);
            var operators = searchConfig.getOperators(paramsF.dataType, paramsF.cardinality, paramsF.choiceList, paramsF.textSearchable,paramsF.nullable,paramsF.usesLongColumn,paramsF.hasDependentAttributes);
            var operatorsO = searchConfig.getOperatorSelectOptions(paramsF.dataType, paramsF.cardinality, paramsF.choiceList, paramsF.textSearchable,paramsF.nullable,paramsF.usesLongColumn,paramsF.hasDependentAttributes);

            successCallBack(operators);
            return true;
            this.logDebug("MILayer.retrieveAttributeOperatorsDefinitions");
        },
        
       
        
        _retrieveWorkItems:function(item,finalCallback) {
        	if(item.isInstanceOf &&
        		(item.isInstanceOf(ecm.model.WorklistFolder) // Is container? 
        				|| item.isInstanceOf(ecm.model.ProcessRole) || item.isInstanceOf(ecm.model.ProcessApplicationSpace))) {
        		item.retrieveWorklists(dojo.hitch(this,function(wBasketList){ 
        			item = wBasketList[0]; this._retrieveWorkItems(item,finalCallback);
        		})); 
        		} else {
        		item.retrieveWorkItems(dojo.hitch(this, function(wItems) { if(finalCallback) {
        		                          finalCallback(wItems);
        		                       }}),null, null, true,null);
        		}
        		                    return true;
       },
        		retrieveWorkItems:function(callback) {
        		var repository = this.getCurrentRepository(); if (repository == null) {
        		                       return false;
        		                    }
        		repository.retrieveWorklistContainers(dojo.hitch(this, function(wlContainers) {
        		                       item = wlContainers[0];
        		this._retrieveWorkItems(item,callback); }));
        		return true;
        		},
        		
        retrieveCategorizedItemAttributes: function(docId, template_name, successCallBack) {

            this.logDebug("MILayer.retrieveCategorizedItemAttributes");

            var userAttributes = [];
            var systemAttributesPairs = [];

            var repository = this.getCurrentRepository();

            if (repository == null) {
                return false;
            }

            //create empty ContentItem
            var contentItem = new ecm.model.ContentItem({
                id: docId,
                name: "ContentItem",
                repository: repository,
                template: template_name
            });

            contentItem.retrieveAttributes(dojo.hitch(this, function(returnedItem) {



                var contentClass = repository.getContentClass(contentItem.getContentClass().id);
                contentClass.name = contentItem.getContentClass().name;
                //class name not relavent for CMOD
                if (contentItem.repository.type != "od") {
                    userAttributes.push([
                        "Class",
                        contentItem.getContentClass().name,
                        contentItem.getContentClass().id,
                        "x:string"
                    ]);
                }


                contentClass.retrieveAttributeDefinitions(dojo.hitch(this, function(attributeDefinitions) {

                    //set all attributes definition into dictionary (id:def)
                    var attributeDefinitionsDict = {};
                    for(var i in attributeDefinitions) {
                        attributeDefinitionsDict[attributeDefinitions[i].id]=attributeDefinitions[i];
                    }

                    //get system attributes for CMOD repository
                    if (contentItem.repository.type == "od") {
                        var attrs = contentItem.attributes;

                        if (attrs) {
                            for (var attr in attrs) {
                                if (contentItem.attributeSystemProperty[attr] && attr != "hitLength" && attr != "idValue") {

                                    var value = contentItem.getDisplayValue(attr);
                                    if(value!=null && value!=""){
                                        var dataType = "xs:string";
                                        if (attr == "file_size") {
                                            contentItem.attributeFormats[attr] = "fileSize";
                                        }

                                        var label = contentItem.getAttrLabel(attr);
                                        systemAttributesPairs.push([label,value,attr,dataType]);

                                    }

                                }
                            }
                        }

                    }
                    //set item attributes

                    for (var i in returnedItem.attributes){

                        if(returnedItem.attributes[i]!=null && returnedItem.attributes[i]>=MAX_POSITIVE_INT){
                            returnedItem.attributes[i]  = MAX_POSITIVE_INT;
                        }

                        if(returnedItem.attributes[i]!=null && returnedItem.attributes[i]<MAX_NEGATIVE_INT){
                            returnedItem.attributes[i]  = MAX_NEGATIVE_INT;
                        }
                    }

                    //set system attributes
                    for (var i in returnedItem.attributeSystemProperty){
                        var attributeDefinition = attributeDefinitionsDict[i];
                        if(attributeDefinition!=null){

                            if(!attributeDefinition.hidden){

                                var value = this._getItemAttributeValue(attributeDefinition, contentItem);
                                value = value == null ? "" : value;
                                systemAttributesPairs.push([
                                    attributeDefinition.name,
                                    value,
                                    attributeDefinition.id,
                                    attributeDefinition.dataType]);

                            }
                        }
                    }

                    //set user attributes
                    for ( var i in returnedItem.attributes) {
                        var attributeDefinition = attributeDefinitionsDict[i];
                        if(attributeDefinition!=null){


                            if(!attributeDefinition.hidden && !attributeDefinition.system){

                                var value = this._getItemAttributeValue(attributeDefinition, contentItem);
                                value = value == null ? "" : value;
                                userAttributes.push([
                                    attributeDefinition.name,
                                    value,
                                    attributeDefinition.id,
                                    attributeDefinition.dataType
                                ]);

                            }
                        }
                    }



                    var categorizedItemAttributes = {
                        "systemProperties": systemAttributesPairs,
                        "properties": userAttributes,
                        "attributes": returnedItem.attributes
                    };

                    if (successCallBack)
                        successCallBack(categorizedItemAttributes)

                }), true);
            }));

            this.logDebug("exit MILayer.retrieveCategorizedItemAttributes");
            return true;
        },

        /**
         * Pass an instance of {@link ecm.model.ContentClass} for the given class identifier to successCallBack function
         *
         * @param classId
         *            The identifier of the content class.
         * @param repositoryId
         *            Repository ID
         * @param successCallBack
         *            will be called with {@link ecm.model.ContentClass} argument
         */
        getContentClassById: function(/*classId*/classId,/*repositoryId*/repositoryId, successCallBack) {

            var repository = this.getCurrentRepository();

            if (repository == null) {
                return false;
            }

            if (repository.repositoryId != repositoryId) {
                repository = ecm.model.desktop.getRepository(repositoryId);
            }
            if (repository == null) {
                var message = new ecm.model.Message({
                    level: 1,
                    number: 601,
                    text: "Repository with id " + repositoryId + " doesn't exist",
                });
                ecm.model.desktop.onMessageAdded(message);
                return false;
            }

            //retrieve repository content classes to make sure that given id exists
            repository.retrieveContentClasses(dojo.hitch(this, function(contentClasses) {
                for ( var j in contentClasses) {
                    var contentClass = contentClasses[j];
                    if (contentClass.id == classId && successCallBack) {
                        successCallBack(contentClass);
                        return true;
                    }
                }
                var message = new ecm.model.Message({
                    level: 1,
                    number: 602,
                    text: "Content class with id " + classId + " doesn't exist",
                });
                ecm.model.desktop.onMessageAdded(message);
                return false;

            }), "");

            return false;

        },

        /**
         * Returns the (String)Id of the root class for the given object type.
         *
         * @param repositoryId
         *            Repository ID
         * @param objectType
         *            The object type for which to get the root class ID
         */
        getRootClassId: function(/*repositoryId*/repositoryId,/* String */objectType) {

            var repository = this.getCurrentRepository();

            if (repository == null) {
                return false;
            }

            if (repository.repositoryId != repositoryId) {
                repository = ecm.model.desktop.getRepository(repositoryId);
            }

            if (repository == null) {
                var message = new ecm.model.Message({
                    level: 1,
                    number: 601,
                    text: "Repository with id " + repositoryId + " doesn't exist",
                });
                ecm.model.desktop.onMessageAdded(message);
                return null;
            }

            var searchConfig = ecm.model.SearchConfiguration.getSearchConfiguration({
                repository: repository
            });


            return searchConfig.getRootClassId(objectType);
        },

        addFolderItem: function(parentFolderID, folderName, folderClass, p_criterias, p_childComponentValues, p_permissions, p_securityPolicyId, p_workspaceId, successCallBack) {

            this.logDebug("MILayer.addFolderItem parentFolderID=" + parentFolderID);

            var repository = this.getCurrentRepository();

            if (repository == null) {
                return false;
            }

            //prepare params
            var criterias = lang.isString(p_criterias) ? eval("(" + p_criterias + ")") : p_criterias;
            var childComponentValues = lang.isString(p_childComponentValues) ? eval("(" + p_childComponentValues + ")") : p_childComponentValues;
            //var permissions = lang.isString(p_permissions) ? eval("(" + p_permissions + ")") : p_permissions;

            var securityPolicyId = p_securityPolicyId;
            var workspaceId = p_workspaceId;
            var documentType = folderClass;

            var folderProperties = {};
            folderProperties.docid = parentFolderID != null ? parentFolderID : "";
            folderProperties.folderName = folderName;
            folderProperties.criterias = criterias;
            folderProperties.childComponentValues = childComponentValues;
            folderProperties.documentType = documentType;

            //create parent ContentItem
            var parentFolder = new ecm.model.ContentItem({
                id: folderProperties.docid,
                name: folderProperties.docid,
                repository: repository,
            });



            if (repository._isP8()) {
                var objectStore = repository.objectStoreName;
                repository.addFolderItem(parentFolder, objectStore, documentType, folderProperties, [], null, securityPolicyId, workspaceId, function(newItem, fieldErrors) {

                    if (fieldErrors && fieldErrors.length>0) {

                        var message = new ecm.model.Message({
                            level: 1,
                            number: 614,
                            text:fieldErrors[0].symbolicName,
                            explanation:fieldErrors[0].errorMessage
                        });
                        ecm.model.desktop.onMessageAdded(message);
                        return;

                    } else {
                        if (successCallBack) {
                            successCallBack(newItem);
                        }
                    }
                });
            } else {
                var request = repository.addFolderItem(parentFolder, null, documentType, criterias, childComponentValues, [], null, workspaceId, function(newItem, fieldErrors) {
                    if (fieldErrors && fieldErrors.length>0) {

                        var message = new ecm.model.Message({
                            level: 1,
                            number: 614,
                            text:fieldErrors[0].symbolicName,
                            explanation:fieldErrors[0].errorMessage
                        });
                        ecm.model.desktop.onMessageAdded(message);
                        return;

                    } else {
                        if (successCallBack) {
                            successCallBack(newItem);
                        }
                    }
                });
            }


            this.logDebug("exit MILayer.addFolderItem");
            return true;
        },

        deleteItem: function(itemId, successCallBack) {

            this.logDebug("MILayer.deleteItem itemId=" + itemId);

            var repository = this.getCurrentRepository();

            if (repository == null) {
                return false;
            }

            //create parent ContentItem
            var deletedItem = new ecm.model.ContentItem({
                id: itemId,
                name: "deletedItem",
                repository: repository
            });

            repository.deleteItems(new Array(deletedItem), function() {
                // Remove items from favorites
                if (deletedItem) {
                    var favoritesToRemove = [];
                    favoritesToRemove.push(ecm.model.Favorite.createFromItem(deletedItem));
                    ecm.model.desktop.removeFavorites(favoritesToRemove,function(){
                    });
                }

                if (successCallBack) {
                    successCallBack(deletedItem)
                }

            }, true);

            this.logDebug("exit MILayer.deleteItem");
            return true;
        },

        getDocumentBookMarkLink:function(itemId,templateName,successCallBack){

            this.logDebug("MILayer.getDocumentBookMarkLink itemId=" + itemId);

            var repository = this.getCurrentRepository();

            if (repository == null) {
                return false;
            }


            if(repository._isP8() && itemId.indexOf("StoredSearch")!=-1 || repository._isCM() && itemId.indexOf("ICMSearch")!=-1 ){

                //create previewedItem ContentItem
                var linkedItem = new ecm.model.ContentItem({
                    id: itemId,
                    repository: repository,
                    template: templateName
                });



                repository.retrieveVersions(linkedItem, null, dojo.hitch(this, function(resultSet) {

                    var docItem = resultSet.items[0];

                    var boolmarkLink = ecm.model.Item.getBookmark(docItem, "current");
                    //since the web context might be loaded locally set the protocal and the contexy from the Desktop
                    if(boolmarkLink.indexOf("file://null") == 0 ){
                        boolmarkLink =  boolmarkLink.replace("file://null",ecm.model.desktop.servicesUrl);
                    }

                    if(successCallBack){
                        successCallBack({"bookmark":boolmarkLink});
                    }
                }), true);
            }else{

                repository.retrieveItem(itemId, dojo.hitch(this, function(docItem) {

                    var boolmarkLink = ecm.model.Item.getBookmark(docItem, "current");
                    //since the web context might be loaded locally set the protocal and the contexy from the Desktop
                    if(boolmarkLink.indexOf("file://null") == 0 ){
                        boolmarkLink =  boolmarkLink.replace("file://null",ecm.model.desktop.servicesUrl);
                    }

                    if(successCallBack){
                        successCallBack({"bookmark":boolmarkLink});
                    }
                }),templateName);

            }

            this.logDebug("exit MILayer.getDocumentBookMarkLink");
            return true;
        },

        getDocumentURL: function(itemId, templateName, successCallBack) {

            this.logDebug("MILayer.deleteItem itemId=" + itemId);

            var repository = this.getCurrentRepository();

            if (repository == null) {
                return false;
            }

            //create previewedItem ContentItem
            var previewedItem = new ecm.model.ContentItem({
                id: itemId,
                repository: repository,
                template: templateName
            });

            previewedItem.retrieveAttributes(function(item) {
                var contentUrl = item.getContentUrl();
                if (successCallBack)
                    successCallBack({
                        "url": contentUrl,
                        "desktopId": ecm.model.desktop.id,
                        "securityToken": ecm.model.Request._security_token,
                        "replicationGroup": item.replicationGroup,
                        "servicesUrl": ecm.model.desktop.servicesUrl
                    });
            });

            this.logDebug("exit MILayer.deleteItem");
            return true;
        },

        retrieveSubClasses: function(classId, successCallBack) {

            this.logDebug("MILayer.retrieveSubClasses classId=" + classId);


            //param validation
            if(classId==null || classId==undefined){
                var message = new ecm.model.Message({
                    level: 1,
                    number: 602,
                    explanation: "Content class id no specified.",
                    text: "Content class no found."
                });
                ecm.model.desktop.onMessageAdded(message);
                return false;

            }

            var repository = this.getCurrentRepository();

            if (repository == null) {
                return false;
            }


            //create parent ContentItem
            var contentClass = repository.getContentClass(classId);
            //bug 33869 fix - clear subClasses cache
            contentClass.subClasses=null;
            contentClass.retrieveSubClasses(function(contentClasses) {
                if (successCallBack) {
                    successCallBack(contentClasses);
                }
            },"");

            this.logDebug("exit MILayer.retrieveSubClasses");
            return true;

        },

        retrieveNextPage: function(searchResultId, itemsNeededToRetrieve, successCallBack) {

            this.lastResultSet.retrieveNextPage(dojo.hitch(this, function() {
                if (successCallBack)
                    successCallBack(this.lastResultSet);
            }), itemsNeededToRetrieve, "continueQuery");

            return true;
        },

        /**
         * Updates the attribute values of item. The attributes are saved to the repository.
         *
         * @param itemId
         *            An object id containing the attribute values, keyed by attribute identifier.
         * @param attributes
         *            An object containing the attribute values, keyed by attribute identifier. might be either object
         *            or object JSON representation. [{name:attribute_name,value:attribute_value}].
         * @param newTemplatename
         *            The new content class for the content item. might be null,otherwise the templateName is left
         *            unchanged.
         * @param childComponentValues
         *            The child component values to be save (CM only)
         * @param permissions
         *            The permissions to be saved might null.
         * @param callback
         *            A function, invoked after the attributes have been updated. If errors are found with the attribute
         *            values, an object is passed to this callback which indicates the field, error message, and values
         *            in error.
         */

        saveAttributes: function(itemId, p_attributes, newTemplateName, p_childComponentValues, p_permissions, successCallBack) {
            this.logDebug("MILayer.saveAttributes");

            var repository = this.getCurrentRepository();

            if (repository == null) {
                return false;
            }


            var attributes = lang.isString(p_attributes) ? eval("(" + p_attributes + ")") : p_attributes;

            var childComponentValues = lang.isString(p_childComponentValues) ? eval("(" + p_childComponentValues + ")") : p_childComponentValues;

            repository.retrieveItem(itemId, function(retrieveItem) {
                if (repository.type == 'cm' && !retrieveItem.locked){
                    var lockedItem = [];
                    lockedItem.push(new ecm.model.ContentItem({
                        id: itemId,
                        name: "ContentItem",
                        repository: repository,
                        template: retrieveItem.template
                    }));
                    repository.lockItems(lockedItem,function(returnedValue){
                        retrieveItem.saveAttributes(attributes, newTemplateName, childComponentValues, retrieveItem.permissions,/*checkIn*/false, function(jsonItem) {
                            var unLockedItems = [];
                            unLockedItems.push(retrieveItem);
                            repository.unlockItems(unLockedItems, function(returnedUnlockedItems) {
                                if (successCallBack && (jsonItem.errors == null || jsonItem.errors.length < 1)) {
                                    successCallBack(retrieveItem);
                                }
                            });
                        });
                    });
                }else{
                    retrieveItem.saveAttributes(attributes, null, childComponentValues, retrieveItem.permissions,/*checkIn*/false, function(jsonItem) {
                        if (jsonItem && jsonItem.fieldErrors && jsonItem.fieldErrors.length > 0) {

                            var message = new ecm.model.Message({
                                level: 1,
                                number: 614,
                                text:jsonItem.fieldErrors[0].symbolicName,
                                explanation:jsonItem.fieldErrors[0].errorMessage
                            });
                            ecm.model.desktop.onMessageAdded(message);
                        }else{
                            if (successCallBack && (jsonItem.errors == null || jsonItem.errors.length < 1)) {
                                successCallBack(retrieveItem);
                            }
                        }
                    });
                }

            },newTemplateName);
            this.logDebug("MILayer.saveAttributes");
        },

        checkInDocumentItem:function(itemId, name, p_templateName, p_criterias, p_contentSourceType, p_mimetype, p_filename, p_content_path, p_childComponentValues, p_permissions, p_securityPolicyId, p_newVersion, p_checkInAsMinorVersion, p_autoClassify, successCallBack) {

            var oReq = new XMLHttpRequest();


            oReq.open("GET", p_content_path+"?rand="+(new Date().getTime()), true);
            oReq.responseType = "arraybuffer";

            oReq.onload = dojo.hitch(this,function (oEvent) {
                var arrayBuffer = oReq.response;
                if (arrayBuffer) {

                    this.checkInDocumentItemComplete(itemId, name, p_templateName, p_criterias, p_contentSourceType, p_mimetype, p_filename, arrayBuffer, p_childComponentValues, p_permissions, p_securityPolicyId, p_newVersion, p_checkInAsMinorVersion, p_autoClassify, successCallBack);
                }

            });
            oReq.onerror = function(e){
                var message = new ecm.model.Message({
                    level: 1,
                    number: 612,
                    text:e.toString()
                });
                ecm.model.desktop.onMessageAdded(message);
                return;

            }


            oReq.send(null);

        },

        /**
         * Checks in this item to the repository using the content stream.
         *
         * @param itemId
         *            The item id
         * @param name
         *            The item name
         * @param p_templateName
         *            The items content class name
         * @param p_criteria
         *            An array of property values to be set on checkin
         * @param p_contentSourceType
         *            A string value holding the content source type
         * @param p_mimeType
         *            A string value holding the mime type of the content
         * @param p_filename
         *            A string value holding the filename of the content
         * @param p_content
         *            The file content stream
         * @param p_childComponentValues
         *            An array of child compoenent values (CM only)
         * @param p_permissions
         *            The permissions to be saved
         * @param p_securityPolicyId
         *            A string holding a security policy id (P8 only, may be null).
         * @param p_newVersion
         *            A boolean value indicating whether to creat a new version (CM only).
         * @param p_checkInAsMinorVersion
         *            A boolean value indicating whether the item should be check in as a minor version (P8 only).
         * @param p_autoClassify
         *            A boolean value indicating whether the item should be auto classified (P8 only).
         * @param successCallBack
         *            A callback function to be called after the item has been checked in.
         */
        checkInDocumentItemComplete: function(itemId, name, p_templateName, p_criterias, p_contentSourceType, p_mimetype, p_filename, p_content, p_childComponentValues, p_permissions, p_securityPolicyId, p_newVersion, p_checkInAsMinorVersion, p_autoClassify, successCallBack) {

            this.logDebug("MILayer.checkInDocumentItem itemId" + itemId);

            var repository = this.getCurrentRepository();

            if (repository == null) {
                return false;
            }

            //create updated ContentItem
            var updatedContentItem = new ecm.model.ContentItem({
                id: itemId,
                name: name,
                template: p_templateName,
                repository: repository
            });

            var criterias = lang.isString(p_criterias) ? eval("(" + p_criterias + ")") : p_criterias;
            var contentSourceType = p_contentSourceType;
            var filename = p_filename;
            var c_mimetype = p_mimetype;
            var templateName = p_templateName;
            var content = lang.isString(p_content) ? eval("(" + p_content + ")") : p_content;

            var childComponentValues = lang.isString(p_childComponentValues) ? eval("(" + p_childComponentValues + ")") : p_childComponentValues;
            var permissions = lang.isString(p_permissions) ? eval("(" + p_permissions + ")") : p_permissions;

            var securityPolicyId = p_securityPolicyId;
            var newVersion = p_newVersion;
            var checkInAsMinorVersion = p_checkInAsMinorVersion;
            var autoClassify = p_autoClassify;



            var contentBlob = null;
            try{
                contentBlob = new Blob([content], {"type": c_mimetype});
            }catch(e){
                var message = new ecm.model.Message({
                    level: 1,
                    number: 612,
                    text:messages.change_document_fail,
                    explanation:messages.add_change_document_not_supported
                });
                ecm.model.desktop.onMessageAdded(message);
                return;
            }


            updatedContentItem.checkIn(templateName, criterias, contentSourceType, c_mimetype, filename, contentBlob, childComponentValues, null, securityPolicyId, newVersion, checkInAsMinorVersion, autoClassify, function(checkedInItem,fieldErrors) {
                if (fieldErrors && fieldErrors.length>0) {

                    var message = new ecm.model.Message({
                        level: 1,
                        number: 614,
                        text:fieldErrors[0].symbolicName,
                        explanation:fieldErrors[0].errorMessage
                    });
                    ecm.model.desktop.onMessageAdded(message);
                    return;

                }else{
                    if (successCallBack) {
                        successCallBack(checkedInItem);
                    }
                }
            });



            this.logDebug("exit MILayer.checkInDocumentItem");
            return true;
        },
        addDocumentItem: function(p_parentFolderId, p_objectStore, p_templateName, p_criterias, p_contentSourceType, p_mimetype, p_filename, p_content_path, p_childComponentValues, p_permissions, p_securityPolicyId, p_addAsMinorVersion, p_autoClassify, p_allowDuplicateFileNames, p_setSecurityParent, p_workspaceId, successCallBack) {

            var oReq = new XMLHttpRequest();

            oReq.open("GET", p_content_path+"?rand="+(new Date().getTime()), true);
            oReq.responseType = "arraybuffer";

            oReq.onload = dojo.hitch(this,function (oEvent) {
                var arrayBuffer = oReq.response; // Note: not oReq.responseText

                if (arrayBuffer) {
                    var byteArray = new Uint8Array(arrayBuffer);

                    this.addDocumentItemComplete(p_parentFolderId, p_objectStore, p_templateName, p_criterias, p_contentSourceType, p_mimetype, p_filename, arrayBuffer, p_childComponentValues, p_permissions, p_securityPolicyId, p_addAsMinorVersion, p_autoClassify, p_allowDuplicateFileNames, p_setSecurityParent, p_workspaceId, successCallBack);
                }
            });
            oReq.onerror = function(e){
                var message = new ecm.model.Message({
                    level: 1,
                    number: 612,
                    text:e.toString()
                });
                ecm.model.desktop.onMessageAdded(message);
                return;

            }


            oReq.send(null);

        },

        addDocumentItemFromCordova: function(p_parentFolderId, p_objectStore, p_templateName, p_criterias, p_contentSourceType, p_mimetype, p_filename, p_content, p_childComponentValues, p_permissions, p_securityPolicyId, p_addAsMinorVersion, p_autoClassify, p_allowDuplicateFileNames, p_setSecurityParent, p_workspaceId, successCallBack) {

            this.logDebug("MILayer.addDocumentItem p_parentFolderId=" + p_parentFolderId);

            var repository = this.getCurrentRepository();

            if (repository == null) {
                return false;
            }

            //create parent ContentItem
            var parentFolder = new ecm.model.ContentItem({
                id: p_parentFolderId,
                name: p_parentFolderId,
                repository: repository
            });

            var objectStore = p_objectStore ? p_objectStore : "";
            var templateName = p_templateName;
            var criterias = lang.isString(p_criterias) ? eval("(" + p_criterias + ")") : p_criterias;
            var contentSourceType = p_contentSourceType;
            var filename = p_filename;
            var c_mimetype = p_mimetype;

            var content = lang.isString(p_content) ? eval("(" + p_content + ")") : p_content;

            var childComponentValues = lang.isString(p_childComponentValues) ? eval("(" + p_childComponentValues + ")") : p_childComponentValues;


            var securityPolicyId = p_securityPolicyId;
            var addAsMinorVersion = p_addAsMinorVersion;
            var autoClassify = p_autoClassify;
            var allowDuplicateFileNames = p_allowDuplicateFileNames;
            var setSecurityParent = p_setSecurityParent;
            var workspaceId = p_workspaceId;



            var contentBlob = null;
            try{
                if(content && content.content && content.type=="Base64"){
                    contentBlob = new Blob([Base64Binary.decodeArrayBuffer(content.content)], {"type": c_mimetype});
                }else{
                    contentBlob = content;
                }
            }catch(e){
                var message = new ecm.model.Message({
                    level: 1,
                    number: 612,
                    text:messages.add_new_document_fail,
                    explanation:messages.add_change_document_not_supported
                });
                ecm.model.desktop.onMessageAdded(message);
                return;
            }


            //add new document
            repository.addDocumentItem(parentFolder, objectStore, templateName, criterias, contentSourceType, c_mimetype, filename, contentBlob, childComponentValues, null, securityPolicyId, addAsMinorVersion, autoClassify, allowDuplicateFileNames, setSecurityParent, workspaceId,

                function(newItem, fieldErrors) {
                    if (fieldErrors) {
                        for ( var i = 0; i < fieldErrors.length; i++) {
                            ecm.model.desktop.onMessageAdded(fieldErrors[i].errorMessage);
                        }
                    } else {
                        if (successCallBack) {
                            successCallBack(newItem);
                        }
                    }
                });


            this.logDebug("exit MILayer.addDocumentItem");
            return true;
        },

        addDocumentItemComplete: function(p_parentFolderId, p_objectStore, p_templateName, p_criterias, p_contentSourceType, p_mimetype, p_filename, p_content, p_childComponentValues, p_permissions, p_securityPolicyId, p_addAsMinorVersion, p_autoClassify, p_allowDuplicateFileNames, p_setSecurityParent, p_workspaceId, successCallBack) {

            this.logDebug("MILayer.addDocumentItem p_parentFolderId=" + p_parentFolderId);

            var repository = this.getCurrentRepository();

            if (repository == null) {
                return false;
            }

            //create parent ContentItem
            var parentFolder = new ecm.model.ContentItem({
                id: p_parentFolderId,
                name: p_parentFolderId,
                repository: repository
            });

            var objectStore = p_objectStore ? p_objectStore : "";
            var templateName = p_templateName;
            var criterias = lang.isString(p_criterias) ? eval("(" + p_criterias + ")") : p_criterias;
            var contentSourceType = p_contentSourceType;
            var filename = p_filename;
            var c_mimetype = p_mimetype;

            var content = lang.isString(p_content) ? eval("(" + p_content + ")") : p_content;

            var childComponentValues = lang.isString(p_childComponentValues) ? eval("(" + p_childComponentValues + ")") : p_childComponentValues;


            var securityPolicyId = p_securityPolicyId;
            var addAsMinorVersion = p_addAsMinorVersion;
            var autoClassify = p_autoClassify;
            var allowDuplicateFileNames = p_allowDuplicateFileNames;
            var setSecurityParent = p_setSecurityParent;
            var workspaceId = p_workspaceId;


            var contentBlob = null;
            try{
                contentBlob = new Blob([content], {"type": c_mimetype});
            }catch(e){

                var message = new ecm.model.Message({
                    level: 1,
                    number: 612,
                    text:messages.add_new_document_fail,
                    explanation:messages.add_change_document_not_supported
                });
                ecm.model.desktop.onMessageAdded(message);
                return;
            }


            //add new document
            repository.addDocumentItem(parentFolder, objectStore, templateName, criterias, contentSourceType, c_mimetype, filename, contentBlob, childComponentValues, null, securityPolicyId, addAsMinorVersion, autoClassify, allowDuplicateFileNames, setSecurityParent, workspaceId,
                function(newItem, fieldErrors) {

                    if (fieldErrors && fieldErrors.length>0) {

                        var message = new ecm.model.Message({
                            level: 1,
                            number: 614,
                            text:fieldErrors[0].symbolicName,
                            explanation:fieldErrors[0].errorMessage
                        });
                        ecm.model.desktop.onMessageAdded(message);
                        return;

                    } else {
                        if (successCallBack) {
                            successCallBack(newItem);
                        }
                    }
                });


            this.logDebug("exit MILayer.addDocumentItem");
            return true;
        },

        _getItemAttributeValue: function(attributeDefinition, item) {
            var attributeId = attributeDefinition.id;
            // Note: We're not using getDisplayValue as this will give the value formatted for display
            // in the content list or other table.  Instead, we'll format the value according to the attribute
            // definition, similar to properties editor
            unformattedValue = item.getValue(attributeId);

            if(attributeDefinition.dataType=="xs:double"){
                if(unformattedValue!=null && unformattedValue>=MAX_POSITIVE_INT){
                    unformattedValue  = MAX_POSITIVE_INT;
                }

                if(unformattedValue!=null && unformattedValue<MAX_NEGATIVE_INT){
                    unformattedValue  = MAX_NEGATIVE_INT;
                }
            }

            // if there is a choice list need to look up the display name value
            var choiceList = attributeDefinition.getChoiceList();
            if (choiceList && unformattedValue) {
                formattedValue = unformattedValue;
                var newValue = [];
                this._lookupChoiceList(unformattedValue, choiceList, newValue);
                if (newValue && newValue.length >= 1) {
                    if (dojo.isArray(formattedValue))
                        formattedValue = newValue;
                    else
                        formattedValue = newValue[0];
                }
            } else {
                formattedValue = ecm.model.desktop.valueFormatter.formatValue(unformattedValue, attributeDefinition.dataType, attributeDefinition.format);
            }

            return formattedValue;
        },

        _lookupChoiceList: function(val, choiceList, choiceListDispVal) {
            var choices = choiceList.choices;
            if (choices) {
                for ( var i in choices) {
                    if (choices[i].choices && choices[i].choices.length > 0) {
                        // has a sub list
                        this._lookupChoiceList(val, choices[i], choiceListDispVal);
                        //if (choiceListDispVal != null) {
                        //break;
                        //}
                    } else {
                        //for multi-value choice lists
                        if (dojo.isArray(val)) {
                            for ( var j in val) {
                                if (choices[i].value == val[j]) {
                                    choiceListDispVal[j] = choices[i].displayName;
                                }
                            }

                        } else {
                            if (choices[i].value == val) {
                                choiceListDispVal[0] = choices[i].displayName;
                                break;
                            }
                        }
                    }
                }
            }
        },
        getContentItemForCheckin:function(itemId,itemName,successCallBack){
            this.logDebug("MILayer.getContentItemForCheckin itemId="+itemId);

            var repository = this.getCurrentRepository();

            if (repository == null) {
                return false;
            }

            //create parent ContentItem
            var contentItem = new ecm.model.ContentItem({
                id: itemId,
                name: itemName,
                repository: repository
            });

            var requiredVersion = "reservation";
            if(repository.type!="p8"){
                requiredVersion="current";
            }
            repository.retrieveVersions(contentItem,requiredVersion,function(retrievedItems){
                if(successCallBack){
                    if(retrievedItems.items!=null && retrievedItems.items.length>0)
                        successCallBack(retrievedItems.items[0]);
                    else
                        successCallBack([]);
                }
            });

            this.logDebug("exit MILayer.getContentItemForCheckin");
            return true;
        },

        getRepositories: function(successCallBack) {
            if (successCallBack) {
                successCallBack(ecm.model.desktop.repositories)
            }
        },

        setInitialRepository: function(repositoryId) {
            ecm.model.desktop.setInitialRepository(ecm.model.desktop.getRepository(repositoryId));
        },

        retrieveFavorites: function(successCallBack) {

            this.logDebug("MILayer.retrieveFavorites");

            var rootItem = new ecm.model.Favorite({
                id: "_ecmFavoritesRootNode",
                name: "Favorites",
                type: "folder"
            });

            //clear favotrites list from cach.
            ecm.model.desktop.clearFavorites();

            ecm.model.desktop.loadFavorites(lang.hitch(this, function(favorites, structure, magazineStructure) {

                if (favorites) {
                    if (!this.favoritesResultSet) {
                        this.favoritesResultSet = new ecm.model.FavoritesResultSet({
                            id: "__favorites",
                            name: "__favorites",
                            items: favorites,
                            structure: lang.clone(structure),
                            magazineStructure: lang.clone(magazineStructure),
                            parentFolder: rootItem
                        });
                    } else {
                        this.favoritesResultSet.items = favorites;
                    }
                    // Update the parent so the breadcrumb can show this parent
                    for ( var i in favorites) {
                        favorites[i].parentFolder = this._rootItem;
                    }
                    if (successCallBack)
                        successCallBack(this.favoritesResultSet);
                }
            }));

            this.logDebug("exit MILayer.retrieveFavorites");
            return true;
        },

        addToFavorites: function(itemId, favoriteName, repositoryId,templateName, successCallBack, failCallBack) {

            this.logDebug("MILayer.addToFavorites");

            //retieve desktop favorites to eliminate already defined items
            //as favorite.

            this.retrieveFavorites(function(favorites) {
                var itemAlreadyFavorite = false;
                for ( var i = 0; i < favorites.getItems().length; i++) {
                    if (favorites.getItems()[i].objectId == itemId) {
                        itemAlreadyFavorite = true;
                        break;
                    }
                }
                if (itemAlreadyFavorite) {
                    var message = new ecm.model.Message({
                        level: 1,
                        number: 600,
                        text: messages.item_already_set_as_favorite
                    });
                    if (failCallBack) {
                        failCallBack(message);
                    } else {
                        ecm.model.desktop.onMessageAdded(message);
                    }
                    return;
                } else {

                    var repository = ecm.model.desktop.getRepository(repositoryId);

                    if (repository == null) {
                        var message = new ecm.model.Message({
                            level: 1,
                            number: 607,
                            text: "Repository with id " + repository + "is not found",
                        });
                        ecm.model.desktop.onMessageAdded(message);
                        return false;
                    }

                    //retrieve item based on it's id.
                    if (templateName == 'search'){
                        repository.retrieveSearchTemplate(itemId, null, null, function(template) {
                            var newFavorite = ecm.model.Favorite.createFromItem(template, favoriteName);

                            ecm.model.desktop.addFavorite(newFavorite, function(favorite) {
                                if (successCallBack) {
                                    successCallBack(favorite);
                                }

                            });
                        });
                    }else{
                        repository.retrieveItem(itemId, dojo.hitch(this, function(retrievedFavoriteItem) {
                            var newFavorite = ecm.model.Favorite.createFromItem(retrievedFavoriteItem, favoriteName);

                            ecm.model.desktop.addFavorite(newFavorite, function(favorite) {
                                if (successCallBack) {
                                    successCallBack(favorite);
                                }
                            });
                        }),templateName);
                    }
                }

            });

            this.logDebug("exit MILayer.addToFavorites");
            return true;
        },
        updateFavorite: function(itemId, favoriteName,successCallBack, failCallBack) {

            this.logDebug("MILayer.updateFavorites");

            //retrieve desktop favorites to eliminate already defined items
            //as favorite.
            var updatedFavoriteIndex  = -1;
            this.retrieveFavorites(function(favorites) {
                var itemAlreadyFavorite = false;
                for ( var i = 0; i < favorites.getItems().length; i++) {
                    if (favorites.getItems()[i].id == itemId) {
                        itemAlreadyFavorite = true;
                        favorites.getItems()[i].name = favoriteName;
                        updatedFavoriteIndex = i;
                        break;
                    }
                }
                if (updatedFavoriteIndex > 0){
                    ecm.model.desktop.updateFavorite(favorites.getItems()[updatedFavoriteIndex], function(favorite) {
                        if (successCallBack) {
                            successCallBack(favorite);
                        }
                    });
                }else{
                    var message = new ecm.model.Message({
                        level: 1,
                        number: 600,
                        text: "Favorite item cannot be found"
                    });
                    if (failCallBack) {
                        failCallBack(message);
                    } else {
                        ecm.model.desktop.onMessageAdded(message);
                    }
                    return;
                }
            });

            this.logDebug("exit MILayer.addToFavorites");
            return true;
        },

        removeFromFavorites: function(favoritesIDs, successCallBack) {

            this.logDebug("MILayer.removeFromFavorites");

            var favoriteObjects = [];

            if (!lang.isArray(favoritesIDs)) {
                favoriteObjects.push(new ecm.model.Favorite({
                    id: favoritesIDs
                }));
            } else {
                for ( var i in favoritesIDs) {
                    favoriteObjects.push(new ecm.model.Favorite({
                        id: favoritesIDs[i]
                    }));
                }
            }

            /*
             * If current desktop favorites list is not set
             * we need retrieve favorites list before delete any element.
             * otherwise callback method is not called.
             */

            if (ecm.model.desktop.favorites == null) {

                this.retrieveFavorites(function(favorites) {

                    for ( var j in favoriteObjects) {
                        var favoriteFound = false;
                        for ( var i = 0; i < favorites.getItems().length; i++) {
                            if (favorites.getItems()[i].id == favoriteObjects[j].id) {
                                favoriteFound = true;
                                break;
                            }
                        }
                        if (!favoriteFound) {
                            var message = new ecm.model.Message({
                                level: 1,
                                number: 608,
                                text: "Favorite with id " + favoriteObjects[j] + "is not found",
                            });
                            ecm.model.desktop.onMessageAdded(message);
                            return false;
                        }
                    }

                    ecm.model.desktop.removeFavorites(favoriteObjects, function(favoriteIds) {
                        if (successCallBack) {
                            successCallBack(favoriteIds);
                        }
                    });
                });
            } else {

                for ( var j in favoriteObjects) {
                    var favoriteFound = false;
                    for ( var i = 0; i < ecm.model.desktop.favorites.length; i++) {
                        if (ecm.model.desktop.favorites[i].id == favoriteObjects[j].id) {
                            favoriteFound = true;
                            break;
                        }
                    }
                    if (!favoriteFound) {
                        var message = new ecm.model.Message({
                            level: 1,
                            number: 608,
                            explanation: "Favorite with id " + favoriteObjects[j] + " does not exist.",
                            text: "Favorite not found."
                        });
                        ecm.model.desktop.onMessageAdded(message);
                        return false;
                    }
                }

                ecm.model.desktop.removeFavorites(favoriteObjects, function(favoriteIds) {
                    if (successCallBack) {
                        successCallBack(favoriteIds);
                    }
                });
            }

            this.logDebug("exit MILayer.removeFromFavorites");
            return true;
        },

        retrieveSearchTemplateFolders: function(successCallBack) {

            this.logDebug("MILayer.retrieveSearchTemplateFolders");

            var repository = this.getCurrentRepository();

            if (repository == null) {
                return false;
            }

            repository.retrieveSearchTemplateFolders(function(searchTemplateFolders) {
                successCallBack(searchTemplateFolders);
            });

            this.logDebug("exit MILayer.retrieveSearchTemplateFolders");
            return true;
        },

        retrieveSearchTemplates: function(folderId, successCallBack) {

            this.logDebug("MILayer.retrieveSearchTemplates");

            var repository = this.getCurrentRepository();

            if (repository == null) {
                return false;
            }

            //create parent ContentItem
            var searchFolder = new ecm.model.SearchTemplateFolder({
                id: folderId,
                name: folderId,
                repository: repository
            });
            //clear templates cache
            searchFolder.clearSearchTemplates();

            searchFolder.retrieveSearchTemplates(function(searchTemplates) {
                //remove cross repository searches



                var filteredSearchTemplates = [];
                var suffix = "unifiedsearchtemplate";
                if(searchTemplates) {
                    for (var i=0;i<searchTemplates.length;++i) {
                        var template = searchTemplates[i];

                        if(template.mimetype==null || template.mimetype && template.mimetype.indexOf(suffix, this.length - suffix.length) == -1)
                            filteredSearchTemplates.push(template);
                    }
                    searchTemplates=filteredSearchTemplates;
                }

                successCallBack(searchTemplates);
            });

            this.logDebug("exit MILayer.retrieveSearchTemplates");
            return true;
        },
        retrieveSearchTemplatesAndRefresh: function(folderId, successCallBack) {

            this.logDebug("MILayer.retrieveSearchTemplatesAndRefresh");

            var repository = this.getCurrentRepository();

            if (repository == null) {
                return false;
            }

            //create parent ContentItem
            var searchFolder = new ecm.model.SearchTemplateFolder({
                id: folderId,
                name: folderId,
                repository: repository
            });

            searchFolder.clearSearchTemplates();
            searchFolder.retrieveSearchTemplates(function(searchTemplates) {
                successCallBack(searchTemplates);
            });

            this.logDebug("exit MILayer.retrieveSearchTemplates");
            return true;
        },

        retrieveSearchCriteria: function(templateID, templateName, successCallBack) {

            this.logDebug("MILayer.retrieveSearchCriteria");

            var repository = this.getCurrentRepository();

            if (repository == null) {
                return false;
            }

            //searchTemplate
            var searchTemplate = new ecm.model.SearchTemplate({
                id: templateID,
                name: templateName,
                repository: repository
            });

            searchTemplate.retrieveSearchCriteria(dojo.hitch(this, function() {
                var maxi = Number.MAX_VALUE;
                var mini = MAX_NEGATIVE_INT;
                //fixx search criteria values
                if(searchTemplate.searchCriteria) {
                    for(var i=0; i<searchTemplate.searchCriteria.length; i++) {
                        var criterion = searchTemplate.searchCriteria[i];
                        if(criterion.maxValue!=null && criterion.maxValue>=Number.MAX_VALUE){
                            criterion.maxValue = MAX_POSITIVE_INT;
                        }
                        if(criterion.minValue!=null && criterion.minValue<MAX_NEGATIVE_INT){
                            criterion.minValue = MAX_NEGATIVE_INT;
                        }
                    }
                }
                this.currentSearchTemplate = searchTemplate;
                successCallBack(this.currentSearchTemplate);
            }), null, null, true, true);

            return true;
        },
        checkForNestedSearchCriteria: function(templateID, templateName, successCallBack) {

            this.logDebug("MILayer.checkForNestedSearchCriteria");

            var repository = this.getCurrentRepository();

            if (repository == null) {
                return false;
            }

            //searchTemplate
            var searchTemplate = new ecm.model.SearchTemplate({
                id: templateID,
                name: templateName,
                repository: repository
            });
            var foundNest = false;
            searchTemplate.retrieveSearchCriteria(dojo.hitch(this, function() {
                if(searchTemplate.searchCriteria) {
                    for(var i=0; i<searchTemplate.searchCriteria.length; i++) {
                        var criterion = searchTemplate.searchCriteria[i];
                        if (criterion.searchCriteria && criterion.searchCriteria.length > 0) {
                            foundNest=true;
                            break;
                        }
                    }
                }


                successCallBack({nested:foundNest});
            }), null, null, true, true);

            return true;
        },

        searchByNotExistingSearchTemplate: function(searchTemplateJson, sortProperty, descending, andSearch, successCallBack) {
            this.logDebug("MILayer.searchByNotExistingSearchTemplate");

            // evalute json
            var searchTemplateJsonObj = lang.isString(searchTemplateJson) ? eval("(" + searchTemplateJson + ")") : searchTemplateJson;
            var repository = this.getCurrentRepository();

            //searchTemplate
            var searchTemplate = ecm.model.SearchTemplate.createFromJSON(
                searchTemplateJsonObj,
                repository,
                null,
                null
            );

            if(searchTemplate.id==null){
            }



            searchTemplate.search(dojo.hitch(this, function(resultSet) {
                if(successCallBack)
                    successCallBack(resultSet);
            }), sortProperty, descending, null, function(message) {
                ecm.model.desktop.onMessageAdded(message);
            });


            this.logDebug("exit MILayer.searchByNotExistingSearchTemplate");
            return true;
        },

        search: function(templateId, searchCriteriaJson,textSearchCriteriaJson , sortProperty, descending, andSearch, moreOptions, successCallBack, errorCallBack) {

            this.logDebug("MILayer.search");

            var repository = this.getCurrentRepository();

            if (repository == null) {
                return false;
            }

            var params = lang.isString(searchCriteriaJson) ? eval("(" + searchCriteriaJson + ")") : searchCriteriaJson;
            var paramsMore = lang.isString(moreOptions) ? eval("(" + moreOptions + ")") : moreOptions;
            var paramsTextCriteria = lang.isString(textSearchCriteriaJson) ? eval("(" + textSearchCriteriaJson + ")") : textSearchCriteriaJson;
            var userSearchCriteriaArray = [];

            dojo.forEach(params, function(param_sc, index) {

                var userSearchCriteria = {
                    values:param_sc.values,
                    selectedOperator:param_sc.selectedOperator,
                }
                userSearchCriteriaArray.push(userSearchCriteria);

            });

            if (templateId == null && this.currentSearchTemplate != null) {
                this.currentSearchTemplate.textSearchCriteria=paramsTextCriteria;
                this.currentSearchTemplate.andSearch = andSearch;
                if (paramsMore)
                    this.currentSearchTemplate.moreOptions = paramsMore;

                //set user search criteria
                dojo.forEach(this.currentSearchTemplate.searchCriteria, function(critrion, index) {
                    critrion.setValues(userSearchCriteriaArray[index].values);
                    critrion.selectedOperator = userSearchCriteriaArray[index].selectedOperator;
                });
            } else if (templateId != null) {

                var searchTemplate = new ecm.model.SearchTemplate({
                    id: templateId,
                    name: templateId,
                    repository: repository
                });

                searchTemplate.retrieveSearchCriteria(dojo.hitch(this, function() {
                    this.currentSearchTemplate = searchTemplate;
                    this.currentSearchTemplate.andSearch = andSearch;
                    if (paramsMore)
                        this.currentSearchTemplate.moreOptions = paramsMore
                    this.currentSearchTemplate.textSearchCriteria=paramsTextCriteria;

                    //set user search criteria
                    dojo.forEach(this.currentSearchTemplate.searchCriteria, function(critrion, index) {
                        critrion.setValues(userSearchCriteriaArray[index].values);
                        critrion.selectedOperator = userSearchCriteriaArray[index].selectedOperator;

                    });

                    this.currentSearchTemplate.search(dojo.hitch(this, function(resultSet) {
                        resultSet.searchTemplate=null;
                        this.lastResultSet = resultSet;
                        successCallBack(resultSet);
                    }), sortProperty, descending, null, function(message) {
                        ecm.model.desktop.onMessageAdded(message);
                        if(errorCallBack)
                            errorCallBack(message);
                    });

                }), null, null, true, true);
                return true;
            }


            this.currentSearchTemplate.search(dojo.hitch(this, function(resultSet) {
                this.lastResultSet = resultSet;
                successCallBack(resultSet);
            }), sortProperty, descending, null, function(message) {
                ecm.model.desktop.onMessageAdded(message);
                if(errorCallBack)
                    errorCallBack(message);
            });

            this.logDebug("exit MILayer.search");
            return true;
        },
        getEmptyTemplate: function(name,className, successCallBack) {
            /**
             * creates empty template and saves it to the repository
             */
            this.logDebug("MILayer.getEmptyTemplate");
            var tName = "";
            if (name) {
                tName = name;
            }
            var repository = this.getCurrentRepository();
            var template = new ecm.model.SearchTemplate({
                UUID: "",
                id: "",
                name: tName,
                repository: repository
            });
            template.className = className;
            template.objectType = "document";
            if (repository.type == "cm") {
                var permission = new ecm.model.Permission({
                    granteeName:"#CREATOR-OWNER",
                    accessType:1,
                    accessMask:984531,
                    granteeType:2000,
                    inheritableDepth:0
                });
                template.permissions = [permission];

            }
            repository.addSearchTemplate(template, function(savedTemplate) {
                successCallBack(savedTemplate);
            }, null);
            return;
        },
        
        
        searchOnTheFly: function(templateJSON,sortProperty, descending, successCallBack, errorCallBack) {
            /**
             * performs search with given template which is not (necessarily) saved in the repository
             */
            this.logDebug("MILayer.searchOnTheFly");
            var paramsTemplate = lang.isString(templateJSON) ? eval("(" + templateJSON + ")") : templateJSON;
            var templateId = paramsTemplate.id;
            var tName = "";
            var repository = this.getCurrentRepository();
            var template = new ecm.model.SearchTemplate({
                UUID: "",
                id: "",
                name: tName,
                repository: repository
            });
            /////// create the template according to the given parameters
            template.className = paramsTemplate.searchContentClass;
            template.objectType = "document";
            template.name = paramsTemplate.name;
            template.textSearchCriteria = paramsTemplate.textSearchCriteria;
            template.searchCriteria = paramsTemplate.searchCriteria;
            template.andSearch = paramsTemplate.andSearch;
            template.objectType = paramsTemplate.objectType;
            template.moreOptions = paramsTemplate.moreOptions;
            if(paramsTemplate.folders && paramsTemplate.folders.length > 0) {
                template.folders = paramsTemplate.folders;
            }
            else {
                template.folders=null;
            }
            if (paramsTemplate.resultsDisplay && repository.type != "cm") {
                var searchConfig = ecm.model.SearchConfiguration.getSearchConfiguration({repository: repository});
                template.resultsDisplay = paramsTemplate.resultsDisplay;
                template.resultsDisplay.sortBy = searchConfig.getNameProperty(template.objectType);
                template.resultsDisplay.sortAsc = true;
                template.resultsDisplay.columns = lang.clone(searchConfig.getSearchDefaultColumns(template.objectType));
                template.resultsDisplay.columns[0] = searchConfig.getNameProperty(template.objectType);
                template.resultsDisplay.magazineColumns = lang.clone(searchConfig.getSearchMagazineDefaultColumns(template.objectType));
            }
            if (paramsTemplate.searchSubclasses == true) {
                template.includeSubclasses = true;
                if (template.classes) {
                    for(var i=0;i<template.classes.length;i++) {
                        var dic = template.classes[i];
                        dic.searchSubclasses = true;
                    }
                }
            }
            else {
                template.includeSubclasses = false;
                if (template.classes) {
                    for(var i=0;i<template.classes.length;i++) {
                        var dic = template.classes[i];
                        dic.searchSubclasses = false;
                    }
                }
            }
            repository.retrieveContentClasses(function(contentClasses) {
                for ( var i = 0; i < contentClasses.length; ++i) {
                    var cc = contentClasses[i];
                    var ccId = cc.id;
                    if(paramsTemplate.searchContentClass == "$common") {
                        var allClass = new ecm.model.ContentClass({
                            id:"$common",
                            name: ecm.messages.search_class_all_pseudo,
                            repository:repository,
                            pseudoClass:true
                        });
                        cc = allClass;
                        ccId = allClass.id;
                    }
                    if (paramsTemplate.searchContentClass && cc.id == paramsTemplate.searchContentClass) {
                        template.setSearchContentClass(cc);
                        cc.retrieveAttributeDefinitions(function(attributeDefinitions) {
                            var nameAtt = null;
                            if (attributeDefinitions) {
                                nameAtt = attributeDefinitions[0].contentClass.nameAttribute;
                                if(ccId=="$common") {
                                    nameAtt = attributeDefinitions[0].id;
                                }
                                if(nameAtt && nameAtt.indexOf("$")!==-1 &&cc.id=="ICMsearch") {
                                    //                                  nameAtt=null;
                                }
                            }
                            if(nameAtt && repository.type == "cm") {
                                var searchConfig = ecm.model.SearchConfiguration.getSearchConfiguration({repository: repository});
                                template.resultsDisplay = paramsTemplate.resultsDisplay;
                                //                              template.resultsDisplay.sortBy = nameAtt;
                                template.resultsDisplay.sortAsc = true;
                                template.resultsDisplay.columns = lang.clone(searchConfig.getSearchDefaultColumns(template.objectType));
                                template.resultsDisplay.columns[0] = nameAtt;
                                //                              template.resultsDisplay.magazineColumns = lang.clone(searchConfig.getSearchMagazineDefaultColumns(template.objectType));
                            }
                            template.search(dojo.hitch(this, function(resultSet) {
                                resultSet.searchTemplate=null;
                                this.lastResultSet = resultSet;
                                successCallBack(resultSet);
                            }), sortProperty, descending, null, function(message) {
                                ecm.model.desktop.onMessageAdded(message);
                                if(errorCallBack)
                                    errorCallBack(message);
                            });
                            //                          return true;
                        });
                        return true;
                    }
                }
                template.search(dojo.hitch(this, function(resultSet) {
                    resultSet.searchTemplate=null;
                    this.lastResultSet = resultSet;
                    successCallBack(resultSet);
                }), sortProperty, descending, null, function(message) {
                    ecm.model.desktop.onMessageAdded(message);
                    if(errorCallBack)
                        errorCallBack(message);
                });

            });
        },

        saveSearchTemplate: function(templateJSON, successCallBack) {

            this.logDebug("MILayer.saveSearchTemplate");

            var repository = this.getCurrentRepository();
            var paramsTemplate = lang.isString(templateJSON) ? eval("(" + templateJSON + ")") : templateJSON;
            var templateId = paramsTemplate.id;
            repository.retrieveSearchTemplate(templateId, null, null, function(template) {
                template.retrieveSearchCriteria(function(critrion) {
                    template.name = paramsTemplate.name;
                    template.textSearchCriteria = paramsTemplate.textSearchCriteria;
                    template.searchCriteria = paramsTemplate.searchCriteria;
                    template.andSearch = paramsTemplate.andSearch;
                    template.objectType = paramsTemplate.objectType;
                    template.moreOptions = paramsTemplate.moreOptions;
                    if(paramsTemplate.folders && paramsTemplate.folders.length > 0) {
                        template.folders = paramsTemplate.folders;
                    }
                    else {
                        template.folders=null;
                    }
                    if (paramsTemplate.resultsDisplay && repository.type != "cm") {
                        var searchConfig = ecm.model.SearchConfiguration.getSearchConfiguration({repository: repository});
                        template.resultsDisplay = paramsTemplate.resultsDisplay;
                        template.resultsDisplay.sortBy = searchConfig.getNameProperty(template.objectType);
                        template.resultsDisplay.columns = lang.clone(searchConfig.getSearchDefaultColumns(template.objectType));
                        template.resultsDisplay.magazineColumns = lang.clone(searchConfig.getSearchMagazineDefaultColumns(template.objectType));
                    }
                    if (paramsTemplate.searchSubclasses == true) {
                        template.includeSubclasses = true;
                        for(var i=0;i<template.classes.length;i++) {
                            var dic = template.classes[i];
                            dic.searchSubclasses = true;
                        }
                    }
                    else {
                        template.includeSubclasses = false;
                        for(var i=0;i<template.classes.length;i++) {
                            var dic = template.classes[i];
                            dic.searchSubclasses = false;
                        }
                    }

                    repository.retrieveContentClasses(function(contentClasses) {
                        for ( var i = 0; i < contentClasses.length; ++i) {
                            var cc = contentClasses[i];
                            var ccId = cc.id;
                            if(paramsTemplate.searchContentClass == "$common") {
                                var allClass = new ecm.model.ContentClass({
                                    id:"$common",
                                    name: ecm.messages.search_class_all_pseudo,
                                    repository:repository,
                                    pseudoClass:true
                                });
                                cc = allClass;
                                ccId = allClass.id;
                            }
                            if (paramsTemplate.searchContentClass && cc.id == paramsTemplate.searchContentClass) {
                                template.setSearchContentClass(cc);
                                /////
                                cc.retrieveAttributeDefinitions(function(attributeDefinitions) {
                                    var nameAtt = null;
                                    if (attributeDefinitions) {
                                        nameAtt = attributeDefinitions[0].contentClass.nameAttribute;
                                        if(ccId=="$common") {
                                            nameAtt = attributeDefinitions[0].id;
                                        }
                                        if(nameAtt && nameAtt.indexOf("$")!==-1 && cc.id=="ICMsearch") {
                                            //                                       nameAtt=null;
                                        }
                                    }
                                    if(nameAtt && repository.type == "cm") {
                                        var searchConfig = ecm.model.SearchConfiguration.getSearchConfiguration({repository: repository});
                                        template.resultsDisplay = paramsTemplate.resultsDisplay;
                                        template.resultsDisplay.sortBy = nameAtt;
                                        template.resultsDisplay.sortAsc = true;
                                        template.resultsDisplay.columns = lang.clone(searchConfig.getSearchDefaultColumns(template.objectType));
                                        template.resultsDisplay.columns[0] = nameAtt;
                                        template.resultsDisplay.magazineColumns = lang.clone(searchConfig.getSearchMagazineDefaultColumns(template.objectType));
                                    }
                                    template.save(function(saved) {
                                        successCallBack(saved);
                                    });
                                    return true;
                                });
                                return true;
                                /////
                            }
                        }
                        template.save(function(saved){
                            successCallBack(saved);
                        });
                    });
                });

            });
            return true;
        },


        getServerVersion: function() {
            return ecm.model.desktop.navigatorRelease;
        },

        getClientVersion: function() {
            return ecm.version.getVersion(false);
        },

        getDesktopJSON:function() {
            return dojo.toJson(ecm.model.desktop);
        },

        getStateToCssClassJSON:function() {
            return dojo.toJson(ecm.model.Item.StateToCssClass);
        },

        getMimeTypeToFileTypeJSON:function() {
            return dojo.toJson(ecm.model.Item.MimeTypeToFileType);
        }

    });

});





var Base64Binary = {
    _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    /* will return a  Uint8Array type */
    decodeArrayBuffer: function(input) {
        var bytes = (input.length/4) * 3;

        var lkey1 = this._keyStr.indexOf(input.charAt(input.length-1));
        var lkey2 = this._keyStr.indexOf(input.charAt(input.length-2));

        if (lkey1 == 64) bytes--; //padding chars, so skip
        if (lkey2 == 64) bytes--; //padding chars, so skip


        var ab = new ArrayBuffer(bytes);
        this.decode(input, ab);

        return ab;
    },

    decode: function(input, arrayBuffer) {
        //get last chars to see if are valid
        var lkey1 = this._keyStr.indexOf(input.charAt(input.length-1));
        var lkey2 = this._keyStr.indexOf(input.charAt(input.length-2));

        var bytes = (input.length/4) * 3;
        if (lkey1 == 64) bytes--; //padding chars, so skip
        if (lkey2 == 64) bytes--; //padding chars, so skip

        var uarray;
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        var j = 0;

        if (arrayBuffer)
            uarray = new Uint8Array(arrayBuffer);
        else
            uarray = new Uint8Array(bytes);

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        for (i=0; i<bytes; i+=3) {
            //get the 3 octects in 4 ascii chars
            enc1 = this._keyStr.indexOf(input.charAt(j++));
            enc2 = this._keyStr.indexOf(input.charAt(j++));
            enc3 = this._keyStr.indexOf(input.charAt(j++));
            enc4 = this._keyStr.indexOf(input.charAt(j++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            uarray[i] = chr1;
            if (enc3 != 64) uarray[i+1] = chr2;
            if (enc4 != 64) uarray[i+2] = chr3;
        }

        return uarray;
    }
}
