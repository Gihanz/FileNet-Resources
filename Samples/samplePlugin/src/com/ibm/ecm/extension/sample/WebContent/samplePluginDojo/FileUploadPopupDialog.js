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
	"ecm/model/Request",
	"ecm/widget/dialog/BaseDialog",
	"dojo/text!./templates/FileUploadPopupDialog.html"
	],
	function (declare, lang, Request, BaseDialog, template) {
	
	/**
	 * @name samplePluginDojo.FileUploadPopupDialog
	 * @class
	 * @augments ecm.widget.dialog.BaseDialog
	 */
	return declare("samplePluginDojo.FileUploadPopupDialog", [ BaseDialog ], {
	/** @lends samplePluginDojo.FileUploadPopupDialog.prototype */

		//needed to load from template
		contentString: template,
		widgetsInTemplate: true,
		
		//limit uploads to 1MB
		_maxFileSize: 1048576,
		
		_items: null,
		_repository: null,
		
		postCreate: function() {
			this.inherited(arguments);
			this.setResizable(true);
			this.setMaximized(false);
			this.setTitle("Custom Upload");
			this.setIntroText("Choose a file with which to replace the existing document content.");
			this._addButton = this.addButton("Add", "onAdd", true, true);
		},
		
		show: function(repository, items) {
			this._items = items;
			this._repository = repository;
			this._addButton.set("disabled",true);
			this.inherited("show", []);
		},
			
		isValid: function() {
			var valid = this._fileInput;
			// This test works for both HTML5 and non-HTML5 browsers. 
			valid = valid && (this._fileInput.value) && (this._fileInput.value.length > 0);
			return valid;
		},
		
		onFileInputChange: function() {
			this._addButton.set("disabled",(this.isValid() ? false : true));
		},
		
		onAdd: function() {
			var item = this._items[0];
			
			var reqParams = {
				desktop: ecm.model.desktop.id,
				serverType: this._repository.type,
				repositoryId: this._repository.id,
				docid: item.id,
				doc_name_attribute: item.getContentClass().nameAttribute,
				template_name: item.getContentClass().id,
			};

			var callback = lang.hitch(this, this._onAddCompleted);
			
			// HTML5 browser
			if (this._fileInput.files) {
				var file = this._fileInput.files[0];
				reqParams.mimetype = file.type;
				reqParams.parm_part_filename = (file.fileName ? file.fileName : file.name)

				var form = new FormData();
				form.append("file", file);
				
				Request.postFormToPluginService("SamplePlugin", "samplePluginFileUploadService", form, {
					requestParams: reqParams,
					requestCompleteCallback: callback
				});	
			} else { // Non-HTML5 browser
				var fileName = this._fileInput.value;
				if (fileName && fileName.length > 0) {
					var i = fileName.lastIndexOf("\\");
					if (i != -1) {
						fileName = fileName.substr(i + 1);
					}
				}
				reqParams.parm_part_filename = fileName;
				
				// MIME type is not available, must be determined at the server.

				reqParams.plugin = "SamplePlugin";
				reqParams.action = "samplePluginFileUploadService";
				
				Request.ieFileUploadServiceAPI("plugin", "", {requestParams: reqParams, 
					requestCompleteCallback: callback
				}, this._fileInputForm);
			}
		},
		
		_onAddCompleted: function(response) {
			if (response.fieldErrors) {
				console.dir(response.fieldErrors);
			} else if (this._items && this._items.length > 0 && response && response.mimetype) {
				lang.mixin(this._items[0], response);
				this._items[0].refresh();
			}
			this.hide();
		}
	});
});