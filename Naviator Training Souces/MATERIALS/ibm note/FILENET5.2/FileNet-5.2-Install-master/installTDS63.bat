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
echo Start installTDS63.bat
time /t

set ScriptsDir=%1
set DirToDecompressTo=%2
set P8DownloadDirectory=%3

set ScriptsDir=%ScriptsDir:~1,-1%
set P8DownloadDirectory=%P8DownloadDirectory:~1,-1%
set DirToDecompressTo=%DirToDecompressTo:~1,-1%

call "%ScriptsDir%\setDirs.bat"

set TDSInstallerFullPath="%DirToDecompressTo%\%TDSDirName%\tds"
echo Installing IBM Tivoli Directory Server from %TDSInstallerFullPath% ...
echo (this will include installation of IBM DB2)
time /t

if not exist "%ScriptsDir%\logs" mkdir "%ScriptsDir%\logs"

pushd "%TDSInstallerFullPath%"
set INSTALLER-NAME=install_tdsSilent.exe

if not exist %INSTALLER-NAME% (
echo %INSTALLER-NAME% not found!
goto EXIT_ERROR
) ELSE (
call %INSTALLER-NAME% -is:silent -options "%ScriptsDir%\installTDS63.txt" -is:log "%ScriptsDir%\logs\installTDS63.log"
popd
)
if not exist "C:\Program Files\IBM\ldap\V6.3\sbin\idsldif2db.cmd" (
echo ERROR:  TDS installation failed!
goto EXIT_ERROR
) ELSE (

echo Set the TDS Web Administration Tool menus
copy /y "%ScriptsDir%\idswebadmin*.html" "C:\Program Files\IBM\ldap\V6.3\idstools\bin"

rem Install DB2 license
if not exist "C:\Program Files\IBM\tdsV6.3db2\BIN\db2licm.exe" (
	echo ERROR:  DB2 installation failed!
	echo ERROR:  C:\Program Files\IBM\tdsV6.3db2\BIN\db2licm.exe not found!
	goto EXIT_ERROR
) ELSE (
	pushd "C:\Program Files\IBM\tdsV6.3db2\BIN\"
	if not exist "C:\Program Files (x86)\IBM\cpit\decompressed\DB2Lic\ese_o\db2\license\db2ese_o.lic" (
		echo ERROR:  DB2 license file "C:\Program Files (x86)\IBM\cpit\decompressed\DB2Lic\ese_o\db2\license\db2ese_o.lic" not found!
		db2licm.exe -l
	) ELSE (
		copy "C:\Program Files (x86)\IBM\cpit\decompressed\DB2Lic\ese_o\db2\license\db2ese_o.lic" 
		db2licm.exe -a db2ese_o.lic
		db2licm.exe -l
	)
	popd
)

time /t
:EXIT_OK
echo End installTDS63.bat
echo ====================
exit 0
)

:EXIT_ERROR
echo End installTDS63.bat
echo ====================
exit -1
