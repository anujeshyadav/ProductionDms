export let Image_URL = "https://customer-node.rupioo.com";
const subdomain = window.location.hostname.split(".")[0];
if (subdomain === "customer") {
  Image_URL = "https://customer-node.rupioo.com";
} else if (subdomain === "admin") {
  Image_URL = "https://node.rupioo.com";
} else {
  Image_URL = "https://customer-node.rupioo.com";
}

export const Pan_Verification_key = "5649422e1a7c37dadb607c7cc5882693";
export const Pan_Verification_API = "https://sheet.gstincheck.co.in/check/pan";
export const Super_Admin_List = "/master/all-super-admin-list";
export const SubscriptinPlan = "/subscription/save-detail";
export const SubscriptinPlan_by_id = "/subscription/view-detail-by-id/";
export const Update_SubscriptinPlan_by_id = "/subscription/update-detail/";
export const Update_individual_plan = "/user/update-plan/";
export const Delete_SubscriptinPlan = "/subscription/delete-detail/";
export const SubscriptinPlanList = "/subscription/view-detail";

export const GST_Verification_Api =
  "http://sheet.gstincheck.co.in/check/5649422e1a7c37dadb607c7cc5882693/";
export const Get_Role = "/role/get-role";
export const Update_Role_Globally = "/role/update-permission";
export const Update_Role_To_SuperAdmin = "/user/update-super-admin-role/";
export const Assign_Role_To_SuperAdmin = "/role/assign-role";
export const User_Assign_User = "/user/assign-user";
export const User_UnLink_User = "/user/delete-assign-user";
export const Customer_UnLink_Unassign = "/customer/unassign-party-lead";
export const All_Users_List = "/user/user-list/";
export const Deptartment_with_Role = "/assign-role/view-assign-role/";
export const country_state_City_List =
  "https://vikram-pratap-singh10.github.io/pincodeAPI/output.json";
export const Role_list_by_Master = "/master/get-super-admin-role/";
export const Create_Role = "/role/create-role";
export const Create_Department = "/department/save-department";
export const ViewDepartmentWise_Assign_Role = "/assign-role/view-assign-role/";
export const Delete_Department = "/department/delete-department/";
export const Update_AssignRole_InDepartment =
  "/assign-role/update-assign-role/";

// create Customer group

export const Create_CustomerGroup = "/customer-group/save-customer-group";
export const View_CustomerGroup = "/customer-group/view-customer-group/";
export const View_CustomerPurchasedQty = "/order/party-qty";
export const View_CustomerGroup_by_id =
  "/customer-group/view-customer-group-by-id/";
export const Update_CustomerGroup_by_id =
  "/customer-group/update-customer-group/";
export const Delete_CustomerGroup_by_id =
  "/customer-group/delete-customer-group/";

// end customer group

// generate custom id
export const user_create_custom_id = "/user/create-custom-id";
export const List_Department = "/department/view-department";
export const Save_Assigned_Role = "/assign-role/save-assign-role";
export const Create_Role_by_Master = "/master/create-super-admin-role";
export const Get_Role_by_id = "/role/get-role-by-id/";
export const Create_Company_Details = "/company-detail/save-company-details";
export const View_Company_Details = "/company-detail/view-company-details/";
export const Bulk_Upload_Customer = "/customer/party-data";
export const Bulk_Upload_Lead_Customer = "/customer/save-lead-party-bulk";
export const Bulk_Upload_VIEW_LEAD_PARTY = "/customer/lead-party-list/";
export const AssignTo_Sales_Person = "/customer/assign-lead-party";
export const Bulk_Upload_transporter = "/transporter/transporter-data";
export const Bulk_Upate_transporterUpload =
  "/transporter/update-import-transporter";

export const Bulk_Upload_User = "/user/import-user-data";

export const Bulk_Upload_Product = "/product/import-item-data";
export const Bulk_Update_Product = "/product/update-import-product";

export const Bulk_Update_User = "/user/update-import-user";
export const Bulk_Update_Customer = "/customer/update-customer-bulk-import";

export const Bulk_Upload_Receipt = "/receipt/reciept-data";
export const Bulk_Upload_Payment = "/receipt/payment-data";
export const Update_Role = "/role/update-role/";
// export const Create_warehouse_xmlView = "/warehouse/get-xml";
export const Create_warehouse_save = "/warehouse/save-warehouse";
export const View_Wareahouse_id = "/user/view-user/";
export const WareahouseList_For_addProduct =
  "/warehouse/view-warehouse-product/";
export const View_Wareahouse_Byid = "/warehouse/view-warehouse-by-id/";
export const Update_Wareahouse_Byid = "/warehouse/update-warehouse/";
export const Create_Warehouse_List = "/warehouse/view-warehouse/";
export const Warehouse_ListBy_id = "/warehouse/view-warehouse-list-incharge/";
export const Delete_WareHouse = "/warehouse/delete-warehouse/";
export const Created_Warehouse = "/warehouse/view-warehouse-list/";
// export const Create_Party_XML = "/party/get-xml";
export const Create_Party_save = "/party/save-party";
export const Create_Salesmanager_save = "/sales-manager/save-sales-manager";
export const Sales_Manager_List = "/sales-manager/view-sales-manager";
export const Delete_SalesManager_person =
  "/sales-manager/delete-sales-manager/";
export const Delete_Sales_person = "/sales-person/delete-sales-person/";
export const Update_Sales_Manager_save = "/sales-manager/update-sales-manager/";
export const Update_Sales_person_save = "/sales-person/update-sales-person/";
export const Create_Sales_person_List = "/sales-person/view-sales-person";
export const Create_Sales_person_save = "/sales-person/save-sales-person";
export const Create_Party_List = "/party/view-party";
// "creatorderbycashbook"
export const Create_order_by_cashbook = "/cashbook/cashbook-order";
//cashbookgetapi
export const CashbookList = "/cashbook/view-order-list/";

export const Save_Promotion = "/promotion/save-promotion";
export const View_Promotion_List = "/promotion/view-promotion/";
export const Create_transporter_xmlView = "/transporter/get-xml";
export const Create_transporter_save = "/transporter/save-transporter";
export const Create_Transporter_List = "/transporter/view-transporter/";
export const View_TransporterByID = "/transporter/view-transporter-by-id/";
export const Update_TransporterByID = "/transporter/update-transporter/";
export const Delete_Transporter_List = "/transporter/delete-transporter/";
export const Create_Ware_House = "/raw-material/get-xml";
export const Create_unit_xmlView = "/unit/get-xml";

export const AddOther_Charges = "/other-charges/save-other-charges";
export const ViewOther_Charges = "/other-charges/view-other-charges/";
export const ViewOne_Other_Charges = "/other-charges/save-other-charges";
export const DeleteOne_Other_Charges = "/other-charges/delete-other-charges/";
export const UpdateOne_Other_Charges = "/other-charges/update-other-charges/";

export const AddPrimaryUnit = "/primary-unit/save-primary-unit/";
export const BaseUnitList = "/primary-unit/view-primary-unit/";
export const Create_unit_save = "/unit/save-unit";
export const Create_unit_List = "/unit/view-unit/";
export const Delete_Unit_List = "/unit/delete-unit/";
export const Unit_ViewOne = "/unit/update-unit/";
export const Unit_Update = "/unit/update-unit/";
export const create_row_material = "/raw-material/creat-rawMaterial";
//productionapk

// productionProcess
// tab show on edit button
export const Save_Tabs = "/role/save-tab";
export const View_Tabs = "/role/view-tab/";
export const Save_dashboard_Tabs = "/role/save-dashboard-tab";
export const View_dashboard_Tabs = "/role/view-dashboard-tab/";

// end tab show on edit button

export const Save_Producton_Process = "/production/save-production";
export const Save_Producton_Return = "/production/updated-return-production/";
export const View_Production_Return =
  "/production-return/view-production-return/";
export const Get_Producton_ProcessList = "/production/view-production";
export const ViewOne_Production = "/production/view-production-by-id/";
export const UpdateOne_Production = "/production/update-production-items/";
export const WareHouse_Closing_Stock = "/stock-updation/view-closing-stock/";
export const WareHouse_Opening_Stock = "/stock-updation/view-closing-stock/";
export const WareHouse_OverDue_Stock = "/stock-updation/view-over-due-stock/";
export const WareHouse_DeadStock_Stock = "/stock-updation/view-over-due-stock/";
export const WareHouse_Current_Stock = "/product/view-current-stock/";

export const ProductWise_Purchase_Report =
  "/purchase-order/product-purchase-report/";
export const WarehouseDifference_Report = "/warehouse/warehouse-difference/";
export const SalesPerson_targetReport =
  "/target-creation/target-achievement-sales-person/";
export const Payment_Due_Report = "/customer/payment-due-report/";
export const HSN_Purchase_Summary_Report = "/product/hsn-purchase-summary/";
export const Target_Achievement_Report = "/target-creation/achievements/";
export const Tax_Report = "/receipt/tax-report/";
export const HSN_SAle_Summary_Report = "/product/hsn-sales-summary/";
export const HSN_Stock_Report = "/warehouse/hsn-stock-summary/";
export const CDNR_Report = "/credit-note/cdnr-report/";
export const Party_targetReport = "/target-creation/target-achievement-party";
export const Cashbook_Report = "/receipt/cash-book-report/";
export const WareHouse_Report = "/warehouse/warehouse-report/";
export const BankAccount_Report = "/receipt/bank-account-report/";
export const Product_Sales_Report = "/order/product-sales-report/";
export const Stock_Report_List = "/stock-updation/view-warehouse-stock/";
export const Profit_Loss_Report = "/receipt/profit-loss-report/";
export const Auto_Billing_Lock = "/customer/auto-billing-lock/";
export const Due_Report = "/customer/due-report/";
export const Customer_OverDue_report_List = "/customer/over-due-report/";
// production process end

export const delet_product_item = "/raw-material/delete-raw-material/";

export const Delete_Category = "/categories/delete-category/"; //done
export const Delete_Sub_Category = "/categories/delete-categories/";
export const View_Cat_by_id = "/categories/view-category-by-id/";
export const Update_Category = "/categories/update-category/";
export const Update_Sub_Category = "/categories/update-categories/";
export const Create_Category = "/categories/save-category";
export const Category_List = "/categories/view-category/";
export const Create_SubCategory = "/categories/save-subcategory";

export const Create_Product_XMLView = "/product/get-xml";
export const Save_Product = "/product/save-product";
export const Product_Price_Bulk_Update = "/product/product-price-updated";
export const Update_Product_salesRate = "/product/product-price-update/";
export const PurchaseProductList_Product = "/product/view-product-purchase/";
export const Delete_Product = "/product/delete-product/"; //delete
export const Update_Product = "/product/update-product/"; //put
export const ViewOne_Product = "/product/view-product-by-id/"; //get

export const Get_Damaged_stock = "/stock-updation/get-damage-item/"; //get
export const Save_Damaged_stock = "/stock-updation/save-damage-item"; //post
export const Delete_Damaged_stock = "/stock-updation/delete-item/"; //delete
export const Update_Damaged_stock = "/stock-updation/update-damageItem/"; //put
export const Stock_trx_FtoW = "/factory/stock-transfer-FTW";
export const Stock_trx_WarehousetoWareHouse =
  "/stock-updation/stock-transfer-warehouse";
export const View_DeadParty = "/stock-updation/view-dead-party/";
export const Stock_trx_FtoW_List = "/stock-updation/view-warehouse-stock/";
export const ProductList_View = "/product/view-product/";
export const Factory_Stock = "factory/view-factory-stock/";
export const Warehouse_Stock = "/warehouse/view-warehouse-stock/";
export const Low_Stock_Alerts = "/product/view-stock-alert/";
export const Warehouse_Inward_list = "/stock-updation/view-in-ward-stock/";
export const Warehouse_OutwardStock_list =
  "/stock-updation/view-out-ward-stock/";
export const View_User_By_Id = "/user/view-user/";
export const Warehouse_Temporarly_list = "/user/view-warehouse/";
export const Stock_update = "/stock-updation/update-warehoue-to-warehouse/";
// export const Stock_update = "/factory/update-factory-warehouse/";

export const Save_Order = "/order/save-create-order";
export const view_create_order_history = "/order/view-create-order-history/";
export const view_create_order_historyBy_id = "/order/view-sales-by-id/";
export const view_Sales_order_List = "/order/view-sales-order/";
export const Delete_Sales_order = "/order/delete-sales-order/";
export const Delete_Sales = "/order/delete-sales/";
export const Order_By_Billing = "/order/order-billing/";
// By other
export const Save_Place_Order = "/order/save-place-order";
export const Create_Existing_Invoice = "/order/save-sales-invoice-order";
export const Place_Order_List = "/order/view-place-order/";
export const Place_ORder_Return_Product =
  "/purchase-return/save-purchase-return";
export const Place_Order_Edit = "/order/update-place-order/";
export const Place_Order_Delete = "/purchase-order/delete-purchase-order/";
export const Completed_Order_Delete = "/purchase-order/deleted-purchase-order/";
// BY OWN
export const Sales_Return_Product =
  "/sales-return/save-sales-return-createorder";
export const Sales_Return_ProductList =
  "/sales-return/view-sales-return-createorder";
export const Sales_Edit_Order = "/order/update-create-order/";
export const Sales_Pending_StatusChange = "/order/update-create-order-status/";

// purchase order
export const SavePurchase_Order = "/purchase-order/save-purchase-order";
export const Purchase_Invoice = "/invoice/view-invoice-purchase/";
export const Purchase_OrderViewOne =
  "/purchase-order/view-purchase-order-history-by-id/";
export const Purchase_Order_List =
  "/purchase-order/view-purchase-order-history/";
export const Delete_Purchase_Item = "/purchase-order/delete-purchase-order/";
export const Delete_Product_Item = "/raw-material/delete-raw-material/";
export const Purchase_Return = "/purchase-return/save-purchase-return";
export const Purchase_Return_List = "/purchase-return/view-purchase-return/";
export const Purchase_Edit_Order = "/purchase-order/update-purchase-order/";
export const Purchase_AddInforEdit_Order =
  "/purchase-order/purchase-order-update/";
export const Purchase_Direct_Complete =
  "/purchase-order/purchase-invoice-order";
export const Purchase_Status_Order =
  "/purchase-order/update-purchase-order-status/";

export const Sales_OrderTo_Dispatch = "/order/order-dispatch/";
export const Sales_OrderTo_DispatchList = "/invoice/save-invoice/";
export const Order_DisPatchList = "/invoice/view-invoice/";
export const Goods_Delivery_OTP = "/good-dispatch/send-otp/";
export const Goods_Delivery_OTP_Auth = "good-dispatch/verify-authentication/";
export const Edit_Status_DispatchList = "/invoice/update-status/";
export const DeliveryBoy_AssignedList = "/good-dispatch/view-order-list/";
export const Debit_note_Order_List = "/debit-note/view-debit-note/";
export const Credit_note_Order_List = "/credit-note/view-credit-note/";
export const GoodDispatch_xmlView = "/good-dispatch/get-xml";
export const SAVE_GoodDispatch = "/good-dispatch/save-good-dispatch";
export const GoodDispatch_List = "/good-dispatch/view-good-dispatch/";
export const Edit_GoodDispatch = "/good-dispatch/update-good-dispatch/";

// create receipt
export const Create_Receipt = "/receipt/save-receipt";
export const Create_Payment = "/receipt/save-payment";
export const View_Receipt = "/receipt/view-reciept/";
export const View_Receipt_By_Id = "/receipt/view-receipt-by-id/";
export const Delete_Receipt_By_Id = "/receipt/delete-receipt/";
export const Delete_payment_By_Id = "/receipt/delete-payment/";
export const Update_Receipt_By_Id = "/receipt/update-receipt/";
export const Update_payment_By_Id = "/receipt/update-payment/";

// end receipt
// Guwahati close

// ledger

export const View_Ledger_by_id = "/ledger/view-ledger-party/";
export const View_VendorLedger_by_id = "/ledger/view-ledger-user/";

// end ledger

export const Create_Account_xmlView = "/user/get-xml";
export const Create_SalesMan_xmlView =
  "https://xmlfileaws.s3.ap-south-1.amazonaws.com/CreateSalesmanConfig%5D.xml";
export const Create_SalesManager_xmlView =
  "https://xmlfileaws.s3.ap-south-1.amazonaws.com/CreateSalesManagerConfig.xml";
export const Create_Customer_xmlView = "/customer/get-xml";
export const Create_Target_xml_view = "/target-creation/get-xml";

export const Create_Target_List = "/target-creation/view-target-creation/";
export const Target_Achievement = "/target-creation/target-achieve/";
export const Delete_target_INlist = "/target-creation/delete-target-creation/";
export const Update_target_INlist = "/target-creation/update-target-creation/";
export const Delete_individual_Target = "/target-creation/";

export const Heirarchy_Created_Target_List = "/target-creation/view-target/";
export const Create_Target_save = "/target-creation/save-target-creation";
export const Create_CustomerTarget_save = "/target-creation/customer-target";
export const View_CustomerTarget_List =
  "target-creation//view-customer-target/";
export const Create_Customer_BulkDelete = "/customer/delete-bulk-customer/";
export const Create_Customer_save = "/customer/save-customer";
export const View_Customer_ById = "/customer/view-customer-by-id/";
export const Create_Customer_Update = "/customer/update-customer/";
export const Create_Account_save = "/user/save-user";
export const Create_Account_List = "/user/view-user-by-id/";
export const customer_sales_lead_by_id = "/customer/sales-lead-by-id/";
export const customer_sales_update_by_id = "/customer/update-sales-lead/";
export const RegisterForAttendanceHRM = "/user/view-register-user";
export const RegisteredUser = "/user/view-register-user";
export const ViewOneById = "/api/attendanceAwsById";
export const RegisteredAttendanceUsers = "/api/attendanceAws";
export const RegisteredAttendanceUser = "/attendence/attendance-list";
export const Create_Product_List = "/raw-material/viewRawMaterial";
export const Create_User_List = "/user/view-user/";
export const Create_Customer_List = "/customer/view-customer/";
export const Create_Account_Update = "/user/update-user/";
export const Delete_Account_List = "/user/delete-user/";
export const Delete_Customer_List = "/customer/delete-customer/";

export const Create_Parts = "/part-config/createParts";
export const customerRegistration = "/account/customerRegistration";

// import
export const Part_catelougue = "/part-catalogue/save-part-catalogue";
export const SpartPart_Upload = "/spare-parts/save-spare-parts";
export const Products_Upload =
  "/product-registration/save-product-registration";
export const orders_Upload = "/orders/save-orders";
export const orders_ID = "create-orders/view-create-order";
export const Inspection_Upload = "/inspection/save-inspection";
export const Invoice_Upload = "/invoice-billing/save-invoice-billing";
export const Supports_Upload = "/support/save-support";
export const Service_Upload = "/servicing/save-servicing";
export const Warehouse_Upload = "/warehouse/save-warehouse";
export const Distributor_Upload = "/distributors/save-distributor";
export const Dealer_Upload = "/dealers/save-dealer";
export const Supplier_Upload = "/suppliers/save-supplier";
export const ServiceCenter_Upload = "/service-centers/save-service-center";
export const Customer_Upload = "/customer/save-customer-data";
export const Campaign_Upload = "/campaign/save-campaign";
export const Service_Rate_Upload = "/service-rate/save-service-rate";
export const Warrenty_Upload = "/warranty/save-warranty";

// end

// upload List
export const Spare_PartsView = "/spare-parts/view-spare-parts"; // done
export const SparePart_CatalogueList = "/part-catalogue/get-part-catalogue"; // done
export const CampaignList_View = "/campaign/view-campaign"; // done
export const WarrentyUpload_View = "/warranty/view-warranty";
export const Orders_View = "/orders/view-orders"; // done
export const SupportsUpload_View = "/support/view-support"; //done
export const Inspection_View = "/inspection/view-inspection"; // done
export const Servicing_View = "/servicing/view-servicing"; // done
export const WareHouseUpload_View = "/warehouse/view-warehouse";
export const ProductUpload_View =
  "/product-registration/view-product-registration";
export const invoice_billing_View = "/invoice-billing/view-invoice-billing"; // done
export const Purchase_Invoice_Create = "/invoice/save-purchase-invoice/"; // done
export const Customer_Upload_View = "/customer/view-customer-data";
export const Distributor_View = "/distributors/view-distributor";
export const Dealers_View = "/dealers/view-dealer";
export const Supplier_View = "/suppliers/view-supplier"; // done
export const SerViceCenter_View = "/service-centers/view-service-center";
export const Part_CatalogueView = "/part-catalogue/view-parts"; //done
export const Sevice_Card_List = "/service-rate/view-service-rate"; //done
export const Sevice_Card_DeleteOne = "/service-rate/delete-service-rate/"; //done
export const Dead_party_List = "/stock-updation/view-dead-party"; //done
//end Uploads list

// warranty
// export const Warranty_View = "/warranty/get-xml"; //done
// export const Warranty_Save = "/warranty/save-warranty"; //done
// export const WarrantyList_View = "/warranty/view-warranty";
// export const Warranty_Delete = "/warranty/delete-warranty/";
export const Warranty_Update = "/warranty/update-warranty/";

// export const Warranty_AuditHistoryList =
//   "/audit-history/view-warranty-audit-history"; //get
// export const Warranty_AuditHistoryViewone =
//   "/audit-history/view-warranty-audit-history-by-id/"; //get

// Order
// export const CreaterOrder_View = "/orders/get-xml"; //done
// export const Order_ViewList = "/create-orders/view-create-order"; //done
// export const AddOrderComment = "/create-orders/comment-add/"; //done
// export const PlaceOrder_post = "/orders/place-order/"; //done

// Inspection
// export const Inspection_XMLView = "/inspection/get-xml"; //done
// product wiki
// export const productwiki_View = "/product-wiki/createWiki"; //done
// ticketTool
// export const ticketTool_View = "/ticket-tool/get-xml"; //done
// export const ticketTool_Save = "/ticket-tool/save-ticket-tool"; //done
// export const ticketTool_List = "/ticket-tool/view-ticket-tool"; //done
// export const ticketTool_deleteList = "/ticket-tool/delete-ticket-tool/"; //done

export const Spare_Parts = "/part-catalogue/get-spare-parts";
// export const Parts_Catalogue = "/part-catalogue/get-partscatalogue-parts";
// export const GET_PARTS_CATELOGUE = "/part-catalogue/get-part-catalogue";
// export const Order_Parts = "/part-catalogue/get-orders-parts";
// export const AddSupplierView = "/create-supplier/createSupplier";
// export const createWikiView = "/product-wiki/createWiki";
// export const createQuoteView = "/create-quote/create-quote";
export const createWarehouseView = "/create-warehouse/create-warehouse";

// login Api End  Points
export const Login_User = "/user/signin";
export const Login_OTP = "/user/verify-otp";
export const Edit_Profile = "/create-account/edit-profile/";

//HRM API Address//////////////////////////////////////////

// hrm userlist
export const All_Users_HRM = "/user/user-list-hrm/";

export const HRM_JOB_CATEGORY = "/job-category-branch/save-job-category"; //post
export const HRM_JOB_VIEW_CATEGORY = "/job-category-branch/view-job-category/"; //GET
export const HRM_JOB_DELETE_CATEGORY =
  "/job-category-branch/delete-job-category/"; //Delete
// export const HRM_JOB_CAT_BYID="/job-category-branch/view-job-category-by-id/"; //GET JOBCATEGORY BY ID
export const HRM_BRANCH_CATEGORY = "/job-category-branch/save-job-branch"; // Post
export const HRM_BRANCH_VIEW = "/job-category-branch/view-job-branch/"; //GET
export const HRM_BRANCH_DELETE = "/job-category-branch/delete-job-branch/"; //Delete
///

export const HRM_CREATE_JOB = "/create-job/save-job"; //post
export const HRM_JOBLIST = "/create-job/view-job/"; //get
export const HRM_DELETE_JOB = "/create-job/delete-job/"; //DELETE
export const Hrm_Update = "/create-job/update-job/"; //put
export const Hrm_ViewOne = "/create-job/view-job-by-id/"; //Get

///
export const Hrm_AppyGroup = "/job-applied/save-job-applied"; //post
export const Hrm_AppyList = "/job-applied/view-job-applied/"; //Get
export const Hrm_AppUpdate = "/job-applied/update-job-applied/"; // put
export const Hrm_AppviewOne = "/job-applied/view-job-applied-by-id/"; // Get
export const Hrm_AppDelete = "/job-applied/delete-job-applied/"; // Delete

///
export const Hrm_InterviewGroup = "/interview/save-interview"; //post
export const Hrm_InterviewList = "/interview/view-interview/"; //Get
export const Hrm_InterviewUpdate = "/interview/update-interview/"; // Put
export const Hrm_Interviewone = "/interview/view-interview-by-id/"; // Get
export const Hrm_InterDelete = "/interview/delete-interview/"; // Delete

export const Hrm_offerGroup = "/offer-letter/save-offer-letter"; //post
export const Hrm_OfferList = "/offer-letter/view-offer-letter/"; // Get
export const Hrm_OfferUpdate = "/offer-letter/update-offer-letter/"; //Put
export const Hrm_OfferViewone = "/offer-letter/view-offer-letter-by-id/"; // Get
export const Hrm_OfferDelete = "/offer-letter/delete-offer-letter/"; // Delete

export const Hrm_SkillGroup = "/skill-test/save-questions"; // post
export const Hrm_SkillList = "/skill-test/view-test-question/"; // Get
export const Hrm_SkillUpdate = "/skill-test/update-test-question/"; // Put
export const Hrm_SkillViewOne = "/skill-test/view-test-question-by-id/"; //Get
export const Hrm_SkillDelete = "/skill-test/delete-test-question/"; // Delete

export const Hrm_TrainGroup = "/training/save-training-detail"; // post
export const Hrm_TrainList = "/training/view-training-detail/"; //Get
export const Hrm_TrainUpdate = "/training/update-training-detail/"; // put
export const Hrm_TrainViewOne = "/training/view-training-by-id/"; //Get
export const Hrm_TrainDelete = "/training/delete-training-detail/"; // Delete

export const Hrm_Salary_slip = "/rule-creation/view-salary/"; //get
export const Hrm_Salary_List = "/user/apply-rules/"; //post
export const Hrm_SalaryGroup = "/salary/save-salary"; //post
export const Hrm_SalaryList = "/salary/view-salary/"; // Get
export const Hrm_SalaryUpdate = "/salary/update-salary/"; //Put
export const Hrm_SalaryViewone = "/salary/view-salary-by-id/"; // Get
export const Hrm_SalaryDelete = "/salary/delete-salary/"; // Delete

///

export const HRM_EditAttendanceTime = "/editTimes/"; //POST
export const HRM_SAVE_ATTENDANCE = "/hrm-attendance/save-attendance"; //POST
export const HRM_VIEW_ATTENDANCE = "/hrm-attendance/view-attendance"; //Get//
export const HRM_DELETE_ATTENDANCE = "/hrm-attendance/delete-attendance/"; //Delete
export const VIEW_ATTENDANCE_BY_ID = "/hrm-attendance/view-attendance-by-id/"; //Get by id  /hrm-attendance/view-attendance-by-id/:id
export const UPDATE_ATTENDANCE = "/hrm-attendance/update-attendance/"; //PUT  /hrm-attendance/update-attendance/:id

///
export const HRM_SAVE_LEAVE = "/hrm-leave/save-leave"; //POST
export const HRM_VIEW_LEAVE = "/hrm-leave/view-leave/"; //get
export const HRM_DELETE_LEAVE = "/hrm-leave/delete-leave/"; //DELETE
export const HRM_LEAVE_BY_ID = "/hrm-leave/view-leave-by-id/"; //GET BY ID
export const HRM_UPDATE_LEAVE = "/hrm-leave/update-leave/"; //PUT

///
export const HRM_SAVE_INDICATOR = "/indicator/save-indicator"; //post
export const HRM_VIEW_INDICATOR = "/indicator/view-indicator/"; //get
export const HRM_DELETE_INDICATOR = "/indicator/delete-indicator/"; //delete
export const HRM_INDICATOR_BY_ID = "/indicator/view-indicator-by-id/"; //GET BY ID
export const HRM_UPDATE_INDICATOR = "/indicator/update-indicator/"; //PUT

//////

export const SAVE_RULE_CREATION = "/rule-creation/save-rules"; //POST
export const VIEW_RULE_CREATION = "/rule-creation/view-rules/"; //GET
export const DELETE_RULE_CREATION = "/rule-creation/delete-rules/"; //DELETE
export const VIEW_RULE_CREATION_BYID = "/rule-creation/view-rules-by-id/"; //GET BY ID
export const UPDATE_RULE_CREATION = "/rule-creation/update-rules/"; // PUT

export const HRM_ATTENDANCE_LIST =
  "https://node-second.rupioo.com/attendance-calculate/"; ///DATABASE

//////////

export const HRMRULE_SAVE_BONUS = "/bonus/save-bonus"; //POST
export const Bonus_List = "/bonus/view-bonus/"; //get     /rule-creation/bonus
export const Bonus_ViewBy_Id = "/bonus/view-bonus-by-id/";
export const Bonus_DeleteBy_Id = "/bonus/delete-bonus/";
export const Bonus_UpdateBy_Id = "/bonus/update-bonus/";

///////
//////////

export const Create_Appraisal = "/appraisal/save-appraisal"; //POST     /rule-creation/bonus
export const Appraisal_List = "/appraisal/view-appraisal/"; //get     /rule-creation/bonus
export const APpraisal_ViewBy_Id = "/appraisal/view-appraisal-by-id/";
export const Appraisal_DeleteBy_Id = "/appraisal/delete-appraisal/";
export const Appraisal_UpdateBy_Id = "/appraisal/update-appraisal/";

///////

export const HRM_SAVE_MANAGELEAVE = "/leave-manage/save-data"; // POST   /leave-manage/save-data
export const HRM_VIEW_MANAGELEAVE = "/leave-manage/view-leave/"; // GET DATABASE   /leave-manage
export const HRM_VIEWOne_MANAGELEAVE = "/leave-manage/view-leave-by-id/"; // GET DATABASE   /leave-manage
export const HRM_VIEWOne_MANAGELEAVE_Delete = "/leave-manage/delete-leave/"; // GET DATABASE   /leave-manage
export const HRM_VIEWOne_MANAGELEAVE_Edit = "/leave-manage/updated-leave/"; // GET DATABASE   /leave-manage
////
export const HRM_SAVE_HOLIDAY = "/holiday/save-holiday"; //POST
export const HRM_VIEW_HOLIDAY = "/holiday/view-holiday/"; //GET DATABASE
// export const HRM_VIEWHOLIDAY_BYID = "/holiday/view-holiday-by-id/";//GET BY ID
export const HRM_DELETE_HOLIDAY = "/holiday/delete-holiday/"; //DELETE

///////
export const Incentive_Save_incentive = "/incentive/save-incentive"; //POST
export const Incentive_View_incentive = "/incentive/view-incentive/"; //GET DATABASE
export const Incentive_View_incentive_BYID = "/incentive/view-incentive-by-id/"; //GET BY ID
export const Incentive_Edit_incentive_BYID = "/incentive/update-incentive/"; //GET BY ID
export const Incentive_DELETE_Incentive = "/incentive/delete-incentive/"; //DELETE

export const COMPLAINT_HRM_SAVE_COMPLAINT = "/complaint/save-complaint"; //POST
export const COMPLIANT_HRM_VIEW = "/complaint/view-complaint/"; //GET  DB
export const COMPLAINT_VIEWCOMPLAINT_BY_ID = "/complaint/view-complaint-by-id/"; //GET BY ID
export const COMPLAINT_DELETE_complaint = "/complaint/delete-complaint/"; //DELTE BY ID
export const UPDATE_COMPLAINT = "/complaint/update-complaint/"; //PUT

export const SAVE_RESIGNATION = "/resignation/save-resignation"; //POST
export const VIEW_RESIGNATION = "/resignation/view-resignation/"; //GET DB
export const VIEW_RESGNATION_BY_ID = "/resignation/view-resignation-by-id/"; //GET BY ID
export const DELETE_RESIGNATION = "/resignation/delete-resignation/"; //DELETE
export const UPDATE_RESIGNATION = "/resignation/update-resignation/"; //PUT

export const WARNING_SAVE_WARNING = "/warning/save-warning"; //POST
export const WARNING_VIEW = "/warning/view-warning/"; //GET DB
export const VIEW_WARNING_BY_ID = "/warning/view-warning-by-id/"; //GET BY ID
export const DELETE_WARNING = "/warning/delete-warning/"; //DELETE
export const UPDATE_WARNING = "/warning/update-warning/"; //PUT

export const SAVE_TERMINATION = "/termination/save-termination"; //POST
export const VIEW_TERMINATION = "/termination/view-termination/"; //GET DB
export const TERMINATION_VIEWBYID = "/termination/view-termination-by-id/"; //GET BY ID
export const TERMINATION_DELETE = "/termination/delete-termination/"; //DELETE
export const UPDATE_TERMINATION = "/termination/update-termination/"; //PUT

//HRM API END

// export const PolicyView = "/policy/get-xml";
// export const Savepolicy = "/policy/save-policy";
// export const Delete_Policy = "/policy/delete-policy/";
// export const SearchPolicy = "/policy/view-policies";
// Add to Cart PartsCatelougue
// export const Add_To_Cart_PartsCatelougue = "/cart/add-to-cart";
// export const Add_To_Cart_Get = "/cart/get-cart-items/";
// export const Delete_CartItem_PartsCat = "/cart/remove-cart-item";

// currency converter api
export const Currency_Convertor = "https://api.exchangerate-api.com/v4/latest/";

// delivery Address
// export const GET_Delivery_Address = "/deliveryAddress/get-delivery-address/";
// export const Delete_Delivery_Address =
//   "/deliveryAddress/delete-delivery-address/";
// export const Save_Delivery_Address = "/deliveryAddress/save-delivery-address";

// end Delivery Address

// product WIKI
// export const CRAETE_PRODUCT_WIKI = "/product-wiki/save-product-wiki";
// export const VIEW_PRODUCT_WIKI = "/product-wiki/view-product-wiki";
export const DELETE_PRODUCT_WIKI = "/product-wiki/delete-product-wiki/";
export const UPDATE_PRODUCT_WIKI = "/product-wiki/update-product-wiki/";
export const COMMENT_PRODUCT_WIKI = "/product-wiki/comment-add/";

// hrm
export const Rule_List = "/rule-creation/view-rules/";
export const Working_Hours = "/holiday/workingHours";
export const Working_Hours_ViewOne = "/holiday/viewOne-working/";
export const Working_Hours_DeleteOne = "/holiday/delete-working/";
export const Working_Hours_UpdateOne = "/holiday/update-working/";
export const Working_Hours_get = "/holiday/view-working/";

//////
export const Save_Announcement = "/annoucement/save-annoucement";
export const Annoucement_List = "/annoucement/view-annoucement/";
export const Announcement_by_ID = "/annoucement/view-annoucement-by-id/";
export const AnnouncmentDelete_By_ID = "/annoucement/delete-annoucement/";
export const Announcement_Update = "/annoucement/update-annoucement/";
////////

///// Create user Branch
export const CreateBranch = "/branch/save-branch";
export const ListBranch = "/branch/view-branch/";
export const ViewOneBranch = "/branch/view-branch-by-id/";
export const DeleteOneBranch = "/branch/delete-branch/";
export const UpdateOneBranch = "/branch/update-branch/";

////  face attendance
export const DeleteOneFace = "/api/deleteFace";
export const localDataAttendance = "/api/localDataAttendance";
export const UpdateAttendanceByMonth = "/api/attendanceAwsUpdate"; //put
//
/// end face attendance

// DashBoard APi

export const SalesCalculation = "/order/sales-calculated/";
export const stock_calculate = "/warehouse/stock-calculate/"; //done by sadik sir
export const TransactionCalculation = "/receipt/transaction-calculate/";
export const LowStock_Calculation = "/product/view-stock-alert/";
export const DeadParty_Calculation = "/customer/dead-party/";

//DashBoard End Api

// Expenses API "Start"

export const Create_Expense_Account = "/expenses/save-expenses"; //post
export const View_Expense_Account = "/expenses/view-expenses/"; //get
export const Delete_Expense_Account = "/expenses/delete-expenses/"; //delete
export const Update_Expense_Account = "/expenses/update-expenses/"; //put

//Expenses API End here

//Credit/debit Note Add

export const Create_credit_Note = "/credit-note/save-credit-note";
export const Create_Debit_Note = "/debit-note/save-debit-note";
// end credit/Debit Note

//last ledger Balance

export const Last_Ledger_Balance = "/ledger/view-last-ledger/";

//end last Ledger Balance

// find product at warehouse
export const Find_Product_InWarehose = "/good-dispatch/product-warehouse/";
//
