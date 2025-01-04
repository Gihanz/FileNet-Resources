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
echo Begin configTDSDefInst.bat
time /t

set ScriptsDir=%1
set DirToDecompressTo=%2
set P8DownloadDirectory=%3

set ScriptsDir=%ScriptsDir:~1,-1%
set P8DownloadDirectory=%P8DownloadDirectory:~1,-1%
set DirToDecompressTo=%DirToDecompressTo:~1,-1%

call "%ScriptsDir%\setDirs.bat"

echo Creating IBM Tivoli Directory Server default instance (DSRDBM01, location %PBSTargetDrive%, dsrdbm01/password)
echo and configuring IBM Tivoli Directory Server administrator DN (cn=root/password)
echo --------------------
time /t

pushd "%PBSTargetDrive%%PBSTargetRootDir%\%TDS63TargetDirName%\idstools"
set INSTALLER-NAME=idsdefinst.bat

if not exist %INSTALLER-NAME% goto EXIT_ERROR
call %INSTALLER-NAME% -p IBMFileNetP8 -w IBMFileNetP8 -e encryptionseed
popd
echo --------------------

echo Adjusting Windows Services dependencies between Tivoli Directory Server (DSRDBM01) and DB2 ...
call regedit /s "%ScriptsDir%\DSRDBM01.reg"
echo --------------------

time /t
:EXIT_OK
echo End configTDSDefInst.bat
echo ====================
exit 0

:EXIT_ERROR
echo %INSTALLER-NAME% not found!
echo ====================
exit -1

