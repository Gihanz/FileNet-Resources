

/**
 * The business interface - a plain Java interface with only business methods.
 */
public interface Count {
    
    /**
     * Increments the counter by 1
     */
    public int count();
    
    /**
     * Sets the counter to val
     * 
     * @param val
     */
    public void set(int val);
    
    /**
     * removes the counter
     */
    public void remove();
}
