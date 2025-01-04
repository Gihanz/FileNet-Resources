package entity.bean;

import javax.ejb.Remove;

public interface ShoppingCart
{
   void buy(String product, int quantity, double price);

   Order getOrder();

   @Remove void checkout();
}
