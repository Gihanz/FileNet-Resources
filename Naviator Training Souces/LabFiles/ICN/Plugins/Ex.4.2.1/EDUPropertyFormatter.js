define([
	"dojo/_base/declare", 
	"dojo/currency",
	"dijit/_TemplatedMixin",  
	"dijit/_Widget"
],
function(declare, currency, _TemplatedMixin, _Widget) { 
	/**
	 * @name samplePlugin.SamplePropertyFormatter
	 * @class Provides a sample widget customization for the property grids used to display property values. The
	 * extension looks for email addresses and enables them as "mailto" links.
	 * @augments _Widget, _TemplatedMixin
	 */
	return declare("eDUPluginDojo.EDUPropertyFormatter", [
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
			if (this.data) {
				this.domNode.innerHTML = currency.format(this.data.price);
			} else {
				this.domNode.innerHTML = "";
			}
		}
	});
});