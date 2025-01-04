//$Id: PricedStuff.java 11282 2007-03-14 22:05:59Z epbernard $
package org.hibernate.test.annotations.generics;

import javax.persistence.MappedSuperclass;

/**
 * @author Emmanuel Bernard
 */
@MappedSuperclass
public class PricedStuff extends Stuff<Price> {
}
