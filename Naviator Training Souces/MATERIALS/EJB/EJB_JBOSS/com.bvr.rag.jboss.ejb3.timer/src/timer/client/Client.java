package timer.client;

import java.util.Properties;

import timer.bean.ExampleTimer;

import javax.naming.Context;
import javax.naming.InitialContext;


public class Client
{
   public static void main(String[] args) throws Exception
   {
      Context ctx = getInitialContext();
      ExampleTimer timer = (ExampleTimer) ctx.lookup("ExampleTimerBean/remote");
      timer.scheduleTimer(5000);
   }
   public static Context getInitialContext() 
   throws javax.naming.NamingException {

   Properties p = new Properties();
	p.put(Context.INITIAL_CONTEXT_FACTORY, "org.jnp.interfaces.NamingContextFactory");  
	p.put(Context.PROVIDER_URL, "jnp://localhost:1099");
   return new javax.naming.InitialContext(p);
}
}
