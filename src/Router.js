import React, { Suspense, lazy } from "react";
import { Router, Switch, Route, HashRouter } from "react-router-dom";
import { history } from "./history";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import Spinner from "./components/@vuexy/spinner/Loading-spinner";

import { ContextLayout } from "./utility/context/Layout";
import AddPurchaseOrder from "./views/apps/freshlist/order/purchase/AddPurchaseOrder";
import LowStockPurchase from "./views/apps/freshlist/order/purchase/LowStockPurchase";

const MainDash = lazy(() => import("./views/dashboard/analytics/MainDash"));

const ecommerceDashboard = lazy(() =>
  import("./views/dashboard/ecommerce/EcommerceDashboard")
);

const Cashbook = lazy(() => import("./views/apps/freshlist/parts/Cashbook"));
const PartyLedger = lazy(() =>
  import("./views/apps/freshlist/parts/PartyLedger")
);

const UserLedger = lazy(() =>
  import("./views/apps/freshlist/parts/UserLedger")
);
const ReceiptList = lazy(() => import("./views/apps/freshlist/parts/Receipt"));

const CustomerReview = lazy(() =>
  import("./views/apps/freshlist/customer/CustomerReview")
);

const FilterOption = lazy(() =>
  import("./views/apps/freshlist/customer/FilterOption")
);
const Summary = lazy(() => import("./views/apps/freshlist/customer/Summary"));
const AddFund = lazy(() => import("./views/apps/freshlist/customer/AddFund"));
const EditCustomer = lazy(() =>
  import("./views/apps/freshlist/customer/EditCustomer")
);

const Login = lazy(() => import("./views/pages/authentication/login/Login"));

//order

const BillingLockList = lazy(() =>
  import("./views/apps/freshlist/order/OrderSearch")
);
const Achivement = lazy(() =>
  import("./views/apps/freshlist/order/Achivement")
);

const editPlaceorder = lazy(() =>
  import("./views/apps/freshlist/order/EditPlaceOrder")
);

const EditOrder = lazy(() => import("./views/apps/freshlist/order/EditOrder"));
const EditProductionProcess = lazy(() =>
  import("./views/apps/freshlist/order/EditProductionProcess")
);
const AddReturnProductionProduct = lazy(() =>
  import("./views/apps/freshlist/order/AddReturnProductionProduct")
);
const ViewAll = lazy(() => import("./views/apps/freshlist/order/ViewAll"));

const ConfirmedOrder = lazy(() =>
  import("./views/apps/freshlist/order/CompleteOrder")
);
// import HRM
const Attenreport = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/reportAttenList")
);

const Leavereport = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/reportLeaveList")
);

const Payrollreport = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/reportPayrollList")
);

const Timesheetreport = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/reportTimesheetList")
);

const ExpensesList = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/expensesList")
);

const ExpensesForm = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/RecPLace/expenseForm")
);

const ViewRules = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/Setrules/viewrules")
);

const EditRules = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/Setrules/editrules")
);

const JobApView = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/HrmjpbApp/JobapView")
);

const JobapEdList = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/HrmjpbApp/JobapeditList")
);

const InterView_viewList = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/HrminterView/InterView")
);
const IntereditList = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/HrminterView/InterViewedit")
);

const OfferViewlist = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/HrmOfferletr/OfferltrView")
);
const OfferEditlist = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/HrmOfferletr/OfferletrEdit")
);
const PracticsViewform = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/HrmPractskill/PracticsView")
);

const PracticsEditform = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/HrmPractskill/PracticsEdit")
);
const TrainingViewForm = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/HrmTraining/trainingView")
);
const TrainingEditForm = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/HrmTraining/trainingEdit")
);

const EmployeViewForm = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/HrmEmploye/EmployeView")
);

const EmployEditForm = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/HrmEmploye/EmployeEdit")
);

//

const PayslipForm = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/RecPLace/setsalaryForm")
);
const ViewOneSalary = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/RecPLace/ViewOneSalary")
);

const JobbForm = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/RecPLace/jobForm")
);

const JobeditList = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/ViewHrm/JobeditList")
);

const JobViewform = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/ViewHrm/JobviewList")
);

const AppResultForm = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/RecPLace/applresultForm")
);
const MockTestForm = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/RecPLace/practskillform")
);
const InterviewForm = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/RecPLace/interviewForm")
);

const TrainingForm = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/RecPLace/trainingForm")
);

const OfferLetterForm = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/RecPLace/offerletterForm")
);

const EmployeeProfileForm = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/RecPLace/createempForm")
);
const JobList = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/JobList")
);

const JobappList = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/jobappList")
);

const practiceList = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/practiceList")
);

const InterviewList = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/interviewList")
);
const offerList = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/offerList")
);

const ApprList = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/apprList")
);

const Setpaysliplist = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/setpayslip")
);

const HolidayList = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/holidayList")
);
const ShiftList = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/ShiftList")
);
const BranchList = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/BranchList")
);
const Holidayform = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/Time-sheet/holidayform")
);

const Apprform = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/TCPA/apprform")
);
const ApprformEdit = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/TCPA/AppraisalEdit")
);

const CreateemployeList = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/empList")
);
const Setsalarlist = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/setsalarList")
);
const PayslipListForm = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/Payroll/payslipform")
);
const TrainingList = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/trainList")
);
/////////////////////////////////////

const AttendList = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/attenList")
);
const LogsList = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/LogsList")
);

const AttenForm = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/Time-sheet/attenform")
);

const AttenviewForm = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/Time-sheet/attenviewform")
);

const AtteneditForm = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/Time-sheet/atteneditform")
);

////////////////////

const LeaveList = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/leaveList")
);

const LeaveForm = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/Time-sheet/leaveform")
);

const LeaveViewForm = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/Time-sheet/leaveviewform")
);

const LeaveEditForm = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/Time-sheet/leaveeditform")
);

const Manageleave = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/Time-sheet/manageleave")
);
const ManageLeaveList = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/Time-sheet/ManageLeaveList")
);

const ManageLeaveEdit = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/Time-sheet/ManageLeaveEdit")
);
const ManageView = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/Time-sheet/ManageView")
);
////////////////////

const IndicList = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/indicatList")
);

const Indicatform = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/Perfomence/indicatform")
);

const ViewIndicatform = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/Perfomence/viewindicate")
);

const EditIndicatform = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/Perfomence/editindicate")
);

//////////////////////////////////

const IncenForm = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/TCPA/incenform")
);

const BonusForm = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/TCPA/bonusform")
);
const MarkPaidSalary = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/TCPA/MarkPaidSalary")
);
const BonusEdit = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/TCPA/BonusEdit")
);

const GoalForm = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/TCPA/goltrackform")
);
const IncenList = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/incentList")
);

const incentView = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/incentView")
);
const incentEdit = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/incentEdit")
);
const BonusList = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/bonusList")
);
const GoalList = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/goalList")
);

const AdvanceList = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/advanceList")
);
const OvertList = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/overtList")
);
const InsurList = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/insuList")
);

const RuleList = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/ruleList")
);
const Pflist = lazy(() => import("./views/apps/freshlist/customer/HRM/pfList"));
const Esilist = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/esiList")
);

const Lonelist = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/loneList")
);
const Talist = lazy(() => import("./views/apps/freshlist/customer/HRM/taList"));
const Dalist = lazy(() => import("./views/apps/freshlist/customer/HRM/daList"));
const Travllinglist = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/travlingList")
);

const SetRules = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/Setrules/rulesform")
);

const Taform = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/Payroll/taform")
);
const Daform = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/Payroll/daform")
);
const Pfform = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/Payroll/pfform")
);
const Esiform = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/Payroll/esiform")
);
const Loanform = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/Payroll/loanform")
);

const Travellingform = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/Payroll/travellingform")
);

const Insurance = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/Payroll/Insurance")
);

const Over = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/Payroll/OverForm")
);

const Advance = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/Payroll/advanceForm")
);

const Resignation = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/resignationList")
);
const Complaint = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/complainList")
);
const Warning = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/warningList")
);
const Announcement = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/announceList")
);
const AdvanceWages = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/AdvaceWages.js")
);
const EmilList = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/EmilList")
);
const TerminationForm = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/HRMAdminForms/termiForm")
);
const ComplaintEditForm = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/HRMAdminForms/complaintEDITform")
);

const ComplaintViewForm = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/HRMAdminForms/complaintVIEWform")
);

const ResignationEditForm = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/HRMAdminForms/resignationEDIT")
);

const ResignationViewForm = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/HRMAdminForms/resignationVIEW")
);

const WarningEditForm = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/HRMAdminForms/warningEDIT")
);

const WarningViewForm = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/HRMAdminForms/warningVIEW")
);

const TerminationEditForm = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/HRMAdminForms/terminationEDIT")
);

const TerminationViewForm = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/HRMAdminForms/terminationVIEW")
);
const TermList = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/termList")
);
const ResignationForm = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/HRMAdminForms/resignationForm")
);
const ComplaintForm = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/HRMAdminForms/complainForm")
);
const WarningForm = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/HRMAdminForms/warningForm")
);
const AnnounceForm = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/HRMAdminForms/announceForm")
);
const AnnounceView = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/HRMAdminForms/ViewAnnouncement")
);
const AnnounceFormEdit = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/HRMAdminForms/AnnouncenmentEdit")
);
const EmployeeList = lazy(() =>
  import("./views/apps/freshlist/customer/HRM/EmployeeList")
);

// hrm end by jayesh adsule

// hrm end by jayesh adsule

// end import hrm
// const ProductReport = lazy(() =>
//   import("./views/apps/freshlist/report/ProductReport")
// );

// const TaxReport = lazy(() => import("./views/apps/freshlist/report/TaxReport"));

// Category
const CategoryList = lazy(() =>
  import("./views/apps/freshlist/category/CategoryList")
);
const AddCategory = lazy(() =>
  import("./views/apps/freshlist/category/AddCategory")
);
const EditCategory = lazy(() =>
  import("./views/apps/freshlist/category/EditCategory")
);
const ViewCategory = lazy(() =>
  import("./views/apps/freshlist/category/ViewCategory")
);

const SubCategoryList = lazy(() =>
  import("./views/apps/freshlist/subcategory/SubCategoryList")
);

const AddSubCategory = lazy(() =>
  import("./views/apps/freshlist/subcategory/AddSubCategory")
);
const EditSubCategory = lazy(() =>
  import("./views/apps/freshlist/subcategory/EditSubCategory")
);

const ClosingStock = lazy(() =>
  import("./views/apps/freshlist/customer/ProductWIKI/ClosingStock")
);
const LowStock = lazy(() =>
  import("./views/apps/freshlist/customer/ProductWIKI/LowStock")
);
const LowStockList = lazy(() =>
  import("./views/apps/freshlist/customer/ProductWIKI/LowStockList")
);
const WarehouseShortageReport = lazy(() =>
  import("./views/apps/freshlist/customer/ProductWIKI/LowStockReport")
);
const DamagedStock = lazy(() =>
  import("./views/apps/freshlist/customer/ProductWIKI/DamagedStock")
);
const StockReport = lazy(() =>
  import("./views/apps/freshlist/customer/StockManagement/StockReport")
);

const StockTransfer = lazy(() =>
  import("./views/apps/freshlist/customer/StockManagement/StockTransfer")
);

const CreateOrder = lazy(() =>
  import("./views/apps/freshlist/order/CreateOrder")
);
const CreateInvoice = lazy(() =>
  import("./views/apps/freshlist/order/CreateInvoice")
);
const CreateChallan = lazy(() =>
  import("./views/apps/freshlist/order/CreateChallan")
);
const CreatePayment = lazy(() =>
  import("./views/apps/freshlist/order/CreatePayment")
);
const CreateReceipt = lazy(() =>
  import("./views/apps/freshlist/order/CreateReceipt")
);
const Addorderbycashbook = lazy(() =>
  import("./views/apps/freshlist/parts/Addorderbycashbook")
);
const OrderList = lazy(() => import("./views/apps/freshlist/order/OrderList"));
const SalesLead = lazy(() => import("./views/apps/freshlist/order/SalesLead"));
const EditSalesLead = lazy(() =>
  import("./views/apps/freshlist/order/salesLead/EditSalesLead")
);
const PendingOrder = lazy(() =>
  import("./views/apps/freshlist/order/PendingOrder")
);
const CancelledOrder = lazy(() =>
  import("./views/apps/freshlist/order/CancelledOrder")
);
const EditPending = lazy(() =>
  import("./views/apps/freshlist/order/pending/EditPending")
);

const PurchaseOrderList = lazy(() =>
  import("./views/apps/freshlist/order/purchase/PurchaseOrderList")
);
const PurchaseReturnList = lazy(() =>
  import("./views/apps/freshlist/order/purchase/PurchaseReturnList")
);
const PendingPurchase = lazy(() =>
  import("./views/apps/freshlist/order/purchase/PendingPurchase")
);
const PurchaseCompleted = lazy(() =>
  import("./views/apps/freshlist/order/purchase/PurchaseCompleted")
);
const PaymentListAll = lazy(() =>
  import("./views/apps/freshlist/order/purchase/PaymentList")
);
const EditPurchase = lazy(() =>
  import("./views/apps/freshlist/order/purchase/EditPurchase")
);
const UpdatePurchseOrder = lazy(() =>
  import("./views/apps/freshlist/order/purchase/UpdatePurchaseOrder")
);
const CreatePurchaseInvoice = lazy(() =>
  import("./views/apps/freshlist/order/purchase/CreatePurchaseInvoice")
);
const PurchaseReturn = lazy(() =>
  import("./views/apps/freshlist/order/purchase/PurchaseReturn")
);

const SalesReturnView = lazy(() =>
  import("./views/apps/freshlist/order/SalesReturnView")
);
const AddPlaceOrder = lazy(() =>
  import("./views/apps/freshlist/order/PlaceOrder")
);
const PlaceOrderList = lazy(() =>
  import("./views/apps/freshlist/order/PlaceOrderList")
);
const PlaceOrderReturn = lazy(() =>
  import("./views/apps/freshlist/order/PlaceOrderReturn")
);

const InvoiceGenerator = lazy(() =>
  import("./views/apps/freshlist/subcategory/InvoiceGenerator")
);

const WarehouseStock = lazy(() =>
  import("./views/apps/freshlist/subcategory/WarehouseStock")
);

const WareHouseListSoft = lazy(() =>
  import("./views/apps/freshlist/customer/warehouse/WareHouseList")
);
const SettingTab = lazy(() =>
  import("./views/apps/freshlist/customer/warehouse/SettingTab")
);

const CreateWareHouse = lazy(() =>
  import("./views/apps/freshlist/customer/warehouse/CreateWareHouse")
);
const Inwordwarehousecreate = lazy(() =>
  import("./views/apps/freshlist/customer/warehouse/Inwordwarehousecreate")
);
const RawMaterialInward = lazy(() =>
  import("./views/apps/freshlist/customer/warehouse/RawMaterialInward")
);
const RawmaterialOutward = lazy(() =>
  import("./views/apps/freshlist/customer/warehouse/RawmaterialOutward")
);
const StockTransferwarehouse = lazy(() =>
  import("./views/apps/freshlist/customer/warehouse/StockTransfer")
);
const InwardStock = lazy(() =>
  import("./views/apps/freshlist/customer/warehouse/InwardStock")
);
const OutwardStock = lazy(() =>
  import("./views/apps/freshlist/customer/warehouse/OutwardStock")
);
const WareHouseStock = lazy(() =>
  import("./views/apps/freshlist/customer/warehouse/WareHouseStock")
);
const AddDamage = lazy(() =>
  import("./views/apps/freshlist/customer/warehouse/AddDamage")
);
const DamageReport = lazy(() =>
  import("./views/apps/freshlist/customer/warehouse/DamageReport")
);
const StockStorage = lazy(() =>
  import("./views/apps/freshlist/customer/warehouse/StockStorage")
);
const ViewOnewarehouse = lazy(() =>
  import("./views/apps/freshlist/customer/warehouse/ViewOnewarehouse")
);
const WastageDetail = lazy(() =>
  import("./views/apps/freshlist/customer/warehouse/WastageDetail")
);
const DispatchDetail = lazy(() =>
  import("./views/apps/freshlist/customer/warehouse/DispatchDetail")
);
const TransporterList = lazy(() =>
  import("./views/apps/freshlist/customer/transporter/TransporterList")
);

const UnitList = lazy(() =>
  import("./views/apps/freshlist/customer/unit/UnitList")
);
const AddOtherChargesList = lazy(() =>
  import("./views/apps/freshlist/customer/unit/AddOtherChargesList")
);
const CreateUnit = lazy(() =>
  import("./views/apps/freshlist/customer/unit/CreateUnit")
);
const EditUnit = lazy(() =>
  import("./views/apps/freshlist/customer/unit/EditUnit")
);

// Account
const AddRoleNew = lazy(() =>
  import("./views/apps/freshlist/accounts/AddRoleNew")
);
const CreateHeirarchy = lazy(() =>
  import("./views/apps/freshlist/accounts/CreateHeirarchy")
);
const AssignTeamMember = lazy(() =>
  import("./views/apps/freshlist/accounts/AssignTeamMember")
);
const EditTeamRolePosition = lazy(() =>
  import("./views/apps/freshlist/accounts/EditTeamRolePosition")
);
const EditRole = lazy(() => import("./views/apps/freshlist/accounts/EditRole"));

const UpdateExistingRole = lazy(() =>
  import("./views/apps/freshlist/accounts/UpdateExistingRole")
);
const CreateAccount = lazy(() =>
  import("./views/apps/freshlist/accounts/CreateAccount")
);

const pricecalculaterproduction = lazy(() =>
  import("./views/apps/freshlist/Production/pricecalculaterproduction")
);
const productionprocesspage = lazy(() =>
  import("./views/apps/freshlist/Production/productionprocesspage")
);
const StartProduction = lazy(() =>
  import("./views/apps/freshlist/Production/StartProduction")
);
const NextStepProduction = lazy(() =>
  import("./views/apps/freshlist/Production/NextStepProduction")
);
const ProductionTarget = lazy(() =>
  import("./views/apps/freshlist/Production/ProductionTarget")
);
const wastagematerialproduction = lazy(() =>
  import("./views/apps/freshlist/Production/wastagematerialproduction")
);
const wastagestockreturnproduction = lazy(() =>
  import("./views/apps/freshlist/Production/wastagestockreturnproduction")
);

const CreateStockTrx = lazy(() =>
  import("./views/apps/freshlist/accounts/CreateStockTrx")
);
const CreatePromotionalActivity = lazy(() =>
  import("./views/apps/freshlist/accounts/CreatePromotionalActivity")
);
const EditPromotionalActivity = lazy(() =>
  import("./views/apps/freshlist/accounts/EditPromotionalActivity")
);
const CreateTarget = lazy(() =>
  import("./views/apps/freshlist/accounts/CreateTarget")
);
const CreateCustomerTarget = lazy(() =>
  import("./views/apps/freshlist/accounts/CreateCustomerTarget")
);
const CreateCustomerGroup = lazy(() =>
  import("./views/apps/freshlist/accounts/CreateCustomerGroup")
);
const EditTarget = lazy(() =>
  import("./views/apps/freshlist/accounts/EditTarget")
);
const PartyLedgersView = lazy(() =>
  import("./views/apps/freshlist/accounts/PartyLedgersView.js")
);
const CreateReturnSalesOrder = lazy(() =>
  import("./views/apps/freshlist/accounts/CreateReturnSalesOrder")
);
const PartyCreation = lazy(() =>
  import("./views/apps/freshlist/accounts/PartyCreation")
);
const CreateCustomer = lazy(() =>
  import("./views/apps/freshlist/accounts/CreateCustomer")
);
const ViewCustomer = lazy(() =>
  import("./views/apps/freshlist/accounts/ViewCustomer")
);
const CreateTransporter = lazy(() =>
  import("./views/apps/freshlist/accounts/CreateTransporter")
);
const EditTransporter = lazy(() =>
  import("./views/apps/freshlist/accounts/EditTransporter")
);

const CreateDispach = lazy(() =>
  import("./views/apps/freshlist/accounts/CreateDispach")
);
const GoodDispatchList = lazy(() =>
  import("./views/apps/freshlist/accounts/GoodDispatchList")
);
const CreditNoteList = lazy(() =>
  import("./views/apps/freshlist/customer/notes/CreditNoteList")
);
const DebitNoteList = lazy(() =>
  import("./views/apps/freshlist/customer/notes/DebitNoteList")
);

const EditAccount = lazy(() =>
  import("./views/apps/freshlist/accounts/EditAccount")
);
const ViewAccount = lazy(() =>
  import("./views/apps/freshlist/accounts/ViewAccount")
);

const Stockreport = lazy(() =>
  import("./views/apps/freshlist/customer/Ticketing/Stockreport")
);

const OverdueReport = lazy(() =>
  import("./views/apps/freshlist/customer/Ticketing/OverdueReport")
);
const CashBookReports = lazy(() =>
  import("./views/apps/freshlist/customer/Ticketing/CashBookReports")
);
const PartyLedgerReport = lazy(() =>
  import("./views/apps/freshlist/customer/Ticketing/PartyLedgerReport")
);
const BankStatementReport = lazy(() =>
  import("./views/apps/freshlist/customer/Ticketing/BankStatementReport")
);

const ReceiptReport = lazy(() =>
  import("./views/apps/freshlist/customer/Ticketing/ReceiptReport")
);
const PaymentReport = lazy(() =>
  import("./views/apps/freshlist/customer/Ticketing/PaymentReport")
);
const purchasereportamount = lazy(() =>
  import("./views/apps/freshlist/customer/Ticketing/purchasereportamount")
);
const PurchaseOrderReport = lazy(() =>
  import("./views/apps/freshlist/customer/Ticketing/PurchaseOrderReport")
);
const ProductWisePuchaseReport = lazy(() =>
  import("./views/apps/freshlist/customer/Ticketing/ProductWisePuchaseReport")
);
const DeadPartyReport = lazy(() =>
  import("./views/apps/freshlist/customer/Ticketing/DeadPartyReport")
);
const SalesOrderReports = lazy(() =>
  import("./views/apps/freshlist/customer/Ticketing/SalesOrderReports")
);
// const SalesPendingReports = lazy(() =>
//   import("./views/apps/freshlist/customer/Ticketing/SalesPendingReports")
// );
const PurchaseReturnReport = lazy(() =>
  import("./views/apps/freshlist/customer/Ticketing/PurchaseReturnReport")
);
const LowStockReports = lazy(() =>
  import("./views/apps/freshlist/customer/Ticketing/LowStockReport")
);
const ClosingStockReport = lazy(() =>
  import("./views/apps/freshlist/customer/Ticketing/ClosingStockReport")
);
const AvailableStock = lazy(() =>
  import("./views/apps/freshlist/customer/Ticketing/AvailableStock")
);
const WareHouseOverDueStock = lazy(() =>
  import("./views/apps/freshlist/customer/Ticketing/WareHouseOverDueStock")
);
const StockDifferenceReport = lazy(() =>
  import("./views/apps/freshlist/customer/Ticketing/StockDifferenceReport")
);
const DamageStockReport = lazy(() =>
  import("./views/apps/freshlist/customer/Ticketing/DamageStockReport")
);
const WareHouseReport = lazy(() =>
  import("./views/apps/freshlist/customer/Ticketing/WareHouseReport")
);
const Partywiseledger = lazy(() =>
  import("./views/apps/freshlist/customer/Ticketing/Partywiseledger")
);
const TransporterReport = lazy(() =>
  import("./views/apps/freshlist/customer/Ticketing/TransporterReport")
);
const targerReport = lazy(() =>
  import("./views/apps/freshlist/customer/Ticketing/targerReport")
);
const AchievementReport = lazy(() =>
  import("./views/apps/freshlist/customer/Ticketing/AchievementReport")
);
const DispatchReport = lazy(() =>
  import("./views/apps/freshlist/customer/Ticketing/DispatchReport")
);
const GSTR1 = lazy(() =>
  import("./views/apps/freshlist/customer/Ticketing/GSTR1")
);
const HSNWISEREPORT = lazy(() =>
  import("./views/apps/freshlist/customer/Ticketing/HSNWiseReport")
);
const LockPartyReport = lazy(() =>
  import("./views/apps/freshlist/customer/Ticketing/LockPartyReport")
);
const TaxReport = lazy(() =>
  import("./views/apps/freshlist/customer/Ticketing/TaxReport")
);
const WareHouseReports = lazy(() =>
  import("./views/apps/freshlist/customer/Ticketing/WareHouseReports")
);
const ProductListwithHSNandGST = lazy(() =>
  import("./views/apps/freshlist/customer/Ticketing/ProductListwithHSNandGST")
);
const OutStandingReport = lazy(() =>
  import("./views/apps/freshlist/customer/Ticketing/OutStandingReport")
);
const CashbookReport = lazy(() =>
  import("./views/apps/freshlist/customer/Ticketing/CashbookReport")
);
// const PendingOrderReport = lazy(() =>
//   import("./views/apps/freshlist/customer/Ticketing/PendingOrderReport")
// );
// const SalesCompletedOrderReports = lazy(() =>
//   import("./views/apps/freshlist/customer/Ticketing/SalesCompletedOrderReports")
// );
const SalesDeliveredReport = lazy(() =>
  import("./views/apps/freshlist/customer/Ticketing/SalesDeliveredReport")
);
const SalesOrderReport = lazy(() =>
  import("./views/apps/freshlist/customer/Ticketing/SalesOrderReport")
);
const SalesReturnReport = lazy(() =>
  import("./views/apps/freshlist/customer/Ticketing/SalesReturnReport")
);
const LockInReport = lazy(() =>
  import("./views/apps/freshlist/customer/Ticketing/LockInReport")
);
const HSNWisesaleReport = lazy(() =>
  import("./views/apps/freshlist/customer/Ticketing/HSNWisesaleReport")
);
const GSTR9 = lazy(() =>
  import("./views/apps/freshlist/customer/Ticketing/GSTR9")
);
const GSTR3B = lazy(() =>
  import("./views/apps/freshlist/customer/Ticketing/GSTR3B")
);
const GSTR2B = lazy(() =>
  import("./views/apps/freshlist/customer/Ticketing/GSTR2B")
);
const ProfitandLossReport = lazy(() =>
  import("./views/apps/freshlist/customer/Ticketing/ProfitandLossReport")
);
const PromotionalActivityReport = lazy(() =>
  import("./views/apps/freshlist/customer/Ticketing/PromotionalActivityReport")
);
const DueReport = lazy(() =>
  import("./views/apps/freshlist/customer/Ticketing/DueReport")
);
const PartyWiseledgerReport = lazy(() =>
  import("./views/apps/freshlist/customer/Ticketing/PartyWiseledgerReport")
);
const TeamandtargerReport = lazy(() =>
  import("./views/apps/freshlist/customer/Ticketing/TeamandtargerReport")
);
const Salesreport = lazy(() =>
  import("./views/apps/freshlist/customer/Ticketing/Salesreport")
);
const DeadParty = lazy(() =>
  import("./views/apps/freshlist/customer/StockManagement/DeadParty")
);
const OpeningStock = lazy(() =>
  import("./views/apps/freshlist/customer/ProductWIKI/OpeningStock")
);
const ClosingStockList = lazy(() =>
  import("./views/apps/freshlist/customer/ProductWIKI/ClosingStockList")
);
const WarehouseDispatchlist = lazy(() =>
  import("./views/apps/freshlist/accounts/WarehouseDispatchlist")
);
const OverDueStockReport = lazy(() =>
  import("./views/apps/freshlist/customer/ProductWIKI/OverDueStockReport")
);
const AllOverdueStockList = lazy(() =>
  import("./views/apps/freshlist/customer/ProductWIKI/AllOverdueStockList")
);
const Orderreport = lazy(() =>
  import("./views/apps/freshlist/customer/Ticketing/Orderreport")
);

const RoleList = lazy(() => import("./views/apps/freshlist/accounts/RoleList"));
const ViewLedger = lazy(() =>
  import("./views/apps/freshlist/accounts/ViewLedger")
);
const DepartmentRoleAssign = lazy(() =>
  import("./views/apps/freshlist/accounts/DepartmentRoleAssign")
);
const AssignToSuperAdmin = lazy(() =>
  import("./views/apps/freshlist/accounts/AssignToSuperAdmin")
);
// INhouseProduct
const HouseProductList = lazy(() =>
  import("./views/apps/freshlist/house/HouseProductList")
);
const RawProductList = lazy(() =>
  import("./views/apps/freshlist/house/RawProductList")
);
const ProductionTargetList = lazy(() =>
  import("./views/apps/freshlist/house/ProductionTargetList")
);
const houseProductList1 = lazy(() =>
  import("./views/apps/freshlist/house/houseProductList1")
);

const AddProduct = lazy(() =>
  import("./views/apps/freshlist/house/AddProduct")
);
const AddRawProduct = lazy(() =>
  import("./views/apps/freshlist/house/AddRawProduct")
);
const Addplan = lazy(() => import("./views/apps/freshlist/house/Addplan"));
const EditAddProduct = lazy(() =>
  import("./views/apps/freshlist/house/EditAddProduct")
);
const EditRawMateirals = lazy(() =>
  import("./views/apps/freshlist/house/EditRawMateirals")
);

const PurchaseInvoice = lazy(() =>
  import("./views/apps/freshlist/customer/ProductManagement/PurchaseInvoice")
);
const Invoicenew = lazy(() =>
  import("./views/apps/freshlist/customer/ProductManagement/Invoicenew")
);

const CustomerGroupList = lazy(() =>
  import("./views/apps/freshlist/house/CustomerGroupList")
);

const AccounSearch = lazy(() =>
  import("./views/apps/freshlist/house/AccounSearch")
);
const ExpenseAccountsList = lazy(() =>
  import("./views/apps/freshlist/house/ExpenseAccountsList")
);
const Uploadsalespersion = lazy(() =>
  import("./views/apps/freshlist/house/Uploadsalespersion.js")
);
const SuperAdminList = lazy(() =>
  import("./views/apps/freshlist/house/SuperAdminList")
);
const SuperAdminWithUser = lazy(() =>
  import("./views/apps/freshlist/house/SuperAdminWithUser")
);
const SuperAdminWithCustomer = lazy(() =>
  import("./views/apps/freshlist/house/SuperAdminWithCustomer")
);
const ViewSuperAdminCustomer = lazy(() =>
  import("./views/apps/freshlist/house/ViewSuperAdCustomer.js")
);
const ViewSuperAdUser = lazy(() =>
  import("./views/apps/freshlist/house/ViewSuperAdUser")
);
const EditSuperAdmin = lazy(() =>
  import("./views/apps/freshlist/house/EditSuperAdmin.js")
);
const ViewSuperAdmin = lazy(() =>
  import("./views/apps/freshlist/house/ViewSuperAdmin.js")
);
const SubcsriptionTab = lazy(() =>
  import("./views/apps/freshlist/house/SubcsriptionTab")
);

const PromotionalActivityList = lazy(() =>
  import("./views/apps/freshlist/house/PromotionalActivityList")
);
const Productionitem = lazy(() =>
  import("./views/apps/freshlist/Production/Itemproduct")
);
const Wastageproduction = lazy(() =>
  import("./views/apps/freshlist/Production/Wastageproduction")
);
const ReturnProductionProduct = lazy(() =>
  import("./views/apps/freshlist/Production/ReturnProduct")
);
const TargetCreationList = lazy(() =>
  import("./views/apps/freshlist/house/TargetCreation")
);
const HeadtargetingList = lazy(() =>
  import("./views/apps/freshlist/house/HeadtargetingList")
);
const CustomerTarget = lazy(() =>
  import("./views/apps/freshlist/house/CustomerTarget")
);
const SalesOrderReturn = lazy(() =>
  import("./views/apps/freshlist/house/SalesOrderReturn")
);
const PartyList = lazy(() => import("./views/apps/freshlist/house/PartyList"));
const CustomerSearch = lazy(() =>
  import("./views/apps/freshlist/house/CustomerSearch")
);
const CreateTransportList = lazy(() =>
  import("./views/apps/freshlist/house/CreateTransportList")
);
const CustomizeUniqueId = lazy(() =>
  import("./views/apps/freshlist/house/CustomizeUniqueId")
);

const OrderDispatchList = lazy(() =>
  import("./views/apps/freshlist/house/OrderDispatchList")
);

const AddNotification = lazy(() =>
  import("./views/apps/freshlist/notif/AddNotification")
);

const userProfile = lazy(() => import("./views/pages/profile/UserProfile"));

const forgotPassword = lazy(() =>
  import("./views/pages/authentication/ForgotPassword")
);
const resetPassword = lazy(() =>
  import("./views/pages/authentication/ResetPassword")
);
const myResetpass = lazy(() =>
  import("./views/pages/authentication/myResetpass")
);
const NewPassword = lazy(() =>
  import("./views/pages/authentication/NewPassword")
);

const userEdit = lazy(() => import("./views/apps/user/edit/Edit"));
const userView = lazy(() => import("./views/apps/user/view/View"));
const email = lazy(() => import("./views/apps/email/Email"));
const chat = lazy(() => import("./views/apps/chat/Chat"));
const todo = lazy(() => import("./views/apps/todo/Todo"));
const calendar = lazy(() => import("./views/apps/calendar/Calendar"));
const shop = lazy(() => import("./views/apps/ecommerce/shop/Shop"));
const wishlist = lazy(() => import("./views/apps/ecommerce/wishlist/Wishlist"));
const checkout = lazy(() => import("./views/apps/ecommerce/cart/Cart"));
const productDetail = lazy(() =>
  import("./views/apps/ecommerce/detail/Detail")
);
const grid = lazy(() => import("./views/ui-elements/grid/Grid"));
const typography = lazy(() =>
  import("./views/ui-elements/typography/Typography")
);
const textutilities = lazy(() =>
  import("./views/ui-elements/text-utilities/TextUtilities")
);
const syntaxhighlighter = lazy(() =>
  import("./views/ui-elements/syntax-highlighter/SyntaxHighlighter")
);
const colors = lazy(() => import("./views/ui-elements/colors/Colors"));
const reactfeather = lazy(() =>
  import("./views/ui-elements/icons/FeatherIcons")
);
const basicCards = lazy(() => import("./views/ui-elements/cards/basic/Cards"));
const statisticsCards = lazy(() =>
  import("./views/ui-elements/cards/statistics/StatisticsCards")
);
const analyticsCards = lazy(() =>
  import("./views/ui-elements/cards/analytics/Analytics")
);
const actionCards = lazy(() =>
  import("./views/ui-elements/cards/actions/CardActions")
);
const Alerts = lazy(() => import("./components/reactstrap/alerts/Alerts"));
const Buttons = lazy(() => import("./components/reactstrap/buttons/Buttons"));
const Breadcrumbs = lazy(() =>
  import("./components/reactstrap/breadcrumbs/Breadcrumbs")
);
const Carousel = lazy(() =>
  import("./components/reactstrap/carousel/Carousel")
);
const Collapse = lazy(() =>
  import("./components/reactstrap/collapse/Collapse")
);
const Dropdowns = lazy(() =>
  import("./components/reactstrap/dropdowns/Dropdown")
);
const ListGroup = lazy(() =>
  import("./components/reactstrap/listGroup/ListGroup")
);
const Modals = lazy(() => import("./components/reactstrap/modal/Modal"));
const Pagination = lazy(() =>
  import("./components/reactstrap/pagination/Pagination")
);
const NavComponent = lazy(() =>
  import("./components/reactstrap/navComponent/NavComponent")
);
const Navbar = lazy(() => import("./components/reactstrap/navbar/Navbar"));
const Tabs = lazy(() => import("./components/reactstrap/tabs/Tabs"));
const TabPills = lazy(() =>
  import("./components/reactstrap/tabPills/TabPills")
);
const Tooltips = lazy(() =>
  import("./components/reactstrap/tooltips/Tooltips")
);
const Popovers = lazy(() =>
  import("./components/reactstrap/popovers/Popovers")
);
const Badge = lazy(() => import("./components/reactstrap/badge/Badge"));
const BadgePill = lazy(() =>
  import("./components/reactstrap/badgePills/BadgePill")
);

const Progress = lazy(() =>
  import("./components/reactstrap/progress/Progress")
);
const Media = lazy(() => import("./components/reactstrap/media/MediaObject"));
const Spinners = lazy(() =>
  import("./components/reactstrap/spinners/Spinners")
);
const Toasts = lazy(() => import("./components/reactstrap/toasts/Toasts"));
const avatar = lazy(() => import("./components/@vuexy/avatar/Avatar"));
const AutoComplete = lazy(() =>
  import("./components/@vuexy/autoComplete/AutoComplete")
);
const chips = lazy(() => import("./components/@vuexy/chips/Chips"));
const divider = lazy(() => import("./components/@vuexy/divider/Divider"));
const vuexyWizard = lazy(() => import("./components/@vuexy/wizard/Wizard"));
const listView = lazy(() => import("./views/ui-elements/data-list/ListView"));
const thumbView = lazy(() => import("./views/ui-elements/data-list/ThumbView"));
const select = lazy(() => import("./views/forms/form-elements/select/Select"));
const switchComponent = lazy(() =>
  import("./views/forms/form-elements/switch/Switch")
);
const checkbox = lazy(() =>
  import("./views/forms/form-elements/checkboxes/Checkboxes")
);
const radio = lazy(() => import("./views/forms/form-elements/radio/Radio"));
const input = lazy(() => import("./views/forms/form-elements/input/Input"));
const group = lazy(() =>
  import("./views/forms/form-elements/input-groups/InputGoups")
);
const numberInput = lazy(() =>
  import("./views/forms/form-elements/number-input/NumberInput")
);
const textarea = lazy(() =>
  import("./views/forms/form-elements/textarea/Textarea")
);
const pickers = lazy(() =>
  import("./views/forms/form-elements/datepicker/Pickers")
);
const inputMask = lazy(() =>
  import("./views/forms/form-elements/input-mask/InputMask")
);
const layout = lazy(() => import("./views/forms/form-layouts/FormLayouts"));
const formik = lazy(() => import("./views/forms/formik/Formik"));
const tables = lazy(() => import("./views/tables/reactstrap/Tables"));
const ReactTables = lazy(() =>
  import("./views/tables/react-tables/ReactTables")
);
const Aggrid = lazy(() => import("./views/tables/aggrid/Aggrid"));
const DataTable = lazy(() =>
  impoaccordianrt("./views/tables/data-tables/DataTables")
);

const faq = lazy(() => import("./views/pages/faq/FAQ"));
const knowledgeBase = lazy(() =>
  import("./views/pages/knowledge-base/KnowledgeBase")
);
const search = lazy(() => import("./views/pages/search/Search"));
const accountSettings = lazy(() =>
  import("./views/pages/account-settings/AccountSettings")
);
const invoice = lazy(() => import("./views/pages/invoice/Invoice"));
const comingSoon = lazy(() => import("./views/pages/misc/ComingSoon"));
const error404 = lazy(() => import("./views/pages/misc/error/404"));
const error500 = lazy(() => import("./views/pages/misc/error/500"));
const authorized = lazy(() => import("./views/pages/misc/NotAuthorized"));
const maintenance = lazy(() => import("./views/pages/misc/Maintenance"));
const apex = lazy(() => import("./views/charts/apex/ApexCharts"));
const chartjs = lazy(() => import("./views/charts/chart-js/ChartJS"));
const extreme = lazy(() => import("./views/charts/recharts/Recharts"));
const leafletMaps = lazy(() => import("./views/maps/Maps"));
const toastr = lazy(() => import("./extensions/toastify/Toastify"));
const sweetAlert = lazy(() => import("./extensions/sweet-alert/SweetAlert"));
const rcSlider = lazy(() => import("./extensions/rc-slider/Slider"));
const uploader = lazy(() => import("./extensions/dropzone/Dropzone"));
const editor = lazy(() => import("./extensions/editor/Editor"));
const drop = lazy(() => import("./extensions/drag-and-drop/DragAndDrop"));
const tour = lazy(() => import("./extensions/tour/Tour"));
const clipboard = lazy(() =>
  import("./extensions/copy-to-clipboard/CopyToClipboard")
);
const menu = lazy(() => import("./extensions/contexify/Contexify"));
const swiper = lazy(() => import("./extensions/swiper/Swiper"));
const i18n = lazy(() => import("./extensions/i18n/I18n"));
const reactPaginate = lazy(() => import("./extensions/pagination/Pagination"));
const tree = lazy(() => import("./extensions/treeview/TreeView"));
const Import = lazy(() => import("./extensions/import-export/Import"));
const Export = lazy(() => import("./extensions/import-export/Export"));
const ExportSelected = lazy(() =>
  import("./extensions/import-export/ExportSelected")
);
const lockScreen = lazy(() =>
  import("./views/pages/authentication/LockScreen")
);
const register = lazy(() =>
  import("./views/pages/authentication/register/Register")
);
const accessControl = lazy(() =>
  import("./extensions/access-control/AccessControl")
);

const RouteConfig = ({ component: Component, fullLayout, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      return (
        <ContextLayout.Consumer>
          {(context) => {
            let LayoutTag =
              fullLayout === true
                ? context.fullLayout
                : context.state.activeLayout === "horizontal"
                ? context.horizontalLayout
                : context.VerticalLayout;
            return (
              <LayoutTag {...props} permission={props.user}>
                <Suspense fallback={<Spinner />}>
                  <Component {...props} />
                </Suspense>
              </LayoutTag>
            );
          }}
        </ContextLayout.Consumer>
      );
    }}
  />
);
const mapStateToProps = (state) => {
  return {
    user: state.auth.login.userRole,
  };
};
const AppRoute = connect(mapStateToProps)(RouteConfig);
class AppRouter extends React.Component {
  render() {
    return (
      // Set the directory path if you are deploying in sub-folder
      <HashRouter history={history}>
        <Switch>
          {/* <Route
         exact
         path="/"
         component={
          loading
           ? () => <div>Loading posts...</div>
         : () => <Home posts={posts} />
        }
      />
    <Route path="/login" component={Login} /> */}
          <AppRoute exact path="/dashboard" component={MainDash} />
          <AppRoute
            path="/ecommerce-dashboard"
            component={ecommerceDashboard}
          />
          <AppRoute path="/app/SoftNumen/parts/Cashbook" component={Cashbook} />
          <AppRoute
            path="/app/rupioo/parts/PartyLedger"
            component={PartyLedger}
          />
          <AppRoute
            path="/app/rupioo/parts/UserLedger"
            component={UserLedger}
          />
          <AppRoute
            path="/app/SoftNumen/parts/ReceiptList"
            component={ReceiptList}
          />
          <AppRoute
            path="/app/SoftNumen/parts/Addorderbycashbook"
            component={Addorderbycashbook}
          />
          <AppRoute
            path="/app/freshlist/customer/viewCustomer/:id"
            component={ViewCustomer}
          />
          <AppRoute
            path="/app/freshlist/customer/editCustomer/:id"
            component={EditCustomer}
          />
          <AppRoute
            path="/app/freshlist/customer/customerReview"
            component={CustomerReview}
          />
          <AppRoute
            path="/app/freshlist/customer/filterOption"
            component={FilterOption}
          />
          <AppRoute
            path="/app/freshlist/customer/summary"
            component={Summary}
          />
          <AppRoute
            path="/app/freshlist/customer/addFund"
            component={AddFund}
          />
          {/* hrm links start by jayesh*/}
          <AppRoute
            path="/app/ajgroup/HRM/reportAttenList"
            component={Attenreport}
          />
          <AppRoute
            path="/app/ajgroup/HRM/Time-sheet/ManageLeaveList"
            component={ManageLeaveList}
          />
          <AppRoute
            path="/app/ajgroup/HRM/Time-sheet/ManageLeaveEdit/:id"
            component={ManageLeaveEdit}
          />
          <AppRoute
            path="/app/ajgroup/HRM/Time-sheet/ManageLeaveView/:id"
            component={ManageView}
          />
          <AppRoute
            path="/app/ajgroup/HRM/reportLeaveList"
            component={Leavereport}
          />
          <AppRoute
            path="/app/ajgroup/HRM/reportPayrollList"
            component={Payrollreport}
          />
          <AppRoute
            path="/app/ajgroup/HRM/reportTimesheetList"
            component={Timesheetreport}
          />
          <AppRoute
            path="/app/ajgroup/HRM/expensesList"
            component={ExpensesList}
          />
          <AppRoute
            path="/app/ajgroup/HRM/RecPLace/expenseForm"
            component={ExpensesForm}
          />
          <AppRoute
            path="/app/ajgroup/HRM/Setrules/viewrules/:id"
            component={ViewRules}
          />
          <AppRoute
            path="/app/ajgroup/HRM/Setrules/editrules/:id"
            component={EditRules}
          />
          <AppRoute
            path="/app/ajgroup/HRM/HrmjpbApp/JobapView/:id"
            component={JobApView}
          />
          <AppRoute
            path="/app/ajgroup/HRM/HrmjpbApp/JobapeditList/:id"
            component={JobapEdList}
          />
          <AppRoute
            path="/app/ajgroup/HRM/HrminterView/InterViewedit/:id"
            component={IntereditList}
          />
          <AppRoute
            path="/app/ajgroup/HRM/HrminterView/InterView/:id"
            component={InterView_viewList}
          />
          <AppRoute
            path="/app/ajgroup/HRM/HrmOfferletr/OfferltrView/:id"
            component={OfferViewlist}
          />
          <AppRoute
            path="/app/ajgroup/HRM/HrmOfferletr/OfferletrEdit/:id"
            component={OfferEditlist}
          />
          <AppRoute
            path="/app/ajgroup/HRM/HrmPractskill/PracticsEdit/:id"
            component={PracticsEditform}
          />
          <AppRoute
            path="/app/ajgroup/HRM/HrmPractskill/PracticsView/:id"
            component={PracticsViewform}
          />
          <AppRoute
            path="/app/ajgroup/HRM/HrmTraining/trainingView/:id"
            component={TrainingViewForm}
          />
          <AppRoute
            path="/app/ajgroup/HRM/HrmTraining/trainingEdit/:id"
            component={TrainingEditForm}
          />
          <AppRoute
            path="/app/ajgroup/HRM/HrmEmploye/EmployeView/:id"
            component={EmployeViewForm}
          />
          <AppRoute
            path="/app/ajgroup/HRM/HrmEmploye/EmployeEdit/:id"
            component={EmployEditForm}
          />
          <AppRoute
            path="/app/ajgroup/HRM/RecPlace/setsalaryForm"
            component={PayslipForm}
          />
          <AppRoute
            path="/app/ajgroup/HRM/RecPlace/ViewOneSalary/:id"
            component={ViewOneSalary}
          />
          <AppRoute
            path="/app/ajgroup/HRM/RecPlace/jobForm"
            component={JobbForm}
          />
          <AppRoute
            path="/app/ajgroup/HRM/ViewHrm/JobeditList/:id"
            component={JobeditList}
          />
          <AppRoute
            path="/app/ajgroup/HRM/ViewHrm/JobviewList/:id"
            component={JobViewform}
          />
          <AppRoute
            path="/app/ajgroup/HRM/RecPlace/applresultForm"
            component={AppResultForm}
          />
          <AppRoute
            path="/app/ajgroup/HRM/RecPlace/practskillform"
            component={MockTestForm}
          />
          <AppRoute
            path="/app/ajgroup/HRM/RecPlace/interviewForm"
            component={InterviewForm}
          />
          <AppRoute
            path="/app/ajgroup/HRM/RecPlace/offerletterForm"
            component={OfferLetterForm}
          />
          <AppRoute
            path="/app/ajgroup/HRM/RecPlace/trainingForm"
            component={TrainingForm}
          />
          <AppRoute
            path="/app/ajgroup/HRM/RecPlace/createempForm"
            component={EmployeeProfileForm}
          />
          <AppRoute path="/app/ajgroup/HRM/jobappList" component={JobappList} />
          <AppRoute
            path="/app/ajgroup/HRM/practiceList"
            component={practiceList}
          />
          <AppRoute path="/app/ajgroup/HRM/JobList" component={JobList} />
          <AppRoute
            path="/app/ajgroup/HRM/interviewList"
            component={InterviewList}
          />
          <AppRoute path="/app/ajgroup/HRM/offerList" component={offerList} />
          <AppRoute
            path="/app/ajgroup/HRM/empList"
            component={CreateemployeList}
          />
          <AppRoute
            path="/app/ajgroup/HRM/setsalarList"
            component={Setsalarlist}
          />
          <AppRoute
            path="/app/ajgroup/HRM/Payroll/payslipform/:id"
            component={PayslipListForm}
          />
          <AppRoute
            path="/app/ajgroup/HRM/setpayslip"
            component={Setpaysliplist}
          />
          <AppRoute
            path="/app/ajgroup/HRM/holidayList"
            component={HolidayList}
          />
          <AppRoute path="/app/ajgroup/HRM/ShiftList" component={ShiftList} />
          <AppRoute path="/app/ajgroup/HRM/BranchList" component={BranchList} />
          <AppRoute path="/app/ajgroup/HRM/apprList" component={ApprList} />
          <AppRoute
            path="/app/ajgroup/HRM/Time-sheet/holidayform"
            component={Holidayform}
          />
          <AppRoute
            path="/app/ajgroup/HRM/TCPA/apprform"
            component={Apprform}
          />
          <AppRoute
            path="/app/ajgroup/HRM/TCPA/ApprformEdit/:id"
            component={ApprformEdit}
          />
          <AppRoute
            path="/app/ajgroup/HRM/trainList"
            component={TrainingList}
          />
          <AppRoute path="/app/ajgroup/HRM/attenList" component={AttendList} />
          <AppRoute path="/app/ajgroup/HRM/LogsList" component={LogsList} />
          <AppRoute
            path="/app/ajgroup/HRM/Time-sheet/attenform"
            component={AttenForm}
          />
          <AppRoute
            path="/app/ajgroup/HRM/Time-sheet/attenviewform/:id"
            component={AttenviewForm}
          />
          <AppRoute
            path="/app/ajgroup/HRM/Time-sheet/atteneditform/:id"
            component={AtteneditForm}
          />
          <AppRoute path="/app/ajgroup/HRM/leaveList" component={LeaveList} />
          {/* <AppRoute
            path="/app/ajgroup/HRM/leaveManage"
            component={Manageleave}
          /> */}
          <AppRoute
            path="/app/ajgroup/HRM/Time-sheet/leaveform"
            component={LeaveForm}
          />
          <AppRoute
            path="/app/ajgroup/HRM/Time-sheet/leaveeditform/:id"
            component={LeaveEditForm}
          />
          <AppRoute
            path="/app/ajgroup/HRM/Time-sheet/leaveviewform/:id"
            component={LeaveViewForm}
          />
          <AppRoute
            path="/app/ajgroup/HRM/Time-sheet/manageleave"
            component={Manageleave}
          />
          <AppRoute path="/app/ajgroup/HRM/indicatList" component={IndicList} />
          <AppRoute
            path="/app/ajgroup/HRM/Perfomence/indicatform"
            component={Indicatform}
          />
          <AppRoute
            path="/app/ajgroup/HRM/Perfomence/viewindicate/:id"
            component={ViewIndicatform}
          />
          <AppRoute
            path="/app/ajgroup/HRM/Perfomence/editindicate/:id"
            component={EditIndicatform}
          />
          <AppRoute path="/app/ajgroup/HRM/incentList" component={IncenList} />
          <AppRoute
            path="/app/ajgroup/HRM/incentView/:id"
            component={incentView}
          />
          <AppRoute
            path="/app/ajgroup/HRM/incentEdit/:id"
            component={incentEdit}
          />
          <AppRoute
            path="/app/ajgroup/HRM/TCPA/goltrackform"
            component={GoalForm}
          />
          <AppRoute
            path="/app/ajgroup/HRM/TCPA/bonusform/:id"
            component={BonusForm}
          />
          <AppRoute
            path="/app/ajgroup/HRM/TCPA/MarkPaidSalary/:id"
            component={MarkPaidSalary}
          />
          <AppRoute
            path="/app/ajgroup/HRM/TCPA/BonusEdit/:id"
            component={BonusEdit}
          />
          <AppRoute
            path="/app/ajgroup/HRM/TCPA/incenform/:id"
            component={IncenForm}
          />
          <AppRoute path="/app/ajgroup/HRM/bonusList" component={BonusList} />
          <AppRoute path="/app/ajgroup/HRM/goalList" component={GoalList} />
          <AppRoute path="/app/ajgroup/HRM/termList" component={TermList} />
          <AppRoute
            path="/app/ajgroup/HRM/advanceList"
            component={AdvanceList}
          />
          <AppRoute path="/app/ajgroup/HRM/overtList" component={OvertList} />
          <AppRoute path="/app/ajgroup/HRM/insuList" component={InsurList} />
          <AppRoute path="/app/ajgroup/HRM/ruleList" component={RuleList} />
          <AppRoute path="/app/ajgroup/HRM/pfList" component={Pflist} />
          <AppRoute path="/app/ajgroup/HRM/esiList" component={Esilist} />
          <AppRoute path="/app/ajgroup/HRM/loneList" component={Lonelist} />
          <AppRoute path="/app/ajgroup/HRM/taList" component={Talist} />
          <AppRoute path="/app/ajgroup/HRM/daList" component={Dalist} />
          <AppRoute
            path="/app/ajgroup/HRM/travlingList"
            component={Travllinglist}
          />
          <AppRoute
            path="/app/ajgroup/HRM/Setrules/rulesform"
            component={SetRules}
          />
          <AppRoute path="/app/ajgroup/HRM/Payroll/taform" component={Taform} />
          <AppRoute path="/app/ajgroup/HRM/Payroll/daform" component={Daform} />
          <AppRoute path="/app/ajgroup/HRM/Payroll/pfform" component={Pfform} />
          <AppRoute
            path="/app/ajgroup/HRM/Payroll/esiform"
            component={Esiform}
          />
          <AppRoute
            path="/app/ajgroup/HRM/Payroll/travellingform"
            component={Travellingform}
          />
          <AppRoute
            path="/app/ajgroup/HRM/Payroll/loanform"
            component={Loanform}
          />
          <AppRoute path="/app/ajgroup/HRM/Payroll/OverForm" component={Over} />
          <AppRoute
            path="/app/ajgroup/HRM/Payroll/Insurance"
            component={Insurance}
          />
          <AppRoute
            path="/app/ajgroup/HRM/Payroll/advanceForm"
            component={Advance}
          />
          <AppRoute
            path="/app/ajgroup/HRM/resignation"
            component={Resignation}
          />
          <AppRoute
            path="/app/ajgroup/HRM/complainList"
            component={Complaint}
          />
          <AppRoute path="/app/ajgroup/HRM/warningList" component={Warning} />
          {/* {/ hrm link end by Jayesh /} */}
          {/* order */}
          <AppRoute
            path="/app/ajgroup/HRM/announceList"
            component={Announcement}
          />
          <AppRoute
            path="/app/ajgroup/HRM/HRMAdminForms/resignationForm"
            component={ResignationForm}
          />
          <AppRoute
            path="/app/ajgroup/HRM/HRMAdminForms/complainForm"
            component={ComplaintForm}
          />
          <AppRoute
            path="/app/ajgroup/HRM/HRMAdminForms/warningForm"
            component={WarningForm}
          />
          <AppRoute
            path="/app/ajgroup/HRM/HRMAdminForms/announceForm"
            component={AnnounceForm}
          />
          <AppRoute
            path="/app/ajgroup/HRM/HRMAdminForms/AnnounceView/:id"
            component={AnnounceView}
          />
          <AppRoute
            path="/app/ajgroup/HRM/HRMAdminForms/AnnounceFormEdit/:id"
            component={AnnounceFormEdit}
          />
          <AppRoute
            path="/app/ajgroup/HRM/EmployeeList"
            component={EmployeeList}
          />
          <AppRoute
            path="/app/ajgroup/HRM/HRMAdminForms/termiForm"
            component={TerminationForm}
          />
          <AppRoute
            path="/app/ajgroup/HRM/HRMAdminForms/complainEDITform/:id"
            component={ComplaintEditForm}
          />
          <AppRoute
            path="/app/ajgroup/HRM/HRMAdminForms/complainVIEWform/:id"
            component={ComplaintViewForm}
          />
          <AppRoute
            path="/app/ajgroup/HRM/HRMAdminForms/resignationEDIT/:id"
            component={ResignationEditForm}
          />
          <AppRoute
            path="/app/ajgroup/HRM/HRMAdminForms/resignationVIEW/:id"
            component={ResignationViewForm}
          />
          <AppRoute
            path="/app/ajgroup/HRM/HRMAdminForms/warningEDIT/:id"
            component={WarningEditForm}
          />
          <AppRoute
            path="/app/ajgroup/HRM/HRMAdminForms/warningVIEW/:id"
            component={WarningViewForm}
          />
          <AppRoute
            path="/app/ajgroup/HRM/HRMAdminForms/terminationEDIT/:id"
            component={TerminationEditForm}
          />
          <AppRoute
            path="/app/ajgroup/HRM/HRMAdminForms/terminationVIEW/:id"
            component={TerminationViewForm}
          />
          <AppRoute
            path="/app/ajgroup/HRM/advancewagesList"
            component={AdvanceWages}
          />
          <AppRoute path="/app/ajgroup/HRM/EmilList" component={EmilList} />
          <AppRoute
            path="/app/softnumen/order/createorder"
            component={CreateOrder}
          />
          <AppRoute
            path="/app/jupitech/order/createInvoice"
            component={CreateInvoice}
          />
          <AppRoute
            path="/app/jupitech/order/CreateChallan"
            component={CreateChallan}
          />
          <AppRoute
            path="/app/ajgroup/order/CreatePayment/:id"
            component={CreatePayment}
          />
          <AppRoute
            path="/app/ajgroup/order/CreateReceipt/:id"
            component={CreateReceipt}
          />
          <AppRoute
            path="/app/softnumen/order/pendingOrder"
            component={PendingOrder}
          />
          <AppRoute
            path="/app/jupitech/order/CancelledOrder"
            component={CancelledOrder}
          />
          <AppRoute
            path="/app/AJGroup/order/editPending/:id"
            component={EditPending}
          />
          <AppRoute
            path="/app/softnumen/order/orderList"
            component={OrderList}
          />
          <AppRoute
            path="/app/jupitech/order/SalesLead"
            component={SalesLead}
          />
          <AppRoute
            path="/app/jupitech/order/EditSalesLead/:id"
            component={EditSalesLead}
          />
          <AppRoute
            path="/app/AJgroup/order/purchaseOrderList"
            component={PurchaseOrderList}
          />
          <AppRoute
            path="/app/AJgroup/order/PurchaseReturnList"
            component={PurchaseReturnList}
          />
          <AppRoute
            path="/app/AJgroup/purchase/pendingPurchase"
            component={PendingPurchase}
          />
          <AppRoute
            path="/app/AJgroup/purchase/purchaseCompleted"
            component={PurchaseCompleted}
          />
          <AppRoute
            path="/app/AJgroup/purchase/PaymentListAll"
            component={PaymentListAll}
          />
          <AppRoute
            path="/app/AJgroup/order/AddPurchaseOrder"
            component={AddPurchaseOrder}
          />
          <AppRoute
            path="/app/AJgroup/order/AddOrder/:partyid/:productId"
            component={LowStockPurchase}
          />
          <AppRoute
            path="/app/AJgroup/order/editPurchase/:id"
            component={EditPurchase}
          />
          <AppRoute
            path="/app/AJgroup/order/UpdatePurchseOrder/:id"
            component={UpdatePurchseOrder}
          />
          <AppRoute
            path="/app/AJgroup/order/CreatePurchaseInvoice"
            component={CreatePurchaseInvoice}
          />
          <AppRoute
            path="/app/AJGroup/order/salesReturn/:id"
            component={SalesReturnView}
          />
          <AppRoute
            path="/app/AJGroup/order/purchaseReturn/:id"
            component={PurchaseReturn}
          />
          <AppRoute
            path="/app/AJGroup/order/placeOrderReturn/:id"
            component={PlaceOrderReturn}
          />
          <AppRoute
            path="/app/softNumen/order/addplaceOrder"
            component={AddPlaceOrder}
          />
          <AppRoute
            path="/app/softNumen/order/confirmedOrder"
            component={ConfirmedOrder}
          />
          <AppRoute
            path="/app/softNumen/order/OrderSearch"
            component={BillingLockList}
          />
          <AppRoute
            path="/app/jupitech/order/achivement"
            component={Achivement}
          />
          <AppRoute
            path="/app/freshlist/order/editplaceorder/:id"
            component={editPlaceorder}
          />
          <AppRoute
            path="/app/AjGroup/order/placeOrderList"
            component={PlaceOrderList}
          />
          <AppRoute
            path="/app/freshlist/order/editOrder/:id"
            component={EditOrder}
          />
          <AppRoute
            path="/app/freshlist/order/EditProductionProcess/:id"
            component={EditProductionProcess}
          />
          <AppRoute
            path="/app/freshlist/order/AddReturnProductionProduct/:id"
            component={AddReturnProductionProduct}
          />
          <AppRoute
            path="/app/freshlist/order/viewAll/:id"
            component={ViewAll}
          />
          <AppRoute
            path="/app/softnumen/InvoiceGenerator"
            component={InvoiceGenerator}
          />
          <AppRoute
            path="/app/softnumen/warehouseStock"
            component={WarehouseStock}
          />
          <AppRoute
            path="/app/freshlist/category/categoryList"
            component={CategoryList}
          />
          <AppRoute
            path="/app/freshlist/category/addCategory"
            component={AddCategory}
          />
          <AppRoute
            path="/app/freshlist/category/editCategory/:id"
            component={EditCategory}
          />
          <AppRoute
            path="/app/freshlist/category/viewCategory/:id"
            component={ViewCategory}
          />
          <AppRoute
            path="/app/freshlist/subcategory/subCategoryList"
            component={SubCategoryList}
          />
          <AppRoute
            path="/app/freshlist/subcategory/addSubCategory"
            component={AddSubCategory}
          />
          <AppRoute
            path="/app/freshlist/subcategory/editSubCategory/:cid/:sid"
            component={EditSubCategory}
          />
          <AppRoute
            path="/app/softNumen/report/DeadParty"
            component={DeadParty}
          />
          <AppRoute
            path="/app/softNumen/warranty/openingStock"
            component={OpeningStock}
          />
          <AppRoute
            path="/app/ajgroup/stock/ClosingStockList"
            component={ClosingStockList}
          />
          <AppRoute
            path="/app/AjGroup/dispatch/WarehouseDispatchlist"
            component={WarehouseDispatchlist}
          />
          <AppRoute
            path="/app/Ajgroup/Stock/OverDueStockReport/:id"
            component={OverDueStockReport}
          />
          <AppRoute
            path="/app/Ajgroup/Stock/AllOverdueStockList"
            component={AllOverdueStockList}
          />
          <AppRoute
            path="/app/softNumen/report/stockReport"
            component={StockReport}
          />
          <AppRoute
            path="/app/SoftNumen/report/OverdueReport"
            component={OverdueReport}
          />
          <AppRoute
            path="/app/SoftNumen/report/ReceiptReport"
            component={ReceiptReport}
          />
          <AppRoute
            path="/app/SoftNumen/report/CashBookReports"
            component={CashBookReports}
          />
          <AppRoute
            path="/app/report/ledger/PartyLedgerReport"
            component={PartyLedgerReport}
          />
          <AppRoute
            path="/app/rupioo/report/BankStatementReport"
            component={BankStatementReport}
          />
          <AppRoute
            path="/app/SoftNumen/ticket/PaymentReport"
            component={PaymentReport}
          />
          <AppRoute
            path="/app/SoftNumen/ticket/Salesreport"
            component={Salesreport}
          />
          <AppRoute
            path="/app/SoftNumen/ticket/purchasereportamount"
            component={purchasereportamount}
          />
          <AppRoute
            path="/app/Rupioo/Report/PurchaseOrderReport"
            component={PurchaseOrderReport}
          />
          <AppRoute
            path="/app/Rupioo/Report/ProductWisePuchaseReport"
            component={ProductWisePuchaseReport}
          />
          <AppRoute
            path="/app/rupioo/report/DeadPartyReport"
            component={DeadPartyReport}
          />
          <AppRoute
            path="/app/rupioo/report/SalesOrderReports"
            component={SalesOrderReports}
          />
          {/* <AppRoute
            path="/app/rupioo/report/SalesPendingReports"
            component={SalesPendingReports}
          /> */}
          <AppRoute
            path="/app/rupioo/report/PurchaseReturnReport"
            component={PurchaseReturnReport}
          />
          <AppRoute
            path="/app/rupioo/report/LowStockReports"
            component={LowStockReports}
          />
          <AppRoute
            path="/app/rupioo/report/ClosingStockReport"
            component={ClosingStockReport}
          />
          <AppRoute
            path="/app/rupioo/report/AvailableStock"
            component={AvailableStock}
          />
          <AppRoute
            path="/app/rupioo/report/WareHouseOverDueStock"
            component={WareHouseOverDueStock}
          />
          <AppRoute
            path="/app/rupioo/report/StockDifferenceReport"
            component={StockDifferenceReport}
          />
          <AppRoute
            path="/app/rupioo/report/DamageStockReport"
            component={DamageStockReport}
          />
          <AppRoute path="/app/rupioo/report/GSTR1" component={GSTR1} />
          <AppRoute
            path="/app/rupioo/report/hsnwisereport"
            component={HSNWISEREPORT}
          />
          <AppRoute
            path="/app/SoftNumen/ticket/LockPartyReport"
            component={LockPartyReport}
          />
          <AppRoute
            path="/app/SoftNumen/ticket/TaxReport"
            component={TaxReport}
          />
          <AppRoute
            path="/app/rupioo/report/WareHouseReports"
            component={WareHouseReports}
          />
          <AppRoute path="/app/SoftNumen/ticket/GSTR3B" component={GSTR3B} />
          <AppRoute path="/app/SoftNumen/ticket/GSTR2B" component={GSTR2B} />
          <AppRoute
            path="/app/rupioo/report/ProfitandLossReport"
            component={ProfitandLossReport}
          />
          <AppRoute
            path="/app/rupioo/report/PromotionalActivityReport"
            component={PromotionalActivityReport}
          />
          <AppRoute
            path="/app/SoftNumen/ticket/DueReport"
            component={DueReport}
          />
          <AppRoute
            path="/app/SoftNumen/ticket/PartyWiseledgerReport"
            component={PartyWiseledgerReport}
          />
          <AppRoute path="/app/SoftNumen/ticket/GSTR9" component={GSTR9} />
          <AppRoute
            path="/app/SoftNumen/ticket/HSNWisesaleReport"
            component={HSNWisesaleReport}
          />
          <AppRoute
            path="/app/SoftNumen/ticket/ProductListwithHSNandGST"
            component={ProductListwithHSNandGST}
          />
          <AppRoute
            path="/app/SoftNumen/ticket/LockInReport"
            component={LockInReport}
          />
          {/* <AppRoute
            path="/app/SoftNumen/ticket/PendingOrderReport"
            component={PendingOrderReport}
          /> */}
          {/* <AppRoute
            path="/app/rupioo/reports/SalesCompletedOrderReports"
            component={SalesCompletedOrderReports}
          /> */}
          <AppRoute
            path="/app/rupioo/reports/SalesDeliveredReport"
            component={SalesDeliveredReport}
          />
          <AppRoute
            path="/app/rupioo/reports/SalesOrderReport"
            component={SalesOrderReport}
          />
          <AppRoute
            path="/app/rupioo/reports/SalesReturnReport"
            component={SalesReturnReport}
          />
          <AppRoute
            path="/app/SoftNumen/ticket/CashbookReport"
            component={CashbookReport}
          />
          <AppRoute
            path="/app/SoftNumen/ticket/OutStandingReport"
            component={OutStandingReport}
          />
          <AppRoute
            path="/app/SoftNumen/ticket/TeamandtargerReport"
            component={TeamandtargerReport}
          />
          <AppRoute
            path="/app/SoftNumen/ticket/Partywiseledger"
            component={Partywiseledger}
          />
          <AppRoute
            path="/app/SoftNumen/ticket/TransporterReport"
            component={TransporterReport}
          />
          <AppRoute
            path="/app/SoftNumen/ticket/targetReport"
            component={targerReport}
          />
          <AppRoute
            path="/app/rupioo/report/AchievementReport"
            component={AchievementReport}
          />
          <AppRoute
            path="/app/SoftNumen/ticket/DispatchReport"
            component={DispatchReport}
          />
          <AppRoute
            path="/app/SoftNumen/ticket/WareHouseReport"
            component={WareHouseReport}
          />
          <AppRoute
            path="/app/softNumen/report/Orderreport"
            component={Orderreport}
          />
          <AppRoute
            path="/app/softNumen/report/StockTransfer"
            component={StockTransfer}
          />
          <AppRoute
            path="/app/Ajgroup/stock/ClosingStock/:id"
            component={ClosingStock}
          />
          <AppRoute
            path="/app/ajgroup/stock/LowStock/:id"
            component={LowStock}
          />
          <AppRoute
            path="/app/Ajgroup/stock/LowStockList"
            component={LowStockList}
          />
          <AppRoute
            path="/app/Ajgroup/stock/WarehouseShortageReport"
            component={WarehouseShortageReport}
          />
          <AppRoute
            path="/app/softNumen/warranty/DamagedStock"
            component={DamagedStock}
          />
          <AppRoute
            path="/app/softNumen/system/WareHouseListSoft"
            component={WareHouseListSoft}
          />
          <AppRoute
            path="/app/softNumen/system/SettingTab"
            component={SettingTab}
          />
          <AppRoute
            path="/app/softNumen/warehouse/CreateWareHouse/:id"
            component={CreateWareHouse}
          />
          <AppRoute
            path="/app/softNumen/warehouse/Inwordwarehousecreate"
            component={Inwordwarehousecreate}
          />
          <AppRoute
            path="/app/softNumen/warehouse/RawMaterialInward"
            component={RawMaterialInward}
          />
          <AppRoute
            path="/app/softNumen/warehouse/RawmaterialOutward"
            component={RawmaterialOutward}
          />
          <AppRoute
            path="/app/softNumen/warehouse/StockTransfer"
            component={StockTransferwarehouse}
          />
          <AppRoute
            path="/app/softNumen/warehouse/InwardStock"
            component={InwardStock}
          />
          <AppRoute
            path="/app/Ajgroup/warehouse/OutwardStock"
            component={OutwardStock}
          />
          <AppRoute
            path="/app/softNumen/warehouse/WareHouseStock/:id"
            component={WareHouseStock}
          />
          <AppRoute
            path="/app/Jupitech/warehouse/AddDamage"
            component={AddDamage}
          />
          <AppRoute
            path="/app/softNumen/warehouse/DamageReport"
            component={DamageReport}
          />
          <AppRoute
            path="/app/softNumen/warehouse/StockStorage"
            component={StockStorage}
          />
          <AppRoute
            path="/app/rupioo/warehouse/ViewOnewarehouse/:id"
            component={ViewOnewarehouse}
          />
          <AppRoute
            path="/app/softNumen/warehouse/WastageDetail"
            component={WastageDetail}
          />
          <AppRoute
            path="/app/softNumen/warehouse/DispatchDetail"
            component={DispatchDetail}
          />
          <AppRoute
            path="/app/softNumen/transporter/TransporterList"
            component={TransporterList}
          />
          <AppRoute
            path="/app/ajgroup/transporter/CreateTransporter/:id"
            component={CreateTransporter}
          />
          <AppRoute
            path="/app/ajgroup/transporter/EditTransporter/:id"
            component={EditTransporter}
          />
          <AppRoute
            path="/app/softNumen/Unit/CreateUnit"
            component={CreateUnit}
          />
          <AppRoute path="/app/softNumen/Unit/UnitList" component={UnitList} />
          <AppRoute
            path="/app/rupioo/addcharges/OtherChargesList"
            component={AddOtherChargesList}
          />
          <AppRoute
            path="/app/softNumen/Unit/editUnit/:id"
            component={EditUnit}
          />
          <AppRoute
            path="/app/AJGroup/product/PurchaseInvoice"
            component={PurchaseInvoice}
          />
          <AppRoute path="/app/Invoicenew" component={Invoicenew} />
          <AppRoute
            path="/app/freshlist/account/addRoleNew"
            component={AddRoleNew}
          />
          <AppRoute
            path="/app/freshlist/account/CreateHeirarchy"
            component={CreateHeirarchy}
          />
          <AppRoute
            path="/app/Ajgroup/account/AssignTeamMember"
            component={AssignTeamMember}
          />
          <AppRoute
            path="/app/Ajgroup/account/EditTeamRolePosition"
            component={EditTeamRolePosition}
          />
          <AppRoute
            path="/app/freshlist/account/editRole/:id"
            component={EditRole}
          />
          <AppRoute
            path="/app/freshlist/account/UpdateExistingRole/:id"
            component={UpdateExistingRole}
          />
          {/* create Account */}
          <AppRoute
            path="/app/SoftNumen/account/CreateAccount/:id"
            component={CreateAccount}
          />
          <AppRoute
            path="/app/SoftNumen/account/ViewAccount/:id"
            component={ViewAccount}
          />
          <AppRoute
            path="/app/ajgroup/account/CreateStockTrx"
            component={CreateStockTrx}
          />
          <AppRoute
            path="/app/ajgroup/account/CreatePromotionalActivity"
            component={CreatePromotionalActivity}
          />
          <AppRoute
            path="/app/ajgroup/account/EditPromotionalActivity/:id"
            component={EditPromotionalActivity}
          />
          <AppRoute
            path="/app/SoftNumen/account/CreateTarget"
            component={CreateTarget}
          />
          <AppRoute
            path="/app/jupitech/account/CreateCustomerTarget/:id"
            component={CreateCustomerTarget}
          />
          <AppRoute
            path="/app/Ajgroup/account/CreateCustomerGroup/:id"
            component={CreateCustomerGroup}
          />
          <AppRoute
            path="/app/AJGroup/account/EditTarget/:id"
            component={EditTarget}
          />
          <AppRoute
            path="/app/AJGroup/account/PartyLedgersView"
            component={PartyLedgersView}
          />
          <AppRoute
            path="/app/SoftNumen/account/CreateReturnSalesOrder"
            component={CreateReturnSalesOrder}
          />
          {/* create Party */}
          <AppRoute
            path="/app/SoftNumen/account/PartyCreation"
            component={PartyCreation}
          />
          <AppRoute
            path="/app/SoftNumen/account/CreateCustomer/:id"
            component={CreateCustomer}
          />
          <AppRoute
            path="/app/SoftNumen/account/ViewCustomer/:id"
            component={ViewCustomer}
          />
          <AppRoute
            path="/app/AjGroup/dispatch/CreateDispach/:id"
            component={CreateDispach}
          />
          <AppRoute
            path="/app/AjGroup/dispatch/goodDispatchList"
            component={GoodDispatchList}
          />
          <AppRoute
            path="/app/AjGroup/note/CreditNoteList"
            component={CreditNoteList}
          />
          <AppRoute
            path="/app/AjGroup/note/DebitNoteList"
            component={DebitNoteList}
          />
          <AppRoute
            path="/app/SoftNumen/account/EditAccount/:id"
            component={EditAccount}
          />
          <AppRoute
            path="/app/SoftNumen/account/ViewAccount/:id"
            component={ViewAccount}
          />
          <AppRoute
            path="/app/SoftNumen/ticket/Stockreport"
            component={Stockreport}
          />
          <AppRoute path="/app/Trupee/account/RoleList" component={RoleList} />
          <AppRoute
            path="/app/ajgroup/Ledger/ViewLedger/:id"
            component={ViewLedger}
          />
          <AppRoute
            path="/app/Ajgroup/account/DepartmentRoleAssign"
            component={DepartmentRoleAssign}
          />
          <AppRoute
            path="/app/Ajgroup/account/AssignToSuperAdmin"
            component={AssignToSuperAdmin}
          />
          <AppRoute
            path="/app/freshlist/house/houseProductList"
            component={HouseProductList}
          />
          <AppRoute
            path="/app/freshlist/house/RawProductList"
            component={RawProductList}
          />
          <AppRoute
            path="/app/freshlist/house/ProductionTargetList"
            component={ProductionTargetList}
          />
          <AppRoute
            path="/app/jupitech/product/ProductList"
            component={houseProductList1}
          />
          <AppRoute
            path="/app/freshlist/house/AddProduct"
            component={AddProduct}
          />
          <AppRoute
            path="/app/freshlist/house/AddRawProduct/:id"
            component={AddRawProduct}
          />
          <AppRoute
            path="/app/freshlist/house/Addplan/:id"
            component={Addplan}
          />
          <AppRoute
            path="/app/freshlist/house/EditAddProduct/:id"
            component={EditAddProduct}
          />
          <AppRoute
            path="/app/freshlist/house/EditRawMateirals/:id"
            component={EditRawMateirals}
          />
          <AppRoute
            path="/app/ajgroup/house/CustomerGroupList"
            component={CustomerGroupList}
          />
          <AppRoute path="/app/SoftNumen/PartyList" component={PartyList} />
          <AppRoute
            path="/app/SoftNumen/accounSearch"
            component={AccounSearch}
          />
          <AppRoute
            path="/app/jupitech/ExpenseAccountsList"
            component={ExpenseAccountsList}
          />
          <AppRoute
            path="/app/SoftNumen/Uploadsalespersion"
            component={Uploadsalespersion}
          />
          <AppRoute
            path="/app/rupioo/SuperAdminList"
            component={SuperAdminList}
          />
          <AppRoute
            path="/app/rupioo/SuperAdminWithUser"
            component={SuperAdminWithUser}
          />
          <AppRoute
            path="/app/rupioo/SuperAdminWithCustomer"
            component={SuperAdminWithCustomer}
          />
          <AppRoute
            path="/app/rupioo/ViewSuperAdminCustomer/:id"
            component={ViewSuperAdminCustomer}
          />
          <AppRoute
            path="/app/rupioo/ViewSuperAdminUser/:id"
            component={ViewSuperAdUser}
          />
          <AppRoute
            path="/app/rupioo/EditSuperAdmin/:id"
            component={EditSuperAdmin}
          />
          <AppRoute
            path="/app/rupioo/ViewSuperAdmin/:id"
            component={ViewSuperAdmin}
          />
          <AppRoute
            path="/app/rupioo/subscriptionplan/list"
            component={SubcsriptionTab}
          />
          <AppRoute
            path="/app/AjGroup/PromotionalActivityList"
            component={PromotionalActivityList}
          />
          <AppRoute
            path="/views/apps/freshlist/Production/Itemproduct"
            component={Productionitem}
          />
          <AppRoute
            path="/views/apps/AjGroup/Production/Wastageproduction"
            component={Wastageproduction}
          />
          <AppRoute
            path="/views/apps/AjGroup/Production/ReturnProductionProduct"
            component={ReturnProductionProduct}
          />
          <AppRoute
            path="/views/apps/freshlist/Production/pricecalculaterproduction"
            component={pricecalculaterproduction}
          />
          <AppRoute
            path="/views/apps/freshlist/Production/productionprocesspage"
            component={productionprocesspage}
          />
          <AppRoute
            path="/views/apps/freshlist/Production/StartProduction/:id"
            component={StartProduction}
          />
          <AppRoute
            path="/views/apps/freshlist/Production/NextStepProduction/:id"
            component={NextStepProduction}
          />
          <AppRoute
            path="/views/apps/freshlist/Production/ProductionTarget/:id"
            component={ProductionTarget}
          />
          <AppRoute
            path="/views/apps/freshlist/Production/wastagematerialproduction"
            component={wastagematerialproduction}
          />
          <AppRoute
            path="/views/apps/freshlist/Production/wastagestockreturnproduction"
            component={wastagestockreturnproduction}
          />
          <AppRoute
            path="/app/rupioo/TargetCreationList/:id"
            component={TargetCreationList}
          />
          <AppRoute
            path="/app/rupioo/HeadtargetingList/:id"
            component={HeadtargetingList}
          />
          <AppRoute
            path="/app/rupioo/CustomerTarget/:id"
            component={CustomerTarget}
          />
          <AppRoute
            path="/app/SoftNumen/SalesOrderReturnList"
            component={SalesOrderReturn}
          />
          <AppRoute
            path="/app/SoftNumen/CustomerSearch"
            component={CustomerSearch}
          />
          <AppRoute
            path="/app/ajgroup/CreateTransportList"
            component={CreateTransportList}
          />
          <AppRoute
            path="/app/ajgroup/CustomizeUniqueId"
            component={CustomizeUniqueId}
          />
          <AppRoute
            path="/app/Ajgroup/order/OrderDispatchList"
            component={OrderDispatchList}
          />
          <AppRoute path="/pages/profile/userProfile" component={userProfile} />
          <AppRoute
            path="/pages/newPassword/:id"
            exact
            component={NewPassword}
            fullLayout
          />
          <AppRoute path="/app/user/edit" component={userEdit} />
          <AppRoute path="/app/user/view" component={userView} />
          <AppRoute path="/" component={Login} fullLayout />
          <AppRoute
            path="/pages/forgotpassword"
            component={forgotPassword}
            fullLayout
          />
          <AppRoute
            path="/pages/reset-password"
            component={resetPassword}
            fullLayout
          />
          <AppRoute
            path="/pages/resetpassword"
            component={myResetpass}
            fullLayout
          />
          {/* Theme Components Starts from here all the demo components*/}
          <AppRoute
            path="/email"
            exact
            component={() => <Redirect to="/email/inbox" />}
          />
          <AppRoute path="/email/:filter" component={email} />
          <AppRoute path="/chat" component={chat} />
          <AppRoute
            path="/todo"
            exact
            component={() => <Redirect to="/todo/all" />}
          />
          <AppRoute path="/todo/:filter" component={todo} />
          <AppRoute path="/calendar" component={calendar} />
          <AppRoute path="/ecommerce/shop" component={shop} />
          <AppRoute path="/ecommerce/wishlist" component={wishlist} />
          <AppRoute
            path="/ecommerce/product-detail"
            component={productDetail}
          />
          <AppRoute
            path="/ecommerce/checkout"
            component={checkout}
            permission="admin"
          />
          <AppRoute path="/data-list/list-view" component={listView} />
          <AppRoute path="/data-list/thumb-view" component={thumbView} />
          <AppRoute path="/ui-element/grid" component={grid} />
          <AppRoute path="/ui-element/typography" component={typography} />
          <AppRoute
            path="/ui-element/textutilities"
            component={textutilities}
          />
          <AppRoute
            path="/ui-element/syntaxhighlighter"
            component={syntaxhighlighter}
          />
          <AppRoute path="/Colored Selects/colors" component={colors} />
          <AppRoute path="/icons/reactfeather" component={reactfeather} />
          <AppRoute path="/cards/basic" component={basicCards} />
          <AppRoute path="/cards/statistics" component={statisticsCards} />
          <AppRoute path="/cards/analytics" component={analyticsCards} />
          <AppRoute path="/cards/action" component={actionCards} />
          <AppRoute path="/components/alerts" component={Alerts} />
          <AppRoute path="/components/buttons" component={Buttons} />
          <AppRoute path="/components/breadcrumbs" component={Breadcrumbs} />
          <AppRoute path="/components/carousel" component={Carousel} />
          <AppRoute path="/components/collapse" component={Collapse} />
          <AppRoute path="/components/dropdowns" component={Dropdowns} />
          <AppRoute path="/components/list-group" component={ListGroup} />
          <AppRoute path="/components/modals" component={Modals} />
          <AppRoute path="/components/pagination" component={Pagination} />
          <AppRoute path="/components/nav-component" component={NavComponent} />
          <AppRoute path="/components/navbar" component={Navbar} />
          <AppRoute path="/components/tabs-component" component={Tabs} />
          <AppRoute path="/components/pills-component" component={TabPills} />
          <AppRoute path="/components/tooltips" component={Tooltips} />
          <AppRoute path="/components/popovers" component={Popovers} />
          <AppRoute path="/components/badges" component={Badge} />
          <AppRoute path="/components/pill-badges" component={BadgePill} />
          <AppRoute path="/components/progress" component={Progress} />
          <AppRoute path="/components/media-objects" component={Media} />
          <AppRoute path="/components/spinners" component={Spinners} />
          <AppRoute path="/components/toasts" component={Toasts} />
          <AppRoute
            path="/extra-components/auto-complete"
            component={AutoComplete}
          />
          <AppRoute path="/extra-components/avatar" component={avatar} />
          <AppRoute path="/extra-components/chips" component={chips} />
          <AppRoute path="/extra-components/divider" component={divider} />
          <AppRoute path="/forms/wizard" component={vuexyWizard} />
          <AppRoute path="/forms/elements/select" component={select} />
          <AppRoute path="/forms/elements/switch" component={switchComponent} />
          <AppRoute path="/forms/elements/checkbox" component={checkbox} />
          <AppRoute path="/forms/elements/radio" component={radio} />
          <AppRoute path="/forms/elements/input" component={input} />
          <AppRoute path="/forms/elements/input-group" component={group} />
          <AppRoute
            path="/forms/elements/number-input"
            component={numberInput}
          />
          <AppRoute path="/forms/elements/textarea" component={textarea} />
          <AppRoute path="/forms/elements/pickers" component={pickers} />
          <AppRoute path="/forms/elements/input-mask" component={inputMask} />
          <AppRoute path="/forms/layout/form-layout" component={layout} />
          <AppRoute path="/forms/formik" component={formik} />{" "}
          <AppRoute path="/tables/reactstrap" component={tables} />
          <AppRoute path="/tables/react-tables" component={ReactTables} />
          <AppRoute path="/tables/agGrid" component={Aggrid} />
          <AppRoute path="/tables/data-tables" component={DataTable} />
          <AppRoute path="/pages/faq" component={faq} />
          <AppRoute
            path="/pages/knowledge-base"
            component={knowledgeBase}
            exact
          />
          <AppRoute path="/pages/search" component={search} />
          <AppRoute
            path="/pages/account-settings"
            component={accountSettings}
          />
          <AppRoute path="/pages/invoice" component={invoice} />
          <AppRoute
            path="/misc/coming-soon"
            component={comingSoon}
            fullLayout
          />
          <AppRoute path="/misc/error/404" component={error404} fullLayout />
          <AppRoute path="/pages/register" component={register} fullLayout />
          <AppRoute
            path="/pages/lock-screen"
            component={lockScreen}
            fullLayout
          />
          <AppRoute path="/misc/error/500" component={error500} fullLayout />
          <AppRoute
            path="/misc/not-authorized"
            component={authorized}
            fullLayout
          />
          <AppRoute
            path="/misc/maintenance"
            component={maintenance}
            fullLayout
          />
          <AppRoute path="/charts/apex" component={apex} />
          <AppRoute path="/charts/chartjs" component={chartjs} />
          <AppRoute path="/charts/recharts" component={extreme} />
          <AppRoute path="/maps/leaflet" component={leafletMaps} />
          <AppRoute path="/extensions/sweet-alert" component={sweetAlert} />
          <AppRoute path="/extensions/toastr" component={toastr} />
          <AppRoute path="/extensions/slider" component={rcSlider} />
          <AppRoute path="/extensions/file-uploader" component={uploader} />
          <AppRoute path="/extensions/wysiwyg-editor" component={editor} />
          <AppRoute path="/extensions/drag-and-drop" component={drop} />
          <AppRoute path="/extensions/tour" component={tour} />
          <AppRoute path="/extensions/clipboard" component={clipboard} />
          <AppRoute path="/extensions/context-menu" component={menu} />
          <AppRoute path="/extensions/swiper" component={swiper} />
          <AppRoute
            path="/extensions/access-control"
            component={accessControl}
          />
          <AppRoute path="/extensions/i18n" component={i18n} />
          <AppRoute path="/extensions/tree" component={tree} />
          <AppRoute path="/extensions/import" component={Import} />
          <AppRoute path="/extensions/export" component={Export} />
          <AppRoute
            path="/extensions/export-selected"
            component={ExportSelected}
          />
          <AppRoute path="/extensions/pagination" component={reactPaginate} />
          <AppRoute component={error404} fullLayout />
        </Switch>
      </HashRouter>
    );
  }
}
export default AppRouter;
