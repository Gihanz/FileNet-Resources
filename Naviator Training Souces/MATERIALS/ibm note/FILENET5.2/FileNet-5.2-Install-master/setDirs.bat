@echo setdirs running
@echo off
rem IBM Confidential
rem IBM FileNet Composite Platform Installation Tool,<ID>
rem © Copyright IBM Corp. 2010

echo Start setdirs.bat

set TDSDirName=TDS
set WASDirName=WAS
set WASUpdateDirName=WASUPD
set DB2LicDirName=Db2Lic

set P8CEDirName=CE
set P8CEClientDirName=CEC

set P8XTDirName=WPXT
set P8NexusDirName=ECMClient
set P8NexusFPDirName=ECMClientFP
set ICFDirName=ICF
set PBSTargetDrive=C:
set PBSTargetRootDir=\Program Files\IBM
set PBSTargetRootDir64=\Program Files (x86)\IBM

set TDS63TargetDirName=ldap\V6.3
set DB2TargetDirName=tdsV6.3db2
set WASTargetDirName=WebSphere\AppServer
set WASUpdateInstallerTargetDirName=WebSphere\UpdateInstaller

set P8CETargetDirName=FileNet\ContentEngine
set P8CEClientTargetDirName=FileNet\CEClient
set P8BPMClientTargetDirName=FileNet\BPMClient
set P8XTTargetDirName=FileNet\WebClient
set P8PETargetDirName=FileNet\Common Files
set IMDirName=IM
set IMInstallDir=C:\Program Files (x86)\IBM\Installation Manager\eclipse