//$Id: PartyAffiliate.java 11282 2007-03-14 22:05:59Z epbernard $
package org.hibernate.test.annotations.onetoone;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToOne;
import javax.persistence.PrimaryKeyJoinColumn;

/**
 * @author Emmanuel Bernard
 */
@Entity
public class PartyAffiliate {
	@Id
	String partyId;

	@OneToOne(mappedBy="partyAffiliate")
	Party party;

	String affiliateName;
}
