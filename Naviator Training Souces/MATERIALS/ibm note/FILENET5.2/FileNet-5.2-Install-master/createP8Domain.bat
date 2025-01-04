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
echo Begin createP8Domain.bat
time /t

set ScriptsDir=%1
set DirToDecompressTo=%2
set P8DownloadDirectory=%3

set ScriptsDir=%ScriptsDir:~1,-1%
set P8DownloadDirectory=%P8DownloadDirectory:~1,-1%
set DirToDecompressTo=%DirToDecompressTo:~1,-1%

call "%ScriptsDir%\setDirs.bat" 


@setlocal
set JAVA_HOME="C:\Program Files\IBM\FileNet\ContentEngine\_cejvm\jre"
set CEAPI="C:\Program Files\IBM\FileNet\ContentEngine\lib"
set JAASCONFIG="C:\Program Files\IBM\FileNet\ContentEngine\tools\PE\config"

set CLSNAME=com.ibm.bluestack.utils.P8Util

set CECP="%ScriptsDir%\cpt-actions.jar";"C:\Program Files\IBM\FileNet\ContentEngine\lib\Jace.jar";"C:\Program Files\IBM\FileNet\ContentEngine\lib\log4j.jar";"C:\Program Files\IBM\FileNet\ContentEngine\cdapi\stax-api.jar";"C:\Program Files\IBM\FileNet\ContentEngine\cdapi\xlxpScanner.jar";"C:\Program Files\IBM\FileNet\ContentEngine\cdapi\xlxpScannerUtils.jar";
rem echo classpath:%CECP%

set OPTS=-Djava.security.auth.login.config=%JAASCONFIG%

rem Sleep for 30 sec - this is a workaround to wait for WAS to completly startup the FileNet Engine.
echo Begin sleeping
set JAVACMD="C:\Program Files\IBM\FileNet\ContentEngine\_cejvm\jre\bin\java" -cp %CECP% %OPTS% %CLSNAME% sleep 30
%JAVACMD%
echo End sleeping

echo Begin Create P8Domain
set JAVACMD="C:\Program Files\IBM\FileNet\ContentEngine\_cejvm\jre\bin\java" -cp %CECP% %OPTS% %CLSNAME% createP8Domain "%ScriptsDir%\createP8os.properties"
@echo %JAVACMD%

%JAVACMD%
echo End Create P8Domain
@endlocal

if not %ERRORLEVEL% equ 0 ( 
	echo ERROR:  Failed to create P8 domain.  
	echo ERROR:  Make sure:
	echo ERROR:  1.  Web Services Enhancements 3.0 is installed 
	echo ERROR:  2.  WAS is started and the CE is configured and deployed properly.
	echo ERROR:      For example:  check http://localhost:9080/FileNet/Engine http://localhost:9080/P8CE/Health
	exit -1
) 

time /t
echo End createP8Domain.bat
echo ====================
