package com.ibm.ecm.edu.icn;

import javax.servlet.http.HttpServletRequest;

import com.ibm.ecm.extension.PluginResponseFilter;
import com.ibm.ecm.extension.PluginServiceCallbacks;
import com.ibm.ecm.json.JSONResultSetColumn;
import com.ibm.ecm.json.JSONResultSetResponse;
import com.ibm.json.java.JSONArray;
import com.ibm.json.java.JSONObject;

public class EDUResultsResponseFilter extends PluginResponseFilter {

	@Override
	public String[] getFilteredServices() {
		return new String[] { "/p8/search", "/p8/openFolder" };
	}

	@Override
	public void filter(String serverType, PluginServiceCallbacks callbacks, HttpServletRequest request, JSONObject jsonResponse) throws Exception {
		JSONResultSetResponse jsonResultSetResponse = (JSONResultSetResponse) jsonResponse;
		
		int i = 0;
		for (i = 0; i < jsonResultSetResponse.getColumnCount(); i++) {
			JSONResultSetColumn column = jsonResultSetResponse.getColumn(i);
			String columnName = (String) column.get("field");

			if (columnName != null && columnName.equals("price")) {
				column.put("decorator", "eduDetailsViewDecorator");
				break;
			}
		}
		
		for (i = 0; i < jsonResultSetResponse.getMagazineColumnCount(); i++) {
			JSONResultSetColumn column = jsonResultSetResponse.getMagazineColum(i);
			String columnName = (String) column.get("field");

			if (columnName != null && columnName.equals("content")) {
				JSONArray fieldsToDisplay = column.getFieldsToDisplay();
				for (int j=0; j < fieldsToDisplay.size(); j++) {
					JSONObject field = (JSONObject)fieldsToDisplay.get(j);
					String fieldName = (String) field.get("field");
					
					if (fieldName != null && fieldName.equals("price")) {
						field.put("decorator", "eduMagazineViewDecorator");
						break;
					}
				}
				
				break;
			}
		}
		
	}

}
