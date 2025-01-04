<!DOCTYPE html>
<%
    String htmlLocale = request.getLocale().toString().toLowerCase().replace('_','-');
    htmlLocale = htmlLocale.replace("iw", "he");  // workaround for Java getLocale() spec.
%>
<html lang="<%=htmlLocale%>">
<% 
    response.setHeader("Cache-Control","no-cache"); 
    response.setHeader("Pragma","no-cache"); //HTTP 1.0
    response.setDateHeader ("Expires", 0); //prevents caching at the proxy server
%>
<%@ include file="header.jsp" %>

<body class="<%=bodyClasses%>" dir="<%=direction%>" style="width: 100%; height: 100%; position: absolute;">
    <div id="ECMWebUIloadingAnimation" style="display:inline-block;position:absolute;top: 10px; left: 10px">
        <div class="ecmLoading"></div>
        <div id="ECMWebUIloadingText" class="contentNode loadingText"></div>
    </div>
    <script>
	dojo.require("custom.widget.process.StepProcessorRedbkLayout");	
    </script>
    <div dojoType="custom.widget.process.StepProcessorRedbkLayout" id="ECMStepProcUI" style="width: 100%; height: 100%" lang="<%=htmlLocale%>"></div>
</body>

</html>
