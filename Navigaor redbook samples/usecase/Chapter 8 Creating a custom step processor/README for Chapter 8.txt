IBM Redbooks publication
Customizing and Extending IBM Content Navigator, SG24-8055

Sample code and resources for
Chapter 8 "Creating a custom step processor"


Directory Content 
===================

1) Source for Custom Step Processor (directory)
   Contains 3 files needed for the Custom Step Processor as described in the 
   chapter.

2) StepProcessorActionPlugin (directory)
   Contains the IBM Content Navigator plugin that adds the action to use the
   embedded viewer created in the Custom Step Processor.

   At the top level in this directory are the project files needed to build 
   the plugin using Eclipse.  There is also a top level directory called src 
   that contains the source files needed for the plugin.

The sample code provided implements a Custom Step Processor that adds an 
embedded viewer to the step processor window.  This viewer can be used to view 
the attachments associated with the step. The Plugin code is used to add an action 
to Content Navigator that displays the selected attachment in this embedded viewer.

The chapter describes how to build and deploy both the Custom Step Processor code as 
well as the plugin.  It also contains information on configuring the added action so 
that it can be used by the Custom Step Processor.