import React, { useRef } from "react";
import {
  Card,
  CardBody,
  Input,
  Row,
  Modal,
  Col,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  ModalHeader,
  ModalBody,
  Badge,
  Label,
  Button,
  Spinner,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  CustomInput,
} from "reactstrap";
import { ContextLayout } from "../../../../../utility/context/Layout";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Logo from "../../../../../assets/img/profile/pages/logomain.png";
import Papa from "papaparse";
import { ChevronDown } from "react-feather";
import { IoMdRemoveCircleOutline } from "react-icons/io";
import "../../../../../assets/scss/plugins/tables/_agGridStyleOverride.scss";
import "../../../../../assets/scss/pages/users.scss";
import {
  FaArrowAltCircleLeft,
  FaArrowAltCircleRight,
  FaFilter,
} from "react-icons/fa";
import swal from "sweetalert";
import {
  _Get,
  _Post,
  createOrderhistoryview,
  Delete_targetINlist,
  ProductListView,
} from "../../../../../ApiEndPoint/ApiCalling";
import {
  BsFillArrowDownSquareFill,
  BsFillArrowUpSquareFill,
} from "react-icons/bs";
import * as XLSX from "xlsx";
import UserContext from "../../../../../context/Context";
import { CheckPermission } from "../../house/CheckPermission";
import SuperAdminUI from "../../../../SuperAdminUi/SuperAdminUI";
import { ImDownload } from "react-icons/im";
import { CDNR_Report } from "../../../../../ApiEndPoint/Api";
import { CONSOLIDATED } from "./GSTR1ReportConst";
import moment from "moment";

const SelectedColums = [];

class GSTR1 extends React.Component {
  static contextType = UserContext;
  constructor(props) {
    super(props);
    this.gridRef = React.createRef();
    this.gridApi = null;
    this.state = {
      isOpen: false,
      MasterShow: false,
      setActiveTab: "1",
      Arrindex: "",
      rowData: [],
      HSNCodeList: [],
      HSNSummary: [],
      CreditNote: [],
      CDNURLIST: [],
      rowAllData: [],
      orderCompletedData: [],
      startDate: "",
      EndDate: "",
      ShowBill: false,
      modal: false,
      modalone: false,
      ViewData: {},
      InsiderPermissions: {},
      setMySelectedarr: [],
      SelectedCols: [],
      paginationPageSize: 15,
      currenPageSize: "",
      getPageSize: "",
      AllcolumnDefs: [],
      SelectedcolumnDefs: [],
      defaultColDef: {
        sortable: true,
        enablePivot: true,
        enableValue: true,
        resizable: true,
        suppressMenu: true,
      },

      B2CS: [
        {
          headerName: "Type",
          filter: true,
          width: 150,
          valueGetter: (params) => {
            if (params.data?.productId?.GSTRate >= 65) return "E";
            return "OE";
          },
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
                <span>{params?.value}</span>
              </div>
            );
          },
        },

        {
          headerName: "Place of Supply",
          filter: true,
          valueGetter: (params) => {
            if (params?.data?.order?.partyId?.gstNumber) {
              let data = `${params?.data?.order?.partyId?.gstNumber?.slice(
                0,
                2
              )}-${params?.data?.order.partyId.State}`;
              return data;
            }
          },
          resizable: true,
          width: 250,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
                <span>{params?.value}</span>
              </div>
            );
          },
        },
        {
          headerName: "Rate",
          field: "gstPercentage",
          filter: true,
          width: 100,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
                <span>{params?.data?.gstPercentage}</span>
              </div>
            );
          },
        },
        {
          headerName: "Appilicable % of Tax Rate",
          valueGetter: (params) => {
            if (params?.data?.productId?.GSTRate >= 65)
              return params?.data?.productId?.GSTRate;

            return null;
          },
          filter: true,
          width: 195,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">{params?.value}</div>
            );
          },
        },

        {
          headerName: "Taxable Value",
          field: "taxableAmount",
          filter: true,
          width: 120,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
                <span>{params?.data?.taxableAmount}</span>
              </div>
            );
          },
        },
        {
          headerName: "Cess Amount",
          field: "CessAmount",
          filter: true,
          width: 110,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
                <span>{params?.data?.CessAmount}</span>
              </div>
            );
          },
        },

        {
          headerName: "E-commerce GSTIN",
          valueGetter: (params) => {
            if (params?.data?.order?.partyId?.partyType == "eCommerce")
              return params?.data?.order?.partyId?.gstNumber;

            return null;
          },
          filter: true,
          width: 150,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
                <span>{params?.value}</span>
              </div>
            );
          },
        },
      ],
      B2CL: [
        {
          headerName: "Invoice Number",
          field: "order.invoiceId",
          filter: true,
          width: 140,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
                <span>{params?.data?.order?.invoiceId}</span>
              </div>
            );
          },
        },

        {
          headerName: "Invoice Date",
          field: "updatedAt",
          filter: true,
          width: 110,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
                <span>
                  {moment(params?.data?.order?.updatedAt?.split("T")[0]).format(
                    "DD-MMM-YYYY"
                  )}
                </span>
              </div>
            );
          },
        },

        {
          headerName: "Invoice Value",
          field: "order.grandTotal",
          filter: true,
          width: 110,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
                <span>{params?.data?.order?.grandTotal}</span>
              </div>
            );
          },
        },
        {
          headerName: "Place of Supply",
          filter: true,
          valueGetter: (params) => {
            if (params?.data?.order?.partyId?.gstNumber) {
              let data = `${params?.data?.order?.partyId?.gstNumber?.slice(
                0,
                2
              )}-${params?.data?.order?.partyId?.State}`;
              return data;
            }
          },
          resizable: true,
          width: 250,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
                <span>{params?.value}</span>
              </div>
            );
          },
        },

        {
          headerName: "Appilicable % of Tax Rate",
          valueGetter: (params) => {
            if (params?.data?.productId?.GSTRate >= 65)
              return params?.data?.productId?.GSTRate;

            return null;
          },
          filter: true,
          width: 195,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">{params?.value}</div>
            );
          },
        },
        {
          headerName: "Rate",
          field: "productId.GSTRate",
          filter: true,
          width: 100,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
                <span>{params?.data?.productId?.GSTRate}</span>
              </div>
            );
          },
        },
        {
          headerName: "Taxable Value",
          field: "taxableAmount",
          filter: true,
          width: 120,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
                <span>{params?.data?.taxableAmount}</span>
              </div>
            );
          },
        },

        {
          headerName: "Cess Amount",
          field: "grandTotal",
          filter: true,
          width: 110,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
                <span></span>
              </div>
            );
          },
        },
        {
          headerName: "E-commerce GSTIN",
          valueGetter: (params) => {
            if (params?.data?.order?.partyId?.partyType == "eCommerce")
              return params?.data?.order?.partyId?.gstNumber;

            return null;
          },
          filter: true,
          width: 150,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
                <span>{params?.value}</span>
              </div>
            );
          },
        },
      ],
      CDNR: [
        {
          headerName: "GSTIN/UIN of Recipient",
          field: "order.partyId.gstNumber",
          filter: true,
          width: 170,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
                <span>{params?.data?.order?.partyId?.gstNumber}</span>
              </div>
            );
          },
        },
        {
          headerName: "Receiver Name",
          field: "order.partyId.CompanyName",
          filter: true,
          width: 160,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
                <span>{params?.data?.order?.partyId?.CompanyName}</span>
              </div>
            );
          },
        },

        {
          headerName: "Note Number",
          field: "order._id",
          filter: true,
          editable: true,
          resizable: true,
          width: 150,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
                <span>{params?.data?.order?._id}</span>
              </div>
            );
          },
        },
        {
          headerName: "Note Date",
          field: "order.date",
          filter: true,
          resizable: true,
          width: 110,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
                <span>
                  {moment(params?.data?.order?.date?.split("T")[0]).format(
                    "DD-MMM-YYYY"
                  )}
                </span>
              </div>
            );
          },
        },
        {
          headerName: "Note Type",
          valueGetter: (params) => {
            if (params?.data?.order?.creditType) return "C";
            return "D";
          },
          filter: true,
          resizable: true,
          width: 130,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
                <span>{params.value}</span>
              </div>
            );
          },
        },

        {
          headerName: "Place of Supply",
          filter: true,
          valueGetter: (params) => {
            if (params?.data?.order?.partyId?.gstNumber) {
              let data = `${params?.data?.order?.partyId?.gstNumber?.slice(
                0,
                2
              )}-${params?.data?.order.partyId.State}`;
              return data;
            }
          },
          resizable: true,
          width: 250,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
                <span>{params.value}</span>
              </div>
            );
          },
        },
        {
          headerName: "Reverse Charges",
          valueGetter: (params) => {
            if (params?.data?.order?.partyId?.assignTransporter?.length > 0)
              return "Y";

            return "N";
          },
          filter: true,
          width: 140,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">{params?.value}</div>
            );
          },
        },
        {
          headerName: "Note Supply Type",
          valueGetter: (params) => {
            if (params?.data?.order?.igstTaxType)
              return "Intra-State supplies attracting IGST";
            return "Regular B2B";
          },
          filter: true,
          width: 160,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
                <span>{params?.value}</span>
              </div>
            );
          },
        },
        {
          headerName: "Note Value",
          field: "grandTotal",
          filter: true,
          width: 110,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
                <span>{params?.data?.grandTotal}</span>
              </div>
            );
          },
        },

        {
          headerName: "Applicable % of Tax Rate",
          valueGetter: (params) => {
            if (params?.data?.productId?.GSTRate >= 65)
              return params?.data?.productId?.GSTRate;

            return null;
          },
          filter: true,
          width:195,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">{params?.value}</div>
            );
          },
        },
        {
          headerName: "Rate",
          field: "gstPercentage",
          filter: true,
          width: 100,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
                <span>{params?.data?.gstPercentage}</span>
              </div>
            );
          },
        },
        {
          headerName: "Taxable Value",
          field: "taxableAmount",
          filter: true,
          width: 120,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
                <span>{params?.data?.taxableAmount}</span>
              </div>
            );
          },
        },

        {
          headerName: "Cess Amount",
          field: "",
          filter: true,
          width: 110,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
                <span></span>
              </div>
            );
          },
        },
      ],
      CDNUR: [
        {
          headerName: "UR Type",
          valueGetter: (params) => {
            return "B2CL";
          },
          filter: true,
          editable: true,
          resizable: true,
          width: 145,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
                <span>B2CL</span>
              </div>
            );
          },
        },
        {
          headerName: "Note Number",
          field: "order._id",
          filter: true,
          editable: true,
          resizable: true,
          width: 200,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
                <span>{params?.data?.order?._id}</span>
              </div>
            );
          },
        },
        {
          headerName: "Note Date",
          field: "order.date",
          filter: true,
          resizable: true,
          width: 110,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
                <span>
                  {moment(params?.data?.order?.date?.split("T")[0]).format(
                    "DD-MMM-YYYY"
                  )}
                </span>
              </div>
            );
          },
        },
        {
          headerName: "Note Type",
          valueGetter: (params) => {
            if (params?.data?.order?.creditType) return "C";
            return "D";
          },
          filter: true,
          resizable: true,
          width: 140,
          cellRendererFramework: (params) => {
            return (
              <div>
                <div className="cursor-pointer text-center">
                  <span>{params.value}</span>
                </div>
              </div>
            );
          },
        },

        {
          headerName: "Place of Supply",
          filter: true,
          valueGetter: (params) => {
            if (params?.data?.order?.partyId?.gstNumber) {
              let data = `${params?.data?.order?.partyId?.gstNumber?.slice(
                0,
                2
              )}-${params?.data?.order.partyId.State}`;
              return data;
            }
          },
          resizable: true,
          width: 250,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
                <span>{params.value}</span>
              </div>
            );
          },
        },

        {
          headerName: "Note Value",
          field: "grandTotal",
          filter: true,
          width: 120,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
                <span>{params?.data?.grandTotal}</span>
              </div>
            );
          },
        },

        {
          headerName: "Applicable % of Tax Rate",
          valueGetter: (params) => {
            if (params?.data?.productId?.GSTRate >= 65)
              return params?.data?.productId?.GSTRate;

            return null;
          },
          filter: true,
          width: 195,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">{params?.value}</div>
            );
          },
        },
        {
          headerName: "Rate",
          field: "gstPercentage",
          filter: true,
          width: 100,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
                <span>{params?.data?.gstPercentage}</span>
              </div>
            );
          },
        },
        {
          headerName: "Taxable Value",
          field: "taxableAmount",
          filter: true,
          width: 120,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
                <span>{params?.data?.taxableAmount}</span>
              </div>
            );
          },
        },

        {
          headerName: "Cess Amount",
          field: "",
          filter: true,
          width: 110,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
                <span></span>
              </div>
            );
          },
        },
      ],
      B2B: [
        {
          headerName: "GSTIN/UIN No. Of Receipient",
          field: "order.partyId.gstNumber",
          filter: true,
          width: 210,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
                <span>{params?.data?.order?.partyId?.gstNumber}</span>
              </div>
            );
          },
        },
        {
          headerName: "Receiver Name",
          field: "order.partyId.CompanyName",
          filter: true,
          resizable: true,
          width: 210,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
                <span>{params?.data?.order?.partyId?.CompanyName}</span>
              </div>
            );
          },
        },
        {
          headerName: "Invoice Number",
          field: "order.invoiceId",
          filter: true,
          width: 140,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
                <span>{params?.data?.order?.invoiceId}</span>
              </div>
            );
          },
        },
        {
          headerName: "Invoice Date",
          field: "order.updatedAt",
          filter: true,
          width: 105,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
                <span>
                  {moment(params?.data?.order?.updatedAt?.split("T")[0]).format(
                    "DD-MMM-YYYY"
                  )}
                </span>
              </div>
            );
          },
        },

        {
          headerName: "Invoice Value",
          field: "order.grandTotal",
          filter: true,
          width: 115,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
                <span>{params?.data?.order?.grandTotal}</span>
              </div>
            );
          },
        },
        {
          headerName: "Invoice id",
          field: "order.invoiceId",
          filter: true,
          width: 150,
          cellRendererFramework: (params) => {
            // console.log(params?.data);
            return (
              <div className="cursor-pointer text-center">
                <span>{params?.data?.order?.invoiceId}</span>
              </div>
            );
          },
        },
        {
          headerName: "Place of Supply",
          filter: true,
          valueGetter: (params) => {
            if (params?.data?.order?.partyId?.gstNumber) {
              let data = `${params?.data?.order?.partyId?.gstNumber?.slice(
                0,
                2
              )}-${params?.data?.order.partyId.State}`;
              return data;
            }
          },
          resizable: true,
          width: 290,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
                <span>{params?.value}</span>
              </div>
            );
          },
        },

        {
          headerName: "Reverse Charge",
          filter: true,
          valueGetter: (params) => {
            if (params?.data?.order?.partyId?.assignTransporter?.length > 0)
              return "Y";

            return "N";
          },
          width: 130,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">{params?.value}</div>
            );
          },
        },
        {
          headerName: "Appilicable % of Tax Rate",
          valueGetter: (params) => {
            if (params?.data?.productId?.GSTRate >= 65)
              return params?.data?.productId?.GSTRate;

            return null;
          },
          filter: true,
          width: 200,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">{params?.value}</div>
            );
          },
        },

        {
          headerName: "Invoice Type",
          filter: true,
          valueGetter: (params) => {
            if (params?.data?.order?.igstTaxType)
              return "Intra-State supplies attracting IGST";
            return "Regular B2B";
          },
          width: 140,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
                <span>{params?.value}</span>
              </div>
            );
          },
        },
        {
          headerName: "E-commerce GSTIN",
          valueGetter: (params) => {
            if (params?.data?.order?.partyId?.partyType == "eCommerce")
              return params?.data?.order?.partyId?.gstNumber;

            return null;
          },
          filter: true,
          width: 145,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
                <span>{params?.value}</span>
              </div>
            );
          },
        },
        {
          headerName: "Rate",
          field: "gstPercentage",
          filter: true,
          width: 100,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
                <span>{params?.data?.gstPercentage}</span>
              </div>
            );
          },
        },
        {
          headerName: "Taxable Value",
          field: "taxableAmount",
          filter: true,
          width: 120,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
                <span>{params?.data?.taxableAmount}</span>
              </div>
            );
          },
        },
        {
          headerName: "Cess Amount",
          field: "taxableAmount",
          filter: true,
          width: 110,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
                {/* <span>{params?.data?.taxableAmount}</span> */}
              </div>
            );
          },
        },
      ],
      CONSOLIDATED: [
        {
          headerName: "GSTIN/UIN No. Of Receipient",
          field: "order.partyId.gstNumber",
          filter: true,
          width: 210,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
                <span>{params?.data?.order?.partyId?.gstNumber}</span>
              </div>
            );
          },
        },
        {
          headerName: "Receiver Name",
          field: "order.partyId.CompanyName",
          filter: true,
          resizable: true,
          width: 210,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
                <span>{params?.data?.order?.partyId?.CompanyName}</span>
              </div>
            );
          },
        },
        {
          headerName: "Invoice Number",
          field: "order.invoiceId",
          filter: true,
          width: 140,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
                <span>{params?.data?.order?.invoiceId}</span>
              </div>
            );
          },
        },
        {
          headerName: "Invoice Date",
          field: "order.updatedAt",
          filter: true,
          width: 105,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
                <span>
                  {moment(params?.data?.order?.updatedAt?.split("T")[0]).format(
                    "DD-MMM-YYYY"
                  )}
                </span>
              </div>
            );
          },
        },

        {
          headerName: "Invoice Value",
          field: "order.grandTotal",
          filter: true,
          width: 115,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
                <span>{params?.data?.order?.grandTotal}</span>
              </div>
            );
          },
        },
        {
          headerName: "Invoice id",
          field: "order.invoiceId",
          filter: true,
          width: 140,
          cellRendererFramework: (params) => {
            // console.log(params?.data);
            return (
              <div className="cursor-pointer text-center">
                <span>{params?.data?.order?.invoiceId}</span>
              </div>
            );
          },
        },
        {
          headerName: "Place of Supply",
          filter: true,
          valueGetter: (params) => {
            if (params?.data?.order?.partyId?.gstNumber) {
              let data = `${params?.data?.order?.partyId?.gstNumber?.slice(
                0,
                2
              )}-${params?.data?.order.partyId.State}`;
              return data;
            }
          },
          resizable: true,
          width: 250,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
                <span>{params?.value}</span>
              </div>
            );
          },
        },

        {
          headerName: "Reverse Charge",
          filter: true,
          valueGetter: (params) => {
            if (params?.data?.order?.partyId?.assignTransporter?.length > 0)
              return "Y";

            return "N";
          },
          width: 130,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">{params?.value}</div>
            );
          },
        },
        {
          headerName: "Appilicable % of Tax Rate",
          valueGetter: (params) => {
            if (params?.data?.productId?.GSTRate >= 65)
              return params?.data?.productId?.GSTRate;

            return null;
          },
          filter: true,
          width: 200,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">{params?.value}</div>
            );
          },
        },

        {
          headerName: "Invoice Type",
          filter: true,
          valueGetter: (params) => {
            if (params?.data?.order?.igstTaxType)
              return "Intra-State supplies attracting IGST";
            return "Regular B2B";
          },
          width: 140,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
                <span>{params?.value}</span>
              </div>
            );
          },
        },
        {
          headerName: "E-commerce GSTIN",
          valueGetter: (params) => {
            if (params?.data?.order?.partyId?.partyType == "eCommerce")
              return params?.data?.order?.partyId?.gstNumber;

            return null;
          },
          filter: true,
          width: 145,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
                <span>{params?.value}</span>
              </div>
            );
          },
        },
        {
          headerName: "Rate",
          field: "gstPercentage",
          filter: true,
          width: 100,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
                <span>{params?.data?.gstPercentage}</span>
              </div>
            );
          },
        },
        {
          headerName: "Taxable Value",
          field: "taxableAmount",
          filter: true,
          width: 115,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
                <span>{params?.data?.taxableAmount}</span>
              </div>
            );
          },
        },
        {
          headerName: "Cess Amount",
          field: "taxableAmount",
          filter: true,
          width: 110,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
                {/* <span>{params?.data?.taxableAmount}</span> */}
              </div>
            );
          },
        },
      ],
      columnDefs: [],
    };
  }
  toggleTab = (tab) => {
    const Context = this.context;
    let ComGSt = Context?.CompanyDetails?.gstNo?.slice(0, 2);

    const userInfo = JSON.parse(localStorage.getItem("userData"));
    if (this.state.setActiveTab !== tab) {
      this.setState({ setActiveTab: tab });
    }
    // important conditions below
    if (tab == 1) {
      //B2B
      this.setState({ Dropdown: false });
      let selected = this.state.rowAllData?.filter(
        (ele) => ele?.order?.partyId?.partyType == "Debitor"
      );
      this.setState({ columnDefs: this.state.B2B });
      this.setState({ rowData: selected });
    } else if (tab == 2) {
      //B2CL
      let selected = this.state.rowAllData?.filter(
        (ele) =>
          ele?.order?.igstTaxType == 1 &&
          ele?.order?.partyId?.registrationType == "Regular" &&
        ele?.grandTotal > 250000
      );
      this.setState({ Dropdown: false });
      this.setState({ rowData: selected });
      this.setState({ columnDefs: this.state.B2CL });
    } else if (tab == 3) {
      //B2CS
      this.setState({ Dropdown: false });
      let selected = this.state.rowAllData?.filter(
        (ele) => ele?.order?.partyId?.registrationType == "UnRegister"
      );

      // let intraState = selected?.filter(
      //   (ele) => ele?.order?.partyId?.gstNumber?.slice(0, 2) == ComGSt
      // );
      this.setState({ rowData: selected });
      this.setState({ columnDefs: this.state.B2CS });
    } else if (tab == 4) {
      
      //CDNR
      this.setState({ Dropdown: false });

      let cdNrlist = this.state.CDNURLIST?.filter(
        (ele) => ele?.order?.partyId?.registrationType == "Regular"
      );
      let CDNRList = [...cdNrlist];
      this.setState({ rowData: CDNRList });
      this.setState({ columnDefs: this.state.CDNR });
    } else if (tab == 5) {
      // CDNUR
      debugger
      this.setState({ Dropdown: false });
      let cdNrlist = this.state.CDNURLIST?.filter(
        (ele) =>
          ele?.igstRate > 0 &&
          ele?.order?.partyId?.registrationType == "UnRegister" &&
          ele?.grandTotal > 250000
      );

      let CDNRList = [...cdNrlist];
      this.setState({ rowData: CDNRList });
      this.setState({ columnDefs: this.state.CDNUR });

      // end
    } else if (tab == 6) {
      //CONSOLIDATED 
      this.setState({ Dropdown: false });
      this.setState({ columnDefs: this.state.CONSOLIDATED });
      this.setState({ rowData: this.state.rowAllData });
    }
   
  };

  LookupviewStart = () => {
    this.setState((prevState) => ({
      modal: !prevState.modal,
    }));
  };

  async Apicalling(id, db) {
    this.setState({ Loading: true });

    await createOrderhistoryview(id)
      .then((res) => {
        let completed = res?.orderHistory?.filter(
          (ele) => ele?.status == "completed"
        );
        let Alldata = completed?.flatMap((element, index) => {
          return element?.orderItems?.map((val, i) => {
            return { ...val, order: element };
          });
        });
       
        if (Alldata?.length > 0) {
          this.setState({ Loading: false });
          let selected = Alldata?.filter(
            (ele) => ele?.order?.partyId?.partyType == "Debitor" && ele?.order?.partyId?.registrationType=="Regular"
          );
          this.setState({
            rowData: selected,
            rowAllData: Alldata,
            orderCompletedData: completed,
          });
        }
        this.setState({ AllcolumnDefs: this.state.B2B });
        this.setState({ SelectedCols: this.state.B2B });

        let userHeading = JSON.parse(localStorage.getItem("GSTRREPORTS"));
        if (userHeading?.length) {
          this.setState({ columnDefs: userHeading });
          // this.gridApi.setColumnDefs(userHeading);
          this.setState({ SelectedcolumnDefs: userHeading });
        } else {
          this.setState({ columnDefs: this.state.B2B });
          this.setState({ SelectedcolumnDefs: this.state.B2B });
        }
      })
      .catch((err) => {
        this.setState({ rowData: [] });
        this.setState({ Loading: false });
      });
  }
  handleSelectHsnCode = (e) => {
    e.preventDefault();
    let Summary = this.state.HSNWhole?.filter(
      (ele) => ele?.HSN_Code == this.state.SelectedHSN
    );
    this.setState({ rowData: Summary });
    if (Summary?.length > 0) {
      let TaxPercentage = Summary[0].GSTRate;
      let Taxable = [],
        GrandTotal = null,
        SGST = null,
        CGST = null,
        IGST = null;
      Summary?.map((ele) => {
        Taxable.push(ele?.Product_MRP);
      });
      let TotalTaxable = Taxable.reduce((a, b) => a + b, 0);
      SGST = (TotalTaxable * TaxPercentage) / 200;
      CGST = (TotalTaxable * TaxPercentage) / 200;
      IGST = (TotalTaxable * TaxPercentage) / 100;
      GrandTotal = TotalTaxable + IGST;
      this.setState({
        TotalTaxable,
        TaxPercentage,
        SGST,
        CGST,
        IGST,
        GrandTotal,
      });
    }
  };
  async HSNCodeSummary(id, db) {
    this.setState({ Loading: true });
    await ProductListView(id, db)
      .then((res) => {
        this.setState({ Loading: false });
        let ProductList = res?.Product?.map((ele) => {
          return ele?.HSN_Code;
        });

        let Unique = new Set([...ProductList]);
        this.setState({ HSNCodeList: ProductList });

        if (res?.Product) {
          this.setState({ SelectedHSN: Unique[0] });
          this.setState({ HSNSummary: res?.Product });
          this.setState({ HSNWhole: res?.Product });
        }
      })
      .catch((err) => {
        this.setState({ Loading: false });

        console.log(err);
      });
  }
  async CreditNote(id, db) {
    this.setState({ Loading: true });
    await _Post(CDNR_Report, db, id)
      .then((res) => {
        let Alldata = res?.CDNR?.flatMap((element, index) => {
          return element?.productItems?.map((val, i) => {
            return { ...val, order: element };
          });
        });
        // console.log(Alldata);
        this.setState({ CDNURLIST: Alldata });
      })
      .catch((err) => {
        console.log(err);
      });
  }
  async componentDidMount() {
    const userInfo = JSON.parse(localStorage.getItem("userData"));
    const UserInformation = this.context?.UserInformatio;
    if (userInfo?.rolename?.roleName === "MASTER") {
      this.setState({ MasterShow: true });
    }
    const InsidePermissions = CheckPermission("GSTR 1");
    this.setState({ InsiderPermissions: InsidePermissions });
    await this.Apicalling(userInfo?._id, userInfo?.database);
    await this.CreditNote(userInfo?._id, userInfo?.database);
    await this.HSNCodeSummary(userInfo?._id, userInfo?.database);
  }

  toggleDropdown = () => {
    this.setState((prevState) => ({ isOpen: !prevState.isOpen }));
  };

  runthisfunction(id) {
    swal("Warning", "Sure You Want to Delete it", {
      buttons: {
        cancel: "cancel",
        catch: { text: "Delete ", value: "delete" },
      },
    }).then((value) => {
      switch (value) {
        case "delete":
          Delete_targetINlist(id)
            .then((res) => {
              let selectedData = this.gridApi.getSelectedRows();
              this.gridApi.updateRowData({ remove: selectedData });
            })
            .catch((err) => {
              console.log(err);
            });
          break;
        default:
      }
    });
  }

  onGridReady = (params) => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridRef.current = params.api;

    this.setState({
      currenPageSize: this.gridApi.paginationGetCurrentPage() + 1,
      getPageSize: this.gridApi.paginationGetPageSize(),
      totalPages: this.gridApi.paginationGetTotalPages(),
    });
  };

  updateSearchQuery = (val) => {
    this.gridApi.setQuickFilter(val);
  };

  filterSize = (val) => {
    if (this.gridApi) {
      this.gridApi.paginationSetPageSize(Number(val));
      this.setState({
        currenPageSize: val,
        getPageSize: val,
      });
    }
  };
  handleChangeHeader = (e, value, index) => {
    let check = e.target.checked;
    if (check) {
      SelectedColums?.push(value);
    } else {
      const delindex = SelectedColums?.findIndex(
        (ele) => ele?.headerName === value?.headerName
      );

      SelectedColums?.splice(delindex, 1);
    }
  };
  parseCsv(csvData) {
    return new Promise((resolve, reject) => {
      Papa.parse(csvData, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          if (result.data && result.data.length > 0) {
            resolve(result.data);
          } else {
            reject(new Error("No data found in the CSV"));
          }
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  }
  generatePDF(parsedData) {
    let pdfsize = [Object.keys(parsedData[0])][0].length;
    let size = pdfsize > 15 ? "a1" : pdfsize < 14 > 10 ? "a3" : "a4";

    const doc = new jsPDF("landscape", "mm", size, false);
    doc.setTextColor(5, 87, 97);
    const tableData = parsedData.map((row) => Object.values(row));
    doc.addImage(Logo, "JPEG", 10, 10, 50, 30);
    let date = new Date();
    doc.setCreationDate(date);
    doc.text("UserAccount", 14, 51);
    doc.autoTable({
      head: [Object.keys(parsedData[0])],
      body: tableData,
      startY: 60,
    });

    doc.save("GSTRReport.pdf");
  }

  exportToPDF = async () => {
    const csvData = this.gridApi.getDataAsCsv({
      processCellCallback: this.processCell,
    });
    try {
      const parsedData = await this.parseCsv(csvData);
      this.generatePDF(parsedData);
    } catch (error) {
      console.error("Error parsing CSV:", error);
    }
  };
  processCell = (params) => {
    return params.value;
  };

  convertCsvToExcel(csvData) {
    return new Promise((resolve) => {
      Papa.parse(csvData, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: function (result) {
          const worksheet = XLSX.utils.json_to_sheet(result.data);
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
          const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array",
          });
          const blob = new Blob([excelBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
          resolve(blob);
        },
      });
    });
  }
  downloadExcelFile(blob) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "GSTRReport.xlsx";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  }

  exportToExcel = async (e) => {
    const CsvData = this.gridApi.getDataAsCsv({
      processCellCallback: this.processCell,
    });
    const blob = await this.convertCsvToExcel(CsvData);
    this.downloadExcelFile(blob);
  };

  convertCSVtoExcel = () => {
    const CsvData = this.gridApi.getDataAsCsv({
      processCellCallback: this.processCell,
    });
    Papa.parse(CsvData, {
      complete: (result) => {
        const ws = XLSX.utils.json_to_sheet(result.data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        const excelType = "xls";
        XLSX.writeFile(wb, `GSTRReport.${excelType}`);
      },
    });
  };

  shiftElementUp = () => {
    let currentIndex = this.state.Arrindex;
    if (currentIndex > 0) {
      const myArrayCopy = [...this.state.SelectedcolumnDefs];
      const elementToMove = myArrayCopy.splice(currentIndex, 1)[0];
      this.setState({ Arrindex: currentIndex - 1 });
      myArrayCopy.splice(currentIndex - 1, 0, elementToMove);
      this.setState({ SelectedcolumnDefs: myArrayCopy });
    }
  };

  shiftElementDown = () => {
    let currentIndex = this.state.Arrindex;
    if (currentIndex < this.state.SelectedcolumnDefs.length - 1) {
      const myArrayCopy = [...this.state.SelectedcolumnDefs];
      const elementToMove = myArrayCopy.splice(currentIndex, 1)[0];
      this.setState({ Arrindex: currentIndex + 1 });
      myArrayCopy.splice(currentIndex + 1, 0, elementToMove);
      this.setState({ SelectedcolumnDefs: myArrayCopy });
    }
  };
  handleDate = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleSubmitDate = () => {
    // console.log(this.state.rowAllData);
    const filteredItems = this.state.rowAllData?.filter((item) => {
      const dateList = new Date(item.updatedAt);
      const onlyDate = dateList.toISOString().split("T")[0];
      return onlyDate >= this.state.startDate && onlyDate <= this.state.EndDate;
    });
    this.setState({ rowData: filteredItems });
  };
  convertCsvToXml = () => {
    const CsvData = this.gridApi.getDataAsCsv({
      processCellCallback: this.processCell,
    });
    Papa.parse(CsvData, {
      complete: (result) => {
        const rows = result.data;

        let xmlString = "<root>\n";

        rows.forEach((row) => {
          xmlString += "  <row>\n";
          row.forEach((cell, index) => {
            xmlString += `    <field${index + 1}>${cell}</field${index + 1}>\n`;
          });
          xmlString += "  </row>\n";
        });

        xmlString += "</root>";
        const blob = new Blob([xmlString], { type: "text/xml" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "output.xml";
        link.click();
      },
    });
  };

  HandleSetVisibleField = (e) => {
    e.preventDefault();

    this.gridApi.setColumnDefs(this.state.SelectedcolumnDefs);
    this.setState({ columnDefs: this.state.SelectedcolumnDefs });
    this.setState({ SelectedcolumnDefs: this.state.SelectedcolumnDefs });
    this.setState({ rowData: this.state.rowData });
    localStorage.setItem(
      "GSTRREPORTS",
      JSON.stringify(this.state.SelectedcolumnDefs)
    );
    this.LookupviewStart();
  };

  HeadingRightShift = () => {
    const updatedSelectedColumnDefs = [
      ...new Set([
        ...this.state.SelectedcolumnDefs.map((item) => JSON.stringify(item)),
        ...SelectedColums.map((item) => JSON.stringify(item)),
      ]),
    ].map((item) => JSON.parse(item));
    this.setState({
      SelectedcolumnDefs: [...new Set(updatedSelectedColumnDefs)], // Update the state with the combined array
    });
  };
  handleLeftShift = () => {
    let SelectedCols = this.state.SelectedcolumnDefs?.slice();
    let delindex = this.state.Arrindex; /* Your delete index here */

    if (SelectedCols && delindex >= 0) {
      const splicedElement = SelectedCols?.splice(delindex, 1); // Remove the element

      this.setState({
        SelectedcolumnDefs: SelectedCols, // Update the state with the modified array
      });
    }
  };
  handleParentSubmit = (e) => {
    e.preventDefault();
    let SuperAdmin = JSON.parse(localStorage.getItem("SuperadminIdByMaster"));
    let id = SuperAdmin.split(" ")[0];
    let db = SuperAdmin.split(" ")[1];
    this.Apicalling(id, db);
  };
  handleDropdownChange = (selectedValue) => {
    localStorage.setItem("SuperadminIdByMaster", JSON.stringify(selectedValue));
  };
  render() {
    if (this.state.Loading) {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20rem",
          }}>
          <Spinner
            style={{
              height: "4rem",
              width: "4rem",
            }}
            color="primary">
            Loading...
          </Spinner>
        </div>
      );
    }
    const {
      rowData,
      columnDefs,
      defaultColDef,
      SelectedcolumnDefs,
      isOpen,
      InsiderPermissions,
      setActiveTab,
      SelectedCols,
      AllcolumnDefs,
    } = this.state;
    return (
      <>
        <div className="app-user-list">
          <Card>
            <Row style={{marginLeft:'3px',marginRight:'3px'}}>
              <Col  >
                <h2 className="float-left " style={{ fontWeight: "600" ,textTransform:'uppercase', fontSize:'18px' ,marginTop:"25px"}}>
                  GSTR1
                </h2>
              </Col>

              {this.state.MasterShow && this.state.MasterShow ? (
                <Col lg="2" md="2" xl="2" style={{ marginTop: "25px" }}>
                  <SuperAdminUI
                    onDropdownChange={this.handleDropdownChange}
                    onSubmit={this.handleParentSubmit}
                  />
                </Col>
              ) : (
                <Col></Col>
              )}
              <Col lg="3" xl="3" md="3" style={{ marginTop: "25px" }}>
                <div className="table-input cssforproductlist">
                  <Input
                    placeholder="search Item here..."
                    onChange={(e) => this.updateSearchQuery(e.target.value)}
                    value={this.state.value}
                  />
                </div>
              </Col>
              <Col xl="4" lg="4" md="4">
                <Row>
                  <Col xl="5" lg="5" md="5" style={{ marginTop: "5px" }}>
                    <div className="table-input cssforproductlist">
                      <Label>Start Date</Label>
                      <Input
                        type="date"
                        name="startDate"
                        value={this.state.startDate}
                        onChange={this.handleDate}
                      />
                    </div>
                  </Col>
                  <Col xl="5" lg="5" md="5" style={{ marginTop: "5px" }}>
                    <div className="table-input cssforproductlist">
                      <Label>End Date</Label>
                      <Input
                        type="date"
                        name="EndDate"
                        value={this.state.EndDate}
                        onChange={this.handleDate}
                      />
                    </div>
                  </Col>
                  <Col xl="2" lg="2" md="2" style={{ marginTop: "25px" }}>
                    <div className="table-input">
                      <Button
                        type="submit"
                        style={{
                          cursor: "pointer",
                          backgroundColor: "rgb(8, 91, 245)",
                          color: "white",
                          fontWeight: "600",
                          height: "43px",
                        }}
                        className="float-left "
                        color="#39cccc"
                        onClick={this.handleSubmitDate}>
                        Submit
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Col>
              {/* {this.state.Dropdown && (
                <>
                  <Col lg="2" md="2" sm="2">
                    <Label>Select HSN</Label>
                    <CustomInput
                      value={this.state.SelectedHSN}
                      onChange={(e) =>
                        this.setState({ SelectedHSN: e.target.value })
                      }
                      type="select">
                      <option>-----Select-----</option>
                      {this.state.HSNCodeList?.length > 0 &&
                        this.state.HSNCodeList.map((ele) => {
                          return (
                            <option key={ele} value={ele}>
                              {ele}
                            </option>
                          );
                        })}
                    </CustomInput>
                  </Col>
                  <Col lg="1" md="1" sm="1">
                    <Button
                      onClick={this.handleSelectHsnCode}
                      className="mt-2"
                      color="primary">
                      Submit
                    </Button>
                  </Col>
                </>
              )} */}
              <Col lg="1" md="1" style={{ marginTop: "25px" }}>
                {InsiderPermissions && InsiderPermissions?.View && (
                  <span className="">
                    <FaFilter
                      style={{ cursor: "pointer" }}
                      title="filter coloumn"
                      size="35px"
                      onClick={this.LookupviewStart}
                      color="rgb(8, 91, 245)"
                      className="float-right "
                    />
                  </span>
                )}
                {InsiderPermissions && InsiderPermissions?.Download && (
                  <span
                    onMouseEnter={this.toggleDropdown}
                    onMouseLeave={this.toggleDropdown}
                    className="">
                    <div className="dropdown-container float-right">
                      <ImDownload
                        style={{ cursor: "pointer" }}
                        title="Download file"
                        size="35px"
                        className="dropdown-button "
                        color="rgb(8, 91, 245)"
                      />
                      {isOpen && (
                        <div
                          style={{
                            position: "absolute",
                            zIndex: "1",
                            border: "1px solid rgb(8, 91, 245)",
                            backgroundColor: "white",
                          }}
                          className="dropdown-content dropdownmy">
                          <h5
                            onClick={() => this.exportToPDF()}
                            style={{ cursor: "pointer" }}
                            className=" mx-1 myactive mt-1">
                            .PDF
                          </h5>
                          <h5
                            onClick={() => this.gridApi.exportDataAsCsv()}
                            style={{ cursor: "pointer" }}
                            className=" mx-1 myactive">
                            .CSV
                          </h5>
                          <h5
                            onClick={this.convertCSVtoExcel}
                            style={{ cursor: "pointer" }}
                            className=" mx-1 myactive">
                            .XLS
                          </h5>
                          <h5
                            onClick={this.exportToExcel}
                            style={{ cursor: "pointer" }}
                            className=" mx-1 myactive">
                            .XLSX
                          </h5>
                          <h5
                            onClick={() => this.convertCsvToXml()}
                            style={{ cursor: "pointer" }}
                            className=" mx-1 myactive">
                            .XML
                          </h5>
                        </div>
                      )}
                    </div>
                  </span>
                )}
              </Col>
            </Row>
            <hr className="mt-1" />
            <Row className="">
              <Col>
                <div className="  ">
                  <Nav
                    tabs
                    style={{
                      display: "flex",
                      justifyContent: "space-around",
                    }}>
                    <NavItem className={setActiveTab === "1" ? "active " : ""}>
                      <NavLink
                        className={setActiveTab === "1" ? "active" : ""}
                        onClick={() => {
                          this.toggleTab("1");
                        }}>
                        <div className="d-flex justify-content-center">B2B</div>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={setActiveTab === "2" ? "active" : ""}
                        onClick={() => {
                          this.toggleTab("2");
                        }}>
                        <div className="d-flex justify-content-center">
                          B2CL
                        </div>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={setActiveTab === "3" ? "active" : ""}
                        onClick={() => {
                          this.toggleTab("3");
                        }}>
                        <div className="d-flex justify-content-center">
                          B2CS
                        </div>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={setActiveTab === "4" ? "active" : ""}
                        onClick={() => {
                          this.toggleTab("4");
                        }}>
                        <div className="d-flex justify-content-center">
                          CDNR
                        </div>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={setActiveTab === "5" ? "active" : ""}
                        onClick={() => {
                          this.toggleTab("5");
                        }}>
                        <div className="d-flex justify-content-center">
                          CDNUR
                        </div>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={setActiveTab === "6" ? "active" : ""}
                        onClick={() => {
                          this.toggleTab("6");
                        }}>
                        <div className="d-flex justify-content-center">
                          CONSOLIDATED
                        </div>
                      </NavLink>
                    </NavItem>
                    {/* <NavItem>
                      <NavLink
                        className={setActiveTab === "7" ? "active" : ""}
                        onClick={() => {
                          this.toggleTab("7");
                        }}>
                        <div className="d-flex justify-content-center">
                          HSN WISE
                        </div>
                      </NavLink>
                    </NavItem> */}
                  </Nav>

                  <CardBody style={{ marginTop: "-3rem" }}>
                    {this.state.rowData === null ? null : (
                      <div className="ag-theme-material w-100 my-2 ag-grid-table">
                        <ContextLayout.Consumer className="ag-theme-alpine">
                          {(context) => (
                            <AgGridReact
                              id="myAgGrid"
                              gridOptions={this.gridOptions}
                              rowSelection="multiple"
                              defaultColDef={defaultColDef}
                              columnDefs={columnDefs}
                              rowData={rowData}
                              onGridReady={this.onGridReady}
                              colResizeDefault={"shift"}
                              animateRows={true}
                              floatingFilter={false}
                             pagination={true}
                              paginationPageSize={this.state.paginationPageSize}
                              pivotPanelShow="always"
                              enableRtl={context.state.direction === "rtl"}
                              ref={this.gridRef} // Attach the ref to the grid
                              domLayout="autoHeight" // Adjust layout as needed
                            />
                          )}
                        </ContextLayout.Consumer>
                      </div>
                    )}
                  </CardBody>
                </div>
              </Col>
            </Row>
            <TabContent activeTab={setActiveTab}>
              <TabPane tabId="1"></TabPane>
              <TabPane tabId="7">
                <Row className="mb-1">
                  <Col></Col>
                  <Col lg="2" md="2" sm="12">
                    <Card>
                      <div className="d-flex justify-content-end mr-2">
                        <span style={{ fontSize: "18px" }}>
                          Taxable : {this.state.TotalTaxable}
                        </span>
                      </div>
                      <div className="d-flex justify-content-end mr-2 ">
                        <span style={{ fontSize: "18px" }}>
                          GST % : {this.state.TaxPercentage}
                        </span>
                      </div>
                      <div className="d-flex justify-content-end mr-2 ">
                        <span style={{ fontSize: "18px" }}>
                          SGST : {this.state.SGST}
                        </span>
                      </div>
                      <div className="d-flex justify-content-end mr-2 ">
                        <span style={{ fontSize: "18px" }}>
                          CGST : {this.state.CGST}
                        </span>
                      </div>
                      <div className="d-flex justify-content-end mr-2 ">
                        <span style={{ fontSize: "18px" }}>
                          IGST : {this.state.IGST}
                        </span>
                      </div>
                      <hr />
                      <div className="d-flex justify-content-end mr-2 ">
                        <span style={{ fontSize: "18px" }}>
                          Grand Total : {this.state.GrandTotal}
                        </span>
                      </div>
                      <hr />
                    </Card>
                  </Col>
                </Row>
              </TabPane>
            </TabContent>
          </Card>
        </div>

        <Modal
          isOpen={this.state.modal}
          toggle={this.LookupviewStart}
          className={this.props.className}
          style={{ maxWidth: "1050px" }}>
          <ModalHeader toggle={this.LookupviewStart}>Change Fileds</ModalHeader>
          <ModalBody className="modalbodyhead">
            <Row>
              <Col lg="4" md="4" sm="12" xl="4" xs="12">
                <h4>Available Columns</h4>
                <div className="mainshffling">
                  <div class="ex1">
                    {AllcolumnDefs &&
                      AllcolumnDefs?.map((ele, i) => {
                        return (
                          <>
                            <div
                              onClick={(e) =>
                                this.handleChangeHeader(e, ele, i)
                              }
                              key={i}
                              className="mycustomtag mt-1">
                              <span className="mt-1">
                                <h5
                                  style={{ cursor: "pointer" }}
                                  className="allfields">
                                  <input
                                    type="checkbox"
                                    // checked={check && check}
                                    className="mx-1"
                                  />

                                  {ele?.headerName}
                                </h5>
                              </span>
                            </div>
                          </>
                        );
                      })}
                  </div>
                </div>
              </Col>
              <Col lg="2" md="2" sm="12" xl="2" xs="12" className="colarrowbtn">
                <div className="mainarrowbtn">
                  <div style={{ cursor: "pointer" }}>
                    <FaArrowAltCircleRight
                      onClick={this.HeadingRightShift}
                      className="arrowassign"
                      size="30px"
                    />
                  </div>
                  <div style={{ cursor: "pointer" }} className="my-2">
                    <FaArrowAltCircleLeft
                      onClick={this.handleLeftShift}
                      className="arrowassign"
                      size="30px"
                    />
                  </div>
                </div>
              </Col>
              <Col lg="6" md="6" sm="12" xl="6" xs="12">
                <Row>
                  <Col lg="8" md="8" sm="12" xs="12">
                    <h4>Visible Columns</h4>
                    <div className="mainshffling">
                      <div class="ex1">
                        {SelectedcolumnDefs &&
                          SelectedcolumnDefs?.map((ele, i) => {
                            return (
                              <>
                                <div key={i} className="mycustomtag mt-1">
                                  <span className="mt-1">
                                    <h5
                                      onClick={() =>
                                        this.setState({ Arrindex: i })
                                      }
                                      style={{
                                        cursor: "pointer",
                                        backgroundColor: `${
                                          this.state.Arrindex === i
                                            ? "#1877f2"
                                            : ""
                                        }`,
                                      }}
                                      className="allfields">
                                      <IoMdRemoveCircleOutline
                                        onClick={() => {
                                          const SelectedCols =
                                            this.state.SelectedcolumnDefs?.slice();
                                          const delindex =
                                            SelectedCols?.findIndex(
                                              (element) =>
                                                element?.headerName ==
                                                ele?.headerName
                                            );

                                          if (SelectedCols && delindex >= 0) {
                                            const splicedElement =
                                              SelectedCols?.splice(delindex, 1); // Remove the element
                                            // splicedElement contains the removed element, if needed

                                            this.setState({
                                              SelectedcolumnDefs: SelectedCols, // Update the state with the modified array
                                            });
                                          }
                                        }}
                                        style={{ cursor: "pointer" }}
                                        size="25px"
                                        color="red"
                                        className="mr-1"
                                      />

                                      {ele?.headerName}
                                    </h5>
                                  </span>
                                </div>
                              </>
                            );
                          })}
                      </div>
                    </div>
                  </Col>
                  <Col lg="4" md="4" sm="12" xs="12">
                    <div className="updownbtn justify-content-center">
                      <div>
                        <BsFillArrowUpSquareFill
                          className="arrowassign mb-1"
                          size="30px"
                          onClick={this.shiftElementUp}
                        />
                      </div>
                      <div>
                        <BsFillArrowDownSquareFill
                          onClick={this.shiftElementDown}
                          className="arrowassign"
                          size="30px"
                        />
                      </div>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="d-flex justify-content-center">
                  {/* <Button onClick={this.HandleSetVisibleField} color="primary">
                    Submit
                  </Button> */}

                  <Badge
                    style={{ cursor: "pointer" }}
                    className=""
                    color="primary"
                    onClick={this.HandleSetVisibleField}>
                    Submit
                  </Badge>
                </div>
              </Col>
            </Row>
          </ModalBody>
        </Modal>
      </>
    );
  }
}
export default GSTR1;
