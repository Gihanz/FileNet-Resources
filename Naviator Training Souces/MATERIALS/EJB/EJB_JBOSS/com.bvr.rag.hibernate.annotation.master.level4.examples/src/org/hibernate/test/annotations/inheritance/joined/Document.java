//$Id: Document.java 11282 2007-03-14 22:05:59Z epbernard $
package org.hibernate.test.annotations.inheritance.joined;

import javax.persistence.Column;
import javax.persistence.Entity;

import org.hibernate.annotations.ForeignKey;

/**
 * @author Emmanuel Bernard
 */
@Entity
@ForeignKey(name = "FK_DOCU_FILE")
public class Document extends File {
	@Column(nullable = false)
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
