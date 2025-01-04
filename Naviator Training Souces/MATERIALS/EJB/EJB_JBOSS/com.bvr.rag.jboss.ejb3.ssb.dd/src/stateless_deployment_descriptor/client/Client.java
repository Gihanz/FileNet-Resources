package stateless_deployment_descriptor.client;

import stateless_deployment_descriptor.bean.Calculator;
import stateless_deployment_descriptor.bean.CalculatorRemote;

import javax.naming.InitialContext;

public class Client
{
   public static void main(String[] args) throws Exception
   {
      InitialContext ctx = new InitialContext();
      Calculator calculator = (Calculator) ctx.lookup(CalculatorRemote.class.getName());

      System.out.println("1 + 1 = " + calculator.add(1, 1));
      System.out.println("1 - 1 = " + calculator.subtract(1, 1));
   }
}
