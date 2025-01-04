//$Id: CompositeIdTest.java 11282 2007-03-14 22:05:59Z epbernard $
package org.hibernate.test.annotations.cid;

import java.util.Date;
import java.util.List;

import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.test.annotations.TestCase;
import org.hibernate.test.annotations.cid.OrderLine;
import org.hibernate.test.annotations.cid.Order;
import org.hibernate.test.annotations.cid.Product;
import org.hibernate.test.annotations.cid.OrderLinePk;

/**
 * test some composite id functionalities
 *
 * @author Emmanuel Bernard
 */
public class CompositeIdTest extends TestCase {
	public CompositeIdTest(String x) {
		super( x );
	}

	/**
	 * This feature is not supported by the EJB3
	 * this is an hibernate extension
	 */
	public void testManyToOneInCompositePk() throws Exception {
		Session s;
		Transaction tx;
		s = openSession();
		tx = s.beginTransaction();
		ParentPk ppk = new ParentPk();
		ppk.setFirstName( "Emmanuel" );
		ppk.setLastName( "Bernard" );
		Parent p = new Parent();
		p.id = ppk;
		s.persist( p );
		ChildPk cpk = new ChildPk();
		cpk.parent = p;
		cpk.nthChild = 1;
		Child c = new Child();
		c.id = cpk;
		s.persist( c );
		tx.commit();
		s.close();

		s = openSession();
		tx = s.beginTransaction();
		Query q = s.createQuery( "select c from Child c where c.id.nthChild = :nth" );
		q.setInteger( "nth", 1 );
		List results = q.list();
		assertEquals( 1, results.size() );
		c = (Child) results.get( 0 );
		assertNotNull( c );
		assertNotNull( c.id.parent );
		//FIXME mke it work in unambigious cases
//		assertNotNull(c.id.parent.id);
//		assertEquals(p.id.getFirstName(), c.id.parent.id.getFirstName());
		tx.commit();
		s.close();
	}

	public void testManyToOneInCompositeId() throws Exception {
		Session s = openSession();
		Transaction tx = s.beginTransaction();
		Channel channel = new Channel();
		s.persist( channel );
		Presenter pres = new Presenter();
		pres.name = "Casimir";
		s.persist( pres );
		TvMagazinPk pk = new TvMagazinPk();
		TvMagazin mag = new TvMagazin();
		mag.time = new Date();
		mag.id = pk;
		//pk.name = "Trax";
		pk.channel = channel;
		pk.presenter = pres;
		s.persist( mag );
		tx.commit();
		s.clear();
		tx = s.beginTransaction();
		mag = (TvMagazin) s.createQuery( "from TvMagazin mag" ) // where mag.id.name = :name")
				//.setParameter( "name", "Trax" )
				.uniqueResult();
		assertNotNull( mag.id );
		assertNotNull( mag.id.channel );
		assertEquals( channel.id, mag.id.channel.id );
		assertNotNull( mag.id.presenter );
		assertEquals( pres.name, mag.id.presenter.name );
		s.delete( mag );
		s.delete( mag.id.channel );
		s.delete( mag.id.presenter );
		tx.commit();
		s.close();
	}

	public void testManyToOneInCompositeIdClass() throws Exception {
		Session s = openSession();
		Transaction tx = s.beginTransaction();
		Order order = new Order();
		s.persist( order );
		Product product = new Product();
		product.name = "small car";
		s.persist( product );
		OrderLinePk pk = new OrderLinePk();
		OrderLine orderLine = new OrderLine();
		orderLine.order = order;
		orderLine.product = product;
		s.persist(orderLine);
		s.flush();
		s.clear();

		orderLine = (OrderLine) s.createQuery( "select ol from OrderLine ol" ).uniqueResult();
		assertNotNull( orderLine.order );
		assertEquals( order.id, orderLine.order.id );
		assertNotNull( orderLine.product );
		assertEquals( product.name, orderLine.product.name );
		
		tx.rollback();
		s.close();
	}

	protected Class[] getMappings() {
		return new Class[]{
				Parent.class,
				Child.class,
				Channel.class,
				TvMagazin.class,
				Presenter.class,
                Order.class,
                Product.class,
                OrderLine.class,
                OrderLinePk.class
        };
	}
}
