package com.ntb.dto;

import java.io.BufferedOutputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.util.Iterator;

import com.filenet.api.collection.ContentElementList;
import com.filenet.api.collection.RepositoryRowSet;
import com.filenet.api.core.Connection;
import com.filenet.api.core.ContentTransfer;
import com.filenet.api.core.Document;
import com.filenet.api.core.Domain;
import com.filenet.api.core.Factory;
import com.filenet.api.core.ObjectStore;
import com.filenet.api.query.RepositoryRow;
import com.filenet.api.query.SearchSQL;
import com.filenet.api.query.SearchScope;
import com.filenet.api.util.Id;
import com.filenet.api.util.UserContext;

import filenet.vw.api.VWFetchType;
import filenet.vw.api.VWFieldType;
import filenet.vw.api.VWParameter;
import filenet.vw.api.VWQueue;
import filenet.vw.api.VWQueueQuery;
import filenet.vw.api.VWSession;
import filenet.vw.api.VWStepElement;

public class FnetGetData {



	
	public static void main(String[] args) {
		
		
		String uri = "http://172.25.103.101:9080/wsi/FNCEWS40MTOM";
		String CEusername = "Administrator";
		String CEpassword = "pass#word1";
		String ObctStore="fceos";
		String connectnPoint="fcecp";
		String queueName = "s_sig";	
		
		//String wobNum= request.getParameter("wobNum");
		String wobNum="929C585D0C9D6348998BD0AE66F96AF2";
	      
		String signaturePath="C:\\Program Files (x86)\\IBM\\WebSphere\\AppServer\\profiles\\NTBProfile\\installedApps\\fceCell01\\navigator.ear\\navigator.war\\Signatures\\";
		
		String serial="0021400013";
		
		GetData(uri,CEusername,CEpassword,ObctStore,connectnPoint,queueName,wobNum,signaturePath,serial);

	}
	
    public static void GetData(String uri,String CEusername,String CEpassword,String ObctStore,String connectnPoint,String queueName,String wobNum,String signaturePath,String serial) {
		
    	// Set connection parameters; substitute for the placeholders.
    			
    			
    			String c="";
    			

    		
    			//...........................................................CE Connect and retrieve images.....................
    			
    					// Get the connection
    					Connection conn = Factory.Connection.getConnection(uri);
    					// Get the user context
    					UserContext uc = UserContext.get();
    					// Build the subject using the FileNetP8WSI stanza

    					//Use the FileNetP8WSI stanza for CEWS
    					uc.pushSubject(UserContext.createSubject(conn,CEusername,CEpassword,"FileNetP8WSI"));
    					
    					try
    					{
    					// Get the default domain
    					Domain domain = Factory.Domain.getInstance(conn, null);
    					// Get an object store				
    					ObjectStore os = Factory.ObjectStore.fetchInstance(domain,ObctStore, null);				
    					System.out.println("Connection to OS is okkkkk");				
    					System.out.println(os);
    					
    					
    					
    					  VWSession peSession = new VWSession();
    				      peSession.setBootstrapCEURI(uri);		      
    				      peSession.logon(CEusername,CEpassword,connectnPoint);	      
    				      System.out.println("connection point is okkkk...... :" + peSession);
    				    
    				      
    				      
    				      // Retrieve the Queue			      
    				      VWQueue queue = peSession.getQueue(queueName);
    				      System.out.println("A" + queue.fetchCount());
    				      System.out.println("Connection to queue is okkkk...... " + queue);  
    						
    				      
    			      
//    				      
//    				    //Query Flags and Type to retrieve Step Elements
//    				      int queryFlags = VWQueue.QUERY_READ_LOCKED;
//    				      int queryType = VWFetchType.FETCH_TYPE_STEP_ELEMENT;
//    				      VWQueueQuery queueQuery = queue.createQuery(null,null,null,queryFlags,null,null,queryType);
//    				       //Get an individual Step Element
//    				     // VWStepElement stepElement = (VWStepElement) queueQuery.next();			      
//    				      while (queueQuery.hasNext()) {
//    				    	  VWStepElement stepElement = (VWStepElement) queueQuery.next();
//    				    	  
//    				    	  System.out.println("wob no : " + wobNum);
//    				    	    
//    				    	  if(stepElement.getWorkObjectNumber().equalsIgnoreCase(wobNum)){			    	  
//    				    	  	 //System.out.println("Step Name: "+stepElement.getStepName());
//    			                //System.out.println("Step Description: "+stepElement.getStepDescription());
//    			                //System.out.println("Step Description: "+stepElement.getWorkObjectNumber());		                
//    			                VWParameter[] parameters = stepElement.getParameters(VWFieldType.ALL_FIELD_TYPES, VWStepElement.FIELD_USER_AND_SYSTEM_DEFINED);		                
//    				    	    System.out.println("No of Parameters : " + parameters.length);
//    				    	    
//    				    	    for (int l=0; l<parameters.length; l++) {
//    				    	    	
//    				    	    	System.out.println(parameters[l].getName()+": "+ parameters[l].getStringValue());
//    				    	    	if(parameters[l].getName().equalsIgnoreCase("Serial_No")){
//    			                    	serial=parameters[l].getStringValue();
//    			                    	System.out.println("Serial :"+serial );
//    			                    }  
//    				    	    	
//    				    	    }
//    				    	  }
//    				      }
//    			      
    				    //......................................................PE connect and get images.............................................................
    				      
    				      String[] images={"Signature1","Sign1","Signature2","Sign2","OpIns"};
      
    				      System.out.println("Serial mmmmmmmmmmmmmmmmmmmmmm:"+serial );
    				      
    				      
    				      
    				      
			      
    				      
    				      for(int j=0;j<5;j++){		      
    				     					
    				      			        String docId="";
    				      				    String sql="SELECT [This], [Id] FROM [Document] WHERE ([DocumentTitle] = '"+images[j]+" "+serial+"') OPTIONS(TIMELIMIT 180)";
    				      					SearchSQL sqlObject = new SearchSQL();
    				      				    sqlObject.setQueryString(sql);
    				      				    // System.out.println("Sql string is: "+sql);
    				      				    SearchScope searchScope = new SearchScope(os);
    				      				    // Uses fetchRows to test the SQL statement.				    
    				      				      // System.out.println("Fetching rows");
    				      				      RepositoryRowSet rowSet = searchScope.fetchRows(sqlObject, null, null, new Boolean(true));
    				      				      Iterator iter = rowSet.iterator();
    				      				    
    				      				      while (iter.hasNext())
    				      				      {
    				      				    	// System.out.println("Serial ooooopppppp:"+serial );
    	    				    				    
    				      				        RepositoryRow row = (RepositoryRow) iter.next();
    				      				        docId = row.getProperties().get("Id").getIdValue().toString();
    				      				        System.out.println("IDDDD....." + docId);
    				      				      }
    				      // .......................... gettting id and get the image....................................................						
    				      					Document d = Factory.Document.fetchInstance(os,new Id(""+docId+""),null);
    				      					// Get the content elements
    				      					ContentElementList elements = d.get_ContentElements();
    				      					// Grab the first content element
    				      					ContentTransfer element = (ContentTransfer)elements.get(0);					
    				      					String filename = element.get_RetrievalName();
    				      					InputStream stream = element.accessContentStream();				
    				      					System.out.println(filename);
    				      					int length = d.get_ContentSize().intValue();	
    				                                           
    				      					
    				      					//C:\Signatures
    				      					//BufferedOutputStream writer = new BufferedOutputStream(new FileOutputStream("C:\\Program Files (x86)\\IBM\\WebSphere\\AppServer\\profiles\\NTBProfile\\installedApps\\fceCell01\\navigator.ear\\navigator.war\\Signatures\\Signature1 "+serial+".jpg"));
    				      					
    				      					     
    				      						
    				      						BufferedOutputStream writer = new BufferedOutputStream(new FileOutputStream(signaturePath+images[j]+" "+serial+".jpg"));
    				      								Double size = new Double(0);
    				      								int bufferSize;
    				      								byte[] buffer = new byte[length];
    				      								// Loop through the content and write it to the system
    				      								while( ( bufferSize = stream.read(buffer) ) != -1 )
    				      								{
    				      								size += bufferSize;
    				      								writer.write(buffer, 0, bufferSize);
    				      								}							
    				      								writer.close();							
    				      								System.out.println("done......");
    				      								c=images[j]; 
    				      								
    				      						
    				      						
    				      							  
    				      					
    				      }				
    				      
    				      
    					}catch(Exception ex){
    						ex.getMessage().toString();
    						ex.printStackTrace();
    					}


	}
	

}
