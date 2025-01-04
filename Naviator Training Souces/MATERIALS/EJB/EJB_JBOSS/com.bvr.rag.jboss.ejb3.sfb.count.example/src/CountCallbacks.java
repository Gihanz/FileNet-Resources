


import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import javax.ejb.PostActivate;
import javax.ejb.PrePassivate;

/**
 * This class is a lifecycle callback interceptor for the Count bean. 
 * The callback methods simply print a message when invoked by the 
 * container.
 */
public class CountCallbacks {

    public CountCallbacks() {}
    /**
     * Called by the container after construction
     */
    @PostConstruct
    public void construct(javax.interceptor.InvocationContext ctx) throws Exception {       
        System.out.println("cb:construct() ");
        ctx.proceed();
    }
    
    /**
     * Called by the container after activation
     */
    @PostActivate
    public void activate(javax.interceptor.InvocationContext ctx) throws Exception {
        System.out.println("cb:activate()");
        ctx.proceed();
    }
    
    /**
     * Called by the container before passivation
     */
    @PrePassivate
    public void passivate(javax.interceptor.InvocationContext ctx) throws Exception {
        System.out.println("cb:passivate()");
        ctx.proceed();
    }
    
    /**
     * Called by the container before destruction
     */
    @PreDestroy
    public void destroy(javax.interceptor.InvocationContext ctx) throws Exception {
        System.out.println("cb:destroy()");
        ctx.proceed();
    }
    
}
