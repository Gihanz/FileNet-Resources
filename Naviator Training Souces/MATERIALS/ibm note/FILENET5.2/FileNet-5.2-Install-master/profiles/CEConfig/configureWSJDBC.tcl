##########################################
## Licensed Materials - Property of IBM
## (C) Copyright IBM Corp. 2008
## All Rights Reserved
##########################################

# The Configuration Manager tool uses this script as input when configuring the
# WebSphere server. In order to run a script, the tool generates a runtime
# script based on the contents of this input script.  The changes and additions 
# that the tool makes to this input script in order to run the runtime script
# are documented here in comments.  Similar changes must be made to a similar
# script file in order to run that script to manually configure WebSphere.
#
# Various variable assignments, with appropriate values, must be present in order
# for the rest of the script to run.  The following variable assignments, with
# some example values, are applicable to all DB types.
#      

#Websphere version
# For WebSphere 6.1, value is: 6
# For WebSphere 7.0, value is: 7
# For WebSphere 8.0 & 8.5, value is: 8

#set _wasVersion "6"

#Cellname value
#set _cellName ""

#Database user name
#set _aliasName ""
#set _aliasId ""

#Database user password
#set _aliasPassword ""

##Provider type
#   For DB2 (including DB2 on z/OS), value is: 5
#   For ORACLE, value is: 4
#   For MSSQL, value is: 3
#set _jdbcProviderType "5"

#Provider name
#set _jdbcProviderName "JDBC provider for DB2"

#Provider description
#set _jdbcProviderDesc "The JDBC provider used for Global Configuration Data (GCD) or object store data sources."

#non-XA Datasource name
#set _dsName "FNGCDDS"

#non-XA Datasource JNDI name
#set _jndiName "FNGCDDS"

#XA Datasource name 
#set _dsXaName "FNGCDDSXA"

#XA Datasource JNDI name
#set _jndiXaName "FNGCDDSXA"

#Database name
#set _dbName ""

#Database server name
#set _dbServerName ""

#Database port number
#set _portNumber ""

#Value will be set to "true" if "DB2 Universal JDBC Driver (PureScale / HADR)" is chosen
#Value will be set to "false" if options other than "DB2 Universal JDBC Driver (PureScale / HADR)" are chosen
#set _ClientRerouteEnable "false"

#Retry interval for client reroute (DB2 Universal JDBC Driver (PureScale / HADR) only)
#set _retryIntervalForClientReroute ""

#Maximum retries for client reroute (DB2 Universal JDBC Driver (PureScale / HADR) only)
#set _maxRetriesForClientReroute ""

#Alternate server names (DB2 Universal JDBC Driver (PureScale / HADR) only)
#set _clientRerouteAlternateServerName ""

#Alternate port numbers (DB2 Universal JDBC Driver (PureScale / HADR) only)
#set _clientRerouteAlternatePortNumber ""

#zOS database name(DB2 on z/OS only)
#set _zOsDbName "N/A"

#zOS default tablespace(DB2 on z/OS only)
#set _zOsDefaultTblspace "N/A"

#zOS default STO group(DB2 on z/OS only)
#set _zOsDefaultSTOGroup "N/A"

#zOS default STO group options(DB2 on z/OS only)
#set _zOsSTOGROUPOptions "N/A"

#Oracle RAC url (Oracle RAC only)
set _oracleRacUrl ""

#to turn off SSL certificates used for server communication: 
#value can be: true or false
set _turnoffSSLcerts ""

#Oracle db version
#value can be: 10g or 11g
set _dbVersion ""

#MSSQL driver version
#value can be: 1.2, 2.0, 3.0, 4.0
#DB2 driver version
#value can be: 3.0, 4.0
set _driverVersion ""

#DB FailOver Support
#values can be: true or false
#set _dbFailOver "false"
############################################

############################################
# create a JAAS J2C authentication data entry
############################################
proc setJAASAuthData { cellName aliasName aliasId aliasPassword } {
	puts "setJAASAuthData"
	global AdminConfig
	set found "False"
	set security [$AdminConfig list Security]
	set authDatas [lindex [$AdminConfig showAttribute $security authDataEntries] {} ]
	set fullName $cellName
	append fullName "/" $aliasName
	foreach authData $authDatas {
		set alias [$AdminConfig showAttribute $authData alias]
		if { $alias == $fullName } {
			set auth_entry $authData
			set found "True"
			puts "found existing JAASAuthData"
			break
		}
	}
	
	if { [$AdminConfig getid /Cell:$cellName/] == "" } {
		puts "Error: Cell not found: $cellName"
		exit
	}
	set auth_alias [list alias $fullName]
	set auth_descr [list description  "GCD DataSource authentication alias"]
	set auth_userId [list userId $aliasId]
	set auth_password [list password $aliasPassword]
	if { $found == "True" } {
		set mod_attrs [list $auth_descr $auth_userId $auth_password]
		$AdminConfig modify $auth_entry $mod_attrs
		puts [$AdminConfig show $auth_entry]
	} else {
		# put the new object together
		set auth_entry [list $auth_alias $auth_descr $auth_userId $auth_password]
		# create the new object
		$AdminConfig create JAASAuthData $security $auth_entry
	}
	$AdminConfig save
	
}

############################################
# create a non-XA JDBC provider based on the driver type
############################################
proc createJDBCProvider { wasVersion cellName driverType jdbcProviderName jdbcProviderDesc dbVersion driverVersion} {
	puts "createJDBCProvider"
	global AdminConfig
	global AdminTask
	set name [list name $jdbcProviderName]
	if { [$AdminConfig getid /Cell:$cellName/] == "" } {
		puts "Error: Cell not found: $cellName"
		exit
	}
	set cell [$AdminConfig getid /Cell:$cellName/]
	set jdbc {}
	set providers [$AdminConfig getid /JDBCProvider:/]
	foreach provider $providers {
		if { [$AdminConfig showAttribute $provider name] == $jdbcProviderName } {
			puts  [append jdbcProviderName " already exists."]
			return $provider
		}
	}
	
	set rsadapters [$AdminConfig list J2CResourceAdapter $cell]
	foreach rs $rsadapters {
		set rsName [$AdminConfig showAttribute $rs name ]
		if {  $rsName == "WebSphere Relational Resource Adapter" } {			
				set rsadapter $rs
				puts [$AdminConfig showAttribute $rsadapter name]
				break
		}
	}

##Microsoft JDBC driver for SQL2005, 2008, 2012
	if { $driverType == "3" } {
		set implementationClassName "com.microsoft.sqlserver.jdbc.SQLServerConnectionPoolDataSource"
	        if { $wasVersion == "6" } {
			set classpath "\${MSSQLSERVER_JDBC_DRIVER_PATH}/sqljdbc.jar"
		} else {
			if { $driverVersion == "2.0" || $driverVersion == "3.0" || $driverVersion == "4.0"} {
				set classpath "\${MICROSOFT_JDBC_DRIVER_PATH}/sqljdbc4.jar"
			} else {
				set classpath "\${MICROSOFT_JDBC_DRIVER_PATH}/sqljdbc.jar"
			}			
		}
		set providerType "User-defined JDBC Provider"
		set databaseType "User-defined"
		set jdbc [$AdminTask createJDBCProvider [ subst  { -scope Cell=$cellName -databaseType "$databaseType" -providerType "$providerType" -implementationType "Connection pool data source" -classpath "$classpath" -implementationClassName "$implementationClassName" -name "$jdbcProviderName" -description "$jdbcProviderDesc" } ] ]

##Oracle
	} elseif { $driverType == "4" } {
		set implementationClassName "oracle.jdbc.pool.OracleConnectionPoolDataSource"
		if { $wasVersion == "6" } {
			if { $dbVersion == "Oracle 10g" } {
				set classpath "\${ORACLE_JDBC_DRIVER_PATH}/ojdbc14.jar"
			} else {
				set classpath "\${ORACLE_JDBC_DRIVER_PATH}/ojdbc5.jar"
			}
		} else {
			if { $dbVersion == "Oracle 10g" } {
				set classpath "\${ORACLE_JDBC_DRIVER_PATH}/ojdbc14.jar"
			} else {
				set classpath "\${ORACLE_JDBC_DRIVER_PATH}/ojdbc6.jar"
			}
		}
		set providerType "Oracle JDBC Driver"
		set databaseType "Oracle"

		set jdbc [$AdminTask createJDBCProvider [ subst  { -scope Cell=$cellName -databaseType "$databaseType" -providerType "$providerType" -implementationType "Connection pool data source" -classpath "$classpath" -implementationClassName "$implementationClassName" -name "$jdbcProviderName" -description "$jdbcProviderDesc" } ] ]

##DB2
	} elseif { $driverType == "5" || $driverType == "6"} {
		set desc  [list description $jdbcProviderDesc]
		set implementationClassName "com.ibm.db2.jcc.DB2ConnectionPoolDataSource"
		if { $driverVersion == "3.0" } {
			set databaseDriver "db2jcc.jar"
		} else {
			set databaseDriver "db2jcc4.jar"
		}
		if { $driverType == "5" } {
			set classpath "\${DB2UNIVERSAL_JDBC_DRIVER_PATH}/${databaseDriver}; \${DB2UNIVERSAL_JDBC_DRIVER_PATH}/db2jcc_license_cu.jar"
		} else {
			set classpath "\${DB2UNIVERSAL_JDBC_DRIVER_PATH}/${databaseDriver}; \${DB2UNIVERSAL_JDBC_DRIVER_PATH}/db2jcc_license_cu.jar; \${DB2UNIVERSAL_JDBC_DRIVER_PATH}/db2jcc_license_cisuz.jar"

		}

		set providerType "DB2 Universal JDBC Driver Provider"
		set databaseType "DB2"
		set jdbc [$AdminTask createJDBCProvider [ subst  { -scope Cell=$cellName -databaseType "$databaseType" -providerType "$providerType" -implementationType "Connection pool data source" -classpath "$classpath" -implementationClassName "$implementationClassName" -name "$jdbcProviderName" -description "$jdbcProviderDesc" } ] ]
	}
	$AdminConfig save
	puts [$AdminConfig show $jdbc]
	return $jdbc
}	

############################################
# create a XA JDBC provider based on the driver type
############################################
proc createJDBCProviderXA { wasVersion cellName driverType jdbcProviderName jdbcProviderDesc dbVersion driverVersion} {
	puts "createJDBCProviderXA"
	global AdminConfig
	global AdminTask
	if { [$AdminConfig getid /Cell:$cellName/] == "" } {
		puts "Error: Cell not found: $cellName"
		exit
	}
	set cell [$AdminConfig getid /Cell:$cellName/]
	set jdbc {}
	append jdbcProviderName " (XA)"
	set name [list name $jdbcProviderName]
	
	set providers [$AdminConfig getid /JDBCProvider:/]
	foreach provider $providers {
		if { [$AdminConfig showAttribute $provider name] == $jdbcProviderName } {
			puts  [append jdbcProviderName " already exists."]
			return $provider
		}
	}

##Microsoft JDBC driver for SQL2005, 2008, 2012	
	if { $driverType == "3" } {
		set implementationClassName "com.microsoft.sqlserver.jdbc.SQLServerXADataSource"
		if { $wasVersion == "6" } {
			set classpath "\${MSSQLSERVER_JDBC_DRIVER_PATH}/sqljdbc.jar"
		} else {
			if { $driverVersion == "2.0" || $driverVersion == "3.0" || $driverVersion == "4.0" } {
				set classpath "\${MICROSOFT_JDBC_DRIVER_PATH}/sqljdbc4.jar"
			} else {
				set classpath "\${MICROSOFT_JDBC_DRIVER_PATH}/sqljdbc.jar"
			}			
		} 
		set providerType "User-defined JDBC Provider"
		set databaseType "User-defined"
		set implementationType "User-defined"
		set jdbc [$AdminTask createJDBCProvider [ subst  { -scope Cell=$cellName -databaseType "$databaseType" -providerType "$providerType" -implementationType "$implementationType" -classpath "$classpath" -implementationClassName "$implementationClassName" -name "$jdbcProviderName" -description "$jdbcProviderDesc" } ] ]
		set xa  [list xa true]
		set attrs [list $xa]
		$AdminConfig modify $jdbc $attrs
##Oracle		
	} elseif { $driverType == "4" } {
		set implementationClassName "oracle.jdbc.xa.client.OracleXADataSource"

		if { $wasVersion == "6" } {
			if { $dbVersion == "Oracle 10g" } {
				set classpath "\${ORACLE_JDBC_DRIVER_PATH}/ojdbc14.jar"
			} else {
				set classpath "\${ORACLE_JDBC_DRIVER_PATH}/ojdbc5.jar"
			}
		} else {
			if { $dbVersion == "Oracle 10g" } {
				set classpath "\${ORACLE_JDBC_DRIVER_PATH}/ojdbc14.jar"
			} else {
				set classpath "\${ORACLE_JDBC_DRIVER_PATH}/ojdbc6.jar"
			}
		}
		set providerType "Oracle JDBC Driver"
		set databaseType "Oracle"
		set jdbc [$AdminTask createJDBCProvider [ subst  { -scope Cell=$cellName -databaseType "$databaseType" -providerType "$providerType" -implementationType "XA data source" -classpath "$classpath" -implementationClassName "$implementationClassName" -name "$jdbcProviderName" -description "$jdbcProviderDesc" } ] ]
##DB2
	} elseif { $driverType == "5" || $driverType == "6" } {
		set implementationClassName "com.ibm.db2.jcc.DB2XADataSource"
		if { $driverVersion == "3.0" } {
			set databaseDriver "db2jcc.jar"
		} else {
			set databaseDriver "db2jcc4.jar"
		}
		if { $driverType == "5" } {
			set classpath "\${DB2UNIVERSAL_JDBC_DRIVER_PATH}/${databaseDriver}; \${DB2UNIVERSAL_JDBC_DRIVER_PATH}/db2jcc_license_cu.jar"
		} else {
			set classpath "\${DB2UNIVERSAL_JDBC_DRIVER_PATH}/${databaseDriver}; \${DB2UNIVERSAL_JDBC_DRIVER_PATH}/db2jcc_license_cu.jar; \${DB2UNIVERSAL_JDBC_DRIVER_PATH}/db2jcc_license_cisuz.jar"

		}
		set providerType "DB2 Universal JDBC Driver Provider"
		set databaseType "DB2"
		set jdbc [$AdminTask createJDBCProvider [ subst  { -scope Cell=$cellName -databaseType "$databaseType" -providerType "$providerType" -implementationType "XA data source" -classpath "$classpath" -implementationClassName "$implementationClassName" -name "$jdbcProviderName" -description "$jdbcProviderDesc" } ] ]
	}		
	$AdminConfig save
	puts [$AdminConfig show $jdbc]
	return $jdbc
}

############################################
# create a non-XA datasource
############################################
proc createDataSource { wasVersion cellName provider driverType aliasName dsName jndiName dbName dbserverName portNumber zOsDbName zOsDefaultSTOGroup zOsSTOGROUPOptions oracleRacUrl dbVersion dbFailOver ClientRerouteEnable retryIntervalForClientReroute maxRetriesForClientReroute clientRerouteAlternateServerName clientRerouteAlternatePortNumber} {
	global AdminConfig
	global AdminTask
	set msg "Create DataSource "
	puts [append msg $dsName]
	set datasources [$AdminConfig getid /DataSource:/]
	foreach ds $datasources {
		if { [$AdminConfig showAttribute $ds name] == $dsName } {
			puts  [append dsName " already exists."]
			puts "Done configuring DataSource"
			return $ds
		}
	}

	set dsdesc [list description "CEMP DataSource"]

	if { [$AdminConfig getid /Cell:$cellName/] == "" } {
		puts "Error: Cell not found: $cellName"
		exit
	}
	set fullName $cellName
	append fullName "/" $aliasName

##Microsoft JDBC driver for SQL2005,2008
	if { $driverType == "3" } {	
		set datasourceHelperClassname "com.ibm.websphere.rsadapter.GenericDataStoreHelper"
		set dsCache [list statementCacheSize 0]
		$AdminTask createDatasource $provider [subst {-name $dsName -jndiName $jndiName -dataStoreHelperClassName $datasourceHelperClassname -componentManagedAuthenticationAlias $fullName -containerManagedPersistence false} ]
##Oracle
	} elseif { $driverType == "4" } {
		if { $dbVersion == "Oracle 10g" } {
			set datasourceHelperClassname "com.ibm.websphere.rsadapter.Oracle10gDataStoreHelper"
		} else {
			set datasourceHelperClassname "com.ibm.websphere.rsadapter.Oracle11gDataStoreHelper"
		}
		set dsCache [list statementCacheSize 10]
		##real URL is set later on
		set bogusURL "jdbc:oracle:thin:@dbserverName:1521:dbName"
		$AdminTask createDatasource "$provider" [subst {-name $dsName -jndiName $jndiName -dataStoreHelperClassName $datasourceHelperClassname -componentManagedAuthenticationAlias $fullName -configureResourceProperties {{URL java.lang.String $bogusURL}} -containerManagedPersistence false} ] 
##DB2
	} elseif { $driverType == "5" || $driverType == "6"}  {
		set datasourceHelperClassname "com.ibm.websphere.rsadapter.DB2UniversalDataStoreHelper"
		set dsCache [list statementCacheSize 10]
		$AdminTask createDatasource $provider [subst {-name $dsName -jndiName $jndiName -dataStoreHelperClassName $datasourceHelperClassname -componentManagedAuthenticationAlias $fullName -configureResourceProperties {{databaseName java.lang.String $dbName} {driverType java.lang.Integer 4} {portNumber java.lang.Integer $portNumber} {serverName java.lang.String $dbserverName}} -containerManagedPersistence false}]
	}
	
	set dsatts [list $dsdesc $dsCache]

	set datasources [$AdminConfig getid /DataSource:/]
	foreach datasource $datasources {
		if { [$AdminConfig showAttribute $datasource name] == $dsName } {
			puts "found datasource"
			set ds $datasource
			break
		}
	}
	$AdminConfig modify $ds $dsatts
	
	#Set the properties for the data source.
	set propSet [$AdminConfig create J2EEResourcePropertySet $ds {}]
	puts $propSet
	set attrdbName [subst {{name databaseName} {type java.lang.String} {value "$dbName"}}]
	puts $attrdbName
	set attrserverName [subst {{name serverName} {type java.lang.String} {value $dbserverName}}]
	puts $attrserverName
	set attrPort [subst {{name portNumber} {type java.lang.Integer} {value $portNumber}}]
	puts $attrPort
	set attrDriverType [subst {{name driverType} {type java.lang.Integer} {value 4}}]
	puts $attrDriverType
	set attrResultSetHoldability [subst {{name resultSetHoldability} {type java.lang.Integer} { value 1}}]
	puts $attrResultSetHoldability
	set attrWebSphereDefaultIsolationLevel [subst {{name webSphereDefaultIsolationLevel} {type java.lang.Integer} { value 2}}]
	puts $attrWebSphereDefaultIsolationLevel 
	set attrSelectMethod [subst {{name selectMethod} {type java.lang.String} {value direct}}]
	puts $attrSelectMethod
	set attre2Phase [subst {{name enable2Phase} {type java.lang.Boolean} {value false}}]
	puts  $attre2Phase
	# Set properties for DB2 Client reroute
	if { $ClientRerouteEnable == "true" } {
		puts "Setting properties for DB2 Client reroute"
		set attrretryIntervalForClientReroute [subst {{name retryIntervalForClientReroute} {type java.lang.Integer} {value $retryIntervalForClientReroute}}]
		puts $attrretryIntervalForClientReroute
		set attrmaxRetriesForClientReroute [subst {{name maxRetriesForClientReroute} {type java.lang.Integer} {value $maxRetriesForClientReroute}}]
		puts $attrmaxRetriesForClientReroute
		set attrclientRerouteAlternateServerName [subst {{name clientRerouteAlternateServerName} {type java.lang.String} {value $clientRerouteAlternateServerName}}]
		puts $attrclientRerouteAlternateServerName
		set attrclientRerouteAlternatePortNumber [subst {{name clientRerouteAlternatePortNumber} {type java.lang.String} {value $clientRerouteAlternatePortNumber}}]
		puts $attrclientRerouteAlternatePortNumber
		$AdminConfig create J2EEResourceProperty $propSet $attrretryIntervalForClientReroute
		$AdminConfig create J2EEResourceProperty $propSet $attrmaxRetriesForClientReroute
		$AdminConfig create J2EEResourceProperty $propSet $attrclientRerouteAlternateServerName
		$AdminConfig create J2EEResourceProperty $propSet $attrclientRerouteAlternatePortNumber
	}
	
	# Set properties for DB Failover Support
	if { $dbFailOver == "true" } {
		puts "Enabling DB failover support"
		#  For WAS 6.1, 7 & 8
			set attrvalidateNewConnection [subst {{name validateNewConnection} {type java.lang.Boolean} {value "true"}}]
			puts $attrvalidateNewConnection
			set attrvalidateNewConnectionRetryCount [subst {{name validateNewConnectionRetryCount} {type java.lang.String} {value "100"}}]
			puts $attrvalidateNewConnectionRetryCount
			set attrvalidateNewConnectionRetryInterval [subst {{name validateNewConnectionRetryInterval} {type java.lang.String} { value "3"}}]
			puts $attrvalidateNewConnectionRetryInterval
			$AdminConfig create J2EEResourceProperty $propSet $attrvalidateNewConnection
			$AdminConfig create J2EEResourceProperty $propSet $attrvalidateNewConnectionRetryCount
			$AdminConfig create J2EEResourceProperty $propSet $attrvalidateNewConnectionRetryInterval
			set pool [$AdminConfig showAttribute $ds connectionPool]
			puts $pool
			$AdminConfig modify $pool {{testConnection true}}
			$AdminConfig modify $pool {{testConnectionInterval "0"}}
			
		
	}

##Microsoft JDBC driver for SQL2005, 2008
	if { $driverType == "3" } {
	    if { $dbFailOver == "true" } {
			set attrpreTestSQLString [subst {{name preTestSQLString} {type java.lang.String} { value "SQL select count(*) from sysusers"}}]
			puts $attrpreTestSQLString
			$AdminConfig create J2EEResourceProperty $propSet $attrpreTestSQLString
		}
		$AdminConfig create J2EEResourceProperty $propSet $attrSelectMethod 		 
		$AdminConfig create J2EEResourceProperty $propSet $attre2Phase
		$AdminConfig create J2EEResourceProperty $propSet $attrWebSphereDefaultIsolationLevel 
		if { $wasVersion == "7" || $wasVersion == "8" } {
			set attrlockTimeout [subst {{name lockTimeout} {type java.lang.Integer} {value -1}}]
			puts $attrlockTimeout
			$AdminConfig create J2EEResourceProperty $propSet $attrlockTimeout
		}
	}
##Oracle
	if { $driverType == "4" } {
		if { $oracleRacUrl == "" } {
			append urlString "jdbc:oracle:thin:@" $dbserverName ":" $portNumber ":" $dbName
		} else {
			set urlString $oracleRacUrl
		}
		puts $urlString
		set attrUrl [subst {{name URL} {type java.lang.String} {value $urlString}}]
		puts attrUrl
		if { $dbFailOver == "true" } {
			set attrpreTestSQLString [subst {{name preTestSQLString} {type java.lang.String} { value "SQL SELECT 1 FROM DUAL"}}]
			puts $attrpreTestSQLString
			$AdminConfig create J2EEResourceProperty $propSet $attrpreTestSQLString
		}
		$AdminConfig create J2EEResourceProperty $propSet $attrUrl
		$AdminConfig create J2EEResourceProperty $propSet $attre2Phase
	}
##DB2
	if { $driverType == "5" } {
		if { $dbFailOver == "true" } {
			set attrpreTestSQLString [subst {{name preTestSQLString} {type java.lang.String} { value "SQL SELECT COUNT(*) FROM SYSIBM.SYSTABLES"}}]
			puts $attrpreTestSQLString
			$AdminConfig create J2EEResourceProperty $propSet $attrpreTestSQLString
		}
		$AdminConfig create J2EEResourceProperty $propSet $attrDriverType
		$AdminConfig create J2EEResourceProperty $propSet $attrResultSetHoldability
		$AdminConfig create J2EEResourceProperty $propSet $attrWebSphereDefaultIsolationLevel 
	}
##DB2 z/OS
	if { $driverType == "6"  } {
		if { $dbFailOver == "true" } {
			set attrpreTestSQLString [subst {{name preTestSQLString} {type java.lang.String} { value "SQL SELECT COUNT(*) FROM SYSIBM.SYSTABLES"}}]
			puts $attrpreTestSQLString
			$AdminConfig create J2EEResourceProperty $propSet $attrpreTestSQLString
		}
		$AdminConfig create J2EEResourceProperty $propSet $attrDriverType
		$AdminConfig create J2EEResourceProperty $propSet $attrResultSetHoldability
		$AdminConfig create J2EEResourceProperty $propSet $attrWebSphereDefaultIsolationLevel 
		set zOSDatabaseName [subst {{name zOSDatabaseName} {type java.lang.String} {value "$zOsDbName"}}]
		puts $zOSDatabaseName
		$AdminConfig create J2EEResourceProperty $propSet $zOSDatabaseName
		set zOSDefaultSTOGROUP  [subst {{name zOSDefaultSTOGROUP } {type java.lang.String} {value $zOsDefaultSTOGroup}}]
		puts $zOSDefaultSTOGROUP 
		$AdminConfig create J2EEResourceProperty $propSet $zOSDefaultSTOGROUP
		set zOSSTOGROUPOptions [subst {{name zOSSTOGROUPOptions} {type java.lang.String} {value "$zOsSTOGROUPOptions"}}]
		puts $zOSSTOGROUPOptions
		$AdminConfig create J2EEResourceProperty $propSet $zOSSTOGROUPOptions
	}
	$AdminConfig create J2EEResourceProperty $propSet $attrdbName
	#if { $oracleRacUrl == "" } {
		$AdminConfig create J2EEResourceProperty $propSet $attrserverName 
		$AdminConfig create J2EEResourceProperty $propSet $attrPort
	#}
	$AdminConfig save
}

############################################
# create a XA datasource
############################################
proc createDataSourceXA { wasVersion cellName provider driverType aliasName dsXaName jndiXaName dbName dbserverName portNumber zOsDbName zOsDefaultSTOGroup zOsSTOGROUPOptions oracleRacUrl dbVersion dbFailOver ClientRerouteEnable retryIntervalForClientReroute maxRetriesForClientReroute clientRerouteAlternateServerName clientRerouteAlternatePortNumber} {
	global AdminConfig
	global AdminTask
	set msg "Create DataSource "
	puts [append msg $dsXaName]
	set datasources [$AdminConfig getid /DataSource:/]
	foreach ds $datasources {
		if { [$AdminConfig showAttribute $ds name] == $dsXaName } {
			puts  [append dsXaName " already exists."]
			puts "Done configuring XA DataSource"
			return $ds
		}
	}

	set dsdesc [list description "CEMP DataSource (XA)"]

	if { [$AdminConfig getid /Cell:$cellName/] == "" } {
		puts "Error: Cell not found: $cellName"
		exit
	}

	set fullName $cellName
	append fullName "/" $aliasName

##Microsoft JDBC driver for SQL2005, 2008
	if { $driverType == "3" } {	
		set datasourceHelperClassname "com.ibm.websphere.rsadapter.GenericDataStoreHelper"
		set dsCache [list statementCacheSize 0]		
		set dsatts [list $dsdesc $dsCache]
		$AdminTask createDatasource $provider [subst {-name "$dsXaName" -jndiName "$jndiXaName" -dataStoreHelperClassName "$datasourceHelperClassname" -componentManagedAuthenticationAlias "$fullName" -containerManagedPersistence false} ]
##Oracle
	} elseif { $driverType == "4" } {
		set dsCache [list statementCacheSize 10]		
		if { $dbVersion == "Oracle 10g" } {
			set datasourceHelperClassname "com.ibm.websphere.rsadapter.Oracle10gDataStoreHelper"
		} else {
			set datasourceHelperClassname "com.ibm.websphere.rsadapter.Oracle11gDataStoreHelper"
		}
		set dsatts [list $dsdesc $dsCache]
		##real URL is set later on
		set bogusURL "jdbc:oracle:thin:@dbserverName:1521:dbName"
		$AdminTask createDatasource $provider [subst {-name "$dsXaName" -jndiName "$jndiXaName" -dataStoreHelperClassName "$datasourceHelperClassname" -componentManagedAuthenticationAlias "$fullName" -configureResourceProperties {{URL java.lang.String $bogusURL}} -containerManagedPersistence false} ]
##DB2		
	} elseif { $driverType == "5" || $driverType == "6"}  {
		set dsCache [list statementCacheSize 10]		
		set datasourceHelperClassname "com.ibm.websphere.rsadapter.DB2UniversalDataStoreHelper"
		if { $wasVersion == "5" } {
			set dsatts [list $dsdesc $dsCache]
		} else {
			set attrXaRecovery [list xaRecoveryAuthAlias $fullName]
			set dsatts [list $dsdesc $dsCache $attrXaRecovery]
		}
		$AdminTask createDatasource $provider [subst {-name "$dsXaName" -jndiName "$jndiXaName" -dataStoreHelperClassName "$datasourceHelperClassname" -componentManagedAuthenticationAlias "$fullName" -configureResourceProperties {{databaseName java.lang.String $dbName} {driverType java.lang.Integer 4} {portNumber java.lang.Integer $portNumber} {serverName java.lang.String $dbserverName}} -containerManagedPersistence false} ]
	}

	set datasources [$AdminConfig getid /DataSource:/]
	foreach datasource $datasources {
		if { [$AdminConfig showAttribute $datasource name] == $dsXaName } {
			puts "found datasource"
			set dsxa $datasource
			break
		}
	}

	$AdminConfig modify $dsxa $dsatts
	
	#Set the properties for the data source.
	set propSet [$AdminConfig create J2EEResourcePropertySet $dsxa {}]
	puts $propSet
	set attrdbName [subst {{name databaseName} {type java.lang.String} {value "$dbName"}}]
	puts $attrdbName
	set attrserverName [subst {{name serverName} {type java.lang.String} {value $dbserverName}}]
	puts $attrserverName
	set attrPort [subst {{name portNumber} {type java.lang.Integer} {value $portNumber}}]
	puts $attrPort
	set attrDriverType [subst {{name driverType} {type java.lang.Integer} {value 4}}]
	puts $attrDriverType
	set attrResultSetHoldability [subst {{name resultSetHoldability} {type java.lang.Integer} { value 1}}]
	puts $attrResultSetHoldability
	set attrWebSphereDefaultIsolationLevel [subst {{name webSphereDefaultIsolationLevel} {type java.lang.Integer} { value 2}}]
	puts $attrWebSphereDefaultIsolationLevel 
	set attrSelectMethod [subst {{name selectMethod} {type java.lang.String} {value direct}}]
	puts $attrSelectMethod
	set attre2Phase [subst {{name enable2Phase} {type java.lang.Boolean} {value true}}]
	puts  $attre2Phase
	# Set properties for DB2 Client reroute
	if { $ClientRerouteEnable == "true" } {
		puts "Setting properties for DB2 Client reroute"
		set attrretryIntervalForClientReroute [subst {{name retryIntervalForClientReroute} {type java.lang.Integer} {value $retryIntervalForClientReroute}}]
		puts $attrretryIntervalForClientReroute
		set attrmaxRetriesForClientReroute [subst {{name maxRetriesForClientReroute} {type java.lang.Integer} {value $maxRetriesForClientReroute}}]
		puts $attrmaxRetriesForClientReroute
		set attrclientRerouteAlternateServerName [subst {{name clientRerouteAlternateServerName} {type java.lang.String} {value $clientRerouteAlternateServerName}}]
		puts $attrclientRerouteAlternateServerName
		set attrclientRerouteAlternatePortNumber [subst {{name clientRerouteAlternatePortNumber} {type java.lang.String} {value $clientRerouteAlternatePortNumber}}]
		puts $attrclientRerouteAlternatePortNumber
		$AdminConfig create J2EEResourceProperty $propSet $attrretryIntervalForClientReroute
		$AdminConfig create J2EEResourceProperty $propSet $attrmaxRetriesForClientReroute
		$AdminConfig create J2EEResourceProperty $propSet $attrclientRerouteAlternateServerName
		$AdminConfig create J2EEResourceProperty $propSet $attrclientRerouteAlternatePortNumber
	}
	# Set properties for DB Failover Support
	if { $dbFailOver == "true" } {
		puts "Enabling DB failover support"
		#  For WAS 6.1, 7 & 8
		
			set attrvalidateNewConnection [subst {{name validateNewConnection} {type java.lang.Boolean} {value "true"}}]
			puts $attrvalidateNewConnection
			set attrvalidateNewConnectionRetryCount [subst {{name validateNewConnectionRetryCount} {type java.lang.String} {value "100"}}]
			puts $attrvalidateNewConnectionRetryCount
			set attrvalidateNewConnectionRetryInterval [subst {{name validateNewConnectionRetryInterval} {type java.lang.String} { value "3"}}]
			puts $attrvalidateNewConnectionRetryInterval
			$AdminConfig create J2EEResourceProperty $propSet $attrvalidateNewConnection
			$AdminConfig create J2EEResourceProperty $propSet $attrvalidateNewConnectionRetryCount
			$AdminConfig create J2EEResourceProperty $propSet $attrvalidateNewConnectionRetryInterval
			set pool [$AdminConfig showAttribute $dsxa connectionPool]
			puts $pool
			$AdminConfig modify $pool {{testConnection true}}
			$AdminConfig modify $pool {{testConnectionInterval "0"}}
			
		
	}

##Microsoft JDBC driver for SQL2005, 2008
	if { $driverType == "3" } {
		if { $dbFailOver == "true" } {
			set attrpreTestSQLString [subst {{name preTestSQLString} {type java.lang.String} { value "SQL select count(*) from sysusers"}}]
			puts $attrpreTestSQLString
			$AdminConfig create J2EEResourceProperty $propSet $attrpreTestSQLString
		}
		$AdminConfig create J2EEResourceProperty $propSet $attrSelectMethod
		$AdminConfig create J2EEResourceProperty $propSet $attre2Phase
		$AdminConfig create J2EEResourceProperty $propSet $attrWebSphereDefaultIsolationLevel
		if { $wasVersion == "7" || $wasVersion == "8" } {
			set attrlockTimeout [subst {{name lockTimeout} {type java.lang.Integer} {value -1}}]
			puts $attrlockTimeout
			$AdminConfig create J2EEResourceProperty $propSet $attrlockTimeout
		}
	}
##Oracle
	if { $driverType == "4" } {
		if { $oracleRacUrl == "" } {
			append urlString "jdbc:oracle:thin:@" $dbserverName ":" $portNumber ":" $dbName
		} else {
			set urlString $oracleRacUrl
		}
		puts $urlString
		set attrUrl [subst {{name URL} {type java.lang.String} {value $urlString}}]
		puts attrUrl
		if { $dbFailOver == "true" } {
			set attrpreTestSQLString [subst {{name preTestSQLString} {type java.lang.String} { value "SQL SELECT 1 FROM DUAL"}}]
			puts $attrpreTestSQLString
			$AdminConfig create J2EEResourceProperty $propSet $attrpreTestSQLString
		}
		$AdminConfig create J2EEResourceProperty $propSet $attrUrl 
		$AdminConfig create J2EEResourceProperty $propSet $attre2Phase
		
	}
##DB2
	if { $driverType == "5" } {
		if { $dbFailOver == "true" } {
			set attrpreTestSQLString [subst {{name preTestSQLString} {type java.lang.String} { value "SQL SELECT COUNT(*) FROM SYSIBM.SYSTABLES"}}]
			puts $attrpreTestSQLString
			$AdminConfig create J2EEResourceProperty $propSet $attrpreTestSQLString
		}
		$AdminConfig create J2EEResourceProperty $propSet $attrDriverType
		$AdminConfig create J2EEResourceProperty $propSet $attrWebSphereDefaultIsolationLevel
		
	}
##DB2 z/OS
	if { $driverType == "6" } {
		if { $dbFailOver == "true" } {
			set attrpreTestSQLString [subst {{name preTestSQLString} {type java.lang.String} { value "SQL SELECT COUNT(*) FROM SYSIBM.SYSTABLES"}}]
			puts $attrpreTestSQLString
			$AdminConfig create J2EEResourceProperty $propSet $attrpreTestSQLString
		}
		$AdminConfig create J2EEResourceProperty $propSet $attrDriverType
		$AdminConfig create J2EEResourceProperty $propSet $attrWebSphereDefaultIsolationLevel
		set zOSDatabaseName [subst {{name zOSDatabaseName} {type java.lang.String} {value "$zOsDbName"}}]
		puts $zOSDatabaseName
		$AdminConfig create J2EEResourceProperty $propSet $zOSDatabaseName
		set zOSDefaultSTOGROUP  [subst {{name zOSDefaultSTOGROUP } {type java.lang.String} {value $zOsDefaultSTOGroup}}]
		puts $zOSDefaultSTOGROUP 
		$AdminConfig create J2EEResourceProperty $propSet $zOSDefaultSTOGROUP
		set zOSSTOGROUPOptions [subst {{name zOSSTOGROUPOptions} {type java.lang.String} {value "$zOsSTOGROUPOptions"}}]
		puts $zOSSTOGROUPOptions
		$AdminConfig create J2EEResourceProperty $propSet $zOSSTOGROUPOptions		
	}
	$AdminConfig create J2EEResourceProperty $propSet $attrdbName
	#if { $oracleRacUrl == "" } {
		$AdminConfig create J2EEResourceProperty $propSet $attrserverName 
		$AdminConfig create J2EEResourceProperty $propSet $attrPort
	#}
	$AdminConfig save
}

############################################
# turnoff RMI/IIOP SSL
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
# test datasource before creation
############################################
proc testDBconnection { user password dbname server port driverType wasVersion dbVersion driverVersion isXA oracleRacUrl} {
	puts "testing Database connection"
	global AdminControl
	global AdminConfig
	if { $driverType == "3" } {
	##Microsoft JDBC driver for SQL2005, 2008, 2012
		if { $isXA == "true" } {
			set driver "com.microsoft.sqlserver.jdbc.SQLServerXADataSource"
		} else {
			set driver "com.microsoft.sqlserver.jdbc.SQLServerConnectionPoolDataSource"
		}
		if { $wasVersion == "6" } {
			set driverpath "\$(MSSQLSERVER_JDBC_DRIVER_PATH)/sqljdbc.jar"
		} else {
			if { $driverVersion == "2.0" || $driverVersion == "3.0" || $driverVersion == "4.0"} {
				set driverpath "\$(MICROSOFT_JDBC_DRIVER_PATH)/sqljdbc4.jar"
			} else {
				set driverpath "\$(MICROSOFT_JDBC_DRIVER_PATH)/sqljdbc.jar"
			}			
		} 
		set urlString ""
		set driverTypeString ""
	} elseif { $driverType == "4" } {
	##Oracle
		if { $isXA == "true" } {
			set driver "oracle.jdbc.xa.client.OracleXADataSource"
		} else {
			set driver "oracle.jdbc.pool.OracleConnectionPoolDataSource"
		}
		
		if { $wasVersion == "6" } {
			if { $dbVersion == "Oracle 10g" } {
				set driverpath "\$(ORACLE_JDBC_DRIVER_PATH)/ojdbc14.jar"
			} else {
				set driverpath "\$(ORACLE_JDBC_DRIVER_PATH)/ojdbc5.jar"
			}
		} else {
			if { $dbVersion == "Oracle 10g" } {
				set driverpath "\$(ORACLE_JDBC_DRIVER_PATH)/ojdbc14.jar"
			} else {
				set driverpath "\$(ORACLE_JDBC_DRIVER_PATH)/ojdbc6.jar"
			}
		}
		if { $oracleRacUrl == "" } {
			append urlString "jdbc:oracle:thin:@" $server ":" $port ":" $dbname
		} else {
			set urlString $oracleRacUrl
		}
		set driverTypeString ""
		
	} elseif { $driverType == "5" || $driverType == "6" } {
	##DB2
		if { $isXA == "true" } {
			set driver "com.ibm.db2.jcc.DB2XADataSource"
		} else {
			set driver "com.ibm.db2.jcc.DB2ConnectionPoolDataSource"
		}
		if { $driverVersion == "3.0"} {
			set databaseDriver "db2jcc.jar"
		} else {
			set databaseDriver "db2jcc4.jar"
		}
		if { $driverType == "5" } {
			set driverpath "\$(DB2UNIVERSAL_JDBC_DRIVER_PATH)/${databaseDriver}; \$(DB2UNIVERSAL_JDBC_DRIVER_PATH)/db2jcc_license_cu.jar"
		} else {
			set driverpath "\$(DB2UNIVERSAL_JDBC_DRIVER_PATH)/${databaseDriver}\; \$(DB2UNIVERSAL_JDBC_DRIVER_PATH)/db2jcc_license_cu.jar\; \$(DB2UNIVERSAL_JDBC_DRIVER_PATH)/db2jcc_license_cisuz.jar"
		}
		set urlString ""
		set driverTypeString "4"
	}		
	
	set dshelper [lindex [$AdminControl queryNames "WebSphere:type=DataSourceCfgHelper,*"] 0]
	set dshelperObj [$AdminControl makeObjectName $dshelper]
	
	set dsprops [java::new java.util.Properties]
	$dsprops setProperty databaseName $dbname
	$dsprops setProperty serverName $server
	$dsprops setProperty portNumber $port
	if { $urlString != "" } {
		$dsprops setProperty URL $urlString
	}
	if { $driverTypeString != "" } {
		$dsprops setProperty driverType $driverTypeString
	}

	set parms [java::new {Object[]} {7} ]
	$parms set 0 $driver
	$parms set 1 $user
	$parms set 2 $password
	$parms set 3 $dsprops
	$parms set 4 $driverpath
	$parms set 5 "en"
	$parms set 6 "US"

	set signatures [java::new {String[]} {7}]
	$signatures set 0 "java.lang.String"
	$signatures set 1 "java.lang.String"
	$signatures set 2 "java.lang.String"
	$signatures set 3 "java.util.Properties"
	$signatures set 4 "java.lang.String"
	$signatures set 5 "java.lang.String"
	$signatures set 6 "java.lang.String"

	set result [$AdminControl invoke_jmx $dshelperObj testConnectionToDataSource $parms $signatures]
	set resultString [$result toString]
	set failed [string first "Failed" $resultString]
	set exception [string first "Exception" $resultString]
	puts $resultString
	if { $failed >= 0 || $exception >=0 } {
		exit
	}
	
}

############################################
# test datasource after creation
############################################
proc testDSconnection { dsname } {
	puts "testing Datasource connection"
	global AdminControl
	global AdminConfig
	set ds [$AdminConfig getid /DataSource:$dsname/]
	$AdminControl testConnection $ds 
}

############################################
# reload config
############################################
proc reload {} {
	global AdminControl
	puts "reload config"
	set dshelpers [$AdminControl queryNames type=DataSourceCfgHelper,*]

	foreach dshelper $dshelpers {
		$AdminControl invoke $dshelper reload
	}

	
	set secAdmins [$AdminControl queryNames type=SecurityAdmin,*]

	foreach secAdmin $secAdmins {
		set secAdminObj [$AdminControl makeObjectName $secAdmin]
		set map [java::null]
		set parms [java::new {Object[]} {1} ]
		$parms set 0 $map
		set signatures [java::new {String[]} {1}]
		$signatures set 0 "java.util.HashMap"
		set signatures2 [java::new {String[]} {1}]
		$signatures2 set 0 "java.lang.String"
		$AdminControl invoke_jmx $secAdminObj updateJAASCfg $parms $signatures2
		$AdminControl invoke_jmx $secAdminObj updateAuthDataCfg $parms $signatures
	}
	
	## cluster only - force nodes synchronisation
	set dp [$AdminControl queryNames type=DeploymentManager,*]
	if { $dp != ""} {
		$AdminControl invoke $dp syncActiveNodes true
	}
	 
}
############################################	

# CPT temp - setup DB2 JDBC Driver Path
proc setupJDBCDriverPath { nodeName } {
	global AdminConfig

	set varName DB2UNIVERSAL_JDBC_DRIVER_PATH
	set newVarValue "C:/Program Files/IBM/tdsV6.3db2/java"

	set node [$AdminConfig getid /Node:$nodeName/]
	set varSubstitutions [$AdminConfig list VariableSubstitutionEntry $node]
	foreach varSubst $varSubstitutions {
	   set getVarName [$AdminConfig showAttribute $varSubst symbolicName]
	   if {[string compare $getVarName $varName] == 0} {
	      $AdminConfig modify $varSubst [list [list value $newVarValue]]
	      break
	   } 
	}

	$AdminConfig save
}	



############################################	
setupJDBCDriverPath "P8Node01"
# CPT temp - setup DB2 JDBC Driver Path

global AdminConfig
global AdminTask

testDBconnection $_aliasName $_aliasPassword $_dbName $_dbServerName $_portNumber $_jdbcProviderType $_wasVersion $_dbVersion $_driverVersion "false" $_oracleRacUrl
testDBconnection $_aliasName $_aliasPassword $_dbName $_dbServerName $_portNumber $_jdbcProviderType $_wasVersion $_dbVersion $_driverVersion "true" $_oracleRacUrl

setJAASAuthData $_cellName $_aliasName $_aliasId $_aliasPassword

set _provider [createJDBCProvider $_wasVersion $_cellName $_jdbcProviderType $_jdbcProviderName $_jdbcProviderDesc $_dbVersion $_driverVersion]

set _providerXA [createJDBCProviderXA $_wasVersion $_cellName $_jdbcProviderType $_jdbcProviderName $_jdbcProviderDesc $_dbVersion $_driverVersion]

createDataSource $_wasVersion $_cellName $_provider $_jdbcProviderType $_aliasName $_dsName $_jndiName  $_dbName $_dbServerName $_portNumber $_zOsDbName $_zOsDefaultSTOGroup $_zOsSTOGROUPOptions $_oracleRacUrl $_dbVersion $_dbFailOver $_ClientRerouteEnable $_retryIntervalForClientReroute $_maxRetriesForClientReroute $_clientRerouteAlternateServerName $_clientRerouteAlternatePortNumber
reload

#DTS 923703 - remove the testDSconnection since need a WebSphere restart before you can do TestDSconnection.
#testDSconnection $_dsName

puts "Done configuring DataSource"

createDataSourceXA $_wasVersion $_cellName $_providerXA $_jdbcProviderType $_aliasName $_dsXaName $_jndiXaName  $_dbName $_dbServerName $_portNumber $_zOsDbName $_zOsDefaultSTOGroup $_zOsSTOGROUPOptions $_oracleRacUrl $_dbVersion $_dbFailOver $_ClientRerouteEnable $_retryIntervalForClientReroute $_maxRetriesForClientReroute $_clientRerouteAlternateServerName $_clientRerouteAlternatePortNumber
reload

#DTS 923703 - remove the testDSconnection since need a WebSphere restart before you can do TestDSconnection.
#testDSconnection $_dsXaName

puts "Done configuring XA DataSource"

if { $_turnoffSSLcerts == "true" } {
	turnOffCSI
}


#return 0
