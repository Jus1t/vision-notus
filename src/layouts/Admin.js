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
            <ProtectedRoute path="/admin/viewitems" exact component={ViewItems} />
            <ProtectedRoute path="/admin/viewboqs" exact component={ViewBOQs} />
            <ProtectedRoute path="/admin/viewboq/:id" exact component={ViewBOQ} />
            <Redirect from="*" to="/admin/dashboard" />
          </Switch>
        </div>
      </div>
    </>
  );
}