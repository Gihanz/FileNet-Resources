/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package tableperinheritance.bean;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.jws.WebService;
/**
 *
 * @author SONY
 */
@Stateless
@WebService(endpointInterface="tableperinheritance.bean.PetFacadeIntf")

public class PetFacade extends AbstractFacade<Pet> implements PetFacadeLocal, PetFacadeIntf {
    @PersistenceContext(unitName = "TablePerInheritancePU")
    private EntityManager em;

    @Override
    protected EntityManager getEntityManager() {
        return em;
    }

    public PetFacade() {
        super(Pet.class);
    }
    
    public void createDog(String name, double weight, int bones)
    {
        Dog dog = new Dog();
        
        dog.setName(name);
      dog.setWeight(weight);
      dog.setNumBones(bones);
      em.persist(dog);
    }
    
}
