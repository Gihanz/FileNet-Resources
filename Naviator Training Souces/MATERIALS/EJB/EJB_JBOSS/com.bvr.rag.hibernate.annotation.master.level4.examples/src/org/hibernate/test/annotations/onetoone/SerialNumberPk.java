//$Id: SerialNumberPk.java 11282 2007-03-14 22:05:59Z epbernard $
package org.hibernate.test.annotations.onetoone;

import java.io.Serializable;
import javax.persistence.Embeddable;

/**
 * @author Emmanuel Bernard
 */
@Embeddable
public class SerialNumberPk implements Serializable {
	private String brand;
	private String model;

	public boolean equals(Object o) {
		if ( this == o ) return true;
		if ( !( o instanceof SerialNumberPk ) ) return false;

		final SerialNumberPk serialNumberPk = (SerialNumberPk) o;

		if ( !brand.equals( serialNumberPk.brand ) ) return false;
		if ( !model.equals( serialNumberPk.model ) ) return false;

		return true;
	}

	public int hashCode() {
		int result;
		result = brand.hashCode();
		result = 13 * result + model.hashCode();
		return result;
	}

	public String getBrand() {
		return brand;
	}

	public void setBrand(String brand) {
		this.brand = brand;
	}

	public String getModel() {
		return model;
	}

	public void setModel(String model) {
		this.model = model;
	}
}
