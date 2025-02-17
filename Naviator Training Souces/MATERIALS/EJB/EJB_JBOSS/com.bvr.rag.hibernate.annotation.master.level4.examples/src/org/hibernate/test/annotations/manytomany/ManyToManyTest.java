//$Id: ManyToManyTest.java 11282 2007-03-14 22:05:59Z epbernard $
package org.hibernate.test.annotations.manytomany;


import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.HashSet;
import java.util.Iterator;
import java.util.Set;

import org.hibernate.Hibernate;
import org.hibernate.JDBCException;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.test.annotations.TestCase;

/**
 * Many to many tests
 *
 * @author Emmanuel Bernard
 */
public class ManyToManyTest extends TestCase {

	public ManyToManyTest(String x) {
		super( x );
	}

	public void testDefault() throws Exception {
		Session s;
		Transaction tx;
		s = openSession();
		tx = s.beginTransaction();
		Store fnac = new Store();
		fnac.setName( "Fnac" );
		KnownClient emmanuel = new KnownClient();
		emmanuel.setName( "Emmanuel" );
		emmanuel.setStores( new HashSet<Store>() );
		fnac.setCustomers( new HashSet<KnownClient>() );
		fnac.getCustomers().add( emmanuel );
		emmanuel.getStores().add( fnac );
		fnac.setImplantedIn( new HashSet<City>() );
		City paris = new City();
		fnac.getImplantedIn().add( paris );
		paris.setName( "Paris" );
		s.persist( fnac );
		tx.commit();
		s.close();

		s = openSession();
		tx = s.beginTransaction();
		Store store;
		KnownClient knownClient;
		City city;
		store = (Store) s.get( Store.class, fnac.getId() );
		assertNotNull( store );
		assertNotNull( store.getCustomers() );
		assertEquals( 1, store.getCustomers().size() );
		knownClient = (KnownClient) store.getCustomers().iterator().next();
		assertEquals( emmanuel.getName(), knownClient.getName() );
		assertNotNull( store.getImplantedIn() );
		assertEquals( 1, store.getImplantedIn().size() );
		city = (City) store.getImplantedIn().iterator().next();
		assertEquals( paris.getName(), city.getName() );
		tx.commit();
		s.close();

		s = openSession();
		tx = s.beginTransaction();
		knownClient = (KnownClient) s.get( KnownClient.class, emmanuel.getId() );
		assertNotNull( knownClient );
		assertNotNull( knownClient.getStores() );
		assertEquals( 1, knownClient.getStores().size() );
		store = (Store) knownClient.getStores().iterator().next();
		assertEquals( fnac.getName(), store.getName() );
		tx.commit();
		s.close();
	}

	public void testDefaultCompositePk() throws Exception {
		Session s;
		Transaction tx;

		s = openSession();
		tx = s.beginTransaction();
		CatPk catPk = new CatPk();
		catPk.setName( "Minou" );
		catPk.setThoroughbred( "Persan" );
		Cat cat = new Cat();
		cat.setId( catPk );
		cat.setAge( 32 );
		Woman woman = new Woman();
		WomanPk womanPk = new WomanPk();
		womanPk.setFirstName( "Emma" );
		womanPk.setLastName( "Peel" );
		woman.setId( womanPk );
		woman.setCats( new HashSet<Cat>() );
		woman.getCats().add( cat );
		cat.setHumanContacts( new HashSet<Woman>() );
		cat.getHumanContacts().add( woman );
		s.persist( woman );
		s.persist( cat );
		tx.commit();
		s.close();

		s = openSession();
		tx = s.beginTransaction();
		Cat sameCat = (Cat) s.get( Cat.class, cat.getId() );
		assertNotNull( sameCat );
		assertNotNull( sameCat.getHumanContacts() );
		assertEquals( 1, sameCat.getHumanContacts().size() );
		Woman sameWoman = sameCat.getHumanContacts().iterator().next();
		assertEquals( sameWoman.getId().getLastName(), woman.getId().getLastName() );
		tx.commit();
		s.close();

		s = openSession();
		tx = s.beginTransaction();
		sameWoman = (Woman) s.get( Woman.class, woman.getId() );
		assertNotNull( sameWoman );
		assertNotNull( sameWoman.getCats() );
		assertEquals( 1, sameWoman.getCats().size() );
		sameCat = sameWoman.getCats().iterator().next();
		assertEquals( cat.getAge(), sameCat.getAge() );
		tx.commit();
		s.close();
	}

	public void testMappedBy() throws Exception {
		Session s;
		Transaction tx;
		s = openSession();
		tx = s.beginTransaction();
		Store fnac = new Store();
		fnac.setName( "Fnac" );
		Supplier emi = new Supplier();
		emi.setName( "Emmanuel" );
		emi.setSuppStores( new HashSet<Store>() );
		fnac.setSuppliers( new HashSet<Supplier>() );
		fnac.getSuppliers().add( emi );
		emi.getSuppStores().add( fnac );
		s.persist( fnac );
		tx.commit();
		s.close();

		s = openSession();
		tx = s.beginTransaction();
		Store store;
		Supplier supplier;
		store = (Store) s.get( Store.class, fnac.getId() );
		assertNotNull( store );
		assertNotNull( store.getSuppliers() );
		assertEquals( 1, store.getSuppliers().size() );
		supplier = (Supplier) store.getSuppliers().iterator().next();
		assertEquals( emi.getName(), supplier.getName() );
		tx.commit();
		s.close();

		s = openSession();
		tx = s.beginTransaction();
		supplier = (Supplier) s.get( Supplier.class, emi.getId() );
		assertNotNull( supplier );
		assertNotNull( supplier.getSuppStores() );
		assertEquals( 1, supplier.getSuppStores().size() );
		store = (Store) supplier.getSuppStores().iterator().next();
		assertEquals( fnac.getName(), store.getName() );
		tx.commit();
		s.close();
	}

	public void testBasic() throws Exception {
		Session s;
		Transaction tx;
		s = openSession();
		tx = s.beginTransaction();
		Employer er = new Employer();
		Employee ee = new Employee();
		s.persist( ee );
		Set erColl = new HashSet();
		Collection eeColl = new ArrayList();
		erColl.add( ee );
		eeColl.add( er );
		er.setEmployees( erColl );
		ee.setEmployers( eeColl );
		//s.persist(ee);
		tx.commit();
		s.close();

		s = openSession();
		tx = s.beginTransaction();
		er = (Employer) s.load( Employer.class, er.getId() );
		assertNotNull( er );
		assertNotNull( er.getEmployees() );
		assertEquals( 1, er.getEmployees().size() );
		Employee eeFromDb = (Employee) er.getEmployees().iterator().next();
		assertEquals( ee.getId(), eeFromDb.getId() );
		tx.commit();
		s.close();

		s = openSession();
		tx = s.beginTransaction();
		ee = (Employee) s.get( Employee.class, ee.getId() );
		assertNotNull( ee );
		assertFalse( "ManyToMany mappedBy lazyness", Hibernate.isInitialized( ee.getEmployers() ) );
		tx.commit();
		assertFalse( "ManyToMany mappedBy lazyness", Hibernate.isInitialized( ee.getEmployers() ) );
		s.close();

		s = openSession();
		tx = s.beginTransaction();
		ee = (Employee) s.get( Employee.class, ee.getId() );
		assertNotNull( ee );
		er = ee.getEmployers().iterator().next();
		assertTrue( "second join non lazy", Hibernate.isInitialized( er ) );
		s.delete( er );
		s.delete( ee );
		tx.commit();
		s.close();
	}

	public void testOrderBy() throws Exception {
		Session s;
		Transaction tx;
		s = openSession();
		tx = s.beginTransaction();
		Employer er = new Employer();
		Employee ee = new Employee();
		ee.setName( "Emmanuel" );
		Employee ee2 = new Employee();
		ee2.setName( "Alice" );
		s.persist( ee );
		s.persist( ee2 );
		Set erColl = new HashSet();
		Collection eeColl = new ArrayList();
		Collection eeColl2 = new ArrayList();
		erColl.add( ee );
		erColl.add( ee2 );
		eeColl.add( er );
		eeColl2.add( er );
		er.setEmployees( erColl );
		ee.setEmployers( eeColl );
		ee2.setEmployers( eeColl2 );
		//s.persist(ee);

		s.flush();
		s.clear();

		er = (Employer) s.get( Employer.class, er.getId() );
		assertNotNull( er );
		assertNotNull( er.getEmployees() );
		assertEquals( 2, er.getEmployees().size() );
		Employee eeFromDb = (Employee) er.getEmployees().iterator().next();
		assertEquals( ee2.getName(), eeFromDb.getName() );
		tx.rollback();
		s.close();

	}

	public void testRemoveInBetween() throws Exception {
		Session s;
		Transaction tx;
		s = openSession();
		tx = s.beginTransaction();
		Employer er = new Employer();
		Employee ee = new Employee();
		Employee ee2 = new Employee();
		s.persist( ee );
		s.persist( ee2 );
		Set erColl = new HashSet();
		Collection eeColl = new ArrayList();
		erColl.add( ee );
		erColl.add( ee2 );
		eeColl.add( er );
		er.setEmployees( erColl );
		ee.setEmployers( eeColl );
		//s.persist(ee);
		tx.commit();
		s.close();

		s = openSession();
		tx = s.beginTransaction();
		er = (Employer) s.load( Employer.class, er.getId() );
		assertNotNull( er );
		assertNotNull( er.getEmployees() );
		assertEquals( 2, er.getEmployees().size() );
		Iterator iterator = er.getEmployees().iterator();
		Employee eeFromDb = (Employee) iterator.next();
		if ( eeFromDb.getId().equals( ee.getId() ) ) {
			eeFromDb = (Employee) iterator.next();
		}
		assertEquals( ee2.getId(), eeFromDb.getId() );
		er.getEmployees().remove( eeFromDb );
		eeFromDb.getEmployers().remove( er );
		tx.commit();
		s.close();

		s = openSession();
		tx = s.beginTransaction();
		ee = (Employee) s.get( Employee.class, ee.getId() );
		assertNotNull( ee );
		assertFalse( "ManyToMany mappedBy lazyness", Hibernate.isInitialized( ee.getEmployers() ) );
		tx.commit();
		assertFalse( "ManyToMany mappedBy lazyness", Hibernate.isInitialized( ee.getEmployers() ) );
		s.close();

		s = openSession();
		tx = s.beginTransaction();
		ee = (Employee) s.get( Employee.class, ee.getId() );
		assertNotNull( ee );
		er = ee.getEmployers().iterator().next();
		assertTrue( "second join non lazy", Hibernate.isInitialized( er ) );
		assertEquals( 1, er.getEmployees().size() );
		s.delete( er );
		s.delete( ee );
		tx.commit();
		s.close();
	}

	public void testSelf() throws Exception {
		Session s;
		Transaction tx;
		s = openSession();
		tx = s.beginTransaction();
		Friend f = new Friend();
		Friend sndF = new Friend();
		f.setName( "Starsky" );
		sndF.setName( "Hutch" );
		Set frnds = new HashSet();
		frnds.add( sndF );
		f.setFriends( frnds );
		//Starsky is a friend of Hutch but hutch is not
		s.persist( f );
		tx.commit();
		s.close();

		s = openSession();
		tx = s.beginTransaction();
		f = (Friend) s.load( Friend.class, f.getId() );
		assertNotNull( f );
		assertNotNull( f.getFriends() );
		assertEquals( 1, f.getFriends().size() );
		Friend fromDb2ndFrnd = (Friend) f.getFriends().iterator().next();
		assertEquals( fromDb2ndFrnd.getId(), sndF.getId() );
		assertEquals( 0, fromDb2ndFrnd.getFriends().size() );
		tx.commit();
		s.close();
	}

	public void testCompositePk() throws Exception {
		Session s;
		Transaction tx;

		ManPk m1pk = new ManPk();
		m1pk.setElder( true );
		m1pk.setFirstName( "Lucky" );
		m1pk.setLastName( "Luke" );
		ManPk m2pk = new ManPk();
		m2pk.setElder( false );
		m2pk.setFirstName( "Joe" );
		m2pk.setLastName( "Dalton" );

		Man m1 = new Man();
		m1.setId( m1pk );
		m1.setCarName( "Jolly Jumper" );
		Man m2 = new Man();
		m2.setId( m2pk );

		WomanPk w1pk = new WomanPk();
		w1pk.setFirstName( "Ma" );
		w1pk.setLastName( "Dalton" );
		WomanPk w2pk = new WomanPk();
		w2pk.setFirstName( "Carla" );
		w2pk.setLastName( "Bruni" );

		Woman w1 = new Woman();
		w1.setId( w1pk );
		Woman w2 = new Woman();
		w2.setId( w2pk );

		Set<Woman> womens = new HashSet<Woman>();
		womens.add( w1 );
		m1.setWomens( womens );
		Set<Woman> womens2 = new HashSet<Woman>();
		womens2.add( w1 );
		womens2.add( w2 );
		m2.setWomens( womens2 );

		Set<Man> mens = new HashSet<Man>();
		mens.add( m1 );
		mens.add( m2 );
		w1.setMens( mens );
		Set<Man> mens2 = new HashSet<Man>();
		mens2.add( m2 );
		w2.setMens( mens2 );

		s = openSession();
		tx = s.beginTransaction();
		s.persist( m1 );
		s.persist( m2 );
		tx.commit();
		s.close();

		s = openSession();
		tx = s.beginTransaction();
		m1 = (Man) s.load( Man.class, m1pk );
		assertFalse( m1.getWomens().isEmpty() );
		assertEquals( 1, m1.getWomens().size() );
		w1 = (Woman) s.load( Woman.class, w1pk );
		assertFalse( w1.getMens().isEmpty() );
		assertEquals( 2, w1.getMens().size() );

		tx.commit();
		s.close();
	}

	public void testAssociationTableUniqueConstraints() throws Exception {
		Session s = openSession();
		Permission readAccess = new Permission();
		readAccess.setPermission( "read" );
		readAccess.setExpirationDate( new Date() );
		Collection<Permission> coll = new ArrayList<Permission>( 2 );
		coll.add( readAccess );
		coll.add( readAccess );
		Group group = new Group();
		group.setId( new Integer( 1 ) );
		group.setPermissions( coll );
		s.getTransaction().begin();
		try {
			s.persist( group );
			s.getTransaction().commit();
			fail( "Unique constraints not applied on association table" );
		}
		catch (JDBCException e) {
			//success
			s.getTransaction().rollback();
		}
		finally {
			s.close();
		}
	}

	public void testAssociationTableAndOrderBy() throws Exception {
		Session s = openSession();
		s.enableFilter( "Groupfilter" );
		Permission readAccess = new Permission();
		readAccess.setPermission( "read" );
		readAccess.setExpirationDate( new Date() );
		Permission writeAccess = new Permission();
		writeAccess.setPermission( "write" );
		writeAccess.setExpirationDate( new Date( new Date().getTime() - 10*60*1000 ) );
		Collection<Permission> coll = new ArrayList<Permission>( 2 );
		coll.add( readAccess );
		coll.add( writeAccess );
		Group group = new Group();
		group.setId( new Integer( 1 ) );
		group.setPermissions( coll );
		s.getTransaction().begin();
		s.persist( group );
		s.flush();
		s.clear();
		group = (Group) s.get( Group.class, group.getId() );
		s.createQuery( "select g from Group g join fetch g.permissions").list();
		assertEquals( "write", group.getPermissions().iterator().next().getPermission() );
		s.getTransaction().rollback();
		s.close();
	}

	public void testAssociationTableAndOrderByWithSet() throws Exception {
		Session s = openSession();
		s.enableFilter( "Groupfilter" );

		Permission readAccess = new Permission();
		readAccess.setPermission( "read" );
		readAccess.setExpirationDate( new Date() );
		
		Permission writeAccess = new Permission();
		writeAccess.setPermission( "write" );
		writeAccess.setExpirationDate( new Date( new Date().getTime() - 10*60*1000 ) );
		
		Permission executeAccess = new Permission();
		executeAccess.setPermission( "execute" );
		executeAccess.setExpirationDate( new Date( new Date().getTime() - 5*60*1000 ) );
		
		Set<Permission> coll = new HashSet<Permission>( 3 );
		coll.add( readAccess );
		coll.add( writeAccess );
		coll.add( executeAccess );

		GroupWithSet group = new GroupWithSet();
		group.setId( new Integer( 1 ) );
		group.setPermissions( coll );
		s.getTransaction().begin();
		s.persist( group );
		s.flush();
		s.clear();

		group = (GroupWithSet) s.get( GroupWithSet.class, group.getId() );
		s.createQuery( "select g from Group g join fetch g.permissions").list();
		Iterator<Permission> permIter = group.getPermissions().iterator();
		assertEquals( "write", permIter.next().getPermission() );
		assertEquals( "execute", permIter.next().getPermission() );
		assertEquals( "read", permIter.next().getPermission() );
		s.getTransaction().rollback();
		s.close();
	}
	
	public void testJoinedSubclassManyToMany() throws Exception {
		Session s = openSession();
		Zone a = new Zone();
		InspectorPrefixes ip = new InspectorPrefixes( "dgi" );
		Transaction tx = s.beginTransaction();
		s.save( a );
		s.save( ip );
		ip.getAreas().add( a );
		tx.commit();
		s.close();
		s = openSession();
		tx = s.beginTransaction();
		ip = (InspectorPrefixes) s.get( InspectorPrefixes.class, ip.getId() );
		assertNotNull( ip );
		assertEquals( 1, ip.getAreas().size() );
		assertEquals( a.getId(), ip.getAreas().get( 0 ).getId() );
		s.delete( ip );
		s.delete( ip.getAreas().get( 0 ) );
		tx.commit();
		s.close();
	}

	public void testJoinedSubclassManyToManyWithNonPkReference() throws Exception {
		Session s = openSession();
		Zone a = new Zone();
		InspectorPrefixes ip = new InspectorPrefixes( "dgi" );
		ip.setName( "Inspector" );
		Transaction tx = s.beginTransaction();
		s.save( a );
		s.save( ip );
		ip.getDesertedAreas().add( a );
		tx.commit();
		s.close();
		s = openSession();
		tx = s.beginTransaction();
		ip = (InspectorPrefixes) s.get( InspectorPrefixes.class, ip.getId() );
		assertNotNull( ip );
		assertEquals( 1, ip.getDesertedAreas().size() );
		assertEquals( a.getId(), ip.getDesertedAreas().get( 0 ).getId() );
		s.delete( ip );
		s.delete( ip.getDesertedAreas().get( 0 ) );
		tx.commit();
		s.close();
	}

	public void testReferencedColumnNameToSuperclass() throws Exception {
		Session s = openSession();
		Transaction tx = s.beginTransaction();
		BuildingCompany comp = new BuildingCompany();
		comp.setFoundedIn( new Date() );
		comp.setName( "Builder century corp.");
		s.persist( comp );
		Building building = new Building();
		building.setCompany( comp );
		s.persist( building );
		s.flush();
		s.clear();
		building = (Building) s.get( Building.class, building.getId() );
		assertEquals( comp.getName(), building.getCompany().getName() );
		tx.rollback();
		s.close();
	}

	/**
	 * @see org.hibernate.test.annotations.TestCase#getMappings()
	 */
	protected Class[] getMappings() {
		return new Class[]{
				Friend.class,
				Employer.class,
				Employee.class,
				Man.class,
				Woman.class,
				Store.class,
				KnownClient.class,
				Supplier.class,
				City.class,
				Cat.class,
				Group.class,
				GroupWithSet.class,
				Permission.class,
				Zone.class,
				Inspector.class,
				InspectorPrefixes.class,
				BuildingCompany.class,
				Building.class

		};
	}

}