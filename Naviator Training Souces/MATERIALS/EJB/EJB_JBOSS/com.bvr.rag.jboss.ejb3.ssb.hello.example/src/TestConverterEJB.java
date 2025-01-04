
import java.util.Properties;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.rmi.PortableRemoteObject;

import junit.framework.TestCase;

//import org.apache.cactus.ServletTestCase;

//import examples.session.stateless.Hello;

public class TestConverterEJB extends TestCase
{
  private Hello hello;
  
  public TestConverterEJB(String methodName)
  {
	  super(methodName);
  }
    public void setUp() throws Exception
    {
        
    	Context ctx = getInitialContext();

		/*
		 * Get a reference to a bean instance, looked up by class name
		 */
		hello = (Hello) ctx.lookup("HelloBean/remote");
    }

    public static Context getInitialContext() 
    throws javax.naming.NamingException {

    Properties p = new Properties();
	p.put(Context.INITIAL_CONTEXT_FACTORY, "org.jnp.interfaces.NamingContextFactory");  
	p.put(Context.PROVIDER_URL, "jnp://localhost:1099");
    return new javax.naming.InitialContext(p);
    }
   
    public void testConvert() throws Exception
    {
    	System.out.println(hello.hello());
    	assertEquals("ragavendra", hello.hello());
    }
}
