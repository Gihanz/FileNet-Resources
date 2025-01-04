@echo off
rem Platform Installation Tool, 
rem © Copyright IBM Corp. 2010
rem Invoking script will have 4 parameters
rem parameter 1 = installerScriptFolder - Script folder
rem parameter 2 = decompressedFolder    - Destination folder to decompress files to
rem parameter 3 = p8DownloadFolder      - Source folder of the compressed files
rem parameter 4 = 32 or 64              - Bitness of the OS 64 or 32 

echo Start installNexus.bat
time /t

set ScriptsDir=%1
set DirToDecompressTo=%2
set P8DownloadDirectory=%3

set ScriptsDir=%ScriptsDir:~1,-1%
set P8DownloadDirectory=%P8DownloadDirectory:~1,-1%

call "%ScriptsDir%\setDirs.bat" 



set P8NexusInstallerFullPath=%DirToDecompressTo%\%P8NexusDirName%\

echo Installing IBM Content Navigator from %P8NexusInstallerFullPath% ...

pushd "%P8NexusInstallerFullPath%"
call IBM_CONTENT_NAVIGATOR-2.0.2-WIN.EXE -i silent -f "%ScriptsDir%\installNexus.txt"
popd

echo IBM IBM Content Navigator installation complete
time /t
echo ====================
