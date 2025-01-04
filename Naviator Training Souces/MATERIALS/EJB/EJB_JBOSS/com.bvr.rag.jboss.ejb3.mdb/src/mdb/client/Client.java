package mdb.client;

import java.util.Properties;

import javax.jms.Queue;
import javax.jms.QueueConnection;
import javax.jms.QueueConnectionFactory;
import javax.jms.QueueSender;
import javax.jms.QueueSession;
import javax.jms.TextMessage;
import javax.naming.Context;
import javax.naming.InitialContext;

public class Client
{
   public static void main(String[] args) throws Exception
   {
      QueueConnection cnn = null;
      QueueSender sender = null;
      QueueSession session = null;
      Context ctx = getInitialContext();
      Queue queue = (Queue) ctx.lookup("queue/tutorial/example");
      QueueConnectionFactory factory = (QueueConnectionFactory) ctx.lookup("ConnectionFactory");
      cnn = factory.createQueueConnection();
      session = cnn.createQueueSession(false, QueueSession.AUTO_ACKNOWLEDGE);

      TextMessage msg = session.createTextMessage("Hello World");

      sender = session.createSender(queue);
      sender.send(msg);
      System.out.println("Message sent successfully to remote queue.");

   }
   public static Context getInitialContext() 
   throws javax.naming.NamingException {

   Properties p = new Properties();
	p.put(Context.INITIAL_CONTEXT_FACTORY, "org.jnp.interfaces.NamingContextFactory");  
	p.put(Context.PROVIDER_URL, "jnp://localhost:1099");
   return new javax.naming.InitialContext(p);
}
}
