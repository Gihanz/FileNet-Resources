##########################################
## Licensed Materials - Property of IBM
## (C) Copyright IBM Corp. 2010
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

#Path to war file
set _ear "C:\\Program Files\\IBM\\FileNet\\WebClient\\deploy\\web_client.war"

#Node name (standard or managed server deployment only)
set _nodeName "P8Node01"

#Server name (standard or managed server deployment only)
set _serverName "server1"

#Cluster name (Cluster deployment only)
#set _clusterName  ""

#Application name (no space allowed)
set _applicationName "WorkplaceXT"

#Cell name
set _cellName "P8Node01Cell"

#deployment type
# for standard deployment, value is: standard
# for managed server deployment, value is: nd
# for cluster deployment, value is: cluster
set _deploymentType "standard"

set _virtualHost "default_host"
############################################


############################################
# deploys the war file on server and virtual, using the application name "application" 
############################################
proc deployApplication { nodeName cellName serverName war application virtual_host} {
	global AdminConfig
	global AdminApp
	
	set server "WebSphere:cell=$cellName,node=$nodeName,server=$serverName"     
    
	set roleToUsers [list [list "All Authenticated" "no" "yes" "" ""]]
	set webModsSvr [list [list .*  .*.war,.* $server]]
	set webModsVH [list [list .*  .*.war,.* $virtual_host]]
	set opts [list -MapRolesToUsers $roleToUsers -MapModulesToServers $webModsSvr -MapWebModToVH $webModsVH -appname $application -contextroot $application ]
	$AdminApp install "$war" $opts 
	$AdminConfig save
	puts "Deployment completed"
}

############################################
# deploys the war file on clusterName, using the application name "application"
############################################
proc deployApplicationCluster { cellName clusterName war application virtual_host } {
	global AdminConfig
	global AdminApp

	set cluster "WebSphere:cell=$cellName,cluster=$clusterName"     
     
	set roleToUsers [list [list "All Authenticated" "yes" "no" "" ""]]
	set webModsSvr [list [list .*  .*.war,.* $cluster]]
	set webModsVH [list [list .*  .*.war,.* $virtual_host]]
	set opts [list -MapRolesToUsers $roleToUsers -MapModulesToServers $webModsSvr -MapWebModToVH $webModsVH -appname $application -contextroot $application ]
	$AdminApp install "$war" $opts 
	$AdminConfig save
	puts "Deployment completed"
}

############################################
# update the existing application with the war file
############################################
proc updateApplication {war application virtual_host} {
	global AdminConfig
	global AdminApp
	set webMods [list [list .*  .*.war,.* $virtual_host]]
	set opts [list -MapWebModToVH $webMods -operation update -contents "$war" -contextroot $application ]
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

proc postDeployConfiguration { application } {
	global AdminConfig
	global AdminApp
        global AdminControl

	set app [$AdminConfig getid /Deployment:$application/]
	set deployed [$AdminConfig showAttribute $app deployedObject]
	set classloader [$AdminConfig showAttribute $deployed classloader]
	$AdminConfig modify $classloader {{mode PARENT_LAST}}

	set webModules [$AdminConfig list WebModuleDeployment $app]
	foreach webModule $webModules {
	   set uri [$AdminConfig showAttribute $webModule uri]
           if {$uri  == "web_client.war"} {
	        set cl [$AdminConfig list Classloader $webModule]
	        if {$cl == ""} {
	             $AdminConfig create Classloader $webModule  {{mode PARENT_LAST}}
	        } else {
	             $AdminConfig modify $cl  {{mode PARENT_LAST}}
     		}
	   }
	}

	$AdminApp edit $application {-MapRolesToUsers { {"Everyone" yes no "" ""}} }
	$AdminApp edit $application {-MapRolesToUsers { {"All Authenticated" no yes "" ""}} }

	
	set appManager [$AdminControl queryNames cell=P8Node01Cell,node=P8Node01,type=ApplicationManager,process=server1,*]

	$AdminControl invoke $appManager startApplication WorkplaceXT	

	$AdminConfig save
}

############################################

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
	if { $_deploymentType == "standard" || $_deploymentType == "nd" } {
		deployApplication $_nodeName $_cellName $_serverName "$_ear" $_applicationName $_virtualHost
	} elseif { $_deploymentType == "cluster" } {
		deployApplicationCluster $_cellName $_clusterName $_ear $_applicationName $_virtualHost
	}
} else {
	stopApplication $_applicationName
	updateApplication $_ear $_applicationName $_virtualHost
}
postDeployConfiguration $_applicationName
