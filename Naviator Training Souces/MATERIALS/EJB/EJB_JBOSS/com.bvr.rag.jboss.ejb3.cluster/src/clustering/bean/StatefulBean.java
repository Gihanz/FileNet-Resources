package clustering.bean;

import javax.ejb.Stateful;
import javax.ejb.Remote;
import org.jboss.annotation.ejb.Clustered;

@Stateful
@Clustered
@Remote(StatefulRemote.class)
public class StatefulBean implements java.io.Serializable, StatefulRemote
{
   private int state = 0;

   public void increment()
   {
      System.out.println("counter: " + (++state));
   }
   
   public String toString()
   {
      return super.toString() + " state-(" + state + ")";
   }
}
