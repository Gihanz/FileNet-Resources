//$Id: Thing.java 11282 2007-03-14 22:05:59Z epbernard $
package org.hibernate.test.annotations;

import javax.persistence.MappedSuperclass;

/**
 * @author Emmanuel Bernard
 */
@MappedSuperclass
public class Thing {
	private boolean isAlive;

	public boolean isAlive() {
		return isAlive;
	}

	public void setAlive(boolean alive) {
		isAlive = alive;
	}

}
