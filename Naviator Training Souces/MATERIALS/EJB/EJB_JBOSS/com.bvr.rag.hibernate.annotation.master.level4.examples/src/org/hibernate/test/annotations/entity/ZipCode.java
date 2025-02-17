//$Id: ZipCode.java 11282 2007-03-14 22:05:59Z epbernard $
package org.hibernate.test.annotations.entity;

import javax.persistence.Entity;
import javax.persistence.Id;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * @author Emmanuel Bernard
 */
@Cache(usage = CacheConcurrencyStrategy.READ_ONLY)
@Entity
@org.hibernate.annotations.Entity(mutable = false)
public class ZipCode {
	@Id
	public String code;
}
