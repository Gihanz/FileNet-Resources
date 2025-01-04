//$Id: GoalKeeper.java 11282 2007-03-14 22:05:59Z epbernard $
package org.hibernate.test.annotations.id;

import javax.persistence.Entity;

/**
 * @author Emmanuel Bernard
 */
@Entity
public class GoalKeeper extends Footballer {
	public GoalKeeper() {
	}

	public GoalKeeper(String firstname, String lastname, String club) {
		super( firstname, lastname, club );
	}
}
