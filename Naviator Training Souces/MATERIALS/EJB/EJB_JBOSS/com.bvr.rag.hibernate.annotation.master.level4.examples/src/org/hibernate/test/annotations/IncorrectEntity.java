//$Id: IncorrectEntity.java 11282 2007-03-14 22:05:59Z epbernard $
package org.hibernate.test.annotations;

import javax.persistence.Entity;

/**
 * @author Emmanuel Bernard
 */
@Entity
public class IncorrectEntity {
	private String name;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
}
