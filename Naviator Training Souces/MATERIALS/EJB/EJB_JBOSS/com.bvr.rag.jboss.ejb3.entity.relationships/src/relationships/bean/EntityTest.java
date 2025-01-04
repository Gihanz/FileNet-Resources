package relationships.bean;


public interface EntityTest
{
   Flight findFlightById(Long id) throws Exception;

   void manyToManyCreate() throws Exception;
}
