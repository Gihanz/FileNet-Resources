

import java.lang.reflect.Method;

import javax.interceptor.AroundInvoke;
import javax.interceptor.InvocationContext;

public class ArgumentsChecker {

    @AroundInvoke
    public Object checkArgument(InvocationContext ctx) throws Exception {
        Method method = ctx.getMethod();
        if (method.getName().equals("initUpperCase")) {
            String param = (String) (ctx.getParameters()[0]);
            // Note that param cannot be null because
            // it has been validated by the previous interceptor
            char c = param.charAt(0);
            if (!Character.isLetter(c)) {
                // An interceptor can throw any runtime exception or
                // application exceptions that are allowed in the
                // throws clause of the business method
                throw new BadArgumentException("Illegal argument: " + param);
            }
        }

        // Proceed to call the business method
        return ctx.proceed();
    }

}
