import {
  Create_warehouse_save,
  Purchase_Order_List,
  Purchase_OrderViewOne,
  Debit_note_Order_List,
  Credit_note_Order_List,
  GoodDispatch_xmlView,
  SAVE_GoodDispatch,
  Create_Role_by_Master,
  Stock_trx_FtoW,
  DeliveryBoy_AssignedList,
  Get_Damaged_stock,
  Save_Damaged_stock,
  Delete_Damaged_stock,
  view_Sales_order_List,
  Goods_Delivery_OTP,
  Goods_Delivery_OTP_Auth,
  Warehouse_OutwardStock_list,
  Warehouse_Stock,
  Warehouse_Inward_list,
  Order_DisPatchList,
  Stock_trx_WarehousetoWareHouse,
  Edit_Status_DispatchList,
  View_Wareahouse_id,
  Stock_update,
  GoodDispatch_List,
  Edit_GoodDispatch,
  Stock_trx_FtoW_List,
  View_Company_Details,
  Purchase_Return,
  Purchase_Return_List,
  Purchase_Edit_Order,
  Purchase_Status_Order,
  Place_Order_List,
  Update_Damaged_stock,
  Save_Place_Order,
  SavePurchase_Order,
  Sales_OrderTo_DispatchList,
  Sales_Return_Product,
  Place_ORder_Return_Product,
  Place_Order_Edit,
  Sales_Pending_StatusChange,
  Sales_Return_ProductList,
  Get_Role,
  Get_Role_by_id,
  View_Promotion_List,
  Delete_Category,
  Save_Promotion,
  Delete_Sub_Category,
  View_Cat_by_id,
  Update_Category,
  Update_Role,
  view_create_order_history,
  Sales_Edit_Order,
  Update_Sub_Category,
  Delete_Sales_person,
  Create_Warehouse_List,
  Create_Target_save,
  Update_Sales_Manager_save,
  Delete_SalesManager_person,
  Create_Salesmanager_save,
  Create_transporter_xmlView,
  Create_Sales_person_save,
  Update_Sales_person_save,
  Create_Company_Details,
  Create_Sales_person_List,
  Create_transporter_save,
  Create_Target_List,
  Delete_target_INlist,
  Update_target_INlist,
  Create_Transporter_List,
  Delete_Transporter_List,
  Create_SalesMan_xmlView,
  Create_Customer_Update,
  Create_SalesManager_xmlView,
  Create_Target_xml_view,
  Create_unit_xmlView,
  AddPrimaryUnit,
  BaseUnitList,
  Create_unit_save,
  Create_unit_List,
  Delete_Unit_List,
  Unit_ViewOne,
  Unit_Update,
  Create_Category,
  Save_Product,
  Save_Order,
  Create_SubCategory,
  Create_Party_List,
  Create_Party_save,
  ProductList_View,
  Create_Product_XMLView,
  Category_List,
  Create_Account_xmlView,
  Create_Customer_xmlView,
  Delete_individual_Target,
  Create_Customer_save,
  Create_Customer_List,
  Create_Parts,
  customerRegistration,
  Create_Role,
  Sevice_Card_List,
  Create_Account_save,
  Create_Account_List,
  Create_User_List,
  Delete_Customer_List,
  Delete_Account_List,
  Create_Account_Update,
  SpartPart_Upload,
  orders_Upload,
  Inspection_Upload,
  Invoice_Upload,
  ServiceCenter_Upload,
  Supplier_Upload,
  Supports_Upload,
  Customer_Upload,
  // PlaceOrder_post,
  Campaign_Upload,
  Dealer_Upload,
  Distributor_Upload,
  Warehouse_Upload,
  Service_Upload,
  Part_catelougue,
  Sevice_Card_DeleteOne,
  Service_Rate_Upload,
  Products_Upload,
  Spare_Parts,
  Login_User,
  Login_OTP,
  Part_CatalogueView,
  createWarehouseView,
  Spare_PartsView,
  SparePart_CatalogueList,
  Orders_View,
  CampaignList_View,
  Edit_Profile,
  SupportsUpload_View,
  Inspection_View,
  Servicing_View,
  WareHouseUpload_View,
  Customer_Upload_View,
  invoice_billing_View,
  Dealers_View,
  Supplier_View,
  Sales_Manager_List,
  Distributor_View,
  ProductUpload_View,
  Currency_Convertor,
  Target_Achievement,
  Factory_Stock,
  orders_ID,
  Create_order_by_cashbook,
  CashbookList,
  Create_Ware_House,
  delet_product_item,
  create_row_material,
  Create_Product_List,
  Delete_Product_Item,
  Stock_Report_List,
} from "./Api";
import axiosConfig from "../axiosConfig";
import dotenv from "dotenv";
import { data } from "../views/apps/ecommerce/shop/shopData";
dotenv.config();

// const apiKey = process.env.REACT_APP_API_KEY;

// const secretKey = process.env.REACT_APP_SECRET_KEY;
// console.log(`API Key: ${apiKey}`);
// console.log(`Secret Key: ${secretKey}`);

// guwahati api calling open

export const Cashbook_List = async (id, db) => {
  let response = await axiosConfig
    .get(`${CashbookList + id}/` + db)
    .then(res => res.data);
  return response;
};
export const StockReportList = async id => {
  let response = await axiosConfig
    .get(`${Stock_Report_List}` + id)
    .then(res => res.data);
  return response;
};

export const Stock_trxFactorytoWList = async id => {
  let response = await axiosConfig
    .get(`${Stock_trx_FtoW_List}` + id)
    .then(res => res.data);
  return response;
};
// post api for create order by cashbook
export const createrowmaterial = async data => {
  let response = await axiosConfig
    .post(`${create_row_material}`, data)
    .then(res => res.data);
  return response;
};
export const Ordercashbook = async data => {
  let response = await axiosConfig
    .post(`${Create_order_by_cashbook}`, data)
    .then(res => res.data);
  return response;
};

// export const CreateWarehousesave = async data => {
export const StocktrxFtoW = async data => {
  let response = await axiosConfig
    .post(`${Stock_trx_FtoW}`, data)
    .then(res => res.data);
  return response;
};

export const WarehousetoWareHouseTrx = async data => {
  let response = await axiosConfig
    .post(`${Stock_trx_WarehousetoWareHouse}`, data)
    .then(res => res.data);
  return response;
};
export const CreateWarehousesave = async data => {
  let response = await axiosConfig
    .post(`${Create_warehouse_save}`, data)
    .then(res => res.data);
  return response;
};

export const CreateWarehouseList = async id => {
  let response = await axiosConfig
    .get(`${Create_Warehouse_List}` + id)
    .then(res => res.data);
  return response;
};
export const CreateWareHousegetXml = async () => {
  let response = await axiosConfig
    .get(`${Create_Ware_House}`)
    .then(res => res.data);
  return response;
};
export const Createtransporterxml = async () => {
  let response = await axiosConfig
    .get(`${Create_transporter_xmlView}`)
    .then(res => res.data);
  return response;
};

export const Createtransportersave = async data => {
  let response = await axiosConfig
    .post(`${Create_transporter_save}`, data)
    .then(res => res.data);
  return response;
};

export const SavePromotionsActivity = async data => {
  let response = await axiosConfig
    .post(`${Save_Promotion}`, data)
    .then(res => res.data);
  return response;
};
export const View_PromotionList = async (id, db) => {
  let response = await axiosConfig
    .get(`${View_Promotion_List + id}/${db}`)
    .then(res => res.data);
  return response;
};
export const CreatePartysave = async data => {
  let response = await axiosConfig
    .post(`${Create_Party_save}`, data)
    .then(res => res.data);
  return response;
};
export const CreateTransporterList = async () => {
  let response = await axiosConfig
    .get(`${Create_Transporter_List}`)
    .then(res => res.data);
  return response;
};
export const DeleteTransporterList = async id => {
  let response = await axiosConfig
    .delete(`${Delete_Transporter_List}` + id)

    .then(res => res.data);
  return response;
};
export const CreateCategory = async data => {
  let response = await axiosConfig
    .post(Create_Category, data)
    .then(res => res.data);
  return response;
};

export const CreateProductXMLView = async () => {
  let response = await axiosConfig
    .get(Create_Product_XMLView)
    .then(res => res.data);
  return response;
};
export const CreatePartyList = async () => {
  let response = await axiosConfig.get(Create_Party_List).then(res => res.data);
  return response;
};
export const CreateSubCategory = async data => {
  let response = await axiosConfig
    .post(Create_SubCategory, data)
    .then(res => res.data);
  return response;
};
export const SaveProduct = async data => {
  let response = await axiosConfig
    .post(Save_Product, data)
    .then(res => res.data);
  return response;
};

export const AllCategoryList = async (id, db) => {
  let response = await axiosConfig
    .get(`${Category_List + id}/${db}`)
    .then(res => res.data);
  return response;
};
export const ViewFactoryStock = async (id, db) => {
  let response = await axiosConfig
    .get(`${Factory_Stock}${db}`)
    .then(res => res.data);
  return response;
};

export const ViewOneWarehouseStock = async (id, db) => {
  let response = await axiosConfig
    .get(`${Warehouse_Stock + id}/${db}`)
    .then(res => res.data);
  return response;
};
export const Warehouse_Inwardlist = async id => {
  let response = await axiosConfig
    .get(`${Warehouse_Inward_list}` + id)
    .then(res => res.data);
  return response;
};
export const ProductListView = async (id, db) => {
  let response = await axiosConfig
    .get(`${ProductList_View + id}/${db}`)
    .then(res => res.data);

  return response;
};

export const CreateunitxmlView = async () => {
  let response = await axiosConfig
    .get(`${Create_unit_xmlView}`)
    .then(res => res.data);
  return response;
};
export const SaveAddPrimary_Unit = async data => {
  let response = await axiosConfig
    .post(AddPrimaryUnit, data)
    .then(res => res.data);
  return response;
};
export const BaseUnitListView = async id => {
  let response = await axiosConfig
    .get(`${BaseUnitList}/${id}`)
    .then(res => res.data);
  return response;
};
export const CreateProductList = async () => {
  let response = await axiosConfig
    .get(`${Create_Product_List}`)
    .then(res => res.data);
  return response;
};

export const SaveUnit = async data => {
  let response = await axiosConfig
    .post(Create_unit_save, data)
    .then(res => res.data);
  return response;
};

export const UnitListView = async (id, db) => {
  let response = await axiosConfig
    .get(`${Create_unit_List + id}/${db} `)
    .then(res => res.data);
  return response;
};

export const DeleteUnitList = async id => {
  let response = await axiosConfig
    .delete(`${Delete_Unit_List}` + id)
    .then(res => res.data);
  return response;
};
export const DeleteSalesperson = async id => {
  let response = await axiosConfig
    .delete(`${Delete_Sales_person}` + id)
    .then(res => res.data);
  return response;
};
export const UnitViewOne = async id => {
  let response = await axiosConfig
    .put(`${Unit_ViewOne}` + id)
    .then(res => res.data);
  return response;
};
export const UnitUpdate = async (payload, id) => {
  let response = await axiosConfig
    .put(`${Unit_Update}` + id, payload)
    .then(res => res.data);
  return response;
};
// by own
export const SaveOrder = async data => {
  let response = await axiosConfig.post(Save_Order, data).then(res => res.data);
  return response;
};
export const createOrderhistoryview = async id => {
  let response = await axiosConfig
    .get(`${view_create_order_history}` + id)
    .then(res => res.data);
  return response;
};

export const view_Sales_orderList = async (id, db) => {
  let response = await axiosConfig
    .get(`${view_Sales_order_List + id}/` + db)
    .then(res => res.data);
  return response;
};
export const SalesReturnProductList = async (id, db) => {
  let response = await axiosConfig
    .get(`${Sales_Return_ProductList}/${id}/${db}`)
    .then(res => res.data);
  return response;
};
export const SalesPendingStatusChange = async (payload, id) => {
  let response = await axiosConfig
    .put(`${Sales_Pending_StatusChange}` + id, payload)
    .then(res => res.data);
  return response;
};

export const SalesReturnProduct = async data => {
  let response = await axiosConfig
    .post(Sales_Return_Product, data)
    .then(res => res.data);
  return response;
};
export const SalesEditOrder = async (payload, id) => {
  let response = await axiosConfig
    .put(`${Sales_Edit_Order}` + id, payload)
    .then(res => res.data);
  return response;
};

// by others (place order)

export const SavePlaceOrder = async data => {
  let response = await axiosConfig
    .post(Save_Place_Order, data)
    .then(res => res.data);
  return response;
};
export const PlaceOrderViewList = async id => {
  let response = await axiosConfig
    .get(`${Place_Order_List}` + id)
    .then(res => res.data);
  return response;
};
// purchase api
export const SavePurchaseOrder = async data => {
  let response = await axiosConfig
    .post(SavePurchase_Order, data)
    .then(res => res.data);
  return response;
};

export const PurchaseOrderList = async (id, db) => {
  let response = await axiosConfig
    .get(`${Purchase_Order_List + id}/${db}`)
    .then(res => res.data);
  return response;
};
// export const PurchaseOrderList = async (id, db) => {
//   let response = await axiosConfig
//     .get(`${Customer_Due_report_List + id}/${db}`)
//     .then((res) => res.data);
//   return response;
// };

export const PurchaseOrderView = async id => {
  let response = await axiosConfig
    .get(`${Purchase_OrderViewOne}` + id)
    .then(res => res.data);
  return response;
};

export const PurchaseReturn = async data => {
  let response = await axiosConfig
    .post(Purchase_Return, data)
    .then(res => res.data);
  return response;
};
export const Purchase_ReturnList = async (id, db) => {
  let response = await axiosConfig
    .get(`${Purchase_Return_List}${id}/${db}`)
    .then(res => res.data);
  return response;
};
export const PurchaseEdit_Order = async (payload, id) => {
  let response = await axiosConfig
    .put(`${Purchase_Edit_Order}` + id, payload)
    .then(res => res.data);
  return response;
};
export const PurchaseStatusOrder = async (payload, id) => {
  let response = await axiosConfig
    .put(`${Purchase_Status_Order}` + id, payload)
    .then(res => res.data);
  return response;
};

export const PlaceOrderReturn_Product = async data => {
  let response = await axiosConfig
    .post(Place_ORder_Return_Product, data)
    .then(res => res.data);
  return response;
};

export const PlaceOrder_Edit = async (payload, id) => {
  let response = await axiosConfig
    .put(`${Place_Order_Edit}` + id, payload)
    .then(res => res.data);
  return response;
};

export const DebitnoteOrderList = async id => {
  let response = await axiosConfig
    .get(`${Debit_note_Order_List}` + id)
    .then(res => res.data);
  return response;
};
export const CreditnoteOrderList = async (id, db) => {
  let response = await axiosConfig
    .get(`${Credit_note_Order_List}` + id)
    .then(res => res.data);
  return response;
};
export const GoodDispatchxmlView = async () => {
  let response = await axiosConfig
    .get(`${GoodDispatch_xmlView}`)
    .then(res => res.data);
  return response;
};
export const Save_GoodDispatch = async data => {
  let response = await axiosConfig
    .post(SAVE_GoodDispatch, data)
    .then(res => res.data);
  return response;
};

export const GoodDispatchListView = async () => {
  let response = await axiosConfig
    .get(`${GoodDispatch_List}`)
    .then(res => res.data);
  return response;
};

export const EditGoodDispatch = async (payload, id) => {
  let response = await axiosConfig
    .put(`${Edit_GoodDispatch}` + id, payload)
    .then(res => res.data);
  return response;
};

// guwahati api calling close
export const Get_RoleList = async (id, db) => {
  let response = await axiosConfig
    .get(`${Get_Role}/${db}`)
    .then(res => res.data);
  return response;
};
export const CreateRole = async data => {
  let response = await axiosConfig
    .post(`${Create_Role}`, data)
    .then(res => res.data);
  return response;
};
export const CreateRoleByMaster = async data => {
  let response = await axiosConfig
    .post(`${Create_Role_by_Master}`, data)
    .then(res => res.data);
  return response;
};
export const Get_Role_byid = async id => {
  let response = await axiosConfig
    .get(`${Get_Role_by_id}` + id)
    .then(res => res.data);
  return response;
};
export const DeleteCategory = async id => {
  let response = await axiosConfig
    .get(`${Delete_Category}` + id)
    .then(res => res.data);
  return response;
};
export const Delete_SubCategory = async (cid, sid) => {
  let response = await axiosConfig
    .delete(`${Delete_Sub_Category}` + cid + "/subcategories/" + sid)
    .then(res => res.data);
  return response;
};
export const UpdateCategory = async (id, data) => {
  let response = await axiosConfig
    .put(`${Update_Category}` + id, data)
    .then(res => res.data);
  return response;
};
export const View_Catby_id = async id => {
  let response = await axiosConfig
    .get(`${View_Cat_by_id}` + id)
    .then(res => res.data);
  return response;
};
export const Update_SubCategory = async (cid, sid, data) => {
  let response = await axiosConfig
    .put(`${Update_Sub_Category}` + cid + "/subcategories/" + sid, data)
    .then(res => res.data);
  return response;
};
export const Update_Role_list = async (id, payload) => {
  let response = await axiosConfig
    .put(`${Update_Role}` + id, payload)
    .then(res => res.data);
  return response;
};
export const UserLogin = async data => {
  let response = await axiosConfig.post(Login_User, data).then(res => res.data);
  return response;
};
export const UserOTPVerify = async data => {
  let response = await axiosConfig.post(Login_OTP, data).then(res => res.data);
  return response;
};
export const EditUserProfile = async (id, data) => {
  let response = await axiosConfig
    .post(Edit_Profile + id, data)
    .then(res => res.data);
  return response;
};
// export const CreateRole = async () => {
//   let response = await axiosConfig
//     .post(`/admin/getProduct`)
//     .then((res) => res.data);
//   return response;
// };
export const CreateAccountView = async () => {
  let response = await axiosConfig
    .get(`${Create_Account_xmlView}`)
    .then(res => res.data);
  return response;
};

export const deletProductItem = async id => {
  let response = await axiosConfig
    .get(`${delet_product_item}` + id)
    .then(res => res.data);
  return response;
};

export const CreateCustomerxmlView = async () => {
  let response = await axiosConfig
    .get(`${Create_Customer_xmlView}`)
    .then(res => res.data);
  return response;
};
export const CreateMySalesTeam = async () => {
  let response = await axiosConfig
    .get(`${Create_SalesMan_xmlView}`)
    .then(res => res.data);
  return response;
};
export const CreateMySalesManager = async () => {
  let response = await axiosConfig
    .get(`${Create_SalesManager_xmlView}`)
    .then(res => res.data);
  return response;
};

export const CreateTargetXmlView = async () => {
  let response = await axiosConfig
    .get(`${Create_Target_xml_view}`)
    .then(res => res.data);
  return response;
};

export const Create_Sales_personList = async () => {
  let response = await axiosConfig
    .get(`${Create_Sales_person_List}`)
    .then(res => res.data);
  return response;
};
export const Create_Sales_personsave = async data => {
  let response = await axiosConfig
    .post(`${Create_Sales_person_save}`, data)
    .then(res => res.data);
  return response;
};
export const CreateAccountSave = async data => {
  let response = await axiosConfig
    .post(`${Create_Account_save}`, data)
    .then(res => res.data);
  return response;
};
export const CreateCustomersave = async data => {
  let response = await axiosConfig
    .post(`${Create_Customer_save}`, data)
    .then(res => res.data);
  return response;
};
export const Create_CompanyDetails = async data => {
  let response = await axiosConfig
    .post(`${Create_Company_Details}`, data)
    .then(res => res.data);
  return response;
};

export const ViewCompanyDetails = async (id, db) => {
  let response = await axiosConfig
    .get(`${View_Company_Details + id}/` + db)
    .then(res => res.data);
  return response;
};

export const DeleteAccount = async id => {
  let response = await axiosConfig
    .get(`${Delete_Account_List}` + id)
    .then(res => res.data);
  return response;
};
export const Deleteproductlist = async id => {
  let response = await axiosConfig
    .get(`${Delete_Product_Item}` + id)
    .then(res => res.data);
  return response;
};
export const DeleteCustomerList = async id => {
  let response = await axiosConfig
    .get(`${Delete_Customer_List}` + id)
    .then(res => res.data);
  return response;
};

export const CreateAccountList = async (id, db) => {
  let response = await axiosConfig
    // .get(`${Create_Account_List + id}`)
    .get(`${Create_Account_List + id}/${db}`)
    .then(res => res.data);
  return response;
};
export const CreateUserList = async id => {
  let response = await axiosConfig
    .get(`${Create_User_List}` + id)
    .then(res => res.data);
  return response;
};
export const CreateCustomerList = async (id, db) => {
  let response = await axiosConfig
    .get(`${Create_Customer_List + id}/${db}`)
    .then(res => res.data);
  return response;
};
export const CreateAccountUpdate = async (id, formdata) => {
  // console.log(id, formdata);
  let response = await axiosConfig
    .post(`${Create_Account_Update}` + id, formdata)
    .then(res => res.data);
  return response;
};
export const UpdateSalespersonsave = async (id, formdata) => {
  // console.log(id, formdata);
  let response = await axiosConfig
    .put(`${Update_Sales_person_save}` + id, formdata)
    .then(res => res.data);
  return response;
};
export const CreateCustomerUpdate = async (id, formdata) => {
  // console.log(id, formdata);
  let response = await axiosConfig
    .post(`${Create_Customer_Update}` + id, formdata)
    .then(res => res.data);
  return response;
};

export const CreateParts = async () => {
  let response = await axiosConfig.get(`${Create_Parts}`).then(res => res.data);
  return response;
};
export const Customer_Registration = async () => {
  let response = await axiosConfig
    .get(`${customerRegistration}`)
    .then(res => res.data);
  return response;
};

// part
// export const PartCatelougue = async formdata => {
// part upload
export const PartCatelougue = async formdata => {
  console.log(formdata);
  let response = await axiosConfig
    .post(`${Part_catelougue}`, formdata)
    .then(res => res.data);
  return response;
};
export const SpareParts = async formdata => {
  console.log(formdata);
  let response = await axiosConfig
    .post(`${SpartPart_Upload}`, formdata)
    .then(res => res.data);
  return response;
};
export const ProdctsUpload = async formdata => {
  console.log(formdata);
  let response = await axiosConfig
    .post(`${Products_Upload}`, formdata)
    .then(res => res.data);
  return response;
};
export const Orders = async formdata => {
  console.log(formdata);
  let response = await axiosConfig
    .post(`${orders_Upload}`, formdata)
    .then(res => res.data);
  return response;
};
export const InspectionUpload = async formdata => {
  console.log(formdata);
  let response = await axiosConfig
    .post(`${Inspection_Upload}`, formdata)
    .then(res => res.data);
  return response;
};
export const InvoiceUpload = async formdata => {
  console.log(formdata);
  let response = await axiosConfig
    .post(`${Invoice_Upload}`, formdata)
    .then(res => res.data);
  return response;
};
export const SupporttUpload = async formdata => {
  console.log(formdata);
  let response = await axiosConfig
    .post(`${Supports_Upload}`, formdata)
    .then(res => res.data);
  return response;
};
export const ServicingUpload = async formdata => {
  console.log(formdata);
  let response = await axiosConfig
    .post(`${Service_Upload}`, formdata)
    .then(res => res.data);
  return response;
};
export const WareHouseUpload = async formdata => {
  console.log(formdata);
  let response = await axiosConfig
    .post(`${Warehouse_Upload}`, formdata)
    .then(res => res.data);
  return response;
};
export const DistributorUpload = async formdata => {
  console.log(formdata);
  let response = await axiosConfig
    .post(`${Distributor_Upload}`, formdata)
    .then(res => res.data);
  return response;
};
export const DealerUpload = async formdata => {
  console.log(formdata);
  let response = await axiosConfig
    .post(`${Dealer_Upload}`, formdata)
    .then(res => res.data);
  return response;
};
export const SupplierUpload = async formdata => {
  console.log(formdata);
  let response = await axiosConfig
    .post(`${Supplier_Upload}`, formdata)
    .then(res => res.data);
  return response;
};
export const ServiceCenterUpload = async formdata => {
  console.log(formdata);
  let response = await axiosConfig
    .post(`${ServiceCenter_Upload}`, formdata)
    .then(res => res.data);
  return response;
};
export const CustomerDataUpload = async formdata => {
  console.log(formdata);
  let response = await axiosConfig
    .post(`${Customer_Upload}`, formdata)
    .then(res => res.data);
  return response;
};
export const CampaignUpload = async formdata => {
  console.log(formdata);
  let response = await axiosConfig
    .post(`${Campaign_Upload}`, formdata)
    .then(res => res.data);
  return response;
};
export const ServiceRate = async formdata => {
  console.log(formdata);
  let response = await axiosConfig
    .post(`${Service_Rate_Upload}`, formdata)
    .then(res => res.data);
  return response;
};

// End import xls file

export const PartCatalogueView = async () => {
  let response = await axiosConfig
    .get(`${Part_CatalogueView}`)
    .then(res => res.data);
  return response;
};

export const SparesPartsList = async () => {
  let response = await axiosConfig.get(`${Spare_Parts}`).then(res => res.data);
  return response;
};
export const SparesPartsView = async () => {
  let response = await axiosConfig
    .get(`${Spare_PartsView}`)
    .then(res => res.data);
  return response;
};
export const SparePart_List = async () => {
  let response = await axiosConfig
    .get(`${SparePart_CatalogueList}`)
    .then(res => res.data);
  return response;
};
export const OrdersViewList = async () => {
  let response = await axiosConfig.get(`${Orders_View}`).then(res => res.data);
  return response;
};
export const SupportsUploadView = async () => {
  let response = await axiosConfig
    .get(`${SupportsUpload_View}`)
    .then(res => res.data);
  return response;
};
export const InspectionView = async () => {
  let response = await axiosConfig
    .get(`${Inspection_View}`)
    .then(res => res.data);
  return response;
};
export const ServicingView = async () => {
  let response = await axiosConfig
    .get(`${Servicing_View}`)
    .then(res => res.data);
  return response;
};
export const SeviceCardList = async () => {
  let response = await axiosConfig
    .get(`${Sevice_Card_List}`)
    .then(res => res.data);
  return response;
};
export const SeviceCardDeleteOne = async id => {
  let response = await axiosConfig
    .get(`${Sevice_Card_DeleteOne}` + id)
    .then(res => res.data);
  return response;
};
export const WareHouseUploadView = async () => {
  let response = await axiosConfig
    .get(`${WareHouseUpload_View}`)
    .then(res => res.data);
  return response;
};
export const ProductUploadView = async () => {
  let response = await axiosConfig
    .get(`${ProductUpload_View}`)
    .then(res => res.data);
  return response;
};
export const invoice_billingView = async () => {
  let response = await axiosConfig
    .get(`${invoice_billing_View}`)
    .then(res => res.data);
  return response;
};
export const CustomerUploadView = async () => {
  let response = await axiosConfig
    .get(`${Customer_Upload_View}`)
    .then(res => res.data);
  return response;
};
export const DistributorView = async () => {
  let response = await axiosConfig
    .get(`${Distributor_View}`)
    .then(res => res.data);
  return response;
};
export const DealersView = async () => {
  let response = await axiosConfig.get(`${Dealers_View}`).then(res => res.data);
  return response;
};
export const SupplierView = async () => {
  let response = await axiosConfig
    .get(`${Supplier_View}`)
    .then(res => res.data);
  return response;
};

// End upload Listing
export const CampaignListView = async () => {
  let response = await axiosConfig
    .get(`${CampaignList_View}`)
    .then(res => res.data);
  return response;
};

export const createWarehouseViewData = async () => {
  let response = await axiosConfig
    .get(`${createWarehouseView}`)
    .then(res => res.data);
  return response;
};

// currency convertor

export const CurrencyConvertor = async currency => {
  let response = await axiosConfig
    .get(`${Currency_Convertor}` + currency)
    .then(res => res.data);
  return response;
};

export const CreateOrder_ID = async () => {
  let response = await axiosConfig.get(`${orders_ID}`).then(res => res.data);
  return response;
};

// create Sales Manger

export const Create_Salesmanagersave = async data => {
  let response = await axiosConfig
    .post(`${Create_Salesmanager_save}`, data)
    .then(res => res.data);
  return response;
};
//
export const Sales_ManagerList = async () => {
  let response = await axiosConfig
    .get(`${Sales_Manager_List}`)
    .then(res => res.data);
  return response;
};
export const DeleteSalesManagerperson = async id => {
  let response = await axiosConfig
    .delete(`${Delete_SalesManager_person}` + id)

    .then(res => res.data);
  return response;
};
export const Update_Sales_Managersave = async (id, data) => {
  let response = await axiosConfig
    .put(Update_Sales_Manager_save + id, data)
    .then(res => res.data);
  return response;
};
//

// create target
export const Create_Targetsave = async data => {
  let response = await axiosConfig
    .post(Create_Target_save, data)
    .then(res => res.data);
  return response;
};
export const Sales_OrderToDispatchList = async (id, data) => {
  let response = await axiosConfig
    .post(Sales_OrderTo_DispatchList + id, data)
    .then(res => res.data);
  return response;
};
export const OrderDisPatchList = async (id, db) => {
  let response = await axiosConfig
    .get(`${Order_DisPatchList + id}/${db}`)
    .then(res => res.data);
  return response;
};
export const Create_TargetList = async (id, db) => {
  let response = await axiosConfig
    .get(`${Create_Target_List + id}/${db}`)
    .then(res => res.data);
  return response;
};
export const Delete_targetINlist = async id => {
  let response = await axiosConfig
    .delete(`${Delete_target_INlist}` + id)

    .then(res => res.data);
  return response;
};
export const Delete_individualTarget = async (id, id1) => {
  let response = await axiosConfig
    .delete(`${Delete_individual_Target}` + id + "/product/" + id1)
    .then(res => res.data);
  return response;
};
export const Update_targetINlist = async (id, data) => {
  let response = await axiosConfig
    .put(Update_target_INlist + id, data)
    .then(res => res.data);
  return response;
};
export const Edit_StatusDispatchList = async (id, data) => {
  let response = await axiosConfig
    .put(`${Edit_Status_DispatchList}` + id, data)
    .then(res => res.data);
  return response;
};

// warehouse view by id aj gproup
// View_Wareahouse_id;
export const View_Wareahouseid = async id => {
  let response = await axiosConfig
    .get(`${View_Wareahouse_id}` + id)
    .then(res => res.data);
  return response;
};
export const WarehouseOutwardStocklist = async id => {
  let response = await axiosConfig
    .get(`${Warehouse_OutwardStock_list}` + id)
    .then(res => res.data);
  return response;
};

export const DeliveryBoyAssignedList = async (id, db) => {
  let response = await axiosConfig
    .get(`${DeliveryBoy_AssignedList + id}/` + db)
    .then(res => res.data);
  return response;
};
export const Goods_DeliveryOTP = async id => {
  let response = await axiosConfig
    .get(`${Goods_Delivery_OTP}` + id)
    .then(res => res.data);
  return response;
};
export const TargetAchievement = async (id, db) => {
  let response = await axiosConfig
    .get(`${Target_Achievement}` + id)
    .then(res => res.data);
  return response;
};
export const Goods_DeliveryOTP_Auth = async (id, data) => {
  let response = await axiosConfig
    .post(`${Goods_Delivery_OTP_Auth}` + id, data)
    .then(res => res.data);
  return response;
};
export const Stockupdate = async (id, data) => {
  let response = await axiosConfig
    .put(`${Stock_update}` + id, data)
    .then(res => res.data);
  return response;
};

// damaged stock

export const _BulkUpload = async (URL, payload) => {
  let response = await axiosConfig
    .post(`${URL}`, payload)
    .then(res => res.data);
  return response;
};
export const Get_Damagedstock = async id => {
  let response = await axiosConfig
    .get(`${Get_Damaged_stock}` + id)
    .then(res => res.data);
  return response;
};
export const Save_Damagedstock = async data => {
  let response = await axiosConfig
    .post(`${Save_Damaged_stock}`, data)
    .then(res => res.data);
  return response;
};
export const Delete_Damagedstock = async (warehouseid, id) => {
  let response = await axiosConfig
    .delete(`${Delete_Damaged_stock + warehouseid}/${id}`)
    .then(res => res.data);
  return response;
};
export const Update_Damagedstock = async (userid, id, data) => {
  let response = await axiosConfig
    .put(`${Update_Damaged_stock + userid}/${id}`, data)
    .then(res => res.data);
  return response;
};
export const _Post = async (URL, id, data) => {
  let response = await axiosConfig
    .post(`${URL}` + id, data)
    .then(res => res.data);
  return response;
};
export const _PostSave = async (URL, data) => {
  let response = await axiosConfig.post(`${URL}`, data).then(res => res.data);
  return response;
};

export const _Get = async (URL, id, data) => {
  let response = await axiosConfig
    .get(`${URL}` + id, data)
    .then(res => res.data);
  return response;
};
export const _GetList = async (URL, id, data) => {
  let response = await axiosConfig.get(`${URL}`, data).then(res => res.data);
  return response;
};
export const _GetListData = async (URL, db) => {
  let response = await axiosConfig.get(`${URL}` + db).then(res => res.data);
  return response;
};

export const _Put = async (URL, id, data) => {
  let response = await axiosConfig
    .put(`${URL}` + id, data)
    .then(res => res.data);
  return response;
};
export const _Delete = async (URL, id, data) => {
  let response = await axiosConfig
    .delete(`${URL}` + id, data)
    .then(res => res.data);
  return response;
};
export const _DeleteAll = async (URL, data) => {
  let response = await axiosConfig.post(URL, data).then(res => res.data);
  return response;
};
