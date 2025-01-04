//$Id: Summary.java 11282 2007-03-14 22:05:59Z epbernard $
package org.hibernate.test.annotations.embedded;

import javax.persistence.Embeddable;

import org.hibernate.annotations.Parent;

/**
 * @author Emmanuel Bernard
 */
@Embeddable
public class Summary {
	private int size;
	private String text;
	private Book summarizedBook;

	public int getSize() {
		return size;
	}

	public void setSize(int size) {
		this.size = size;
	}

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	@Parent
	public Book getSummarizedBook() {
		return summarizedBook;
	}

	public void setSummarizedBook(Book summarizedBook) {
		this.summarizedBook = summarizedBook;
	}
}
