

import java.util.Properties;

import javax.naming.Context;
import javax.naming.InitialContext;

/**
 * This class is a simple client for a stateful session bean.
 *
 * To illustrate how passivation works, configure your EJB server
 * to allow only 2 stateful session beans in memory. (Consult your 
 * vendor documentation for details on how to do this.) We create 
 * 3 beans in this example to see how and when beans are passivated.
 */
public class CountClient {

    public static final int noOfClients = 3;

    public static void main(String[] args) {
        try {
            /* Get a reference to the bean */
        	Context ctx = getInitialContext();


            /* An array to hold the Count beans */
            Count count[] = new Count[noOfClients];
            int countVal = 0;

            /* Create and count() on each member of array */
            System.out.println("Instantiating beans...");
            for (int i = 0; i < noOfClients; i++) {
                count[i] = (Count) ctx.lookup("CountBean/remote");

                /* initialize each bean to the current count value */
                count[i].set(countVal);

                /* Add 1 and print */
                countVal = count[i].count();
                System.out.println(countVal);

                /*  Sleep for 1/2 second */
                Thread.sleep(100);
            }

            /*
             * Let's call count() on each bean to  make sure the 
             * beans were passivated and activated properly.
             */
            System.out.println("Calling count() on beans...");
            for (int i = 0; i < noOfClients; i++) {

                /* Add 1 and print */
                countVal = count[i].count();
                System.out.println(countVal);

                /* call remove to let the container dispose of the bean */
                count[i].remove();

                /*  Sleep for 1/2 second */
                Thread.sleep(50);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    public static Context getInitialContext() 
    throws javax.naming.NamingException {

    Properties p = new Properties();
	p.put(Context.INITIAL_CONTEXT_FACTORY, "org.jnp.interfaces.NamingContextFactory");  
	p.put(Context.PROVIDER_URL, "jnp://localhost:1099");
    return new javax.naming.InitialContext(p);
}
}
