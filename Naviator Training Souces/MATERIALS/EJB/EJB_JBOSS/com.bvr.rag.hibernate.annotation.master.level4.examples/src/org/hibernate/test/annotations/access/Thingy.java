//$Id: Thingy.java 11282 2007-03-14 22:05:59Z epbernard $
package org.hibernate.test.annotations.access;

import javax.persistence.MappedSuperclass;
import javax.persistence.Transient;

/**
 * @author Emmanuel Bernard
 */
@MappedSuperclass
public class Thingy {
	private String god;

	@Transient
	public String getGod() {
		return god;
	}

	public void setGod(String god) {
		this.god = god;
	}
}
