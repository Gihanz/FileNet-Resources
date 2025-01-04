/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package com.examples;

import javax.ejb.Stateless;
import javax.jws.WebService;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

/**
 *
 * @author SONY
 */
@Stateless
@WebService(endpointInterface="com.examples.LineItemIntf")
public class LineItemFacade extends AbstractFacade<LineItem> implements LineItemIntf, LineItemFacadeLocal {
    @PersistenceContext(unitName = "FirstExamplePU")
    private EntityManager em;

    @Override
    protected EntityManager getEntityManager() {
        return em;
    }

    public LineItemFacade() {
        super(LineItem.class);
    }
    
    public void doSomeStuff()
    {
        LineItem l = new LineItem();
        l.setProduct("books");
        l.setQuantity(10);
        l.setSubTotal(3000.00);
        
        em.persist(l);
        
    }
    
}
