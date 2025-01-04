package org.jboss.tutorial.webservice.client;

import org.jboss.tutorial.webservice.bean.Calculator;

import javax.xml.namespace.QName;
import javax.xml.rpc.Service;
import javax.xml.rpc.ServiceFactory;
import java.net.URL;
import java.io.File;

public class Client
{
   public static void main(String[] args) throws Exception
   {
      URL url = new URL("http://localhost:8080/webservice/CalculatorBean?wsdl");
      QName qname = new QName("http://bean.webservice.tutorial.jboss.org/jaws",
              "CalculatorService");

      ServiceFactory factory = ServiceFactory.newInstance();
      Service service = factory.createService(url, qname);

      Calculator calculator = (Calculator) service.getPort(Calculator.class);

      System.out.println("1 + 1 = " + calculator.add(1, 1));
      System.out.println("1 - 1 = " + calculator.subtract(1, 1));
   }
}
