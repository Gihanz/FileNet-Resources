package com.mit.resources;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

import com.mit.constants.CFPropertiesConstants;




public class ResourceLoader {

	//To read from Properties file
	private static Properties messageProperties = null;

	
	/**
	 * Loading STAIPProperties.properties
	 * 
	 * @return messageProperties
	 * @throws IOException
	 */
	public static ResourceLoader getInstance() throws IOException {
		
		ResourceLoader objResourceLoader = new ResourceLoader();
		
		messageProperties = new Properties();
		System.out.println("IN rsloader");
		
		InputStream inputStream = new ResourceLoader().getClass().getResourceAsStream(CFPropertiesConstants.PROPERTY_FILE_PATH);					
		
		messageProperties.load(inputStream);
		
		inputStream.close();
		System.out.println(objResourceLoader.hashCode());

		return objResourceLoader;
	}

	/**
	 * This method Return the Message Properties object
	 * @return the Message Properties object
	 */
	public static Properties getMessageProperties() {
		
		return messageProperties;
	}

	/**
	 * This method sets the Message Properties object
	 * 
	 * @param messageProperties the value to set
	 */
	public static void setMessageProperties(Properties messageProperties) {
		
		ResourceLoader.messageProperties = messageProperties;
	}
	
}
