/*
 * Licensed Materials - Property of IBM (c) Copyright IBM Corp. 2012, 2013 All Rights Reserved.
 * 
 * US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP Schedule Contract with
 * IBM Corp.
 * 
 * DISCLAIMER OF WARRANTIES :
 * 
 * Permission is granted to copy and modify this Sample code, and to distribute modified versions provided that both the
 * copyright notice, and this permission notice and warranty disclaimer appear in all copies and modified versions.
 * 
 * THIS SAMPLE CODE IS LICENSED TO YOU AS-IS. IBM AND ITS SUPPLIERS AND LICENSORS DISCLAIM ALL WARRANTIES, EITHER
 * EXPRESS OR IMPLIED, IN SUCH SAMPLE CODE, INCLUDING THE WARRANTY OF NON-INFRINGEMENT AND THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE. IN NO EVENT WILL IBM OR ITS LICENSORS OR SUPPLIERS BE LIABLE FOR
 * ANY DAMAGES ARISING OUT OF THE USE OF OR INABILITY TO USE THE SAMPLE CODE, DISTRIBUTION OF THE SAMPLE CODE, OR
 * COMBINATION OF THE SAMPLE CODE WITH ANY OTHER CODE. IN NO EVENT SHALL IBM OR ITS LICENSORS AND SUPPLIERS BE LIABLE
 * FOR ANY LOST REVENUE, LOST PROFITS OR DATA, OR FOR DIRECT, INDIRECT, SPECIAL, CONSEQUENTIAL, INCIDENTAL OR PUNITIVE
 * DAMAGES, HOWEVER CAUSED AND REGARDLESS OF THE THEORY OF LIABILITY, EVEN IF IBM OR ITS LICENSORS OR SUPPLIERS HAVE
 * BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
 */

package com.ibm.ecm.extension.sample;

import javax.servlet.http.HttpServletRequest;

import com.ibm.ecm.extension.PluginResponseFilter;
import com.ibm.ecm.extension.PluginServiceCallbacks;
import com.ibm.json.java.JSONArray;
import com.ibm.json.java.JSONObject;

/**
 * This sample filter modifies the open content class JSON to demonstrate two capabilities:
 * <ol>
 * <li>To add a custom property formatter. Custom property formatters can be used to provide an alternate widget for the
 * property values in the property display grid. The custom property formatter for this sample is in
 * com.ibm.ecm.extension.sample.WebContent.samplePluginDojo.SamplePropertyFormatter.js
 * <li>To add a custom property editor. Custom property editors can be used to provide an alternate widget for the
 * editable properties shown in the add/edit properties dialog. The custom property editor for this sample is in
 * com.ibm.ecm.extension.sample.WebContent.samplePluginDojo.SamplePropertyEditor.js
 * </ol>
 * To prevent the results changes from always happening, the logic will only take effect if the desktop's id is
 * "sample". It also only effects the following classes:
 * <ol>
 * <li>P8 - Document
 * <li>CM8 - NOINDEX
 * </ol>
 */
public class SamplePluginOpenClassResponseFilter extends PluginResponseFilter {

	public String[] getFilteredServices() {
		return new String[] { "/p8/openContentClass", "/cm/openContentClass" };
	}

	public void filter(String serverType, PluginServiceCallbacks callbacks, HttpServletRequest request, JSONObject jsonResponse) throws Exception {
		String templateName = request.getParameter("template_name");

		String desktopId = request.getParameter("desktop");
		if (desktopId != null && desktopId.equals("sample") && (templateName.equalsIgnoreCase("Document") || templateName.equalsIgnoreCase("NOINDEX"))) {
			JSONArray properties = (JSONArray) jsonResponse.get("criterias");

			for (int i = 0; i < properties.size(); i++) {
				JSONObject jsonPropDef = (JSONObject) properties.get(i);
				String name = (String) jsonPropDef.get("name");

				if (name != null && (name.equals("DocumentTitle") || (name.equals("USER_ID")))) { // only updates document title entries
					jsonPropDef.put("propertyEditor", "samplePluginDojo/SamplePropertyEditor");
				}
				if (name != null && (name.equals("modifiedBy") || name.equals("createdBy") || name.equals("LastModifier") || name.equals("Creator") || name.equals("USER_ID"))) {
					jsonPropDef.put("propertyFormatter", "samplePluginDojo/SamplePropertyFormatter");
				}
			}
		}
	}

}
