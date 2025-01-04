<%
    response.setHeader("Cache-Control","no-cache"); //HTTP 1.1
    response.setHeader("Pragma","no-cache"); //HTTP 1.0
    response.setDateHeader ("Expires", 0); //prevents caching at the proxy server
%>
var filenetViewerParameters = {        
    // annotateEdit: "true",
    // annotationTrace: "false",
    // annotationUnits: "inches",

    annotationTemplate: "/navigator/headerfooter.txt?noCache=" + Math.random(),
    annotationSubstitution1: "1: <DOCNAME>=" + new Date(),
    annotationSubstitution2: "-1: <DOCNAME>=<EMPTY>",

    customAnnotationToolTip: "Created On: <createdate>",
    alwaysShowCustomAnnotationTooltip: "true",
    filenet: "false",
    
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
