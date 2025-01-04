/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package bid.onetoone;

import java.util.List;
import javax.ejb.Local;

/**
 *
 * @author SONY
 */
@Local
public interface OrderFacadeLocal {

    void create(Order order);

    void edit(Order order);

    void remove(Order order);

    Order find(Object id);

    List<Order> findAll();

    List<Order> findRange(int[] range);

    int count();
    
}
