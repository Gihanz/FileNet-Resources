-- ***************************************************************** 
--                                                                   
-- Licensed Materials - Property of IBM                              
--                                                                   
-- 5724-U69                                                          
--                                                                   
-- Copyright IBM Corp. 2012  All Rights Reserved.                    
--                                                                   
-- US Government Users Restricted Rights - Use, duplication or       
-- disclosure restricted by GSA ADP Schedule Contract with           
-- IBM Corp.                                                         
--                                                                   
-- ***************************************************************** 
--
-- IBM Content Navigator configuration table creation script
-- for DB2 LUW

-- *****************************************************************
--  Create a schema for the application to use

CREATE SCHEMA NEXUS;
COMMIT;

-- *****************************************************************
--  Create buffer pools and tablespaces for the application to use

CREATE Bufferpool NEXUSTSBP IMMEDIATE SIZE 200 PAGESIZE 32K;
CREATE Bufferpool NEXUSTSTEMPBP IMMEDIATE SIZE 200 PAGESIZE 32K;
CREATE REGULAR TABLESPACE NEXUSTS PAGESIZE 32 K 
	MANAGED BY AUTOMATIC STORAGE AUTORESIZE YES INITIALSIZE 20 M 
	INCREASESIZE 20 M BUFFERPOOL NEXUSTSBP;
CREATE USER TEMPORARY TABLESPACE NEXUSTSTEMP PAGESIZE 32K 
	MANAGED BY AUTOMATIC STORAGE BUFFERPOOL NEXUSTSTEMPBP;
COMMIT;

-- *****************************************************************
--  Create the configuration table for the application to use

SET CURRENT SQLID = NEXUS;

CREATE TABLE CONFIGURATION (
        ID VARCHAR(256) NOT NULL,
        ATTRIBUTES DBCLOB(32k),
	  PRIMARY KEY(ID)
    )
    DATA CAPTURE NONE IN NEXUSTS;

ALTER TABLE CONFIGURATION VOLATILE;
COMMIT;

-- *****************************************************************
--  Grant privileges on the table to the JDBC connection user

GRANT INSERT, DELETE, UPDATE, SELECT, INDEX ON TABLE CONFIGURATION TO USER nexusdbuser WITH GRANT OPTION;
GRANT CONTROL ON TABLE CONFIGURATION TO USER nexusdbuser;
COMMIT;


-- *****************************************************************
--  Load the initial application configuration into the table

INSERT INTO NEXUS.CONFIGURATION VALUES ('application.navigator', 'locales=ar,he,en,zh_CN,zh_TW,cs,hr,da,nl,fi,fr,de,el,hu,it,ja,ko,nb,pl,pt,pt_BR,ru,sk,sl,es,sv,th,tr;threadSleepTime=5;plugins=;menus=DefaultContentListToolbar,DefaultFavoritesToolbar,DefaultFavoriteFolderContextMenu,DefaultFavoriteTeamspaceContextMenu,DefaultFavoriteSearchTemplateContextMenu,DefaultFavoriteItemContextMenu,DefaultBannerUserSessionContextMenu,DefaultGlobalToolbar,DefaultBannerToolsContextMenu,DefaultItemContextMenu,DefaultSystemItemContextMenu,DefaultMixItemsContextMenu,DefaultVersionsContextMenu,DefaultFolderContextMenu,DefaultInbasketToolbar,DefaultInbasketToolbarP8,DefaultAttachmentToolbar,DefaultAttachmentItemContextMenu,DefaultAttachmentFolderContextMenu,DefaultAddDocumentAttachmentContextMenu,DefaultAddFolderAttachmentContextMenu,DefaultWorkItemDocumentContextMenu,DefaultWorkItemFolderContextMenu,DefaultObjectStoreFolderContextMenu,DefaultTeamspacesListToolbar,DefaultTemplatesListToolbar,DefaultTeamspaceContextMenu,DefaultTeamspaceTemplateContextMenu,DefaultFavoritesContextMenu,DefaultSearchContextMenu,DefaultBrowseToolbar,DefaultTeamspaceToolbar,DefaultSelectObjectItemContextMenu,DefaultSelectObjectFolderContextMenu,DefaultSelectObjectToolbar,DefaultSearchTemplateContextMenu,DefaultTeamspaceFolderContextMenu,DefaultTrackerQueueContextMenu,DefaultUserQueueContextMenu,DefaultProcessQueueContextMenu;repositories=;desktops=admin;viewers=default;servers=cm,od,p8,cmis;key=871bf66c911f811fd48a6cc97aea40a4;objectExpiration=10;desktop=default');

INSERT INTO NEXUS.CONFIGURATION VALUES ('settings.navigator.default', 'mobileAccess=true;logging.level=3;logging.excludes=com.ibm.ecm.configuration;iconStatus=docHold,docNotes,docMinorVersions,docDeclaredRecord,docBookmarks,docCheckedOut,workItemSuspended,workItemDeadlineImportance,workItemDeadlineReminderSent,workItemLocked,workItemCheckedOut;adminUsers=P8Admin');

INSERT INTO NEXUS.CONFIGURATION VALUES ('desktop.navigator.admin', 'workflowNotification=false;fileIntoFolder=false;showSecurity=false;viewer=default;theme=;name=Admin Desktop;isDefault=Yes;menuPrefix=Default;applicationName=IBM Content Navigator;configInfo=;layout=ecm.widget.layout.NavigatorMainLayout;defaultFeature=ecmClientAdmin;actionHandler=ecm.widget.layout.CommonActionsHandler;servers=cm,od,ci,p8,cmis;repositories=');

INSERT INTO NEXUS.CONFIGURATION VALUES ('server.navigator.cm', 'type=cm;labelKey=content_manager;serviceURL=/navigator/cm;repositories=');

INSERT INTO NEXUS.CONFIGURATION VALUES ('server.navigator.od', 'type=od;labelKey=ondemand;serviceURL=/navigator/od;repositories=');

INSERT INTO NEXUS.CONFIGURATION VALUES ('server.navigator.ci', 'type=ci;labelKey=content_integrator;serviceURL=/navigator/ci;repositories=');

INSERT INTO NEXUS.CONFIGURATION VALUES ('server.navigator.p8', 'type=p8;labelKey=filenet_p8;serviceURL=/navigator/p8;repositories=');

INSERT INTO NEXUS.CONFIGURATION VALUES ('server.navigator.cmis', 'type=cmis;labelKey=cmis;serviceURL=/navigator/cmis;repositories=');

INSERT INTO NEXUS.CONFIGURATION VALUES ('repository.navigator.p8defaultsettings', 'name=;type=p8;objectStore=;objectStoreName=;protocol=Navigator;serverName=;connectionPoint=;documentSystemProperties=Creator,DateCreated,LastModifier,DateLastModified,Id,IsReserved,IsCurrentVersion,MajorVersionNumber,MinorVersionNumber,ContentSize,MimeType;folderSystemProperties=Creator,DateCreated,Id,PathName;folderDefCols={NAME},ContentSize,LastModifier,DateLastModified,MajorVersionNumber;docNameProp=DocumentTitle;folderNameProp=FolderName;searchMaxResults=0;timeoutInSeconds=0;searchDefCols={NAME},ContentSize,LastModifier,DateLastModified,MajorVersionNumber;datetimeOp=;integerOp=;floatOp=;idOp=;stringOp=;booleanOp=;objectOp=;searchFilteredProperties=;matchAll=true;addAsMajorVersion=true;checkinAsMajorVersion=true;statusDocCheckedOut=true;statusDocDeclaredRecord=true;statusDocMinorVersions=true;statusWorkItemLocked=true;statusWorkItemDeadline=true');

INSERT INTO NEXUS.CONFIGURATION VALUES ('repository.navigator.oddefaultsettings', 'name=;type=od;serverName=;connectionPoint=;folderDefCols=;docNameProp=;folderNameProp=;searchMaxResults=1000;searchDefCols=;datetimeOp=;integerOp=;floatOp=;idOp=;stringOp=;booleanOp=;objectOp=;searchFilteredProperties=;matchAll=true;statusDocHold=true;statusDocNotes=true');

INSERT INTO NEXUS.CONFIGURATION VALUES ('repository.navigator.cmdefaultsettings', 'name=;type=cm;serverName=;connectionPoint=;documentSystemProperties=version,createdBy,createdTimestamp,modifiedBy,modifiedTimestamp,itemID;folderSystemProperties=version,createdBy,createdTimestamp,modifiedBy,modifiedTimestamp,itemID;folderDefCols={NAME},modifiedBy,modifiedTimestamp;docNameProp=;folderNameProp=;searchMaxResults=0;searchDefCols={NAME},modifiedBy,modifiedTimestamp;datetimeOp=;integerOp=;floatOp=;idOp=;stringOp=;booleanOp=;objectOp=;searchFilteredProperties=;matchAll=true;statusDocCheckedOut=true;statusDocDeclaredRecord=true;statusDocBookmarks=true;statusWorkItemCheckedOut=true;statusWorkItemSuspended=true');

INSERT INTO NEXUS.CONFIGURATION VALUES ('repository.navigator.cmisdefaultsettings', 'name=;type=cmis;cmisURL=;cmisRepositoryID=;protocol=CMIS/REST;documentSystemProperties=cmis:contentStreamLength,cmis:name,cmis:creationDate,cmis:lastModifiedBy,cmis:createdBy,cmis:objectId,cmis:contentStreamFileName,cmis:lastModificationDate;folderSystemProperties=cmis:name,cmis:createdBy,cmis:creationDate,cmis:objectId;folderDefCols=cmis:name,cmis:contentStreamLength,cmis:lastModifiedBy,cmis:lastModificationDate,cmis:createdBy;searchMaxResults=0;timeoutInSeconds=0;searchDefCols=cmis:name,cmis:contentStreamLength,cmis:lastModifiedBy,cmis:lastModificationDate,cmis:createdBy;datetimeOp=;integerOp=;floatOp=;idOp=;stringOp=;booleanOp=;objectOp=;searchFilteredProperties=;matchAll=true;addAsMajorVersion=true;checkinAsMajorVersion=true');

INSERT INTO NEXUS.CONFIGURATION VALUES ('menu.navigator.DefaultBrowseToolbar', 'type=BrowseToolbar;id=BrowseToolbar;items=');

INSERT INTO NEXUS.CONFIGURATION VALUES ('menu.navigator.DefaultFavoritesContextMenu', 'type=FavoritesContextMenu;id=FavoritesContextMenu;items=RenameFavorite,DeleteFavorite');

INSERT INTO NEXUS.CONFIGURATION VALUES ('menu.navigator.DefaultUserQueueContextMenu', 'type=UserQueueContextMenu;id=UserQueueContextMenu;items=ViewStep,ReturnToSender,Reassign');

INSERT INTO NEXUS.CONFIGURATION VALUES ('menu.navigator.DefaultProcessQueueContextMenu', 'type=ProcessQueueContextMenu;id=ProcessQueueContextMenu;items=ViewStep,MoveToInbox,Reassign');

INSERT INTO NEXUS.CONFIGURATION VALUES ('menu.navigator.DefaultTrackerQueueContextMenu', 'type=TrackerQueueContextMenu;id=TrackerQueueContextMenu;items=ViewStep,DeleteTracker');

INSERT INTO NEXUS.CONFIGURATION VALUES ('menu.navigator.DefaultWorkItemFolderContextMenu', 'type=WorkItemFolderContextMenu;id=WorkItemFolderContextMenu;items=EditWF,ContinueWF,SuspendWF,ResumeWF,RemoveWF,Separator,OpenFolder,Edit,Separator,SendLinksToFolders,Separator,CreateFolder,Import,Separator,ShowHyperlink');

INSERT INTO NEXUS.CONFIGURATION VALUES ('menu.navigator.DefaultWorkItemDocumentContextMenu', 'type=WorkItemDocumentContextMenu;id=WorkItemDocumentContextMenu;items=EditWF,ContinueWF,SuspendWF,ResumeWF,RemoveWF,Separator,View,Preview,DefaultDownload,Edit,Separator,DefaultCheckOut,CheckIn,Unlock,Separator,DefaultSendEmail,Separator,DefaultMoreActions');

INSERT INTO NEXUS.CONFIGURATION VALUES ('menu.navigator.DefaultSearchContextMenu', 'type=SearchContextMenu;id=SearchContextMenu;items=OpenSearch,AddToFavorites');

INSERT INTO NEXUS.CONFIGURATION VALUES ('menu.navigator.DefaultObjectStoreFolderContextMenu', 'type=ObjectStoreFolderContextMenu;id=ObjectStoreFolderContextMenu;items=RefreshGrid,Import,ImportUsingTemplate,CreateFolder,CreateFolderUsingTemplate');

INSERT INTO NEXUS.CONFIGURATION VALUES ('menu.navigator.DefaultTeamspaceFolderContextMenu', 'type=TeamspaceFolderContextMenu;id=TeamspaceFolderContextMenu;items=RefreshGrid,CreateFolder,WorkspaceProperties');

INSERT INTO NEXUS.CONFIGURATION VALUES ('menu.navigator.DefaultFolderWorkspaceContextMenu', 'type=FolderWorkspaceContextMenu;id=FolderWorkspaceContextMenu;items=CreateFolder,DeleteItem,Edit');

INSERT INTO NEXUS.CONFIGURATION VALUES ('menu.navigator.DefaultTeamspacesListToolbar', 'type=TeamspacesListToolbar;id=TeamspacesListToolbar;items=CreateTeamSpace,ManageTeamspaces');

INSERT INTO NEXUS.CONFIGURATION VALUES ('menu.navigator.DefaultTemplatesListToolbar', 'type=TemplatesListToolbar;id=TemplatesListToolbar;items=CreateTemplate,ManageTeamspaces');

INSERT INTO NEXUS.CONFIGURATION VALUES ('menu.navigator.DefaultTeamspaceContextMenu', 'type=TeamspaceContextMenu;id=TeamspaceContextMenu;items=OpenTeamspace,DeleteWorkspace,DefaultTeamspaceManageActions,Separator,AddToFavorites');

INSERT INTO NEXUS.CONFIGURATION VALUES ('menu.navigator.DefaultTeamspaceManageActions', 'id=TeamspaceManageActions;labelId=DefaultTeamspaceManageActions;items=EditTeamspaceTeam,EditTeamspaceSearches,EditTeamspaceClasses,EditTeamspaceEntryTemplates');

INSERT INTO NEXUS.CONFIGURATION VALUES ('menu.navigator.DefaultTeamspaceTemplateContextMenu', 'type=TeamspaceTemplateContextMenu;id=TeamspaceTemplateContextMenu;items=MakeWorkspaceTemplateDefault,DeleteWorkspace,EditWorkspace,DisableWorkspace,EnableWorkspace,WorkspaceProperties');

INSERT INTO NEXUS.CONFIGURATION VALUES ('menu.navigator.DefaultInbasketToolbar', 'type=InbasketToolbar;id=InbasketToolbar;items=RefreshInbasket,Separator,EditWF,ContinueWF,SuspendWF,ResumeWF,RemoveWF');

INSERT INTO NEXUS.CONFIGURATION VALUES ('menu.navigator.DefaultInbasketToolbarP8', 'type=InbasketToolbarP8;id=InbasketToolbarP8;items=RefreshInbasket');

INSERT INTO NEXUS.CONFIGURATION VALUES ('menu.navigator.DefaultAttachmentToolbar', 'type=AttachmentToolbar;id=AttachmentToolbar;items=Separator');

INSERT INTO NEXUS.CONFIGURATION VALUES ('menu.navigator.DefaultSearchTemplateContextMenu', 'type=SearchTemplateContextMenu;id=SearchTemplateContextMenu;items=OpenSearch,OpenSearchNewTab,DeleteItem,SearchProperties,Separator,CheckOutNoDownload,Unlock,EditSearch,Separator,AddToFavorites,DefaultFolderActions');

INSERT INTO NEXUS.CONFIGURATION VALUES ('menu.navigator.DefaultAddFolderAttachmentContextMenu', 'type=AddFolderAttachmentContextMenu;id=AddFolderAttachmentContextMenu;items=AddFolderAttachment,SelectFolderAttachment,CreateFolderUsingTemplate');

INSERT INTO NEXUS.CONFIGURATION VALUES ('menu.navigator.DefaultAddDocumentAttachmentContextMenu', 'type=AddDocumentAttachmentContextMenu;id=AddDocumentAttachmentContextMenu;items=AddDocumentAttachment,SelectDocumentAttachment,ImportUsingTemplate');

INSERT INTO NEXUS.CONFIGURATION VALUES ('menu.navigator.DefaultAttachmentItemContextMenu', 'type=AttachmentItemContextMenu;id=AttachmentItemContextMenu;items=View,Preview,DefaultDownload,DeleteItem,Edit,Separator,PrintDoc,DefaultCheckOut,CheckIn,Unlock,Separator,DefaultSendEmail,AddToFavorites,DefaultFolderActions,Separator,DefaultMoreActions');

INSERT INTO NEXUS.CONFIGURATION VALUES ('menu.navigator.DefaultAttachmentFolderContextMenu', 'type=AttachmentFolderContextMenu;id=AttachmentFolderContextMenu;items=OpenFolder,DeleteItem,Edit,Separator,SendLinksToFolders,AddToFavorites,MoveFolderToFolder,Separator,CreateFolder,CreateFolderUsingTemplate,Import,ImportUsingTemplate,Separator,ShowHyperlink');

INSERT INTO NEXUS.CONFIGURATION VALUES ('menu.navigator.DefaultAttachmentContextMenu', 'type=AttachmentContextMenu;id=AttachmentContextMenu;items=');

INSERT INTO NEXUS.CONFIGURATION VALUES ('menu.navigator.DefaultSelectObjectItemContextMenu', 'type=SelectObjectItemContextMenu;id=SelectObjectItemContextMenu;items=View,Download,Edit');

INSERT INTO NEXUS.CONFIGURATION VALUES ('menu.navigator.DefaultSelectObjectFolderContextMenu', 'type=SelectObjectFolderContextMenu;id=SelectObjectFolderContextMenu;items=Edit');

INSERT INTO NEXUS.CONFIGURATION VALUES ('menu.navigator.DefaultSelectObjectToolbar', 'type=SelectObjectToolbar;id=SelectObjectToolbar;items=Separator,Edit');

INSERT INTO NEXUS.CONFIGURATION VALUES ('menu.navigator.DefaultContentListToolbar', 'type=ContentListToolbar;id=ContentListToolbar;items=RefreshGrid,Separator,Import,CreateFolder,CheckIn,CheckOutLabelWithDownload,Edit');

INSERT INTO NEXUS.CONFIGURATION VALUES ('menu.navigator.DefaultFavoritesToolbar', 'type=FavoritesToolbar;id=FavoritesToolbar;items=RenameFavorite,DeleteFavorite');

INSERT INTO NEXUS.CONFIGURATION VALUES ('menu.navigator.DefaultBannerUserSessionContextMenu', 'type=BannerUserSessionContextMenu;id=BannerUserSessionContextMenu;items=Help,ChangePassword,LogOut');

INSERT INTO NEXUS.CONFIGURATION VALUES ('menu.navigator.DefaultBannerApplicationMenu', 'type=BannerApplicationMenu;id=BannerApplicationMenu;items=');

INSERT INTO NEXUS.CONFIGURATION VALUES ('menu.navigator.DefaultGlobalToolbar', 'type=GlobalToolbar;id=GlobalToolbar;items=Import,ImportUsingTemplate,CreateFolder,CreateFolderUsingTemplate,CreateHold');

INSERT INTO NEXUS.CONFIGURATION VALUES ('menu.navigator.DefaultBannerToolsContextMenu', 'type=BannerToolsContextMenu;id=BannerToolsContextMenu;items=Import,ImportUsingTemplate,CreateFolder,CreateFolderUsingTemplate,CreateHold,Separator,About');

INSERT INTO NEXUS.CONFIGURATION VALUES ('menu.navigator.DefaultItemContextMenu', 'type=ItemContextMenu;id=ItemContextMenu;items=View,Preview,DefaultDownload,DeleteItem,Edit,Separator,ViewAnnotation,DefaultHolds,PrintDoc,DefaultCheckOut,CheckIn,Unlock,Separator,DefaultSendEmail,Export,Launch,StartWF,AddToFavorites,DefaultFolderActions,Separator,DefaultMoreActions');

INSERT INTO NEXUS.CONFIGURATION VALUES ('menu.navigator.DefaultSystemItemContextMenu', 'type=SystemItemContextMenu;id=SystemItemContextMenu;items=View,DeleteItem,Edit,Separator,CheckOutNoDownload,Unlock,Separator,SendLinksToSearches,Export,Launch,DefaultFolderActions,Separator,ShowHyperlink');

INSERT INTO NEXUS.CONFIGURATION VALUES ('menu.navigator.DefaultMixItemsContextMenu', 'type=MixItemsContextMenu;id=MixItemsContextMenu;items=DeleteItem,SendLinksToSearches,Export,StartWF');

INSERT INTO NEXUS.CONFIGURATION VALUES ('menu.navigator.DefaultICAECMItemContextMenu', 'type=ICAECMItemContextMenu;id=ICAECMItemContextMenu;items=View,Preview,Download,DeleteItem,Edit,Separator,ViewAnnotation,DefaultCheckOut,CheckIn,Unlock,Separator,DefaultSendEmail,Launch,StartWF,AddToFavorites,DefaultFolderActions,Separator,DefaultMoreActions');

INSERT INTO NEXUS.CONFIGURATION VALUES ('menu.navigator.DefaultVersionsContextMenu', 'type=VersionsContextMenu;id=VersionsContextMenu;items=View,Preview,DefaultDownload,DeleteItem,Separator,ViewAnnotation,DefaultCheckOut,CheckIn,Unlock,Separator,DefaultSendEmail,PromoteVersion,DemoteVersion,ShowHyperlink');

INSERT INTO NEXUS.CONFIGURATION VALUES ('menu.navigator.DefaultHolds', 'pluginId=;id=Holds;labelId=DefaultHolds;items=ApplyHold,RemoveHold;serverTypes=od;privilegeName=privHold');

INSERT INTO NEXUS.CONFIGURATION VALUES ('menu.navigator.DefaultDownload', 'id=DownloadLabel;labelId=Download;serverTypes=;items=DownloadAsOriginal,DownloadAsPdf;privilegeName=');

INSERT INTO NEXUS.CONFIGURATION VALUES ('menu.navigator.DefaultCheckOut', 'id=CheckOut;labelId=DefaultCheckOut;serverTypes=cm,p8;items=CheckOutDownload,CheckOutNoDownload;privilegeName=');

INSERT INTO NEXUS.CONFIGURATION VALUES ('menu.navigator.DefaultMoreActions', 'id=MoreActions;labelId=DefaultMoreActions;serverTypes=cm,p8,cmis;items=PromoteVersion,DemoteVersion,ShowHyperlink;privilegeName=privMajorVersion');

INSERT INTO NEXUS.CONFIGURATION VALUES ('menu.navigator.DefaultFolderActions', 'id=FolderActions;labelId=DefaultFolderActions;serverTypes=cm,p8;items=AddToFolder,MoveDocumentToFolder,RemoveFromFolder;privilegeName=');

INSERT INTO NEXUS.CONFIGURATION VALUES ('menu.navigator.DefaultSendEmail', 'id=SendEmail;labelId=DefaultSendEmail;items=SendLinksToDocs,SendAttachments;privilegeName=');

INSERT INTO NEXUS.CONFIGURATION VALUES ('menu.navigator.DefaultFolderContextMenu', 'type=FolderContextMenu;id=FolderContextMenu;items=OpenFolder,RefreshGrid,DeleteItem,Edit,Separator,SendLinksToFolders,Export,Launch,StartWF,AddToFavorites,MoveFolderToFolder,Separator,CreateFolder,Import,Separator,ShowHyperlink');

INSERT INTO NEXUS.CONFIGURATION VALUES ('menu.navigator.DefaultTeamspaceToolbar', 'type=TeamspaceToolbar;id=TeamspaceToolbar;serverTypes=cm,p8;items=EditTeamspaceTeam,EditTeamspaceSearches,EditTeamspaceClasses,EditTeamspaceEntryTemplates;privilegeName=');

INSERT INTO NEXUS.CONFIGURATION VALUES ('menu.navigator.DefaultFavoriteSearchTemplateContextMenu', 'id=FavoriteSearchTemplateContextMenu;items=OpenSearch,OpenSearchNewTab,DeleteItem,SearchProperties,Separator,CheckOutNoDownload,Unlock,EditSearch,Separator,RenameFavorite,DeleteFavorite,DefaultFolderActions;type=FavoriteSearchTemplateContextMenu');

INSERT INTO NEXUS.CONFIGURATION VALUES ('menu.navigator.DefaultFavoriteTeamspaceContextMenu', 'type=FavoriteTeamspaceContextMenu;id=FavoriteTeamspaceContextMenu;items=OpenTeamspace,DeleteWorkspace,DefaultTeamspaceManageActions,Separator,RenameFavorite,DeleteFavorite');

INSERT INTO NEXUS.CONFIGURATION VALUES ('menu.navigator.DefaultFavoriteFolderContextMenu', 'id=FavoriteFolderContextMenu;items=OpenFolder,RefreshGrid,DeleteItem,Edit,Separator,SendLinksToFolders,Launch,StartWF,RenameFavorite,DeleteFavorite,MoveFolderToFolder,Separator,CreateFolder,Import,Separator,ShowHyperlink;type=FavoriteFolderContextMenu');

INSERT INTO NEXUS.CONFIGURATION VALUES ('menu.navigator.DefaultFavoriteItemContextMenu', 'id=FavoriteItemContextMenu;items=View,Preview,DefaultDownload,DeleteItem,Edit,Separator,ViewAnnotation,DefaultHolds,PrintDoc,DefaultCheckOut,CheckIn,Unlock,Separator,DefaultSendEmail,Export,Launch,StartWF,RenameFavorite,DeleteFavorite,DefaultFolderActions,Separator,DefaultMoreActions;type=FavoriteItemContextMenu');

INSERT INTO NEXUS.CONFIGURATION VALUES ('viewer.navigator.default', 'id=default;name=Default name;description=Default description;mappings=application/unknown.od,application/afp.od,application/line.od,text/plain.,application/pdf.cm,application/pdf.ci,application/pdf.od,image/tiff.cm,image/tiff.ci,image/tiff.od,defaultFilenetViewer,image/tiff.cmis,default.p8,default.cmis,default.cm,default.od');

INSERT INTO NEXUS.CONFIGURATION VALUES ('viewerMapping.navigator.application/afp.od', 'contentTypes=application/afp;serverType=od;viewerName=afp2pdf');

INSERT INTO NEXUS.CONFIGURATION VALUES ('viewerMapping.navigator.application/line.od', 'contentTypes=application/line;serverType=od;viewerName=lineDataApplet');

INSERT INTO NEXUS.CONFIGURATION VALUES ('viewerMapping.navigator.text/plain.', 'contentTypes=text/plain;serverType=;viewerName=browser');

INSERT INTO NEXUS.CONFIGURATION VALUES ('viewerMapping.navigator.application/pdf.cm', 'contentTypes=application/pdf;serverType=cm;viewerName=adobeReader');

INSERT INTO NEXUS.CONFIGURATION VALUES ('viewerMapping.navigator.application/pdf.ci', 'contentTypes=application/pdf;serverType=ci;viewerName=adobeReader');

INSERT INTO NEXUS.CONFIGURATION VALUES ('viewerMapping.navigator.application/pdf.od', 'contentTypes=application/pdf;serverType=od;viewerName=adobeReader');

INSERT INTO NEXUS.CONFIGURATION VALUES ('viewerMapping.navigator.application/pdf.cmis', 'contentTypes=application/pdf;serverType=cmis;viewerName=adobeReader');

INSERT INTO NEXUS.CONFIGURATION VALUES ('viewerMapping.navigator.image/tiff.cm', 'contentTypes=image/tiff;serverType=cm;viewerName=appletViewer');

INSERT INTO NEXUS.CONFIGURATION VALUES ('viewerMapping.navigator.image/tiff.ci', 'contentTypes=image/tiff;serverType=ci;viewerName=appletViewer');

INSERT INTO NEXUS.CONFIGURATION VALUES ('viewerMapping.navigator.image/tiff.od', 'contentTypes=image/tiff;serverType=od;viewerName=appletViewer');

INSERT INTO NEXUS.CONFIGURATION VALUES ('viewerMapping.navigator.image/tiff.cmis', 'contentTypes=image/tiff;serverType=cmis;viewerName=appletViewer');

INSERT INTO NEXUS.CONFIGURATION VALUES ('viewerMapping.navigator.defaultFilenetViewer', 'contentTypes=image/pjpeg,image/jpg,image/jpeg,image/bmp,image/gif,image/tiff,application/pdf,application/x-cold,application/vnd.filenet.im-image,application/vnd.filenet.im-cold,application/vnd.filenet.im-form,application/vnd.filenet.im-other,image/png;serverType=p8;viewerName=filenetViewer');

INSERT INTO NEXUS.CONFIGURATION VALUES ('viewerMapping.navigator.default.p8', 'contentTypes=;serverType=p8;viewerName=browser');

INSERT INTO NEXUS.CONFIGURATION VALUES ('viewerMapping.navigator.default.cmis', 'contentTypes=;serverType=cmis;viewerName=browser');

INSERT INTO NEXUS.CONFIGURATION VALUES ('viewerMapping.navigator.default.cm', 'contentTypes=;serverType=cm;viewerName=appletViewer');

INSERT INTO NEXUS.CONFIGURATION VALUES ('viewerMapping.navigator.default.od', 'contentTypes=;serverType=od;viewerName=appletViewer');

INSERT INTO NEXUS.CONFIGURATION VALUES ('iconStatus.navigator.docHold', 'servers=od;className=ecmHoldIcon');

INSERT INTO NEXUS.CONFIGURATION VALUES ('iconStatus.navigator.docNotes', 'servers=od;className=ecmNoteIcon');

INSERT INTO NEXUS.CONFIGURATION VALUES ('iconStatus.navigator.docMinorVersions', 'servers=p8;className=ecmHasMinorIcon');

INSERT INTO NEXUS.CONFIGURATION VALUES ('iconStatus.navigator.docDeclaredRecord', 'servers=cm,p8;className=ecmRecordIcon');

INSERT INTO NEXUS.CONFIGURATION VALUES ('iconStatus.navigator.docBookmarks', 'servers=cm;className=ecmBookmarkIcon');

INSERT INTO NEXUS.CONFIGURATION VALUES ('iconStatus.navigator.docCheckedOut', 'servers=p8,cm;className=ecmLockIcon');

INSERT INTO NEXUS.CONFIGURATION VALUES ('iconStatus.navigator.workItemSuspended', 'servers=cm;className=ecmSuspendedIcon');

INSERT INTO NEXUS.CONFIGURATION VALUES ('iconStatus.navigator.workItemDeadlineImportance', 'servers=p8;className=ecmImportanceIcon');

INSERT INTO NEXUS.CONFIGURATION VALUES ('iconStatus.navigator.workItemDeadlineReminderSent', 'servers=p8;className=ecmMessageSentIcon');

INSERT INTO NEXUS.CONFIGURATION VALUES ('iconStatus.navigator.workItemLocked', 'servers=p8;className=ecmLockIcon');

INSERT INTO NEXUS.CONFIGURATION VALUES ('iconStatus.navigator.workItemCheckedOut', 'servers=cm;className=ecmLockIcon');

INSERT INTO NEXUS.CONFIGURATION VALUES ('icon.navigator.default0', 'className=ftAfp;contentTypes=application/afp');

INSERT INTO NEXUS.CONFIGURATION VALUES ('icon.navigator.default1', 'className=ftPdf;contentTypes=application/pdf');

INSERT INTO NEXUS.CONFIGURATION VALUES ('icon.navigator.default2', 'className=ftPlain;contentTypes=text/plain,application/rtf,application/x-rtf,text/richtext,application/dca-rft');

INSERT INTO NEXUS.CONFIGURATION VALUES ('icon.navigator.default3', 'className=ftWeb;contentTypes=text/html,text/htm');

INSERT INTO NEXUS.CONFIGURATION VALUES ('icon.navigator.default4', 'className=ftCompressed;contentTypes=application/x-compress,application/x-compressed,application/x-zip-compressed,application/zip,multipart/x-zip');

INSERT INTO NEXUS.CONFIGURATION VALUES ('icon.navigator.default5', 'className=ftCode;contentTypes=text/xml,application/xml');

INSERT INTO NEXUS.CONFIGURATION VALUES ('icon.navigator.default6', 'className=ftPresentation;contentTypes=application/x-vnd.oasis.opendocument.presentation,application/vnd.ms-powerpoint,application/vnd.lotus-freelance,application/vnd.oasis.opendocument.presentation,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.openxmlformats-officedocument.presentationml.slideshow,application/vnd.openxmlformats-officedocument.presentationml.template,application/vnd.ms-powerpoint.presentation.macroEnabled.12,application/vnd.ms-powerpoint.template.macroEnabled.12');

INSERT INTO NEXUS.CONFIGURATION VALUES ('icon.navigator.default7', 'className=ftData;contentTypes=application/line,application/x-vnd.oasis.opendocument.spreadsheet,application/vnd.ms-excel,application/vnd.ms-excel.sheet.binary.macroEnabled.12,application/vnd.ms-excel.addin.macroEnabled.12,application/vnd.ms-excel.sheet.macroEnabled.12,application/vnd.lotus-1-2-3,application/vnd.openxmlformats-officedocument.spreadsheetml.template,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.oasis.opendocument.spreadsheet');

INSERT INTO NEXUS.CONFIGURATION VALUES ('icon.navigator.default8', 'className=ftWordProcessing;contentTypes=application/x-vnd.oasis.opendocument.text,application/msword,application/vnd.lotus-wordpro,application/wordperfect5.1,application/vnd.oasis.opendocument.text,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.wordprocessingml.template,application/vnd.ms-word.template.macroEnabled.12,application/vnd.ms-word.document.macroEnabled.12');

INSERT INTO NEXUS.CONFIGURATION VALUES ('icon.navigator.default9', 'className=ftMail;contentTypes=application/csbundled,message/rfc822,application/iccxit,application/x-filenet-filetype-msg');

INSERT INTO NEXUS.CONFIGURATION VALUES ('icon.navigator.default10', 'className=ftOutlookMail;contentTypes=application/vnd.ms-outlook');

INSERT INTO NEXUS.CONFIGURATION VALUES ('icon.navigator.default11', 'className=ftNotesMail;contentTypes=application/icccsn');

INSERT INTO NEXUS.CONFIGURATION VALUES ('icon.navigator.default12', 'className=ftSearchTemplate;contentTypes=application/x-filenet-searchtemplate,application/x-searchtemplate');

INSERT INTO NEXUS.CONFIGURATION VALUES ('icon.navigator.default13', 'className=ftEntryTemplate;contentTypes=application/x-filenet-entrytemplate,application/x-filenet-formdataentrytemplate');

INSERT INTO NEXUS.CONFIGURATION VALUES ('icon.navigator.default14', 'className=ftFormTemplate;contentTypes=application/x-filenet-itxformtemplate');

INSERT INTO NEXUS.CONFIGURATION VALUES ('icon.navigator.default15', 'className=ftCustomObjectEntryTemplate;contentTypes=application/x-filenet-customobjectentrytemplate');

INSERT INTO NEXUS.CONFIGURATION VALUES ('icon.navigator.default16', 'className=ftDocumentEntryTemplate;contentTypes=application/x-filenet-documententrytemplate');

INSERT INTO NEXUS.CONFIGURATION VALUES ('icon.navigator.default17', 'className=ftFolderEntryTemplate;contentTypes=application/x-filenet-folderentrytemplate');

INSERT INTO NEXUS.CONFIGURATION VALUES ('icon.navigator.default18', 'className=ftDeclareRecordEntryTemplate;contentTypes=application/x-filenet-declarerecordentrytemplate');

INSERT INTO NEXUS.CONFIGURATION VALUES ('icon.navigator.default19', 'className=ftSearchStored;contentTypes=application/x-filenet-search,application/x-searchtemplate.automatic');

INSERT INTO NEXUS.CONFIGURATION VALUES ('icon.navigator.default20', 'className=ftWorkflow;contentTypes=application/x-filenet-workflowdefinition,application/x-filenet-xpdlworkflowdefinition');

INSERT INTO NEXUS.CONFIGURATION VALUES ('icon.navigator.default21', 'className=ftWorkItem;contentTypes=application/x-workitem');

INSERT INTO NEXUS.CONFIGURATION VALUES ('icon.navigator.default22', 'className=ftTracker;contentTypes=application/x-tracker');

INSERT INTO NEXUS.CONFIGURATION VALUES ('icon.navigator.default23', 'className=ftPolicyDocument;contentTypes=application/x-filenet-documentpolicy');

INSERT INTO NEXUS.CONFIGURATION VALUES ('icon.navigator.default24', 'className=ftPolicyWorkflow;contentTypes=application/x-filenet-workflowpolicy');

INSERT INTO NEXUS.CONFIGURATION VALUES ('icon.navigator.default25', 'className=ftFormData;contentTypes=application/x-filenet-formdata');

INSERT INTO NEXUS.CONFIGURATION VALUES ('icon.navigator.default26', 'className=ftExternalFile;contentTypes=application/x-filenet-external');

INSERT INTO NEXUS.CONFIGURATION VALUES ('icon.navigator.default27', 'className=ftAudio;contentTypes=audio/*');

INSERT INTO NEXUS.CONFIGURATION VALUES ('icon.navigator.default28', 'className=ftGraphic;contentTypes=image/*');

INSERT INTO NEXUS.CONFIGURATION VALUES ('icon.navigator.default29', 'className=ftVideo;contentTypes=video/*');

INSERT INTO NEXUS.CONFIGURATION VALUES ('admin.navigator.default.p8', 'operators=idOp,datetimeOp,integerOp,floatOp,stringOp,booleanOp,objectOp;documentSystemProperties=Creator,DateCreated,LastModifier,DateLastModified,Id,IsReserved,IsCurrentVersion,MajorVersionNumber,MinorVersionNumber,ContentSize,MimeType;folderSystemProperties=Creator,DateCreated,Id,PathName;folderDefFixedCols={NAME};idOp=EQ,!EQ,IA,IN,!IN,NL,!NL;datetimeOp=EQ,!EQ,LT,LE,GT,GE,BT,!BT,IA,IN,!IN,NL,!NL;integerOp=EQ,!EQ,LT,LE,GT,GE,BT,!BT,IA,IN,!IN,NL,!NL;floatOp=EQ,!EQ,LT,LE,GT,GE,BT,!BT,IA,IN,!IN,NL,!NL;stringOp=SW,EW,LK,!LK,EQ,!EQ,LT,LE,GT,GE,BT,!BT,IA,IN,!IN,NL,!NL;booleanOp=EQ,!EQ,IA,IN,!IN,NL,!NL;objectOp=EQ,!EQ,NL,!NL;searchMaxResults=5000;timeoutInSeconds=180');

INSERT INTO NEXUS.CONFIGURATION VALUES ('admin.navigator.default.cm', 'operators=datetimeOp,integerOp,floatOp,stringOp;documentSystemProperties=itemID,createdTimestamp,createdBy,modifiedTimestamp,modifiedBy,version;folderSystemProperties=itemID,createdTimestamp,createdBy,modifiedTimestamp,modifiedBy,version;folderDefFixedCols={NAME};datetimeOp=EQ,!EQ,LT,LE,GT,GE,BT,!BT,IA,!IN,NL,!NL;integerOp=EQ,!EQ,LT,LE,GT,GE,BT,!BT,IA,!IN,NL,!NL;floatOp=EQ,!EQ,LT,LE,GT,GE,BT,!BT,IA,!IN,NL,!NL;stringOp=SW,EW,LK,!LK,EQ,!EQ,LT,LE,GT,GE,BT,!BT,IA,!IN,NL,!NL;searchMaxResults=5000');

INSERT INTO NEXUS.CONFIGURATION VALUES ('admin.navigator.default.cmis', 'operators=datetimeOp,integerOp,floatOp,stringOp;folderDefFixedCols={NAME};datetimeOp=EQ,!EQ,LT,LE,GT,GE,BT,!BT,IA,!IN,NL,!NL;integerOp=EQ,!EQ,LT,LE,GT,GE,BT,!BT,IA,!IN,NL,!NL;floatOp=EQ,!EQ,LT,LE,GT,GE,BT,!BT,IA,!IN,NL,!NL;stringOp=SW,EW,LK,!LK,EQ,!EQ,LT,LE,GT,GE,BT,!BT,IA,!IN,NL,!NL;searchMaxResults=5000;timeoutInSeconds=180');

INSERT INTO NEXUS.CONFIGURATION VALUES ('admin.navigator.default.od', 'operators=;folderDefFixedCols=;datetimeOp=;integerOp=;floatOp=;stringOp=;searchMaxResults=1000');

COMMIT;

