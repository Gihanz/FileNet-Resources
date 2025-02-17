//$Id: Footballer.java 11282 2007-03-14 22:05:59Z epbernard $
package org.hibernate.test.annotations.id;

import javax.persistence.DiscriminatorColumn;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.IdClass;

/**
 * @author Emmanuel Bernard
 */
@Entity
@IdClass(FootballerPk.class)
@DiscriminatorColumn(name = "bibi")
public class Footballer {
	private String firstname;
	private String lastname;
	private String club;

	public Footballer() {
	}

	public Footballer(String firstname, String lastname, String club) {
		this.firstname = firstname;
		this.lastname = lastname;
		this.club = club;
	}

	public boolean equals(Object o) {
		if ( this == o ) return true;
		if ( !( o instanceof Footballer ) ) return false;

		final Footballer footballer = (Footballer) o;

		if ( !firstname.equals( footballer.firstname ) ) return false;
		if ( !lastname.equals( footballer.lastname ) ) return false;

		return true;
	}

	public int hashCode() {
		int result;
		result = firstname.hashCode();
		result = 29 * result + lastname.hashCode();
		return result;
	}

	@Id
	public String getFirstname() {
		return firstname;
	}

	public void setFirstname(String firstname) {
		this.firstname = firstname;
	}

	@Id
	public String getLastname() {
		return lastname;
	}

	public void setLastname(String lastname) {
		this.lastname = lastname;
	}

	public String getClub() {
		return club;
	}

	public void setClub(String club) {
		this.club = club;
	}
}
