

import java.util.Properties;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.rmi.PortableRemoteObject;

/**
 * This class is an example of client code which invokes
 * methods on a simple, remote stateless session bean.
 */
public class HelloClient {

	public static void main(String[] args) throws Exception {
		/*
		 * Obtain the JNDI initial context.
		 *
		 * The initial context is a starting point for
		 * connecting to a JNDI tree. We choose our JNDI
		 * driver, the network location of the server, etc
		 * by passing in the environment properties.
		 */
		Context ctx = getInitialContext();

		/*
		 * Get a reference to a bean instance, looked up by class name
		 */
		Hello hello = (Hello) ctx.lookup("HelloBean/remote");
//		Object h = ctx.lookup("HelloBean");
		/*
		 * Call the hello() method on the bean.
		 * We then print the result to the screen.
		 */
		
//		Hello hello= (Hello)PortableRemoteObject.narrow(h, Hello.class);
		System.out.println(hello.hello());

	}
	public static Context getInitialContext() 
    throws javax.naming.NamingException {

    Properties p = new Properties();
	p.put(Context.INITIAL_CONTEXT_FACTORY, "org.jnp.interfaces.NamingContextFactory");  
	p.put(Context.PROVIDER_URL, "jnp://localhost:1099");
    return new javax.naming.InitialContext(p);
}
}
