package tableperinheritance.bean;

import java.util.List;
import javax.ejb.Remote;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.PersistenceContext;

@Stateless
@Remote(PetDAO.class)
public class PetDAOBean implements PetDAO
{
   @PersistenceContext
   private EntityManager manager;

   public void createDog(String name, double weight, int bones)
   {
      Dog dog = new Dog();
      dog.setName(name);
      dog.setWeight(weight);
      //dog.setNumBones(20);
      manager.persist(dog);
   }

   public void createCat(String name, double weight, int lives)
   {
      Cat cat = new Cat();
      cat.setName(name);
      cat.setWeight(weight);
      //cat.setLives(10);
      manager.persist(cat);
   }

   public List findByWeight(double weight)
   {
      return manager.createQuery("select p from Pet p where p.weight < :weight").setParameter("weight", weight).getResultList();
   }
}
