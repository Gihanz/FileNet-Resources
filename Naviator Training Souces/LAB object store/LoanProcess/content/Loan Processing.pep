<?xml version='1.0' encoding='UTF-8'?>
<!DOCTYPE WorkFlowDefinition SYSTEM "wfdef4.dtd">
<WorkFlowDefinition ApiVersion="4.0"
Origin="JavaAPI"
	Subject="&quot;Loan Processing&quot;"
	Name="Loan Processing"
	DisableEmailNotification="false"
	MainAttachment="&quot;loan_document&quot;"
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
	<Map
		Name="Workflow"
		MaxStepId="5" >
		<Step
			StepId="0"
			Name="LaunchStep"
			Description="Enter your loan information and click Launch when you are done."
			XCoordinate="50"
			YCoordinate="50"
			RequestedInterface="Approval Launch HTML (FileNet)"
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
			CanReassign="true"
			CanViewStatus="true"
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
