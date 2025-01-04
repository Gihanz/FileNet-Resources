package joininheritance.bean;

import javax.naming.InitialContext;

import java.util.List;


public class Client
{
   public static void main(String[] args) throws Exception
   {
      InitialContext ctx = new InitialContext();
      PetFacade dao = (PetFacade) ctx.lookup("java:global/JoinedInhertance/PetFacade");

      dao.createCat("Toonses", 15.0, 9);
      dao.createCat("Sox", 10.0, 5);
      dao.createDog("Winnie", 70.0, 5);
      dao.createDog("Junior", 11.0, 1);

     
   }
}
