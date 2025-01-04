package com.mit.signature;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.mit.dto.TestDbAccess;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;

/**
 * Servlet implementation class GetSign
 */
public class GetSign extends HttpServlet {
	private static final long serialVersionUID = 1L;

    /**
     * Default constructor. 
     */
    public GetSign() {
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doPost(request, response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		
		String customer= TestDbAccess.getCustomer();
		
		System.out.println(customer);
		
		  response.setContentType("application/json");
		  PrintWriter out = response.getWriter();
		  
		 
		  out.print("{\"items\":");
		  out.print("[");
		  
	      out.print("{");
	      out.println("\"actor\": \""+customer+"\",");
	      out.println("\"title\": \"Sharma\",");
	      out.println("\"director\": \"dfdsfDevesh\",");
	      out.println("\"description\": \"Devdffdfesh\"");      
	      out.println("}");    
	      
	      
	      out.print("]}");
	      out.close();
	      
	      
//	      String x="{\"items\":";
//	      x+="[{";
//	      x+="\"actor\": \"Devesh\",";
//	      x+="\"title\": \"Sharma\",";
//	      x+="\"description\": \"Devdffdfesh\"";
//	      x+="}]}";
//	      
//	      
//	       File file = new File("C:\\Program Files (x86)\\IBM\\WebSphere\\AppServer\\profiles\\NTBProfile\\installedApps\\fceCell01\\navigator.ear\\navigator.war\\c.json");
//	      
//			// if file doesnt exists, then create it
//			if (!file.exists()) {
//				file.createNewFile();
//			}
//
//			FileWriter fw = new FileWriter(file.getAbsoluteFile());
//			BufferedWriter bw = new BufferedWriter(fw);
//			bw.write(x);
//			bw.close();
			
			
			
			
			
	}

}
