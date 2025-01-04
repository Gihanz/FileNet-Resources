package examples.entity.bid.many_to_many.interfaces;

import java.util.List;

import javax.ejb.Remote;

@Remote
public interface StudentCourse {
	public void doSomeStuff();
	
	public List getAllStudents();
	
	public List getAllCourses();
}
