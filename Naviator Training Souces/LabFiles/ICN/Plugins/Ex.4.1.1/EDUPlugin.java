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
}
