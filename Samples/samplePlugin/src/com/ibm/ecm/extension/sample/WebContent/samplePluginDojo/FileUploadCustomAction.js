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

define(["dojo/_base/declare", "ecm/model/Action"],
	function(declare, Action) {

	/**
	 * @name samplePluginDojo.FileUploadCustomAction
	 * @class Describes a user-executable action. Used to override the standard code for enabling/disabling
	 * menu actions.
	 * @augments ecm.model.Action
	 */
	return declare("samplePluginDojo.FileUploadCustomAction", [ Action ], {
	/** @lends samplePluginDojo.FileUploadCustomAction.prototype */
	
		/**
		 * Returns true if this action should be enabled for the given repository, list type, and items.
		 */
		isEnabled: function(repository, listType, items, teamspace, resultSet) {
			var enabled = this.inherited(arguments);
			if (items[0].hasContent) {
				enabled &= items[0].hasContent();
			} else {
				enabled = false;
			}
			return enabled;
		},
	
		/**
		 * Returns true if this action should be visible for the given repository and list type.
		 */
		isVisible: function(repository, listType) {
			return this.inherited(arguments);
		}
	});
});