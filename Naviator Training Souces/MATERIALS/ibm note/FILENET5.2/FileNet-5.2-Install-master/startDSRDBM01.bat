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
echo Starting IBM Tivoli Directory Server ...
time /t

call net start idsslapd-dsrdbm01
call net start db2tds63-0

rem set db2 service to start automatically
call sc \\localhost config dsrdbm01 start= auto

time /t
echo IBM Tivoli Directory Server (DSRDBM01) started
echo ====================
