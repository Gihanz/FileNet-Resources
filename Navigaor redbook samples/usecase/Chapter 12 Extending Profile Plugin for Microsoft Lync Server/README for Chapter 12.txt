IBM Redbooks publication
Customizing and Extending IBM Content Navigator, SG24-8055

Sample code and resources for
Chapter 12 "Extending Profile Plugin for Microsoft Lync Server"


Directory Content 
===================

1) ProfilePluginSrc.zip 
   Contains all the source code for the chapter.
   The code extends the profile plugin in IBM Content Navigator 2.0.2 to 
   provide functionality for working with Microsoft Lync Server.


Installation
===================
 
The projects are developed during the writing of the corresponding chapter.
You can follow the steps within the chapter to use the source code.

If you don't want to follow the steps within the chapter, 
or you want to use the sample code as a reference, 
you can use the following procedure.

Installation and setup of the Lync Plugin

1) Lync plugin
   To install and set up the Lync plugin:
        1. Unzip the plugin to C:\IBM\ECMClient\plugins and create the following 
           accounts on your Microsoft LDAP directory:
           - amy
           - fernando
           - sarah
        2. Login to IBM Content Navigator as each individual user above, and create 
           a folder with each account.
        3. Make sure your IBM Content Navigator server can access the Microsoft Lync 
           Sandbox. Otherwise you may see a ConnectionTimeout exception.
        4. Login to Microsoft Lync Sandbox using your Microsoft Live account:
           https://ucwa.lync.com/login
        5. Proceed with the Interactive demo. Be sure to click Start Subscription, 
           enter message and change online status of Amy and Fernando.
        6. Click on the button of "My oAuth Tokens" and copy the first token value.
        7. From IBM Content Navigator admin desktop, remove the Profile plugin if it 
           already exists. Create a New Plugin. 
           Enter the following parameters
                Class file path: C:\IBM\ECMClient\plugins\ProfilePlugin
                Class name: com.ibm.ecm.extension.profile.ProfilePlugin
        8. Select the radio button next to Class file path. Click Load. 
           Enter the following two configuration parameters:
                Microsoft Lync Service URL:
                     https://ocsrp.gotuc.net/ucwa/oauth/v1/applications/
                oAuth token: (value from Microsoft Lync sandbox)
        9. Click Save and Close.
        10.Refresh the IBM Content Navigator page. Go to Browse feature. Mouse over the 
           user names next to the folder names that you created earlier. 

When logging in to Microsoft Live website, if you see an error message of 
"Sorry! We are having issues logging in right now. Please try again later." 
That means the sandbox website is not functioning. This is likely due to too 
many users or sessions. You need to try again later to obtain the oAuth token.

If you run into the SSL certificate exception, you need to run the logic in 
com.ibm.ecm.extension.lync.util.trustAllSSL method.

For more information, refer to corresponding chapter in the book. 