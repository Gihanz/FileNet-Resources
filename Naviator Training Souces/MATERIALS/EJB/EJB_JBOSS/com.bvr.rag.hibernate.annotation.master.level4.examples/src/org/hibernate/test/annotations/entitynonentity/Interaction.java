//$Id: Interaction.java 11282 2007-03-14 22:05:59Z epbernard $
package org.hibernate.test.annotations.entitynonentity;

import javax.persistence.MappedSuperclass;

/**
 * @author Emmanuel Bernard
 */
@MappedSuperclass
public class Interaction {
	public int number;
}
