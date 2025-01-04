package examples.entity.single_table;

import java.io.Serializable;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

@Entity(name="CoupeSingle")
@DiscriminatorValue("COUPE")
public class Coupe extends Car implements Serializable {
	public enum BoringFactor {BORING,BORINGER,BORINGEST};
	
	private BoringFactor boringFactor;
	
	public Coupe() {
		super();
		numPassengers = 5;
	}

	public BoringFactor getBoringFactor() {
		return boringFactor;
	}

	public void setBoringFactor(BoringFactor boringFactor) {
		this.boringFactor = boringFactor;
	}
	
	public String toString() {
		return "Coupe: "+super.toString();
	}
}
