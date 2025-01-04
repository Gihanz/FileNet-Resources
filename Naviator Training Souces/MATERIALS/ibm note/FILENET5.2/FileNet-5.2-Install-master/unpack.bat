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
echo Begin unpack.bat
time /t

set ScriptsDir=%1
set DirToDecompressTo=%2
set P8DownloadDirectory=%3

set ScriptsDir=%ScriptsDir:~1,-1%
set P8DownloadDirectory=%P8DownloadDirectory:~1,-1%
set DirToDecompressTo=%DirToDecompressTo:~1,-1%

echo ScriptsDir "%ScriptsDir%"
echo DirToDecompressTo "%DirToDecompressTo%"
echo P8DownloadDirectory  "%P8DownloadDirectory%"

call "%ScriptsDir%\setDirs.bat" 

set OSbit=%4
if (%OSBit%)==() goto 64bitOS
if %OSbit%==32 goto 32bitOS

:64bitOS
set TDS63FileName=tds.zip
set DB2FileName=db2.zip

set P8NexusFileName=icn.zip
set P8NexusFPFileName=icnfp.zip

goto done

:32bitOS
set TDS63FileName=tds.zip
set DB2FileName=db2.zip

goto done

:done
set P8Db2LicenseFileName=db2lic.zip
set P8CEFileName=ce.zip
set P8CEClientFileName=cec.zip
set P8XTFileName=wpxt.zip

set DB2LicDirName=DB2Lic

set IMFileName=im.zip

set WAS85FileNamePart1=WAS_V8.5_1_OF_3.zip
set WAS85FileNamePart2=WAS_V8.5_2_OF_3.zip
set WAS85FileNamePart3=WAS_V8.5_3_OF_3.zip


pushd "%ScriptsDir%" 

date /t
time /t

echo Uncompressing IBM WebSphere Application Server 8.5 ...
mkdir "%DirToDecompressTo%\%WASDirName%"
cscript //nologo unzip.vbs "%P8DownloadDirectory%\%WAS85FileNamePart1%" "%DirToDecompressTo%\%WASDirName%"
cscript //nologo unzip.vbs "%P8DownloadDirectory%\%WAS85FileNamePart2%" "%DirToDecompressTo%\%WASDirName%"
cscript //nologo unzip.vbs "%P8DownloadDirectory%\%WAS85FileNamePart3%" "%DirToDecompressTo%\%WASDirName%"


echo IBM WebSphere Application Server 8.5 uncompressed
time /t
echo --------------------



echo Uncompressing IBM Tivoli Directory Server 6.3 ...
cscript //nologo unzip.vbs "%P8DownloadDirectory%\%TDS63FileName%" "%DirToDecompressTo%"
move "%DirToDecompressTo%\tdsV6.3" "%DirToDecompressTo%\%TDSDirName%"
cscript //nologo unzip.vbs "%P8DownloadDirectory%\%DB2FileName%" "%DirToDecompressTo%"
move "%DirToDecompressTo%\SERVER" "%DirToDecompressTo%\%TDSDirName%\db2"
rd /s /q "%DirToDecompressTo%\tdsV6.3"
cscript //nologo unblock.vbs "%DirToDecompressTo%\%TDSDirName%\db2\db2\Windows\issetup.exe"
echo IBM Tivoli Directory Server uncompressed
time /t
echo --------------------

echo Uncompressing IBM DB2 9.7 License ...
mkdir "%DirToDecompressTo%\%DB2LicDirName%"
cscript //nologo unzip.vbs "%P8DownloadDirectory%\%P8Db2LicenseFileName%" "%DirToDecompressTo%\%DB2LicDirName%"
echo IBM DB2 9.7 License uncompressed
time /t
echo --------------------

echo Uncompressing IBM FileNet Content Platform Engine ...
mkdir "%DirToDecompressTo%\%P8CEDirName%"
cscript //nologo unzip.vbs "%P8DownloadDirectory%\%P8CEFileName%" "%DirToDecompressTo%\%P8CEDirName%"
echo IBM FileNet Content Platform Engine uncompressed
time /t
echo --------------------

echo Uncompressing IBM FileNet Content  Engine Client ...
mkdir "%DirToDecompressTo%\%P8CEClientDirName%"
cscript //nologo unzip.vbs "%P8DownloadDirectory%\%P8CEClientFileName%" "%DirToDecompressTo%\%P8CEClientDirName%"
echo IBM FileNet Content Engine Client  uncompressed
time /t
echo --------------------



echo Uncompressing IBM FileNet Workplace XT ...
mkdir "%DirToDecompressTo%\%P8XTDirName%"
cscript //nologo unzip.vbs "%P8DownloadDirectory%\%P8XTFileName%" "%DirToDecompressTo%\%P8XTDirName%"
echo IBM FileNet Workplace XT uncompressed
time /t


echo Uncompressing IBM Content Navigator to "%DirToDecompressTo%\%P8NexusDirName%"
mkdir "%DirToDecompressTo%\%P8NexusDirName%"
cscript //nologo unzip.vbs "%P8DownloadDirectory%\%P8NexusFileName%" "%DirToDecompressTo%\%P8NexusDirName%"
echo IBM Content Navigator  uncompressed
time /t
echo --------------------




echo Uncompressing IBM Installation Manager to "%DirToDecompressTo%\%IMDirName%"
mkdir "%DirToDecompressTo%\%IMDirName%"
cscript //nologo unzip.vbs "%P8DownloadDirectory%\%IMFileName%" "%DirToDecompressTo%\%IMDirName%"
echo IBM Installation Manager  uncompressed
time /t
echo --------------------


echo End unpack.bat
echo ====================

