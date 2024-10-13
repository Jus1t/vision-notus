import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

// components
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import HeaderStats from "components/Headers/HeaderStats.js";

// views
import Dashboard from "views/admin/Dashboard.js";
import Maps from "views/admin/Maps.js";
import Settings from "views/admin/Settings.js";
import Tables from "views/admin/Tables.js";
import ViewEmployees from "views/admin/ViewEmployees";
import EmployeeDetails from "views/admin/EmployeeDetails"
import PubAuths from "views/admin/PubAuths";
import CreateBOQ from "views/admin/CreateBOQ";
import CreateEmployee from "views/admin/CreateEmployee";
import CreateLead from "views/admin/CreateLead";
import CreateItem from "views/admin/CreateItem";
import CreatePubAuth from "views/admin/CreatePubAuth";
import Tenders from "views/admin/Tenders";

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
            <Route path="/admin/dashboard" exact component={Dashboard} />
            <Route path="/admin/maps" exact component={Maps} />
            <Route path="/admin/settings" exact component={Settings} />
            <Route path="/admin/tables" exact component={Tables} />
            <Route path="/admin/addemployee" exact component={CreateEmployee} />
            <Route path="/admin/addlead" exact component={CreateLead} />
            <Route path="/admin/additem" exact component={CreateItem} />
            <Route path="/admin/viewemployees" exact component={ViewEmployees} />
            <Route path="/admin/employee/:id" exact component={EmployeeDetails} />
            <Route path="/admin/addpubauth" exact component={CreatePubAuth} />
            <Route path="/admin/pubauths" exact component={PubAuths} />
            <Route path="/admin/addboq" exact component={CreateBOQ} />
            <Route path="/admin/tenders" exact component={Tenders} />
            <Redirect from="*" to="/admin/dashboard" />
          </Switch>
        </div>
      </div>
    </>
  );
}