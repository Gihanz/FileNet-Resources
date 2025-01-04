package com.ibm.ecm.extension.sample;

import javax.servlet.http.HttpServletRequest;

import com.ibm.ecm.extension.PluginRequestFilter;
import com.ibm.ecm.extension.PluginRequestUtil;
import com.ibm.ecm.extension.PluginServiceCallbacks;
import com.ibm.json.java.JSONArray;
import com.ibm.json.java.JSONArtifact;
import com.ibm.json.java.JSONObject;
/**
 * This sample filter modifies the search request to demonstrate the capabilities:
 * <ol>
 * <li>To add a request parameter. The set parameter will be accessed in the SamplePluginResponseFilter to update some user response.
 * </li>
 * 
 * </ol>
 * To prevent the results changes from always happening, the logic will only take effect
 * if the desktop's id is "sample".
 */

public class SamplePluginRequestFilter extends PluginRequestFilter {

	@Override
	public String[] getFilteredServices() {
		return new String[] { "/p8/search", "/cm/search", "/cmis/search", "/p8/openFolder", "/cm/openFolder", "/cmis/openFolder" };
	}

	@Override
	public JSONObject filter(PluginServiceCallbacks callbacks, HttpServletRequest request, JSONArtifact jsonRequest) throws Exception {
		JSONObject jsonRequestObject=null;
		String desktopId = request.getParameter("desktop");
		if (desktopId != null && desktopId.equals("sample")) {
			
			PluginRequestUtil.setRequestParameter(request, "SampleColumWidth", "55px");
			
			if (jsonRequest != null)
				jsonRequestObject = (JSONObject)((JSONArray)jsonRequest).get(0);   // note, the new property data comes as a list, although only one item right now
			return jsonRequestObject;
		}
		
		return jsonRequestObject;
	}

}
