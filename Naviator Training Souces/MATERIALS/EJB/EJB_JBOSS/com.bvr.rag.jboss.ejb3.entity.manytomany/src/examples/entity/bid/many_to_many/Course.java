package examples.entity.bid.many_to_many;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collection;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;

@Entity(name="CourseBid")
public class Course implements Serializable {
	private int id;
	private String courseName;
	private Collection<Student> students = new ArrayList<Student>();

	public Course() {
		id = (int)System.nanoTime();
	}
	
	@Id
	public int getId() {
		return id;
	}
	
	public void setId(int id) {
		this.id = id;
	}
	
	public String getCourseName() {
		return courseName;
	}
	
	public void setCourseName(String courseName) {
		this.courseName = courseName;
	}

	@ManyToMany(cascade={CascadeType.ALL},fetch=FetchType.EAGER,mappedBy="courses")
	public Collection<Student> getStudents() {
		return students;
	}

	public void setStudents(Collection<Student> students) {
		this.students = students;
	}
}
