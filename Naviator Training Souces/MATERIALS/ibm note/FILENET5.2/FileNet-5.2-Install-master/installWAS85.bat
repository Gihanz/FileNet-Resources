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
echo Start installWAS85.bat
time /t

set ScriptsDir=%1
set DirToDecompressTo=%2
set P8DownloadDirectory=%3

set ScriptsDir=%ScriptsDir:~1,-1%
set P8DownloadDirectory=%P8DownloadDirectory:~1,-1%
set DirToDecompressTo=%DirToDecompressTo:~1,-1%

call "%ScriptsDir%\setDirs.bat"

echo Installing IBM WebSphere Application Server 8.5 ...

pushd "C:\Program Files (x86)\IBM\Installation Manager\eclipse\tools"
set INSTALLER-NAME=imcl.exe

if not exist %INSTALLER-NAME% goto EXIT_ERROR
call %INSTALLER-NAME% -input "%ScriptsDir%\was85_install_windows.xml" -log "%ScriptsDir%\was8_install.log" -acceptLicense
popd

echo Done installing WAS8...begin profile creation , admin security 
pushd "C:\Program Files\IBM\WebSphere\AppServer\bin"

copy "%ScriptsDir%\was85profile_response.txt" "C:\Program Files\IBM\WebSphere\AppServer\bin"

set MANAGE-PROFILES=manageprofiles.bat 
call %MANAGE-PROFILES% -response was85profile_response.txt

popd

echo Done  profile creation , admin security , check "C:\Program Files\IBM\WebSphere\AppServer\profiles\AppSrv01\logs\AboutThisProfile.txt"


time /t
:EXIT_OK
echo IBM WebSphere Application Server 8.5 installed ...exiting installWAS85.bat
echo ====================
exit 0

:EXIT_ERROR
echo %INSTALLER-NAME% not found!
echo ====================
exit -1
