/*
 * Licensed Materials - Property of IBM (c) Copyright IBM Corp. 2012, 2013 All Rights Reserved.
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
	"dijit/_Widget"
],
function(declare, _TemplatedMixin, _Widget) { 
	/**
	 * @name samplePlugin.SamplePropertyFormatter
	 * @class Provides a sample widget customization for the property grids used to display property values. The
	 * extension looks for email addresses and enables them as "mailto" links.
	 * @augments _Widget, _TemplatedMixin
	 */
	return declare("samplePlugin.SamplePropertyFormatter", [
		_Widget,
		_TemplatedMixin
	], {
		/** @lends samplePlugin.SamplePropertyFormatter.prototype */

		templateString: "<div></div>",
		
		/**
		 * The {@link ecm.model.ContentItem} object being rendered.
		 */
		item: null,
		
		/**
		 * Name of the property being displayed.
		 */
		propertyName: null,
		
		/**
		 * String value being rendered in the property grid.
		 */
		data: null,
		
		postCreate: function() {
			if (this.data && this.data.indexOf("@") > 0) {
				this.domNode.innerHTML = "<a href=\"mailto:" + data + "\">" + data + "</a>";
			} else {
				this.domNode.innerHTML = this.data;
			}
		}
	});
});