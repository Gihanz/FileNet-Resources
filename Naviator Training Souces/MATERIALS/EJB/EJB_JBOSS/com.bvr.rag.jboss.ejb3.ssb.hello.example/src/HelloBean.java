


import javax.ejb.Remote;
import javax.ejb.Stateless;

@Remote(Hello.class)
public @Stateless class HelloBean implements Hello {
	public String hello()
	{
		return "ragavendra";
		
	}
}
