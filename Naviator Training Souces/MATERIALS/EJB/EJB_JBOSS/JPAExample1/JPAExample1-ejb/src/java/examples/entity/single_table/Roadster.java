package examples.entity.single_table;

import java.io.Serializable;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

@Entity(name="RaodsterSingle")
@DiscriminatorValue("ROADSTER")
public class Roadster extends Car implements Serializable {
	public enum CoolFactor {COOL,COOLER,COOLEST};
	
	private CoolFactor coolFactor;
	
	public Roadster() {
		super();
		numPassengers = 2;
	}

	public CoolFactor getCoolFactor() {
		return coolFactor;
	}

	public void setCoolFactor(CoolFactor coolFactor) {
		this.coolFactor = coolFactor;
	}
	
	public String toString() {
		return "Roadster: "+super.toString();
	}
}
