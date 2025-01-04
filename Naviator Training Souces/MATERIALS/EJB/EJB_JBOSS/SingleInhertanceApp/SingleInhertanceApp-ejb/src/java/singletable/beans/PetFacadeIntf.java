/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package singletable.beans;

import java.util.List;
import javax.ejb.Remote;


/**
 *
 * @author SONY
 */
@Remote
public interface PetFacadeIntf {

   public void createDog(String name, double weight, int bones);
   
    public void createCat(String name, double weight, int lives);
}
