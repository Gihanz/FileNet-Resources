echo ====================
echo Begin postNexusConfig.bat


time /t

set ScriptsDir=%1
set DirToDecompressTo=%2
set P8DownloadDirectory=%3

set ScriptsDir=%ScriptsDir:~1,-1%
set P8DownloadDirectory=%P8DownloadDirectory:~1,-1%
set DirToDecompressTo=%DirToDecompressTo:~1,-1%

call "%ScriptsDir%\setDirs.bat"


pushd "%PBSTargetDrive%%PBSTargetRootDir%\%DB2TargetDirName%\bin"

copy /y "C:\Program Files (x86)\IBM\ECMClient\configure\dbscripts\db2\modified\DB2_ONE_SCRIPT.sql" "%PBSTargetDrive%\"

set INSTALLER-NAME=db2cmd.exe

if not exist %INSTALLER-NAME% (
	echo ERROR:  %INSTALLER-NAME% not found!
	goto EXIT_ERROR
)

set DB2CLP=1

db2 -v CONNECT TO NExUSDB
db2 -z "C:\nexus_db2_log1.log" -tvsf "%PBSTargetDrive%\DB2_ONE_SCRIPT.sql"
db2 -v CONNECT RESET

popd



time /t
:EXIT_OK
echo End postNexusConfig.bat
echo SUCCESS: The NEXUSDB was populated successfully
echo ====================
exit 0

:EXIT_ERROR
echo End postNexusConfig.bat
echo ====================
exit -1
