package queue;
import java.io.*;
import java.util.*;
import javax.transaction.*;
import javax.naming.*;
import javax.jms.*;
import javax.jms.Queue;
public class QueueSend
{
  public final static String JNDI_FACTORY="com.sun.jndi.fscontext.RefFSContextFactory";
  public final static String JMS_FACTORY="BVR" + File.separator + "MQ14ClientQCF";
  public final static String QUEUE="BVR" + File.separator + "Queue1";

  private QueueConnectionFactory qconFactory;
  private QueueConnection qcon;
  private QueueSession qsession;
  private QueueSender qsender;
  private Queue queue;
  private TextMessage msg;

  public void init(Context ctx, String queueName)
       throws NamingException, JMSException
  {
    qconFactory = (QueueConnectionFactory) ctx.lookup(JMS_FACTORY);
    qcon = qconFactory.createQueueConnection();
    qsession = qcon.createQueueSession(false, Session.AUTO_ACKNOWLEDGE);
    queue = (Queue) ctx.lookup(queueName);
    qsender = qsession.createSender(queue);
    msg = qsession.createTextMessage();
    qcon.start();
  }
  public void send(String message)
       throws JMSException
  {
    msg.setText(message);
    qsender.send(msg);
  }

  public void close()
       throws JMSException
  {
    qsender.close();
    qsession.close();
    qcon.close();
  }
  public static void main(String[] args)
       throws Exception 
  {
    if (args.length != 1) {
      System.out.println("QueueSend WebLogicURL");
      return;
    }
    InitialContext ic = getInitialContext(args[0]);
    QueueSend qs = new QueueSend();
    qs.init(ic, QUEUE);
    readAndSend(qs);
    qs.close();
  }

  private static void readAndSend(QueueSend qs) 
       throws IOException, JMSException
  {
    BufferedReader msgStream = new BufferedReader(new InputStreamReader(System.in));
    String line=null;
    boolean quitNow = false;
    do {
      System.out.print("Enter message (\"quit\" to quit): ");
      line = msgStream.readLine();
      if (line != null && line.trim().length() != 0) {
        qs.send(line);
        System.out.println("JMS Message Sent: "+line+"\n");
        quitNow = line.equalsIgnoreCase("quit");
      }
    } while (! quitNow);

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

