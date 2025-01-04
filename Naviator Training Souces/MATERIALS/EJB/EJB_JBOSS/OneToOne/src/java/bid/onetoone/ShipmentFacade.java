/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package bid.onetoone;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

/**
 *
 * @author SONY
 */
@Stateless
public class ShipmentFacade extends AbstractFacade<Shipment> implements ShipmentFacadeLocal {
    @PersistenceContext(unitName = "OneToOnePU")
    private EntityManager em;

    @Override
    protected EntityManager getEntityManager() {
        return em;
    }

    public ShipmentFacade() {
        super(Shipment.class);
    }
    
}
