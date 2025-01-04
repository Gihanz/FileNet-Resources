package queue;


import java.io.*;
import java.util.*;
import javax.transaction.*;
import javax.naming.*;
import javax.jms.*;
import javax.jms.Queue;

public class QueueReceive
  implements MessageListener
{
	public final static String JNDI_FACTORY="com.sun.jndi.fscontext.RefFSContextFactory";
	  public final static String JMS_FACTORY="BVR" + File.separator + "MQ14ClientQCF";
	  public final static String QUEUE="BVR" + File.separator + "Queue1";

  private QueueConnectionFactory qconFactory;
  private QueueConnection qcon;
  private QueueSession qsession;
  private QueueReceiver qreceiver;
  private Queue queue;
  private boolean quit = false;

  public void onMessage(Message msg)
  {
    try {
      String msgText;
      if (msg instanceof TextMessage) {
        msgText = ((TextMessage)msg).getText();
      } else {
        msgText = msg.toString();
      }

      System.out.println("Message Received: "+ msgText );
      
      if (msgText.equalsIgnoreCase("quit")) {
        synchronized(this) {
          quit = true;
          this.notifyAll(); // Notify main thread to quit
        }
      }
    } catch (JMSException jmse) {
      jmse.printStackTrace();
    }
  }

  public void init(Context ctx, String queueName)
       throws NamingException, JMSException
  {
    qconFactory = (QueueConnectionFactory) ctx.lookup(JMS_FACTORY);
    qcon = qconFactory.createQueueConnection();
    qsession = qcon.createQueueSession(false, Session.AUTO_ACKNOWLEDGE);
    queue = (Queue) ctx.lookup(queueName);
    qreceiver = qsession.createReceiver(queue);
    qreceiver.setMessageListener(this);
    qcon.start();
  }

  public void close()
       throws JMSException
  {
    qreceiver.close();
    qsession.close();
    qcon.close();
  }

  public static void main(String[] args)
       throws Exception 
  {
    if (args.length != 1) {
      System.out.println("QueueReceive WebLogicURL");
      return;
    }
    InitialContext ic = getInitialContext(args[0]);
    QueueReceive qr = new QueueReceive();
    qr.init(ic, QUEUE);

    System.out.println("JMS Ready To Receive Messages (To quit, send a \"quit\" message).");


    synchronized(qr) {
      while (! qr.quit) {
        try {
          qr.wait();
        } catch (InterruptedException ie) {}
      }
    }
    qr.close();
  }

  private static InitialContext getInitialContext(String url)
       throws NamingException
  {
    Hashtable env = new Hashtable();
    env.put(Context.INITIAL_CONTEXT_FACTORY, JNDI_FACTORY);
    env.put(Context.PROVIDER_URL, url);
    return new InitialContext(env);
  }

}




