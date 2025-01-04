package topic;
import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Hashtable;
import javax.jms.JMSException;
import javax.jms.Session;
import javax.jms.TextMessage;
import javax.jms.Topic;
import javax.jms.TopicConnection;
import javax.jms.TopicConnectionFactory;
import javax.jms.TopicPublisher;
import javax.jms.TopicSession;
import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;

public class TopicSend
{
	


  public final static String JNDI_FACTORY="com.sun.jndi.fscontext.RefFSContextFactory";
  public final static String JMS_FACTORY="MQ14ServerTCF";
  public final static String TOPIC="BestPriceRequest";

  protected TopicConnectionFactory tconFactory;
  protected TopicConnection tcon;
  protected TopicSession tsession;
  protected TopicPublisher tpublisher;
  protected Topic topic;
  protected TextMessage msg;

  public void init(Context ctx, String topicName)
       throws NamingException, JMSException
  {
    tconFactory = (TopicConnectionFactory) ctx.lookup(JMS_FACTORY);
    tcon = tconFactory.createTopicConnection();
    tsession = tcon.createTopicSession(false, Session.AUTO_ACKNOWLEDGE);
    topic = (Topic) ctx.lookup(topicName);
    tpublisher = tsession.createPublisher(topic);
    msg = tsession.createTextMessage();
    tcon.start();
  }

  public void send(String message)
       throws JMSException
  {

    msg.setText(message);
    tpublisher.publish(msg);
  }

  public void close()
       throws JMSException
  {
    tpublisher.close();
    tsession.close();
    tcon.close();
  }

  public static void main(String[] args)
       throws Exception 
  {
    if (args.length != 1) {
      System.out.println("specify URL");
      return;
    }
    InitialContext ic = getInitialContext(args[0]);
    TopicSend ts = new TopicSend();
    ts.init(ic, TOPIC);
    readAndSend(ts);
    ts.close();
  }

  protected static void readAndSend(TopicSend ts) 
       throws IOException, JMSException
  {
    BufferedReader msgStream = new BufferedReader (new InputStreamReader(System.in));
    String line=null;
    do {
      System.out.print("Enter message (\"quit\" to quit): ");
      line = msgStream.readLine();
      if (line != null && line.trim().length() != 0) {
        ts.send(line);
        System.out.println("JMS Message Sent: "+line+"\n");
      }
    } while (line != null && ! line.equalsIgnoreCase("quit"));

  }
  protected static InitialContext getInitialContext(String url)
       throws NamingException
  {
    Hashtable env = new Hashtable();
    env.put(Context.INITIAL_CONTEXT_FACTORY, JNDI_FACTORY);
    env.put(Context.PROVIDER_URL, url);
    env.put("weblogic.jndi.createIntermediateContexts", "true");
    return new InitialContext(env);
  }

}

