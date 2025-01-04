package com.ibm.ecm.edu.icn;

import java.util.Locale;

import com.ibm.ecm.extension.PluginMenu;
import com.ibm.ecm.extension.PluginMenuItem;

/**
 * This class defines the menu that overrides the default menu defined for system item context menus.
 * This same menu can be created in the administration instead, but this demonstrates how you can
 * configure a plugin to create new menu types as well.  
 */
public class EDUSystemItemContextMenu extends PluginMenu {

	@Override
	public String getId() {
		return "EDUSystemItemContextMenu";
	}

	@Override
	public String getName(Locale locale) {
		return "EDU Browse SystemItemContextMenu";
	}

	@Override
	public String getMenuType() {
		return "SystemItemContextMenu";
	}

	@Override
	public PluginMenuItem[] getMenuItems() {
		String [] folderActionsActionIds = new String[] {"AddToFolder", "MoveDocumentToFolder", "RemoveFromFolder"};
		
		return new PluginMenuItem[] {
				new PluginMenuItem("View"),
				new PluginMenuItem("DeleteItem"),
				new PluginMenuItem("Edit"),
				new PluginMenuItem("Separator"),
				new PluginMenuItem("CheckOutNoDownload"),
				new PluginMenuItem("Unlock"),
				new PluginMenuItem("Separator"),
				new PluginMenuItem("SendLinksToSearches"),
				new PluginMenuItem("Export"),
				new PluginMenuItem("DefaultFolderActions", folderActionsActionIds),
				new PluginMenuItem("Separator"),
				new PluginMenuItem("ShowHyperlink")
		};
	}

	@Override
	public String getDescription(Locale locale) {
		return "SystemItemContextMenu for the EDU ICN Plugin";
	}

}
