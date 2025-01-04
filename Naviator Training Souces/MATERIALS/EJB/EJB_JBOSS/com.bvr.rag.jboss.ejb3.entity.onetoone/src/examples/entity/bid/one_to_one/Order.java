package examples.entity.bid.one_to_one;

import java.io.Serializable;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToOne;

@Entity(name="OrderBid")
public class Order implements Serializable {
	private int id;
	private String orderName;
	private Shipment shipment;
	
	public Order() {
		id = (int)System.nanoTime();
	}
	
	@Id
	public int getId() {
		return id;
	}
	
	public void setId(int id) {
		this.id = id;
	}

	public String getOrderName() {
		return orderName;
	}

	public void setOrderName(String orderName) {
		this.orderName = orderName;
	}

	@OneToOne(cascade={CascadeType.PERSIST})
	public Shipment getShipment() {
		return shipment;
	}

	public void setShipment(Shipment shipment) {
		this.shipment = shipment;
	}
}
