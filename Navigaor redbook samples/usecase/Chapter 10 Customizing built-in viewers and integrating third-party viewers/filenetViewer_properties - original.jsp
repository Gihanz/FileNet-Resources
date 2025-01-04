<%
    response.setHeader("Cache-Control","no-cache"); //HTTP 1.1
    response.setHeader("Pragma","no-cache"); //HTTP 1.0
    response.setDateHeader ("Expires", 0); //prevents caching at the proxy server
%>
var filenetViewerParameters = {        
    // annotateEdit: "true",
    // annotationTrace: "false",
    // annotationUnits: "inches",

    // customAnnotationToolTip: " Created By: <creator>,  Created On: <createdate>",

    // fileButtons: "false",
    // fileKeys: "false",
    // fileMenus: "false",
    // filenetAlwaysRubberband: "true",
    // flipOptions: "true",

    // helpURL: "",
    // invertButtons: "true",

    // Photometric: "true",
    // printButtons: "true",

    // routeDocs: "true",
    // scale: "ftow",

    trace: "false",
    traceNet: "false"
};
