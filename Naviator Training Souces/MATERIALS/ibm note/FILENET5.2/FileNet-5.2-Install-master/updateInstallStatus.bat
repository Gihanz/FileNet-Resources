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

echo ====================
time /t
echo Update Status from %1 to %2

set old_Status=%1
set new_Status=%2
set Properties_File=%3
set ScriptsDir=%4

set ScriptsDir=%ScriptsDir:~1,-1%

call "%ScriptsDir%\setDirs.bat" 

pushd "%ScriptsDir%"
cscript //nologo "SearchReplace.vbs" %Properties_File% "%old_Status%" "%new_Status%" 
popd

echo Done updateInstallStatus
time /t
echo ====================
