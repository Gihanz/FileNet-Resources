/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package com.examples;

import javax.jws.WebMethod;
import javax.jws.WebService;
import javax.jws.soap.SOAPBinding;
import javax.jws.soap.SOAPBinding.Style;

/**
 *
 * @author SONY
 */
@WebService
@SOAPBinding(style=Style.RPC)
public interface LineItemIntf {
    
    @WebMethod void doSomeStuff();
    
}
