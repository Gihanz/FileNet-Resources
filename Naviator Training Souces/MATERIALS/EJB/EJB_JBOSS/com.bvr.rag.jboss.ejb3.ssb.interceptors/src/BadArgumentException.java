

public class BadArgumentException
    extends Exception {

    BadArgumentException() {
        super();
    }

    BadArgumentException(String str) {
        super(str);
    }

    BadArgumentException(String msg, Throwable th) {
        super(msg, th);
    }
}
