//$Id: Dog.java 11282 2007-03-14 22:05:59Z epbernard $
package org.hibernate.test.annotations.id;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.TableGenerator;

/**
 * Share the generator table decribed by the GEN_TABLE GeneratedIdTable
 * using the Dog key as discriminator
 *
 * @author Emmanuel Bernard
 */
@Entity
@Table(name = "tbl_dog")
@TableGenerator(name = "DogGen", table = "GENERATOR_TABLE", pkColumnName = "pkey",
		valueColumnName = "hi", pkColumnValue = "Dog", allocationSize = 10)
public class Dog {
	private Integer id;
	private String name;

	@Id
	@GeneratedValue(strategy = GenerationType.TABLE, generator = "DogGen")
	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
}
