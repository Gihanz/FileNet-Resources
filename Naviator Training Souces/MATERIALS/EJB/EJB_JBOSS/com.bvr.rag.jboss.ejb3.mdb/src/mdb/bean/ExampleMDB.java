package mdb.bean;

import javax.ejb.MessageDriven;
import javax.ejb.ActivationConfigProperty;
import javax.jms.Message;
import javax.jms.MessageListener;

@MessageDriven(activationConfig =
        {
        @ActivationConfigProperty(propertyName="destinationType", propertyValue="javax.jms.Queue"),
        @ActivationConfigProperty(propertyName="destination", propertyValue="queue/bvrQueue")
        })
public class ExampleMDB implements MessageListener
{
   public void onMessage(Message recvMsg)
   {
      System.out.println("------"+recvMsg+"----------");
      System.out.println("Received message");
      System.out.println("----------------");
   }

}
