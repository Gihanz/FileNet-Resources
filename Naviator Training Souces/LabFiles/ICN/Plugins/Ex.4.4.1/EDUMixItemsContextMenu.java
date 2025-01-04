package com.ibm.ecm.edu.icn;

import java.util.Locale;

import com.ibm.ecm.extension.PluginMenu;
import com.ibm.ecm.extension.PluginMenuItem;

/**
 * This class defines the menu that overrides the default menu defined for mix item context menus.
 * This same menu can be created in the administration instead, but this demonstrates how you can
 * configure a plugin to create new menu types as well.  
 */
public class EDUMixItemsContextMenu extends PluginMenu {

	@Override
	public String getId() {
		return "EDUMixItemsContextMenu";
	}

	@Override
	public String getName(Locale locale) {
		return "EDU Browse MixItemsContextMenu";
	}

	@Override
	public String getMenuType() {
		return "MixItemsContextMenu";
	}

	@Override
	public PluginMenuItem[] getMenuItems() {
		return new PluginMenuItem[] {
				new PluginMenuItem("DeleteItem"),
				new PluginMenuItem("SendLinksToSearches"),
				new PluginMenuItem("Export")
		};
	}

	@Override
	public String getDescription(Locale locale) {
		return "MixItemsContextMenu for the EDU ICN Plugin";
	}

}
