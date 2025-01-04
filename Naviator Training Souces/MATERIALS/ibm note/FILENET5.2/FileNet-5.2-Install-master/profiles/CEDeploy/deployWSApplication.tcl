##########################################
## Licensed Materials - Property of IBM
## (C) Copyright IBM Corp. 2008
## All Rights Reserved
##########################################

# The Configuration Manager tool uses this script as input when configuring the
# WebSphere server.  In order to run a script, the tool generates a runtime
# script based on the contents of this input script.  The changes and additions 
# that the tool makes to this input script in order to run the runtime script
# are documented here in comments.  Similar changes must be made to a similar
# script file in order to run that script to manually configure WebSphere.
#
# Various variable assignments, with appropriate values, must be present in order
# for the rest of the script to run.  The following variable assignments, with
# some example values, are applicable.

#Websphere version
# For WebSphere 6.1, value is: 6.1
# For WebSphere 7.0, value is: 7
#set _wasVersion "7"

#Path to ear file to deploy
#set _ear "C:/Program Files/IBM/FileNet/ContentEngine/tools/configure/profiles/was61/ear/Engine-ws.ear"

#Node name (standard or managed server deployment only)
#set _nodeName ""

#Server name (standard or managed server deployment only)
#set _serverName ""

#Cluster name (Cluster deployment only)
#set _clusterName  ""

#Application name (no space allowed)
#set _applicationName "FileNetEngine"

#Cell name
#set _cellName ""

#deployment type
# for standard deployment, value is: standard
# for managed server deployment, value is: nd
# for cluster deployment, value is: cluster
#set _deploymentType "nd"

#transaction time out
#set _timeout 180

#to turn off SSL certificates used for server communication: values are: true or false
set _turnoffSSLcerts ""


############################################


############################################
# deploys the ear file on servername, using the application name "application" 
############################################
proc deployApplication { servername ear application virtual_host} {
	global AdminConfig
	global AdminApp
     
	set dbtype "DB2UDB_V82"
	set webMods [list [list "Engine-init.war" Engine-init.war,WEB-INF/web.xml $virtual_host] [list "IBM FileNet P8 CEWS" cews.war,WEB-INF/web.xml $virtual_host] [list "engine-health" Engine-health.war,WEB-INF/web.xml $virtual_host] [list "IBM FileNet BPM PEWSI" pewsAxis2-ws.war,WEB-INF/web.xml $virtual_host] [list client-download.war client-download.war,WEB-INF/web.xml $virtual_host] [list "acce.war" acce.war,WEB-INF/web.xml $virtual_host]]
	set opts {}
	if { $application != "FileNetEngine" } {		
		set opts [list -server $servername -usedefaultbindings -deployejb.dbtype $dbtype -MapWebModToVH $webMods -appname $application]
	} else {
		set opts [list -server $servername -usedefaultbindings -deployejb.dbtype $dbtype -MapWebModToVH $webMods]
	}
	$AdminApp install "$ear" $opts 
	$AdminConfig save
	puts "Deployment completed"
}

############################################
# deploys the ear file on clusterName, using the application name "application"
############################################
proc deployApplicationCluster { clusterName ear application virtual_host } {
	global AdminConfig
	global AdminApp
     
	set dbtype "DB2UDB_V82"
	set webMods [list [list "Engine-init.war" Engine-init.war,WEB-INF/web.xml $virtual_host] [list "IBM FileNet P8 CEWS" cews.war,WEB-INF/web.xml $virtual_host] [list "engine-health" Engine-health.war,WEB-INF/web.xml $virtual_host] [list "IBM FileNet BPM PEWSI" pewsAxis2-ws.war,WEB-INF/web.xml $virtual_host] [list client-download.war client-download.war,WEB-INF/web.xml $virtual_host] [list "acce.war" acce.war,WEB-INF/web.xml $virtual_host]]
	set opts {}
	if { $application != "FileNetEngine" } {		
		set opts [list -cluster $clusterName -usedefaultbindings -deployejb.dbtype $dbtype -MapWebModToVH $webMods -appname $application]
	} else {
		set opts [list -cluster $clusterName -usedefaultbindings -deployejb.dbtype $dbtype -MapWebModToVH $webMods]
	}
	$AdminApp install "$ear" $opts 
	$AdminConfig save
	puts "Deployment completed"
}

############################################
# deploys the ear file on the serverName defined within the cellName/nodeName scope, using the application name "application"
############################################
proc deployApplicationND { nodeName cellName serverName ear application virtual_host} {
	global AdminConfig
	global AdminApp
     
	set dbtype "DB2UDB_V82"
	set webMods [list [list "Engine-init.war" Engine-init.war,WEB-INF/web.xml $virtual_host] [list "IBM FileNet P8 CEWS" cews.war,WEB-INF/web.xml $virtual_host] [list "engine-health" Engine-health.war,WEB-INF/web.xml $virtual_host] [list "IBM FileNet BPM PEWSI" pewsAxis2-ws.war,WEB-INF/web.xml $virtual_host] [list client-download.war client-download.war,WEB-INF/web.xml $virtual_host] [list "acce.war" acce.war,WEB-INF/web.xml $virtual_host]]
	set opts {}
	if { $application != "FileNetEngine" } {		
		set opts [list -node $nodeName -cell $cellName -server $serverName -usedefaultbindings -deployejb.dbtype $dbtype -MapWebModToVH $webMods -appname $application]
	} else {
		set opts [list -node $nodeName -cell $cellName -server $serverName -usedefaultbindings -deployejb.dbtype $dbtype -MapWebModToVH $webMods]
	}
	$AdminApp install "$ear" $opts 
	$AdminConfig save
	puts "Deployment completed"
}

############################################
# update the existing application with the ear file
############################################
proc updateApplication {ear application virtual_host} {
	global AdminConfig
	global AdminApp
	set webMods [list [list "Engine-init.war" Engine-init.war,WEB-INF/web.xml $virtual_host] [list "IBM FileNet P8 CEWS" cews.war,WEB-INF/web.xml $virtual_host] [list "engine-health" Engine-health.war,WEB-INF/web.xml $virtual_host] [list "IBM FileNet BPM PEWSI" pewsAxis2-ws.war,WEB-INF/web.xml $virtual_host] [list client-download.war client-download.war,WEB-INF/web.xml $virtual_host] [list "acce.war" acce.war,WEB-INF/web.xml $virtual_host]]
	set opts [list -MapWebModToVH $webMods -operation update -contents "$ear"]
	$AdminApp update $application app $opts
	$AdminConfig save
	puts "Deployment completed"
}

############################################
# stops the application
############################################
proc stopApplication { application } {
	global AdminControl
	set appName [list "$application"]
	set status [$AdminControl completeObjectName type=Application,name=$application,*]
	set null [java::null]
	if {$status == $null} {	
		puts "To stop $application..."
		$AdminControl invoke [$AdminControl  queryNames type=ApplicationManager,*] stopApplication  $appName
	} else {
	    puts "$application is not running..."
	}
}

############################################
# post deployment configuration 
# (create a J2C connection factory for the FileNet P8 Connector module,
#  modify application classloader order and application war classloader policy) 
############################################
proc postDeployConfiguration { application nodeName wasVersion} {
	global AdminConfig
	set app [$AdminConfig getid /Deployment:$application/]
	set deployed [$AdminConfig showAttribute $app deployedObject]
	set modules [lindex [$AdminConfig showAttribute $deployed modules] 0]
	puts modules
	foreach mod $modules {
		set rhs [lindex [split $mod "#"] 1]
		set dep [lindex [split $rhs _] 0]
		if { $dep == "ConnectorModuleDeployment" } {
			set rard $mod
			puts [$AdminConfig show $rard]
			break
		}
	}
	set rard2 [$AdminConfig showAttribute $rard resourceAdapter]
	set cfName [list name FileNetConnectionFactory]
	set jndi [list 	jndiName FileNet/Local/ConnectionFactory]
	set attrs [list $cfName $jndi]
	if {[ catch {set j2cc [$AdminConfig create J2CConnectionFactory $rard2 $attrs] } errmsg]} {
		puts [append msg " might already exist."]
		return
	} else {
		puts "Succeeded"
		set pool [$AdminConfig showAttribute $j2cc connectionPool]
		$AdminConfig modify $pool {{maxConnections 100} {minConnections 10}}
		set classloader [$AdminConfig showAttribute $deployed classloader]
		$AdminConfig modify $classloader {{mode PARENT_LAST}}
		$AdminConfig modify $deployed {{warClassLoaderPolicy SINGLE} {reloadInterval 3} {reloadEnabled true}}
		$AdminConfig save
	}
}

############################################
## turnoff RMI/IIOP SSL
############################################
proc turnOffCSI {} {
	global AdminConfig
	puts "Turn off RMI/IIOP SSL"
	set tlayer [$AdminConfig list TransportLayer]
    set inbound_sqop [$AdminConfig showAttribute [lindex $tlayer 0] supportedQOP]
    set inbound_rqop [$AdminConfig showAttribute [lindex $tlayer 0] requiredQOP]
	$AdminConfig modify $inbound_sqop [list [list establishTrustInClient false]]
    $AdminConfig modify $inbound_rqop [list [list establishTrustInClient false]]
	$AdminConfig modify $inbound_sqop [list [list enableProtection false]]
    $AdminConfig modify $inbound_rqop [list [list enableProtection false]]
	set outbound_sqop [$AdminConfig showAttribute [lindex $tlayer 1] supportedQOP]
    set outbound_rqop [$AdminConfig showAttribute [lindex $tlayer 1] requiredQOP]
	$AdminConfig modify $outbound_sqop [list [list enableProtection false]]
    $AdminConfig modify $outbound_rqop [list [list enableProtection false]]
	$AdminConfig save
	
}
############################################
# Configure server total transaction lifetime timeout
############################################   
proc configureTimeout { cellname nodename servername timeout } {
	global AdminControl
	global AdminConfig
	puts "configure server transaction time out"
	set transactionservices [$AdminConfig getid /TransactionService:/]
	foreach ts $transactionservices {
		if [ string match *cells/$cellname/nodes/$nodename/servers/$servername* $ts ] {
			$AdminConfig modify $ts [list [list totalTranLifetimeTimeout $timeout] ]
		}
	} 
	$AdminConfig save
}
############################################
## Configure server total transaction lifetime timeout (cluster)
############################################   
proc configureTimeoutCluster { cellname clustername timeout } {
	global AdminControl
	global AdminConfig
	puts "configure server transaction time out"
	set members [$AdminConfig getid /ServerCluster:$clustername/ClusterMember:/]
	foreach member $members {
		set nodename [$AdminConfig showAttribute $member nodeName]
		set membername [$AdminConfig showAttribute $member memberName]
		set transactionservices [$AdminConfig getid /TransactionService:/]
		foreach ts $transactionservices {
			if [ string match *cells/$cellname/nodes/$nodename/servers/$membername* $ts ] {
				$AdminConfig modify $ts [list [list totalTranLifetimeTimeout $timeout] ]
			}
		} 
	}
	$AdminConfig save
}

############################################

if { $_turnoffSSLcerts == "true" } {
	turnOffCSI
}

if { $_deploymentType == "standard" } {
	configureTimeout $_cellName $_nodeName $_serverName $_timeout
} elseif { $_deploymentType == "cluster" } {
	configureTimeoutCluster $_cellName $_clusterName $_timeout
} elseif { $_deploymentType == "nd" } {
	configureTimeout $_cellName $_nodeName $_serverName $_timeout 
}
 

set apps [$AdminApp list]
set found "false"
foreach app $apps {
	if {$app == $_applicationName} {
		puts "Found existing $_applicationName.  Do redeploy."
		set found "true"
		break
	}
}
if { $found == "false" } {
	if { $_deploymentType == "standard" } {
		deployApplication $_serverName $_ear $_applicationName $_virtualHost
		postDeployConfiguration $_applicationName $_nodeName $_wasVersion
	} elseif { $_deploymentType == "cluster" } {
		deployApplicationCluster $_clusterName $_ear $_applicationName $_virtualHost
		postDeployConfiguration $_applicationName $_clusterName $_wasVersion
	} elseif { $_deploymentType == "nd" } {
		deployApplicationND $_nodeName $_cellName $_serverName $_ear $_applicationName $_virtualHost
		postDeployConfiguration $_applicationName $_nodeName $_wasVersion
	}
} else {
	stopApplication $_applicationName
	updateApplication $_ear $_applicationName $_virtualHost
	if { $_deploymentType == "standard" } {
		postDeployConfiguration $_applicationName $_nodeName $_wasVersion
	} elseif { $_deploymentType == "cluster" } {
		postDeployConfiguration $_applicationName $_clusterName $_wasVersion
	} elseif { $_deploymentType == "nd" } {
		postDeployConfiguration $_applicationName $_nodeName $_wasVersion
	}
}