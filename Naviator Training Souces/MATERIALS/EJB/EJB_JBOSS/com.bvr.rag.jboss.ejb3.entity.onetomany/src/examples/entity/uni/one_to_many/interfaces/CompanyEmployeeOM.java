package examples.entity.uni.one_to_many.interfaces;

import java.util.List;

import javax.ejb.Remote;

@Remote
public interface CompanyEmployeeOM {
	public void doSomeStuff();
	
	public List getCompanies();
	
	public List getCompanies2(String query);
	
	public void deleteCompanies();
}
