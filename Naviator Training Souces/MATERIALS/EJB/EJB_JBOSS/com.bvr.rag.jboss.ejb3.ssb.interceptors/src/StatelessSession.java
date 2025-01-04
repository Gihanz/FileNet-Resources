

import javax.ejb.Remote;

@Remote
public interface StatelessSession {

    public String initUpperCase(String val)
        throws BadArgumentException;

}
