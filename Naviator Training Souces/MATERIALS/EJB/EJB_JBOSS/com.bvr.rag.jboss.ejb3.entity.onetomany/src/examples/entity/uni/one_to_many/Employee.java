package examples.entity.uni.one_to_many;

import java.io.Serializable;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity(name="EmployeeOMUni")
public class Employee implements Serializable {
	private int id;
	private String name;
	private char sex;
	
	public Employee() {
		id = (int)System.nanoTime();
	}

	@Id
	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}
	
	public String getName() {
		return name;
	}
	
	public void setName(String name) {
		this.name = name;
	}
	
	public char getSex() {
		return sex;
	}
	
	public void setSex(char sex) {
		this.sex = sex;
	}
}
