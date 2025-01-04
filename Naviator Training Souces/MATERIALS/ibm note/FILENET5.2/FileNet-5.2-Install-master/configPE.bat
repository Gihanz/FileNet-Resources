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

echo --------------------
echo Configuring IBM FileNet Process Engine 4.6 ...
time /t

echo "Starting PE Service Manager" 

net start VWServicesPEManager

set ScriptsDir=%1
set DirToDecompressTo=%2
set P8DownloadDirectory=%3

set ScriptsDir=%ScriptsDir:~1,-1%
set P8DownloadDirectory=%P8DownloadDirectory:~1,-1%
set DirToDecompressTo=%DirToDecompressTo:~1,-1%

call "%ScriptsDir%\setDirs.bat" 

echo Set the database configuration information

copy "%ScriptsDir%\PEInitD.properties" "C:\Program Files\IBM\FileNet\ContentEngine\tools\PE\data\PEInitD.properties"

rem copy "%ScriptsDir%\PEInitV.properties" "C:\Program Files\IBM\FileNet\ContentEngine\tools\PE\data\PEInitV.properties"

copy "%ScriptsDir%\jdbcinit.bat" "C:\Program Files\IBM\FileNet\ContentEngine\tools\PE\data\jdbcinit.bat"

pushd "C:\Program Files\IBM\FileNet\ContentEngine\tools\PE"

set INSTALLER-NAME=peinit.bat

if not exist %INSTALLER-NAME% (
	echo ERROR:  C:\Program Files\IBM\FileNet\ContentEngine\tools\PE\%INSTALLER-NAME% not found!
	echo ====================
	exit -1
)






pushd "C:\Program Files\IBM\FileNet\ContentEngine\tools\PE"

call %INSTALLER-NAME% P8ConnPt1 -D "C:\Program Files\IBM\FileNet\ContentEngine\tools\PE\data\PEInitD.properties" -Y p8admin+IBMFileNetP8

if not %ERRORLEVEL% equ 0 ( 
	echo ERROR:  Failed to initialize the PE region.  
	echo ERROR:  Make sure WAS is started and the CE is configured and deployed properly.
	echo ERROR:  Verify http://localhost:9080/FileNet/Engine http://localhost:9080/P8CE/Health
	exit -1
) 
popd

rem Configure PE for Auto start after reboot
pushd %ScriptsDir%
set PE_CONFIG_FILE=C:\Program Files\IBM\FileNet\ContentEngine\tools\PE\data\jpemgr.properties
if exist "%PE_CONFIG_FILE%" (
	findstr /s /m "pesvr.default.autoStart=true" "%PE_CONFIG_FILE%" > tmp.txt
	for /F %%J in ("tmp.txt") do if %%~zJ equ 0 (
		rem must use complete path and not variable to append to
		echo pesvr.default.autoStart=true >> "C:\Program Files\IBM\FileNet\ContentEngine\tools\PE\data\jpemgr.properties"
	)
	del tmp.txt
)
popd


time /t
:EXIT_OK
echo End configPE.bat
echo ====================
exit 0