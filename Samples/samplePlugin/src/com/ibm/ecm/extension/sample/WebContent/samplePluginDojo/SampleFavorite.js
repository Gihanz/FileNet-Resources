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
	"dojo/_base/array",
	"ecm/model/Favorite",
	"ecm/model/Item"
], function(declare, lang, array, Favorite, Item) {

	/**
	 * @name samplePluginDojo.SampleFavorite
	 * @class Represents a sample favorite item. It overrides the Favorites factory to display a different icon and state for any favorites named "Sample". 
	 * You can do further overrides to completely change what is displayed in the favorites pane.
	 * @augments ecm.model.Favorite
	 */
	var SampleFavorite = declare("samplePluginDojo.SampleFavorite", [
		Favorite
	], {
		/** @lends samplePluginDojo.SampleFavorite.prototype */
		
		/**
		 * Returns a different state icon for locked.
		 */
		getStateClass: function(state) {
			if(state == "locked")
				return "ecmRecordIcon";
			else
				return this.inherited(arguments);
		},

		/**
		 * Returns a record entry template mime type class for this sample favorite.
		 */
		getMimeClass: function() {
			return "ftDeclareRecordEntryTemplate";
		},
		
		/**
		 *	Returns the teamspace context menu for this favorite item.
		 */
		getActionsMenuItemsType: function() {
			return "FavoriteTeamspaceContextMenu";
		}
	});


	/**
	 * In this sample, if the favorite's name is "Sample", this subclass will be created instead of the regular Favorite class.
	 * Return null for the other cases so others can register and create their own subclasses.
	 * 
	 * @param itemJSON
	 * 			  The itemJSON to create this favorite item.
	 */
	SampleFavorite.createFromJSON = function(itemJSON) {
		if(itemJSON){
			if(itemJSON.name == "Sample")
			return new SampleFavorite(itemJSON);
		}
		return null;
	};
	
	/**
	 * Register this SampleFavorite into the factory.
	 */
	if (Favorite.registerFactory) {
		Favorite.registerFactory(SampleFavorite);
	}
	
	return SampleFavorite;
});