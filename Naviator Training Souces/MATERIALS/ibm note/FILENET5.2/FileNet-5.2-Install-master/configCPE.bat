@echo off
rem Platform Installation Tool, 
rem © Copyright IBM Corp. 2010
rem Invoking script will have 4 parameters
rem parameter 1 = installerScriptFolder - Script folder
rem parameter 2 = decompressedFolder    - Destination folder to decompress files to
rem parameter 3 = p8DownloadFolder      - Source folder of the compressed files
rem parameter 4 = 32 or 64              - Bitness of the OS 64 or 32 

echo Start configCE.bat

set ScriptsDir=%1
set DirToDecompressTo=%2
set P8DownloadDirectory=%3

set ScriptsDir=%ScriptsDir:~1,-1%
set P8DownloadDirectory=%P8DownloadDirectory:~1,-1%

call "%ScriptsDir%\setDirs.bat" 

echo Configuring IBM FileNet Content Engine ...
echo --------------------

pushd "%PBSTargetDrive%%PBSTargetRootDir%\%P8CETargetDirName%\tools\configure"
call configmgr_cl execute -profile "%ScriptsDir%\profiles\CEConfig"
popd

echo --------------------
echo IBM FileNet Content Engine configured
time /t
echo ====================

