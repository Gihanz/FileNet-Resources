<?xml version='1.0' encoding='UTF-8'?>
<!DOCTYPE WorkFlowDefinition SYSTEM "wfdef4.dtd">
<WorkFlowDefinition ApiVersion="4.0"
Origin="JavaAPI"
	Subject="&quot;Loan Processing&quot;"
	Name="Loan Processing - Infrastructure"
	DisableEmailNotification="false"
	MainAttachment="&quot;loan_document&quot;"
	Roster="LoanRoster"
	EventLog="LoanLog"
	AuthorTool="Process Designer"
	OtherAuthorTools=""
	versionAgnostic="false"
	validateUsingSchema="true"
	validateFlag="true"
	transferFlag="true">
	<Field
		Name="customer_name"
		ValueExpr="&quot;&quot;"
		Type="string"
		IsArray="false"
		MergeType="override"/>
	<Field
		Name="interest_rate"
		ValueExpr="0.0"
		Type="float"
		IsArray="false"
		MergeType="override"/>
	<Field
		Name="loan_amount"
		ValueExpr="0.0"
		Type="float"
		IsArray="false"
		MergeType="override"/>
	<Field
		Name="loan_date"
		ValueExpr="systemtime()"
		Type="time"
		IsArray="false"
		MergeType="override"/>
	<Field
		Name="loan_document"
		Description="Loan application"
		ValueExpr="&quot;||0|0||&quot;"
		Type="attachment"
		IsArray="false"
		MergeType="override"/>
	<Field
		Name="status"
		ValueExpr="&quot;&quot;"
		Type="string"
		IsArray="false"
		MergeType="override"/>
	<Map
		Name="Workflow"
		MaxStepId="12" >
		<Step
			StepId="0"
			Name="LaunchStep"
			Description="Enter your loan information and click Launch when you are done."
			XCoordinate="50"
			YCoordinate="50"
			RequestedInterface="Launch HTML (FileNET)"
			JoinType="none"
			SplitType="or"
			CanReassign="true"
			CanViewStatus="true"
			CanViewHistory="false"
			IgnoreInvalidUsers="false">
			<Parameter
				Name="customer_name"
				ValueExpr="customer_name"
				Type="string"
				IsArray="false"
				Mode="inout"/>
			<Parameter
				Name="loan_amount"
				ValueExpr="loan_amount"
				Type="float"
				IsArray="false"
				Mode="inout"/>
			<Parameter
				Name="loan_date"
				ValueExpr="loan_date"
				Type="time"
				IsArray="false"
				Mode="inout"/>
			<Parameter
				Name="loan_document"
				Description="Loan application"
				ValueExpr="loan_document"
				Type="attachment"
				IsArray="false"
				Mode="inout"/>
			<Route
				SourceStepId="0"
				DestinationStepId="3"
				RouteId="0">
				<ModelAttributes>
					<ModelAttribute
						Name="UI_RouteWeight"
						Type="int"
						IsArray="false">
							<Value Val="100"/>
					</ModelAttribute>
				</ModelAttributes>
			</Route>
			<PostAssignments>
			<Assign LVal="F_Subject" RVal="F_Subject + customer_name" />
			</PostAssignments>
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
			Name="Verify Information"
			Description="Verify the customer information and fill in the current interest rate and loan date. Click Complete when you are done."
			XCoordinate="151"
			YCoordinate="51"
			RequestedInterface="Approval HTML (FileNet)"
			QueueName="Inbox"
			JoinType="or"
			SplitType="or"
			CanReassign="true"
			CanViewStatus="true"
			CanViewHistory="false"
			IgnoreInvalidUsers="false">
			<Participant Val="&quot;olivia&quot;" />
			<Parameter
				Name="loan_date"
				ValueExpr="loan_date"
				Type="time"
				IsArray="false"
				Mode="inout"/>
			<Parameter
				Name="loan_amount"
				ValueExpr="loan_amount"
				Type="float"
				IsArray="false"
				Mode="in"/>
			<Parameter
				Name="interest_rate"
				ValueExpr="interest_rate"
				Type="float"
				IsArray="false"
				Mode="inout"/>
			<Parameter
				Name="customer_name"
				ValueExpr="customer_name"
				Type="string"
				IsArray="false"
				Mode="in"/>
			<Parameter
				Name="loan_document"
				Description="Loan application"
				ValueExpr="loan_document"
				Type="attachment"
				IsArray="false"
				Mode="in"/>
			<Route
				SourceStepId="3"
				DestinationStepId="5"
				RouteId="1">
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
						<Value Val="2"/>
				</ModelAttribute>
			</ModelAttributes>
		</Step>
		<Step
			StepId="5"
			Name="Process Loan"
			Description="Verify that all loan information is provided and accurate. Click Complete when you are done."
			XCoordinate="255"
			YCoordinate="52"
			RequestedInterface="Approval HTML (FileNet)"
			QueueName="LoanProcessor"
			JoinType="or"
			SplitType="or"
			CanReassign="false"
			CanViewStatus="false"
			CanViewHistory="false"
			IgnoreInvalidUsers="false">
			<Parameter
				Name="loan_date"
				ValueExpr="loan_date"
				Type="time"
				IsArray="false"
				Mode="in"/>
			<Parameter
				Name="loan_amount"
				ValueExpr="loan_amount"
				Type="float"
				IsArray="false"
				Mode="in"/>
			<Parameter
				Name="interest_rate"
				ValueExpr="interest_rate"
				Type="float"
				IsArray="false"
				Mode="in"/>
			<Parameter
				Name="customer_name"
				ValueExpr="customer_name"
				Type="string"
				IsArray="false"
				Mode="in"/>
			<Parameter
				Name="loan_document"
				Description="Loan application"
				ValueExpr="loan_document"
				Type="attachment"
				IsArray="false"
				Mode="in"/>
			<Route
				SourceStepId="5"
				DestinationStepId="7"
				RouteId="2">
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
						<Value Val="2"/>
				</ModelAttribute>
			</ModelAttributes>
		</Step>
		<Step
			StepId="7"
			Name="Complete Loan"
			Description="Review information and complete loan processing."
			Documentation="This step completes the loan application process."
			XCoordinate="365"
			YCoordinate="52"
			RequestedInterface="Approval HTML (FileNet)"
			QueueName="LoanUnderwriter"
			JoinType="or"
			SplitType="or"
			CanReassign="true"
			CanViewStatus="true"
			CanViewHistory="true"
			IgnoreInvalidUsers="false">
			<Parameter
				Name="customer_name"
				ValueExpr="customer_name"
				Type="string"
				IsArray="false"
				Mode="in"/>
			<Parameter
				Name="loan_amount"
				ValueExpr="loan_amount"
				Type="float"
				IsArray="false"
				Mode="in"/>
			<Parameter
				Name="loan_document"
				Description="Loan application"
				ValueExpr="loan_document"
				Type="attachment"
				IsArray="false"
				Mode="in"/>
			<Route
				SourceStepId="7"
				DestinationStepId="9"
				RouteId="3"/>
			<ModelAttributes>
				<ModelAttribute
					Name="UI_StepType"
					Type="int"
					IsArray="false">
						<Value Val="2"/>
				</ModelAttribute>
			</ModelAttributes>
		</Step>
		<CompoundStep
			StepId="9"
			Name="Assign Values"
			XCoordinate="320"
			YCoordinate="149"
			JoinType="or"
			SplitType="or">
			<Instruction
				Id="10"
				Action="assign">
				<Expression Val="status" />
				<Expression Val="&quot;Loan processing for &quot; + customer_name + &quot; is completed.&quot;" />
				<Expression Val="F_Subject" />
				<Expression Val="status" />
			</Instruction>
			<Route
				SourceStepId="9"
				DestinationStepId="12"
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
					Name="UI_IconName"
					Type="string"
					IsArray="false">
						<Value Val="filenet/vw/toolkit/utils/images/assign_step"/>
				</ModelAttribute>
				<ModelAttribute
					Name="UI_StepType"
					Type="int"
					IsArray="false">
						<Value Val="6"/>
				</ModelAttribute>
				<ModelAttribute
					Name="UI_StartIconName"
					Type="string"
					IsArray="false">
						<Value Val="filenet/vw/toolkit/utils/images/start_assign_step"/>
				</ModelAttribute>
				<ModelAttribute
					Name="UI_StepPropertiesPanelClass"
					Type="string"
					IsArray="false">
						<Value Val="filenet.vw.toolkit.design.property.steps.systeminstructions.VWAssignPropertiesPanel"/>
				</ModelAttribute>
			</ModelAttributes>
		</CompoundStep>
		<Step
			StepId="12"
			Name="Get Status"
			Description="This is your loan status. If you have questions, call customer service."
			XCoordinate="429"
			YCoordinate="148"
			RequestedInterface="Approval HTML (FileNet)"
			QueueName="LoanCustomer"
			JoinType="or"
			SplitType="or"
			CanReassign="false"
			CanViewStatus="false"
			CanViewHistory="false"
			IgnoreInvalidUsers="false">
			<Parameter
				Name="customer_name"
				ValueExpr="customer_name"
				Type="string"
				IsArray="false"
				Mode="in"/>
			<Parameter
				Name="interest_rate"
				ValueExpr="interest_rate"
				Type="float"
				IsArray="false"
				Mode="in"/>
			<Parameter
				Name="loan_amount"
				ValueExpr="loan_amount"
				Type="float"
				IsArray="false"
				Mode="in"/>
			<Parameter
				Name="status"
				ValueExpr="status"
				Type="string"
				IsArray="false"
				Mode="in"/>
			<ModelAttributes>
				<ModelAttribute
					Name="UI_StepType"
					Type="int"
					IsArray="false">
						<Value Val="2"/>
				</ModelAttribute>
			</ModelAttributes>
		</Step>
		<TextAnnotation
			Id="1"
			Name="Complete Loan Note"
			Message="Send loan status to customer."
			XCoordinate="399"
			YCoordinate="142"
			Width="128"
			Height="64"
			colorRed="255"
			colorGreen="214"
			colorBlue="80"
 >
			<Association
				TargetId="7"
				TargetType="mapnode"
/>
		</TextAnnotation>
		<TextAnnotation
			Id="2"
			Message="This step can be automated in the future."
			XCoordinate="83"
			YCoordinate="148"
			Width="128"
			Height="64"
			colorRed="162"
			colorGreen="222"
			colorBlue="249"
 >
			<Association
				TargetId="3"
				TargetType="mapnode"
/>
		</TextAnnotation>
	</Map>
</WorkFlowDefinition>
