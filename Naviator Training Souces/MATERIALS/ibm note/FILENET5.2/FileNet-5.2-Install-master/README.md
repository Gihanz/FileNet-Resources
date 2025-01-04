FileNet-5.2-Install
===================

This is my instruction &amp; contribution to ppl that have to install IBM's FileNet 5.2 P8 Solution as a Single Server. IBM charges to install this software so this should save you some $$$.

***Before You Begin*** 
In order to use these instructions you will need the "Legal" installtation files from IBM.  This instruction is to help paying customers since the current FileNet install sucks ass.

###Instructions##
1. Log into the suck ass IBM FileNet Site
2. Download the Required List of Files for FileNet. The IBM Download Site is a bit of a mess so you will have to to hunt down all the required install packages. Use the search feature to find all the packages.
3. Rename the downloaded required files to match the instructions in the CPIT\cpit.properties file for example
    *IBM Tivoli Directory Server 6.3 = tds.zip*
4. Extract DB2
5. Extract the License File
6. copy the DB2 License File  into the uncompressed DB2 License folder
    
    *License File =  ese_o\db2\license\db2ese_o.lic*

7. Run the DB installer & Select the defaults except for Default Install Path
***Note:***  This next Steps is important. Install DB2 to this exact folder.
> C:\Program Files\IBM\tdsV6.3db2
8. After DB2 install reboot the server
9. git clone this rep to get the ***install-scripts*** folder
10. Copy the ***install-scripts*** folder to Extract install-scripts.zip
11. extract the `CPIT_5.2_WINDOWS_2008_EN .zip` file you downloaded from the IBM site
12. Delete the install-scripts folder in the `CPIT_5.2_WINDOWS_2008_EN` directory
13. Paste the ***install-scripts*** folder from this repo into the `CPIT_5.2_WINDOWS_2008_EN` directory
14. Run the `5.2.0-CPIT-WIN.EXE` installer and select the defaults
***Note:*** The installer will ask you to type a password. Leave this ***Blank & Accept the Defaults***
15. If `Step 23` of the install fails you must Raise the JVM HeapSize to ***1024*** in the WebSphere Service. Use these links as a reference:
    [How To Increase WebSphere JVM Memory](http://www.mkyong.com/websphere/how-to-increase-websphere-jvm-memory/)
    Change the following parameters to the following values:
    - Initial heap size: `512 MB`
    - Maximum heap size: `1024 MB`
    
    Now copy the `cpit.properties` file in the C:\Program Files (x86)\ibm\cpit\install-scripts folder and replace the `cpit.properties` file in your `CPIT_5.2_WINDOWS_2008_EN` installation directory.  This will enable your install process to start from the incomplete Step.
    
16. If you get a failure at `Step 26` it  probably means you need to Export the LTPA Keys to C:\ltpakeys.txt - Use these directions to [Export LTPA Keys](http://bit.ly/1og9ulx) and run the `CPIT Installer` again

###Notes:###
- Let the installer run and hopefully you will have a functioning FileNet Composite Server
- These instructions will probably be dynamic so feel free to edit and send pull requests.

enjoy
