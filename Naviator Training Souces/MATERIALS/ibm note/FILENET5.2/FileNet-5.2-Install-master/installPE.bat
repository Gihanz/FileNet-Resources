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
echo Start installPE.bat
time /t

set ScriptsDir=%1
set DirToDecompressTo=%2
set P8DownloadDirectory=%3

set ScriptsDir=%ScriptsDir:~1,-1%
set P8DownloadDirectory=%P8DownloadDirectory:~1,-1%
set DirToDecompressTo=%DirToDecompressTo:~1,-1%

call "%ScriptsDir%\setDirs.bat" 

set P8PEInstallerFullPath="%DirToDecompressTo%\%P8PEDirName%"

echo Installing IBM FileNet Process Engine from %P8PEInstallerFullPath% ...

pushd "%P8PEInstallerFullPath%"
set INSTALLER-NAME=5.0.0-P8PE-WIN.EXE

if not exist %INSTALLER-NAME% goto EXIT_ERROR
call %INSTALLER-NAME% -f "%ScriptsDir%\installPE.txt"  -i silent
popd

time /t
:EXIT_OK
echo IBM FileNet Process Engine installation complete
echo ====================
exit 0

:EXIT_ERROR
echo %INSTALLER-NAME% not found!
echo ====================
exit -1
