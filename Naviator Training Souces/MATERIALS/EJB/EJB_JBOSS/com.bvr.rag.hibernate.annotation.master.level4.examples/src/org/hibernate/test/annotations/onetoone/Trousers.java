//$Id: Trousers.java 11282 2007-03-14 22:05:59Z epbernard $
package org.hibernate.test.annotations.onetoone;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;

/**
 * @author Emmanuel Bernard
 */
@Entity
public class Trousers {
	@Id
	public Integer id;

	@OneToOne
	@JoinColumn(name = "zip_id")
	public TrousersZip zip;

}
