package com.ibm.ecm.extension.samplefilter;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.servlet.http.HttpServletRequest;
import javax.sql.DataSource;

import com.ibm.ecm.extension.PluginResponseFilter;
import com.ibm.ecm.extension.PluginServiceCallbacks;
import com.ibm.json.java.JSONArray;
import com.ibm.json.java.JSONObject;

public class SamplePluginResponseFilter extends PluginResponseFilter
{
	public void filter(String serverType, PluginServiceCallbacks callbacks, HttpServletRequest request, JSONObject jsonResponse)
			throws Exception
			{
		String username = null;
		Connection con = null;
		String stepName = null;
		String valueOfBarcnchCode = null;
		CallableStatement callableStatement = null;
		String officerLimit = null;
		String facilityAmount = null;
		System.out.println("***************SamplePluginResponseFilter class************************");
		try
		{				//Added code for ReadOnly Mode
			JSONArray array = (JSONArray) jsonResponse.get("criterias");
			System.out.println("::::::::::::::::::::::array:::::::::::"+array.size());
			for(int index = 0; index<array.size();index++)
			{
				JSONObject criteriaObject  = (JSONObject)array.get(index);
				String filterCriteria = criteriaObject.get("name").toString();
				System.out.println(" filterCriteria :: "+filterCriteria);
				if(filterCriteria.equalsIgnoreCase("BranchCode"))
				{
					System.out.println("valuevalue :: "+filterCriteria);
					callbacks.getUserId();
					Context ctx = new InitialContext();
					DataSource ds = (DataSource) ctx.lookup("cfds");
					con = ds.getConnection();
					//System.out.println(con.getClientInfo().toString());
					/*					callableStatement = con.prepareCall("Select BracnchCode from CF_BRANCH_INFO where username ="+username+" ");
					callableStatement.executeUpdate();
					 */	
					Statement stmt = con.createStatement();
					//select BRNCODE from corpdata.officer where usrid='adit' 
					//ResultSet resultSet = stmt.executeQuery("Select BRANCHCODE from CF_BRANCH_INFO where " + "CF_BRANCH_INFO" + ".USERNAME='" + callbacks.getUserId() + "' ");
					ResultSet resultSet = stmt.executeQuery("select BRNCODE from officer where " + "officer" + ".usrid='" + callbacks.getUserId() + "' ");
					//System.out.println("resultset  "+request.getSession());
					while(resultSet.next())
					{
						System.out.println("::  "+resultSet.getString("BRNCODE"));
//						System.out.println("::  "+resultSet.getString("BranchCode"));
						//valueOfBarcnchCode = resultSet.getString("BranchCode");
						valueOfBarcnchCode = resultSet.getString("BRNCODE"); //BranchCode
					}

					criteriaObject.put("value", valueOfBarcnchCode);
					criteriaObject.put("displayMode", "readonly");
				}
				
				
				
			}
			System.out.println("json response in SamplePluginResponseFilter is:==============" + jsonResponse.toString());
			stepName = jsonResponse.get("step_name").toString();
			//String wobNUm = jsonResponse.get("wobNum").toString();
			JSONArray jsonProperties = (JSONArray)jsonResponse.get("criterias");
			//System.out.println("test for step name :: " + stepName+ wobNUm);
			//System.out.println("TEST for order ::: " + jsonProperties);
			updateJSONPropertiesOrder(jsonProperties,stepName);
			//System.out.println(jsonResponse);
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}finally
		{
			username = null;
			con = null;
			stepName = null;

		}
			}
	/*  InitialPayments   */ 
	public void updateJSONPropertiesOrder(JSONArray jsonProperties,String stepName)
			throws Exception
			{
		JSONObject propObject = new JSONObject();
		int index = 0;
		System.out.println("STEP NAME :: "+stepName);
		/*
step name why date  ClientVerification ClientGurantorChanges

		 */
		if(stepName.equalsIgnoreCase("ClientGurantorVerification") || stepName.equalsIgnoreCase("ClientGurantorChanges"))
		 {


			 String[] initalPaymentsOrder = 
				 {
					 "ClientID",
					 "ClientName",
					 "ClientAddress", 
					 "ClientDateOfBirth",
					 "ClientDOBAsPerID",
					 "FirstGuarantorID",
					 "FirstGuarantorName",
					 "FirstGuarantorAddress", 
					 "FirstGuarantorDateOfBirth",
					 "FirstGuarantorDOBAsPerID",
					 "SecondGuarantorID",
					 "SecondGuarantorName",
					 "SecondGuarantorAddress", 
					 "SecondGuarantorDateOfBirth",
					"SecondGuarantorDOBAsPerID",
					 "ThirdGuarantorID",
					 "ThirdGuarantorName",
					 "ThirdGuarantorAddress", 
					 "ThirdGuarantorDateOfBirth",
					 "ThirdGuarantorDOBAsPerID",
					 "CaseID"
				 };
			 for (int j = 0; j < jsonProperties.size(); ++j) {
				 propObject.put(((JSONObject)jsonProperties.get(j)).get("name").toString(), (JSONObject)jsonProperties.get(j));
			 }
			 for (int i = 0; i < initalPaymentsOrder.length; ++i) {
				 JSONObject jsonEDSProperty = (JSONObject)propObject.get(initalPaymentsOrder[i]);
				 int x = jsonProperties.indexOf(jsonEDSProperty);
				 if (x == -1)
					 continue;
				 jsonProperties.add(index, jsonEDSProperty);

				 if (x > index)
					 jsonProperties.remove(x + 1);
				 else {
					 jsonProperties.remove(x);
				 }
				 ++index;
			 }

			 			 System.out.println(jsonProperties);


		 
		 }
		//added for insurance
		//DeliveryOrder
		
		if(stepName.equalsIgnoreCase("DeliveryOrder"))
		{



			 String[] initalPaymentsOrder = 
				 {
					
					 "SupplierIdorRegNo",
					 "SupplierName",
					 "SupplierAddress",
					 "ClientID",
					 "ClientName",
					 "ClientAddress",
					 "FacilityNumber",
					 "TotalInitialCharge",
					 "AmountPaid",
					 "Proceed",
					 "CaseID"
				 };
			 for (int j = 0; j < jsonProperties.size(); ++j) {
				 propObject.put(((JSONObject)jsonProperties.get(j)).get("name").toString(), (JSONObject)jsonProperties.get(j));
			 }
			 for (int i = 0; i < initalPaymentsOrder.length; ++i) {
				 JSONObject jsonEDSProperty = (JSONObject)propObject.get(initalPaymentsOrder[i]);
				 int x = jsonProperties.indexOf(jsonEDSProperty);
				 if (x == -1)
					 continue;
				 jsonProperties.add(index, jsonEDSProperty);

				 if (x > index)
					 jsonProperties.remove(x + 1);
				 else {
					 jsonProperties.remove(x);
				 }
				 ++index;
			 }

			 			 System.out.println(jsonProperties);


		 
		 
		
		
		}
		if(stepName.equalsIgnoreCase("Insurance"))
		{



			 String[] initalPaymentsOrder = 
				 {
					"FacilityNumber",
					"FacilityAmount",
					 "ClientID",
					 "ClientName",
					 "ClientAddress", 
					 "CaseID"
				 };
			 for (int j = 0; j < jsonProperties.size(); ++j) {
				 propObject.put(((JSONObject)jsonProperties.get(j)).get("name").toString(), (JSONObject)jsonProperties.get(j));
			 }
			 for (int i = 0; i < initalPaymentsOrder.length; ++i) {
				 JSONObject jsonEDSProperty = (JSONObject)propObject.get(initalPaymentsOrder[i]);
				 int x = jsonProperties.indexOf(jsonEDSProperty);
				 if (x == -1)
					 continue;
				 jsonProperties.add(index, jsonEDSProperty);

				 if (x > index)
					 jsonProperties.remove(x + 1);
				 else {
					 jsonProperties.remove(x);
				 }
				 ++index;
			 }

			 			 System.out.println(jsonProperties);


		 
		 
		}
		if(stepName.equalsIgnoreCase("InitialPayments"))
		 {

			 String[] initalPaymentsOrder = 
				 {
					 "ServiceCharges",
					 "VoucherDiscount",
					 "TransportCharges",
					 "VatOnServiceOrTRCharges",
					 "RMVCharges",
					 "ValuationFee",
					 "CribCharges",
					 "StampDuty",
					 "OtherCharges",
					 "PrePaidRentals",
					 "VATOnPrePaidRentals",
					 "CurrentMonthRental",
					 "VATOnCurrentMonthRental",
					 "SavingsDeposit",
					 "SettlemetOfContract",
					 "Total",
					 "ServiceChargesDeductable",
					 "VoucherDiscountDeductable",
					 "TransportChargesDeductable",
					 "VatOnServiceOrTRChargesDeductable",
					 "RMVChargesDeductable",
					 "ValuationFeeDeductable",
					 "CribChargesDeductable",
					 "StampDutyDeductable",
					 "OtherChargesDeductable",
					 "PrePaidRentalsDeductable",
					 "VATOnPrePaidRentalsDeductable",
					 "CurrentMonthRentalDeductable",
					 "VATOnCurrentMonthRentalDeductable",
					 "SavingsDepositDeductable",
					 "SettlemetOfContractDeductable"
				 };
			 for (int j = 0; j < jsonProperties.size(); ++j) {
				 propObject.put(((JSONObject)jsonProperties.get(j)).get("name").toString(), (JSONObject)jsonProperties.get(j));
			 }
			 for (int i = 0; i < initalPaymentsOrder.length; ++i) {
				 JSONObject jsonEDSProperty = (JSONObject)propObject.get(initalPaymentsOrder[i]);
				 int x = jsonProperties.indexOf(jsonEDSProperty);
				 if (x == -1)
					 continue;
				 jsonProperties.add(index, jsonEDSProperty);

				 if (x > index)
					 jsonProperties.remove(x + 1);
				 else {
					 jsonProperties.remove(x);
				 }
				 ++index;
			 }

			 			 System.out.println(jsonProperties);


		 }
		 /* for client verifiaction step
		  * 
		  */
		 if(stepName.equalsIgnoreCase("ClientVerification"))
		 {
			 String[] initalPaymentsOrder = 
				 {
					 "PartnerType",
					 "NationalIdOrBusinessRegistartionNo",
					 "Title",
					 "ClientName",
					 "ClientAddress",
					 "CribClearance",
					 "ClientGrading",
					 "ClientExposure",
					 "ApplicationType",
					 "Introducer",
					 "MarketingOfficer",
					 "EligibleVoucherAmount",
				 };
			 for (int j = 0; j < jsonProperties.size(); ++j) {
				 propObject.put(((JSONObject)jsonProperties.get(j)).get("name").toString(), (JSONObject)jsonProperties.get(j));
			 }
			 for (int i = 0; i < initalPaymentsOrder.length; ++i) {
				 JSONObject jsonEDSProperty = (JSONObject)propObject.get(initalPaymentsOrder[i]);
				 int x = jsonProperties.indexOf(jsonEDSProperty);
				 if (x == -1)
					 continue;
				 jsonProperties.add(index, jsonEDSProperty);

				 if (x > index)
					 jsonProperties.remove(x + 1);
				 else {
					 jsonProperties.remove(x);
				 }
				 ++index;
			 }
			 System.out.println(jsonProperties);
		 }
		 /*BM LEVEL PROP ORDER
		  * 
		  */	
		 if(stepName.equalsIgnoreCase("BranchManager"))
		 {

			 			 System.out.println("STEP NAME "+stepName +"\n jsopn prop "+jsonProperties.toString());

			 String[] PropertiesOrder = 
				 { 
					 "BranchName",
					 "BranchCode",
					 "ClientID", 
					 "ClientName", 
					 "ClientAddress", 
					 "SectorCode", 
					 "SubSectorCode", 
					 "Product", 
					 "ProductSubType", 
					 "FacilityNumber", 
					 "VATPercentage", 
					 "LeaseType",
					 "GracePeriod",
					 "RepayType", 
					 "PaymentType",
					 "FacilityAmount",
					 "SellingPrice", 
					 "Period", 
					 "PrePaidRentals",         
					 "IntrestRate", 
					 "LoanAmount", 
					 "LoanIntrestRate", 
					 "Rental", 
					 "Vat", 
					 "LoanRental", 
					 "LoanVat",
					 "Introducer", 
					 "MarketingOfficer", 
					 "Purpose", 
					 "CommissionTypes", 
					 "InsuranceAmt", 
					 "LFOrHPCommission", 
					 "SLCommission", 
					 "TotalCommission", 
					 "ExposureOnSVRPercentage", 
					 "ToRS", 
					 "Origin", 
					 "ClientAge",
					 "ClientCribStatus",
					 "ClientGrading",
					 "ClientExposure",
					 "ClientTelNo",
					 "NoOfClients",
					 "NoOfGurantors",
					 "GurantorID",
					 "GurantorName",
					 "GuarantorTelNo",
					 "IncomeFromEmployment", 
					 "Allowance", 
					 "IncomeFromBusiness", 
					 "OtherIncome", 
					 "SpouseOrPartnerIncome", 
					 "ProjectedIncomeLeasedAsset", 
					 "TotalIncome", 
					 "HouseRent", 
					 "LoanAndLeaseRePayment", 
					 "LivingExpenses", 
					 "IncomeTax", 
					 "OtherExpenses", 
					 "TotalExpenses", 
					 "AmountAvailableToPayMonthlyRental", 
					 "MonthlyRental", 
					 "VAT", 
					 "Savings", 
					 "RentalExposure",
					 "EligibleVoucherAmount",
					 "VoucherDiscount",
					 "ServiceCharges",
					 "VatOnServiceCharge",
					 "SupplierIdorRegNo",
					 "SupplierName",
					 "SupplierAddress",
					 "Justification"
				 };
			 for (int j = 0; j < jsonProperties.size(); ++j) {
				 propObject.put(((JSONObject)jsonProperties.get(j)).get("name").toString(), (JSONObject)jsonProperties.get(j));
			 }

			 for (int i = 0; i < PropertiesOrder.length; ++i) {
				 JSONObject jsonEDSProperty = (JSONObject)propObject.get(PropertiesOrder[i]);
				 int x = jsonProperties.indexOf(jsonEDSProperty);
				 if (x == -1)
					 continue;
				 jsonProperties.add(index, jsonEDSProperty);

				 if (x > index)
					 jsonProperties.remove(x + 1);
				 else {
					 jsonProperties.remove(x);
				 }
				 ++index;
			 }

			 			 System.out.println(jsonProperties);

		 }
		 if(stepName.equalsIgnoreCase("Justification"))
		 {
			 String[] PropertiesOrder = 
				 { 
					 "BranchName",
					 "BranchCode",
					 "ClientID", 
					 "ClientName", 
					 "ClientAddress", 
					 "SectorCode",
					 "SubSectorCode", 
					 "Product", 
					 "ProductSubType", 
					 "FacilityNumber", 
					 "VATPercentage", 
					 "LeaseType",
					 "GracePeriod",
					 "RepayType", 
					 "PaymentType",
					 "FacilityAmount",
					 "SellingPrice", 
					 "Period", 
					 "PrePaidRentals",         
					 "IntrestRate", 
					 "LoanAmount", 
					 "LoanIntrestRate", 
					 "Rental", 
					 "Vat", 
					 "LoanRental", 
					 "LoanVat",
					 "Introducer", 
					 "MarketingOfficer", 
					 "Purpose", 
					 "CommissionTypes", 
					 "InsuranceAmt", 
					 "LFOrHPCommission", 
					 "SLCommission", 
					 "TotalCommission", 
					 "ExposureOnSVRPercentage", 
					 "ToRS", 
					 "Origin", 
					 "IncomeFromEmployment", 
					 "Allowance", 
					 "IncomeFromBusiness", 
					 "OtherIncome", 
					 "SpouseOrPartnerIncome", 
					 "ProjectedIncomeLeasedAsset", 
					 "TotalIncome", 
					 "HouseRent", 
					 "LoanAndLeaseRePayment", 
					 "LivingExpenses", 
					 "IncomeTax", 
					 "OtherExpenses", 
					 "TotalExpenses", 
					 "AmountAvailableToPayMonthlyRental", 
					 "MonthlyRental", 
					 "VAT", 
					 "Savings", 
					 "RentalExposure",
					 "EligibleVoucherAmount",
					 "VoucherDiscount",
					 "ServiceCharges",
					 "VatOnServiceCharge",
					 "SupplierIdorRegNo",
					 "SupplierName",
					 "SupplierAddress",
					 "Justification"
				 };
			 for (int j = 0; j < jsonProperties.size(); ++j) {
				 propObject.put(((JSONObject)jsonProperties.get(j)).get("name").toString(), (JSONObject)jsonProperties.get(j));
			 }
			 for (int i = 0; i < PropertiesOrder.length; ++i) {
				 JSONObject jsonEDSProperty = (JSONObject)propObject.get(PropertiesOrder[i]);
				 int x = jsonProperties.indexOf(jsonEDSProperty);
				 if (x == -1)
					 continue;
				 jsonProperties.add(index, jsonEDSProperty);
				 if (x > index)
					 jsonProperties.remove(x + 1);
				 else {
					 jsonProperties.remove(x);
				 }
				 ++index;
			 }
			 			 System.out.println(jsonProperties);
		 }
		 /*    Agreements */   
		 if(stepName.equalsIgnoreCase("Agreements"))
		 {
			 String[] PropertiesOrder = 
				 { 
					 "FacilityNumber",       
					 "ClientID", 
					 "ClientName", 
					 "ClientAddress", 
					 "Product", 
					 "ProductSubType",
					 "LeaseType", 
					 "RepayType", 
					 "PaymentType",
					 "Period", 
					 "PrePaidRentals",
					 "FacilityAmount",
					 "IntrestRate", 
					 "LoanAmount", 
					 "LoanIntrestRate", 
					 "Rental", 
					 "Vat"
				 };
			 for (int j = 0; j < jsonProperties.size(); ++j) {
				 propObject.put(((JSONObject)jsonProperties.get(j)).get("name").toString(), (JSONObject)jsonProperties.get(j));
			 }
			 for (int i = 0; i < PropertiesOrder.length; ++i) {
				 JSONObject jsonEDSProperty = (JSONObject)propObject.get(PropertiesOrder[i]);
				 int x = jsonProperties.indexOf(jsonEDSProperty);
				 if (x == -1)
					 continue;
				 jsonProperties.add(index, jsonEDSProperty);
				 if (x > index)
					 jsonProperties.remove(x + 1);
				 else {
					 jsonProperties.remove(x);
				 }
				 ++index;
			 }
			  System.out.println(jsonProperties);
		 }
		 /* vehicle valuation 
		  */
		 if(stepName.equalsIgnoreCase("VehicleValuation") || stepName.equalsIgnoreCase("ValuationValuer"))
		 {
			 String[] PropertiesOrder = 
				 {
					 "EquipmentType",
					 "VehicleNoOrReferanceNo",
					 "Make",
					 "Model",
					 "CylinderCapacity",
					 "ChassisNo",
					 "EngineNo",
					 "FirstRegDate",
					 "YearOfManufacture",
					 "SeatingCapacity",
					 "Weight",
					 "Colour",
					 "ClassOfVehicle",
					 "FuelType",
					 "CRStatus",
					 "LastValuation",
					 "LastValuationDate",
					 "LastValuationBy", 
					 "ValuationFrom", 
					 "ValuationTo" 
				 };
			 for (int j = 0; j < jsonProperties.size(); ++j) {
				 propObject.put(((JSONObject)jsonProperties.get(j)).get("name").toString(), (JSONObject)jsonProperties.get(j));
			 }
			 for (int i = 0; i < PropertiesOrder.length; ++i) {
				 JSONObject jsonEDSProperty = (JSONObject)propObject.get(PropertiesOrder[i]);
				 int x = jsonProperties.indexOf(jsonEDSProperty);
				 if (x == -1)
					 continue;
				 jsonProperties.add(index, jsonEDSProperty);

				 if (x > index)
					 jsonProperties.remove(x + 1);
				 else {
					 jsonProperties.remove(x);
				 }
				 ++index;
			 }
			 System.out.println(jsonProperties);
		 }

		 if(stepName.equalsIgnoreCase("SupplierRegistration") || stepName.equalsIgnoreCase("SupplierApproval"))
		 {
			 String[] PropertiesOrder = 
				 {
					 "VehicleRegistrationNo",
					 "EngineNumber",
					 "ChassisNumber",
					 "PayeeName1",
					 "NICOrBRNo1",
					 "PaymentMode1",
					 "ChequeMode1",
					 "AccountNo1",
					 "Address1",
					 "Amount1",
					 "PayeeName2",
					 "NICOrBRNo2",
					 "PaymentMode2",
					 "ChequeMode2",
					 "AccountNo2",
					 "Address2",
					 "Amount2",
					 "PaymentSMSNO" 
				 };
			 for (int j = 0; j < jsonProperties.size(); ++j) {
				 propObject.put(((JSONObject)jsonProperties.get(j)).get("name").toString(), (JSONObject)jsonProperties.get(j));
			 }
			 for (int i = 0; i < PropertiesOrder.length; ++i) {
				 JSONObject jsonEDSProperty = (JSONObject)propObject.get(PropertiesOrder[i]);
				 int x = jsonProperties.indexOf(jsonEDSProperty);
				 if (x == -1)
					 continue;
				 jsonProperties.add(index, jsonEDSProperty);

				 if (x > index)
					 jsonProperties.remove(x + 1);
				 else {
					 jsonProperties.remove(x);
				 }
				 ++index;
			 }
			 System.out.println(jsonProperties);
		 }
		 if(stepName.equalsIgnoreCase("CheckList") || stepName.equalsIgnoreCase("DocumentsHigherApproval"))
		 {
			 String[] PropertiesOrder = 
				 {
					 "SupplierIdorRegNo",
					 "SupplierName",
					 "SupplierAddress",
					 "ClientID", 
					 "ClientName", 
					 "ClientAddress",
					 "FacilityNumber",
					 "Product",
					 "ProductSubType",
					 "LeaseType",
					 "FacilityAmount", 
					 "Period",
					 "IntrestRate",
					 "JustificationApprovalCheck", 
					 "ValuationandInvoiceCheck",
					 "ApplicationCheckedWithAgreementNICAffidavitForHirerAndGuarantor",
					 "SignatureCheckedOnAllSecuritydocs",
					 "InitialChargesCheck",
					 "SupplierRegistrationCheck",
					 "ProposalFormOrApplicationOrRequestLetter",
					 "ConsentToAssign",
					 "PaymentRequestLetterOrAuthoriseLetter",
					 "ActLetter",
					 "MTA6",
					 "HirerOrGuarantorEndorsement",
					 "CashPriceLetter",
					 "AffidavitOfHirer",
					 "AffidavitOfGuarantee",
					 "GuaranteeAndIndemnity",
					 "PurchaseOrder",
					 "ProofOfAddress", 
					 "EmploymentOrIncomeStatement",
					 "BankStatements",
					 "ChargesLetter",
					 "ICMemo",
					 "CFMemo",
					 "CRIBReport",
					 "Form4",
					 "BalanceSheet",
					 "IncorporationCertificate",
					 "BoardResolution"
				 };

			 for (int j = 0; j < jsonProperties.size(); ++j) {
				 propObject.put(((JSONObject)jsonProperties.get(j)).get("name").toString(), (JSONObject)jsonProperties.get(j));
			 }

			 for (int i = 0; i < PropertiesOrder.length; ++i) {
				 JSONObject jsonEDSProperty = (JSONObject)propObject.get(PropertiesOrder[i]);
				 int x = jsonProperties.indexOf(jsonEDSProperty);
				 if (x == -1)
					 continue;
				 jsonProperties.add(index, jsonEDSProperty);

				 if (x > index)
					 jsonProperties.remove(x + 1);
				 else {
					 jsonProperties.remove(x);
				 }
				 ++index;
			 }

			 		 System.out.println(jsonProperties);
		 }

		 		 if(stepName.equalsIgnoreCase("PaymentMemo") || stepName.equalsIgnoreCase("DocumentsAuthorisation") || stepName.equalsIgnoreCase("CentralAuthorisation") || stepName.equalsIgnoreCase("CentralReview") )
		 {

			 String[] PropertiesOrder = 
				 {
					 "PaymentType",
					 "NameOfTheHirer",
					 "FacilityNumber",
					 "PreviousFacilityNumber",
					 "VehicleNumbers",
					 "FacilityAmount",
					 "Vat",
					 "PayeeName1",
					 "PayeeID1",
					 "PaymentMode1",
					 "AccountNo1",
					 "Address1",
					 "Amount1",
					 "PayeeName2",
					 "PayeeID2",
					 "PaymentMode2",
					 "AccountNo2",
					 "Address2",
					 "Amount2",
					 "IntroducerName",
					 "IntroducerID",
					 "IntroducerCommision",
					 "IntroducerBankAccount",
					 "ServiceCharges",
					 "VoucherDiscount",
					 "TransportCharges",
					 "VatOnServiceOrTRCharges",
					 "RMVCharges",
					 "ValuationFee",
					 "CribCharges",
					 "StampDuty",
					 "OtherCharges",
					 "PrePaidRentals",
					 "VATOnPrePaidRentals",
					 "CurrentMonthRental",
					 "VATOnCurrentMonthRental",
					 "SavingsDeposit",
					 "SettlemetOfContract",
					 "FreeInsurance",
					 "AmountPayble"

				 };

			 for (int j = 0; j < jsonProperties.size(); ++j) {
				 propObject.put(((JSONObject)jsonProperties.get(j)).get("name").toString(), (JSONObject)jsonProperties.get(j));
			 }

			 for (int i = 0; i < PropertiesOrder.length; ++i) {
				 JSONObject jsonEDSProperty = (JSONObject)propObject.get(PropertiesOrder[i]);
				 int x = jsonProperties.indexOf(jsonEDSProperty);
				 if (x == -1)
					 continue;
				 jsonProperties.add(index, jsonEDSProperty);

				 if (x > index)
					 jsonProperties.remove(x + 1);
				 else {
					 jsonProperties.remove(x);
				 }
				 ++index;
			 }

			 		 System.out.println(jsonProperties);
		 
		 }
		 
		 		 if(stepName.equalsIgnoreCase("ClarkVerify"))
		 {

			 String[] PropertiesOrder = 
				 {"ApplicationID","ClientType","Depositor01HoderType","Depositor01IDType","Depositor01ID","Depositor01DateOfBirth","Depositor01Title","Deposoitor01Surname","Depositor01otherNames","Company01Name","Depositor01PhoneNo","Depositor01MobileNo","Depositor01FaxNo","Depositor01Email","Depositor01ResidentType","Deposoitor01occupation","Depositor01ownership"
						,"Depositor02HoderType","Depositor02IDType","Depositor02ID","Depositor02DateOfBirth","Depositor02Title","Deposoitor02Surname","Depositor02otherNames","Company02Name","Depositor02PhoneNo","Depositor02MobileNo","Depositor02FaxNo","Depositor02Email","Depositor02ResidentType","Deposoitor02occupation","Depositor02ownership",
						"Depositor03HoderType","Depositor03IDType","Depositor03ID","Depositor03DateOfBirth","Depositor03Title","Deposoitor03Surname","Depositor03otherNames","Company03Name",
						"Depositor03PhoneNo","Depositor03MobileNo","Depositor03FaxNo","Depositor03Email","Depositor03ResidentType","Deposoitor03occupation",
						"Depositor03ownership","PostalAddress","PostalAddress02","PostalAddress03","PostalCode","PermanentAddress","PermanentAddress02","PermanentAddress03","PermntAddrsPostalCode","AreaCode","DistrictCode","DepositCategory","PreferedLanguage","WHTType","EAlert","OriginatedBranchCode",
						"CBSLClassification","IntroducerCode","InterestPayInterval","DepositPeriod","DepositSchemeCode","RateofInterest","RequestRateofInterest","DepositAmount","ValueDate","MaturityDate","RenewalIndicator","DSACode","OperatingInstructions",
						"Nominee01Type","Nominee01NIC","Nominee01Title","Nominee01Surname","Nominee01Othernames","Nominee01Address","Nominee01Mobile","Nominee01Fax","Nominee01Email","Nominee01Relationship","Nominee01Propotion","Nominee02Type","Nominee02NIC","Nominee02Title","Nominee02Surname","Nominee02Othernames","Nominee02Address","Nominee02Mobile","Nominee02Fax","Nominee02Email","Nominee02Ralationship","Nominee02Propotion",
						"InterestInstruction","IntBeneficiaryName","IntBeneficiaryBankcode","IntBeneficiaryBranchcode","IntBeneficiaryBank","IntBeneficiaryBranch","IntBeneficiaryAccNo","IntBenificiaryAccountType","IntBeneficiaryPropotion","MaturityRefundInstructions","MatBenificiaryName","MatBenificiaryBankcode","MatBenificiaryBranchcode","MatBenificiaryAccNo","MatBenificiaryAccountType","MatBenificiaryPropotion","OnMaturityRefundInterestPayment","PreMatureWithdrawal","CertificateDeliveryInstruction","CollectionBranch"} ; 			
						

			 for (int j = 0; j < jsonProperties.size(); ++j) {
				 propObject.put(((JSONObject)jsonProperties.get(j)).get("name").toString(), (JSONObject)jsonProperties.get(j));
			 }

			 for (int i = 0; i < PropertiesOrder.length; ++i) {
				 JSONObject jsonEDSProperty = (JSONObject)propObject.get(PropertiesOrder[i]);
				 int x = jsonProperties.indexOf(jsonEDSProperty);
				 if (x == -1)
					 continue;
				 jsonProperties.add(index, jsonEDSProperty);

				 if (x > index)
					 jsonProperties.remove(x + 1);
				 else {
					 jsonProperties.remove(x);
				 }
				 ++index;
			 }

			 		 System.out.println(jsonProperties);
		 
		 }
		 
		 		 		 if(stepName.equalsIgnoreCase("Approval")||stepName.equalsIgnoreCase("ApproverReject"))
		 {

			 String[] PropertiesOrder = 
				 {"ApplicationID","ClientType","Depositor01HoderType","Depositor01IDType","Depositor01ID","Depositor01DateOfBirth","Depositor01Title","Deposoitor01Surname","Depositor01otherNames","Company01Name","Depositor01PhoneNo","Depositor01MobileNo","Depositor01FaxNo","Depositor01Email","Depositor01ResidentType","Deposoitor01occupation","Depositor01ownership"
						,"Depositor02HoderType","Depositor02IDType","Depositor02ID","Depositor02DateOfBirth","Depositor02Title","Deposoitor02Surname","Depositor02otherNames","Company02Name","Depositor02PhoneNo","Depositor02MobileNo","Depositor02FaxNo","Depositor02Email","Depositor02ResidentType","Deposoitor02occupation","Depositor02ownership",
						"Depositor03HoderType","Depositor03IDType","Depositor03ID","Depositor03DateOfBirth","Depositor03Title","Deposoitor03Surname","Depositor03otherNames","Company03Name",
						"Depositor03PhoneNo","Depositor03MobileNo","Depositor03FaxNo","Depositor03Email","Depositor03ResidentType","Deposoitor03occupation",
						"Depositor03ownership","PostalAddress","PostalAddress02","PostalAddress03","PostalCode","PermanentAddress","PermanentAddress02","PermanentAddress03","PermntAddrsPostalCode","AreaCode","DistrictCode","DepositCategory","PreferedLanguage","WHTType","EAlert","OriginatedBranchCode",
						"CBSLClassification","IntroducerCode","InterestPayInterval","DepositPeriod","DepositSchemeCode","RateofInterest","RequestRateofInterest","DepositAmount","ValueDate","MaturityDate","RenewalIndicator","DSACode","OperatingInstructions",
						"Nominee01Type","Nominee01NIC","Nominee01Title","Nominee01Surname","Nominee01Othernames","Nominee01Address","Nominee01Mobile","Nominee01Fax","Nominee01Email","Nominee01Relationship","Nominee01Propotion","Nominee02Type","Nominee02NIC","Nominee02Title","Nominee02Surname","Nominee02Othernames","Nominee02Address","Nominee02Mobile","Nominee02Fax","Nominee02Email","Nominee02Ralationship","Nominee02Propotion",
						"InterestInstruction","IntBeneficiaryName","IntBeneficiaryBankcode","IntBeneficiaryBranchcode","IntBeneficiaryBank","IntBeneficiaryBranch","IntBeneficiaryAccNo","IntBenificiaryAccountType","IntBeneficiaryPropotion","MaturityRefundInstructions","MatBenificiaryName","MatBenificiaryBankcode","MatBenificiaryBranchcode","MatBenificiaryAccNo","MatBenificiaryAccountType","MatBenificiaryPropotion","OnMaturityRefundInterestPayment","PreMatureWithdrawal","CertificateDeliveryInstruction","CollectionBranch","ApproverComment"} ; 			
						

			 for (int j = 0; j < jsonProperties.size(); ++j) {
				 propObject.put(((JSONObject)jsonProperties.get(j)).get("name").toString(), (JSONObject)jsonProperties.get(j));
			 }

			 for (int i = 0; i < PropertiesOrder.length; ++i) {
				 JSONObject jsonEDSProperty = (JSONObject)propObject.get(PropertiesOrder[i]);
				 int x = jsonProperties.indexOf(jsonEDSProperty);
				 if (x == -1)
					 continue;
				 jsonProperties.add(index, jsonEDSProperty);

				 if (x > index)
					 jsonProperties.remove(x + 1);
				 else {
					 jsonProperties.remove(x);
				 }
				 ++index;
			 }

			 		 System.out.println(jsonProperties);
		 
		 }
		 
		 	 		 		 if(stepName.equalsIgnoreCase("CerificatePrint"))
		 {

			 String[] PropertiesOrder = 
				 {"DepositAccountNo","ApplicationID","ClientType","Depositor01HoderType","Depositor01IDType","Depositor01ID","Depositor01DateOfBirth","Depositor01Title","Deposoitor01Surname","Depositor01otherNames","Company01Name","Depositor01PhoneNo","Depositor01MobileNo","Depositor01FaxNo","Depositor01Email","Depositor01ResidentType","Deposoitor01occupation","Depositor01ownership"
						,"Depositor02HoderType","Depositor02IDType","Depositor02ID","Depositor02DateOfBirth","Depositor02Title","Deposoitor02Surname","Depositor02otherNames","Company02Name","Depositor02PhoneNo","Depositor02MobileNo","Depositor02FaxNo","Depositor02Email","Depositor02ResidentType","Deposoitor02occupation","Depositor02ownership",
						"Depositor03HoderType","Depositor03IDType","Depositor03ID","Depositor03DateOfBirth","Depositor03Title","Deposoitor03Surname","Depositor03otherNames","Company03Name",
						"Depositor03PhoneNo","Depositor03MobileNo","Depositor03FaxNo","Depositor03Email","Depositor03ResidentType","Deposoitor03occupation",
						"Depositor03ownership","PostalAddress","PostalAddress02","PostalAddress03","PostalCode","PermanentAddress","PermanentAddress02","PermanentAddress03","PermntAddrsPostalCode","AreaCode","DistrictCode","DepositCategory","PreferedLanguage","WHTType","EAlert","OriginatedBranchCode",
						"CBSLClassification","IntroducerCode","InterestPayInterval","DepositPeriod","DepositSchemeCode","RateofInterest","RequestRateofInterest","DepositAmount","ValueDate","MaturityDate","RenewalIndicator","DSACode","OperatingInstructions",
						"Nominee01Type","Nominee01NIC","Nominee01Title","Nominee01Surname","Nominee01Othernames","Nominee01Address","Nominee01Mobile","Nominee01Fax","Nominee01Email","Nominee01Relationship","Nominee01Propotion","Nominee02Type","Nominee02NIC","Nominee02Title","Nominee02Surname","Nominee02Othernames","Nominee02Address","Nominee02Mobile","Nominee02Fax","Nominee02Email","Nominee02Ralationship","Nominee02Propotion",
						"InterestInstruction","IntBeneficiaryName","IntBeneficiaryBankcode","IntBeneficiaryBranchcode","IntBeneficiaryBank","IntBeneficiaryBranch","IntBeneficiaryAccNo","IntBenificiaryAccountType","IntBeneficiaryPropotion","MaturityRefundInstructions","MatBenificiaryName","MatBenificiaryBankcode","MatBenificiaryBranchcode","MatBenificiaryAccNo","MatBenificiaryAccountType","MatBenificiaryPropotion","OnMaturityRefundInterestPayment","PreMatureWithdrawal","CertificateDeliveryInstruction","CollectionBranch","ApproverComment"} ; 			
						

			 for (int j = 0; j < jsonProperties.size(); ++j) {
				 propObject.put(((JSONObject)jsonProperties.get(j)).get("name").toString(), (JSONObject)jsonProperties.get(j));
			 }

			 for (int i = 0; i < PropertiesOrder.length; ++i) {
				 JSONObject jsonEDSProperty = (JSONObject)propObject.get(PropertiesOrder[i]);
				 int x = jsonProperties.indexOf(jsonEDSProperty);
				 if (x == -1)
					 continue;
				 jsonProperties.add(index, jsonEDSProperty);

				 if (x > index)
					 jsonProperties.remove(x + 1);
				 else {
					 jsonProperties.remove(x);
				 }
				 ++index;
			 }

			 		 System.out.println(jsonProperties);
		 
		 }
			}
	public String[] getFilteredServices()
	{
		return new String[] { "/p8/getStepParameters","/p8/getFilterCriteria" };
	}
}