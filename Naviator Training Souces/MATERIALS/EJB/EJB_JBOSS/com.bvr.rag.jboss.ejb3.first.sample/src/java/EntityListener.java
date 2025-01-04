
import javax.persistence.PostLoad;
import javax.persistence.PostPersist;
import javax.persistence.PostRemove;
import javax.persistence.PostUpdate;

public class EntityListener
{
   @PostUpdate
   public void update(Object entity)
   {
      System.out.println("@PostUpdate: " + entity.getClass().getName());
   }

   @PostPersist
   public void persist(Object entity)
   {
      System.out.println("@PostPersist: " + entity.getClass().getName());
   }

   @PostLoad
   public void load(Object entity)
   {
      System.out.println("@PostLoad: " + entity.getClass().getName());
   }
      
   @PostRemove
   public void remove(Object entity)
   {
      System.out.println("@PostRemove: " + entity.getClass().getName());
   }
  
}
