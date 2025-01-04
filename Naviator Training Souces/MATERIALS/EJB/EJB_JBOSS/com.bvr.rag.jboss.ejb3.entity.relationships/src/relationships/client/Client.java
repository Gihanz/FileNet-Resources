package relationships.client;

import java.util.Properties;

import relationships.bean.Customer;
import relationships.bean.EntityTest;
import relationships.bean.Flight;

import javax.naming.Context;
import javax.naming.InitialContext;

public class Client
{
   public static void main(String[] args) throws Exception
   {
      Context ctx = getInitialContext();
      EntityTest test = (EntityTest) ctx.lookup("EntityTestBean/remote");
      test.manyToManyCreate();

      Flight one = test.findFlightById(new Long(1));

      Flight two = test.findFlightById(new Long(2));

      System.out.println("Air France customers");
      for (Customer c : one.getCustomers())
      {
         System.out.println(c.getName());

      }
      System.out.println("USAir customers");

      for (Customer c : two.getCustomers())
      {
         System.out.println(c.getName());
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
