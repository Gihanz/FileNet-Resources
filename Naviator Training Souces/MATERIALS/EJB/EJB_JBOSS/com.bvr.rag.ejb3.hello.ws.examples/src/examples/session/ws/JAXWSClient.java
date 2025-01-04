package examples.session.ws;

import java.net.URL;

import javax.xml.namespace.QName;
import javax.xml.ws.Service;

/**
 * This is an example of a standalone JAX-WS client. To compile,  
 * it requires some XML artifacts to be generated from the service's
 * WSDL. This is done in the build file.
 * 
 * The mapped XML classes used her are  
 * 1. the HelloBean port type class (this is NOT the bean impl. class!)
 * 2. the Greeter service class  
 */
public class JAXWSClient {
    
    static String host = "localhost";
    static String portType = "HelloBean";    
    static String serviceName = "Greeter";    
    static String serviceEndpointAddress = "http://" + host + ":8080/" + serviceName;
    static String nameSpace = "urn:ws.session.examples";
    
    public static void main(String[] args) throws Exception {        

        URL wsdlLocation = new URL(serviceEndpointAddress + "/" + portType + "?WSDL"); 
        QName serviceNameQ = new QName( nameSpace, serviceName);
        
        // dynamic service usage
        Service service = Service.create(wsdlLocation, serviceNameQ);
        HelloBean firstGreeterPort = service.getPort(HelloBean.class);         
        System.out.println("1: " + firstGreeterPort.hello());
        
        // static service usage
//        Greeter greeter = new Greeter();
//        HelloBean secondGreeterPort = greeter.getGreeterPort(); 
//        System.out.println("2: " +secondGreeterPort.hello());     
    }
}
