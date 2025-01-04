package com.ibm.ecm.edu.icn;
import java.util.Locale;
import com.ibm.ecm.extension.PluginAction;
public class EDUCompareVersionAction extends PluginAction {
	@Override
	public String getActionFunction() {
		return "compareVersionFunction";
	}
	public String getGridTypes() {
		return "";
	}
	@Override
	public String getIcon() {
		return null;
	}
	@Override
	public String getId() {
		return "EDUCompareVersionAction";
	}
	@Override
	public String getName(Locale arg0) {
		return "EDU Compare Version";
	}
	@Override
	public String getPrivilege() {
		return "";
	}
	@Override
	public String getServerTypes() {
		return "p8";
	}
	@Override
	public boolean isMultiDoc() {
		return true;
	}
}