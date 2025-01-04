import javax.ejb.EJBException;
//import javax.ejb.EJBNoSuchObjectException;
import javax.naming.InitialContext;

import java.rmi.NoSuchObjectException;
import java.util.HashMap;


public class Client
{
   public static void main(String[] args) throws Exception
   {
      InitialContext ctx = new InitialContext();
      ShoppingCart cart = (ShoppingCart) ctx.lookup(ShoppingCart.class.getName());

      System.out.println("Buying 1 memory stick");
      cart.buy("Memory stick", 1);
      System.out.println("Buying another memory stick");
      cart.buy("Memory stick", 1);

      System.out.println("Buying a laptop");
      cart.buy("Laptop", 1);

      System.out.println("Print cart:");
      HashMap<String, Integer> fullCart = cart.getCartContents();
      for (String product : fullCart.keySet())
      {
         System.out.println(fullCart.get(product) + "     " + product);
      }

      System.out.println("Checkout");
      cart.checkout();

      System.out.println("Should throw an object not found exception by invoking on cart after @Remove method");
      try
      {
         cart.getCartContents();
      }
      catch (Exception e)
      {
            System.out.println("Successfully caught no such object exception.");
      }


   }
}
