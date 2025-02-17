//$Id: Document.java 11282 2007-03-14 22:05:59Z epbernard $
package org.hibernate.test.annotations.inheritance.union;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * @author Emmanuel Bernard
 */
@Entity
@Table(name = "DocumentUnion")
public class Document extends File {
	private int size;

	Document() {
	}

	Document(String name, int size) {
		super( name );
		this.size = size;
	}

	public int getSize() {
		return size;
	}

	public void setSize(int size) {
		this.size = size;
	}
}
