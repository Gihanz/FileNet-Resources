package tableperinheritance.bean;

import javax.persistence.Entity;

@Entity
public class Cat extends Pet
{
   int lives=10;

   public int getLives()
   {
      return lives;
   }

   public void setLives(int lives)
   {
      this.lives = lives;
   }
}
