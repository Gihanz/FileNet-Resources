package examples.entity.single_table;

import java.io.Serializable;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

@Entity(name="MotorcycleSingle")
@DiscriminatorValue("MOTORCYCLE")
public class Motorcycle extends RoadVehicle implements Serializable {
	public final AcceleratorType acceleratorType = AcceleratorType.THROTTLE; 
	
	public Motorcycle() {
		super();
		numWheels = 2;
		numPassengers = 2;
	}
	
	public String toString() {
		return "Motorcycle: "+super.toString();
	}
}
