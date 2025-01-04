package topic;
import java.util.Hashtable;

import javax.jms.JMSException;
import javax.jms.Message;
import javax.jms.MessageListener;
import javax.jms.Session;
import javax.jms.TextMessage;
import javax.jms.Topic;
import javax.jms.TopicConnection;
import javax.jms.TopicConnectionFactory;
import javax.jms.TopicSession;
import javax.jms.TopicSubscriber;
import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;

public class TopicReceive
  implements MessageListener
{

  public final static String JNDI_FACTORY="weblogic.jndi.WLInitialContextFactory";
  public final static String JMS_FACTORY="bvrFactory";
  public final static String TOPIC="bvrTopic";

  private TopicConnectionFactory tconFactory;
  private TopicConnection tcon;
  private TopicSession tsession;
  private TopicSubscriber tsubscriber;
  private Topic topic;
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

      System.out.println("JMS Message Received: "+ msgText );
      
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

  public void init(Context ctx, String topicName)
       throws NamingException, JMSException
  {
    tconFactory = (TopicConnectionFactory) ctx.lookup(JMS_FACTORY);
    tcon = tconFactory.createTopicConnection();
    tsession = tcon.createTopicSession(false, Session.AUTO_ACKNOWLEDGE);
    topic = (Topic) ctx.lookup(topicName);
    tsubscriber = tsession.createSubscriber(topic);
    tsubscriber.setMessageListener(this);
    tcon.start();
  }

  public void close()
       throws JMSException
  {
    tsubscriber.close();
    tsession.close();
    tcon.close();
  }
  public static void main(String[] args)
       throws Exception 
  {
    if (args.length != 1) {
      System.out.println("TopicReceive WebLogicURL");
      return;
    }
    InitialContext ic = getInitialContext(args[0]);
    TopicReceive tr = new TopicReceive();
    tr.init(ic, TOPIC);

    System.out.println("JMS Ready To Receive Messages (To quit, send a \"quit\" message).");


    synchronized(tr) {
      while (! tr.quit) {
        try {
          tr.wait();
        } catch (InterruptedException ie) {}
      }
    }
    tr.close();
  }

  private static InitialContext getInitialContext(String url)
       throws NamingException
  {
    Hashtable env = new Hashtable();
    env.put(Context.INITIAL_CONTEXT_FACTORY, JNDI_FACTORY);
    env.put(Context.PROVIDER_URL, url);
    env.put("weblogic.jndi.createIntermediateContexts", "true");
    return new InitialContext(env);
  }

}



