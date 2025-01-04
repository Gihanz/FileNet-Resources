//$Id: Chair.java 11282 2007-03-14 22:05:59Z epbernard $
package org.hibernate.test.annotations.access;

import javax.persistence.Entity;
import javax.persistence.Transient;

/**
 * @author Emmanuel Bernard
 */
@Entity
public class Chair extends Furniture {

	@Transient
	private String pillow;

	public String getPillow() {
		return pillow;
	}

	public void setPillow(String pillow) {
		this.pillow = pillow;
	}
}
