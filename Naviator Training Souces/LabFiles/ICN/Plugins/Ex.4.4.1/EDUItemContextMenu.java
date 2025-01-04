package com.ibm.ecm.edu.icn;

import java.util.Locale;

import com.ibm.ecm.extension.PluginMenu;
import com.ibm.ecm.extension.PluginMenuItem;

/**
 * This class defines the menu that overrides the default menu defined for item context menus.
 * This same menu can be created in the administration instead, but this demonstrates how you can
 * configure a plugin to create new menu types as well.  
 */
public class EDUItemContextMenu extends PluginMenu {

	@Override
	public String getId() {
		return "EDUItemContextMenu";
	}

	@Override
	public String getName(Locale locale) {
		return "EDU Browse ItemContextMenu";
	}

	@Override
	public String getMenuType() {
		return "ItemContextMenu";
	}

	@Override
	public PluginMenuItem[] getMenuItems() {
		String [] folderActionsActionIds = new String[] {"AddToFolder", "MoveDocumentToFolder", "RemoveFromFolder"};
		String [] checkoutActionsActionIds = new String[] {"CheckOutDownload", "CheckOutNoDownload"};
		String [] sendemailActionsActionIds = new String[] {"SendLinksToDocs", "SendAttachments"};
		String [] downloadActionsActionIds = new String[] {"DownloadAsOriginal", "DownloadAsPdf"};
		
		return new PluginMenuItem[] {
				new PluginMenuItem("View"),
				new PluginMenuItem("Preview"),
				new PluginMenuItem("DefaultDownload", downloadActionsActionIds),
				new PluginMenuItem("DeleteItem"),
				new PluginMenuItem("Edit"),
				new PluginMenuItem("DefaultCheckOut", checkoutActionsActionIds),
				new PluginMenuItem("CheckIn"),
				new PluginMenuItem("Unlock"),
				new PluginMenuItem("Separator"),
				new PluginMenuItem("DefaultSendEmail", sendemailActionsActionIds),
				new PluginMenuItem("Export"),
				new PluginMenuItem("DefaultFolderActions", folderActionsActionIds)
		};
	}

	@Override
	public String getDescription(Locale locale) {
		return "ItemContextMenu for the EDU ICN Plugin";
	}

}
