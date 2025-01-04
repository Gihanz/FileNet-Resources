package examples.entity.single_table.interfaces;

import java.util.List;

import javax.ejb.Remote;

@Remote
public interface RoadVehicleStateless {
	public void doSomeStuff();
	
	public List getAllRoadVehicles();
	
	public void deleteAll(String type);
	
	public void updateAll(String type);
}
