package com.mit.edsservides;

import com.ibm.json.java.JSONArray;
import com.ibm.json.java.JSONObject;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintStream;
import java.io.PrintWriter;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.Date;
import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class UpdateObjectTypeServlet
extends HttpServlet
{
private static final long serialVersionUID = 1L;
private final String edsTable = "EDS_OBJECT";
private final String edsChoicesTable = "EDS_CHOICES";

public void init(ServletConfig config)
throws ServletException
{}

protected void doPost(HttpServletRequest request, HttpServletResponse response)
throws ServletException, IOException
{
String objectType = request.getPathInfo().substring(1);
InputStream requestInputStream = request.getInputStream();
JSONObject jsonRequest = JSONObject.parse(requestInputStream);
String requestMode = jsonRequest.get("requestMode").toString();
JSONArray requestProperties = (JSONArray)jsonRequest.get("properties");
JSONArray responseProperties = new JSONArray();

JSONArray propertyData = getPropertyData(objectType, request.getLocale());

JSONObject clientContext =
(JSONObject)jsonRequest.get("clientContext");
String userid = (String)clientContext.get("userid");
String locale = (String)clientContext.get("locale");
String desktop = (String)clientContext.get("desktop");

System.out.println("sampleEDService.UpdateObjectTypeServlet: objectType=" + objectType + "\n requestMode=" + requestMode + "\n userid=" + userid + "\n desktop=" + desktop + "\n locale=" + locale);
if (requestMode.equals("initialNewObject")) {
for (int i = 0; i < propertyData.size(); i++)
{
JSONObject overrideProperty = (JSONObject)propertyData.get(i);
String overridePropertyName = overrideProperty.get("symbolicName").toString();
if (overrideProperty.containsKey("initialValue")) {
for (int j = 0; j < requestProperties.size(); j++)
{
JSONObject requestProperty = (JSONObject)requestProperties.get(j);
String requestPropertyName = requestProperty.get("symbolicName").toString();
if (overridePropertyName.equals(requestPropertyName))
{
Object initialValue = overrideProperty.get("initialValue");
requestProperty.put("value", initialValue);
}
}
}
}
}
for (int i = 0; i < propertyData.size(); i++)
{
JSONObject overrideProperty = (JSONObject)propertyData.get(i);
String overridePropertyName = overrideProperty.get("symbolicName").toString();
if ((requestMode.equals("initialNewObject")) || (requestMode.equals("initialExistingObject")) || (requestMode.equals("inProgressChanges")))
{
if (requestMode.equals("inProgressChanges")) {
if (overridePropertyName.equals("CaseID"))
{
System.out.println(requestMode.toString());
String value = null;
for (int a = 0; a < requestProperties.size(); a++)
{
JSONObject requestPropertyHidden = (JSONObject)requestProperties.get(a);
String requestPropertyName = requestPropertyHidden.get("symbolicName").toString();
if (requestPropertyName.equalsIgnoreCase("TransactionAccountForCF"))
{
value = requestPropertyHidden.get("value").toString();
System.out.println("test 2 for prop Name " + requestPropertyName + "\n TransactionAccountForCF " + value);
}
if (requestPropertyName.equals("CaseID"))
{
System.out.println("OBEREE " + overrideProperty.toString());
System.out.println("Request Prop Name :: " + requestPropertyName + " Value of status " + value);
if (value != null) {
if (value.equals("Yes"))
{
System.out.println(" Setting hidden false :: " + value);
overrideProperty.put("hidden", Boolean.valueOf(false));
}
else
{
overrideProperty.put("hidden", Boolean.valueOf(true));
}
}
System.out.println("Final Properties for Hiden are " + requestPropertyHidden);
}
}
}
}
if (overrideProperty.containsKey("dependentOn"))
{
if (requestMode.equals("inProgressChanges"))
{
String dependentOn = overrideProperty.get("dependentOn").toString();
String dependentValue = overrideProperty.get("dependentValue").toString();
for (int j = 0; j < requestProperties.size(); j++)
{
JSONObject requestProperty = (JSONObject)requestProperties.get(j);
String requestPropertyName = requestProperty.get("symbolicName").toString();
Object value = requestProperty.get("value");
if ((requestPropertyName.equals(dependentOn)) && (dependentValue.equals(value))) {
responseProperties.add(overrideProperty);
}
System.out.println(" 1: dep On " + dependentOn + " 2 :dep Vlaue " + dependentValue + " 3: value " + value);
}
}
}
else
{
if (!overrideProperty.containsKey("value")) {
for (int j = 0; j < requestProperties.size(); j++)
{
JSONObject requestProperty = (JSONObject)requestProperties.get(j);
String requestPropertyName = requestProperty.get("symbolicName").toString();
if (requestPropertyName.equals(overridePropertyName))
{
Object value = requestProperty.get("value");
overrideProperty.put("value", value);
}
}
}
responseProperties.add(overrideProperty);
}
}
if ((requestMode.equals("finalNewObject")) || (requestMode.equals("finalExistingObject"))) {
if (overrideProperty.containsKey("validateAs"))
{
String validationType = overrideProperty.get("validateAs").toString();
if (validationType.equals("NoThrees"))
{
String symbolicName = overrideProperty.get("symbolicName").toString();
for (int j = 0; j < requestProperties.size(); j++)
{
JSONObject requestProperty = (JSONObject)requestProperties.get(j);
String requestPropertySymbolicName = requestProperty.get("symbolicName").toString();
if (requestPropertySymbolicName.contains("[")) {
requestPropertySymbolicName = requestPropertySymbolicName.substring(0, requestPropertySymbolicName.indexOf("["));
}
if (symbolicName.equals(requestPropertySymbolicName))
{
String requestValue = requestProperty.get(
"value").toString();
String error = null;
if ((requestValue.contains("3")) || (requestValue.toLowerCase().contains("three")) || (requestValue.toLowerCase().contains("third"))) {
error = "This field cannot contain any threes";
}
if (error != null)
{
JSONObject returnProperty = (JSONObject)overrideProperty.clone();
returnProperty.put("customValidationError", error);
returnProperty.put("symbolicName", requestProperty.get("symbolicName"));
responseProperties.add(returnProperty);
}
}
}
}
}
else if (overrideProperty.containsKey("timestamp"))
{
for (int j = 0; j < requestProperties.size(); j++)
{
JSONObject requestProperty = (JSONObject)requestProperties.get(j);
if (overrideProperty.get("symbolicName").equals(requestProperty.get("symbolicName")))
{
JSONObject returnProperty = new JSONObject();


returnProperty.put("symbolicName", requestProperty.get("symbolicName"));

returnProperty.put("value", new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss").format(new Date(System.currentTimeMillis())));

responseProperties.add(returnProperty);
}
}
}
}
}
JSONObject jsonResponse = new JSONObject();
jsonResponse.put("properties", responseProperties);
System.out.println("TEST LATS :: " + jsonResponse.toString());
PrintWriter writer = response.getWriter();
jsonResponse.serialize(writer);
}

/* Error */
private JSONArray getPropertyData(String objectType, java.util.Locale locale)
throws IOException
{
// Byte code:
// 0: new 76 com/ibm/json/java/JSONArray
// 3: dup
// 4: invokespecial 78 com/ibm/json/java/JSONArray:	()V
// 7: astore_3
// 8: aconst_null
// 9: astore 4
// 11: getstatic 95 java/lang/System:out Ljava/io/PrintStream;
// 14: ldc_w 309
// 17: invokevirtual 121 java/io/PrintStream:println (Ljava/lang/String;)V
// 20: new 311 javax/naming/InitialContext
// 23: dup
// 24: invokespecial 313 javax/naming/InitialContext:	()V
// 27: astore 5
// 29: aload 5
// 31: ldc_w 314
// 34: invokeinterface 316 2 0
// 39: checkcast 322 javax/sql/DataSource
// 42: astore 6
// 44: getstatic 95 java/lang/System:out Ljava/io/PrintStream;
// 47: ldc_w 324
// 50: invokevirtual 121 java/io/PrintStream:println (Ljava/lang/String;)V
// 53: aload 6
// 55: invokeinterface 326 1 0
// 60: astore 4
// 62: aload 4
// 64: invokeinterface 330 1 0
// 69: astore 7
// 71: getstatic 95 java/lang/System:out Ljava/io/PrintStream;
// 74: new 101 java/lang/StringBuilder
// 77: dup
// 78: ldc_w 336
// 81: invokespecial 105 java/lang/StringBuilder:	(Ljava/lang/String;)V
// 84: aload_2
// 85: invokevirtual 190 java/lang/StringBuilder:append (Ljava/lang/Object;)Ljava/lang/StringBuilder;
// 88: ldc_w 338
// 91: invokevirtual 108 java/lang/StringBuilder:append (Ljava/lang/String;)Ljava/lang/StringBuilder;
// 94: ldc_w 340
// 97: invokevirtual 108 java/lang/StringBuilder:append (Ljava/lang/String;)Ljava/lang/StringBuilder;
// 100: ldc 12
// 102: invokevirtual 108 java/lang/StringBuilder:append (Ljava/lang/String;)Ljava/lang/StringBuilder;
// 105: ldc_w 342
// 108: invokevirtual 108 java/lang/StringBuilder:append (Ljava/lang/String;)Ljava/lang/StringBuilder;
// 111: aload_1
// 112: invokevirtual 108 java/lang/StringBuilder:append (Ljava/lang/String;)Ljava/lang/StringBuilder;
// 115: ldc_w 338
// 118: invokevirtual 108 java/lang/StringBuilder:append (Ljava/lang/String;)Ljava/lang/StringBuilder;
// 121: ldc_w 344
// 124: invokevirtual 108 java/lang/StringBuilder:append (Ljava/lang/String;)Ljava/lang/StringBuilder;
// 127: ldc 15
// 129: invokevirtual 108 java/lang/StringBuilder:append (Ljava/lang/String;)Ljava/lang/StringBuilder;
// 132: ldc_w 346
// 135: invokevirtual 108 java/lang/StringBuilder:append (Ljava/lang/String;)Ljava/lang/StringBuilder;
// 138: invokevirtual 120 java/lang/StringBuilder:toString ()Ljava/lang/String;
// 141: invokevirtual 121 java/io/PrintStream:println (Ljava/lang/String;)V
// 144: aload 7
// 146: new 101 java/lang/StringBuilder
// 149: dup
// 150: ldc_w 336
// 153: invokespecial 105 java/lang/StringBuilder:	(Ljava/lang/String;)V
// 156: aload_2
// 157: invokevirtual 190 java/lang/StringBuilder:append (Ljava/lang/Object;)Ljava/lang/StringBuilder;
// 160: ldc_w 338
// 163: invokevirtual 108 java/lang/StringBuilder:append (Ljava/lang/String;)Ljava/lang/StringBuilder;
// 166: ldc_w 340
// 169: invokevirtual 108 java/lang/StringBuilder:append (Ljava/lang/String;)Ljava/lang/StringBuilder;
// 172: ldc 12
// 174: invokevirtual 108 java/lang/StringBuilder:append (Ljava/lang/String;)Ljava/lang/StringBuilder;
// 177: ldc_w 342
// 180: invokevirtual 108 java/lang/StringBuilder:append (Ljava/lang/String;)Ljava/lang/StringBuilder;
// 183: aload_1
// 184: invokevirtual 108 java/lang/StringBuilder:append (Ljava/lang/String;)Ljava/lang/StringBuilder;
// 187: ldc_w 338
// 190: invokevirtual 108 java/lang/StringBuilder:append (Ljava/lang/String;)Ljava/lang/StringBuilder;
// 193: ldc_w 344
// 196: invokevirtual 108 java/lang/StringBuilder:append (Ljava/lang/String;)Ljava/lang/StringBuilder;
// 199: ldc 15
// 201: invokevirtual 108 java/lang/StringBuilder:append (Ljava/lang/String;)Ljava/lang/StringBuilder;
// 204: ldc_w 346
// 207: invokevirtual 108 java/lang/StringBuilder:append (Ljava/lang/String;)Ljava/lang/StringBuilder;
// 210: invokevirtual 120 java/lang/StringBuilder:toString ()Ljava/lang/String;
// 213: invokeinterface 348 2 0
// 218: astore 8
// 220: aconst_null
// 221: astore 9
// 223: aconst_null
// 224: astore 10
// 226: iconst_1
// 227: istore 11
// 229: aconst_null
// 230: astore 12
// 232: aconst_null
// 233: astore 13
// 235: new 58 com/ibm/json/java/JSONObject
// 238: dup
// 239: invokespecial 247 com/ibm/json/java/JSONObject:	()V
// 242: astore 14
// 244: new 58 com/ibm/json/java/JSONObject
// 247: dup
// 248: invokespecial 247 com/ibm/json/java/JSONObject:	()V
// 251: astore 15
// 253: new 76 com/ibm/json/java/JSONArray
// 256: dup
// 257: invokespecial 78 com/ibm/json/java/JSONArray:	()V
// 260: astore 16
// 262: goto +480 -> 742
// 265: aload 8
// 267: ldc_w 354
// 270: invokeinterface 356 2 0
// 275: astore 17
// 277: iload 11
// 279: ifeq +32 -> 311
// 282: aload 17
// 284: astore 9
// 286: aload 8
// 288: ldc_w 362
// 291: invokeinterface 356 2 0
// 296: astore 10
// 298: aload_0
// 299: aload 8
// 301: aload 9
// 303: invokespecial 364 com/mit/edsservides/UpdateObjectTypeServlet:fillBasicProperties (Ljava/sql/ResultSet;Ljava/lang/String;)Lcom/ibm/json/java/JSONObject;
// 306: astore 14
// 308: iconst_0
// 309: istore 11
// 311: aload 17
// 313: aload 9
// 315: invokevirtual 128 java/lang/String:equals (Ljava/lang/Object;)Z
// 318: ifne +95 -> 413
// 321: aload 16
// 323: invokevirtual 368 com/ibm/json/java/JSONArray:isEmpty ()Z
// 326: ifne +66 -> 392
// 329: aload 15
// 331: ldc_w 372
// 334: aload 10
// 336: invokevirtual 144 com/ibm/json/java/JSONObject:put (Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;
// 339: pop
// 340: aload 15
// 342: ldc_w 374
// 345: aload 16
// 347: invokevirtual 144 com/ibm/json/java/JSONObject:put (Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;
// 350: pop
// 351: aload 14
// 353: ldc_w 376
// 356: aload 15
// 358: invokevirtual 144 com/ibm/json/java/JSONObject:put (Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;
// 361: pop
// 362: aload 8
// 364: ldc_w 362
// 367: invokeinterface 356 2 0
// 372: astore 10
// 374: new 58 com/ibm/json/java/JSONObject
// 377: dup
// 378: invokespecial 247 com/ibm/json/java/JSONObject:	()V
// 381: astore 15
// 383: new 76 com/ibm/json/java/JSONArray
// 386: dup
// 387: invokespecial 78 com/ibm/json/java/JSONArray:	()V
// 390: astore 16
// 392: aload_3
// 393: aload 14
// 395: invokevirtual 197 com/ibm/json/java/JSONArray:add (Ljava/lang/Object;)Z
// 398: pop
// 399: aload 17
// 401: astore 9
// 403: aload_0
// 404: aload 8
// 406: aload 9
// 408: invokespecial 364 com/mit/edsservides/UpdateObjectTypeServlet:fillBasicProperties (Ljava/sql/ResultSet;Ljava/lang/String;)Lcom/ibm/json/java/JSONObject;
// 411: astore 14
// 413: aload 8
// 415: ldc_w 362
// 418: invokeinterface 356 2 0
// 423: astore 18
// 425: aload 8
// 427: invokeinterface 378 1 0
// 432: ifne +310 -> 742
// 435: aload 18
// 437: aload 10
// 439: invokevirtual 128 java/lang/String:equals (Ljava/lang/Object;)Z
// 442: ifne +65 -> 507
// 445: aload 15
// 447: ldc_w 372
// 450: aload 10
// 452: invokevirtual 144 com/ibm/json/java/JSONObject:put (Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;
// 455: pop
// 456: aload 15
// 458: ldc_w 374
// 461: aload 16
// 463: invokevirtual 144 com/ibm/json/java/JSONObject:put (Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;
// 466: pop
// 467: aload 14
// 469: ldc_w 376
// 472: aload 15
// 474: invokevirtual 144 com/ibm/json/java/JSONObject:put (Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;
// 477: pop
// 478: aload_3
// 479: aload 14
// 481: invokevirtual 197 com/ibm/json/java/JSONArray:add (Ljava/lang/Object;)Z
// 484: pop
// 485: aload 18
// 487: astore 10
// 489: new 58 com/ibm/json/java/JSONObject
// 492: dup
// 493: invokespecial 247 com/ibm/json/java/JSONObject:	()V
// 496: astore 15
// 498: new 76 com/ibm/json/java/JSONArray
// 501: dup
// 502: invokespecial 78 com/ibm/json/java/JSONArray:	()V
// 505: astore 16
// 507: aload 8
// 509: ldc_w 381
// 512: invokeinterface 356 2 0
// 517: astore 19
// 519: aload 8
// 521: ldc_w 383
// 524: invokeinterface 356 2 0
// 529: astore 20
// 531: aload 19
// 533: ifnull +123 -> 656
// 536: aload 20
// 538: ifnull +118 -> 656
// 541: aload 19
// 543: invokevirtual 385 java/lang/String:isEmpty ()Z
// 546: ifne +110 -> 656
// 549: aload 20
// 551: invokevirtual 385 java/lang/String:isEmpty ()Z
// 554: ifne +102 -> 656
// 557: aload 12
// 559: ifnonnull +39 -> 598
// 562: aload 13
// 564: ifnonnull +34 -> 598
// 567: aload 19
// 569: astore 12
// 571: aload 20
// 573: astore 13
// 575: aload 14
// 577: ldc -63
// 579: aload 12
// 581: invokevirtual 144 com/ibm/json/java/JSONObject:put (Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;
// 584: pop
// 585: aload 14
// 587: ldc -61
// 589: aload 13
// 591: invokevirtual 144 com/ibm/json/java/JSONObject:put (Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;
// 594: pop
// 595: goto +61 -> 656
// 598: aload 19
// 600: aload 12
// 602: invokevirtual 128 java/lang/String:equals (Ljava/lang/Object;)Z
// 605: ifeq +13 -> 618
// 608: aload 20
// 610: aload 13
// 612: invokevirtual 128 java/lang/String:equals (Ljava/lang/Object;)Z
// 615: ifne +41 -> 656
// 618: aload 19
// 620: astore 12
// 622: aload 20
// 624: astore 13
// 626: aload_0
// 627: aload 8
// 629: aload 9
// 631: invokespecial 364 com/mit/edsservides/UpdateObjectTypeServlet:fillBasicProperties (Ljava/sql/ResultSet;Ljava/lang/String;)Lcom/ibm/json/java/JSONObject;
// 634: astore 14
// 636: aload 14
// 638: ldc -63
// 640: aload 12
// 642: invokevirtual 144 com/ibm/json/java/JSONObject:put (Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;
// 645: pop
// 646: aload 14
// 648: ldc -61
// 650: aload 13
// 652: invokevirtual 144 com/ibm/json/java/JSONObject:put (Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;
// 655: pop
// 656: new 58 com/ibm/json/java/JSONObject
// 659: dup
// 660: invokespecial 247 com/ibm/json/java/JSONObject:	()V
// 663: astore 21
// 665: aload 21
// 667: ldc_w 372
// 670: aload 8
// 672: ldc_w 386
// 675: invokeinterface 356 2 0
// 680: invokevirtual 144 com/ibm/json/java/JSONObject:put (Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;
// 683: pop
// 684: aload 21
// 686: ldc -114
// 688: aload 8
// 690: ldc -114
// 692: invokeinterface 356 2 0
// 697: invokevirtual 144 com/ibm/json/java/JSONObject:put (Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;
// 700: pop
// 701: aload 16
// 703: aload 21
// 705: invokevirtual 197 com/ibm/json/java/JSONArray:add (Ljava/lang/Object;)Z
// 708: pop
// 709: aload 15
// 711: ldc_w 372
// 714: aload 10
// 716: invokevirtual 144 com/ibm/json/java/JSONObject:put (Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;
// 719: pop
// 720: aload 15
// 722: ldc_w 374
// 725: aload 16
// 727: invokevirtual 144 com/ibm/json/java/JSONObject:put (Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;
// 730: pop
// 731: aload 14
// 733: ldc_w 376
// 736: aload 15
// 738: invokevirtual 144 com/ibm/json/java/JSONObject:put (Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;
// 741: pop
// 742: aload 8
// 744: invokeinterface 388 1 0
// 749: ifne -484 -> 265
// 752: aload_3
// 753: aload 14
// 755: invokevirtual 197 com/ibm/json/java/JSONArray:add (Ljava/lang/Object;)Z
// 758: pop
// 759: aload 7
// 761: invokeinterface 391 1 0
// 766: aload 4
// 768: invokeinterface 394 1 0
// 773: goto +677 -> 1450
// 776: astore 5
// 778: aload 5
// 780: invokevirtual 395 javax/naming/NamingException:printStackTrace ()V
// 783: getstatic 95 java/lang/System:out Ljava/io/PrintStream;
// 786: aload 5
// 788: invokevirtual 400 javax/naming/NamingException:getMessage ()Ljava/lang/String;
// 791: invokevirtual 121 java/io/PrintStream:println (Ljava/lang/String;)V
// 794: aload 4
// 796: ifnull +786 -> 1582
// 799: aload 4
// 801: invokeinterface 403 1 0
// 806: ifne +776 -> 1582
// 809: aload 4
// 811: invokeinterface 394 1 0
// 816: goto +766 -> 1582
// 819: astore 23
// 821: getstatic 95 java/lang/System:out Ljava/io/PrintStream;
// 824: ldc_w 406
// 827: invokevirtual 121 java/io/PrintStream:println (Ljava/lang/String;)V
// 830: goto +91 -> 921
// 833: getstatic 95 java/lang/System:out Ljava/io/PrintStream;
// 836: new 101 java/lang/StringBuilder
// 839: dup
// 840: ldc_w 408
// 843: invokespecial 105 java/lang/StringBuilder:	(Ljava/lang/String;)V
// 846: aload 23
// 848: invokevirtual 410 java/sql/SQLException:getSQLState ()Ljava/lang/String;
// 851: invokevirtual 108 java/lang/StringBuilder:append (Ljava/lang/String;)Ljava/lang/StringBuilder;
// 854: invokevirtual 120 java/lang/StringBuilder:toString ()Ljava/lang/String;
// 857: invokevirtual 121 java/io/PrintStream:println (Ljava/lang/String;)V
// 860: getstatic 95 java/lang/System:out Ljava/io/PrintStream;
// 863: new 101 java/lang/StringBuilder
// 866: dup
// 867: ldc_w 415
// 870: invokespecial 105 java/lang/StringBuilder:	(Ljava/lang/String;)V
// 873: aload 23
// 875: invokevirtual 417 java/sql/SQLException:getMessage ()Ljava/lang/String;
// 878: invokevirtual 108 java/lang/StringBuilder:append (Ljava/lang/String;)Ljava/lang/StringBuilder;
// 881: invokevirtual 120 java/lang/StringBuilder:toString ()Ljava/lang/String;
// 884: invokevirtual 121 java/io/PrintStream:println (Ljava/lang/String;)V
// 887: getstatic 95 java/lang/System:out Ljava/io/PrintStream;
// 890: new 101 java/lang/StringBuilder
// 893: dup
// 894: ldc_w 418
// 897: invokespecial 105 java/lang/StringBuilder:	(Ljava/lang/String;)V
// 900: aload 23
// 902: invokevirtual 420 java/sql/SQLException:getErrorCode ()I
// 905: invokevirtual 423 java/lang/StringBuilder:append (I)Ljava/lang/StringBuilder;
// 908: invokevirtual 120 java/lang/StringBuilder:toString ()Ljava/lang/String;
// 911: invokevirtual 121 java/io/PrintStream:println (Ljava/lang/String;)V
// 914: aload 23
// 916: invokevirtual 426 java/sql/SQLException:getNextException ()Ljava/sql/SQLException;
// 919: astore 23
// 921: aload 23
// 923: ifnonnull -90 -> 833
// 926: goto +656 -> 1582
// 929: astore 5
// 931: getstatic 95 java/lang/System:out Ljava/io/PrintStream;
// 934: ldc_w 406
// 937: invokevirtual 121 java/io/PrintStream:println (Ljava/lang/String;)V
// 940: goto +91 -> 1031
// 943: getstatic 95 java/lang/System:out Ljava/io/PrintStream;
// 946: new 101 java/lang/StringBuilder
// 949: dup
// 950: ldc_w 430
// 953: invokespecial 105 java/lang/StringBuilder:	(Ljava/lang/String;)V
// 956: aload 5
// 958: invokevirtual 410 java/sql/SQLException:getSQLState ()Ljava/lang/String;
// 961: invokevirtual 108 java/lang/StringBuilder:append (Ljava/lang/String;)Ljava/lang/StringBuilder;
// 964: invokevirtual 120 java/lang/StringBuilder:toString ()Ljava/lang/String;
// 967: invokevirtual 121 java/io/PrintStream:println (Ljava/lang/String;)V
// 970: getstatic 95 java/lang/System:out Ljava/io/PrintStream;
// 973: new 101 java/lang/StringBuilder
// 976: dup
// 977: ldc_w 432
// 980: invokespecial 105 java/lang/StringBuilder:	(Ljava/lang/String;)V
// 983: aload 5
// 985: invokevirtual 417 java/sql/SQLException:getMessage ()Ljava/lang/String;
// 988: invokevirtual 108 java/lang/StringBuilder:append (Ljava/lang/String;)Ljava/lang/StringBuilder;
// 991: invokevirtual 120 java/lang/StringBuilder:toString ()Ljava/lang/String;
// 994: invokevirtual 121 java/io/PrintStream:println (Ljava/lang/String;)V
// 997: getstatic 95 java/lang/System:out Ljava/io/PrintStream;
// 1000: new 101 java/lang/StringBuilder
// 1003: dup
// 1004: ldc_w 434
// 1007: invokespecial 105 java/lang/StringBuilder:	(Ljava/lang/String;)V
// 1010: aload 5
// 1012: invokevirtual 420 java/sql/SQLException:getErrorCode ()I
// 1015: invokevirtual 423 java/lang/StringBuilder:append (I)Ljava/lang/StringBuilder;
// 1018: invokevirtual 120 java/lang/StringBuilder:toString ()Ljava/lang/String;
// 1021: invokevirtual 121 java/io/PrintStream:println (Ljava/lang/String;)V
// 1024: aload 5
// 1026: invokevirtual 426 java/sql/SQLException:getNextException ()Ljava/sql/SQLException;
// 1029: astore 5
// 1031: aload 5
// 1033: ifnonnull -90 -> 943
// 1036: aload 4
// 1038: ifnull +544 -> 1582
// 1041: aload 4
// 1043: invokeinterface 403 1 0
// 1048: ifne +534 -> 1582
// 1051: aload 4
// 1053: invokeinterface 394 1 0
// 1058: goto +524 -> 1582
// 1061: astore 23
// 1063: getstatic 95 java/lang/System:out Ljava/io/PrintStream;
// 1066: ldc_w 406
// 1069: invokevirtual 121 java/io/PrintStream:println (Ljava/lang/String;)V
// 1072: goto +91 -> 1163
// 1075: getstatic 95 java/lang/System:out Ljava/io/PrintStream;
// 1078: new 101 java/lang/StringBuilder
// 1081: dup
// 1082: ldc_w 408
// 1085: invokespecial 105 java/lang/StringBuilder:	(Ljava/lang/String;)V
// 1088: aload 23
// 1090: invokevirtual 410 java/sql/SQLException:getSQLState ()Ljava/lang/String;
// 1093: invokevirtual 108 java/lang/StringBuilder:append (Ljava/lang/String;)Ljava/lang/StringBuilder;
// 1096: invokevirtual 120 java/lang/StringBuilder:toString ()Ljava/lang/String;
// 1099: invokevirtual 121 java/io/PrintStream:println (Ljava/lang/String;)V
// 1102: getstatic 95 java/lang/System:out Ljava/io/PrintStream;
// 1105: new 101 java/lang/StringBuilder
// 1108: dup
// 1109: ldc_w 415
// 1112: invokespecial 105 java/lang/StringBuilder:	(Ljava/lang/String;)V
// 1115: aload 23
// 1117: invokevirtual 417 java/sql/SQLException:getMessage ()Ljava/lang/String;
// 1120: invokevirtual 108 java/lang/StringBuilder:append (Ljava/lang/String;)Ljava/lang/StringBuilder;
// 1123: invokevirtual 120 java/lang/StringBuilder:toString ()Ljava/lang/String;
// 1126: invokevirtual 121 java/io/PrintStream:println (Ljava/lang/String;)V
// 1129: getstatic 95 java/lang/System:out Ljava/io/PrintStream;
// 1132: new 101 java/lang/StringBuilder
// 1135: dup
// 1136: ldc_w 418
// 1139: invokespecial 105 java/lang/StringBuilder:	(Ljava/lang/String;)V
// 1142: aload 23
// 1144: invokevirtual 420 java/sql/SQLException:getErrorCode ()I
// 1147: invokevirtual 423 java/lang/StringBuilder:append (I)Ljava/lang/StringBuilder;
// 1150: invokevirtual 120 java/lang/StringBuilder:toString ()Ljava/lang/String;
// 1153: invokevirtual 121 java/io/PrintStream:println (Ljava/lang/String;)V
// 1156: aload 23
// 1158: invokevirtual 426 java/sql/SQLException:getNextException ()Ljava/sql/SQLException;
// 1161: astore 23
// 1163: aload 23
// 1165: ifnonnull -90 -> 1075
// 1168: goto +414 -> 1582
// 1171: astore 5
// 1173: aload 5
// 1175: invokevirtual 436 java/lang/Exception:printStackTrace ()V
// 1178: aload 4
// 1180: ifnull +402 -> 1582
// 1183: aload 4
// 1185: invokeinterface 403 1 0
// 1190: ifne +392 -> 1582
// 1193: aload 4
// 1195: invokeinterface 394 1 0
// 1200: goto +382 -> 1582
// 1203: astore 23
// 1205: getstatic 95 java/lang/System:out Ljava/io/PrintStream;
// 1208: ldc_w 406
// 1211: invokevirtual 121 java/io/PrintStream:println (Ljava/lang/String;)V
// 1214: goto +91 -> 1305
// 1217: getstatic 95 java/lang/System:out Ljava/io/PrintStream;
// 1220: new 101 java/lang/StringBuilder
// 1223: dup
// 1224: ldc_w 408
// 1227: invokespecial 105 java/lang/StringBuilder:	(Ljava/lang/String;)V
// 1230: aload 23
// 1232: invokevirtual 410 java/sql/SQLException:getSQLState ()Ljava/lang/String;
// 1235: invokevirtual 108 java/lang/StringBuilder:append (Ljava/lang/String;)Ljava/lang/StringBuilder;
// 1238: invokevirtual 120 java/lang/StringBuilder:toString ()Ljava/lang/String;
// 1241: invokevirtual 121 java/io/PrintStream:println (Ljava/lang/String;)V
// 1244: getstatic 95 java/lang/System:out Ljava/io/PrintStream;
// 1247: new 101 java/lang/StringBuilder
// 1250: dup
// 1251: ldc_w 415
// 1254: invokespecial 105 java/lang/StringBuilder:	(Ljava/lang/String;)V
// 1257: aload 23
// 1259: invokevirtual 417 java/sql/SQLException:getMessage ()Ljava/lang/String;
// 1262: invokevirtual 108 java/lang/StringBuilder:append (Ljava/lang/String;)Ljava/lang/StringBuilder;
// 1265: invokevirtual 120 java/lang/StringBuilder:toString ()Ljava/lang/String;
// 1268: invokevirtual 121 java/io/PrintStream:println (Ljava/lang/String;)V
// 1271: getstatic 95 java/lang/System:out Ljava/io/PrintStream;
// 1274: new 101 java/lang/StringBuilder
// 1277: dup
// 1278: ldc_w 418
// 1281: invokespecial 105 java/lang/StringBuilder:	(Ljava/lang/String;)V
// 1284: aload 23
// 1286: invokevirtual 420 java/sql/SQLException:getErrorCode ()I
// 1289: invokevirtual 423 java/lang/StringBuilder:append (I)Ljava/lang/StringBuilder;
// 1292: invokevirtual 120 java/lang/StringBuilder:toString ()Ljava/lang/String;
// 1295: invokevirtual 121 java/io/PrintStream:println (Ljava/lang/String;)V
// 1298: aload 23
// 1300: invokevirtual 426 java/sql/SQLException:getNextException ()Ljava/sql/SQLException;
// 1303: astore 23
// 1305: aload 23
// 1307: ifnonnull -90 -> 1217
// 1310: goto +272 -> 1582
// 1313: astore 22
// 1315: aload 4
// 1317: ifnull +130 -> 1447
// 1320: aload 4
// 1322: invokeinterface 403 1 0
// 1327: ifne +120 -> 1447
// 1330: aload 4
// 1332: invokeinterface 394 1 0
// 1337: goto +110 -> 1447
// 1340: astore 23
// 1342: getstatic 95 java/lang/System:out Ljava/io/PrintStream;
// 1345: ldc_w 406
// 1348: invokevirtual 121 java/io/PrintStream:println (Ljava/lang/String;)V
// 1351: goto +91 -> 1442
// 1354: getstatic 95 java/lang/System:out Ljava/io/PrintStream;
// 1357: new 101 java/lang/StringBuilder
// 1360: dup
// 1361: ldc_w 408
// 1364: invokespecial 105 java/lang/StringBuilder:	(Ljava/lang/String;)V
// 1367: aload 23
// 1369: invokevirtual 410 java/sql/SQLException:getSQLState ()Ljava/lang/String;
// 1372: invokevirtual 108 java/lang/StringBuilder:append (Ljava/lang/String;)Ljava/lang/StringBuilder;
// 1375: invokevirtual 120 java/lang/StringBuilder:toString ()Ljava/lang/String;
// 1378: invokevirtual 121 java/io/PrintStream:println (Ljava/lang/String;)V
// 1381: getstatic 95 java/lang/System:out Ljava/io/PrintStream;
// 1384: new 101 java/lang/StringBuilder
// 1387: dup
// 1388: ldc_w 415
// 1391: invokespecial 105 java/lang/StringBuilder:	(Ljava/lang/String;)V
// 1394: aload 23
// 1396: invokevirtual 417 java/sql/SQLException:getMessage ()Ljava/lang/String;
// 1399: invokevirtual 108 java/lang/StringBuilder:append (Ljava/lang/String;)Ljava/lang/StringBuilder;
// 1402: invokevirtual 120 java/lang/StringBuilder:toString ()Ljava/lang/String;
// 1405: invokevirtual 121 java/io/PrintStream:println (Ljava/lang/String;)V
// 1408: getstatic 95 java/lang/System:out Ljava/io/PrintStream;
// 1411: new 101 java/lang/StringBuilder
// 1414: dup
// 1415: ldc_w 418
// 1418: invokespecial 105 java/lang/StringBuilder:	(Ljava/lang/String;)V
// 1421: aload 23
// 1423: invokevirtual 420 java/sql/SQLException:getErrorCode ()I
// 1426: invokevirtual 423 java/lang/StringBuilder:append (I)Ljava/lang/StringBuilder;
// 1429: invokevirtual 120 java/lang/StringBuilder:toString ()Ljava/lang/String;
// 1432: invokevirtual 121 java/io/PrintStream:println (Ljava/lang/String;)V
// 1435: aload 23
// 1437: invokevirtual 426 java/sql/SQLException:getNextException ()Ljava/sql/SQLException;
// 1440: astore 23
// 1442: aload 23
// 1444: ifnonnull -90 -> 1354
// 1447: aload 22
// 1449: athrow
// 1450: aload 4
// 1452: ifnull +130 -> 1582
// 1455: aload 4
// 1457: invokeinterface 403 1 0
// 1462: ifne +120 -> 1582
// 1465: aload 4
// 1467: invokeinterface 394 1 0
// 1472: goto +110 -> 1582
// 1475: astore 23
// 1477: getstatic 95 java/lang/System:out Ljava/io/PrintStream;
// 1480: ldc_w 406
// 1483: invokevirtual 121 java/io/PrintStream:println (Ljava/lang/String;)V
// 1486: goto +91 -> 1577
// 1489: getstatic 95 java/lang/System:out Ljava/io/PrintStream;
// 1492: new 101 java/lang/StringBuilder
// 1495: dup
// 1496: ldc_w 408
// 1499: invokespecial 105 java/lang/StringBuilder:	(Ljava/lang/String;)V
// 1502: aload 23
// 1504: invokevirtual 410 java/sql/SQLException:getSQLState ()Ljava/lang/String;
// 1507: invokevirtual 108 java/lang/StringBuilder:append (Ljava/lang/String;)Ljava/lang/StringBuilder;
// 1510: invokevirtual 120 java/lang/StringBuilder:toString ()Ljava/lang/String;
// 1513: invokevirtual 121 java/io/PrintStream:println (Ljava/lang/String;)V
// 1516: getstatic 95 java/lang/System:out Ljava/io/PrintStream;
// 1519: new 101 java/lang/StringBuilder
// 1522: dup
// 1523: ldc_w 415
// 1526: invokespecial 105 java/lang/StringBuilder:	(Ljava/lang/String;)V
// 1529: aload 23
// 1531: invokevirtual 417 java/sql/SQLException:getMessage ()Ljava/lang/String;
// 1534: invokevirtual 108 java/lang/StringBuilder:append (Ljava/lang/String;)Ljava/lang/StringBuilder;
// 1537: invokevirtual 120 java/lang/StringBuilder:toString ()Ljava/lang/String;
// 1540: invokevirtual 121 java/io/PrintStream:println (Ljava/lang/String;)V
// 1543: getstatic 95 java/lang/System:out Ljava/io/PrintStream;
// 1546: new 101 java/lang/StringBuilder
// 1549: dup
// 1550: ldc_w 418
// 1553: invokespecial 105 java/lang/StringBuilder:	(Ljava/lang/String;)V
// 1556: aload 23
// 1558: invokevirtual 420 java/sql/SQLException:getErrorCode ()I
// 1561: invokevirtual 423 java/lang/StringBuilder:append (I)Ljava/lang/StringBuilder;
// 1564: invokevirtual 120 java/lang/StringBuilder:toString ()Ljava/lang/String;
// 1567: invokevirtual 121 java/io/PrintStream:println (Ljava/lang/String;)V
// 1570: aload 23
// 1572: invokevirtual 426 java/sql/SQLException:getNextException ()Ljava/sql/SQLException;
// 1575: astore 23
// 1577: aload 23
// 1579: ifnonnull -90 -> 1489
// 1582: aload_3
// 1583: areturn
// Line number table:
// Java source line #302 -> byte code offset #0
// Java source line #303 -> byte code offset #8
// Java source line #305 -> byte code offset #11
// Java source line #306 -> byte code offset #20
// Java source line #307 -> byte code offset #29
// Java source line #308 -> byte code offset #44
// Java source line #309 -> byte code offset #53
// Java source line #312 -> byte code offset #62
// Java source line #335 -> byte code offset #71
// Java source line #336 -> byte code offset #144
// Java source line #338 -> byte code offset #220
// Java source line #339 -> byte code offset #223
// Java source line #340 -> byte code offset #226
// Java source line #341 -> byte code offset #229
// Java source line #342 -> byte code offset #232
// Java source line #343 -> byte code offset #235
// Java source line #344 -> byte code offset #244
// Java source line #345 -> byte code offset #253
// Java source line #349 -> byte code offset #262
// Java source line #352 -> byte code offset #265
// Java source line #354 -> byte code offset #277
// Java source line #357 -> byte code offset #282
// Java source line #358 -> byte code offset #286
// Java source line #360 -> byte code offset #298
// Java source line #361 -> byte code offset #308
// Java source line #366 -> byte code offset #311
// Java source line #369 -> byte code offset #321
// Java source line #372 -> byte code offset #329
// Java source line #373 -> byte code offset #340
// Java source line #374 -> byte code offset #351
// Java source line #375 -> byte code offset #362
// Java source line #376 -> byte code offset #374
// Java source line #377 -> byte code offset #383
// Java source line #379 -> byte code offset #392
// Java source line #380 -> byte code offset #399
// Java source line #381 -> byte code offset #403
// Java source line #383 -> byte code offset #413
// Java source line #385 -> byte code offset #425
// Java source line #388 -> byte code offset #435
// Java source line #391 -> byte code offset #445
// Java source line #392 -> byte code offset #456
// Java source line #393 -> byte code offset #467
// Java source line #395 -> byte code offset #478
// Java source line #396 -> byte code offset #485
// Java source line #397 -> byte code offset #489
// Java source line #398 -> byte code offset #498
// Java source line #407 -> byte code offset #507
// Java source line #408 -> byte code offset #519
// Java source line #411 -> byte code offset #531
// Java source line #414 -> byte code offset #557
// Java source line #416 -> byte code offset #567
// Java source line #417 -> byte code offset #571
// Java source line #418 -> byte code offset #575
// Java source line #419 -> byte code offset #585
// Java source line #421 -> byte code offset #595
// Java source line #426 -> byte code offset #598
// Java source line #428 -> byte code offset #618
// Java source line #429 -> byte code offset #622
// Java source line #430 -> byte code offset #626
// Java source line #431 -> byte code offset #636
// Java source line #432 -> byte code offset #646
// Java source line #437 -> byte code offset #656
// Java source line #438 -> byte code offset #665
// Java source line #440 -> byte code offset #684
// Java source line #443 -> byte code offset #701
// Java source line #446 -> byte code offset #709
// Java source line #447 -> byte code offset #720
// Java source line #448 -> byte code offset #731
// Java source line #349 -> byte code offset #742
// Java source line #452 -> byte code offset #752
// Java source line #453 -> byte code offset #759
// Java source line #454 -> byte code offset #766
// Java source line #455 -> byte code offset #773
// Java source line #457 -> byte code offset #778
// Java source line #458 -> byte code offset #783
// Java source line #480 -> byte code offset #794
// Java source line #481 -> byte code offset #809
// Java source line #482 -> byte code offset #816
// Java source line #483 -> byte code offset #821
// Java source line #485 -> byte code offset #830
// Java source line #486 -> byte code offset #833
// Java source line #487 -> byte code offset #860
// Java source line #488 -> byte code offset #887
// Java source line #489 -> byte code offset #914
// Java source line #485 -> byte code offset #921
// Java source line #460 -> byte code offset #929
// Java source line #462 -> byte code offset #931
// Java source line #464 -> byte code offset #940
// Java source line #466 -> byte code offset #943
// Java source line #467 -> byte code offset #970
// Java source line #468 -> byte code offset #997
// Java source line #469 -> byte code offset #1024
// Java source line #464 -> byte code offset #1031
// Java source line #480 -> byte code offset #1036
// Java source line #481 -> byte code offset #1051
// Java source line #482 -> byte code offset #1058
// Java source line #483 -> byte code offset #1063
// Java source line #485 -> byte code offset #1072
// Java source line #486 -> byte code offset #1075
// Java source line #487 -> byte code offset #1102
// Java source line #488 -> byte code offset #1129
// Java source line #489 -> byte code offset #1156
// Java source line #485 -> byte code offset #1163
// Java source line #472 -> byte code offset #1171
// Java source line #474 -> byte code offset #1173
// Java source line #480 -> byte code offset #1178
// Java source line #481 -> byte code offset #1193
// Java source line #482 -> byte code offset #1200
// Java source line #483 -> byte code offset #1205
// Java source line #485 -> byte code offset #1214
// Java source line #486 -> byte code offset #1217
// Java source line #487 -> byte code offset #1244
// Java source line #488 -> byte code offset #1271
// Java source line #489 -> byte code offset #1298
// Java source line #485 -> byte code offset #1305
// Java source line #478 -> byte code offset #1313
// Java source line #480 -> byte code offset #1315
// Java source line #481 -> byte code offset #1330
// Java source line #482 -> byte code offset #1337
// Java source line #483 -> byte code offset #1342
// Java source line #485 -> byte code offset #1351
// Java source line #486 -> byte code offset #1354
// Java source line #487 -> byte code offset #1381
// Java source line #488 -> byte code offset #1408
// Java source line #489 -> byte code offset #1435
// Java source line #485 -> byte code offset #1442
// Java source line #492 -> byte code offset #1447
// Java source line #480 -> byte code offset #1450
// Java source line #481 -> byte code offset #1465
// Java source line #482 -> byte code offset #1472
// Java source line #483 -> byte code offset #1477
// Java source line #485 -> byte code offset #1486
// Java source line #486 -> byte code offset #1489
// Java source line #487 -> byte code offset #1516
// Java source line #488 -> byte code offset #1543
// Java source line #489 -> byte code offset #1570
// Java source line #485 -> byte code offset #1577
// Java source line #493 -> byte code offset #1582
// Local variable table:
// start length slot name signature
// 0 1584 0 this UpdateObjectTypeServlet
// 0 1584 1 objectType String
// 0 1584 2 locale java.util.Locale
// 7 1576 3 jsonPropertyData JSONArray
// 9 1457 4 con java.sql.Connection
// 27 3 5 ctx javax.naming.Context
// 776 11 5 e javax.naming.NamingException
// 929 103 5 se SQLException
// 1171 3 5 e Exception
// 42 12 6 ds javax.sql.DataSource
// 69 691 7 stmt java.sql.Statement
// 218 525 8 results ResultSet
// 221 409 9 property String
// 224 491 10 listDispName String
// 227 83 11 firstLoop boolean
// 230 411 12 dependentOn String
// 233 418 13 dependentValue String
// 242 512 14 propertyJson JSONObject
// 251 486 15 choiceList JSONObject
// 260 466 16 choices JSONArray
// 275 125 17 propertyTemp String
// 423 63 18 listDispNameTemp String
// 517 102 19 dependentOnTemp String
// 529 94 20 dependentValueTemp String
// 663 41 21 choice JSONObject
// 1313 135 22 localObject Object
// 819 103 23 se SQLException
// 1061 103 23 se SQLException
// 1203 103 23 se SQLException
// 1340 103 23 se SQLException
// 1475 103 23 se SQLException
// Exception table:
// from to target type
// 11 773 776 javax/naming/NamingException
// 794 816 819 java/sql/SQLException
// 11 773 929 java/sql/SQLException
// 1036 1058 1061 java/sql/SQLException
// 11 773 1171 java/lang/Exception
// 1178 1200 1203 java/sql/SQLException
// 11 794 1313 finally
// 929 1036 1313 finally
// 1171 1178 1313 finally
// 1315 1337 1340 java/sql/SQLException
// 1450 1472 1475 java/sql/SQLException
}

private JSONObject fillBasicProperties(ResultSet results, String property)
throws SQLException
{
JSONObject propertyJson = new JSONObject();

propertyJson.put("symbolicName", property);

String displayMode = results.getString("dispmode");
if (!results.wasNull()) {
propertyJson.put("displayMode", displayMode);
}
String required = results.getString("required");
if ((!results.wasNull()) && ('1' == required.charAt(0))) {
propertyJson.put("required", Boolean.valueOf(true));
}
String hidden = results.getString("hidden");
if ((!results.wasNull()) && ('1' == hidden.charAt(0))) {
propertyJson.put("hidden", Boolean.valueOf(true));
}
Integer maxVal = Integer.valueOf(results.getInt("maxval"));
if (!results.wasNull()) {
propertyJson.put("maxValue", maxVal);
}
Integer minVal = Integer.valueOf(results.getInt("minval"));
if (!results.wasNull()) {
propertyJson.put("minValue", minVal);
}
Integer maxLen = Integer.valueOf(results.getInt("maxlen"));
if (!results.wasNull()) {
propertyJson.put("maxLength", maxLen);
}
String format = results.getString("format");
if (!results.wasNull()) {
propertyJson.put("format", format);
}
String formatdesc = results.getString("formatdesc");
if (!results.wasNull()) {
propertyJson.put("formatDescription", formatdesc);
}
String hasDependant = results.getString("hasdependant");
if ((!results.wasNull()) && ('1' == hasDependant.charAt(0))) {
propertyJson.put("hasDependentProperties", Boolean.valueOf(true));
}
return propertyJson;
}
}