package queue;

import java.io.*;
import java.util.*;
import javax.transaction.*;
import javax.naming.*;
import javax.jms.*;
import javax.jms.Queue;

public class QueueBrowse
{

// jndi factory where weblogic shares jms messages
//jms_factory - connection factory which is used in exchanging of messages (created using weblogic console)
//program is queue so declare queue name which is created in weblogic console

	public final static String JNDI_FACTORY="com.sun.jndi.fscontext.RefFSContextFactory";
	  public final static String JMS_FACTORY="BVR" + File.separator + "MQ14ClientQCF";
	  public final static String QUEUE="BVR" + File.separator + "Queue1";



  private QueueConnectionFactory qconFactory;
  private QueueConnection qcon;

// session which is established when the messages are going to exchange

  private QueueSession qsession;
// QueueBrowser which is used to view queue messages

  private QueueBrowser qbrowser;
  private Queue queue;

  public void init(Context ctx, String queueName)
       throws NamingException, JMSException

  {

//look up for the queue connection factory jndi name

    qconFactory = (QueueConnectionFactory) ctx.lookup(JMS_FACTORY);
    qcon = qconFactory.createQueueConnection();
    qsession = qcon.createQueueSession(false, Session.AUTO_ACKNOWLEDGE);
    queue = (Queue) ctx.lookup(queueName);
//creation of the queue browser which is declared

    qbrowser = qsession.createBrowser(queue);

// start queue connection

    qcon.start();
  }
  public void displayQueue()
       throws JMSException
  {
//enumeration of browser connection which returns messages

    Enumeration e = qbrowser.getEnumeration();
    Message m = null;

    if (! e.hasMoreElements()) {
      System.out.println("There are no messages on this queue.");
    } else {
      System.out.println("Queued JMS Messages: ");
//checking the conditions to display id of the messages and jms time stamp
// time stamp which returns time of creation of queue messages.

      while (e.hasMoreElements()) {
        m = (Message) e.nextElement();
        System.out.println("Message ID " + m.getJMSMessageID() + 
                           " delivered " + new Date(m.getJMSTimestamp()) + 
                           " to " + m.getJMSDestination());
        System.out.print("\tExpires        ");
// checking whether jms message is expired or not 

        if (m.getJMSExpiration() > 0) {
          System.out.println( new Date( m.getJMSExpiration()));
            }
        else 
          System.out.println("never");

// priority method returns the order of priority of the messages

        System.out.println("\tPriority       " + m.getJMSPriority());
// always delivery mode is not persistent due to text messages but can be used as persistent messages 

        System.out.println("\tMode           " + (
                      m.getJMSDeliveryMode() == DeliveryMode.PERSISTENT ? 
                                       "PERSISTENT" : "NON_PERSISTENT"));
//its identification id of the messages

        System.out.println("\tCorrelation ID " + m.getJMSCorrelationID());
//whether declare queue sender to reply to same port

        System.out.println("\tReply to       " + m.getJMSReplyTo());
// to display the type of message

        System.out.println("\tMessage type   " + m.getJMSType());
        if (m instanceof TextMessage) {
          System.out.println("\tTextMessage    \"" + ((TextMessage)m).getText() + "\"");
        }
      }
    }
  }
//closing of queue connections

  public void close()
       throws JMSException
  {
    qbrowser.close();
    qsession.close();
    qcon.close();
  }


  public static void main(String[] args)
       throws Exception 
  {
    if (args.length != 1) {
      System.out.println("QueueBrowse WebLogicURL");
      return;
    }

// creating object of the queue 

    InitialContext ic = getInitialContext(args[0]);
    QueueBrowse qb = new QueueBrowse();
//to start
    qb.init(ic, QUEUE);
//to display message
    qb.displayQueue();
//to close the connection

    qb.close();
  }
// same as like stateless session beans

  private static InitialContext getInitialContext(String url)
       throws NamingException 
  {
    Hashtable env = new Hashtable();
    env.put(Context.INITIAL_CONTEXT_FACTORY, JNDI_FACTORY);
    env.put(Context.PROVIDER_URL, url);
    return new InitialContext(env);
  }

}




