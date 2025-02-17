package entity.bean;

import javax.ejb.Remote;
import javax.ejb.Remove;
import javax.ejb.Stateful;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.PersistenceContext;


@Stateful
@Remote(ShoppingCart.class)
public class ShoppingCartBean implements ShoppingCart, java.io.Serializable
{
   @PersistenceContext
   private EntityManager manager;
   private Order order;

   public void buy(String product, int quantity, double price)
   {
      if (order == null) order = new Order();
      order.addPurchase(product, quantity, price);
   }

   public Order getOrder()
   {
      return order;
   }

   @Remove
   public void checkout()
   {
      manager.persist(order);
   }
}
