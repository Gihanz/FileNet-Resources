package examples.entity.uni.one_to_many;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

import examples.entity.uni.one_to_many.interfaces.CompanyEmployeeOM;

@Stateless
public class CompanyEmployeeOMUniBean implements CompanyEmployeeOM {
	@PersistenceContext
	EntityManager em;

	public void doSomeStuff() {
		Company c = new Company();
		c.setName("M*Power Internet Services, Inc.");
		
		Collection<Employee> employees = new ArrayList<Employee>();
		Employee e = new Employee();
		e.setName("Micah Silverman");
		e.setSex('M');
		employees.add(e);
		
		e = new Employee();
		e.setName("Tes Silverman");
		e.setSex('F');
		employees.add(e);
		
		c.setEmployees(employees);
		em.persist(c);
		
		c = new Company();
		c.setName("Sun Microsystems");
		
		employees = new ArrayList<Employee>();
		e = new Employee();
		e.setName("Vishwanath B Ramachandra Rao(BVR)");
		e.setSex('M');
		employees.add(e);
		
		e = new Employee();
		e.setName("James Gosling");
		e.setSex('M');
		employees.add(e);
		
		c.setEmployees(employees);
		em.persist(c);
		
		c = new Company();
		c.setName("Bob's Bait & Tackle");
		em.persist(c);
	}

	public List getCompanies() {
		Query q = em.createQuery("SELECT c FROM CompanyOMUni c");
		return q.getResultList();
	}
	
	public List getCompanies2(String query) {
		Query q = em.createQuery(query);
		return q.getResultList();
	}
	
	public void deleteCompanies() {
		Query q = em.createQuery("DELETE FROM CompanyOMUni");
		q.executeUpdate();
	}
}
