

import javax.ejb.Remote;
import javax.ejb.Remove;
import javax.ejb.Stateful;
import javax.interceptor.Interceptors;

/**
 * A Stateful Session Bean Class that shows the basics of 
 * how to write a stateful session bean.
 * 
 * This Bean is initialized to some integer value. It has a 
 * business method which increments the value.
 *
 * The annotations below declare that:
 * <ul>
 * <li>this is a Stateful Session Bean
 * <li>the bean's remote business interface is <code>Count</code>
 * <li>any lifecycle callbacks go to the class <code>CountCallbacks</code>
 * </ul>
 */

@Stateful
@Remote(Count.class)
@Interceptors(CountCallbacks.class)
public class CountBean implements Count {

    /** The current counter is our conversational state. */
    private int val;

    /**
     * The count() business method.
     */
    public int count() {
        System.out.println("count()");
        return ++val;
    }

    /**
     * The set() business method.
     */
    public void set(int val) {
        this.val = val;
        System.out.println("set()");
    }

    /**
     * The remove method is annotated so that the container knows
     * it can remove the bean after this method returns.
     */
    @Remove
    public void remove() {
        System.out.println("remove()");
    }

}
