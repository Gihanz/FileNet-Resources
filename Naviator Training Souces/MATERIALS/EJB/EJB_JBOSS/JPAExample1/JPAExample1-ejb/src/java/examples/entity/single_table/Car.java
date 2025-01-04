package examples.entity.single_table;

import java.io.Serializable;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

@Entity(name="CarSingle")
@DiscriminatorValue("CAR")
public class Car extends RoadVehicle implements Serializable {
	public final AcceleratorType acceleratorType = AcceleratorType.PEDAL;
	
	public Car() {
		super();
		numWheels = 4;
	}
	
	public String toString() {
		return "Car: "+super.toString();
	}
}
