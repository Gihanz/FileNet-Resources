//$Id: FootballerPk.java 11282 2007-03-14 22:05:59Z epbernard $
package org.hibernate.test.annotations.id;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Embeddable;

/**
 * @author Emmanuel Bernard
 */
@Embeddable
public class FootballerPk implements Serializable {
	private String firstname;
	private String lastname;

	@Column(name = "fb_fname")
	public String getFirstname() {
		return firstname;
	}

	public String getLastname() {
		return lastname;
	}

	public void setFirstname(String firstname) {
		this.firstname = firstname;
	}

	public void setLastname(String lastname) {
		this.lastname = lastname;
	}

	public FootballerPk() {
	}

	public FootballerPk(String firstname, String lastname) {
		this.firstname = firstname;
		this.lastname = lastname;

	}

	public boolean equals(Object o) {
		if ( this == o ) return true;
		if ( !( o instanceof FootballerPk ) ) return false;

		final FootballerPk footballerPk = (FootballerPk) o;

		if ( !firstname.equals( footballerPk.firstname ) ) return false;
		if ( !lastname.equals( footballerPk.lastname ) ) return false;

		return true;
	}

	public int hashCode() {
		int result;
		result = firstname.hashCode();
		result = 29 * result + lastname.hashCode();
		return result;
	}

}
