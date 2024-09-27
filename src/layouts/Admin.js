import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

// components
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import HeaderStats from "components/Headers/HeaderStats.js";
import FooterAdmin from "components/Footers/FooterAdmin.js";

// views
import Dashboard from "views/admin/Dashboard.js";
import Maps from "views/admin/Maps.js";
import Settings from "views/admin/Settings.js";
import Tables from "views/admin/Tables.js";
import AddEmployee from "views/admin/AddEmployee.js";
import AddLead from "views/admin/AddLead";
import AddItem from "views/admin/AddItem";

export default function Admin() {
  const showHeaderStats = false; // You can toggle this to true if you want to show HeaderStats

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
            <Route path="/admin/addemployee" exact component={AddEmployee} />
            <Route path="/admin/addlead" exact component={AddLead} />
            <Route path="/admin/additem" exact component={AddItem} />
            <Redirect from="*" to="/admin/dashboard" />
          </Switch>
          <FooterAdmin />
        </div>
      </div>
    </>
  );
}