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
import java.net.HttpURLConnection;
import java.net.URL;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

import com.ibm.ecm.extension.PluginService;
import com.ibm.ecm.extension.PluginServiceCallbacks;

/**
 * This service provides an example of a custom viewer. This sample performs simple formatting of an archived RSS feed.
 */
public class SamplePluginViewerService extends PluginService {

	@Override
	public String getId() {
		return "samplePluginViewerService";
	}

	@Override
	public void execute(PluginServiceCallbacks callbacks, HttpServletRequest request, HttpServletResponse response) throws Exception {

		// Retrieve the document content.  Note that cookies need to be propagated so that
		// session invalid errors won't occur
		String docUrlString = request.getParameter("docUrl");
		URL docUrl = new URL(new URL(request.getRequestURL().toString()), docUrlString);

		Cookie[] cookies = request.getCookies();
		StringBuffer cookieProperty = new StringBuffer();
		if (cookies != null) {
			for (int j = 0; j < cookies.length; j++) {
				cookieProperty.append(cookies[j].getName());
				cookieProperty.append("=");
				cookieProperty.append(cookies[j].getValue());
				cookieProperty.append(",");
			}
		}
		HttpURLConnection docConnection = (HttpURLConnection) docUrl.openConnection();
		docConnection.setRequestProperty("COOKIE", cookieProperty.toString());
		InputStream docStream = docConnection.getInputStream();

		// Parse the document using javax DOM parser
		DocumentBuilder documentBuilder = DocumentBuilderFactory.newInstance().newDocumentBuilder();
		Document document = documentBuilder.parse(docStream);
		Element rssElement = document.getDocumentElement();

		// Look through the document, pulling out key fields and write to the output stream's HTML.
		response.setContentType("text/html");
		PrintWriter writer = response.getWriter();
		writer.append("<html><body>");
		NodeList channelNodes = rssElement.getElementsByTagName("channel");
		for (int i = 0; i < channelNodes.getLength(); i++) {
			Element channelElement = (Element) channelNodes.item(i);
			NodeList titleNodes = channelElement.getElementsByTagName("title");
			if (titleNodes.getLength() > 0) {
				Element titleNode = (Element) titleNodes.item(0);
				writer.append("<h2>" + titleNode.getTextContent() + "</h2>");
			} else {
				writer.append("<h2>Untitled</h2>");
			}
			NodeList descriptionNodes = channelElement.getElementsByTagName("description");
			if (descriptionNodes.getLength() > 0) {
				Element descriptionElement = (Element) descriptionNodes.item(0);
				writer.append("<p>" + descriptionElement.getTextContent() + "</p>");
			}
			NodeList itemNodes = channelElement.getElementsByTagName("item");
			for (int j = 0; j < itemNodes.getLength(); j++) {
				Element itemElement = (Element) itemNodes.item(j);
				titleNodes = itemElement.getElementsByTagName("title");
				if (titleNodes.getLength() > 0) {
					Element titleNode = (Element) titleNodes.item(0);
					writer.append("<h3>" + titleNode.getTextContent() + "</h3>");
				} else {
					writer.append("<h3>Untitled</h3>");
				}
				descriptionNodes = itemElement.getElementsByTagName("description");
				if (descriptionNodes.getLength() > 0) {
					Element descriptionElement = (Element) descriptionNodes.item(0);
					writer.append("<p>" + descriptionElement.getTextContent() + "</p>");
				}
				NodeList authorNodes = itemElement.getElementsByTagName("author");
				for (int k = 0; k < authorNodes.getLength(); k++) {
					Element authorElement = (Element) authorNodes.item(k);
					writer.append("<p>Author: " + authorElement.getTextContent() + "</p>");
				}
				NodeList creatorNodes = itemElement.getElementsByTagName("dc:creator");
				for (int k = 0; k < creatorNodes.getLength(); k++) {
					Element creatorElement = (Element) creatorNodes.item(k);
					writer.append("<p>Creator: " + creatorElement.getTextContent() + "</p>");
				}
				NodeList pubDateNodes = itemElement.getElementsByTagName("pubDate");
				if (pubDateNodes.getLength() > 0) {
					Element pubDateElement = (Element) pubDateNodes.item(0);
					writer.append("<p>Published: " + pubDateElement.getTextContent() + "</p>");
				}
			}
		}
		writer.append("</body></html>");
	}

}
