@echo off

rem Licensed Materials - Property of IBM
rem 5725A15, 5724R81
rem (c) Copyright IBM Corp. 2010, 2011  All Rights Reserved.
rem US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
rem

echo ====================
echo "Restoring IA Registry"
time /t

set ScriptsDir=%1
set DirToDecompressTo=%2
set P8DownloadDirectory=%3

set ScriptsDir=%ScriptsDir:~1,-1%
set P8DownloadDirectory=%P8DownloadDirectory:~1,-1%
set DirToDecompressTo=%DirToDecompressTo:~1,-1%

echo ScriptsDir "%ScriptsDir%"
echo DirToDecompressTo "%DirToDecompressTo%"
echo P8DownloadDirectory  "%P8DownloadDirectory%"

call "%ScriptsDir%\setDirs.bat" 

set OSbit=%4
if (%OSBit%)==() goto 64bitOS
if %OSbit%==32 goto 32bitOS

:64bitOS
set ProgramFilesDir=C:\Program Files (x86)
goto done

:32bitOS
set ProgramFilesDir=C:\Program Files
goto done

:done

echo Make a backup copy of the IA registry
copy /Y "%ProgramFilesDir%\Zero G Registry\.com.zerog.registry.xml" "%ScriptsDir%\.com.zerog.registry.bak" 

echo Copy the working copy to IA registry
copy /Y "%ScriptsDir%\.com.zerog.registry.xml" "%ProgramFilesDir%\Zero G Registry"

time /t
echo "Restoring IA Registry complete"
echo ====================