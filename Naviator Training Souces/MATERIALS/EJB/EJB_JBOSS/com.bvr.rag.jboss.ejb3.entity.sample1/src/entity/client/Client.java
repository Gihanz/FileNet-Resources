/*
* JBoss, Home of Professional Open Source
* Copyright 2005, JBoss Inc., and individual contributors as indicated
* by the @authors tag. See the copyright.txt in the distribution for a
* full listing of individual contributors.
*
* This is free software; you can redistribute it and/or modify it
* under the terms of the GNU Lesser General Public License as
* published by the Free Software Foundation; either version 2.1 of
* the License, or (at your option) any later version.
*
* This software is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
* Lesser General Public License for more details.
*
* You should have received a copy of the GNU Lesser General Public
* License along with this software; if not, write to the Free
* Software Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA
* 02110-1301 USA, or see the FSF site: http://www.fsf.org.
*/
package entity.client;


import java.util.Properties;

import entity.bean.LineItem;
import entity.bean.Order;
import entity.bean.ShoppingCart;

import javax.naming.Context;
import javax.naming.InitialContext;

public class Client
{
   public static void main(String[] args) throws Exception
   {
      Context ctx = getInitialContext();
      ShoppingCart cart = (ShoppingCart) ctx.lookup("ShoppingCartBean/remote");

      System.out.println("Buying 2 memory sticks");
      cart.buy("Memory stick", 2, 500.00);
      System.out.println("Buying a laptop");
      cart.buy("Laptop", 1, 2000.00);

      System.out.println("Print cart:");
      Order order = cart.getOrder();
      System.out.println("Total: $" + order.getTotal());
      for (LineItem item : order.getLineItems())
      {
         System.out.println(item.getQuantity() + "     " + item.getProduct() + "     " + item.getSubtotal());
      }

      System.out.println("Checkout");
      cart.checkout();

   }
   public static Context getInitialContext() 
   throws javax.naming.NamingException {

   Properties p = new Properties();
	p.put(Context.INITIAL_CONTEXT_FACTORY, "org.jnp.interfaces.NamingContextFactory");  
	p.put(Context.PROVIDER_URL, "jnp://localhost:1099");
   return new javax.naming.InitialContext(p);
}
}
