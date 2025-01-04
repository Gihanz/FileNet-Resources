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
echo Begin installWAS70Updateinstaller.bat
time /t

set ScriptsDir=%1
set DirToDecompressTo=%2
set P8DownloadDirectory=%3

set ScriptsDir=%ScriptsDir:~1,-1%
set P8DownloadDirectory=%P8DownloadDirectory:~1,-1%
set DirToDecompressTo=%DirToDecompressTo:~1,-1%

call "%ScriptsDir%\setDirs.bat"

set OSbit=%4
if (%OSBit%)==() goto 64bitOS
if %OSbit%==32 goto 32bitOS

:64bitOS
set WAS70FixPackFileName=7.0.0-WS-WAS*WinX64-FP0000021.pak
goto done

:32bitOS
set WAS70FixPackFileName=7.0.0-WS-WAS*WinX32-FP0000021.pak
goto done

:done


set WASUpdateInstallerFullPath="%DirToDecompressTo%\%WASUpdateDirName%\UpdateInstaller"
echo Installing IBM WebSphere Application Server 7.0 Update Installer from %WASUpdateInstallerFullPath% ...
echo --------------------

echo Preparing ...
pushd "%WASUpdateInstallerFullPath%"
echo copy "%ScriptsDir%\installWAS70UpdateInstaller.txt" "%PBSTargetDrive%\"
copy "%ScriptsDir%\installWAS70UpdateInstaller.txt" "%PBSTargetDrive%\"
echo Installing ...
echo install -options "%PBSTargetDrive%\installWAS70UpdateInstaller.txt" -silent -is:javahome "%PBSTargetDrive%%PBSTargetRootDir%\%WASTargetDirName%\java"
set INSTALLER-NAME=install.exe

if not exist %INSTALLER-NAME% goto EXIT_ERROR
call %INSTALLER-NAME% -options "%PBSTargetDrive%\installWAS70UpdateInstaller.txt" -silent -is:javahome "%PBSTargetDrive%%PBSTargetRootDir%\%WASTargetDirName%\java"
del "%PBSTargetDrive%\installWAS70UpdateInstaller.txt"
popd

set WASUpdateInstallerTargetFullPath="C:\Program Files\IBM\WebSphere\UpdateInstaller\maintenance"
echo copy "%P8DownloadDirectory%\%WAS70FixPackFileName%" %WASUpdateInstallerTargetFullPath%
copy "%P8DownloadDirectory%\%WAS70FixPackFileName%" %WASUpdateInstallerTargetFullPath%

time /t
:EXIT_OK
echo End installWAS70UpdateInstaller.bat
echo ====================
exit 0

:EXIT_ERROR
echo %INSTALLER-NAME% not found!
echo ====================
exit -1
