package examples.entity.bid.one_to_one;

import java.util.List;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

import examples.entity.bid.one_to_one.interfaces.OrderShipment;

@Stateless
public class OrderShipmentBidBean implements OrderShipment {
	@PersistenceContext
	EntityManager em;
	
	public void doSomeStuff() {
		Shipment s = new Shipment();
		s.setCity("Austin");
		s.setZipcode("78727");
		
		Order o = new Order();
		o.setOrderName("Software Order");
		o.setShipment(s);
		
		s.setOrder(o);
		
		em.persist(o);
	}

	public List getOrders() {
		Query q = em.createQuery("SELECT o FROM OrderBid o");
		return q.getResultList();
	}
	
	public List getShipments() {
		Query q = em.createQuery("SELECT s FROM ShipmentBid s");
		return q.getResultList();
	}
}
