
package org.jboss.tutorial.composite.bean;




public interface EntityTest
{
   Flight findFlightById(Long id) throws Exception;

   void manyToManyCreate() throws Exception;
}
