/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package tableperinheritance.bean;

import javax.persistence.Entity;

/**
 *
 * @author SONY
 */
@Entity
public class Dog extends Pet{
    private int numBones;

    public int getNumBones() {
        return numBones;
    }

    public void setNumBones(int numBones) {
        this.numBones = numBones;
    }
    
    
}
