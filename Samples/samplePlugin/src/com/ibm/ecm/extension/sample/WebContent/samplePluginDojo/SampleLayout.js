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
		"ecm/model/Desktop",
		"ecm/model/Feature",
		"ecm/widget/layout/NavigatorMainLayout"
	],
	function(declare, Desktop, Feature, NavigatorMainLayout) {

	/**
	 * @name samplePluginDojo.SampleLayout
	 * @class A sample layout provided by the sample plugin.  This sample overrides the favorites feature of the Content Navigator's layout, providing a custom favorites.
	 * @augments ecm.widget.layout.NavigatorMainLayout
	 */
	return declare("samplePluginDojo.SampleLayout", [ NavigatorMainLayout ], {
	/** @lends samplePluginDojo.SampleLayout.prototype */

		/**
		 * Returns an array of identifiers of the features supported by this layout.
		 */
		getAvailableFeatures: function() {
			return [
				new Feature({
					id: "myfavorites",
					name: "Custom Favorites",
					separator: false,
					iconUrl: "favoritesLaunchIcon",
					featureClass: "ecm.widget.layout.FavoritesPane",
					popupWindowClass: null,
					featureTooltip: this.messages.launchbar_favorites,
					popupWindowTooltip: null,
					preLoad: false
				}),
				new Feature({
					id: "browsePane",
					name: Desktop.getConfiguredLabelsvalue("browse"),
					separator: false,
					iconUrl: "browseLaunchIcon",
					featureClass: "ecm.widget.layout.BrowsePane",
					popupWindowClass: "ecm.widget.layout.BrowseFlyoutPane",
					featureTooltip: this.messages.launchbar_browse,
					popupWindowTooltip: this.messages.launchbar_browse_popup,
					preLoad: false
				}),
				new Feature({
					id: "searchPane",
					name: Desktop.getConfiguredLabelsvalue("search"),
					separator: false,
					iconUrl: "searchLaunchIcon",
					featureClass: "ecm.widget.layout.SearchPane",
					popupWindowClass: "ecm.widget.layout.SearchFlyoutPane",
					featureTooltip: this.messages.launchbar_search,
					popupWindowTooltip: this.messages.launchbar_search_popup,
					preLoad: false
				}),
				new Feature({
					id: "manageTeamspaces",
					name: Desktop.getConfiguredLabelsvalue("workspaces"),
					separator: false,
					iconUrl: "teamspacesLaunchIcon",
					featureClass: "ecm.widget.layout.ManageTeamspacesPane",
					popupWindowClass: "ecm.widget.layout.TeamspaceFlyoutPane",
					featureTooltip: this.messages.launchbar_teamspaces,
					popupWindowTooltip: this.messages.launchbar_teamspaces_popup,
					preLoad: false
				}),
				new Feature({
					id: "workPane",
					name: Desktop.getConfiguredLabelsvalue("work"),
					separator: false,
					iconUrl: "workLaunchIcon",
					featureClass: "ecm.widget.layout.WorkPane",
					popupWindowClass: "ecm.widget.layout.WorkFlyoutPane",
					featureTooltip: this.messages.launchbar_work,
					popupWindowTooltip: this.messages.launchbar_work_popup,
					preLoad: false
				})
			];
		}
	});
});
