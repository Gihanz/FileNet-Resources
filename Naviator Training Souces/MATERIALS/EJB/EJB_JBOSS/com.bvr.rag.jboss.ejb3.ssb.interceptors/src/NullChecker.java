

import java.lang.reflect.Method;

import javax.interceptor.AroundInvoke;
import javax.interceptor.InvocationContext;

public class NullChecker {

    @AroundInvoke
    public Object checkIfNull(InvocationContext ctx)
        throws Exception {
        Method method = ctx.getMethod();
        if (method.getName().equals("initUpperCase")) {
            String param = (String) (ctx.getParameters()[0]);
            if (param == null) {
                // An interceptor can throw any runtime exception or
                // application exceptions that are allowed in the
                // throws clause of the business method
                throw new BadArgumentException("Illegal argument: null");
            }
        }

        // Proceed to the next interceptor
        return ctx.proceed();
    }

}
