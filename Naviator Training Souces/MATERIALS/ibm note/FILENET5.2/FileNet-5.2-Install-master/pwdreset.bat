@echo off

rem Licensed Materials - Property of IBM
rem 5725A15, 5724R81
rem (c) Copyright IBM Corp. 2010, 2011  All Rights Reserved.
rem US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
rem

echo ====================
echo Begin pwdreset.bat
time /t

set InputPassword=%1

set PasswordToClear=xoxoxoxo
set PwdFile=pwd.txt
set PwdFileList=pwd_filelist.txt

rem  Check for existence of the current password file
if not exist "%PwdFile%" (
	rem echo ERROR:  %PwdFile% not found!
	goto EXIT_ERROR
)

set /p PasswordInFile=<%PwdFile%
rem echo get current password from password file:  %PasswordInFile%

IF not %InputPassword% == %PasswordInFile% (

	echo Usage:  pwdreset.bat PasswordInScript  
	echo Example:  
	echo     pwdreset.bat myPassword  
	echo .
	goto EXIT_ERROR

) ELSE (

	findstr /s /m %InputPassword% * > pwd_filelist.txt

	FOR /F %%J IN (%PwdFileList%) DO (
		set ScriptFileName = %%J
		cscript //nologo "SearchReplace.vbs" %%J "%InputPassword%" "%PasswordToClear%" 
		echo "%%J"
	)
	echo Successfully cleared the passwords in installation scripts.
	goto EXIT_OK	
) 




:EXIT_ERROR
echo Error Exit pwdreset.bat
echo ====================



:EXIT_OK

echo ====================














