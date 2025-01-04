@echo off

rem Licensed Materials - Property of IBM
rem 5725A15, 5724R81
rem (c) Copyright IBM Corp. 2010, 2011  All Rights Reserved.
rem US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
rem
rem parameter 1 = installerScriptFolder - Script folder
rem parameter 2 = decompressedFolder    - Destination folder to decompress files to
rem parameter 3 = p8DownloadFolder      - Source folder of the IBM software packages
rem parameter 4 = 32 or 64              - Bitness of the OS 64 or 32 (optional)

call net user gcddbuser IBMFileNetP8 /add /FULLNAME:"gcddbuser"
call net user osdbuser IBMFileNetP8 /add /FULLNAME:"osdbuser"
call net user nexusdbuser IBMFileNetP8 /add /FULLNAME:"nexusdbuser"

call net user f_sw IBMFileNetP8 /add /FULLNAME:"f_sw"
call net user f_maint IBMFileNetP8 /add /FULLNAME:"f_maint"
call net user P8Admin IBMFileNetP8 /add /FULLNAME:"P8Admin"
call net user fnsw IBMFileNetP8 /add /FULLNAME:"fnsw"

call net localgroup fnadmin /add
call net localgroup fnop /add
call net localgroup fnusr /add

call net localgroup DB2ADMNS gcddbuser osdbuser f_sw f_maint P8Admin /add
call net localgroup fnadmin fnsw /add
call net localgroup fnop fnsw /add
call net localgroup fnusr fnsw /add

call net localgroup Administrators fnsw P8Admin /add
