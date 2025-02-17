/*
 * Licensed Materials - Property of IBM (c) Copyright IBM Corp. 2012, 2013  All Rights Reserved.
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

package com.ibm.ecm.extension.sample;

import java.util.StringTokenizer;

import javax.security.auth.Subject;
import javax.servlet.http.HttpServletRequest;

import com.filenet.api.core.Document;
import com.filenet.api.core.Domain;
import com.filenet.api.core.Factory;
import com.filenet.api.core.ObjectStore;
import com.filenet.api.util.Id;
import com.filenet.api.util.UserContext;
import com.ibm.ecm.extension.PluginServiceCallbacks;
import com.ibm.ecm.json.JSONResponse;

/**
 * This class contains P8 specific logic for the sample plugin service. It demonstrates using the PluginServiceCallbacks
 * object to get connection information and invoke the P8 API's.
 */
public class SamplePluginServiceP8 {

	public static void writeP8DocumentProperties(HttpServletRequest request, JSONResponse jsonResponse, PluginServiceCallbacks callbacks, String repositoryId, String docId) throws Exception {
		Domain domain = callbacks.getP8Domain(repositoryId);
		Subject subject = callbacks.getP8Subject(repositoryId);
		UserContext.get().pushSubject(subject);

		// A P8 docId in Content Navigator is actually three id's separated by commas.
		StringTokenizer docIdTok = new StringTokenizer(docId, ",");
		String classID = (docIdTok.hasMoreTokens() ? docIdTok.nextToken() : null);
		String objectStoreID = (docIdTok.hasMoreTokens() ? docIdTok.nextToken() : null);
		String objectID = (docIdTok.hasMoreTokens() ? docIdTok.nextToken() : null);
		// Retrieve the document
		ObjectStore os = Factory.ObjectStore.fetchInstance(domain, new Id(objectStoreID), null);
		Document document = Factory.Document.fetchInstance(os, objectID, null);
		// Return some interesting system properties
		String documentName = document.get_Name();
		String className = document.getClassName();
		String storageArea = document.get_StorageArea().get_DisplayName();
		String storagePolicy = document.get_StoragePolicy().get_DisplayName();

		UserContext.get().popSubject();
		jsonResponse.put("documentName", documentName);
		jsonResponse.put("className", className);
		jsonResponse.put("storageLocation", storageArea);
		jsonResponse.put("storagePolicy", storagePolicy);
	}

}
