//$Id: PoliticalParty.java 11282 2007-03-14 22:05:59Z epbernard $
package org.hibernate.test.annotations.onetomany;

import java.util.HashSet;
import java.util.Set;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToMany;

/**
 * @author Emmanuel Bernard
 */
@Entity
public class PoliticalParty {
	private String name;
	private Set<Politician> politicians = new HashSet<Politician>();

	@Id
	@Column(columnDefinition = "VARCHAR(60)")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@OneToMany(mappedBy = "party", cascade = CascadeType.ALL)
	public Set<Politician> getPoliticians() {
		return politicians;
	}

	public void setPoliticians(Set<Politician> politicians) {
		this.politicians = politicians;
	}

	public void addPolitician(Politician politician) {
		politicians.add( politician );
		politician.setParty( this );
	}
}
