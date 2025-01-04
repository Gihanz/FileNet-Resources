IBM Redbooks publication
Customizing and Extending IBM Content Navigator, SG24-8055

Sample code and resources for
Chapter 11 "Extending solutions to mobile platform"


Directory Content 
===================

1) mobileSampleDiff.zip 
   Changes to eclipse project containing all code modifications of the mobile sample in the chapter.
   This sample is customized to provide Work feature that can list workitems from first 
   available worklist. 


Installation
===================

The project is developed during the writing of the corresponding chapter.
You can follow the steps within the chapter to use the source code.  

If you don't want to follow the steps within the chapter, 
or you want to use the sample code as a reference, 
you can import the project in your workspace. Following procedure will 
replace certain existing files from sample and thus you need to use sample 
from ICN 2.0.2 FP1 installation media to preserve compatibility.

1) Extend mobile sample from installation media
        1. Locate SampleMobileApp.zip and extract it.
        2. Copy content of mobileSampleDiff.zip to extracted location. 
           The folder structure must match.
        3. Compress the SampleMobileApp folder as SampleMobileApp.zip.

2) You can import this project to your eclipse environment (containing Worklight 6 Plugins):
	1. Open the Eclipse Environment.
	2. Select Import--> Select Existing Projects into Workspace.
	3. Select archive file and choose the zip you want to import.
	4. Click Finish.
	

You can modify common.js to your endpoint, username and password. See sample documentation 
(also referenced in the book) for more details.
 
-------------------------------------------------------------------------------------------
 
Important files
===================

The following are important files:
- WorkView.html representing view
- WorkViewController.js providing controller for this view 
- MILayer.js for communication with ICN
- Bin folder containing build.xml you can use to generate ICN mobile sample plugin file.

Note, for tests using Java applet in web browser, you need to start browser in unsafe mode 
to ignore violation of same origin policy. Refer to browser documentation for more details 
about same origin policy checks.
 
For more details, read the corresponding chapter in the book.