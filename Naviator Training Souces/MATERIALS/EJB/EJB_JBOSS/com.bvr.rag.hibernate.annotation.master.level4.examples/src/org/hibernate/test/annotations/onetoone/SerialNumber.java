//$Id: SerialNumber.java 11282 2007-03-14 22:05:59Z epbernard $
package org.hibernate.test.annotations.onetoone;

import javax.persistence.Entity;
import javax.persistence.Id;

/**
 * @author Emmanuel Bernard
 */
@Entity
public class SerialNumber {
	private SerialNumberPk id;
	private String value;

	public boolean equals(Object o) {
		if ( this == o ) return true;
		if ( !( o instanceof SerialNumber ) ) return false;

		final SerialNumber serialNumber = (SerialNumber) o;

		if ( !id.equals( serialNumber.id ) ) return false;

		return true;
	}

	public int hashCode() {
		return id.hashCode();
	}

	@Id
	public SerialNumberPk getId() {
		return id;
	}

	public void setId(SerialNumberPk id) {
		this.id = id;
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}
}
