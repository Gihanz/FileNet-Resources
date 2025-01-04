

import javax.ejb.Stateless;
import javax.interceptor.Interceptors;

// This bean uses two interceptors to validate
// the input to its (only) business method.
// Note that a single interceptor would suffice
// but to demonstrate the use of interceptor
// chaining, we use two interceptors

@Stateless
@Interceptors( { NullChecker.class, ArgumentsChecker.class })
public class StatelessSessionBean
    implements StatelessSession {

    // This business method is called after
    // the above two interceptor's @AroundInvoke
    // methods are invoked. Hence it is guaranteed
    // that the argument to this method is not null
    // and it starts with a letter
    public String initUpperCase(String val) {
        String first = val.substring(0, 1);
        return first.toUpperCase() + val.substring(1);
    }

}
