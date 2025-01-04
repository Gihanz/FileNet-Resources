package com.ntb.acntopen;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.ntb.dto.FnetGetData;

/**
 * Servlet implementation class AcntOpen
 */
public class AcntOpen extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public AcntOpen() {
        super();
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

		String uri = "http://172.25.103.101:9080/wsi/FNCEWS40MTOM";
		String CEusername = "fcnadmin";
		String CEpassword = "pass#word1";
		String ObctStore="fceos";
		String connectnPoint="fcecp";
		String queueName = "s_sig";	
		
		//String wobNum= request.getParameter("wobNum");
		String wobNum="";
		
		String signaturePath="C:\\Program Files (x86)\\IBM\\WebSphere\\AppServer\\profiles\\NTBProfile\\installedApps\\fceCell01\\navigator.ear\\navigator.war\\test\\";
		
		String serial="0021400013";
		
	      
		
        FnetGetData.GetData(uri, CEusername, CEpassword, ObctStore, connectnPoint, queueName, wobNum, signaturePath, serial);
        
        
        
	}

}
