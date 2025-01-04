package examples.entity.bid.one_to_one.interfaces;

import java.util.List;

import javax.ejb.Remote;

@Remote
public interface OrderShipment {
	public void doSomeStuff();
	
	public List getOrders();
	
	public List getShipments();
}
