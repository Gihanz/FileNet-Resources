<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%@page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<html>
<head>
<title>login</title>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<meta name="GENERATOR" content="Rational Application Developer">
</head>
<body>

<form action="j_security_check" method="post">
<table border="0">
	<tbody>
		<tr>
			<th>Enter userid:</th>
			<td><input type="text" name="j_username" size="20"></td>
		</tr>
		<tr>
			<th>Enter password:</th>
			<td><input type="password" name="j_password" size="20"></td>
		</tr>
		<tr>
			<td colspan="2" align="center"><input type="submit" name="Submit" value="Log In"></td></tr>
	</tbody>
</table></form>
</body>
</html>
