
package org.jboss.tutorial.composite.bean;

import javax.persistence.Embeddable;
import javax.persistence.Embeddable;


@Embeddable
public class CustomerPK implements java.io.Serializable
{
   private long id;
   private String name;


   public CustomerPK()
   {
   }

   public CustomerPK(long id, String name)
   {
      this.id = id;
      this.name = name;
   }

   public long getId()
   {
      return id;
   }

   public void setId(long id)
   {
      this.id = id;
   }

   public String getName()
   {
      return name;
   }

   public void setName(String name)
   {
      this.name = name;
   }

   public int hashCode()
   {
      return (int) id + name.hashCode();
   }

   public boolean equals(Object obj)
   {
      if (obj == this) return true;
      if (!(obj instanceof CustomerPK)) return false;
      if (obj == null) return false;
      CustomerPK pk = (CustomerPK) obj;
      return pk.id == id && pk.name.equals(name);
   }
}
