//$Id: MyOidGenerator.java 11282 2007-03-14 22:05:59Z epbernard $
package org.hibernate.test.annotations.type;

import java.io.Serializable;

import org.hibernate.HibernateException;
import org.hibernate.engine.SessionImplementor;
import org.hibernate.id.IdentifierGenerator;

/**
 * @author Emmanuel Bernard
 */
public class MyOidGenerator implements IdentifierGenerator {

	private int counter;

	public Serializable generate(SessionImplementor aSessionImplementor, Object aObject) throws HibernateException {
		counter++;
		return new MyOid( 0, 0, 0, counter );
	}
}

