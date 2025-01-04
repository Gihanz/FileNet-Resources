<!DOCTYPE html>
<%
    response.setHeader("Cache-Control","no-cache"); 
    response.setHeader("Pragma","no-cache"); //HTTP 1.0
    response.setDateHeader ("Expires", 0); //prevents caching at the proxy server
%>
<%@ include file="header.jsp" %>

<body class="<%=bodyClasses%>" style="width: 100%; height: 100%; position: absolute;">
    <div id="ECMWebUIloadingAnimation" style="display:inline-block;position:absolute;top: 10px; left: 10px">
        <div class="ecmLoading"></div>
        <div id="ECMWebUIloadingText" class="contentNode loadingText"></div>
    </div>
    <div dojoType="ecm.widget.process.StepProcessorLayout" id="ECMStepProcUI" style="width: 100%; height: 100%"></div>
</body>

</html>
