//$Id: Ferry.java 11282 2007-03-14 22:05:59Z epbernard $
package org.hibernate.test.annotations;

import javax.persistence.Entity;


/**
 * @author Emmanuel Bernard
 */
@Entity()
public class Ferry extends Boat {
	private String sea;

	public String getSea() {
		return sea;
	}

	public void setSea(String string) {
		sea = string;
	}

}
