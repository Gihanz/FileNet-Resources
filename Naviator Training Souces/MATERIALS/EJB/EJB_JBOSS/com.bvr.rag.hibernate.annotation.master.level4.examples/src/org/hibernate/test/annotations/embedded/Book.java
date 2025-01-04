//$Id: Book.java 11282 2007-03-14 22:05:59Z epbernard $
package org.hibernate.test.annotations.embedded;

import javax.persistence.AttributeOverride;
import javax.persistence.AttributeOverrides;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.SecondaryTable;

/**
 * @author Emmanuel Bernard
 */
@Entity
@SecondaryTable(name = "BookSummary")
public class Book {
	private String isbn;
	private String name;
	private Summary summary;

	@Id
	public String getIsbn() {
		return isbn;
	}

	public void setIsbn(String isbn) {
		this.isbn = isbn;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@AttributeOverrides({
	@AttributeOverride(name = "size", column = @Column(table = "BookSummary")),
	@AttributeOverride(name = "text", column = @Column(table = "BookSummary"))
			})
	public Summary getSummary() {
		return summary;
	}

	public void setSummary(Summary summary) {
		this.summary = summary;
	}
}
