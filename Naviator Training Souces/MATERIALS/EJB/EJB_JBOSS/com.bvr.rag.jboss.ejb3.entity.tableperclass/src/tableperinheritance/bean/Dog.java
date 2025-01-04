package tableperinheritance.bean;

import javax.persistence.Entity;

@Entity
public class Dog extends Pet
{
   private int numBones=30;

   public int getNumBones()
   {
      return numBones;
   }

   public void setNumBones(int numBones)
   {
      this.numBones = numBones;
   }
}
