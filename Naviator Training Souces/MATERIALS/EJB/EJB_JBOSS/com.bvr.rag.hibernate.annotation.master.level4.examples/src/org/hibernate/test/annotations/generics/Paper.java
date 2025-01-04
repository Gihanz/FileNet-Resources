//$Id: Paper.java 11282 2007-03-14 22:05:59Z epbernard $
package org.hibernate.test.annotations.generics;

import javax.persistence.Entity;

/**
 * @author Emmanuel Bernard
 */
@Entity
public class Paper extends Item<PaperType, SomeGuy> {
}
