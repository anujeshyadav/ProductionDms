import React, { Suspense, lazy } from "react";
import { Router, Switch, Route } from "react-router-dom";
import { history } from "./history";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import Spinner from "./components/@vuexy/spinner/Loading-spinner";
import knowledgeBaseCategory from "./views/pages/knowledge-base/Category";
import knowledgeBaseQuestion from "./views/pages/knowledge-base/Questions";
import { ContextLayout } from "./utility/context/Layout";

const analyticsDashboard = lazy(() =>
  import("./views/dashboard/analytics/AnalyticsDashboard")
);
const ecommerceDashboard = lazy(() =>
  import("./views/dashboard/ecommerce/EcommerceDashboard")
);
// const sellerDashboard = lazy(()=> import("./views/dashboard/seller/SellerDeshboard"));

// My Component starts here
const sellerList = lazy(() => import("./views/apps/seller/SellerList"));
const editSeller = lazy(() => import("./views/apps/seller/EditSeller"));
const viewSeller = lazy(() => import("./views/apps/seller/ViewSeller"));
const addSeller = lazy(() => import("./views/apps/seller/AddSeller"));
const customerList = lazy(() => import("./views/apps/customer/CustomerList"));
const addCustomer = lazy(() => import("./views/apps/customer/AddCustomer"));
const editCustomer = lazy(() => import("./views/apps/customer/EditCustomer"));
const viewCustomer = lazy(() => import("./views/apps/customer/ViewCustomer"));
const addUsers = lazy(() => import("./views/apps/users/user/AddUsers"));
const viewUsers = lazy(() => import("./views/apps/users/user/ViewUsers"));

const pendingPayment = lazy(() =>
  import("./views/apps/pendingPayment/PendingPayment")
);

const simpleProductList = lazy(() =>
  import("./views/apps/productManagement/simpleProduct/SimpleProductList")
);
const addSimpleProduct = lazy(() =>
  import("./views/apps/productManagement/simpleProduct/AddSimpleProduct")
);
const editSimpleProduct = lazy(() =>
  import("./views/apps/productManagement/simpleProduct/EditSimpleProduct")
);
const viewSimpleProduct = lazy(() =>
  import("./views/apps/productManagement/simpleProduct/ViewSimpleProduct")
);

// const coupon = lazy(() => import("./views/apps/products/coupon/Coupon"));
const allOrder = lazy(() => import("./views/apps/order/AllOrder"));

const status = lazy(() => import("./views/apps/order/Status"));
const offerList = lazy(() =>
  import("./views/apps/offerAndCoupon/offer/OfferList")
);
const addSpecialOffer = lazy(() =>
  import("./views/apps/offerAndCoupon/specialOffer/AddSpecialOffer")
);
const couponsList = lazy(() =>
  import("./views/apps/offerAndCoupon/coupons/CouponsList")
);
const addCoupons = lazy(() =>
  import("./views/apps/offerAndCoupon/coupons/AddCoupons")
);
const editCoupon = lazy(() =>
  import("./views/apps/offerAndCoupon/coupons/EditCoupon")
);
const offerByBrand = lazy(() =>
  import("./views/apps/offerAndCoupon/OfferByBrand")
);
const buyGet = lazy(() => import("./views/apps/offerAndCoupon/BuyGet"));
const rewardPoint = lazy(() => import("./views/apps/rewards/RewardPoint"));
const dealOfDay = lazy(() =>
  import("./views/apps/offerAndCoupon/dealOfDay/DealOfDay")
);
const flashSale = lazy(() =>
  import("./views/apps/offerAndCoupon/flashSale/FlashSale")
);
const commission = lazy(() => import("./views/apps/commission/Commission"));

const onlineOrders = lazy(() =>
  import("./views/apps/onlineOrders/OnlineOrders")
);
const Subscription = lazy(() =>
  import("./views/apps/subscription/Subscription")
);
const adSubscription = lazy(() =>
  import("./views/apps/adSubscription/AdSubscription")
);
const pageLayout = lazy(() => import("./views/apps/pageLayout/PageLayout"));

const stockAdjustment = lazy(() =>
  import("./views/apps/stockControl/StockAdjustment")
);
const stockTransferRequest = lazy(() =>
  import("./views/apps/stockControl/StockTransferRequest")
);

const activityLogs = lazy(() => import("./views/apps/activity/ActivityLogs"));
const addActivityLogs = lazy(() =>
  import("./views/apps/activity/AddActivityLogs")
);
const editActivityLogs = lazy(() =>
  import("./views/apps/activity/EditActivityLogs")
);
const viewActivityLogs = lazy(() =>
  import("./views/apps/activity/ViewActivityLogs")
);
const systemMails = lazy(() => import("./views/apps/activity/SystemMails"));
const addSystemMails = lazy(() =>
  import("./views/apps/activity/AddSystemMails")
);
const editSystemMails = lazy(() =>
  import("./views/apps/activity/EditSystemMails")
);
const viewSystemMails = lazy(() =>
  import("./views/apps/activity/ViewSystemMails")
);
const menuManagementList = lazy(() =>
  import("./views/apps/menuManagement/MenuManagementList")
);
const addMenuManagement = lazy(() =>
  import("./views/apps/menuManagement/AddMenuManagement")
);
const editMenuManagement = lazy(() =>
  import("./views/apps/menuManagement/EditMenuManagement")
);
const billableExpenseDetails = lazy(() =>
  import(
    "./views/apps/purchasesAndExpenses/billableExpenseDetails/BillableExpenseDetails"
  )
);
const addBillableExpenseDetails = lazy(() =>
  import(
    "./views/apps/purchasesAndExpenses/billableExpenseDetails/AddBillableExpenseDetails"
  )
);
const purchasesByItem = lazy(() =>
  import("./views/apps/purchasesAndExpenses/purchasesByItem/PurchasesByItem")
);
const addPurchasesByItem = lazy(() =>
  import("./views/apps/purchasesAndExpenses/purchasesByItem/AddPurchasesByItem")
);
const receiveHistory = lazy(() =>
  import("./views/apps/purchasesAndExpenses/receiveHistory/ReceiveHistory")
);
const adRreceiveHistory = lazy(() =>
  import("./views/apps/purchasesAndExpenses/receiveHistory/AddReceiveHistory")
);
const storesList = lazy(() => import("./views/apps/store/stores/StoresList"));
const addstores = lazy(() => import("./views/apps/store/stores/AddStores"));
const editstore = lazy(() => import("./views/apps/store/stores/EditStore"));
const viewstore = lazy(() => import("./views/apps/store/stores/ViewStore"));
const storesRequestList = lazy(() =>
  import("./views/apps/store/storesRequest/StoresRequestList")
);
const addStoresRequest = lazy(() =>
  import("./views/apps/store/storesRequest/AddStoresRequest")
);
const blogList = lazy(() => import("./views/apps/website/blog/BlogList"));
const addBlog = lazy(() => import("./views/apps/website/blog/AddBlog"));
const newsList = lazy(() => import("./views/apps/website/news/NewsList"));
const addNews = lazy(() => import("./views/apps/website/news/AddNews"));
const videosList = lazy(() => import("./views/apps/website/videos/VideosList"));
const addVideo = lazy(() => import("./views/apps/website/videos/AddVideo"));
const websitePdf = lazy(() => import("./views/apps/website/WebsitePdf"));
const websiteProImg = lazy(() =>
  import("./views/apps/website/websiteProduct/WebsiteProImg")
);
const addProImg = lazy(() =>
  import("./views/apps/website/websiteProduct/AddProImg")
);
const appBanner = lazy(() =>
  import("./views/apps/mobileApp/appBanner/AppBanner")
);
const importDemo = lazy(() =>
  import("./views/apps/helpAndSupport/importDemo/ImportDemo")
);
const privacyPolicy = lazy(() =>
  import("./views/apps/privacyPolicy/PrivacyPolicy")
);
const termsAndCondition = lazy(() =>
  import("./views/apps/termsAndCondition/TAndCList")
);
const addTAndC = lazy(() => import("./views/apps/termsAndCondition/AddTAndC"));
const addPolicy = lazy(() => import("./views/apps/privacyPolicy/AddPolicy"));
const Login = lazy(() => import("./views/pages/authentication/login/Login"));
const Subs = lazy(() =>
  import("./views/pages/authentication/subscription/Subs")
);
const forgotPassword = lazy(() =>
  import("./views/pages/authentication/ForgotPassword")
);
const resetPassword = lazy(() =>
  import("./views/pages/authentication/ResetPassword")
);
const newPassword = lazy(() =>
  import("./views/pages/authentication/NewPassword")
);

const sellerSubscription = lazy(() =>
  import("./views/apps/sellerSubs/SellerSubscription")
);
const addSub = lazy(() => import("./views/apps/sellerSubs/AddSub"));

const userProfile = lazy(() => import("./views/pages/profile/UserProfile"));
const editUserProfile = lazy(() =>
  import("./views/pages/profile/EditUserProfile")
);
const viewUserProfile = lazy(() =>
  import("./views/pages/profile/ViewUserProfile")
);
const sliderList = lazy(() => import("./views/apps/slider/SliderList"));
const addSlider = lazy(() => import("./views/apps/slider/AddSlider"));
const viewSlider = lazy(() => import("./views/apps/slider/ViewSlider"));
const editProfile = lazy(() => import("./views/apps/profile/EditProfile"));
const mySubscription = lazy(() => import("./views/apps/mySubs/MySubscription"));
const notification = lazy(() => import("./views/apps/notificat/Notification"));
const sponsoredAd = lazy(() => import("./views/apps/sponsoredAds/SponsoredAd"));

//Theme Component starts from here
const userList = lazy(() => import("./views/apps/user/list/List"));
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
const DataTable = lazy(() => import("./views/tables/data-tables/DataTables"));
const profile = lazy(() => import("./views/pages/profile/Profile"));
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

// Set Layout and Component Using App Route
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
      <Router history={history}>
        <Switch>
          <AppRoute exact path="/" component={analyticsDashboard} />
          <AppRoute
            path="/ecommerce-dashboard"
            component={ecommerceDashboard}
          />
          <AppRoute path="/app/seller/sellerList" component={sellerList} />
          <AppRoute path="/app/seller/editSeller/:id" component={editSeller} />
          <AppRoute path="/app/seller/viewSeller/:id" component={viewSeller} />
          <AppRoute path="/app/seller/addSeller" component={addSeller} />
          <AppRoute
            path="/app/customer/customerList"
            component={customerList}
          />
          s
          <AppRoute path="/app/customer/addCustomer" component={addCustomer} />
          <AppRoute
            path="/app/customer/editCustomer/:id"
            component={editCustomer}
          />
          <AppRoute
            path="/app/customer/viewCustomer/:id"
            component={viewCustomer}
          />
          <AppRoute path="/app/users/user/addUsers" component={addUsers} />
          <AppRoute
            path="/app/users/user/viewUsers/:id"
            component={viewUsers}
          />
          <AppRoute
            path="/app/pendingPayment/pendingPayment"
            component={pendingPayment}
          />
          <AppRoute
            path="/app/productManagement/simpleProduct/simpleProductList"
            component={simpleProductList}
          />
          <AppRoute
            path="/app/productManagement/simpleProduct/addSimpleProduct"
            component={addSimpleProduct}
          />
          <AppRoute
            path="/app/productManagement/simpleProduct/editSimpleProduct"
            component={editSimpleProduct}
          />
          <AppRoute
            path="/app/productManagement/simpleProduct/viewSimpleProduct/:id"
            component={viewSimpleProduct}
          />
          {/* <AppRoute path="/app/products/coupon" component={coupon} /> */}
          <AppRoute path="/app/order/allorder" component={allOrder} />
          <AppRoute path="/app/order/status" component={status} />
          <AppRoute
            path="/app/offerAndCoupon/offer/offerList"
            component={offerList}
          />
          <AppRoute
            path="/app/offerAndCoupon/specialOffer/addSpecialOffer"
            component={addSpecialOffer}
          />
          <AppRoute
            path="/app/offerAndCoupon/coupons/couponsList"
            component={couponsList}
          />
          <AppRoute
            path="/app/offerAndCoupon/coupons/addCoupons"
            component={addCoupons}
          />
          <AppRoute
            path="/app/offerAndCoupon/coupons/editCoupon/:id"
            component={editCoupon}
          />
          <AppRoute
            path="/app/offerAndCoupon/offerByBrand"
            component={offerByBrand}
          />
          <AppRoute path="/app/offerAndCoupon/buyGet" component={buyGet} />
          <AppRoute
            path="/app/offerAndCoupon/dealOfDay/dealOfDay"
            component={dealOfDay}
          />
          <AppRoute
            path="/app/offerAndCoupon/flashSale/flashSale"
            component={flashSale}
          />
          <AppRoute path="/app/reward/rewardPoint" component={rewardPoint} />
          <AppRoute path="/app/commission/commission" component={commission} />
          <AppRoute
            path="/app/subscription/subscription"
            component={Subscription}
          />
          <AppRoute
            path="/app/adSubscription/adSubscription"
            component={adSubscription}
          />
          <AppRoute
            path="/app/stockControl/stockTransferRequest"
            component={stockTransferRequest}
          />
          <AppRoute
            path="/app/stockControl/stockAdjustment"
            component={stockAdjustment}
          />
          <AppRoute
            path="/app/activity/activityLogs"
            component={activityLogs}
          />
          <AppRoute
            path="/app/activity/addActivityLogs"
            component={addActivityLogs}
          />
          <AppRoute
            path="/app/activity/editActivityLogs"
            component={editActivityLogs}
          />
          <AppRoute
            path="/app/activity/viewActivityLogs"
            component={viewActivityLogs}
          />
          <AppRoute path="/app/activity/systemMails" component={systemMails} />
          <AppRoute
            path="/app/activity/addSystemMails"
            component={addSystemMails}
          />
          <AppRoute
            path="/app/activity/editSystemMails"
            component={editSystemMails}
          />
          <AppRoute
            path="/app/activity/viewSystemMails"
            component={viewSystemMails}
          />
          <AppRoute
            path="/app/sellerSubs/sellerSubscription"
            component={sellerSubscription}
          />
          <AppRoute path="/app/sellerSubs/addSub" component={addSub} />
          <AppRoute
            path="/app/menuManagement/menuManagementList"
            component={menuManagementList}
          />
          <AppRoute
            path="/app/menuManagement/addMenuManagement"
            component={addMenuManagement}
          />
          <AppRoute
            path="/app/menuManagement/editMenuManagement"
            component={editMenuManagement}
          />
          <AppRoute
            path="/app/store/stores/storesList"
            component={storesList}
          />
          <AppRoute path="/app/store/stores/addstores" component={addstores} />
          <AppRoute
            path="/app/store/stores/editstore/:id"
            component={editstore}
          />
          <AppRoute
            path="/app/store/stores/viewstore/:id"
            component={viewstore}
          />
          <AppRoute
            path="/app/store/storesRequest/storesRequestList"
            component={storesRequestList}
          />
          <AppRoute
            path="/app/store/storesRequest/addStoresRequest"
            component={addStoresRequest}
          />
          <AppRoute
            path="/app/purchasesAndExpenses/billableExpenseDetails/addBillableExpenseDetails"
            component={addBillableExpenseDetails}
          />
          <AppRoute
            path="/app/purchasesAndExpenses/billableExpenseDetails/billableExpenseDetails"
            component={billableExpenseDetails}
          />
          <AppRoute
            path="/app/purchasesAndExpenses/purchasesByItem/addPurchasesByItem"
            component={addPurchasesByItem}
          />
          <AppRoute
            path="/app/purchasesAndExpenses/purchasesByItem/purchasesByItem"
            component={purchasesByItem}
          />
          <AppRoute
            path="/app/purchasesAndExpenses/receiveHistory/addReceiveHistory"
            component={adRreceiveHistory}
          />
          <AppRoute
            path="/app/purchasesAndExpenses/receiveHistory/receiveHistory"
            component={receiveHistory}
          />
          <AppRoute path="/app/pageLayout/pageLayout" component={pageLayout} />
          <AppRoute
            path="/app/onlineOrders/onlineOrders"
            component={onlineOrders}
          />
          <AppRoute
            path="/app/notificat/notification"
            component={notification}
          />
          <AppRoute path="/app/website/blog/blogList" component={blogList} />
          <AppRoute path="/app/website/blog/addBlog" component={addBlog} />
          <AppRoute path="/app/website/news/newsList" component={newsList} />
          <AppRoute path="/app/website/news/addNews" component={addNews} />
          <AppRoute path="/app/website/websitePdf" component={websitePdf} />
          <AppRoute
            path="/app/website/websiteProduct/websiteProImg"
            component={websiteProImg}
          />
          <AppRoute
            path="/app/website/websiteProduct/addProImg"
            component={addProImg}
          />
          <AppRoute
            path="/app/website/videos/videosList"
            component={videosList}
          />
          <AppRoute path="/app/website/videos/addVideo" component={addVideo} />
          <AppRoute
            path="/app/mobileApp/appBanner/AppBanner"
            component={appBanner}
          />
          <AppRoute
            path="/app/helpAndSupport/importDemo/ImportDemo"
            component={importDemo}
          />
          <AppRoute
            path="/app/privacyPolicy/privacyPolicy"
            component={privacyPolicy}
          />
          <AppRoute
            path="/app/termsAndCondition/tAndCList"
            component={termsAndCondition}
          />
          <AppRoute
            path="/app/termsAndCondition/addTAndC"
            component={addTAndC}
          />
          <AppRoute path="/app/privacyPolicy/addPolicy" component={addPolicy} />
          <AppRoute path="/app/slider/sliderList" component={sliderList} />
          <AppRoute path="/app/slider/addSlider" component={addSlider} />
          <AppRoute path="/app/slider/viewSlider/:id" component={viewSlider} />
          <AppRoute path="/app/user/list" component={userList} />
          <AppRoute path="/app/user/edit" component={userEdit} />
          <AppRoute path="/app/user/view" component={userView} />
          <AppRoute path="/pages/subs" component={Subs} fullLayout />
          {/* <AppRoute path="/pages/logDemo" component={ logDemo} fullLayout /> */}
          {/* <AppRoute path="/pages/login" component={Login} fullLayout /> */}
          <AppRoute
            path="/pages/forgotpassword"
            component={forgotPassword}
            fullLayout
          />
          <AppRoute
            path="/pages/reset-password"
            component={resetPassword}
            fullLayout
          />{" "}
          <AppRoute
            path="/pages/newPassword"
            component={newPassword}
            fullLayout
          />
          <AppRoute path="/pages/profile/userProfile" component={userProfile} />
          <AppRoute
            path="/pages/profile/editUserProfile/:id"
            component={editUserProfile}
          />
          <AppRoute
            path="/pages/profile/viewUserProfile/:id"
            component={viewUserProfile}
          />
          <AppRoute path="/app/profile/editProfile" component={editProfile} />
          <AppRoute
            path="/app/mysubs/mySubscription"
            component={mySubscription}
          />
          <AppRoute
            path="/app/sponsoredAds/sponsoredAd"
            component={sponsoredAd}
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
          <AppRoute path="/colors/colors" component={colors} />
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
          <AppRoute path="/pages/profile" component={profile} />
          <AppRoute path="/pages/faq" component={faq} />
          <AppRoute
            path="/pages/knowledge-base"
            component={knowledgeBase}
            exact
          />
          <AppRoute
            path="/pages/knowledge-base/category"
            component={knowledgeBaseCategory}
            exact
          />
          <AppRoute
            path="/pages/knowledge-base/category/questions"
            component={knowledgeBaseQuestion}
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
      </Router>
    );
  }
}
export default AppRouter;
