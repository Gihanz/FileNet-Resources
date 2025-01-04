package examples.entity.bid.many_to_many.client;

import java.util.Properties;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;

import examples.entity.bid.many_to_many.Course;
import examples.entity.bid.many_to_many.Student;
import examples.entity.bid.many_to_many.interfaces.StudentCourse;


public class StudentCourseClient {
	public static void main(String[] args) {
		try {
			InitialContext ic =(InitialContext) getInitialContext() ;
			StudentCourse sc = (StudentCourse)ic.lookup(StudentCourse.class.getName());
			
			sc.doSomeStuff();
			
			for (Object o : sc.getAllStudents()) {
				Student s = (Student)o;
				System.out.println("Student: "+s.getName());
				for (Object o1 : s.getCourses()) {
					Course c = (Course)o1;
					System.out.println("\tCourse: "+c.getCourseName());
				}
			}
			System.out.println();
			for (Object o : sc.getAllCourses()) {
				Course c = (Course)o;
				System.out.println("Course: "+c.getCourseName());
				for (Object o1 : c.getStudents()) {
					Student s = (Student)o1;
					System.out.println("\tStudent: "+s.getName());
				}
			}
		} 
		catch (NamingException e) {
			e.printStackTrace();
		}
	}
	public static Context getInitialContext() 
	   throws javax.naming.NamingException {

	   Properties p = new Properties();
		p.put(Context.INITIAL_CONTEXT_FACTORY, "org.jnp.interfaces.NamingContextFactory");  
		p.put(Context.PROVIDER_URL, "jnp://localhost:1099");
	   return new javax.naming.InitialContext(p);
	}
}
