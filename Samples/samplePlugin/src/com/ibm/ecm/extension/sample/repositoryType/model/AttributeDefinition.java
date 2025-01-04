package com.ibm.ecm.extension.sample.repositoryType.model;

import com.ibm.json.java.JSONObject;

public class AttributeDefinition {

	private Connection connection;
	private JSONObject attributeDefinitionJSON;
	
	public AttributeDefinition(Connection connection, JSONObject attributeDefinitionJSON) {
		this.connection = connection;
		this.attributeDefinitionJSON = attributeDefinitionJSON;
	}
	
	public String getId() {
		return (String)attributeDefinitionJSON.get("id");
	}

	public String getName() {
		return (String)attributeDefinitionJSON.get("name");
	}
	
	public String getType() {
		if (attributeDefinitionJSON.containsKey("type")) {
			return (String)attributeDefinitionJSON.get("type");
		}
		return "xs:string";
	}
	
	public int getMaxLength() {
		if (attributeDefinitionJSON.containsKey("maxLength")) {
			return ((Long)attributeDefinitionJSON.get("maxLength")).intValue();
		}
		return 0;
	}
	
	public boolean isSystem() {
		if (attributeDefinitionJSON.containsKey("system")) {
			return (Boolean)attributeDefinitionJSON.get("system");
		}
		return false;
	}
	
}
