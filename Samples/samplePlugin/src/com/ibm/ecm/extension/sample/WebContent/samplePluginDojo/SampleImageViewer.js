/*
 * Licensed Materials - Property of IBM (c) Copyright IBM Corp. 2012, 2013  All Rights Reserved.
 * 
 * US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP Schedule Contract with
 * IBM Corp.
 * 
 * DISCLAIMER OF WARRANTIES :
 * 
 * Permission is granted to copy and modify this Sample code, and to distribute modified versions provided that both the
 * copyright notice, and this permission notice and warranty disclaimer appear in all copies and modified versions.
 * 
 * THIS SAMPLE CODE IS LICENSED TO YOU AS-IS. IBM AND ITS SUPPLIERS AND LICENSORS DISCLAIM ALL WARRANTIES, EITHER
 * EXPRESS OR IMPLIED, IN SUCH SAMPLE CODE, INCLUDING THE WARRANTY OF NON-INFRINGEMENT AND THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE. IN NO EVENT WILL IBM OR ITS LICENSORS OR SUPPLIERS BE LIABLE FOR
 * ANY DAMAGES ARISING OUT OF THE USE OF OR INABILITY TO USE THE SAMPLE CODE, DISTRIBUTION OF THE SAMPLE CODE, OR
 * COMBINATION OF THE SAMPLE CODE WITH ANY OTHER CODE. IN NO EVENT SHALL IBM OR ITS LICENSORS AND SUPPLIERS BE LIABLE
 * FOR ANY LOST REVENUE, LOST PROFITS OR DATA, OR FOR DIRECT, INDIRECT, SPECIAL, CONSEQUENTIAL, INCIDENTAL OR PUNITIVE
 * DAMAGES, HOWEVER CAUSED AND REGARDLESS OF THE THEORY OF LIABILITY, EVEN IF IBM OR ITS LICENSORS OR SUPPLIERS HAVE
 * BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
 */

define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/xhr",
	"dojo/dom",
	"dojo/dom-style",
	"dojo/dom-construct",
	"ecm/widget/viewer/DocViewer",
	"dojo/text!./templates/SampleImageViewer.html",
	"ecm/LoggerMixin"
], //
function(declare, lang, xhr, dom, domStyle, domConstruct, DocViewer, template, LoggerMixin) {

	var SampleImageViewer = declare("samplePluginDojo.SampleImageViewer", [
		DocViewer,
		LoggerMixin
	], {
		templateString: template,

		_itemLoaded: false,

		postCreate: function() {
			this.inherited(arguments);
		},

		setItem: function(item, pageNumber) {
			this.inherited(arguments);
			this._itemLoaded = false;
		},

		showItem: function() {
			var methodName = "showItem";
			this.logEntry(methodName);

			if (!this.isLoading() && !this._itemLoaded) {
				this.setIsLoading(true);
				this._loadImage();
			}

			this.logExit(methodName);
		},

		_loadImage: function() {
			var methodName = "_loadImage";
			this.logEntry(methodName);
			
			domStyle.set(this.containerNode, "overflow", "scroll");
			var img = this._setLoading(this.imageContainer, this._item.contentType);

			var repository = this._item.repository;

			var requestUrlBase = ecm.model.Request.getServiceRequestUrl("plugin", "", {
				"plugin":"SamplePlugin",
				"action":"samplePluginGetContentService"
			});
			
			xhr.post({
				url: requestUrlBase,
				handleAs: "json",
				content: {
					repositoryId: repository.id,
					repositoryType: repository.type,
					docid: this._item.id,
					vsId: this._item.vsId,
					version: "current",
					template_name: this._item.template
				},

				load: lang.hitch(this, function(data, args) {
					if (data.imageUrl) {
						this.logDebug(methodName, "Setting img.src to " + data.imageUrl);
						img.src = data.imageUrl;
						img.style.height = "auto";
						img.style.width = "auto";
					} else if (data.errorMessage) {
						var errorDiv = domConstruct.create("div", {
							innerHTML: "<p>" + data.errorMessage + "</p>"
						});
						domConstruct.place(errorDiv, this.imageContainer, "only");
					}

					if (repository.type != "cmis") {
						domStyle.set(this.allAnnotations, "visibility", "visible");
						this._retrieveAnnotations(repository);
					} else {
						this._itemLoaded = true;
						this.onDocumentLoaded();
					}
				}),

				error: lang.hitch(this, function(err, args) {
					var errorDiv = domConstruct.create("div", {
						innerHTML: "<p>" + err + "</p>"
					});
					domConstruct.place(errorDiv, this.imageContainer, "only");
					this._itemLoaded = true;
					this.onDocumentLoaded();
				})
			});
			
			this.logExit(methodName);
		},

		_retrieveAnnotations: function(repository) {
			var methodName = "_retrieveAnnotations";
			this.logEntry(methodName);
			this._retrieveAnnotationData(repository, false, false, this.annotationContainer, lang.hitch(this, function(data, args) {
				this._retrieveNativeAnnotations(repository);
			}));
			this.logExit(methodName);
		},

		_retrieveNativeAnnotations: function(repository) {
			var methodName = "_retrieveNativeAnnotations";
			this.logEntry(methodName);
			this._retrieveAnnotationData(repository, true, false, this.nativeContainer, lang.hitch(this, function(data, args) {
				if (repository.type == "cm") {
					domStyle.set(this.cmBookmarks, "visibility", "visible");
					this._retrieveBookmarks(repository);
				} else {
					this._itemLoaded = true;
					this.onDocumentLoaded();
				}
			}));
			this.logExit(methodName);
		},

		_retrieveBookmarks: function(repository) {
			var methodName = "_retrieveBookmarks";
			this.logEntry(methodName);
			this._retrieveAnnotationData(repository, false, true, this.bookmarkContainer, lang.hitch(this, function(data, args) {
				this._retrieveCMBookmarks(repository);
			}));
			this.logExit(methodName);
		},

		_retrieveCMBookmarks: function(repository) {
			var methodName = "_retrieveCMBookmarks";
			this.logEntry(methodName);
			this._retrieveAnnotationData(repository, true, true, this.nativeBookmarkContainer, lang.hitch(this, function(data, args) {
				this._itemLoaded = true;
				this.onDocumentLoaded();
			}));
			this.logExit(methodName);
		},

		_retrieveAnnotationData: function(repository, nativeObj, bookmarks, annotationDomNode, loadCallback) {
			this._setLoading(annotationDomNode);

			var requestContent = {
				repositoryId: repository.id,
				repositoryType: repository.type,
				docid: this._item.id,
				vsId: this._item.vsId,
				version: "current",
				template_name: this._item.template,
				cmBookmarks: bookmarks
			};

			if (nativeObj === true) {
				requestContent.alt_output = "native";
			}

			var requestUrlBase = ecm.model.Request.getServiceRequestUrl("plugin", "", {
				"plugin":"SamplePlugin",
				"action":"samplePluginGetAnnotationsService"
			});

			xhr.post({
				url: requestUrlBase,
				handleAs: "json",
				content: requestContent,
				load: lang.hitch(this, function(data, args) {
					if (data) {
						if (data.p8AnnotationXml) {
							var p8Data = data.p8AnnotationXml + "\n\n";
							if (data.p8Annotations) {
								p8Data += JSON.stringify(data.p8Annotations, null, 4);
							}
							var xmp = domConstruct.create("xmp", {
								innerHTML: p8Data,
								style: "font-size: large"
							});
							domConstruct.place(xmp, annotationDomNode, "only");
						} else {
							var xmp = domConstruct.create("xmp", {
								innerHTML: JSON.stringify(data, null, 4),
								style: "font-size: large"
							});
							domConstruct.place(xmp, annotationDomNode, "only");
						}

					} else {
						var errorDiv = domConstruct.create("div", {
							innerHTML: "<p>Null data returned</p>"
						});
						domConstruct.place(errorDiv, annotationDomNode, "only");
					}

					loadCallback(data, args);
				}),
				error: lang.hitch(this, function(err, args) {
					var errorDiv = domConstruct.create("div", {
						innerHTML: "<p>" + err + "</p>"
					});
					domConstruct.place(errorDiv, annotationDomNode, "only");
					this._itemLoaded = true;
					this.onDocumentLoaded();
				})
			});
		},

		_setLoading: function(annotationDomNode, altValue) {
			if (!altValue) {
				altValue = "Loading...";
			}

			var img = domConstruct.create("img", {
				'class': 'loadingPreviewImg',
				alt: altValue,
				title: altValue,
				src: ecm.model.desktop.getServicesUrl() + "/ecm/widget/resources/images/busy_large.gif",
				onerror: function() {
					this.src = ecm.model.desktop.getServicesUrl() + "/ecm/widget/resources/images/spacer.gif";
				}
			});

			domConstruct.place(img, annotationDomNode, "only");
			return img;
		}
	});

	return SampleImageViewer;
});
