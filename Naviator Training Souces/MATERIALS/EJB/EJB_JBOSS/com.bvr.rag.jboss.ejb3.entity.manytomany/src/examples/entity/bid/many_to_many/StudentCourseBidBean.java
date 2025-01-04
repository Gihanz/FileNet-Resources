package examples.entity.bid.many_to_many;

import java.util.List;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

import examples.entity.bid.many_to_many.interfaces.StudentCourse;

@Stateless
public class StudentCourseBidBean implements StudentCourse {
	@PersistenceContext
	EntityManager em;

	public void doSomeStuff() {
		Course c1 = new Course();
		c1.setCourseName("EJB 3.0 101");
		
		Course c2 = new Course();
		c2.setCourseName("EJB 3.0 202");
		
		Student s1 = new Student();
		s1.setName("Micah");
		
		s1.getCourses().add(c1);
		
		c1.getStudents().add(s1);
		
		Student s2 = new Student();
		s2.setName("Tes");

		s2.getCourses().add(c1);
		s2.getCourses().add(c2);
		
		c1.getStudents().add(s2);
		c2.getStudents().add(s2);
		
		em.persist(s1);
		em.persist(s2);
	}

	public List getAllStudents() {
		Query q = em.createQuery("SELECT s FROM StudentBid s");
		return q.getResultList();
	}

	public List getAllCourses() {
		Query q = em.createQuery("SELECT c FROM CourseBid c");
		return q.getResultList();
	}
}
