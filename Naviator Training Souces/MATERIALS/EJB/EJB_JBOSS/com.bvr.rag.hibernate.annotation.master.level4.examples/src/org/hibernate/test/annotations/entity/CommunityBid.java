//$Id: CommunityBid.java 11282 2007-03-14 22:05:59Z epbernard $
package org.hibernate.test.annotations.entity;

import javax.persistence.Entity;

/**
 * @author Emmanuel Bernard
 */
@Entity
public class CommunityBid extends Bid {
	private Starred communityNote;

	public Starred getCommunityNote() {
		return communityNote;
	}

	public void setCommunityNote(Starred communityNote) {
		this.communityNote = communityNote;
	}

}
