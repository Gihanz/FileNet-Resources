//$Id: Ransom.java 11282 2007-03-14 22:05:59Z epbernard $
package org.hibernate.test.annotations.entity;

import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

import org.hibernate.annotations.Columns;
import org.hibernate.annotations.Type;

/**
 * @author Emmanuel Bernard
 */
@Entity
public class Ransom {
	private Integer id;
	private String kidnapperName;
	private MonetaryAmount amount;
	private Date date;

	@Id
	@GeneratedValue
	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getKidnapperName() {
		return kidnapperName;
	}

	public void setKidnapperName(String kidnapperName) {
		this.kidnapperName = kidnapperName;
	}

	@Type(type = "org.hibernate.test.annotations.entity.MonetaryAmountUserType")
	@Columns(columns = {
	@Column(name = "r_amount"),
	@Column(name = "r_currency")
			})
	public MonetaryAmount getAmount() {
		return amount;
	}

	public void setAmount(MonetaryAmount amount) {
		this.amount = amount;
	}

	public Date getDate() {
		return date;
	}

	public void setDate(Date date) {
		this.date = date;
	}
}
