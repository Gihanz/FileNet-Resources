//$Id: Location.java 11282 2007-03-14 22:05:59Z epbernard $
package org.hibernate.test.annotations.strategy;

/**
 * @author Emmanuel Bernard
 */
public class Location {
	private String city;
	private String country;

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public String getCountry() {
		return country;
	}

	public void setCountry(String country) {
		this.country = country;
	}
}
