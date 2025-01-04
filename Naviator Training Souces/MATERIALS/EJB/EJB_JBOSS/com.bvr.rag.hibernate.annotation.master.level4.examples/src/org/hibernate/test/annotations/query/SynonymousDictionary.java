//$Id: SynonymousDictionary.java 11282 2007-03-14 22:05:59Z epbernard $
package org.hibernate.test.annotations.query;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

/**
 * @author Emmanuel Bernard
 */
@Entity
@DiscriminatorValue("Syn")
public class SynonymousDictionary extends Dictionary {
}
