package org.jboss.tutorial.webservice.bean;

import javax.jws.WebService;
import javax.jws.WebMethod;
import java.rmi.Remote;
import java.rmi.RemoteException;
import javax.jws.soap.SOAPBinding;
import javax.jws.soap.SOAPBinding.Style;

@WebService
@SOAPBinding(style=Style.RPC)
public interface Calculator extends Remote
{
   @WebMethod int add(int x, int y);

   @WebMethod int subtract(int x, int y);
}
