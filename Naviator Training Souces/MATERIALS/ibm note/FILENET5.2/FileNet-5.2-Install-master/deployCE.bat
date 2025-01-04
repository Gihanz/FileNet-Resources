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
echo Deploying IBM FileNet Content Engine ...
time /t

set ScriptsDir=%1
set DirToDecompressTo=%2
set P8DownloadDirectory=%3

set ScriptsDir=%ScriptsDir:~1,-1%
set P8DownloadDirectory=%P8DownloadDirectory:~1,-1%
set DirToDecompressTo=%DirToDecompressTo:~1,-1%

call "%ScriptsDir%\setDirs.bat" 

pushd "%PBSTargetDrive%%PBSTargetRootDir%\%P8CETargetDirName%\tools\configure"
set INSTALLER-NAME=configmgr_cl.exe

if not exist %INSTALLER-NAME% goto EXIT_ERROR

call %INSTALLER-NAME% execute -task DeployApplication -profile "%ScriptsDir%\profiles\CEDeploy" -allownonce -silent -force
popd

set PROFILES-PATH=%ScriptsDir%\profiles\CEDeploy\status
set STATUS-FILENAME=deployapplication.ok
if not exist "%PROFILES-PATH%\%STATUS-FILENAME%" (
	echo ERROR - deployTDS.bat failed.  Refer to "%PROFILES-PATH%" for more details
	exit -1
)

time /t
:EXIT_OK
echo End deployCE.bat
echo ====================
exit 0

:EXIT_ERROR
echo %INSTALLER-NAME% not found!
echo ====================
exit -1
