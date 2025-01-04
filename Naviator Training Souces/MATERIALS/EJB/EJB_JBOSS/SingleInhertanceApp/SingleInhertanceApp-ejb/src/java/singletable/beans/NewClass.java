/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package singletable.beans;

import java.util.logging.Level;
import java.util.logging.Logger;
import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;

/**
 *
 * @author SONY
 */
public class NewClass {
    PetFacadeLocal petFacade = lookupPetFacadeLocal();
  
    public static void main(String[] s)
    {
        NewClass a= new NewClass();
        System.out.println(a.callClass());
       
    }

    private PetFacadeLocal lookupPetFacadeLocal() {
        try {
            Context c = new InitialContext();
            return (PetFacadeLocal) c.lookup("java:global/SingleInhertanceApp/SingleInhertanceApp-ejb/PetFacade!singletable.beans.PetFacadeLocal");
        } catch (NamingException ne) {
            Logger.getLogger(getClass().getName()).log(Level.SEVERE, "exception caught", ne);
            throw new RuntimeException(ne);
        }
    }
    
        public boolean callClass()
        {
             petFacade.createCat("dd", 22.2, 11);
             return true;
        }
        
        
    
    
}
