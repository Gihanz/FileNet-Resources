package com.mit.dto;

import java.io.IOException;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Properties;

public class TestDbAccess {

	 static String driver = "oracle.jdbc.driver.OracleDriver";
	 static String url = "jdbc:oracle:thin:@172.25.102.128:1521:orcl";
	 static String user = "system";
	 static String password = "oracle";
     
     
	public static void main(String[] args) {
	
		TestDbAccess data = new TestDbAccess();
		String x=data.getCustomer();
		
		System.out.println(x);
		
	}
	
	
	
	public static String getCustomer(){
		
		String val="";
		String serial="";
		String acntno="";
		String cusname="";
		String cif="";
		String nic="";
		String sign="";
		String newsign="";
		
    try {
			
           
            try {
				Class.forName(driver);
			} catch (ClassNotFoundException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
            try {
				Connection connection = DriverManager.getConnection(url, user, password);
				System.out.println(connection);
				
				Statement statement = connection.createStatement();
	            ResultSet rs = statement.executeQuery("select * from customer");
	             
				System.out.println("sfvsfv");
				
	            while(rs.next()) {	            	
	            	System.out.println("sdfdsf");
	            	
	            	serial=rs.getString(2);
	            	acntno=rs.getString(3);
	            	cusname=rs.getString(4);
	            	cif=rs.getString(5);
	            	nic=rs.getString(6);
	            	sign=rs.getString(7);
	            	newsign=rs.getString(8);   
	            	
	            	System.out.println(newsign);
	            	
	            }				
				
				//DbAccess.getCustomers();
				
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
       
        	
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}	
		
		return val;
	}

}
