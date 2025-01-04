package examples.entity.bid.one_to_one.client;

import java.util.Properties;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;

import examples.entity.bid.one_to_one.Order;
import examples.entity.bid.one_to_one.Shipment;
import examples.entity.bid.one_to_one.interfaces.OrderShipment;


public class OrderShipmentClient {
	public static void main(String[] args) {
		try {
			InitialContext ic = (InitialContext) getInitialContext() ;
			OrderShipment os = (OrderShipment)ic.lookup(OrderShipment.class.getName());
			
			os.doSomeStuff();

			System.out.println("Bidirectional One-To-One client\n");
			
			for (Object o : os.getOrders()) {
				Order order = (Order)o;
				System.out.println("Order "+order.getId()+": "+order.getOrderName());
				System.out.println("\tShipment details: "+order.getShipment().getCity()+" "+order.getShipment().getZipcode());
			}
			
			System.out.println();
			
			for (Object o : os.getShipments()) {
				Shipment shipment = (Shipment)o;
				System.out.println("Shipment: "+shipment.getCity()+" "+shipment.getZipcode());
				System.out.println("\tOrder details: "+shipment.getOrder().getOrderName());
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
