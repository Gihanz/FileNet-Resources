<?xml version='1.0' encoding='UTF-8'?>
<!DOCTYPE WorkFlowDefinition SYSTEM "wfdef4.dtd">
<WorkFlowDefinition ApiVersion="4.0"
Origin="JavaAPI"
	Subject="&quot;Verify that the workflow is launched&quot;"
	Name="Sample workflow"
	DisableEmailNotification="false"
	AuthorTool="Process Designer"
	OtherAuthorTools=""
	versionAgnostic="false"
	validateUsingSchema="true"
	validateFlag="true"
	transferFlag="true">
	<Field
		Name="userName"
		ValueExpr="&quot;&quot;"
		Type="string"
		IsArray="false"
		MergeType="override"/>
	<Field
		Name="F_Trackers"
		ValueExpr="{&quot;burt&quot;,&quot;P8Admin&quot;,&quot;sydney&quot;,&quot;sylvia&quot;}"
		Type="participant"
		IsArray="true"
		MergeType="default"/>
	<Map
		Name="Workflow"
		MaxStepId="3" >
		<Step
			StepId="0"
			Name="LaunchStep"
			XCoordinate="50"
			YCoordinate="50"
			RequestedInterface="Navigator Launch Processor (default)"
			JoinType="none"
			SplitType="or"
			CanReassign="true"
			CanViewStatus="true"
			CanViewHistory="false"
			IgnoreInvalidUsers="false">
			<Parameter
				Name="F_Trackers"
				ValueExpr="F_Trackers"
				Type="participant"
				IsArray="true"
				Mode="inout"/>
			<Parameter
				Name="userName"
				ValueExpr="userName"
				Type="string"
				IsArray="false"
				Mode="inout"/>
			<Route
				SourceStepId="0"
				DestinationStepId="3"
				RouteId="4">
				<ModelAttributes>
					<ModelAttribute
						Name="UI_RouteWeight"
						Type="int"
						IsArray="false">
							<Value Val="100"/>
					</ModelAttribute>
				</ModelAttributes>
			</Route>
			<ModelAttributes>
				<ModelAttribute
					Name="UI_StepType"
					Type="int"
					IsArray="false">
						<Value Val="1"/>
				</ModelAttribute>
			</ModelAttributes>
		</Step>
		<Step
			StepId="3"
			Name="Verification step"
			XCoordinate="133"
			YCoordinate="50"
			RequestedInterface="Navigator Step Processor (default)"
			QueueName="SalesOfficer"
			JoinType="or"
			SplitType="or"
			CanReassign="true"
			CanViewStatus="true"
			CanViewHistory="false"
			IgnoreInvalidUsers="false">
			<Parameter
				Name="userName"
				ValueExpr="userName"
				Type="string"
				IsArray="false"
				Mode="inout"/>
			<ModelAttributes>
				<ModelAttribute
					Name="UI_StepType"
					Type="int"
					IsArray="false">
						<Value Val="2"/>
				</ModelAttribute>
			</ModelAttributes>
		</Step>
	</Map>
</WorkFlowDefinition>
