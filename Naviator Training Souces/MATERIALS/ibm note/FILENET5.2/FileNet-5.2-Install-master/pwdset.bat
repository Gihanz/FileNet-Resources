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
echo Begin pwdset.bat
time /t

set ScriptsDir=%1
set DirToDecompressTo=%2
set P8DownloadDirectory=%3
set bitness=%4

set ScriptsDir=%ScriptsDir:~1,-1%
set P8DownloadDirectory=%P8DownloadDirectory:~1,-1%
set DirToDecompressTo=%DirToDecompressTo:~1,-1%

call "%ScriptsDir%\setDirs.bat" 

pushd "%ScriptsDir%"

set OldPassword=IBMFileNetP8
set PwdFile=pwd.txt
set PwdFileList=pwd_filelist.txt
set AccountsDotText=..\accounts.txt
set ReadmeDotText=..\readme.txt

if not exist "pwd.txt" (
	echo ERROR:  pwd.txt not found!
	goto EXIT_ERROR
) ELSE (

	 FOR /F %%I IN (%PwdFile%) DO (
	 	set NewPassword = %%I
		if not "%%I" == "" (
			echo get the file list to update password
			findstr /s /m %OldPassword% * > pwd_filelist.txt
	
			FOR /F %%J IN (pwd_filelist.txt) DO (
				set ScriptFileName = %%J
				cscript //nologo "SearchReplace.vbs" %%J "%OldPassword%" "%%I" 
				echo updated file:  "%%J"
			)
			rem Now update the accounts.txt
			if exist %AccountsDotText% (
				cscript //nologo "SearchReplace.vbs" %AccountsDotText% "%OldPassword%" "%%I" 
				echo updated %AccountsDotText%
			) 
			goto EXIT_OK	
	
		) ELSE (
			echo "ERROR:  New password not defined."
			goto EXIT_ERROR
		)
		goto EXIT_ERROR
	)


)

:EXIT_ERROR
popd
echo Error Exit pwdset.bat
echo ====================
exit -1


:EXIT_OK
popd
echo End pwdset.bat
echo ====================
rem exit 0
