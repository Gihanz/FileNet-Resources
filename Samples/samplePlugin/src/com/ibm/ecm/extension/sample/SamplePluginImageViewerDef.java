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

import java.util.Locale;

import com.ibm.ecm.extension.PluginViewerDef;

public class SamplePluginImageViewerDef extends PluginViewerDef {

	private static final String[] SUPPORTED_SERVER_TYPES = new String[] { "cm", "p8", "od", "cmis" };

	private static final String[] SUPPORTED_MIME_TYPES = new String[] { "image/bmp", "image/gif", "image/jpeg", "image/jpg", "image/pjpeg", "image/png", "image/x-png", };

	private static final String VIEWER_CLASS = "samplePluginDojo.SampleImageViewer";

	public String getId() {
		return "sampleViewer";
	}

	public String getLaunchUrlPattern() {
		// This is a frameless viewer, so no URL is required.
		return "";
	}

	public String getName(Locale arg0) {
		return "SampleImageViewer";
	}

	public String[] getSupportedContentTypes() {
		return SUPPORTED_MIME_TYPES;
	}

	public String[] getSupportedServerTypes() {
		return SUPPORTED_SERVER_TYPES;
	}

	public String getViewerClass() {
		return VIEWER_CLASS;
	}
}
