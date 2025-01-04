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
		"dijit/_TemplatedMixin",
		"dijit/_WidgetsInTemplateMixin",
		"ecm/model/Desktop",
		"dojo/store/Memory",
		"ecm/widget/admin/PluginConfigurationPane",
		"dojo/text!./templates/FeatureConfigurationPane.html",
		"ecm/widget/ValidationTextBox",
		"ecm/widget/FilteringSelect",
		"ecm/widget/HoverHelp",
		"dijit/form/Textarea"
	],
	function(declare, _TemplatedMixin, _WidgetsInTemplateMixin, Desktop, MemoryStore, PluginConfigurationPane, template) {

		/**
		 * @name samplePluginDojo.FeatureConfigurationPane
		 * @class Provides a configuration panel for the sample plugin's feature.  This panel appears in each desktop's layout tab in the IBM Content Navigator administration 
		 * tool for configuration specific to this feature.
		 * 
		 * @augments ecm.widget.admin.PluginConfigurationPane
		 */
		return declare("samplePluginDojo.FeatureConfigurationPane", [ PluginConfigurationPane, _TemplatedMixin, _WidgetsInTemplateMixin], {
		/** @lends samplePluginDojo.ConfigurationPane.prototype */

		templateString: template,
		widgetsInTemplate: true,
	
		/**
		 * Initially load all the values from the configurationString onto the various fields.
		 */
		load: function(callback) {
			//initialize fields
			if (this.configurationString) {
				//evaluate the string to form valid json
				this.jsonConfig = eval('(' + this.configurationString + ')');
				
				//set the first field based on the configuration values
				if(this.jsonConfig.configuration[0])
					this.param1Field.set("value", this.jsonConfig.configuration[0].value);
				
				//set the second field based on the configuration values
				if(this.jsonConfig.configuration[1])
					this.param2Field.set("value", this.jsonConfig.configuration[1].value);
			}
		},
		
		/**
		 * Saves all the values from fields onto the configuration string which will be stored into the admin's configuration.
		 */
		save: function(){
			var configArray = [];
			var configString = {  
				name: "param1Field",
				value: this.param1Field.get("value")
			}; 
			configArray.push(configString);
			
			configString = {  
					name: "param2Field",
					value: this.param2Field.get("value")
				}; 
				configArray.push(configString);
			
			var configJson = {
				"configuration" : configArray
			};
						
			this.configurationString = JSON.stringify(configJson);
		},
		
		_onParamChange: function() {
			this.onSaveNeeded(true);
		},
		
		/**
		 * Validates this feature configuration pane.
		 */
		validate: function() {
			if(!this.param1Field.isValid() || !this.param2Field.get("value"))
				return false;
			return true;
		}
	});
});
