package com.ibm.ecm.edu.icn;

import java.util.Locale;

import com.ibm.ecm.extension.Plugin;
import com.ibm.ecm.extension.PluginMenu;


public class EDUPlugin extends Plugin {

	public String getId() {
		return "EDUPlugin";
	}

	public String getName(Locale locale) {
		return "EDU ICN Plugin";
	}

	public String getVersion() {
		return "2.0.2";
	}
	public String getScript() {
		return "EDUPlugin.js";
	}
	
	public String getDojoModule() {
		return "eDUPluginDojo";
	}
	
	@Override
	public String getCSSFileName() {
		return "EDUPlugin.css";
	}

	/**
	 * Provides a list of filters that are run after a requested service. This
	 * list of filters can be used to modify the response that is returned.
	 * 
	 * @return An array of
	 *         <code>{@link com.ibm.ecm.extension.PluginResponseFilter PluginResponseFilter}</code>
	 *         objects.
	 */
	public com.ibm.ecm.extension.PluginResponseFilter[] getResponseFilters() {
		return new com.ibm.ecm.extension.PluginResponseFilter[]{new com.ibm.ecm.edu.icn.EDUOpenClassResponseFilter(),new EDUResultsResponseFilter()};
	}

	/**
	     * Specifies custom features that are provided by this plug-in. Features are
	     * the major user interface sections, which appear as icons on the left side
	     * of the user interface in the default layout. Examples of features include
	     * Search, Favorites, and Teamspaces.
	     * 
	     * @return An array of custom plug-in feature objects.
	     */
	    public com.ibm.ecm.extension.PluginFeature[] getFeatures() {
	       return new com.ibm.ecm.extension.PluginFeature[] {new com.ibm.ecm.edu.icn.EDUFeature()};
	    }
	    public PluginMenu[] getMenus() {
			return new PluginMenu[] {
					new EDUFolderContextMenu(),
					new EDUItemContextMenu(),
					new EDUSystemItemContextMenu(),
					new EDUMixItemsContextMenu(),
			};
		}
	}

