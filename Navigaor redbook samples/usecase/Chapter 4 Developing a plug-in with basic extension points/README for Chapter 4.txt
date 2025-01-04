IBM Redbooks publication
Customizing and Extending IBM Content Navigator, SG24-8055

Sample code and resources for
Chapter 4 "Developing a plug-in with basic extension points"


Directory Content 
===================

1) Chap4-SimpleDossierManagement.zip
   Eclipse Project of Chapter 4

2) exportP8.zip
   Export Manifest for FileNet P8 5.2


Installation
==================

The projects are developed during the writing of the corresponding chapter.
You can follow the steps within the chapter to use the source code.

If you don't want to follow the steps within the chapter, 
or you want to use the sample code as a reference, 
you can import the projects in your workspace.

1) Chap4-SimpleDossierManagement.zip
   a) Import the projects using the following steps:
	1 Open the Eclipse Environment.
	2 Select Import--> Select Existing Projects into Workspace.
	3 Select archive file and choose the zip you want to import.
	4 Click Finish.
   b) Copy missing libraries to lib folder:
	- Jace.jar for FileNet P8 repository
	- cmbicmsdk81.jar for Content Manager repository
	- JSON4J.jar and navigatorAPI.jar from your IBM Content Navigator installation
   c) Solve all build path issues:
	1 Select the imported project in the package explorer.
	2 Open context menue and select Properties.
	3 From the Project Properties Dialog, select "Java Build Path".
	4 Go to tab "Libries".
	5 Solve all library issues, indicated by a red cross.
	
2) Prepare P8:
   Import exportP8.zip with FileNet Enterprise Manager. 
   This will install the folder class and folders that are necessary for the sample code of Chapter 4.
        1 Unzip exportP8.zip
        2 Log in FileNet Enterprise Manager as ObjectStore Administrator.
        3 Select an ObjectStore, open the context menu and select "Import all" from the submenu of "All Tasks".
   	4 As Import Manifest File browse and select "DossierSampleV1_CEExport_Manifest.xml".
        5 Keep default settings and klick on import button.
