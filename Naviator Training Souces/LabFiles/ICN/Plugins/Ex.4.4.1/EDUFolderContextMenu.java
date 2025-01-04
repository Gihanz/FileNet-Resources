package com.ibm.ecm.edu.icn;

import java.util.Locale;

import com.ibm.ecm.extension.PluginMenu;
import com.ibm.ecm.extension.PluginMenuItem;

/**
 * This class defines the menu that overrides the default menu defined for folder context menus.
 * This same menu can be created in the administration instead, but this demonstrates how you can
 * configure a plugin to create new menu types as well.  
 */
public class EDUFolderContextMenu extends PluginMenu {

	@Override
	public String getId() {
		return "EDUFolderContextMenu";
	}

	@Override
	public String getName(Locale locale) {
		return "EDU Browse FolderContextMenu";
	}

	@Override
	public String getMenuType() {
		return "FolderContextMenu";
	}

	@Override
	public PluginMenuItem[] getMenuItems() {
		return new PluginMenuItem[] {
				new PluginMenuItem("OpenFolder"),
				new PluginMenuItem("RefreshGrid"),
				new PluginMenuItem("DeleteItem"),
				new PluginMenuItem("Separator"),
				new PluginMenuItem("SendLinksToFolders"),
				new PluginMenuItem("Export"),
				new PluginMenuItem("MoveFolderToFolder"),
				new PluginMenuItem("Separator"),
				new PluginMenuItem("CreateFolder"),
				new PluginMenuItem("Import"),
				new PluginMenuItem("Separator"),
				new PluginMenuItem("ShowHyperlink")
		};
	}

	@Override
	public String getDescription(Locale locale) {
		return "FolderContextMenu for the EDU ICN Plugin";
	}

}
