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

define( ["dojo/_base/declare",
         "ecm/widget/ItemPropertiesPaneExtension", 
         "ecm/widget/CommonPropertiesPane"],
	function(declare, ItemPropertiesPaneExtension, CommonPropertiesPane) {

	/**
	 * @name samplePluginDojo.SampleItemPropertiesPaneExtension
	 * @class Demonstrates how to extend the item properties pane, used in the property editor, to add a custom section.
	 * @augments ecm.widget.ItemPropertiesPaneExtension
	 */
	return declare("samplePluginDojo.SampleItemPropertiesPaneExtension", [ ItemPropertiesPaneExtension ], {
		/** @lends samplePluginDojo.SampleItemPropertiesPaneExtension.prototype */

		postCreate: function() {
			this.inherited(arguments);
			this.set("title", "Sample Plugin Custom Properties");
			this._commonProperties = new CommonPropertiesPane();
			this.addChild(this._commonProperties);
		},

		isEnabledFor: function(item) {
			return true;
		},
	
		getPropertiesTitle: function() {
			return "Sample Properties";
		},
		
		setItem: function(item) {
			this.item = item;
		}
	});
});