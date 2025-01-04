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

import javax.security.auth.Subject;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.filenet.api.util.UserContext;
import com.ibm.ecm.extension.PluginResponseUtil;
import com.ibm.ecm.extension.PluginService;
import com.ibm.ecm.extension.PluginServiceCallbacks;
import com.ibm.ecm.json.JSONMessage;
import com.ibm.ecm.json.JSONResultSetResponse;

/**
 * This class contains the common logic for the sample plugin search service. It demonstrates using the
 * PluginServiceCallbacks object to get connection information for P8 and CM8 connections, synchronizing access to those
 * repository objects, compressing and sending a JSONResultSetResponse or a JSON error.
 */
public class SamplePluginSearchService extends PluginService {

	public static final String REPOSITORY_ID = "repositoryId";
	public static final String REPOSITORY_TYPE = "repositoryType";
	public static final String QUERY = "query";

	public String getId() {
		return "samplePluginSearchService";
	}

	public void execute(PluginServiceCallbacks callbacks, HttpServletRequest request, HttpServletResponse response) throws Exception {
		String methodName = "execute";
		callbacks.getLogger().logEntry(this, methodName, request);

		String repositoryId = request.getParameter(REPOSITORY_ID);
		String repositoryType = request.getParameter(REPOSITORY_TYPE);
		String query = request.getParameter(QUERY);

		JSONResultSetResponse jsonResults = new JSONResultSetResponse();
		jsonResults.setPageSize(350);

		try {
			if (repositoryType.equals("p8")) {
				Subject subject = callbacks.getP8Subject(repositoryId);
				UserContext.get().pushSubject(subject);
			}

			Object synchObject = callbacks.getSynchObject(repositoryId, repositoryType);
			if (synchObject != null) {
				synchronized (synchObject) {
					if (repositoryType.equals("cm")) {
						SamplePluginSearchServiceCM.executeCMSearch(repositoryId, query, callbacks, jsonResults, request.getLocale());
					} else if (repositoryType.equals("p8")) {
						SamplePluginSearchServiceP8.executeP8Search(repositoryId, query, callbacks, jsonResults, request.getLocale());
					}
				}
			} else {
				if (repositoryType.equals("cm")) {
					SamplePluginSearchServiceCM.executeCMSearch(repositoryId, query, callbacks, jsonResults, request.getLocale());
				} else if (repositoryType.equals("p8")) {
					SamplePluginSearchServiceP8.executeP8Search(repositoryId, query, callbacks, jsonResults, request.getLocale());
				}
			}

			// Write results to response
			PluginResponseUtil.writeJSONResponse(request, response, jsonResults, callbacks, "samplePluginSearchService");

		} catch (Exception e) {
			// provide error information
			callbacks.getLogger().logError(this, methodName, request, e);

			JSONMessage jsonMessage = new JSONMessage(0, e.getMessage(), "This error may occur if the search string is invalid.", "Ensure the search string is the correct syntax.", "Check the IBM Content Navigator logs for more details.", "");
			jsonResults.addErrorMessage(jsonMessage);
			PluginResponseUtil.writeJSONResponse(request, response, jsonResults, callbacks, "samplePluginSearchService");
		} finally {
			if (repositoryType.equals("p8")) {
				UserContext.get().popSubject();
			}

			callbacks.getLogger().logExit(this, methodName, request);
		}
	}
}