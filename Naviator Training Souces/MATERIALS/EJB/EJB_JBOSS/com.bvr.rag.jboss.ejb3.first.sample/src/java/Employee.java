import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.PostRemove;

@Entity
@EntityListeners(EntityListener.class)
public class Employee implements java.io.Serializable {
  private int id;

  private String firstName;

  private String lastName;

  @Id
  @GeneratedValue
  public int getId() {
    return id;
  }


  @PostRemove
  public void postRemove()
  {
     System.out.println("@PostRemove");
  }

  public void setId(int id) {
    this.id = id;
  }

  public String getFirstName() {
    return firstName;
  }

  public void setFirstName(String first) {
    this.firstName = first;
  }

  public String getLastName() {
    return lastName;
  }

  public void setLastName(String last) {
    this.lastName = last;
  }
}
