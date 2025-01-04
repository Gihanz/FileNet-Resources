/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package bid.onetoone;

import javax.ejb.Stateless;
import javax.jws.WebService;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

/**
 *
 * @author SONY
 */
@Stateless
@WebService(endpointInterface="bid.onetoone.OrderFacadeIntf")
public class OrderFacade extends AbstractFacade<Order> implements OrderFacadeLocal, OrderFacadeIntf {
    @PersistenceContext(unitName = "OneToOnePU")
    private EntityManager em;

    @Override
    protected EntityManager getEntityManager() {
        return em;
    }

    public OrderFacade() {
        super(Order.class);
    }
    
    public void doSomeStuff()
    {
        Shipment s= new Shipment();
        s.setCity("Bangalore");
        s.setZipCode("560036");
        
        Order o = new Order();
        o.setOrderName("JPA Course");
        o.setShipment(s);
        
        s.setOrder(o);
        
        em.persist(o);
        
        
        
    }
}
