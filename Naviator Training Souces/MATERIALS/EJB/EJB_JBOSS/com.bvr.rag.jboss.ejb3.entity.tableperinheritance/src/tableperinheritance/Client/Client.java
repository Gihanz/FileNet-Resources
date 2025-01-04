package tableperinheritance.Client;


import tableperinheritance.bean.Pet;
import tableperinheritance.bean.PetDAO;

import javax.naming.Context;
import javax.naming.InitialContext;

import java.util.List;
import java.util.Properties;

/**
 * Comment
 *
 * @author <a href="mailto:bill@jboss.org">Bill Burke</a>
 * @version $Revision: 1.2.6.9 $
 */
public class Client
{
   public static void main(String[] args) throws Exception
   {
      Context ctx = getInitialContext();
      PetDAO dao = (PetDAO) ctx.lookup("PetDAOBean/remote");

      dao.createCat("Toonses", 15.0, 9);
      dao.createCat("Sox", 10.0, 5);
      dao.createDog("Winnie", 70.0, 5);
      dao.createDog("Junior", 11.0, 1);

      List l = dao.findByWeight(14.0);
      for (Object o : l)
      {
         System.out.println(((Pet) o).getName());
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
