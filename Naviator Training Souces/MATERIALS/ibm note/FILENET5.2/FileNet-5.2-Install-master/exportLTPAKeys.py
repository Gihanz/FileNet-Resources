import java.lang.String as jstr
import java.util.Properties as jprops
import java.io as jio
import javax.management as jmgmt

ltpaKeyFile=sys.argv[0]
password=jstr(sys.argv[1]).getBytes()

security=AdminControl.queryNames('*:*,name=SecurityAdmin')

securityON=jmgmt.ObjectName(security)

params=[password]
signature=['[B']

ltpaKeys=AdminControl.invoke_jmx(securityON,'exportLTPAKeys', params, signature)

fout=jio.FileOutputStream(ltpaKeyFile)

ltpaKeys.store(fout,'')
fout.close()