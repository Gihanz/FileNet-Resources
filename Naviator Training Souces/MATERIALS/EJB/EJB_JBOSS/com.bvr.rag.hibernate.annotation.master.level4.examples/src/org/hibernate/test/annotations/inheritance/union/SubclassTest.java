//$Id: SubclassTest.java 11282 2007-03-14 22:05:59Z epbernard $
package org.hibernate.test.annotations.inheritance.union;

import java.util.List;

import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.test.annotations.TestCase;

/**
 * @author Emmanuel Bernard
 */
public class SubclassTest extends TestCase {

	public SubclassTest(String x) {
		super( x );
	}

	public void testDefault() throws Exception {
		Session s;
		Transaction tx;
		s = openSession();
		tx = s.beginTransaction();
		File doc = new Document( "Enron Stuff To Shred", 1000 );
		Folder folder = new Folder( "Enron" );
		s.persist( doc );
		s.persist( folder );
		tx.commit();
		s.close();

		s = openSession();
		tx = s.beginTransaction();
		List result = s.createCriteria( File.class ).list();
		assertNotNull( result );
		assertEquals( 2, result.size() );
		File f2 = (File) result.get( 0 );
		checkClassType( f2, doc, folder );
		f2 = (File) result.get( 1 );
		checkClassType( f2, doc, folder );
		tx.commit();
		s.close();
	}

	private void checkClassType(File fruitToTest, File f, Folder a) {
		if ( fruitToTest.getName().equals( f.getName() ) ) {
			assertFalse( fruitToTest instanceof Folder );
		}
		else if ( fruitToTest.getName().equals( a.getName() ) ) {
			assertTrue( fruitToTest instanceof Folder );
		}
		else {
			fail( "Result does not contains the previously inserted elements" );
		}
	}

	/**
	 * @see org.hibernate.test.annotations.TestCase#getMappings()
	 */
	protected Class[] getMappings() {
		return new Class[]{
				File.class,
				Folder.class,
				Document.class,
				SymbolicLink.class
		};
	}

}
