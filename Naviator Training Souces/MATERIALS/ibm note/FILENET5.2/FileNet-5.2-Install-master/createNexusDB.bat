@echo off


set DBNAME=NEXUSDB
set DBDRIVE=C:
set DBDIR=\NEXUSDB2
set DBUSER=nexusdbuser

REM  close any outstanding connections
db2 -v CONNECT RESET

REM  Go ahead and drop if it exists
db2 -v DROP DATABASE %DBNAME%

REM Create the database - these statements must be on a single line (unfortunately)
db2 -v -t "CREATE DATABASE %DBNAME% ON '%DBDRIVE%' USING CODESET UTF-8 TERRITORY US COLLATE USING SYSTEM CATALOG TABLESPACE MANAGED BY SYSTEM USING ('%DBDRIVE%%DBDIR%\%DBNAME%\sys') TEMPORARY TABLESPACE MANAGED BY SYSTEM USING ('%DBDRIVE%%DBDIR%\%DBNAME%\systmp') USER TABLESPACE MANAGED BY SYSTEM USING ('%DBDRIVE%%DBDIR%\%DBNAME%\usr')" ;

