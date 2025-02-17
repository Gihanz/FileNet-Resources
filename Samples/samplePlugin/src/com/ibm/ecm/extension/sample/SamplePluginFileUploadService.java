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

import java.io.InputStream;
import java.io.PrintWriter;
import java.util.Iterator;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringEscapeUtils;
import org.apache.struts.action.ActionForm;
import org.apache.struts.upload.FormFile;

import com.ibm.ecm.extension.PluginService;
import com.ibm.ecm.extension.PluginServiceCallbacks;
import com.ibm.mm.sdk.common.DKComponentTypeDefICM;
import com.ibm.mm.sdk.common.DKConstant;
import com.ibm.mm.sdk.common.DKConstantICM;
import com.ibm.mm.sdk.common.DKDDO;
import com.ibm.mm.sdk.common.DKDatastoreDefICM;
import com.ibm.mm.sdk.common.DKItemTypeDefICM;
import com.ibm.mm.sdk.common.DKLobICM;
import com.ibm.mm.sdk.common.DKNVPair;
import com.ibm.mm.sdk.common.DKRetrieveOptionsICM;
import com.ibm.mm.sdk.common.dkAttrDef;
import com.ibm.mm.sdk.server.DKDatastoreExtICM;
import com.ibm.mm.sdk.server.DKDatastoreICM;

public class SamplePluginFileUploadService extends PluginService {

	@Override
	public String getId() {
		return "samplePluginFileUploadService";
	}

	@SuppressWarnings("rawtypes")
	@Override
	public void execute(PluginServiceCallbacks callbacks, HttpServletRequest request, HttpServletResponse response) throws Exception {
		String methodName = "execute";

		callbacks.getLogger().logEntry(this, methodName, request);

		// Get the form file
		FormFile uploadFile = callbacks.getRequestUploadFile();

		// Send HTML response for non-HTML5 file upload support
		boolean respondAsHtml = (uploadFile != null ? true : false);

		// Get the repository type
		String serverType = (String) request.getParameter("serverType");
		callbacks.getLogger().logDebug(this, methodName, request, "Request Parameter: serverType = " + ((serverType != null) ? serverType : ""));

		String repositoryId = request.getParameter("repositoryId");
		callbacks.getLogger().logDebug(this, methodName, request, "Request Parameter: repositoryId = " + ((repositoryId != null) ? repositoryId : ""));

		String docId = request.getParameter("docid");
		callbacks.getLogger().logDebug(this, methodName, request, "Request Parameter: docid = " + ((docId != null) ? docId : ""));

		String mimeType = request.getParameter("mimetype");
		callbacks.getLogger().logDebug(this, methodName, request, "Request Parameter: mimetype = " + ((mimeType != null) ? mimeType : ""));

		String templateName = request.getParameter("template_name");
		callbacks.getLogger().logDebug(this, methodName, request, "Request Parameter: template_name = " + ((templateName != null) ? templateName : ""));

		String docNameAttribute = request.getParameter("doc_name_attribute");
		callbacks.getLogger().logDebug(this, methodName, request, "Request Parameter: doc_name_attribute = " + ((docNameAttribute != null) ? docNameAttribute : ""));

		String docName = request.getParameter("parm_part_filename");
		callbacks.getLogger().logDebug(this, methodName, request, "Request Parameter: parm_part_filename = " + ((docName != null) ? docName : ""));

		// This sample assumes the repository type is CM.
		if (serverType.equalsIgnoreCase("cm")) {
			DKDatastoreICM ds = callbacks.getCMDatastore(repositoryId);

			synchronized (ds) {
				try {
					DKDatastoreDefICM dsDefICM = (DKDatastoreDefICM) ds.datastoreDef();
					DKComponentTypeDefICM componentTypeDef = (DKComponentTypeDefICM) dsDefICM.retrieveEntity(templateName);
					DKItemTypeDefICM itemTypeDef = ((componentTypeDef instanceof DKItemTypeDefICM) ? (DKItemTypeDefICM) componentTypeDef : (DKItemTypeDefICM) dsDefICM.retrieveEntity(componentTypeDef.getItemTypeName()));

					// This sample assumes the item is an instance of a resource item type.
					if (itemTypeDef.getClassification() == DKConstantICM.DK_ICM_ITEMTYPE_CLASS_RESOURCE_ITEM) {
						if (uploadFile == null) {
							ActionForm form = callbacks.getRequestActionForm();
							if (form != null && form.getMultipartRequestHandler() != null) {
								Map fileElements = form.getMultipartRequestHandler().getFileElements();
								Iterator it = fileElements.values().iterator();
								while (it.hasNext()) {
									uploadFile = (FormFile) it.next();
									if (uploadFile != null)
										break;
								}
							}
						}

						DKDDO ddo = ds.createDDOFromPID(docId);
						DKRetrieveOptionsICM dkRetrieveOptions = DKRetrieveOptionsICM.createInstance(ds);
						dkRetrieveOptions.baseAttributes(true);
						dkRetrieveOptions.basePropertyCheckedOutDetails(true);
						dkRetrieveOptions.partsList(true);
						dkRetrieveOptions.partsAttributes(true);
						dkRetrieveOptions.functionVersionLatest(true);
						ddo.retrieve(dkRetrieveOptions.dkNVPair());

						if (ddo instanceof DKLobICM) {
							InputStream is;
							int contentLen;

							if (uploadFile != null) {
								is = uploadFile.getInputStream();
								contentLen = uploadFile.getFileSize();
							} else {
								is = request.getInputStream();
								contentLen = request.getContentLength();
							}

							if (is != null) {
								DKNVPair[] dknv = new DKNVPair[2];
								dknv[0] = new DKNVPair("STREAM", is);
								dknv[1] = new DKNVPair("LENGTH", (Object) new Long(contentLen));
								((DKLobICM) ddo).setUpdateLocation(dknv);

								if (mimeType != null) {
									((DKLobICM) ddo).setMimeType(mimeType);
								}
								if (docName != null) {
									((DKLobICM) ddo).setOrgFileName(docName);
								}
							}

							DKDatastoreExtICM dsExt = (DKDatastoreExtICM) ds.getExtension(DKConstant.DK_CM_DATASTORE_EXT);

							// This sample assumes the name property is a string type capable of storing file name characters. 
							// The file name is used to set the value of the name property.
							dkAttrDef attrDef = itemTypeDef.getAttr(docNameAttribute);
							if (attrDef != null) {
								short dataId = ddo.dataId(docNameAttribute);
								ddo.setData(dataId, docName);
							}

							if (dsExt.isSupported("checkIn")) {
								if (!dsExt.isCheckedOut(ddo)) {
									dsExt.checkOut(ddo);
								}
								int updateOptions = DKConstant.DK_CM_CHECKIN;
								ds.updateObject(ddo, updateOptions);
							} else {
								callbacks.getLogger().logDebug(this, methodName, request, "checkins are not supported by the selected object.");
							}
						}
					} else {
						callbacks.getLogger().logInfo(this, methodName, request, "item is not a DKLobICM type");
					}

					// Get properties of the documents passed in and format a response (in JSON).
					PrintWriter responseWriter = response.getWriter();

					String jsonResponse = "{\"mimetype\": \"" + mimeType + "\"}";

					// Send HTML response for non-HTML5 file upload support
					if (respondAsHtml) {
						response.setContentType("text/html");
						jsonResponse = StringEscapeUtils.escapeHtml(jsonResponse);
						jsonResponse = "<html><body><textarea>" + jsonResponse + "</textarea></body></html>";
					} else {
						response.setContentType("text/plain");
					}

					responseWriter.print(jsonResponse);
					responseWriter.flush();
				} catch (Exception e) {
					// provide error information
					callbacks.getLogger().logError(this, methodName, request, e);
				}
			}
		} else {
			callbacks.getLogger().logError(this, methodName, request, "Only CM datastore types are supported at this time.");
		}

		callbacks.getLogger().logExit(this, methodName, request);
	}
}