package com.ibm.ecm.edsimpl;

import java.io.IOException;
import java.io.InputStream;
import java.util.Locale;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.ibm.json.java.JSONArray;
import com.ibm.json.java.JSONObject;

/**
 * This Servlet implements the Update Object Type EDS service.
 */
@WebServlet(name = "UpdateObjectTypeServlet", urlPatterns = { "/type/*" })
public class UpdateObjectTypeServlet extends HttpServlet {
	
	/*
	 * Below is an example of the request JSON structure:
	 *
	 *	POST /type/<object type name>
	 *	
	 *	{
			"repositoryId":"<target repository>",
			"objectId" : "<if an existing instance, the GUID, PID, etc>",
			"requestMode" : "<indicates context that info is being requested>",
			"externalDataIdentifier" : "<opaque identifier meaningful to service">,
			"properties":
			[
				{
					"symbolicName" : "<symbolic_name>", 
					"value" : <The current value>,
				}
				// More properties ...
			],
			"clientContext":
			{
				"userid":"<user id>",
				"locale":"<browser locale>",
				"desktop": "<desktop id>"
			}
		}
	 *
	 * The requestMode has values:
	 *  initialNewObject -- when a new object is being created (when add doc, create folder, checkin dialogs first appear)
	 *  initialExistingObject -- when an existing object is being edited (when edit properties first appears)
	 *  inProgressChanges -- when an object is being modified (for dependent choice lists)
	 *  finalNewObject -- before the object is persisted (when action is performed on add doc, create folder, checkin)
	 *  finalExistingObject -- before the existing object is persisted (when save action is performed on edit properties)
	 */

	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		String objectType = request.getPathInfo().substring(1);
		
		// Get the request json
		InputStream requestInputStream = request.getInputStream();
		JSONObject jsonRequest = JSONObject.parse(requestInputStream);
		String requestMode = jsonRequest.get("requestMode").toString();
		JSONArray requestProperties = (JSONArray)jsonRequest.get("properties");
		JSONArray responseProperties = new JSONArray();
		JSONArray propertyData = getPropertyData(objectType, request.getLocale());
		JSONObject clientContext = (JSONObject)jsonRequest.get("clientContext");
		String userid = (String)clientContext.get("userid");
		String locale = (String)clientContext.get("locale");
		String desktop = (String)clientContext.get("desktop");

		// Add your custom logic here to populate the response JSON.
	}
	
	private JSONArray  getPropertyData(String objectType, Locale locale) throws IOException {
		// First look for a locale specific version of the property data.
		InputStream propertyDataStream = this.getClass().getResourceAsStream(objectType.replace(' ', '_')+"_PropertyData_"+locale.toString()+".json");
		if (propertyDataStream == null) {
			// Look for a locale independent version of the property data
			propertyDataStream = this.getClass().getResourceAsStream(objectType.replace(' ', '_')+"_PropertyData.json");
		}
		JSONArray jsonPropertyData = JSONArray.parse(propertyDataStream);
		return jsonPropertyData;
	}

}

/*
 * Below is an example of how the JSON response should be structured:
{
	"externalDataIdentifier" : "<opaque identifier meaningful to service>",
	"properties":
	[
		{
			"symbolicName" : "<symbolic_name>",
			"value" : <potential new value>,
			"customValidationError" : "Description of an invalid reason",
			"customInvalidItems" : [0,3,4,8], // invalid multi-value items
			"displayMode" : "<readonly/readwrite>",
			"required" : <true or false>,
			"hidden" : <true or false>,
			"maxValue" : <overridden max value>,
			"minValue" : <overridden min value>,
			"maxLength" : <underlying max>,
			"format": <regular expression validating the format>,
			"formatDescription": <human readable description of the format>,
			"choiceList" :
			{
				"displayName" : "<display_name>",
				"choices" :
				[
					{
						"displayName" : "<name>"
						"active": <true or false>
						"value" : <value>
					},
					// More choices ...
				]
			}  // Or the special values:
			   //
			   //	Value			Description
			   //	---------		-----------------------------
			   //	"default"		Use class defined choice list (if any). 
			   //	null			Removes the currently assigned choice list.
			   //
			   // When no choice list is used, Navigator will create a choice list from the list of valid values, if valid values are defined.
			"hasDependentProperties" : <true or false>,
		},
		// More properties ...
	]
}
*/
