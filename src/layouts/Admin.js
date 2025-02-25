import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

// components
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import HeaderStats from "components/Headers/HeaderStats.js";

// views
import Dashboard from "views/admin/Dashboard.js";
import Settings from "views/admin/Settings.js";
import Tables from "views/admin/Tables.js";
import ViewEmployees from "views/admin/ViewEmployees";
import EmployeeDetails from "views/admin/EmployeeDetails"
import PubAuths from "views/admin/PubAuths";
import CreateBOQ from "views/admin/CreateBOQ";
import CreateEmployee from "views/admin/CreateEmployee";
import CreateTender from "views/admin/CreateTender";
import CreateItem from "views/admin/CreateItem";
import CreatePubAuth from "views/admin/CreatePubAuth";
import ViewTenders from "views/admin/ViewTenders";
import ViewItems from "views/admin/ViewItems";
import ViewBOQs from "views/admin/ViewBOQs";
import ViewBOQ from "views/admin/ViewBOQ";
import ProtectedRoute from "components/Routing/ProtectedRoute";
import ViewProducts from "views/admin/ViewProducts"
import CreateProduct from "views/admin/CreateProduct"
import ViewProductDetails from "views/admin/ViewProductDetails";
import ViewTenderDetails from "views/admin/ViewTenderDetails";
import QRCodeScanner from "components/Cards/CardQrCode";
import AttendanceCard from "components/Cards/CardAttendanceGen";
import CardWorkHistory from "components/Cards/CardWorkHistory";
import AdvancePayment from "components/Cards/AdvancePayment";
import PaymentPage from "components/Cards/PaymentPage";
import CardViewPayments from "components/Cards/CardViewPayments";
import AdvancePaymentHistory from "components/Cards/AdvancePaymentHistoy";
import CardCreateSite from "components/Cards/CardCreateSite";
import CardCreateSiteRequirement from "components/Cards/CardSiteRequirement";
import CardViewSite from "components/Cards/CardViewSite";
import CardViewSiteRequirement from "components/Cards/CardViewSiteRequirement";
export default function Admin() {
  const showHeaderStats = false;
  return (
    <>
      <Sidebar />
      <div className="relative md:ml-64 bg-blueGray-100">
        <div className="relative bg-blueGray-800 md:pt-32 pb-32 pt-12">
          <AdminNavbar />
          {showHeaderStats && <HeaderStats />}
        </div>
        <div className="px-4 md:px-10 mx-auto w-full -m-24">
          <Switch>
            <ProtectedRoute path="/admin/dashboard" exact component={Dashboard} />
            <ProtectedRoute path="/admin/settings" exact component={Settings} />
            <ProtectedRoute path="/admin/tables" exact component={Tables} />
            <ProtectedRoute path="/admin/addemployee" exact component={CreateEmployee} />
            <ProtectedRoute path="/admin/addtender" exact component={CreateTender} />
            <ProtectedRoute path="/admin/additem" exact component={CreateItem} />
            <ProtectedRoute path="/admin/viewemployees" exact component={ViewEmployees} />
            <ProtectedRoute path="/admin/employee/:id" exact component={EmployeeDetails} />
            <ProtectedRoute path="/admin/addpubauth" exact component={CreatePubAuth} />
            <ProtectedRoute path="/admin/pubauths" exact component={PubAuths} />
            <ProtectedRoute path="/admin/addboq" exact component={CreateBOQ} />
            <ProtectedRoute path="/admin/tenders" exact component={ViewTenders} />
            <ProtectedRoute path="/admin/tender/:id" exact component={ViewTenderDetails} />
            <ProtectedRoute path="/admin/viewitems" exact component={ViewItems} />
            <ProtectedRoute path="/admin/viewboqs" exact component={ViewBOQs} />
            <ProtectedRoute path="/admin/viewboq/:id" exact component={ViewBOQ} />
            <ProtectedRoute path="/admin/viewboq/:id" exact component={ViewBOQ} />
            <ProtectedRoute path="/admin/addproduct" exact component={CreateProduct} />
            <ProtectedRoute path="/admin/viewproducts" exact component={ViewProducts} />
            <ProtectedRoute path="/admin/viewproduct/:id" exact component={ViewProductDetails} />
            <ProtectedRoute path="/admin/attendance" exact component={QRCodeScanner} />
            <ProtectedRoute path="/admin/attendance-card/:id" exact component={AttendanceCard} />
            <ProtectedRoute path="/admin/working-history/:id" exact component={CardWorkHistory} />
            <ProtectedRoute path="/admin/advance-payment/:employeeId" exact component={AdvancePayment} />
            <ProtectedRoute path="/admin/payment-page/:employeeId" exact component={PaymentPage} />
            <ProtectedRoute path="/admin/view-payments/:employeeId" exact component={CardViewPayments} />
            <ProtectedRoute path="/admin/advance-payment-history/:employeeId" exact component={AdvancePaymentHistory} />
            <ProtectedRoute path="/admin/create-site/" exact component={CardCreateSite} />
            <ProtectedRoute path="/admin/site-requirement/:siteId" exact component={CardCreateSiteRequirement} />
            <ProtectedRoute path="/admin/view-site/:siteId" exact component={CardViewSite} />
            <ProtectedRoute path="/admin/view-site-requirement/:siteId" exact component={CardViewSiteRequirement} />
            <Redirect from="*" to="/admin/dashboard" />
          </Switch>
        </div>
      </div>
    </>
  );
}