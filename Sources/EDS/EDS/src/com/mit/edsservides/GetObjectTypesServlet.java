package com.mit.edsservides;

import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.ibm.json.java.JSONArray;

/**
 * This sample servlet performs the Get Object Types EDS service.
 * The list of supported object types is simply looked up in the ObjectTypes.json file.
 * <p>
 * The request has the following structure:
 * <pre>
 * GET /types?repositoryId=&lt;repositoryId>
 * </pre>
 * The response is in JSON and has the following structure:
 * <pre>
 * [
 * {"symbolicName" : &lt;object type>},
 * // more object types
 * ]
 * </pre>
 */
public class GetObjectTypesServlet extends HttpServlet {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException 
	{
		try
		{
			System.out.println("do get start");
			String repositoryId = req.getParameter("repositoryId");
			System.out.println("sampleEDService.GetObjectTypesServlet: repositoryId="+repositoryId);
			// Note: This sample is not using the repositoryId parameter, and is simply returning the same list of object types regardless of repository.
			InputStream objectTypesStream = this.getClass().getResourceAsStream("/ObjectTypes.json");
			System.out.println("do get 1");
			JSONArray jsonResponse = JSONArray.parse(objectTypesStream);
			System.out.println("do get 2");
			PrintWriter writer = resp.getWriter();
			System.out.println("do get 3");
			jsonResponse.serialize(writer);
			System.out.println("do get 4");
		}
		catch(Exception exc)
		{
			exc.printStackTrace();
			System.out.println(exc.getMessage());
		}
	}

}
