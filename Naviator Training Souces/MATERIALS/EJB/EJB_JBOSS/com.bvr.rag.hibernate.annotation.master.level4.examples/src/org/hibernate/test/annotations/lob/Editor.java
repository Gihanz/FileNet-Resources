//$Id: Editor.java 11282 2007-03-14 22:05:59Z epbernard $
package org.hibernate.test.annotations.lob;

import java.io.Serializable;

/**
 * @author Emmanuel Bernard
 */
public class Editor implements Serializable {
	private String name;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
}
