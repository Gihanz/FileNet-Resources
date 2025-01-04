package examples.entity.single_table;

import java.io.Serializable;

import javax.persistence.DiscriminatorColumn;
import javax.persistence.DiscriminatorType;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.Table;

@Entity(name="RoadVehicleSingle")
@Table(name="RoadVehicleSingle")
@Inheritance(strategy=InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name="DISC", discriminatorType=DiscriminatorType.STRING)
@DiscriminatorValue("ROADVEHICLE")
public class RoadVehicle implements Serializable {
	public enum AcceleratorType {PEDAL,THROTTLE};
	
	@Id
	protected int id;
	protected int numPassengers;
	protected int numWheels;
	protected String make;
	protected String model;
	
	public RoadVehicle() {
		id = (int) System.nanoTime();
	}
	
	public int getNumPassengers() {
		return numPassengers;
	}
	
	public void setNumPassengers(int numPassengers) {
		this.numPassengers = numPassengers;
	}
	
	public int getNumWheels() {
		return numWheels;
	}
	
	public void setNumWheels(int numWheels) {
		this.numWheels = numWheels;
	}

	public int getId() {
		return id;
	}

	public String getMake() {
		return make;
	}

	public void setMake(String make) {
		this.make = make;
	}

	public String getModel() {
		return model;
	}

	public void setModel(String model) {
		this.model = model;
	}
	
	public String toString() {
			return "Make: "+make+", Model: "+model+", Number of passengers: "+numPassengers;
	}
}
