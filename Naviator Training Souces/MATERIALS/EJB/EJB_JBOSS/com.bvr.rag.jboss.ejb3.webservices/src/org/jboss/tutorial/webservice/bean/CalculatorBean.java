package org.jboss.tutorial.webservice.bean;

import javax.ejb.Stateless;
import javax.jws.WebService;
import javax.jws.soap.SOAPBinding;
import javax.jws.soap.SOAPBinding.Style;

@Stateless
@WebService(endpointInterface="org.jboss.tutorial.webservice.bean.Calculator")
public class CalculatorBean
{
   public int add(int x, int y)
   {
      return x + y;
   }

   public int subtract(int x, int y)
   {
      return x - y;
   }
}
