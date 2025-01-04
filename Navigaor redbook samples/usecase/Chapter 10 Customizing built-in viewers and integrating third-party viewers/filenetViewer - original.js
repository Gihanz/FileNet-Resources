/**
 * Licensed Materials - Property of IBM (C) Copyright IBM Corp. 2012 US Government Users Restricted Rights - Use,
 * duplication or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

// The content of this js support creation/launching of the Daeja Image Viewer Applet.
function ViewOneLauncher(contextPath, isIsra, coldTemplateParam, docUrl, userId, isFederated, pageList, v1EventHandler, pageNumber, contentType, language, annotationTooltip, desktop) {

	this.redactionMimeTypes = new Array("application/pdf", "image/bmp", "image/gif", "image/jp2", "image/jpeg", "image/jpg", "image/pjpeg", "image/png", "image/tiff");

	this.getAnnotationBurnUrl = function() {
		return this.contextPath + "/iviewpro/redact?burn=true&" + this.docUrlBreak[1];
	},

	this.getReadAnnotUrlStr = function() {
		return this.docUrl + "&alt_output=Annotations";
	},

	this.getWriteAnnotUrlStr = function() {
		return this.docUrl.replace("getDocument", "updateAnnotations") + "&desktop=" + desktop;
	},

	this.getColdTemplateUrlStr = function() {
		var urlBase = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port;
		return urlBase + this.docUrlBreak[0] + "?" + this.coldTemplateParam + "=0&" + this.docUrlBreak[1];
	},

	this.getAnnotHideButtons = function() {
		if (this.isFederated)
			return 'line, solidtext, highlightpoly, rectangle, poly, openpoly, oval, hyperlink, transparent';
		else
			return 'hyperlink,transparent';
	},

	this.getAnnotHideContextButtons = function() {
		if (this.isFederated)
			return 'save,text, hyperlink,behind, transparent,security';
		else
			return 'hyperlink,behind,transparent,security';
	},

	this.getAnnotHideContextButtonIds = function() {
		if (this.isFederated)
			return 'note, freehand, stamp, arrow, highlight, text, transparent';
		else
			return null;
	},

	this.setUseStreamer = function(contentType) {
		this.useStreamer = (contentType.indexOf("tiff") != -1 || contentType.indexOf("pdf") != -1);
	},

	this.setEnableRedaction = function(contentType) {
		if (this.redactionMimeTypes.indexOf) {
			this.enableRedaction = this.redactionMimeTypes.indexOf(contentType) >= 0;
		} else {
			this.enableRedaction = false;
			for ( var n in this.redactionMimeTypes) {
				if (contentType == this.redactionMimeTypes[n]) {
					this.enableRedaction = true;
					break;
				}
			}
		}
	},

	this.contextPath = contextPath;
	this.docUrl = docUrl;
	this.docUrlBreak = docUrl.split("?");
	this.appletHtml = "";
	this.isIsra = isIsra;
	this.isFederated = isFederated;
	this.appletHeight = "100%";
	this.appletWidth = "100%";
	this.sizeTag = 'WIDTH="' + this.appletWidth + '" HEIGHT="' + this.appletHeight + '"';
	this.paramTag = '<param name="';
	this.operatorTag = '" value=';
	this.enderTag = '>';
	this.appletId = "ViewONE";
	this.states = " ";
	this.userId = userId;
	this.fileUrlStr = docUrl;
	this.pageNumber = (pageNumber ? pageNumber : "1");
	this.language = language;
	this.setUseStreamer(contentType);
	this.setEnableRedaction(contentType);

	var daejaVersion = "4.0.42.0";

	this.v1Type = "proacm";
	if (this.v1Type == "proacm") {
		this.viewOneUrl = this.contextPath + "/applets/iviewpro/FnJavaV1Files/";
		this.code = "start.jiViewONE";
		this.archive = "viewone.jar,viewer-security-dialog.jar,viewer-security-dialog-i18n.jar";
		this.cabbase = "viewone.cab";
		this.cacheVersion = daejaVersion + ", " + daejaVersion + ", " + daejaVersion;
	} else if (this.v1Type == "pro") {
		this.viewOneUrl = this.contextPath + "/applets/iviewpro/FnJavaV1Files/";
		this.code = "ji.applet.jiApplet";
		this.archive = "ji.jar,daeja1.jar,daeja2.jar,daeja3.jar,viewer-security-dialog.jar,viewer-security-dialog-i18n.jar";
		this.cabbase = "ji.cab";
		this.cacheVersion = daejaVersion + ", " + daejaVersion + ", " + daejaVersion + ", " + daejaVersion + ", " + daejaVersion + ", " + daejaVersion;
	} else {
		this.viewOneUrl = this.contextPath + "/applets/FnJavaV1Files/";
		this.code = "ji.applet.jiApplet";
		this.archive = "ji.jar,p8securityDlg.jar,p8securityDlgResources.jar";
		this.cabbase = "ji.jar";
		this.cacheVersion = "3.1.192.0, 43.1.192.0, 43.1.192.0";
	}

	this.appletCode = this.code.replace(/\./g, "\/");
	this.v1EventHandler = v1EventHandler;
	this.topToolbarHeight = 30;
	this.userAgent = navigator.userAgent.toLowerCase();

	this.coldTemplateParam = coldTemplateParam;

	this.servletStr = "null"; // used to determine if we're going to ISRA (getISContent)
	this.parameterMap = new Object();

	this.streamerUrl = this.contextPath + "/iviewpro/streamer?element=0";

	this._getCodeParams = function() {
		var codeParams = this._getParameterHtml("code", this.code);
		codeParams += this._getParameterHtml("codebase", this.viewOneUrl);
		codeParams += this._getParameterHtml("quickstartURL", "quickstart.htm");
		return codeParams;
	};

	this._getParameterHtml = function(key, value) {
		return (this.paramTag + key + this.operatorTag + '"' + value + '"' + this.enderTag + '\n');
	};

	this._appendHtml = function(html) {
		this.appletHtml = this.appletHtml + html;
	};

	this._appendParameter = function(key, value) {
		this._appendHtml(this._getParameterHtml(key, value));
	};

	this._adjustForBrowsers = function() {
		if (this.userAgent.indexOf("msie") > 0) {
			this.appletTag = '<OBJECT id="ViewONE" name="ViewONE" classid="clsid:8AD9C840-044E-11D1-B3E9-00805F499D93"  ' + this.sizeTag + ' HSPACE="0" VSPACE="0" ALIGN="middle" >';
			this.appletEndTag = '<div id="javaPluginNotFound"><p>&nbsp;<p></div></OBJECT>';
		} else if ((this.userAgent.indexOf("macintosh") > 0) || (this.userAgent.indexOf("mac_") > 0) || (this.userAgent.indexOf("opera") > 0)) {
			this.appletTag = '<applet ARCHIVE="' + this.archive + '" NAME="ViewONE" ID="ViewONE" ' + this.sizeTag + '" HSPACE="0" VSPACE="0" ALIGN="middle" MAYSCRIPT="true" code="' + this.appletCode + '" codebase="' + this.viewOneUrl + '">';
			this.appletEndTag = '</applet>';
		} else {
			this.paramTag = '';
			this.operatorTag = '=';
			this.enderTag = '\n';
			this.appletTag = '<EMBED type="application/x-java-applet" ' + this.sizeTag + ' id="ViewONE" archive=' + this.archive + ' ' + this._getCodeParams();
			this.appletEndTag = '>\n</EMBED>';
		}
	};

	this.validateApplet = function() {
		// Handle the IE-specific case of an applet failing to launch.
		setTimeout(function() {
			var javaPluginNotFound = document.getElementById("javaPluginNotFound");
			if (javaPluginNotFound && javaPluginNotFound.offsetWidth > 0 && frameElement && frameElement.docViewer) {
				frameElement.docViewer._onViewerEvent({
					id: "hasNoJavaPlugin"
				});
			}
		}, 1000);
	};

	this._loadAppletParameters = function() {
		// TODO: Add helpURL parameter if/when a good URL is available.

		if (this.v1Type == "proacm" || this.v1Type == "pro") {
			// pro-specific settings go here...
			if (this.useStreamer) {
				this.setParameter('streamerURL', this.streamerUrl);
			}

			if (this.enableRedaction) {
				this.setParameter('annotationBurnURL', this.getAnnotationBurnUrl());
				this.setParameter('receiveRedacted', 'true');
				this.setParameter('annotationBurnFormat', 'native');
				this.setParameter('burnMultiPage', 'true');
				this.setParameter('burnPDFtoPDF', 'true');
				this.setParameter('annotationsToggleBurn', 'true');
				this.setParameter('annotationDefaults', 'redact {burnable=true} redactpoly {burnable=true} line {burnable=true} rectangle {burnable=true} oval {burnable=true} arrow {burnable=true} openpoly {burnable=true} text {burnable=true} stamp {burnable=true} freehand {burnable=true}');
			}
		}

		this.setParameter('language', this.language);

		if (this.language == "ar" || this.language == "he" || this.language == "iw") {
			this.setParameter('uvTextDirectionMethod', '2');
			this.setParameter('RTLGui', 'true');
		}

		this.setParameter('obfuscateUV', 'false');
		this.setParameter('JavaScriptExtensions', 'true');
		this.setParameter('mayscript', 'true');
		this.setParameter('annotationSuppressEmptyMessages', 'true');
		this.setParameter('flipOptions', 'true');
		this.setParameter('scale', 'ftow');
		this.setParameter('viewMode', 'fullpage');
		this.setParameter('xScroll', '0');
		this.setParameter('yScroll', '100');
		this.setParameter('fileButtons', 'false');
		this.setParameter('fileMenus', 'false');
		this.setParameter('fileKeys', 'false');
		this.setParameter('invertButtons', 'true');
		this.setParameter('annotate', 'true');
		this.setParameter('annotateEdit', 'true');
		this.setParameter('annotationFile', this.getReadAnnotUrlStr());
		this.setParameter('annotationSavePost', this.getWriteAnnotUrlStr());
		this.setParameter('annotationTrace', 'false'); // Set to true for debugging
		this.setParameter('annotationColorMask', '0bgr');
		this.setParameter('annotationAutoSaveJ2Shutdown', 'false'); // Set to true to automatically save changes when viewer exits
		this.setParameter('annotationAutoSave', 'false');
		this.setParameter('annotationAutoPrompt', 'false');
		this.setParameter('trace', 'false'); // Set to true for debugging
		this.setParameter('traceNet', 'false'); // Set to true for debugging
		this.setParameter('filenetAlwaysRubberband', 'true'); // set false for CFS case to display full text
		this.setParameter('Photometric', 'true');
		this.setParameter('customAnnotationToolTip', annotationTooltip);
		this.setParameter('FilenetAnnotationOutputCreator', 'true');
		this.setParameter('docIDMarker', this.coldTemplateParam + '=');
		this.setParameter('fileNetCOLDTemplateResource', this.getColdTemplateUrlStr());

		//  ------------------------------------------------------------------------------------------------------
		//  Do these after all others, so that the internal values take precedence over attempted configuration of
		//  These parameters.
		//

		// The following 2 parameters hide functionality which is not currently supported in P8
		if (this.isFederated) {
			this.setParameter('annotationhidebuttons', 'line, solidtext, highlightpoly, rectangle, poly, openpoly, oval, hyperlink, transparent');
			this.setParameter('annotationHideContextButtons', 'save,text, hyperlink,behind, transparent,security');
			this.setParameter('annotationHideContextButtonsids', 'note, freehand, stamp, arrow, highlight, text, transparent');
		} else {
			this.setParameter('annotationhidebuttons', 'hyperlink,transparent');
			this.setParameter('annotationHideContextButtons', 'hyperlink,behind,transparent,security');
		}

		this.setParameter('filenetSystem', '4'); // P8 Required to access the CE server
		this.setParameter('fileNetSystem', '4'); // P8 Required to access the CE server
		this.setParameter('theme', 'ibmcn');
		this.setParameter('filenetedition', '2');
		this.setParameter('filenet', 'true'); // P8 Required to enable custom FileNet features
		this.setParameter('addEscapeCharactersToXML', 'true'); // Required for proper XML encoding
		this.setParameter('annotationUnits', 'inches'); // P8 Required

		this.setParameter('cabbase', this.cabbase);
		this.setParameter('backcolor', '240,240,240');
		this.setParameter('annotationEncoding', 'UTF8'); // Required for proper double-byte encoding

		this.setParameter('code', this.code + '.class');
		this.setParameter('codebase', this.viewOneUrl);
		this.setParameter('quickstartURL', 'quickstart.htm');

		this.setParameter('cache_archive', this.archive);
		this.setParameter('cache_version', this.cacheVersion);
		this.setParameter('name', this.appletId);
		this.setParameter('id', this.appletId);
		this.setParameter('userID', this.userId); // Required for stamp annotations that include user name
		this.setParameter('pageNumber', this.pageNumber);

		if (pageList.length < 1)
			this.setParameter('filename', this.fileUrlStr);
		else {
			if (this.userAgent.indexOf("irefox") > 0 && pageList.length > 900) {
				this.deferredPageList = pageList;
				this.deferredDocUrl = this.fileUrlStr;
				this.deferredPageNumber = pageNumber;
			} else {
				for ( var n = 0; n < pageList.length; n++) {
					var pageNumber = n + 1;
					this.setParameter('page' + pageNumber, this.fileUrlStr + '&element=' + pageList[n]);
				}
			}
		}

		if (this.v1EventHandler && this.v1EventHandler != null) {
			this.setParameter('annotationJavascriptExtensions', true);
			this.setParameter('eventhandler', this.v1EventHandler);
			this.setParameter('eventInterest', '3,4,5,10,21,22,24,25,26,27,32,33,57,60,61');
		}

		if (this._customParameters) {
			for (key in this._customParameters)
				this.setParameter(key, this._customParameters[key]);
		}

	};

	this.openDeferred = function() {
		if (this.deferredPageList && this.deferredPageList != null && document.ViewONE) {
			var docUrl = this.deferredDocUrl;
			var pageList = this.deferredPageList;
			var pageNumber = (this.deferredPageNumber && this.deferredPageNumber != null ? this.deferredPageNumber : 1);
			var applet = document.ViewONE;

			this.deferredPageList = null;
			this.deferredDocUrl = null;

			applet.initializePageArray(pageList.length);

			for ( var n = 0; n < pageList.length; n++)
				applet.setPageArray(docUrl + '&element=' + pageList[n], n);

			applet.openPageArray(pageNumber);
		}
	};

	this._appendParameters = function() {
		for (key in this.parameterMap)
			this._appendParameter(key, this.parameterMap[key]);
	};

	this.setParameter = function(key, value) {
		this.parameterMap[key] = value;
	};

	this.setCustomParameters = function(customParameters) {
		this._customParameters = customParameters;
	};

	this.getAppletHtml = function() {
		this._loadAppletParameters();

		this.appletHtml = "";
		this._adjustForBrowsers();

		this._appendHtml(this.appletTag);
		this._appendParameters();
		this._appendHtml(this.appletEndTag);

		return this.appletHtml;
	};

	this.openDocument = function(docUrl, isFederated, pageList, pageNumber, contentType) {
		if (document.ViewONE) {
			pageNumber = (pageNumber && pageNumber != null ? pageNumber : 1);

			var applet = document.ViewONE;

			this.docUrl = docUrl;
			this.docUrlBreak = docUrl.split("?");
			this.fileUrlStr = docUrl; // TODO: look into cleaning up this property - fileUrlStr.
			this.isFederated = isFederated;
			this.pageNumber = pageNumber;

			// TODO:  Handle cases where one or more of these may have been hard-set to blank in filenetViewer_properties.jsp
			var annotationBurnUrl = this.getAnnotationBurnUrl();
			var readAnnotUrlStr = this.getReadAnnotUrlStr();
			var writeAnnotUrlStr = this.getWriteAnnotUrlStr();
			var coldTemplateUrlStr = this.getColdTemplateUrlStr();
			var annotHideButtons = this.getAnnotHideButtons();

			var annotHideContextButtons = this.getAnnotHideContextButtons();
			var annotHideContextButtonIds = this.getAnnotHideContextButtonIds();

			applet.closeDocument();

			applet.setAnnotationFile(readAnnotUrlStr);
			applet.setAnnotationSavePost(writeAnnotUrlStr);
			applet.setAnnotationBurnURL(annotationBurnUrl);
			applet.setFileNetCOLDTemplateResource(coldTemplateUrlStr);

			applet.setAnnotationHideButtons(annotHideButtons);
			applet.setAnnotationHideContextButtons(annotHideContextButtons);
			if (annotHideContextButtonIds != null) {
				applet.setAnnotationHideContextButtonsIds(annotHideContextButtonIds);
			}

			if (pageList.length <= 1)
				applet.openFile(docUrl, pageNumber);
			else {
				applet.initializePageArray(pageList.length);

				for ( var n = 0; n < pageList.length; n++)
					applet.setPageArray(docUrl + '&element=' + pageList[n], n);

				applet.openPageArray(pageNumber);
			}
		}
	};

	this.launchApplet = function() {
		// Launch the applet.
		document.write(this.getAppletHtml());
		this.validateApplet();
	};
}
