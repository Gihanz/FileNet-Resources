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
	"ecm/model/FavoritesResultSet",
	"ecm/model/Item"
], function(declare, lang, array, FavoritesResultSet, Item) {

	/**
	 * @name samplePluginDojo.SampleFavoritesResultSet
	 * @class Represents a sample favorites result set to return a different toolbar and context menu.
	 * @augments ecm.model.FavoritesResultSet
	 */
	var SampleFavoritesResultSet = declare("samplePluginDojo.SampleFavoritesResultSet", [
		FavoritesResultSet
	], {
		/** @lends samplePluginDojo.SampleFavoritesResultSet.prototype */
		
		/**
		 * Returns the content list toolbar instead.
		 */
		getToolbarDef: function() {
			return "ContentListToolbar";
		},
	});


	/**
	 * In this sample, if first item in this favorites result set is called "Sample", return a different context menu and toolbar.
	 * 
	 * @param itemJSON
	 * 			  The itemJSON to create this favorite item.
	 */
	SampleFavoritesResultSet.createFromJSON = function(itemJSON) {
		if(itemJSON && itemJSON.items){
			for(var i in itemJSON.items){
				if(itemJSON.items[i].name == "Sample")
					return new SampleFavoritesResultSet(itemJSON);
			}
		}
		return null;
	};
	
	/**
	 * Register this SampleFavoritesResultSet into the factory.
	 */
	if (FavoritesResultSet.registerFactory) {
		FavoritesResultSet.registerFactory(SampleFavoritesResultSet);
	}
	
	return SampleFavoritesResultSet;
});