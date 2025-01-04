package clustering.client;

import clustering.bean.StatefulRemote;

import javax.naming.InitialContext;

public class StatefulRun
{
   public static void main(String[] args) throws Exception
   {
      InitialContext ctx = new InitialContext();
      StatefulRemote remote = (StatefulRemote) ctx.lookup("StatefulBean/remote");
      while (true)
      {
         remote.increment();
         Thread.sleep(10000);
      }
   }
}
