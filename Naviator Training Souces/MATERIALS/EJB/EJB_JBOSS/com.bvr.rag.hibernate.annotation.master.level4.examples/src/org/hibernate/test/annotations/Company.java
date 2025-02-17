//$Id: Company.java 11282 2007-03-14 22:05:59Z epbernard $
package org.hibernate.test.annotations;

import java.io.Serializable;
import java.util.Date;
import java.util.Set;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;


/**
 * Corporate like Air France
 *
 * @author Emmanuel Bernard
 */
@Entity(name = "Corporation")
public class Company implements Serializable {
	private Integer id;
	private String name;

	@Id
	@GeneratedValue
	public Integer getId() {
		return id;
	}

	public String getName() {
		return name;
	}


	public void setId(Integer integer) {
		id = integer;
	}


	public void setName(String string) {
		name = string;
	}

	//should be treated as getter
	private int[] getWorkingHoursPerWeek(Set<Date> holidayDays) {
        return null;
    }
}
