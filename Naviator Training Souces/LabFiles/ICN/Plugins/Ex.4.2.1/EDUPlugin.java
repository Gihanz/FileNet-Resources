package com.ibm.ecm.edu.icn;

import java.util.Locale;

import com.ibm.ecm.extension.Plugin;

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
}
