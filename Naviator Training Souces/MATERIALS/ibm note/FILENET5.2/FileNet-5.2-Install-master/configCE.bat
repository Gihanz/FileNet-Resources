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
echo Start configCE.bat
time /t

set ScriptsDir=%1
set DirToDecompressTo=%2
set P8DownloadDirectory=%3

set ScriptsDir=%ScriptsDir:~1,-1%
set P8DownloadDirectory=%P8DownloadDirectory:~1,-1%
set DirToDecompressTo=%DirToDecompressTo:~1,-1%

call "%ScriptsDir%\setDirs.bat" 

pushd "%PBSTargetDrive%%PBSTargetRootDir%\%P8CETargetDirName%\tools\configure"
set INSTALLER-NAME=configmgr_cl.exe

if not exist %INSTALLER-NAME% (
	echo ERROR:  %INSTALLER-NAME% not found!
	exit -1
)

call %INSTALLER-NAME% execute -profile "%ScriptsDir%\profiles\CEConfig"
popd

rem Sleep - wait for CMUI to complete setting the status.
set JAVA_HOME="C:\Program Files (x86)\IBM\FileNet\ContentEngine\_cejvm\jre"
set CEAPI="C:\Program Files (x86)\IBM\FileNet\ContentEngine\lib"
set JAASCONFIG="C:\Program Files (x86)\IBM\FileNet\ContentEngine\tools\PE\config"
set CLSNAME=com.ibm.bluestack.utils.P8Util
set CECP="%ScriptsDir%\cpt-actions.jar";"C:\Program Files (x86)\IBM\FileNet\ContentEngine\lib\Jace.jar";"C:\Program Files (x86)\IBM\FileNet\ContentEngine\lib\log4j.jar";"C:\Program Files (x86)\IBM\FileNet\ContentEngine\cdapi\stax-api.jar";"C:\Program Files (x86)\IBM\FileNet\ContentEngine\cdapi\xlxpScanner.jar";"C:\Program Files (x86)\IBM\FileNet\ContentEngine\cdapi\xlxpScannerUtils.jar";

set OPTS=-Djava.security.auth.login.config=%JAASCONFIG%
echo Begin sleeping
set JAVACMD="C:\Program Files (x86)\IBM\FileNet\ContentEngine\_cejvm\jre\bin\java" -cp %CECP% %OPTS% %CLSNAME% sleep 5
%JAVACMD%
echo End sleeping

set PRO-PATH=%ScriptsDir%\profiles\CEConfig\status

set F1=configurebootstrap.ok
set F2=configurejdbcgcd.ok
set F3=configurejdbcos.ok
set F4=configureldap.ok
set F5=configureloginmodules.ok

pushd %PRO-PATH%

for %%H in (%F1% %F2% %F3% %F4% %F5% ) do if not exist %%H (
	echo ERROR - %%H not found. configCE failed.  Refer to "%PRO-PATH%" for more details.
	exit -1	
)

popd

time /t
:EXIT_OK
echo End configCE.bat
echo ====================
exit 0

