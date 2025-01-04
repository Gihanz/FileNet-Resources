/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package com.examples;

import java.util.List;
import javax.ejb.Local;

/**
 *
 * @author SONY
 */
@Local
public interface LineItemFacadeLocal {

    void create(LineItem lineItem);

    void edit(LineItem lineItem);

    void remove(LineItem lineItem);

    public void doSomeStuff();
    
    LineItem find(Object id);

    List<LineItem> findAll();

    List<LineItem> findRange(int[] range);

    
    int count();
    
}
