package examples.entity.single_table.client;

import java.util.Properties;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;

import examples.entity.single_table.interfaces.RoadVehicleStateless;


public class RoadVehicleClient {
	public static void main(String[] args) {
		String action = "insert";
		String type = "RoadVehicleSingle";
		
		if (args.length>0) {
			if (args[0].startsWith("update")) {
				action="update";
			}
			else if (args[0].startsWith("delete")) {
				action="delete";
			}
			
			if (args.length == 2) {
				type = args[1];
			}
		}
		
		Context ic;
		try {
			ic = getInitialContext();
			RoadVehicleStateless rvs = (RoadVehicleStateless)ic.lookup("RoadVehicleStatelessBean/remote");
			
			if (action.equals("insert")) {
				System.out.println("Inserting...");
				rvs.doSomeStuff();
			}
			else if (action.equals("update")) {
				System.out.println("Updating "+type+"...");
				rvs.updateAll(type);
			}
			else if (action.equals("delete")) {
				System.out.println("Deleting "+type+"...");
				rvs.deleteAll(type);
			}
			
			System.out.println("Here is the list of all RoadVehicles:\n");
			for (Object o : rvs.getAllRoadVehicles()) {
				System.out.println("RoadVehicle: "+o);
			}
		} 
		catch (NamingException e) {
			e.printStackTrace();
		}
	}
	public static Context getInitialContext() 
    throws javax.naming.NamingException {

    Properties p = new Properties();
	p.put(Context.INITIAL_CONTEXT_FACTORY, "org.jnp.interfaces.NamingContextFactory");  
	p.put(Context.PROVIDER_URL, "jnp://localhost:1099");
    return new javax.naming.InitialContext(p);
}
}
