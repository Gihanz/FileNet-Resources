package examples.session.ws;

import javax.ejb.Stateless;
import javax.jws.WebService;

@Stateless
@WebService(serviceName="Greeter", portName="GreeterPort")
public class HelloBean  {

    public String hello() { 
        System.out.println("hello()");
        return "Hello, World!";
    }
    
    public void foo() {
        ;
    }
}
