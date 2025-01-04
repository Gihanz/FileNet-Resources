db2 -v CONNECT TO NEXUSDB

db2 -v SET SCHEMA NEXUS

db2 -v INSERT INTO "CONFIGURATION" VALUES ('application.nexus', 'logging.level=4;viewerDefs=ajaxViewer,appletViewer,htmlConversion,pdfConversion,browser,afpPlugin,afp2html,afp2pdf,xenos,lineDataApplet,adobeReader,daejaViewer,streamingDaejaViewer;logging.excludes=com.ibm.mm.wc.configuration;threadSleepTime=5;plugins=;menus=ContentListToolbar,BannerToolbar,GlobalToolbar,ViewerToolbar,ItemContextMenu,FolderContextMenu,FolderWorkspaceContextMenu,InbasketToolbar,AttachmentToolbar,AddAttachmentContextMenu,WorkItemContextMenu,WorkItemContextMenuCM,ObjectStoreFolderContextMenu,FolderWorkspaceContextMenu,TeamspacesListToolbar,TemplatesListToolbar,TeamspaceContextMenu,TeamspaceTemplateContextMenu,FavoritesContextMenu,SearchContextMenu,RepositoryListToolbar;mappings=application/unknown.od,application/afp.od,application/line.od,text/plain.,application/msword.,application/pdf.cm,application/pdf.ci,application/pdf.od,image/tiff.cm,image/tiff.ci,image/tiff.od,image/tiff.cmis,image/tiff.p8,image/pjpeg.p8,image/jpg.p8,image/jpeg.p8,image/bmp.p8,image/gif.p8,application/pdf.p8,application/x-cold.p8,application/vnd_filenet_im-image.p8,application/vnd_filenet_im-cold.p8,application/vnd_filenet_im-form.p8,application/vnd_filenet_im-other.p8,image/png.p8,message/rfc822.p8,default.;repositories=grnvm138,grnvm138Carolyn,grnvm139,grnvm15cmtos,GRNVM18,FEDSEARCH,cmi149,grnvm15cmdos,cm-hamptonvm15,cmi254,newportP8,calvinvm1ce,puuwaiQA1FS,puuwaiQA2DS,calvinNexusDSSQL,calvinNexusFSSQL,smdesktop1,grnvm119,wang,cm-hobbesvm12;desktops=default,admin,search,ica,classic,mobile,custom,oldlayout;objectExpiration=10;desktop=default')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('desktop.nexus.default', 'viewerService=DefaultViewer;theme=;name=Default Desktop;isDefault=Yes;menuPrefix=Default;applicationName=IBM Enterprise Content Management;configInfo=C:\\Program Files\\IBM\\OnDemand Web Enablement Kit;layout=ecm.widget.layout.newlayout.MainLayout;layoutConfig=ecm.widget.layout.config.ClientLayoutDef;actionHandler=ecm.widget.layout.newlayout.CommonActionsHandler;servers=cm,od,ci,p8,cmis;repositories=grnvm138,grnvm138Carolyn,grnvm139,grnvm15cmtos,FEDSEARCH,cmi149,grnvm15cmdos,cm-hamptonvm15,cmi254,newportP8,calvinvm1ce,puuwaiQA1FS,puuwaiQA2DS,calvinNexusDSSQL,calvinNexusFSSQL,calvinIER_OS1,smdesktop1,grnvm119,wang,cm-hobbesvm12,DaphneA,f9d47267-e882-497a-98c2-83024ed9539e,$x!grnvm119')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('desktop.nexus.admin', 'viewerService=DefaultViewer;theme=;name=Admin Dekstop;isDefault=No;menuPrefix=Default;applicationName=IBM Enterprise Content Management;configInfo=C:\\Program Files\\IBM\\OnDemand Web Enablement Kit;layout=ecm.widget.layout.newlayout.MainLayout;layoutConfig=ecm.widget.layout.config.AdminLayoutDef;actionHandler=ecm.widget.layout.newlayout.CommonActionsHandler;servers=cm,od,ci,p8,cmis;repositories=grnvm138,grnvm138Carolyn,grnvm139,grnvm15cmtos,FEDSEARCH,cmi149,grnvm15cmdos,cm-hamptonvm15,cmi254,newportP8,calvinvm1ce,puuwaiQA1FS,puuwaiQA2DS,calvinNexusDSSQL,calvinNexusFSSQL,calvinIER_OS1,smdesktop1,grnvm119,wang,cm-hobbesvm12,terranovavm14,DaphneA,f9d47267-e882-497a-98c2-83024ed9539e,$x!grnvm119')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('desktop.nexus.search', 'viewerService=DefaultViewer;theme=;name=Search Desktop;isDefault=No;applicationName=IBM Enterprise Content Management;configInfo=C:\\Program Files\\IBM\\OnDemand Web Enablement Kit;layout=ecm.widget.layout.newlayout.MainLayout;layoutConfig=ecm.widget.layout.config.SearchOnlyLayoutDef;actionHandler=ecm.widget.layout.newlayout.CommonActionsHandler;servers=cm,od,ci,p8;repositories=grnvm139,cmi149,cm-hamptonvm15,wang')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('desktop.nexus.ica', 'viewerService=DefaultViewer;menuPrefix=Default;theme=;name=ICA Desktop;isDefault=No;servers=cm,od,ci,p8,cmis;applicationName=IBM Enterprise Content Client;layout=ecm.widget.layout.newlayout.MainLayout;layoutConfig=ica.ClientLayoutDef;actionHandler=ecm.widget.layout.newlayout.CommonActionsHandler;repositories=grnvm138,grnvm139,grnvm15cmtos,FEDSEARCH,cmi149,grnvm15cmdos,cm-hamptonvm15,cmi254,newportP8,calvinvm1ce,puuwaiQA1FS,puuwaiQA2DS,calvinNexusDSSQL,calvinNexusFSSQL,calvinIER_OS1,smdesktop1,grnvm119,wang,cm-hobbesvm12')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('desktop.nexus.classic', 'viewerService=DefaultViewer;menuPrefix=Default;theme=;name=Classic Desktop;isDefault=No;servers=cm,od,ci,p8,cmis;repositories=grnvm138,grnvm138Carolyn,grnvm139,grnvm15cmtos,FEDSEARCH,cmi149,grnvm15cmdos,cm-hamptonvm15,cmi254,newportP8,calvinvm1ce,puuwaiQA1FS,puuwaiQA2DS,calvinNexusDSSQL,calvinNexusFSSQL,calvinIER_OS1,smdesktop1,grnvm119,wang,cm-hobbesvm12')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('desktop.nexus.mobile', 'viewerService=DefaultViewer;menuPrefix=Mobile;theme=claro;name=Mobile Desktop;isDefault=No;servers=cm,od,ci,p8,cmis;repositories=grnvm138,grnvm139,grnvm15cmtos,FEDSEARCH,cmi149,grnvm15cmdos,cm-hamptonvm15,cmi254,newportP8,calvinvm1ce,puuwaiQA1FS,puuwaiQA2DS,calvinNexusDSSQL,calvinNexusFSSQL,calvinIER_OS1,smdesktop1,grnvm119,wang,cm-hobbesvm12')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('desktop.nexus.custom', 'viewerService=DefaultViewer;menuPrefix=Custom;theme=;name=Custom Desktop;isDefault=No;servers=cm,od,ci,p8,cmis;passwordRulesUrl=http://www.ibm.com;messageSearchURL=http://google.com?q;applicationName=IBM Nexus;loginInformationUrl=/wcservices/tests/NexusLoginInfo.html;layout=ecm.widget.layout.newlayout.MainLayout;layoutConfig=ecm.widget.layout.config.ClientLayoutDef;actionHandler=ecm.widget.layout.newlayout.CommonActionsHandler;repositories=grnvm138,grnvm138Carolyn,grnvm139,grnvm15cmtos,FEDSEARCH,cmi149,grnvm15cmdos,cm-hamptonvm15,cmi254,newportP8,calvinvm1ce,puuwaiQA1FS,puuwaiQA2DS,calvinNexusDSSQL,calvinNexusFSSQL,calvinIER_OS1,smdesktop1,grnvm119,wang,cm-hobbesvm12;authenticatingRepository=grnvm15cmtos')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('desktop.nexus.NoRepo', 'viewerService=DefaultViewer;menuPrefix=Custom;theme=;name=Custom Desktop;isDefault=No;servers=cm,od,ci,p8,cmis;passwordRulesUrl=http://www.ibm.com;messageSearchURL=http://google.com?q;applicationName=IBM Nexus;loginInformationUrl=/wcservices/tests/NexusLoginInfo.html;layout=ecm.widget.layout.newlayout.MainLayout;layoutConfig=ecm.widget.layout.config.ClientLayoutDef;actionHandler=ecm.widget.layout.newlayout.CommonActionsHandler;repositories=;authenticatingRepositoryId=')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('desktop.nexus.RepoContainer', 'viewerService=DefaultViewer;menuPrefix=Custom;theme=;name=Custom Desktop;isDefault=No;servers=cm,od,ci,p8,cmis;passwordRulesUrl=http://www.ibm.com;messageSearchURL=http://google.com?q;applicationName=IBM Nexus;loginInformationUrl=/wcservices/tests/NexusLoginInfo.html;layout=ecm.widget.layout.newlayout.MainLayout;layoutConfig=ecm.widget.layout.config.ClientLayoutDef;actionHandler=ecm.widget.layout.newlayout.CommonActionsHandler;repositories=grnvm138,grnvm138Carolyn,grnvm139,grnvm15cmtos,FEDSEARCH,cmi149,grnvm15cmdos,cm-hamptonvm15,cmi254,satulooriOS1,satulooriOS2,sridharOS1,sridharOS2,newportP8,calvinvm1ce,puuwaiQA1FS,puuwaiQA2DS,calvinNexusDSSQL,calvinNexusFSSQL,calvinIER_OS1,smdesktop1,grnvm119,wang,cm-hobbesvm12;authenticatingRepository=CONTAINER')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('desktop.nexus.NoRepoContainer', 'viewerService=DefaultViewer;menuPrefix=Custom;theme=;name=Custom Desktop;isDefault=No;servers=cm,od,ci,p8,cmis;passwordRulesUrl=http://www.ibm.com;messageSearchURL=http://google.com?q;applicationName=IBM Nexus;loginInformationUrl=/wcservices/tests/NexusLoginInfo.html;layout=ecm.widget.layout.newlayout.MainLayout;layoutConfig=ecm.widget.layout.config.ClientLayoutDef;actionHandler=ecm.widget.layout.newlayout.CommonActionsHandler;repositories=;authenticatingRepository=CONTAINER')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('desktop.nexus.oldlayout', 'viewerService=DefaultViewer;menuPrefix=Default;theme=;name=Old Layout Desktop;isDefault=No;servers=cm,od,ci,p8,cmis;applicationName=IBM Enterprise Content Client;repositories=grnvm138,grnvm139,grnvm15cmtos,FEDSEARCH,cmi149,grnvm15cmdos,cm-hamptonvm15,cmi254,newportP8,calvinvm1ce,puuwaiQA1FS,puuwaiQA2DS,calvinNexusDSSQL,calvinNexusFSSQL,calvinIER_OS1,smdesktop1,grnvm119,wang,cm-hobbesvm12')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('desktop.nexus.ierdesktop', 'viewerService=DefaultViewer;menuPrefix=Default;theme=;name=IBM Enterprise Records;isDefault=No;servers=cm,od,ci,p8,cmis;applicationName=IBM Enterprise Content Client;repositories=win11-FPOS,win11-Classified;layout=ecm.widget.layout.newlayout.MainLayout;layoutConfig=ier.widget.layout.IERClientLayoutDef')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('desktop.nexus.ierdesktop2', 'viewerService=DefaultViewer;menuPrefix=Default;theme=;name=IBM Enterprise Records;isDefault=No;servers=cm,od,ci,p8,cmis;applicationName=IBM Enterprise Content Client;repositories=win11-FPOS,win11-Classified;layout=ier.widget.layout.IERAppLayout')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('desktop.nexus.searchonly', 'viewerService=DefaultViewer;menuPrefix=Default;theme=;name=IBM Enterprise Records;isDefault=No;servers=cm,od,ci,p8,cmis;applicationName=IBM Enterprise Content Client;repositories=grnvm139,cmi149,cm-hamptonvm1,wang;layout=ecm.widget.layout.newlayout.MainLayout;layoutConfig=ecm.widget.layout.config.SearchOnlyLayoutDef;actionHandler=ecm.widget.layout.newlayout.CommonActionsHandler')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('server.nexus.cm', 'type=cm;serviceURL=/wcservices/cm;configInfo=C:\\Program Files\\IBM\\db2cmv8;repositories=GRNVM18,bcctest,grnvm136,cmi254,grnvm138,grnvm119,terranovavm14,grnvm138bjo')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('server.nexus.od', 'type=od;serviceURL=/wcservices/od;configInfo=C:\\Program Files\\IBM\\OnDemand Web Enablement Kit;repositories=cmi149,wang,grnvm139')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('server.nexus.ci', 'type=ci;serviceURL=/wcservices/ci;configInfo=C:\\program files\\ibm\\ContentIntegrator;repositories=FEDSEARCH')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('server.nexus.p8', 'type=p8;serviceURL=/wcservices/p8;repositories=newportP8,grnvm15cmtos,grnvm15cmdos,smdesktop1,puuwaiQA1FS,puuwaiQA2DS,calvinNexusDSSQL,calvinNexusFSSQL,calvinIER_OS1')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('server.nexus.cmis', 'type=cmis;serviceURL=/wcservices/cmis;repositories=DaphneA,f9d47267-e882-497a-98c2-83024ed9539e,$x!grnvm119,p8dnsdojo')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('repository.nexus.DaphneA', 'name=CMIS - FileNet - Jay public (CEMPAdmin:CEMPAdmin);type=cmis;serverName=http://cmis.dnsdojo.com:8080/p8cmis/resources/Service')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('repository.nexus.f9d47267-e882-497a-98c2-83024ed9539e', 'name=CMIS - Alfresco - Jay public (admin:admin);type=cmis;serverName=http://cmis.dnsdojo.com:999/alfresco/service/cmis')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('repository.nexus.$x!grnvm119', 'name=CMIS - CM8 - grnvm119 (icmadmin:pwd4svl.);type=cmis;serverName=http://grnvm97.svl.ibm.com:9080/cmcmis/resources/Service')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('repository.nexus.p8dnsdojo', 'name=Jay''s Public Server (CMIS->P8);type=cmis;serverName=cmis.dnsdojo.com')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('repository.nexus.p8defaultsettings', 'name=;type=p8;objectStore=;protocol=FileNetP8WSI;serverName=;connectionPoint=;folderDefCols=Name,ContentSize,LastModifier,DateLastModified,MajorVersionNumber;docNameProp=DocumentTitle;folderNameProp=FolderName;searchMaxResults=100;timeoutInSeconds=20;searchDefCols=Name,ContentSize,LastModifier,DateLastModified,MajorVersionNumber;dateOperator=GT,LT,EQ,LK;timeOperator=GT,LT,EQ,LK;integerOperator=GT,LT,EQ,LK;stringOperator=GT,LT,EQ,LK,CT;booleanOperator=EQ;objectOperator=EQ,LK;searchProperties=Name')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('repository.nexus.oddefaultsettings', 'name=;type=od;serverName=;connectionPoint=;folderDefCols=Name,ContentSize,LastModifier,DateLastModified,MajorVersionNumber;docNameProp=DocumentTitle;folderNameProp=FolderName;searchMaxResults=100;timeoutInSeconds=20;searchDefCols=Name,ContentSize,LastModifier,DateLastModified,MajorVersionNumber;dateOperator=GT,LT,EQ,LK;timeOperator=GT,LT,EQ,LK;integerOperator=GT,LT,EQ,LK;stringOperator=GT,LT,EQ,LK,CT;booleanOperator=EQ;objectOperator=EQ,LK;searchProperties=Name')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('repository.nexus.cmdefaultsettings', 'name=;type=cm;serverName=;connectionPoint=;folderDefCols=Name,ContentSize,LastModifier,DateLastModified,MajorVersionNumber;docNameProp=DocumentTitle;folderNameProp=FolderName;searchMaxResults=100;timeoutInSeconds=20;searchDefCols=Name,ContentSize,LastModifier,DateLastModified,MajorVersionNumber;dateOperator=GT,LT,EQ,LK;timeOperator=GT,LT,EQ,LK;integerOperator=GT,LT,EQ,LK;stringOperator=GT,LT,EQ,LK,CT;booleanOperator=EQ;objectOperator=EQ,LK;searchProperties=Name')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('repository.nexus.cm-hobbesvm12', 'type=cm;name=CM8.4.3-cm-hobbesvm12 - Root;serverName=cm-hobbesvm12;workspacesEnabled=false;directRetrieveEnabled=true;pageSize=50;maxResults=1000;useSSO=false')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('repository.nexus.GRNVM18', 'type=cm;name=CM Server GRNVM18;serverName=GRNVM18;workspacesEnabled=false;directRetrieveEnabled=false;pageSize=50;useSSO=false;rootFolderId=85 3 ICM7 grnvm187 NOINDEX59 26 A1001001A11E24B11931I0845318 A11E24B11931I084531 04 1000')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('repository.nexus.grnvm138bjo', 'type=cm;name=grnvm138 (CM - Brian''s Root);serverName=grnvm138;workspacesEnabled=false;directRetrieveEnabled=false;pageSize=50;useSSO=false;rootFolderId=82 3 ICM8 grnvm1383 Doc59 26 A1001001A11H30C10319J9027918 A11H30C10319J902791 14 1275')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('repository.nexus.bcctest', 'type=cm;name=bcctest;serverName=bcctest;workspacesEnabled=false;directRetrieveEnabled=true;pageSize=50;maxResults=1000;useSSO=false')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('repository.nexus.grnvm136', 'type=cm;name=grnvm136 (CM 8.4.3);serverName=grnvm136;workspacesEnabled=false;directRetrieveEnabled=true;pageSize=50;maxResults=1000;useSSO=false')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('repository.nexus.cmi254', 'type=cm;name=quickr (CM 8.4.1);serverName=cmi254;workspacesEnabled=true;directRetrieveEnabled=true;pageSize=50;maxResults=1000;useSSO=false')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('repository.nexus.grnvm138', 'type=cm;name=grnvm138 (CM 8.4.3);serverName=grnvm138;directRetrieveEnabled=true;workspacesEnabled=true;pageSize=50;maxResults=1000;useSSO=false')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('repository.nexus.terranovavm14', 'type=cm;name=cm-terranovavm14 (CM8 FVT);serverName=terranovavm14;directRetrieveEnabled=true;workspacesEnabled=false;pageSize=50;maxResults=1000;useSSO=false')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('repository.nexus.grnvm138Carolyn', 'type=cm;name=grnvm138  (CM - Carolyn''s Root);serverName=grnvm138;directRetrieveEnabled=true;workspacesEnabled=false;pageSize=50;maxResults=1000;useSSO=false;rootFolderId=106 3 ICM8 grnvm13826 CarolynHasOneReferenceAttr59 26 A1001001A11K04B23439D3771818 A11K04B23439D377181 14 1413')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('repository.nexus.grnvm119', 'type=cm;name=grnvm119  (Glen''s CM8.4.3);serverName=grnvm119;directRetrieveEnabled=false;workspacesEnabled=false;pageSize=50;maxResults=1000;useSSO=false')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('repository.nexus.cmi149', 'type=od;name=OD Server cmi149;serverName=cmi149.svl.ibm.com;pageSize=50;portNumber=1445')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('repository.nexus.grnvm139', 'type=od;name=grnvm139 (OD 8.5.0.1);serverName=grnvm139.svl.ibm.com;pageSize=50;portNumber=1445;traceLevel=4;tempDir=C:\\temp;traceDir=C:\\temp;afp2HtmlConfigFile=C:/Program Files/IBM/OnDemand Web Enablement Kit/afp2html.ini;afp2HtmlInstallDir=C:/Program Files/IBM/AFP2Web/afp2html;afp2PdfConfigFile=C:/Program Files/IBM/OnDemand Web Enablement Kit/afp2pdf.ini;afp2PdfInstallDir=C:/Program Files/IBM/AFP2Web/afp2pdf')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('repository.nexus.cm-hamptonvm15', 'type=od;name=cm-hamptonvm15 (OD 8.5.0.1);serverName=cm-hamptonvm15.usca.ibm.com;pageSize=50;portNumber=1445')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('repository.nexus.wang', 'type=od;name=wang (Greg''s OD);serverName=wang.svl.ibm.com;portNumber=1460')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('repository.nexus.FEDSEARCH', 'type=ci;name=Federated Search (CI);serverName=FEDSEARCH')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('repository.nexus.newportP8', 'name=newport (P8);type=p8;objectStore=QA1 DS ORA;protocol=FileNetP8WSI;serverName=http://cm-newportvm1ce.usca.ibm.com:9080/wsi/FNCEWS40MTOM;dateFormat=yyyy-MM-dd;timeFormat=HH.mm.ss;timestampFormat=yyyy-MM-dd''T''HH:mm:ss''Z''')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('repository.nexus.satulooriOS1', 'name=Satuloori - OS1 (P8);type=p8;objectStore=OS1;protocol=FileNetP8;serverName=iiop://satuloori.usca.ibm.com:2809/FileNet/Engine;workspacesEnabled=true;useSSO=true')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('repository.nexus.satulooriOS2', 'name=Satuloori - OS2 (P8);type=p8;objectStore=OS2;protocol=FileNetP8;serverName=iiop://satuloori.usca.ibm.com:2809/FileNet/Engine;workspacesEnabled=true;useSSO=true')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('repository.nexus.sridharOS1', 'name=Sridhar - OS1 (P8);type=p8;objectStore=OS1;protocol=FileNetP8;serverName=http://sridhar.usca.ibm.com:7001/wsi/FNCEWS40MTOM;workspacesEnabled=true;useSSO=false')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('repository.nexus.sridharOS2', 'name=Sridhar - OS2 (P8);type=p8;objectStore=OS2;protocol=FileNetP8;serverName=http://sridhar.usca.ibm.com:7001/wsi/FNCEWS40MTOM;workspacesEnabled=true;useSSO=false')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('repository.nexus.grnvm15cmtos', 'name=grnvm15 - CMTOS (P8);type=p8;objectStore=CMTOS;protocol=FileNetP8WSI;serverName=http://grnvm15.svl.ibm.com:9080/wsi/FNCEWS40MTOM;workspacesEnabled=true')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('repository.nexus.calvinvm1ce', 'folderNameProp=F;booleanOperator=EQ;timeOperator=GT,LT,EQ,LK;workspacesEnabled=false;type=p8;objectStore=CFS-IS Ntkl03;timeoutInSeconds=20;searchProperties=Name;serverName=http://cm-calvinvm1ce.usca.ibm.com:9080/wsi/FNCEWS40MTOM;folderDefCols=Name,ContentSize,LastModifier,DateLastModified,MajorVersionNumber;objectOperator=EQ,LK;stringOperator=GT,LT,EQ,LK,CT;protocol=FileNetP8WSI;docNameProp=ActiveMarkings;integerOperator=GT,LT,EQ,LK;searchDefCols=Name,ContentSize,LastModifier,DateLastModified,MajorVersionNumber;dateOperator=GT,LT,EQ,LK;searchMaxResults=100;connectionPoint=calvin3_1;name=Calvin - CFS-IS Ntkl03(P8)')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('repository.nexus.grnvm15cmdos', 'name=grnvm15 - CMDOS (P8);type=p8;objectStore=CMDOS;protocol=FileNetP8WSI;serverName=iiop://grnvm15.svl.ibm.com:2809/FileNet/Engine')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('repository.nexus.smdesktop1', 'name=smdesktop1 - quickr (P8);type=p8;objectStore=;protocol=FileNetP8WSI;serverName=http://smdesktop1.dyn.webahead.ibm.com:9081/wsi/FNCEWS40MTOM;workspacesEnabled=true')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('repository.nexus.puuwaiQA1FS', 'name=puuwai - QA1 FS(P8);type=p8;objectStore=QA1 FS;protocol=FileNetP8WSI;serverName=http://cm-puuwaivm1ce.usca.ibm.com:9080/wsi/FNCEWS40MTOM;connectionPoint=puuwai3_1')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('repository.nexus.puuwaiQA2DS', 'name=puuwai - QA2 DS(P8);type=p8;objectStore=QA2 DS;protocol=FileNetP8WSI;serverName=http://cm-puuwaivm1ce.usca.ibm.com:9080/wsi/FNCEWS40MTOM;connectionPoint=puuwai3_1')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('repository.nexus.calvinNexusDSSQL', 'name=calvin - Nexus DS SQL(P8);type=p8;objectStore=Nexus DS SQL;protocol=FileNetP8WSI;serverName=http://cm-calvinvm1ce.usca.ibm.com:9080/wsi/FNCEWS40MTOM/;connectionPoint=calvin3_1')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('repository.nexus.calvinNexusFSSQL', 'name=calvin - Nexus FS SQL(P8);type=p8;objectStore=Nexus FS SQL;protocol=FileNetP8WSI;serverName=http://cm-calvinvm1ce.usca.ibm.com:9080/wsi/FNCEWS40MTOM/;connectionPoint=calvin3_1')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('repository.nexus.calvinIER_OS1', 'name=calvin - IER_OS1 SQL(P8);type=p8;objectStore=IER_OS1;protocol=FileNetP8WSI;serverName=http://cm-calvinvm1ce.usca.ibm.com:9080/wsi/FNCEWS40MTOM/;connectionPoint=calvin3_1')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('repository.nexus.win11-FPOS', 'name=IER FPOS (p8);type=p8;objectStore=CE50_BASE_FPOS;protocol=FileNetP8WSI;serverName=http://cm-rm-win11.usca.ibm.com:9080/wsi/FNCEWS40MTOM;connectionPoint=')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('repository.nexus.win11-Classified', 'name=IER DOD_Classified (p8);type=p8;objectStore=IER_OS1;protocol=FileNetP8WSI;serverName=http://cm-rm-win11.usca.ibm.com:9080/wsi/FNCEWS40MTOM;connectionPoint=')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('repository.nexus.win11-ROS', 'name=IER ROS (p8);type=p8;objectStore=CE50_ROS;protocol=FileNetP8WSI;serverName=http://cm-rm-win11.usca.ibm.com:9080/wsi/FNCEWS40MTOM;connectionPoint=calvin3_1')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.default', 'items=ContentListToolbar,BannerToolbar,GlobalToolbar,ViewerToolbar,ItemContextMenu,FolderContextMenu,FolderWorkspaceContextMenu,InbasketToolbar,AttachmentToolbar,AddAttachmentContextMenu,WorkItemContextMenu,WorkItemContextMenuCM,ObjectStoreFolderContextMenu,FolderWorkspaceContextMenu,TeamspacesListToolbar,TemplatesListToolbar,TeamspaceContextMenu,TeamspaceTemplateContextMenu,FavoritesContextMenu,SearchContextMenu,RepositoryListToolbar')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.DefaultRepositoryListToolbar', 'items=')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.DefaultFavoritesContextMenu', 'id=FavoritesContextMenu;items=RenameFavorite,DeleteFavorite')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.DefaultWorkItemContextMenu', 'id=WorkItemContextMenu;items=ViewStep,MoveToInbox,EditWF,ContinueWF,ContinueWF,SuspendWF,ResumeWF,RemoveWF,View,Download,Edit,DefaultSendEmail,DefaultCheckOut,CheckIn')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.DefaultWorkItemContextMenuCM', 'id=WorkItemContextMenuCM;items=EditWF,ContinueWF,SuspendWF,ResumeWF,RemoveWF,View,Download,Edit,DefaultSendEmail,DefaultCheckOut,CheckIn')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.DefaultSearchContextMenu', 'id=SearchContextMenu;items=OpenSearch,AddToFavorites')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.DefaultObjectStoreFolderContextMenu', 'id=ObjectStoreFolderContextMenu;items=ImportUsingTemplate,CreateFolder,CreateFolderUsingTemplate')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.DefaultFolderWorkspaceContextMenu', 'id=FolderWorkspaceContextMenu;items=CreateFolder,DeleteItem,Edit')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.DefaultTeamspacesListToolbar', 'id=TeamspacesListToolbar;items=CreateTeamSpace,CreateTemplate')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.DefaultTemplatesListToolbar', 'id=TemplatesListToolbar;items=CreateTemplate')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.DefaultTeamspaceContextMenu', 'id=TeamspaceContextMenu;items=DeleteWorkspace,EditWorkspace')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.DefaultTeamspaceTemplateContextMenu', 'id=TeamspaceTemplateContextMenu;items=DeleteWorkspace,EditWorkspace,DisableWorkspace,EnableWorkspace,WorkspaceProperties')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.DefaultInbasketToolbar', 'id=InbasketToolbar;items=RefreshInbasket,Separator,ViewStep,MoveToInbox,EditWF,ContinueWF,SuspendWF,ResumeWF,RemoveWF')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.DefaultAttachmentToolbar', 'id=AttachmentToolbar;items=Separator')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.DefaultSearchTemplateContextMenu', 'id=SearchTemplateContextMenu;items=DeleteSearchTemplate,Edit')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.DefaultAddAttachmentContextMenu', 'id=AddAttachmentContextMenu;items=AddExistingAttachment,AddDocumentAttachment,AddFolderAttachment')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.Preview', 'pluginId=;id=Preview;widgetFunction=;widgetType=;multiDoc=true;serverTypes=;listTypes=;global=false;privilegeName=privViewDoc')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.DeleteSearchTemplate', 'pluginId=;id=DeleteSearchTemplate;widgetFunction=;widgetType=;multiDoc=false;serverTypes=cm,p8;listTypes=;global=false;privilegeName=privDelete')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.OpenSearch', 'pluginId=;id=OpenSearch;widgetFunction=;widgetType=;multiDoc=false;serverTypes=;listTypes=;global=true;privilegeName=')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.OpenFolder', 'pluginId=;id=OpenFolder;widgetFunction=;widgetType=;multiDoc=false;serverTypes=;listTypes=;global=true;privilegeName=')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.CreateTeamSpace', 'pluginId=;id=CreateTeamSpace;widgetFunction=;widgetType=;multiDoc=false;serverTypes=;listTypes=;global=true;privilegeName=')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.CreateTemplate', 'pluginId=;id=CreateTemplate;widgetFunction=;widgetType=;multiDoc=false;serverTypes=;listTypes=;global=true;privilegeName=')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.RefreshInbasket', 'pluginId=;id=RefreshInbasket;widgetFunction=;widgetType=;multiDoc=true;serverTypes=p8,cm;listTypes=;global=true;privilegeName=privRefreshInbasket')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.ViewStep', 'pluginId=;id=ViewStep;widgetFunction=;widgetType=;multiDoc=false;serverTypes=p8,cmis;listTypes=;global=false;privilegeName=')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.MoveToInbox', 'pluginId=;id=MoveToInbox;widgetFunction=;widgetType=;multiDoc=false;serverTypes=p8;listTypes=;global=false;privilegeName=')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.AddExistingAttachment', 'pluginId=;id=AddExistingAttachment;widgetFunction=;widgetType=;multiDoc=false;serverTypes=p8;listTypes=;global=true;privilegeName=')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.AddDocumentAttachment', 'pluginId=;id=AddDocumentAttachment;widgetFunction=;widgetType=;multiDoc=false;serverTypes=p8;listTypes=;global=true;privilegeName=')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.AddFolderAttachment', 'pluginId=;id=AddFolderAttachment;widgetFunction=;widgetType=;multiDoc=false;serverTypes=p8;listTypes=;global=true;privilegeName=')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.Launch', 'pluginId=;id=Launch;widgetFunction=;widgetType=;multiDoc=false;serverTypes=p8,cmis;listTypes=;global=false;privilegeName=')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.DefaultContentListToolbar', 'id=ContentListToolbar;items=RefreshGrid,Separator,Import,CreateFolder,CheckIn,CheckOutLabelWithDownload,Edit')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.RefreshGrid', 'pluginId=;id=RefreshGrid;widgetFunction=;widgetType=;multiDoc=true;serverTypes=;listTypes=;global=true;privilegeName=privNoCheck')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.Separator', 'pluginId=;id=Separator;widgetFunction=;widgetType=;multiDoc=false;serverTypes=;listTypes=;global=false;privilegeName=privNoCheck')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.CreateFolder', 'pluginId=;id=CreateFolder;widgetFunction=;widgetType=;multiDoc=true;serverTypes=cm,p8,cmis;listTypes=;global=true;privilegeName=privAddItem')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.CreateFolderUsingTemplate', 'pluginId=;id=CreateFolderUsingTemplate;widgetFunction=;widgetType=;multiDoc=true;serverTypes=p8,cmis;listTypes=;global=true;privilegeName=addItem')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.CheckIn', 'pluginId=;id=CheckIn;widgetFunction=;widgetType=;multiDoc=false;serverTypes=cm,p8,cmis;listTypes=;global=false;privilegeName=privCheckInOutDoc,privEditDoc')
 
db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.Edit', 'pluginId=;id=Edit;widgetFunction=;widgetType=;multiDoc=false;serverTypes=cm,od,p8,cmis;listTypes=;global=false;privilegeName=')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.DefaultBannerToolbar', 'id=BannerToolbar;items=Help,About,ChangePassword,LogOut')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.Help', 'pluginId=;id=Help;widgetFunction=;widgetType=;multiDoc=false;serverTypes=;listTypes=;global=false;privilegeName=')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.About', 'pluginId=;id=About;widgetFunction=;widgetType=;multiDoc=false;serverTypes=;listTypes=;global=false;privilegeName=')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.ChangePassword', 'pluginId=;id=ChangePassword;widgetFunction=;widgetType=;multiDoc=true;serverTypes=cm,od;listTypes=;global=true;privilegeName=privChangePassword')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.LogOut', 'pluginId=;id=LogOut;widgetFunction=;widgetType=;multiDoc=false;serverTypes=;listTypes=;global=false;privilegeName=')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.DefaultGlobalToolbar', 'id=GlobalToolbar;items=Import,CreateFolder,Undo,Redo,CreateHold')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.Import', 'pluginId=;id=Import;widgetFunction=;widgetType=;multiDoc=true;serverTypes=cm,p8,cmis;listTypes=;global=true;privilegeName=privAddDoc')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.ImportUsingTemplate', 'pluginId=;id=ImportUsingTemplate;widgetFunction=;widgetType=;multiDoc=true;serverTypes=p8,cmis;listTypes=;global=true;privilegeName=addDoc')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.Undo', 'pluginId=;id=Undo;widgetFunction=;widgetType=;multiDoc=true;serverTypes=cm,p8;listTypes=;global=true;privilegeName=')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.Redo', 'pluginId=;id=Redo;widgetFunction=;widgetType=;multiDoc=true;serverTypes=cm,p8;listTypes=;global=true;privilegeName=')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.CreateHold', 'pluginId=;id=CreateHold;widgetFunction=;widgetType=;multiDoc=true;serverTypes=od;listTypes=;global=true;privilegeName=privCreateHold')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.DefaultViewerToolbar', 'id=ViewerToolbar;items=TabbedLayout,SplitHorizontalLayout,SplitVerticalLayout,ItemActions,PreviousInResults,NextInResults')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.TabbedLayout', 'pluginId=;id=TabbedLayout;widgetFunction=;widgetType=;multiDoc=true;serverTypes=;listTypes=;global=true;privilegeName=')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.SplitHorizontalLayout', 'pluginId=;id=SplitHorizontalLayout;widgetFunction=;widgetType=;multiDoc=true;serverTypes=;listTypes=;global=true;privilegeName=')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.SplitVerticalLayout', 'pluginId=;id=SplitVerticalLayout;widgetFunction=;widgetType=;multiDoc=true;serverTypes=;listTypes=;global=true;privilegeName=')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.ItemActions', 'pluginId=;id=ItemActions;widgetFunction=;widgetType=;multiDoc=true;serverTypes=;listTypes=;global=true;privilegeName=')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.PreviousInResults', 'pluginId=;id=PreviousInResults;widgetFunction=;widgetType=;multiDoc=true;serverTypes=;listTypes=;global=true;privilegeName=')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.NextInResults', 'pluginId=;id=NextInResults;widgetFunction=;widgetType=;multiDoc=true;serverTypes=;listTypes=;global=true;privilegeName=')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.DefaultItemContextMenu', 'id=ItemContextMenu;items=View,Preview,Download,DeleteItem,Edit,Separator,ViewAnnotation,DefaultHolds,PrintDoc,DefaultCheckOut,CheckIn,Unlock,EditDoc,Separator,DefaultSendEmail,Launch,StartWF,AddToFavorites,DefaultFolderActions,Separator,DefaultMoreActions')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.DefaultHolds', 'pluginId=;id=Holds;items=ApplyHold,RemoveHold;serverTypes=od;privilegeName=privHold')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.CheckOutDownload', 'pluginId=;id=CheckOutDownload;widgetFunction=;widgetType=;multiDoc=true;serverTypes=cm,p8,cmis;listTypes=;global=false;privilegeName=privCheckOutDoc,privExport')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.CheckOutLabelWithDownload', 'pluginId=;id=CheckOutLabelWithDownload;widgetFunction=;widgetType=;multiDoc=true;serverTypes=cm,p8,cmis;listTypes=;global=false;privilegeName=privCheckOutDoc,privExport')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.CheckOutNoDownload', 'pluginId=;id=CheckOutNoDownload;widgetFunction=;widgetType=;multiDoc=true;serverTypes=cm,p8,cmis;listTypes=;global=false;privilegeName=privCheckOutDoc,privExport')
  
db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.DefaultCheckOut', 'id=CheckOut;items=CheckOutDownload,CheckOutNoDownload;privilegeName=')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.DefaultSelectObjectToolbar', 'id=SelectObjectToolbar;items=RefreshGrid,Separator,Edit')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.DefaultMoreActions', 'id=MoreActions;serverTypes=cm,p8;items=DeleteVersions,DemoteVersion,ShowHyperlink;privilegeName=')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.DefaultFolderActions', 'id=FolderActions;items=AddToFolder,MoveDocumentToFolder,RemoveFromFolder;privilegeName=')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.DefaultSendEmail', 'id=SendEmail;items=SendLinksToDocs,SendAttachments;privilegeName=')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.MoveDocumentToFolder', 'pluginId=;id=MoveDocumentToFolder;widgetFunction=;widgetType=;multiDoc=false;serverTypes=cm,p8,cmis;listTypes=;global=false;privilegeName=privMoveToFolder')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.DemoteVersion', 'pluginId=;id=DemoteVersion;widgetFunction=;widgetType=;multiDoc=false;serverTypes=p8;listTypes=;global=false;privilegeName=')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.DeleteVersions', 'pluginId=;id=DeleteVersions;widgetFunction=;widgetType=;multiDoc=false;serverTypes=p8;listTypes=;global=false;privilegeName=')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.View', 'pluginId=;id=View;widgetFunction=;widgetType=;multiDoc=true;serverTypes=;listTypes=;global=false;privilegeName=privViewDoc')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.AddToFavorites', 'pluginId=;id=AddToFavorites;widgetFunction=;widgetType=;multiDoc=true;serverTypes=cm,p8,od,cmis;listTypes=;global=true;privilegeName=privAddDoc')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.RenameFavorite', 'pluginId=;id=RenameFavorite;widgetFunction=;widgetType=;multiDoc=false;serverTypes=cm,p8;listTypes=;global=true;privilegeName=privAddDoc')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.DeleteFavorite', 'pluginId=;id=DeleteFavorite;widgetFunction=;widgetType=;multiDoc=false;serverTypes=cm,p8;listTypes=;global=true;privilegeName=privAddDoc')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.AddToFolder', 'pluginId=;id=AddToFolder;widgetFunction=;widgetType=;multiDoc=true;serverTypes=cm,p8,cmis;listTypes=;global=false;privilegeName=privAddToFolder')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.DeleteItem', 'pluginId=;id=DeleteItem;widgetFunction=;widgetType=;multiDoc=true;serverTypes=cm,p8,cmis;listTypes=;global=false;privilegeName=privDelete')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.Download', 'pluginId=;id=Download;widgetFunction=;widgetType=;multiDoc=true;serverTypes=;listTypes=;global=false;privilegeName=privExport')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.EditDoc', 'pluginId=;id=EditDoc;widgetFunction=;widgetType=;multiDoc=false;serverTypes=cm;listTypes=;global=false;privilegeName=privCheckInOutDoc,privCheckOutDoc,privEditDoc')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.PrintDoc', 'pluginId=;id=PrintDoc;widgetFunction=;widgetType=;multiDoc=true;serverTypes=od;listTypes=;global=false;privilegeName=privPrintDoc')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.RemoveFromFolder', 'pluginId=;id=RemoveFromFolder;widgetFunction=;widgetType=;multiDoc=false;serverTypes=cm,p8,cmis;listTypes=;global=false;privilegeName=')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.SendAttachments', 'pluginId=;id=SendAttachments;widgetFunction=;widgetType=;multiDoc=true;serverTypes=;listTypes=;global=false;privilegeName=privEmailDoc')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.SendLinksToDocs', 'pluginId=;id=SendLinksToDocs;widgetFunction=;widgetType=;multiDoc=true;serverTypes=;listTypes=;global=false;privilegeName=privEmailDoc')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.SendLinksToDocsEmail', 'pluginId=;id=SendLinksToDocsEmail;widgetFunction=;widgetType=;multiDoc=true;serverTypes=;listTypes=;global=false;privilegeName=privEmailDoc')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.ViewAnnotation', 'pluginId=;id=ViewAnnotation;widgetFunction=;widgetType=;multiDoc=false;serverTypes=od;listTypes=;global=false;privilegeName=privViewNotes')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.SamplePluginAction', 'pluginId=;id=SamplePluginAction;widgetFunction=;widgetType=;multiDoc=false;serverTypes=;listTypes=;global=false;privilegeName=')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.StartWF', 'pluginId=;id=StartWF;widgetFunction=;widgetType=;multiDoc=true;serverTypes=cm;listTypes=;global=false;privilegeName=privStartWorkflow')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.ResumeWF', 'pluginId=;id=ResumeWF;widgetFunction=;widgetType=;multiDoc=true;serverTypes=cm;listTypes=;global=false;privilegeName=privResumeWF')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.RemoveWF', 'pluginId=;id=RemoveWF;widgetFunction=;widgetType=;multiDoc=true;serverTypes=cm;listTypes=;global=false;privilegeName=privRemoveWF')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.ContinueWF', 'pluginId=;id=ContinueWF;widgetFunction=;widgetType=;multiDoc=true;serverTypes=cm;listTypes=;global=false;privilegeName=privContinueWF')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.EditWF', 'pluginId=;id=EditWF;widgetFunction=;widgetType=;multiDoc=true;serverTypes=cm;listTypes=;global=false;privilegeName=privEditWF')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.SuspendWF', 'pluginId=;id=SuspendWF;widgetFunction=;widgetType=;multiDoc=true;serverTypes=cm;listTypes=;global=false;privilegeName=privSuspendWF')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.Unlock', 'pluginId=;id=Unlock;widgetFunction=;widgetType=;multiDoc=true;serverTypes=cm,p8,cmis;listTypes=;global=false;privilegeName=privCheckInOutDoc')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.Lock', 'pluginId=;id=Lock;widgetFunction=;widgetType=;multiDoc=true;serverTypes=cm,p8,cmis;listTypes=;global=false;privilegeName=privCheckInOutDoc')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.ShowHyperlink', 'pluginId=;id=ShowHyperlink;widgetFunction=;widgetType=;multiDoc=false;serverTypes=cm,p8,cmis;listTypes=;global=false;privilegeName=')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.DefaultFolderContextMenu', 'id=FolderContextMenu;items=OpenFolder,DeleteItem,Edit,Separator,SendLinksToDocsEmail,Launch,StartWF,AddToFavorites,MoveFolderToFolder,Separator,CreateFolder,CreateFolderUsingTemplate,Import,ImportUsingTemplate,Separator,ShowHyperlink')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.MoveFolderToFolder', 'pluginId=;id=MoveFolderToFolder;widgetFunction=;widgetType=;multiDoc=false;serverTypes=cm,p8,cmis;listTypes=;global=false;privilegeName=privMoveToFolder')
 
db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.Properties', 'pluginId=;id=Properties;widgetFunction=;widgetType=;multiDoc=false;serverTypes=;listTypes=;global=false;privilegeName=')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.ServerPrint', 'pluginId=;id=ServerPrint;widgetFunction=;widgetType=;multiDoc=true;serverTypes=od;listTypes=;global=false;privilegeName=privPrintDoc')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.ApplyHold', 'pluginId=;id=ApplyHold;widgetFunction=;widgetType=;multiDoc=true;serverTypes=od;listTypes=;global=false;privilegeName=privHold')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.RemoveHold', 'pluginId=;id=RemoveHold;widgetFunction=;widgetType=;multiDoc=true;serverTypes=od;listTypes=;global=false;privilegeName=privHold')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.ViewRecordInfo', 'pluginId=;id=ViewRecordInfo;widgetFunction=;widgetType=;multiDoc=false;serverTypes=od;listTypes=;global=false;privilegeName=privNoCheck')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.DeleteWorkspace', 'pluginId=;id=DeleteWorkspace;widgetFunction=;widgetType=;multiDoc=false;serverTypes=;listTypes=;global=true;privilegeName=')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.EditWorkspace', 'pluginId=;id=EditWorkspace;widgetFunction=;widgetType=;multiDoc=false;serverTypes=;listTypes=;global=true;privilegeName=')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.DisableWorkspace', 'pluginId=;id=DisableWorkspace;widgetFunction=;widgetType=;multiDoc=false;serverTypes=;listTypes=;global=true;privilegeName=')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.EnableWorkspace', 'pluginId=;id=EnableWorkspace;widgetFunction=;widgetType=;multiDoc=false;serverTypes=;listTypes=;global=true;privilegeName=')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('menu.nexus.WorkspaceProperties', 'pluginId=;id=WorkspaceProperties;widgetFunction=;widgetType=;multiDoc=false;serverTypes=p8;listTypes=;global=true;privilegeName=')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('viewer.nexus.default', 'definitions=ajaxViewer,appletViewer,htmlConversion,pdfConversion,browser,afpPlugin,afp2html,afp2pdf,xenos,lineDataApplet,adobeReader,daejaViewer,streamingDaejaViewer;mappings=application/unknown.od,application/afp.od,application/line.od,text/plain.,application/msword.,application/pdf.cm,application/pdf.ci,application/pdf.od,image/tiff.cm,image/tiff.ci,image/tiff.od,image/tiff.cmis,image/tiff.p8,image/pjpeg.p8,image/jpg.p8,image/jpeg.p8,image/bmp.p8,image/gif.p8,application/pdf.p8,application/x-cold.p8,application/vnd_filenet_im-image.p8,application/vnd_filenet_im-cold.p8,application/vnd_filenet_im-form.p8,application/vnd_filenet_im-other.p8,image/png.p8,message/rfc822.p8,default.')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('viewerDef.nexus.ajaxViewer', 'viewerName=ajaxViewer;launchUrl=wcservices+"/viewers/thinViewer.jsp?docUrl="+encodeURIComponent(docUrl)+"&contentType="+mimeType+"&serverType="+serverType+privs')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('viewerDef.nexus.appletViewer', 'viewerName=appletViewer;launchUrl=wcservices+"/viewers/appletViewer.jsp?docUrl="+encodeURIComponent(docUrl)+"&docName="+encodeURIComponent(docName)+"&contentType="+mimeType+"&serverType="+serverType+"&propertiesFile="+wcservices+"/applets/WCViewerApplet_properties.jsp"+privs')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('viewerDef.nexus.htmlConversion', 'viewerName=htmlConversion;launchUrl=wcservices+"/convertDocument.do?docUrl="+encodeURIComponent(docUrl)+"&contentType="+mimeType+"&targetContentType=text/html&serverType="+serverType+privs')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('viewerDef.nexus.pdfConversion', 'viewerName=pdfConversion;launchUrl=wcservices+"/convertDocument.do?docUrl="+encodeURIComponent(docUrl)+"&contentType="+mimeType+"&targetContentType=application/pdf&serverType="+serverType+privs')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('viewerDef.nexus.browser', 'viewerName=browser;launchUrl=docUrl;launchInSeparateWindow=true')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('viewerDef.nexus.afpPlugin', 'viewerName=afpPlugin;launchUrl=wcservices+"/viewers/afpViewerPlugin.jsp?docUrl="+encodeURIComponent(docUrl)+"&contentType="+mimeType+"&serverType="+serverType+privs')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('viewerDef.nexus.afp2html', 'viewerName=afp2html;launchUrl=docUrl+"&wc_transform=html"')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('viewerDef.nexus.afp2pdf', 'viewerName=afp2pdf;launchUrl=docUrl+"&wc_transform=pdf"')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('viewerDef.nexus.xenos', 'viewerName=xenos;launchUrl=docUrl+"&wc_transform=xenos"')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('viewerDef.nexus.lineDataApplet', 'viewerName=lineDataApplet;launchUrl=docUrl+"&wc_transform=applet"')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('viewerDef.nexus.adobeReader', 'viewerName=adobeReader;launchUrl=wcservices+"/viewers/adobeReader.jsp?docUrl="+encodeURIComponent(docUrl)+"&contentType="+mimeType+"&serverType="+serverType+privs')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('viewerDef.nexus.daejaViewer', 'viewerName=daejaViewer;launchUrl=wcservices+"/viewers/daejaViewer.jsp?docUrl="+encodeURIComponent(docUrl)+"&docName="+encodeURIComponent(docName)+"&contentType="+mimeType+"&serverType="+serverType+privs')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('viewerDef.nexus.streamingDaejaViewer', 'viewerName=streamingDaejaViewer;launchUrl=wcservices+"/viewers/daejaViewer.jsp?docUrl="+encodeURIComponent(docUrl)+"&streamer=true&docName="+encodeURIComponent(docName)+"&contentType="+mimeType+"&serverType="+serverType+privs')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('viewerMapping.nexus.application/unknown.od', 'contentType=application/unknown;itemType=;serverType=od;viewerName=xenos')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('viewerMapping.nexus.application/afp.od', 'contentType=application/afp;itemType=;serverType=od;viewerName=afpPlugin')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('viewerMapping.nexus.application/line.od', 'contentType=application/line;itemType=;serverType=od;viewerName=lineDataApplet')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('viewerMapping.nexus.text/plain.', 'contentType=text/plain;itemType=;serverType=;viewerName=browser')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('viewerMapping.nexus.application/msword.', 'contentType=application/msword;itemType=;serverType=;viewerName=browser')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('viewerMapping.nexus.application/pdf.cm', 'contentType=application/pdf;itemType=;serverType=cm;viewerName=adobeReader')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('viewerMapping.nexus.application/pdf.ci', 'contentType=application/pdf;itemType=;serverType=ci;viewerName=adobeReader')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('viewerMapping.nexus.application/pdf.od', 'contentType=application/pdf;itemType=;serverType=od;viewerName=adobeReader')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('viewerMapping.nexus.application/pdf.cmis', 'contentType=application/pdf;itemType=;serverType=cmis;viewerName=adobeReader')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('viewerMapping.nexus.image/tiff.cm', 'contentType=image/tiff;itemType=;serverType=cm;viewerName=appletViewer')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('viewerMapping.nexus.image/tiff.ci', 'contentType=image/tiff;itemType=;serverType=ci;viewerName=appletViewer')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('viewerMapping.nexus.image/tiff.od', 'contentType=image/tiff;itemType=;serverType=od;viewerName=appletViewer')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('viewerMapping.nexus.image/tiff.cmis', 'contentType=image/tiff;itemType=;serverType=cmis;viewerName=appletViewer')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('viewerMapping.nexus.image/tiff.p8', 'contentType=image/tiff;itemType=;serverType=p8;viewerName=streamingDaejaViewer')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('viewerMapping.nexus.image/pjpeg.p8', 'contentType=image/pjpeg;itemType=;serverType=p8;viewerName=daejaViewer')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('viewerMapping.nexus.image/jpg.p8', 'contentType=image/jpg;itemType=;serverType=p8;viewerName=daejaViewer')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('viewerMapping.nexus.image/jpeg.p8', 'contentType=image/jpeg;itemType=;serverType=p8;viewerName=daejaViewer')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('viewerMapping.nexus.image/bmp.p8', 'contentType=image/bmp;itemType=;serverType=p8;viewerName=daejaViewer')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('viewerMapping.nexus.image/gif.p8', 'contentType=image/gif;itemType=;serverType=p8;viewerName=daejaViewer')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('viewerMapping.nexus.application/pdf.p8', 'contentType=application/pdf;itemType=;serverType=p8;viewerName=streamingDaejaViewer')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('viewerMapping.nexus.application/x-cold.p8', 'contentType=application/x-cold;itemType=;serverType=p8;viewerName=daejaViewer')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('viewerMapping.nexus.application/vnd_filenet_im-image.p8', 'contentType=application/vnd.filenet.im-image;itemType=;serverType=p8;viewerName=daejaViewer')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('viewerMapping.nexus.application/vnd_filenet_im-cold.p8', 'contentType=application/vnd.filenet.im-cold;itemType=;serverType=p8;viewerName=daejaViewer')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('viewerMapping.nexus.application/vnd_filenet_im-form.p8', 'contentType=application/vnd.filenet.im-form;itemType=;serverType=p8;viewerName=daejaViewer')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('viewerMapping.nexus.application/vnd_filenet_im-other.p8', 'contentType=application/vnd.filenet.im-other;itemType=;serverType=p8;viewerName=daejaViewer')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('viewerMapping.nexus.image/png.p8', 'contentType=image/png;itemType=;serverType=p8;viewerName=daejaViewer')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('viewerMapping.nexus.message/rfc822.p8', 'contentType=message/rfc822;itemType=;serverType=p8;viewerName=daejaViewer')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('viewerMapping.nexus.default.p8', 'contentType=;itemType=;serverType=p8;viewerName=browser')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('viewerMapping.nexus.default.cmis', 'contentType=;itemType=;serverType=cmis;viewerName=browser')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('viewerMapping.nexus.default.', 'contentType=;itemType=;serverType=;viewerName=appletViewer')

db2 -v INSERT INTO "CONFIGURATION" VALUES ('admin.nexus.default', 'folderDefFixedCols=Name;dateOperator=GT,LT,EQ,LK;timeOperator=GT,LT,EQ,LK;integerOperator=GT,LT,EQ,LK;stringOperator=GT,LT,EQ,LK,CT;booleanOperator=EQ;objectOperator=EQ,LK')

db2 -v CONNECT RESET
