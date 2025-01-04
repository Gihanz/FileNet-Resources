package com.ibm.ecm.edu.icn;
import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.io.*;
import java.util.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.filenet.api.core.Document;
import com.filenet.api.core.Domain;
import com.filenet.api.core.Factory;
import com.filenet.api.core.ObjectStore;
import com.filenet.api.util.Id;
import com.ibm.ecm.extension.PluginService;
import com.ibm.ecm.extension.PluginServiceCallbacks;
import com.filenet.api.core.*;
import com.filenet.api.property.*;
import com.filenet.api.collection.*;
import com.filenet.api.constants.*;

import org.apache.commons.json.JSONArray;
import org.apache.commons.json.JSONObject;

import java.lang.ProcessBuilder;

public class EDUCompareVersionService extends PluginService {
	@Override
	public String getId() {
		return "EDUCompareVersionService";
	}
	@Override
	public void execute(PluginServiceCallbacks callbacks,
	HttpServletRequest request,
	HttpServletResponse response) throws Exception {
		String serviceType = request.getParameter("ServiceType");
			if (serviceType != null && serviceType.equals("GetVersions")) {
	
			String serverType = request.getParameter("serverType");
			String server = request.getParameter("server");
			int ndocs = Integer.parseInt(request.getParameter("ndocs"));
			List<String> docIDs = new ArrayList<String>();
			for(int i = 0; i < ndocs; i++) {
				String docIdString = request.getParameter("docID" + i);
				if(docIdString != null){
					docIDs.add(docIdString);
				}
			}
			String resultStr = "";
			if (!docIDs.isEmpty()) {
				if (serverType.equals("p8")) {
					resultStr = updateDocumentsP8(callbacks,
						server, docIDs);
				}
			}
			PrintWriter respWriter = response.getWriter();
				respWriter.print(resultStr);
		} else if (serviceType != null && serviceType.equals("CompareVersions")) {

			String serverType = request.getParameter("serverType");
			String server = request.getParameter("server");
			int ndocs = Integer.parseInt(request.getParameter("ndocs"));
			List<String> docIDs = new ArrayList<String>();
			for(int i = 0; i < ndocs; i++) {
				String docIdString = request.getParameter("docID" + i);
				if(docIdString != null){
					docIDs.add(docIdString);
				}
			}
			String resultStr = "";
			if (!docIDs.isEmpty()) {
				if (serverType.equals("p8")) {
					resultStr = compareVersions(callbacks,
						server, docIDs);
				}
			}
			PrintWriter respWriter = response.getWriter();
			respWriter.print("{\"Report\":\"" + 
				resultStr + "\"}");		
		}
		
	}
	
	@SuppressWarnings("deprecation")
	public String updateDocumentsP8(PluginServiceCallbacks callbacks,
		String server,
		List<String> docIDs) {
		String resultStr = "";
		SimpleDateFormat nsdf = new SimpleDateFormat("dd/MM/yyyy HH:mm");		
		Domain domain = callbacks.getP8Domain(server);
		Iterator<String> listIter = docIDs.iterator();
		while (listIter.hasNext()) {
			String[] splitObjectId = listIter.next().split(",");
			if(splitObjectId.length >= 3) {
				String docID = splitObjectId[2];
				String osStr = splitObjectId[1];
				ObjectStore os = Factory.ObjectStore.fetchInstance(domain,
						new Id(osStr), null);
				Document document = Factory.Document.fetchInstance(os,
						docID, null);
				
				VersionableSet versionableSet = document.get_Versions();
				Versionable versionable;
				Document docVersion;
				ObjectStore objectStore;
				String versionStr = "";
				String docIdStr = "";
				String documentTitleStr = "";
				String mimeTypeStr = "";
				String dateCreatedStr = "";
				String creatorStr = "";
				String documentClassStr = "";
				String objectStoreIdStr = "";
				JSONObject jsonPayload = new JSONObject();
				JSONArray jsonArray = new JSONArray();
				JSONObject jsonProp;
				PropertyFilter propertyFilter;
				
				Iterator itVersion = versionableSet.iterator();
				while (itVersion.hasNext()) {
					versionable = (Versionable)itVersion.next();
					versionStr = versionable.get_MajorVersionNumber() + "." + versionable.get_MinorVersionNumber();
					docVersion = (Document)versionable;
					docIdStr = docVersion.get_Id().toString();
					propertyFilter = new PropertyFilter();
					propertyFilter.addIncludeType(0, null, null, FilteredPropertyType.ANY);
					docVersion.fetchProperties(propertyFilter); 
					creatorStr = docVersion.getProperties().get("Creator").getStringValue();
					documentTitleStr = docVersion.getProperties().get("DocumentTitle").getStringValue();
					dateCreatedStr = nsdf.format(docVersion.getProperties().get("DateCreated").getDateTimeValue());
					mimeTypeStr = docVersion.get_MimeType();
					documentClassStr = docVersion.getClassName();
					objectStore = docVersion.getObjectStore();
					// Refresh  the object store
					// the object store name is cached, if don't do this, objectStore.get_Name()
					// will give error that name is not in cache
					objectStore.refresh();
					objectStoreIdStr = objectStore.get_Id().toString();
					jsonProp = new JSONObject();
					try{
						jsonProp.put("Version", versionStr); 
						jsonProp.put("DocID", docIdStr);
						jsonProp.put("DocumentTitle", documentTitleStr); 
						jsonProp.put("MimeType", mimeTypeStr);
						jsonProp.put("DateCreated", dateCreatedStr);						
						jsonProp.put("Creator", creatorStr);
						jsonProp.put("DocumentClass", documentClassStr);
						jsonProp.put("ObjectStoreID", objectStoreIdStr);
						jsonArray.add(jsonProp);
					} catch (Exception ex) {
					}
				}
				try {
					jsonPayload.put("Versions", jsonArray.toString());
					resultStr = jsonPayload.toString();
				} catch (Exception ex) {
				}
	
			}
		}
		return resultStr;
	}
	
	public String compareVersions(PluginServiceCallbacks callbacks,
		String server,
		List<String> docIDs) throws IOException {
		String resultStr = "";		
		Domain domain = callbacks.getP8Domain(server);
		if(domain != null) {
			System.out.println("Domain is not null");
		}
		else 
			System.out.println("Domain is null");
		
		Iterator<String> listIter = docIDs.iterator();
		
		ContentElement contentElement;
		ContentTransfer contentTransfer;
		String fileName;
		String fileName1 = "";
		String fileName2 = "";
		File tempDir;
		File tempFile;
		SimpleDateFormat nsdf = new SimpleDateFormat("yyyyMMddHHmmss");
		Calendar cal = Calendar.getInstance();
		String dateTimeStr = nsdf.format(cal.getTime());
		int randomInt = 0;
		Random randomGenerator;
		
		Double contentSize;
		InputStream inputStream;
		OutputStream outputStream = null;
		byte[] nextBytes;
		int nBytesRead;
		int numFile = 0;

		String versionStr = "";
		String versionStr1 = "";
		String versionStr2 = "";
		String documentTitleStr = "";
		String documentTitleStr1 = "";
		String documentTitleStr2 = "";

		randomGenerator = new Random();
		randomInt = (int) randomGenerator.nextInt(1000);
		
// *** get the 2 document's content element file
		while (listIter.hasNext()) {
			String[] splitObjectId = listIter.next().split(",");
			if(splitObjectId.length >= 3) {
				String docID = splitObjectId[2];
				String osStr = splitObjectId[1];
				System.out.println("DocID = " + docID + " osStr = " + osStr);
				ObjectStore os = Factory.ObjectStore.fetchInstance(domain,
						new Id(osStr), null);
				Document document = Factory.Document.fetchInstance(os,
						docID, null);
				
				versionStr = document.get_MajorVersionNumber() + "." + document.get_MinorVersionNumber();
				documentTitleStr = document.getProperties().get("DocumentTitle").getStringValue();
				System.out.println("Document Title = " + documentTitleStr);
				
								ContentElementList contentElementList = document.get_ContentElements();
				Iterator itContent = contentElementList.iterator();
				while (itContent.hasNext()) {
					contentElement = (ContentElement)itContent.next();
					contentTransfer = (ContentTransfer)contentElement;
					fileName = contentTransfer.get_RetrievalName();
					System.out.println("FileName = " + fileName + "numFile = " + numFile);
					
					if (numFile == 0) {
						fileName1 = dateTimeStr + "-" + String.valueOf(randomInt) + "-" + fileName;
						fileName = fileName1;
						versionStr1 = versionStr;
						documentTitleStr1 = documentTitleStr;
						System.out.println("FileName1 = " + fileName1);
						tempDir = new File("C:\\Temp\\CompareVersion\\Original");
					} else {
						fileName2 = dateTimeStr + "-" + String.valueOf(randomInt) + "-" + fileName;
						fileName = fileName2;
						versionStr2 = versionStr;
						documentTitleStr2 = documentTitleStr;
						System.out.println("FileName2 = " + fileName2);
						tempDir = new File("C:\\Temp\\CompareVersion\\Modified");
					}
					tempFile = new File(tempDir, fileName);
					contentSize = contentTransfer.get_ContentSize();
					System.out.println("Content size = " + contentSize);
					inputStream = contentTransfer .accessContentStream();
					try {
						outputStream = new FileOutputStream(tempFile);
						nextBytes = new byte[64000];
						nBytesRead = 0;
						while ((nBytesRead = inputStream.read(nextBytes)) != -1) {
							outputStream.write(nextBytes, 0, nBytesRead);
						}
						System.out.println("nBytesRead = " + nBytesRead);
					} catch (Exception ex) {
						ex.printStackTrace();
					}
					numFile++;
				}
				try {
					outputStream.close();
					
				} catch (Exception ex) {
					ex.printStackTrace();
				}

			}
		}
		
		System.out.println("Calling the Diffdoc interface");
		
// *** end get the 2 document's content element file
		try {
			String reportFileName1 = "\"C:\\Temp\\CompareVersion\\" + dateTimeStr + "-" + String.valueOf(randomInt) + "-" + "report.html\"";
			String reportFileName11 = "C:/Temp/CompareVersion/" + dateTimeStr + "-" + String.valueOf(randomInt) + "-" + "report.html";
			String batchFileName1 = "C:/Temp/CompareVersion/" + dateTimeStr + "-" + String.valueOf(randomInt) + "-" + "compare1.bat";
			String postFileName11 = dateTimeStr + "-" + String.valueOf(randomInt) + "-" + "compare1.bat";
			String batchFileName11 = "C:\\Temp\\CompareVersion\\" + dateTimeStr + "-" + String.valueOf(randomInt) + "-" + "compare1.bat";
			
    		File reportFile = new File(reportFileName1);
    		Boolean fileDeleted = reportFile.delete();
    		File batchFile = new File(batchFileName1);
    		fileDeleted = batchFile.delete();
    		
            FileWriter writer = new FileWriter(batchFileName1);    		
			String commandStr = "\"C:\\Program Files (x86)\\Softinterface, Inc\\Diffdoc\\Diffdoc\" /t " + reportFileName1 + " /r#1 /f#2 /O /X /m";
			commandStr += " \"C:\\Temp\\CompareVersion\\Original\\" + fileName1 + "\" /s \"C:\\Temp\\CompareVersion\\Modified\\" + fileName2 + "\"";
            writer.write(commandStr);
            writer.write("\necho finished");
            writer.close();
			System.out.println("Calling the Diffdoc interface" + postFileName11);
			
			
			String line = null;
			List<String> cargs = new ArrayList<String>();
			  cargs.add (batchFileName11); // command name
			  
			  ProcessBuilder pb = new ProcessBuilder (cargs);
			  Process p = pb.start();
			  InputStream stdin = p.getInputStream();
				InputStreamReader isr = new java.io.InputStreamReader(stdin);
				BufferedReader br = new java.io.BufferedReader(isr);
				while ( (line = br.readLine()) != null) {System.out.println(line);}			  
			  try {
				p.waitFor();
			} catch (InterruptedException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
            	
            BufferedReader reader = new BufferedReader(new FileReader(reportFileName11));
            String fileStr1 = "C:\\Temp\\CompareVersion\\Original\\" + fileName1;
            String replaceStr1 = documentTitleStr1 + " (Version " + versionStr1 + ")";
            String fileStr2 = "C:\\Temp\\CompareVersion\\Modified\\" + fileName2;
            String replaceStr2 = documentTitleStr2 + " (Version " + versionStr2 + ")";
            while((line = reader.readLine()) != null) {
            	if (line.contains(fileStr1))
            		line = line.replace (fileStr1,replaceStr1);
            	else if (line.contains(fileStr2))
            		line = line.replace (fileStr2, replaceStr2);
            	else if (line.contains("Title</h1>"))
            		line = line.replace ("Title","Document Comparison Report");
            	line = line.replace("\"","\\\"");
            	resultStr += line;
            }
            reader.close();          
     
		} catch (Exception ex) {
		}
		return resultStr;
	}
}