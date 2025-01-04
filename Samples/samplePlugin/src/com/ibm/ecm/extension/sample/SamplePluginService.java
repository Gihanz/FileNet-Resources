/*
 * Licensed Materials - Property of IBM (c) Copyright IBM Corp. 2012, 2013 All Rights Reserved.
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

import java.util.Date;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.ibm.ecm.extension.PluginResponseUtil;
import com.ibm.ecm.extension.PluginService;
import com.ibm.ecm.extension.PluginServiceCallbacks;
import com.ibm.ecm.json.JSONResponse;

/**
 * This service is invoked by SamplePluginAction. It will invoke the OD, P8, CM or CMIS API's to obtain system-related
 * details about a document and return those details in JSON.
 */
public class SamplePluginService extends PluginService {

	@Override
	public String getId() {
		return "samplePluginService";
	}

	@Override
	public void execute(PluginServiceCallbacks callbacks, HttpServletRequest request, HttpServletResponse response) throws Exception {
		String methodName = "execute";

		callbacks.getLogger().logEntry(this, methodName, request);

		// Get the parameters.  (Note, you might want to add additional error handling for missing parameters.)
		String serverType = request.getParameter("serverType");
		String serverName = request.getParameter("server");
		String folderName = request.getParameter("folder");
		int ndocs = Integer.parseInt(request.getParameter("ndocs"));

		callbacks.getLogger().logDebug(this, methodName, request, "server type: " + serverType + ", server: " + serverName + ", folder: " + folderName);

		try {

			Date date = callbacks.getLogger().logPerf(this, methodName, request);

			JSONResponse jsonResponse = new JSONResponse();
			for (int i = 0; i < ndocs; i++) {
				String docId = request.getParameter("docId" + i);

				callbacks.getLogger().logInfo(this, methodName, request, "docId: " + docId);

				if (serverType.equals("od")) {
					SamplePluginServiceOD.writeODHitProperties(request, jsonResponse, callbacks, serverName, folderName, docId);
				} else if (serverType.equals("p8")) {
					SamplePluginServiceP8.writeP8DocumentProperties(request, jsonResponse, callbacks, serverName, docId);
				} else if (serverType.equals("cm")) {
					SamplePluginServiceCM.writeCMItemProperties(request, jsonResponse, callbacks, serverName, docId);
				} else if (serverType.equals("cmis")) {
					SamplePluginServiceCMIS.writeCMItemProperties(request, jsonResponse, callbacks, serverName, docId);
				}

			}
			
			// Write results to response
			PluginResponseUtil.writeJSONResponse(request, response, jsonResponse, callbacks, "samplePluginService");
			callbacks.getLogger().logPerf(this, methodName, request, date);

		} catch (Exception e) {
			// provide error information
			callbacks.getLogger().logError(this, methodName, request, e);
		}
		callbacks.getLogger().logExit(this, methodName, request);
	}

}
