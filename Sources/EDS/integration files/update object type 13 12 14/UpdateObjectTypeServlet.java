package com.mit.edsservides;



/*
 * Licensed Materials - Property of IBM (c) Copyright IBM Corp. 2012 All Rights Reserved.
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

import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.sql.DataSource;

import com.ibm.json.java.JSONArray;
import com.ibm.json.java.JSONObject;

/**
 * This sample servlet implements the Update Object Type EDS service. It looks
 * for json files of the same name as the object type, with an extension of
 * _PropertyData.json. It then uses the information in that JSON file, along
 * with the values of properties passed into the servlet, to construct a
 * response JSON that defines or overrides property values, choice lists, and
 * metadata.
 */
public class UpdateObjectTypeServlet extends HttpServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	//private final String schema = "TESTICNDB";
	private final String edsTable = "EDS_OBJECT";
	private final String edsChoicesTable = "EDS_CHOICES";
	


@Override
public void init(ServletConfig config) throws ServletException {}
	
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		
		String objectType = request.getPathInfo().substring(1);
		InputStream requestInputStream = request.getInputStream();
		JSONObject jsonRequest = JSONObject.parse(requestInputStream);
		String requestMode = jsonRequest.get("requestMode").toString();
		JSONArray requestProperties = (JSONArray) jsonRequest.get("properties");
		JSONArray responseProperties = new JSONArray();
		
		JSONArray propertyData = getPropertyData(objectType,request.getLocale());

		JSONObject clientContext = (JSONObject) jsonRequest
				.get("clientContext");
		String userid = (String) clientContext.get("userid");
		String locale = (String) clientContext.get("locale");
		String desktop = (String) clientContext.get("desktop");

		System.out.println("sampleEDService.UpdateObjectTypeServlet: objectType="+ objectType + "\n requestMode=" + requestMode+ "\n userid=" + userid + "\n desktop=" + desktop+ "\n locale=" + locale);

		// First, for initial object calls, fill in overrides of initial values
		if (requestMode.equals("initialNewObject")) 
		{
			for (int i = 0; i < propertyData.size(); i++) 
			{
				JSONObject overrideProperty = (JSONObject) propertyData.get(i);
				String overridePropertyName = overrideProperty.get("symbolicName").toString();
				if (overrideProperty.containsKey("initialValue")) 
				{
					for (int j = 0; j < requestProperties.size(); j++) 
					{
						JSONObject requestProperty = (JSONObject) requestProperties.get(j);
						String requestPropertyName = requestProperty.get("symbolicName").toString();
						if (overridePropertyName.equals(requestPropertyName)) 
						{
							Object initialValue = overrideProperty.get("initialValue");
							requestProperty.put("value", initialValue);
						}
						if(overridePropertyName.equalsIgnoreCase("Product"))
						{
							System.out.println("ProductType :: :: "+overridePropertyName);
							String value  = overrideProperty.get("choicelist").toString();
							System.out.println("Choicelist ::: Sandeeep p :: "+ value);
						}
					}
				}
			}
		}

		// For both initial and in-progress calls, process the property data to
		// add in choice lists and modified metadata
		for (int i = 0; i < propertyData.size(); i++) 
		{
			JSONObject overrideProperty = (JSONObject) propertyData.get(i);
			String overridePropertyName = overrideProperty.get("symbolicName").toString();
			if (requestMode.equals("initialNewObject")|| requestMode.equals("initialExistingObject")|| requestMode.equals("inProgressChanges")) 
			{
				
				
				if (requestMode.equals("inProgressChanges")) 
				{
					// calculation part.
					
					if(overridePropertyName.equals("LFOrHPCommission")  || overridePropertyName.equals("SLCommission"))
					{
						String value = null;
						for (int a = 0; a< requestProperties.size(); a++) {
						JSONObject requestPropertyHidden = (JSONObject) requestProperties.get(a);
						String requestPropertyName = requestPropertyHidden.get("symbolicName").toString();
						if(requestPropertyName.equalsIgnoreCase("CommissionTypes"))
						{
							value = requestPropertyHidden.get("value").toString();
						// System.out.println("test 2 for prop Name "+requestPropertyName+"\n TransactionAccountForCF "+value);
						}
						if (overridePropertyName.equals("LFOrHPCommission")  || overridePropertyName.equals("SLCommission")) {
							//System.out.println("OBEREE "+overrideProperty.toString());
							//System.out.println("Request Prop Name :: "+requestPropertyName+ " Value of status "+value);
							if(null != value)
							if (value.equals("Manual")) {
							System.out.println(" Setting hidden false :: "+ value);
							overrideProperty.put("displayMode", "readwrite");
							
							
							} 
							else {
								//System.out.println(value);
								overrideProperty.put("displayMode", "readonly");
						}
						//System.out.println("Final Properties for Hiden are "+requestPropertyHidden);
						}
					}
					}
					
				if (overridePropertyName.equals("LoanAmount") || overridePropertyName.equals("LoanRental") || overridePropertyName.equals("LoanVat")) {
					//System.out.println(requestMode.toString());
					String value = null;
					
								for (int a = 0; a< requestProperties.size(); a++) {
								JSONObject requestPropertyHidden = (JSONObject) requestProperties.get(a);
								String requestPropertyName = requestPropertyHidden.get("symbolicName").toString();
								if(requestPropertyName.equalsIgnoreCase("ProductSubType"))
								{
									value = requestPropertyHidden.get("value").toString();
								// System.out.println("test 2 for prop Name "+requestPropertyName+"\n TransactionAccountForCF "+value);
								}
								if (overridePropertyName.equals("LoanAmount") || overridePropertyName.equals("LoanRental") || overridePropertyName.equals("LoanVat")) {
									//System.out.println("OBEREE "+overrideProperty.toString());
									//System.out.println("Request Prop Name :: "+requestPropertyName+ " Value of status "+value);
									if(null != value)
									if (value.equals("LOAN")) {
									System.out.println(" Setting hidden false :: "+ value);
									overrideProperty.put("required", true);
									overrideProperty.put("displayMode", "readwrite");
									} 
									else {
										//System.out.println(value);
										overrideProperty.put("required", false);
										overrideProperty.put("displayMode", "readonly");
								}
								//System.out.println("Final Properties for Hiden are "+requestPropertyHidden);
								}
								}
						}
				}
				//code ended.
				
				
				if (overrideProperty.containsKey("dependentOn")) 
				{
					// perform dependent overrides (such as dependent choice
					// lists) for inProgressChanges calls only
					// although they can be processed for initial calls, it will
					// influence searches (narrowing the search choices)
					if (requestMode.equals("inProgressChanges")) 
					{
						String dependentOn = overrideProperty.get("dependentOn").toString();
						System.out.println("Value is  "+dependentOn);
						
						String dependentValue = overrideProperty.get("dependentValue").toString();
						System.out.println("dependentValue "+dependentValue);
						for (int j = 0; j < requestProperties.size(); j++) 
						{
							JSONObject requestProperty = (JSONObject) requestProperties.get(j);
							String requestPropertyName = requestProperty.get("symbolicName").toString();
							Object value = requestProperty.get("value");
							System.out.println("SECTOR CODE VALUE "+value);
							if (requestPropertyName.equals(dependentOn)&& dependentValue.equals(value)) 
							{
								
								responseProperties.add(overrideProperty);
							}
							//System.out.println(" 1: dep On "+dependentOn + " 2 :dep Vlaue " + dependentValue + " 3: value "+value);
						}
					}
				} 
				else 
				{
					// perform non-dependent overrides. copy over the request
					// property values to maintain
					// the current values
					if (!overrideProperty.containsKey("value")) 
					{
						for (int j = 0; j < requestProperties.size(); j++) 
						{
							JSONObject requestProperty = (JSONObject) requestProperties.get(j);
							String requestPropertyName = requestProperty.get("symbolicName").toString();
							if (requestPropertyName.equals(overridePropertyName)) 
							{
								Object value = requestProperty.get("value");
								overrideProperty.put("value", value);
							}
						}
					}
					responseProperties.add(overrideProperty);
				}
			}

			// For final calls, perform custom validations and property
			// overrides
			if (requestMode.equals("finalNewObject")|| requestMode.equals("finalExistingObject")) 
			{
				if (overrideProperty.containsKey("validateAs")) 
				{
					// perform custom validation
					String validationType = overrideProperty.get("validateAs").toString();

					if (validationType.equals("NoThrees")) 
					{
						// a sample validation that simply restricts the field
						// from having a 3 anywhere
						String symbolicName = overrideProperty.get("symbolicName").toString();
						for (int j = 0; j < requestProperties.size(); j++) 
						{
							JSONObject requestProperty = (JSONObject) requestProperties.get(j);
							String requestPropertySymbolicName = requestProperty.get("symbolicName").toString();
							if (requestPropertySymbolicName.contains("[")) 
							{ // child
								// component
								// index..
								// ignore
								requestPropertySymbolicName = requestPropertySymbolicName.substring(0,requestPropertySymbolicName.indexOf("["));
							}
							if (symbolicName
									.equals(requestPropertySymbolicName))
							{
								String requestValue = requestProperty.get(
										"value").toString();
								String error = null;
								if (requestValue.contains("3")|| requestValue.toLowerCase().contains("three")|| requestValue.toLowerCase().contains("third")) 
								{
									error = "This field cannot contain any threes";
								}
								if (error != null) 
								{
									JSONObject returnProperty = (JSONObject) overrideProperty.clone();
									returnProperty.put("customValidationError",error);
									returnProperty.put("symbolicName",requestProperty.get("symbolicName"));
									responseProperties.add(returnProperty);
								}
							}
						}
					}
				} else if (overrideProperty.containsKey("timestamp")) {
					//System.out.println("*****in else if of timestamp******");
					//System.out.println(overrideProperty.containsKey("timestamp"));
					// This is an example of a custom property override. The
					// user will not see this value but it will be saved. This
					// custom property override will fill in a property with the
					// current time.
					for (int j = 0; j < requestProperties.size(); j++) {
						//System.out.println("******in forloop of timestamp********");

						JSONObject requestProperty = (JSONObject) requestProperties.get(j);
						//System.out.println("*********requestProperty********"+requestProperty);

						if (overrideProperty.get("symbolicName").equals(requestProperty.get("symbolicName")))
							//System.out.println("in if condition of override property");

						{
							JSONObject returnProperty = new JSONObject();
							//System.out.println("************returnProperty****************");

							returnProperty.put("symbolicName",requestProperty.get("symbolicName"));
							//System.out.println("*********************"+returnProperty.get("symbolicName"));
							returnProperty.put("value", (new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss")).format(new Date(System.currentTimeMillis())));
							//System.out.println("**********value**************"+returnProperty.get("value"));
							responseProperties.add(returnProperty);
							//System.out.println("**********"+responseProperties.add(returnProperty));
						}
					}
				}
			}
		}

		// Send the response json
		JSONObject jsonResponse = new JSONObject();
		jsonResponse.put("properties", responseProperties);
		System.out.println("TEST LATS  ::  "+jsonResponse.toString());
		PrintWriter writer = response.getWriter();
		jsonResponse.serialize(writer);
	}

	private JSONArray getPropertyData(String objectType, Locale locale)throws IOException {
		// First look for a locale specific version of the property data.
		/*
		 * InputStream propertyDataStream =
		 * this.getClass().getResourceAsStream(objectType.replace(' ',
		 * '_')+"_PropertyData_"+locale.toString()+".json"); if
		 * (propertyDataStream == null) { // Look for a locale independent
		 * version of the property data propertyDataStream =
		 * this.getClass().getResourceAsStream(objectType.replace(' ',
		 * '_')+"_PropertyData.json"); } JSONArray jsonPropertyData =
		 * JSONArray.parse(propertyDataStream); return jsonPropertyData;
		 */
		//System.out.println("0 get property data");
		JSONArray jsonPropertyData = new JSONArray();
		Connection con = null;
		try {
			System.out.println("inside try updateservlet");
			Context ctx = new InitialContext();
			DataSource ds = (DataSource) ctx.lookup("cfds");
			System.out.println("1");
			con = ds.getConnection();
			//System.out.println("2");
			// Query the database for EDS data
			Statement stmt = con.createStatement();
			//System.out.println("3");

			/* ResultSet results = stmt.executeQuery("SELECT " + edsTable +
			  ".OBJECTTYPE," + edsTable + ".PROPERTY," + edsTable +
			  ".DISPMODE," + edsTable + ".REQUIRED," + edsTable + ".HIDDEN," +
			  edsTable + ".MAXVAL," + edsTable + ".MINVAL," + edsTable +
			  ".MAXLEN," + edsTable + ".FORMAT," + edsTable + ".FORMATDESC," +
			  edsTable + ".HASDEPENDANT," + edsChoicesTable + ".LISTDISPNAME,"
			  + edsChoicesTable + ".DISPNAME," + edsChoicesTable + ".VALUE," +
			  edsChoicesTable + ".DEPON," + edsChoicesTable + ".DEPVALUE" +
			  " FROM " + schema + '.' + edsTable + ' ' + edsTable +
			  " LEFT JOIN " + schema + '.' + edsChoicesTable + ' ' +
			  edsChoicesTable + " ON " + edsTable + ".OBJECTTYPE=" +
			  edsChoicesTable + ".OBJECTTYPE" + " AND " + edsTable +
			  ".PROPERTY=" + edsChoicesTable + ".PROPERTY" + " AND " +
			  edsChoicesTable + ".LANG='" + locale + "'" + " where " + edsTable
			  + ".OBJECTTYPE='" + objectType + "'" + " ORDER BY " +
			  edsChoicesTable + ".DEPON," + edsChoicesTable + ".DEPVALUE");*/

			//System.out.println(locale.toString());
			//System.out.println(objectType);

			System.out.println("SELECT EDS_OBJECT.OBJECTTYPE,EDS_OBJECT.PROPERTY,EDS_OBJECT.DISPMODE,EDS_OBJECT.REQUIRED,EDS_OBJECT.HIDDEN,EDS_OBJECT.MAXVAL,EDS_OBJECT.MINVAL,EDS_OBJECT.MAXLEN,EDS_OBJECT.FORMAT,EDS_OBJECT.FORMATDESC,EDS_OBJECT.HASDEPENDANT,EDS_OBJECT.LABEL,EDS_CHOICES.LISTDISPNAME,EDS_CHOICES.DISPNAME,EDS_CHOICES.VALUE,EDS_CHOICES.DEPON,EDS_CHOICES.DEPVALUE FROM EDS_OBJECT EDS_OBJECT LEFT JOIN EDS_CHOICES EDS_CHOICES ON EDS_OBJECT.OBJECTTYPE=EDS_CHOICES.OBJECTTYPE AND EDS_OBJECT.PROPERTY=EDS_CHOICES.PROPERTY AND EDS_CHOICES.LANG='" + locale + "'" + " where " + "EDS_OBJECT" + ".OBJECTTYPE='" + objectType + "'" + " ORDER BY " + "EDS_CHOICES" + ".LISTDISPNAME");
			ResultSet results = stmt.executeQuery("SELECT EDS_OBJECT.OBJECTTYPE,EDS_OBJECT.PROPERTY,EDS_OBJECT.DISPMODE,EDS_OBJECT.REQUIRED,EDS_OBJECT.HIDDEN,EDS_OBJECT.MAXVAL,EDS_OBJECT.MINVAL,EDS_OBJECT.MAXLEN,EDS_OBJECT.FORMAT,EDS_OBJECT.FORMATDESC,EDS_OBJECT.HASDEPENDANT,EDS_OBJECT.LABEL,EDS_CHOICES.LISTDISPNAME,EDS_CHOICES.DISPNAME,EDS_CHOICES.VALUE,EDS_CHOICES.DEPON,EDS_CHOICES.DEPVALUE FROM EDS_OBJECT EDS_OBJECT LEFT JOIN EDS_CHOICES EDS_CHOICES ON EDS_OBJECT.OBJECTTYPE=EDS_CHOICES.OBJECTTYPE AND EDS_OBJECT.PROPERTY=EDS_CHOICES.PROPERTY AND EDS_CHOICES.LANG='" + locale + "'" + " where " + "EDS_OBJECT" + ".OBJECTTYPE='" + objectType + "'" + " ORDER BY " + "EDS_CHOICES" + ".LISTDISPNAME");
			//System.out.println("4");
			String property = null;
			String listDispName = null;
			boolean firstLoop = true;
			String dependentOn = null;
			String dependentValue = null;
			JSONObject propertyJson = new JSONObject();
			JSONObject choiceList = new JSONObject();
			JSONArray choices = new JSONArray();
			//System.out.println("5");
			// iterate through the EDS data and build the corresponding JSON

			while (results.next()) 
			{
				//System.out.println("6");
				String propertyTemp = results.getString("property");
				//System.out.println(propertyTemp);
				if (firstLoop) 
				{
					//System.out.println("6.0");
					property = propertyTemp;
					listDispName = results.getString("listdispname");
					//System.out.println(listDispName);
					propertyJson = fillBasicProperties(results, property);
					firstLoop = false;
				}
				//System.out.println("7");
				// check if the property is different to the one
				// in the previous loop
				if (!propertyTemp.equals(property)) 
				{
					//System.out.println("8");
					if (!choices.isEmpty())
					{
						//System.out.println("9");
						choiceList.put("displayName", listDispName);
						choiceList.put("choices", choices);
						propertyJson.put("choiceList", choiceList);
						listDispName = results.getString("listdispname");
						choiceList = new JSONObject();
						choices = new JSONArray();
					}
					jsonPropertyData.add(propertyJson);
					property = propertyTemp;
					propertyJson = fillBasicProperties(results, property);
				}
				String listDispNameTemp = results.getString("listdispname");
				//System.out.println(listDispNameTemp);
				if (!results.wasNull()) 
				{
					//System.out.println("10");
					if (!listDispNameTemp.equals(listDispName))
					{
						//System.out.println("11");
						choiceList.put("displayName", listDispName);
						choiceList.put("choices", choices);
						propertyJson.put("choiceList", choiceList);
						// close property, add to array and create new
						jsonPropertyData.add(propertyJson);
						listDispName = listDispNameTemp;
						choiceList = new JSONObject();
						choices = new JSONArray();
					}
				} 
				else
				{
					// no choice list attached, continue to next loop
					continue;
				}
				//System.out.println("12");
				String dependentOnTemp = results.getString("depon");
				String dependentValueTemp = results.getString("depvalue");
				// check if there is a dependenOn/Value
				// set for the choice list
				if ((null != dependentOnTemp && null != dependentValueTemp&& !dependentOnTemp.isEmpty() && !dependentValueTemp.isEmpty()))
				{
					// historic values are null, set dependentOn/dependentValue
					if (null == dependentOn && null == dependentValue) 
					{
						dependentOn = dependentOnTemp;
						dependentValue = dependentValueTemp;
						propertyJson.put("dependentOn", dependentOn);
						propertyJson.put("dependentValue", dependentValue);

					} 
					else 
					{
						// historic values are not null but different,
						// start new dependent list
						if (!dependentOnTemp.equals(dependentOn)|| !dependentValueTemp.equals(dependentValue))
						{
							dependentOn = dependentOnTemp;
							dependentValue = dependentValueTemp;
							propertyJson = fillBasicProperties(results,property);
							propertyJson.put("dependentOn", dependentOn);
							propertyJson.put("dependentValue", dependentValue);
						}
					}
				}
				//System.out.println("13");
				JSONObject choice = new JSONObject();
				choice.put("displayName", results.getString("dispname"));

				choice.put("value", results.getString("value"));

				//System.out.println(results.getString("dispname") + " , "+ results.getString("value"));
				choices.add(choice);

				//added code
				choiceList.put("displayName", listDispName);
				choiceList.put("choices", choices);
				propertyJson.put("choiceList", choiceList);
				//System.out.println("the choiceList "+propertyJson.get("choiceList"));
			}
			// add the last property
			jsonPropertyData.add(propertyJson);
			stmt.close();
			con.close();
		} catch (NamingException e) 
		{
			e.printStackTrace();
			System.out.println(e.getMessage());
		} 
		catch (SQLException se)
		{
			System.out.println("SQL Exception:");
			// Loop through the SQL Exceptions
			while (se != null)
			{
				System.out.println("hata State : " + se.getSQLState());
				System.out.println("hata Message: " + se.getMessage());
				System.out.println("hata Error : " + se.getErrorCode());
				se = se.getNextException();
			}
		}
		catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
		}
		
		finally 
		{
			try {
				if (null != con && !con.isClosed())
					con.close();
			} catch (SQLException se) {
				System.out.println("SQL Exception:");
				// Loop through the SQL Exceptions
				while (se != null) {
					System.out.println("hata 2 State : " + se.getSQLState());
					System.out.println("hata 2 Message: " + se.getMessage());
					System.out.println("hata 2 Error : " + se.getErrorCode());
					se = se.getNextException();
				}
			}
		}
		return jsonPropertyData;
	}

	/**
	 * read properties from EDS table and start new property
	 * 
	 * @param results
	 * @param property
	 * @return
	 * @throws SQLException
	 */
	private JSONObject fillBasicProperties(ResultSet results, String property)
			throws SQLException {
		JSONObject propertyJson = new JSONObject();
		//System.out.println(property);
		propertyJson.put("symbolicName", property);
		// check all the optional settings
		String displayMode = results.getString("dispmode");
		if (!results.wasNull() &&  displayMode.equals(true))
			propertyJson.put("displayMode", true);
		String label = results.getString("label");
		if (!results.wasNull())
			propertyJson.put("label", label);
		System.out.println("LABEL:: "+label);
		String required = results.getString("required");
		if (!results.wasNull() && '1' == required.charAt(0))
			propertyJson.put("required",true);
		//System.out.println("in required:::::::::::::::"+propertyJson.get("required"));

		String hidden = results.getString("hidden");
		if (!results.wasNull() && '1' == hidden.charAt(0))
			//System.out.println("after hiden");
		propertyJson.put("hidden", true);
		//System.out.println("in hidden:::::::::::::::"+propertyJson.get("hidden"));

		Integer maxVal = results.getInt("maxval");
		if (!results.wasNull())
			propertyJson.put("maxValue", maxVal);

		Integer minVal = results.getInt("minval");
		if (!results.wasNull())
			propertyJson.put("minValue", minVal);

		Integer maxLen = results.getInt("maxlen");
		if (!results.wasNull())
			propertyJson.put("maxLength", maxLen);

		String format = results.getString("format");
		if (!results.wasNull())
			propertyJson.put("format", format);

		String formatdesc = results.getString("formatdesc");
		if (!results.wasNull())
			propertyJson.put("formatDescription", formatdesc);

		String hasDependant = results.getString("hasdependant");
		if (!results.wasNull() && '1' == hasDependant.charAt(0))
			propertyJson.put("hasDependentProperties", true);

		//System.out.println("sonu" +propertyJson);
		return propertyJson;

	}
}

