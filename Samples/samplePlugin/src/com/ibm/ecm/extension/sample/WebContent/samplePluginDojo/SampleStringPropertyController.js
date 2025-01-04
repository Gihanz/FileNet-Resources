/*
 * Licensed Materials - Property of IBM (c) Copyright IBM Corp. 2014  All Rights Reserved.
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
	"pvr/controller/_PropertyController",
	"pvr/controller/types/mixins/_StringPropertyControllerMixin",
	"pvr/controller/attributes/Attribute",
	"pvr/controller/converters/StringConverter",
	"samplePluginDojo/SampleObjectConverter"
], function(declare, _PropertyController, _StringPropertyControllerMixin, Attribute, StringConverter, SampleObjectConverter) {

	/**
	 * @name samplePluginDojo.SampleStringPropertyController
	 * @class Extends {@link pvr.controller._PropertyController} for properties of type "string".
	 * @augments pvr.controller._PropertyController, pvr.controller.types.mixins._StringPropertyControllerMixin
	 */
	return declare("samplePluginDojo.SampleStringPropertyController", [
		_PropertyController,
		_StringPropertyControllerMixin
	], {
	/** @lends samplePluginDojo.SampleStringPropertyController.prototype */

		/**
		 * Overloaded to include the repositoryId attribute.
		 */
		createTypeMixinAttributes: function() {
			this.inherited(arguments);
			// Add a couple new attributes that are part of the ICN model layer but are not currently 
			// passed through to the property layout editors 
			this.addAttribute(new Attribute({
				controller: this,
				name: "repositoryType",
				defaultValue: "",
				valueDependsOn: true,
				errorDependsOn: true,
				converter: StringConverter.Default
			}));
			this.addAttribute(new Attribute({
				controller: this,
				name: "repository",
				defaultValue: null,
				valueDependsOn: true,
				errorDependsOn: true,
				converter: SampleObjectConverter.Default
			}));
		}
	});

});
