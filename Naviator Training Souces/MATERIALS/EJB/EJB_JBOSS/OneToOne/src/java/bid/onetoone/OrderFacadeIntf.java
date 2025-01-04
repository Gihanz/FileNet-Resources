/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package bid.onetoone;

import javax.jws.WebMethod;
import javax.jws.WebService;
import javax.jws.soap.SOAPBinding;

/**
 *
 * @author SONY
 */@WebService
@SOAPBinding(style=SOAPBinding.Style.RPC)
public interface OrderFacadeIntf {
    @WebMethod void doSomeStuff();
}
