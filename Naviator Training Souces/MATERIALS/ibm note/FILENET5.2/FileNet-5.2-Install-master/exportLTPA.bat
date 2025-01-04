echo Exporting LTPA Keys from your content engine server to C:\ltpakeys.txt on Windows and /opt/IBM/ltpakeys.txt on Linux and AIX systems.
echo "Begin exportLTPA.bat..."

echo "============================================================"

time /t

set ScriptsDir=%1
set DirToDecompressTo=%2
set P8DownloadDirectory=%3

set ScriptsDir=%ScriptsDir:~1,-1%
set P8DownloadDirectory=%P8DownloadDirectory:~1,-1%
set DirToDecompressTo=%DirToDecompressTo:~1,-1%

call "%ScriptsDir%\setDirs.bat" 

set INSTALLER-NAME="%PBSTargetDrive%%PBSTargetRootDir%\%WASTargetDirName%\bin\wsadmin.bat"



if not exist %INSTALLER-NAME% goto EXIT_ERROR



call %INSTALLER-NAME% -lang jacl -conntype SOAP -port 8880 -host localhost -username p8admin -password IBMFileNetP8 -f "%ScriptsDir%\exportLTPAKeys.jacl"



echo ====================
echo "End exportLTPA.bat"
exit 0



:EXIT_ERROR
echo %INSTALLER-NAME% not found!
echo ====================
exit -1