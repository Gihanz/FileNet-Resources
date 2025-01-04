import java.util.Collection;

import javax.naming.InitialContext;


public class Main {

  public static void main(String[] a) throws Exception {

    EmployeeServiceRemote service = null;

    // Context compEnv = (Context) new InitialContext().lookup("java:comp/env");

    // service = (HelloService)new InitialContext().lookup("java:comp/env/ejb/HelloService");
    service = (EmployeeServiceRemote) new InitialContext().lookup("EmployeeService/remote");
    
    

    
    
    service.doAction();

  }

}
