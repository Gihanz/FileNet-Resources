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

package com.ibm.ecm.extension.sample;

import java.util.Locale;

import com.ibm.ecm.extension.PluginFeature;

public class SamplePluginFeature extends PluginFeature {

	@Override
	public String getId() {
		return "sampleFeature";
	}

	@Override
	public String getName(Locale locale) {
		return "Sample Feature";
	}

	@Override
	public String getDescription(Locale locale) {
		return "This is a sample feature, provided by the sample plugin";
	}

	@Override
	public String getIconUrl() {
		return "sampleFeatureLaunchIcon";
	}
	
	@Override
	public String getSvgFilePath() {
		return "WebContent/images/samplePlugin.svg";
	}

	@Override
	public String getFeatureIconTooltipText(Locale locale) {
		return null;
	}

	@Override
	public String getPopupWindowTooltipText(Locale locale) {
		return null;
	}

	@Override
	public String getContentClass() {
		return "samplePluginDojo.SampleFeaturePane";
	}

	@Override
	public String getPopupWindowClass() {
		return null;
	}

	@Override
	public boolean isPreLoad() {
		return false;
	}

	@Override
	public String getHelpContext() {
		return "/sample.project.help.context/";
	}
	
	@Override
	public String getConfigurationDijitClass() {
		return "samplePluginDojo.FeatureConfigurationPane";
	}
}
