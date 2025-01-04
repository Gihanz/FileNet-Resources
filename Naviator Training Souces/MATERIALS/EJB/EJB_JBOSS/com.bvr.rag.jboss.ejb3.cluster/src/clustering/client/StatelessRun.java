package clustering.client;

import clustering.bean.Session;

import javax.naming.InitialContext;

public class StatelessRun
{
   public static void main(String[] args) throws Exception
   {
      InitialContext ctx = new InitialContext();
      Session remote = (Session) ctx.lookup("SessionBean/remote");
      while (true)
      {
         remote.test();
         Thread.sleep(1000);
      }
   }
}
