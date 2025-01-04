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
echo Begin configP8DB2.bat
echo Preparing DB2 administration rights for Content Engine GCD, Object Store, and Process Engine ...
call net localgroup DB2ADMNS gcddbuser osdbuser f_sw f_maint P8Admin /add
time /t

set ScriptsDir=%1
set DirToDecompressTo=%2
set P8DownloadDirectory=%3

set ScriptsDir=%ScriptsDir:~1,-1%
set P8DownloadDirectory=%P8DownloadDirectory:~1,-1%
set DirToDecompressTo=%DirToDecompressTo:~1,-1%

call "%ScriptsDir%\setDirs.bat"


pushd "%PBSTargetDrive%%PBSTargetRootDir%\%DB2TargetDirName%\bin"
copy "%ScriptsDir%\P8DB2commands.bat" "%PBSTargetDrive%\"
set INSTALLER-NAME=db2cmd.exe

if not exist %INSTALLER-NAME% (
	echo ERROR:  %INSTALLER-NAME% not found!
	goto EXIT_ERROR
)

call %INSTALLER-NAME% -c -w -i "%PBSTargetDrive%\P8DB2commands.bat"
del "%PBSTargetDrive%\P8DB2commands.bat"
popd

rem if not exist "C:\DB2TDS63\NODE0000\GCD_DB" (
rem 	echo ERROR:  The P8 Database was not created.
rem 	goto EXIT_ERROR
rem )

time /t
:EXIT_OK
echo End configP8DB2.bat
echo ====================
exit 0

:EXIT_ERROR
echo End configP8DB2.bat
echo ====================
exit -1
