package clustering.bean;

import javax.ejb.Stateless;
import javax.ejb.Remote;
import org.jboss.annotation.ejb.Clustered;
import org.jboss.annotation.ejb.Clustered;

@Stateless
@Clustered
@Remote(Session.class)
public class SessionBean implements Session
{
   public void test()
   {
      System.out.println("hello!!!");
   }
}
