//$Id: Length.java 11282 2007-03-14 22:05:59Z epbernard $
package org.hibernate.test.annotations.entity;

/**
 * @author Emmanuel Bernard
 */
public interface Length<Type> {
	Type getLength();
}
