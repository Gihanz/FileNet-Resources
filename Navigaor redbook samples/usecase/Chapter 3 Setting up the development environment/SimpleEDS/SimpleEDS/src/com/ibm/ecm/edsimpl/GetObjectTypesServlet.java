package com.ibm.ecm.edsimpl;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * This Servlet performs the Get Object Types EDS service.
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
@WebServlet(name = "GetObjectTypesServlet", urlPatterns = { "/types" })
public class GetObjectTypesServlet extends HttpServlet {
	
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		String repositoryId = request.getParameter("repositoryId");
	}
}
