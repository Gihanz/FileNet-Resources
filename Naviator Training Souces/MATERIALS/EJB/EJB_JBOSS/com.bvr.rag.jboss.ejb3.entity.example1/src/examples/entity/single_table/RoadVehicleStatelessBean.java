package examples.entity.single_table;

import java.util.List;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

import examples.entity.single_table.Coupe.BoringFactor;
import examples.entity.single_table.Roadster.CoolFactor;
import examples.entity.single_table.interfaces.RoadVehicleStateless;

@Stateless
public class RoadVehicleStatelessBean implements RoadVehicleStateless {
	@PersistenceContext(unitName="pu1")
	EntityManager em;
	
	public void doSomeStuff() {
		Coupe c = new Coupe();
		c.setMake("Bob");
		c.setModel("E400");
		c.setBoringFactor(BoringFactor.BORING);
		em.persist(c);
		
		Roadster r = new Roadster();
		r.setMake("Mini");
		r.setModel("Cooper S");
		r.setCoolFactor(CoolFactor.COOLEST);
		em.persist(r);
		
		Motorcycle m = new Motorcycle();
		em.persist(m);
	}

	public List getAllRoadVehicles() {
		Query q = em.createQuery("SELECT r FROM RoadVehicleSingle r");
		return q.getResultList();
	}
	
	public void deleteAll(String type) {
		Query q = em.createQuery("DELETE FROM "+type);
		q.executeUpdate();
	}
	
	public void updateAll(String type) {
		Query q = em.createQuery("UPDATE "+type+" r SET r.numPassengers = 1");
		q.executeUpdate();
	}
}
