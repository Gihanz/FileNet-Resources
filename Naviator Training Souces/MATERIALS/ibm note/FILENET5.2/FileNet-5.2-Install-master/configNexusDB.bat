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
echo Begin configNexusDB2.bat
echo Preparing DB2 administration rights for IBM Content Navigator DB
call net localgroup DB2ADMNS nexusdbuser /add
time /t

set ScriptsDir=%1
set DirToDecompressTo=%2
set P8DownloadDirectory=%3

set ScriptsDir=%ScriptsDir:~1,-1%
set P8DownloadDirectory=%P8DownloadDirectory:~1,-1%
set DirToDecompressTo=%DirToDecompressTo:~1,-1%

call "%ScriptsDir%\setDirs.bat"


pushd "%PBSTargetDrive%%PBSTargetRootDir%\%DB2TargetDirName%\bin"

copy "%ScriptsDir%\createNexusDB.bat" "%PBSTargetDrive%\"


set INSTALLER-NAME=db2cmd.exe

if not exist %INSTALLER-NAME% (
	echo ERROR:  %INSTALLER-NAME% not found!
	goto EXIT_ERROR
)

call %INSTALLER-NAME% -c -w -i "%PBSTargetDrive%\createNexusDB.bat"

set db2clp=1

db2 connect to nexusdb

db2 -tvsf "%ScriptsDir%\DB2_ONE_SCRIPT.sql"

del "%PBSTargetDrive%\createNexusDB.bat"

popd

if not exist "C:\NEXUSDB2\NEXUSDB" (
	echo ERROR:  The NEXUS Database was not created.
	goto EXIT_ERROR
)

time /t
:EXIT_OK
echo End configNexusDB2.bat
echo SUCCESS: The NEXUSDB database was created successfully
echo ====================
exit 0

:EXIT_ERROR
echo End configNexusDB2.bat
echo ====================
exit -1
