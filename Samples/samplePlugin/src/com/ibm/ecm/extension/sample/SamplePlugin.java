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

import com.ibm.ecm.extension.Plugin;
import com.ibm.ecm.extension.PluginAction;
import com.ibm.ecm.extension.PluginAsyncTaskType;
import com.ibm.ecm.extension.PluginFeature;
import com.ibm.ecm.extension.PluginLayout;
import com.ibm.ecm.extension.PluginMenu;
import com.ibm.ecm.extension.PluginMenuType;
import com.ibm.ecm.extension.PluginODAuthenticationService;
import com.ibm.ecm.extension.PluginRepositoryType;
import com.ibm.ecm.extension.PluginRequestFilter;
import com.ibm.ecm.extension.PluginResponseFilter;
import com.ibm.ecm.extension.PluginService;
import com.ibm.ecm.extension.PluginViewerDef;

/**
 * Main class for the sample plug-in. This sample demonstrates many of the
 * extension points possible through an IBM Content Navigator plug-in. The
 * sample contains:
 * <ul>
 * <li>Five custom actions.
 * <ol>
 * <li>SamplePluginAction -- simple action, invokes SamplePluginService and
 * displays the returned JSON.
 * <li>SamplePluginFilteredAction -- a more complex action, Showing how to
 * subclass ecm.model.Action for filtering when the action is enabled.
 * <li>SamplePluginCheckInAction -- an action demonstrating a custom checkin.
 * <li>SamplePluginFileUploadAction -- an action demonstrating how to upload a
 * file.
 * <li>SamplePluginCustomCMWFAction -- an custom action for CM workflow.
 * </ol>
 * These custom actions need to be configured onto menus and toolbars using
 * administration in order to be used.
 * <li>A custom JavaScript snippet, "SamplePlugin.js", and custom CSS,
 * "SamplePlugin.css". These are downloaded and run as part of the desktop load.
 * <li>A set of services to support custom actions, viewers and feature:
 * <ol>
 * <li>SamplePluginService -- called by SamplePluginAction, returns some
 * properties of the selected item.
 * <li>SamplePluginViewerService -- called by SamplePluginViewer to format an
 * RSS feed.
 * <li>SamplePluginGetAnnotationService -- used by the SamplePluginImageViewer
 * <li>SamplePluginGetContentService -- used by the SamplePluginImageViewer
 * <li>SamplePluginFileUploadService -- used by SamplePluginFileUploadAction
 * <li>SamplePluginSearchService -- used by SamplePluginFeature
 * </ol>
 * <li>Two custom sample viewers:
 * <ol>
 * <li>SamplePluginViewer -- a simple viewer performing mid-tier conversion of
 * RSS documents
 * <li>SamplePluginImageViewer -- a more advanced viewer of images and
 * annotations.
 * </ol>
 * <li>Two response filters:
 * <ol>
 * <li>SamplePluginResponseFilter -- shows how to modify search results to add
 * custom cell formatters and new columns
 * <li>SamplePluginOpenClassResponseFilter -- shows how to modify open class to
 * add custom property formatters and editors
 * </ol>
 * <li>Three custom menu types. These menu types are not used by any widgets in
 * the sample.
 * <li>Three custom menus of the typed defined by the custom menu types.
 * <li>SamplePluginFeature -- a custom feature, embedding a search interface for
 * entering arbitrary queries.
 * <li>SamplePluginLayout -- a custom layout (which replaces the entire user
 * interface).
 * <li>SamplePluginODAuthenticationService -- a custom OD authentication service
 * for supporting SSO on IBM Content Manager OnDemand.
 * </ul>
 * Some of the extensions defined by this plug-in will only take effect when
 * using a desktop with the id of "sample", It is recommended that you create a
 * desktop with id of "sample" to see these extensions, and also configure any
 * sample actions and feature to this sample desktop to avoid accidentally
 * introducing sample extensions into other desktops.
 */
public class SamplePlugin extends Plugin {

	@Override
	public PluginAction[] getActions() {
		return new PluginAction[] { new SamplePluginAction(), new SamplePluginFilteredAction(),
				new SamplePluginCheckInAction(), new SamplePluginFileUploadAction(), new SamplePluginCustomCMWFAction() };
	}

	@Override
	public String getId() {
		return "SamplePlugin";
	}

	@Override
	public String getName(Locale locale) {
		return "Sample Plug-in";
	}

	@Override
	public String getScript() {
		return "SamplePlugin.js.jgz";
	}

	@Override
	public String getDebugScript() {
		return "SamplePlugin.js";
	}

	@Override
	public PluginService[] getServices() {
		return new PluginService[] { new SamplePluginService(), new SamplePluginViewerService(),
				new SamplePluginGetAnnotationsService(), new SamplePluginGetContentService(),
				new SamplePluginFileUploadService(), new SamplePluginSearchService() };
	}

	@Override
	public String getVersion() {
		return "2.0.3";
	}

	@Override
	public String getCopyright() {
		return "Sample copyright message";
	}

	@Override
	public String getDojoModule() {
		return "samplePluginDojo";
	}

	@Override
	public String getCSSFileName() {
		return "SamplePlugin.css.jgz";
	}
	
	@Override
	public String getDebugCSSFileName() {
		return "SamplePlugin.css";
	}

	@Override
	public String getConfigurationDijitClass() {
		return "samplePluginDojo.ConfigurationPane";
	}

	@Override
	public PluginViewerDef[] getViewers() {
		return new PluginViewerDef[] { new SamplePluginViewerDef(), new SamplePluginImageViewerDef() };
	}

	@Override
	public PluginRequestFilter[] getRequestFilters() {
		return  new PluginRequestFilter[] { new SamplePluginRequestFilter() };
	}
	@Override
	public PluginResponseFilter[] getResponseFilters() {
		return new PluginResponseFilter[] { new SamplePluginResponseFilter(), new SamplePluginOpenClassResponseFilter() };
	}

	@Override
	public PluginMenuType[] getMenuTypes() {
		return new PluginMenuType[] { new SamplePluginContextMenuMenuType(), new SamplePluginToolbarMenuType(),
				new SamplePluginToolbarMenuType2() };
	}

	@Override
	public PluginMenu[] getMenus() {
		return new PluginMenu[] { new SamplePluginContextMenuMenu(), new SamplePluginToolbarMenu(),
				new SamplePluginToolbarMenu2(), };
	}

	@Override
	public PluginFeature[] getFeatures() {
		return new PluginFeature[] { new SamplePluginFeature(), new SamplePluginFavoritesFeature() };
	}

	@Override
	public PluginLayout[] getLayouts() {
		return new PluginLayout[] { new SamplePluginLayout() };
	}

	public PluginODAuthenticationService getODAuthenticationService() {
		return new SamplePluginODAuthenticationService();
	}

	@Override
	public PluginRepositoryType[] getRepositoryTypes() {
		return new PluginRepositoryType[] { new SamplePluginRepositoryType() };
	}

	@Override
	public PluginAsyncTaskType[] getAsyncTaskTypes() {
		return new PluginAsyncTaskType[] { 
				new SamplePluginAsyncTaskType(),
				new SamplePluginSearchAsyncTaskType()
		};
	}
}
