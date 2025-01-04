//$Id: A320.java 11282 2007-03-14 22:05:59Z epbernard $
package org.hibernate.test.annotations;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

/**
 * @author Emmanuel Bernard
 */
@DiscriminatorValue("A320")
@Entity()
public class A320 extends Plane {
	private String javaEmbeddedVersion;

	public String getJavaEmbeddedVersion() {
		return javaEmbeddedVersion;
	}

	public void setJavaEmbeddedVersion(String string) {
		javaEmbeddedVersion = string;
	}

}
