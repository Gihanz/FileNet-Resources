package queue;
import java.io.*;
import java.util.*;
import javax.transaction.*;
import javax.naming.*;
import javax.jms.*;
import javax.jms.Queue;

public class QueueReceiveInTx
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
  private UserTransaction utx;
  public void receiveMessages()
  {
    Message msg = null;
    String msgText = "hello";

    try {
      utx.begin();
      System.out.println("TRANSACTION BEGUN");
      do {
        msg = qreceiver.receive();
        if (msg != null) {
          if (msg instanceof TextMessage) {
//            msgText = ((TextMessage)msg).getText();
            msgText = "hello";
		
          } else {
            msgText = msg.toString();
          }
//          System.out.println("Message Received: "+ msgText );
	System.out.println(((TextMessage)msg).getText());
          if (msgText.equalsIgnoreCase("quit")) {
            utx.commit();
            System.out.println("TRANSACTION COMMITTED");
          }
        }
      } while(msg != null && ! msgText.equals("quit"));
    } catch (JMSException jmse) {
      System.out.println("Error receiving JMS message: "+jmse);
      jmse.printStackTrace();
    } catch (javax.transaction.NotSupportedException nse) {
      System.out.println("TRANSACTION COULD NOT BEGIN DUE TO: "+ nse);      
    } catch (javax.transaction.RollbackException rbe) {
      System.out.println("TRANSACTION ROLLED BACK DUE TO: "+rbe);
    } catch (javax.transaction.HeuristicRollbackException hre) {
      System.out.println("TRANSACTION ROLLED BACK DUE TO: "+hre);
    } catch (javax.transaction.HeuristicMixedException hme) {
      System.out.println("TRANSACTION ROLLED BACK DUE TO: "+hme);
    } catch (javax.transaction.SystemException se) {
      System.out.println("TRANSACTION EXCEPTION: "+se);
    }
  }

  public void init(Context ctx, String queueName)
       throws NamingException, JMSException
  {
    qconFactory = (QueueConnectionFactory) ctx.lookup(JMS_FACTORY);
    qcon = qconFactory.createQueueConnection();
    qsession = qcon.createQueueSession(false, Session.CLIENT_ACKNOWLEDGE);
    utx = (UserTransaction) ctx.lookup("javax.transaction.UserTransaction");
    queue = (Queue) ctx.lookup(queueName);
    qreceiver = qsession.createReceiver(queue);
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
      System.out.println("QueueReceiveInTx WebLogicURL");
      return;
    }
    InitialContext ic = getInitialContext(args[0]);
    QueueReceiveInTx qr = new QueueReceiveInTx();
    qr.init(ic, QUEUE);

    System.out.println("JMS Ready To Receive Messages (To quit, send a \"quit\" message).");

    qr.receiveMessages();
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




