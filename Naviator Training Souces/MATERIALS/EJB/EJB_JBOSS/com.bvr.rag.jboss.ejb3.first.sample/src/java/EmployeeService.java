
import java.util.List;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

@Stateless
public class EmployeeService implements EmployeeServiceLocal, EmployeeServiceRemote {
  @PersistenceContext(unitName="EmployeeService")
  EntityManager em;
  
  public EmployeeService() {
  }
  public void doAction(){


    Employee employee = new Employee();
    employee.setFirstName("E");
    employee.setLastName("E");

    em.persist(employee);

    employee.setLastName("New");
    em.merge(employee);
    
    em.remove(employee);
    
    em.flush();
    System.out.println("saved");
    
    
    List list = em.createQuery("FROM Employee p").getResultList();
    
    
  }
}

    