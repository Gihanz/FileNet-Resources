package examples.entity.uni.one_to_many.client;

import java.util.Properties;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;

import examples.entity.uni.one_to_many.Company;
import examples.entity.uni.one_to_many.Employee;
import examples.entity.uni.one_to_many.interfaces.CompanyEmployeeOM;


public class CompanyEmployeeClient {
	public static void main(String[] args) {
		try {
			Context ic = getInitialContext();
			CompanyEmployeeOM ceom = (CompanyEmployeeOM)ic.lookup("CompanyEmployeeOMUniBean/remote");
			
			ceom.deleteCompanies();
			
			ceom.doSomeStuff();
			
			System.out.println("All Companies:");
			for (Object o : ceom.getCompanies()) {
				Company c = (Company)o;
				System.out.println("Here are the employees for company: "+c.getName());
				for (Employee e : c.getEmployees()) {
					System.out.println("\tName: "+e.getName()+", Sex: "+e.getSex());
				}
				System.out.println();
			}
		} 
		catch (NamingException e) {
			e.printStackTrace();
		}
	}
	public static Context getInitialContext() 
	   throws javax.naming.NamingException {

	   Properties p = new Properties();
		p.put(Context.INITIAL_CONTEXT_FACTORY, "org.jnp.interfaces.NamingContextFactory");  
		p.put(Context.PROVIDER_URL, "jnp://localhost:1099");
	   return new javax.naming.InitialContext(p);
	}
}