//$Id: Version.java 11282 2007-03-14 22:05:59Z epbernard $
package org.hibernate.test.annotations.indexcoll;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Column;

/**
 * @author Emmanuel Bernard
 */
@Entity
@Table(name = "tbl_version")
public class Version {
	private Integer id;
	private String codeName;
	private String number;
	private Software software;

	@Id
	@GeneratedValue
	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	@Column(name="`code_name`")
	public String getCodeName() {
		return codeName;
	}

	public void setCodeName(String codeName) {
		this.codeName = codeName;
	}

	public String getNumber() {
		return number;
	}

	public void setNumber(String number) {
		this.number = number;
	}

	@ManyToOne
	public Software getSoftware() {
		return software;
	}

	public void setSoftware(Software software) {
		this.software = software;
	}
}
