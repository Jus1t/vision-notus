import React from "react";
import { Link } from "react-router-dom";
import NotificationDropdown from "components/Dropdowns/NotificationDropdown.js";
import UserDropdown from "components/Dropdowns/UserDropdown.js";

const SidebarSection = ({ title, links, onLinkClick }) => (
  <>
    <h6 className="md:min-w-full text-blueGray-500 text-xs uppercase font-bold block pt-1 pb-4 no-underline">
      {title}
    </h6>
    <ul className="md:flex-col md:min-w-full flex flex-col list-none md:mb-4">
      {links.map((link, index) => (
        <li className="items-center" key={index}>
          <Link
            className={`text-xs uppercase py-3 font-bold block ${
              window.location.href.indexOf(link.path) !== -1
                ? "text-lightBlue-500 hover:text-lightBlue-600"
                : "text-blueGray-700 hover:text-blueGray-500"
            }`}
            to={link.path}
            onClick={onLinkClick} // Call the handler when the link is clicked
          >
            <i
              className={`${link.icon} mr-2 text-sm ${
                window.location.href.indexOf(link.path) !== -1
                  ? "opacity-75"
                  : "text-blueGray-300"
              }`}
            ></i>
            {link.name}
          </Link>
        </li>
      ))}
    </ul>
  </>
);


export default function Sidebar() {
  const [collapseShow, setCollapseShow] = React.useState("hidden");

  // Employee Section Links with different icons
  const employeeLinks = [
    { name: "Add Employee", path: "/admin/addemployee", icon: "fas fa-user-plus" },
    { name: "Employees", path: "/admin/viewemployees", icon: "fas fa-users" },
  ];

  // Item Section Links with different icons
  const itemLinks = [
    { name: "Add New Item", path: "/admin/additem", icon: "fas fa-box" },
    { name: "Items", path: "/admin/viewitems", icon: "fas fa-boxes" },
  ];

  const productLinks = [
    {name: "Add New Product", path: "/admin/addproduct", icon: "fas fa-box"},
    { name: "Products", path : "/admin/viewproducts", icon: "fas fa-boxes"}
  ]

  // Tender Section Links with different icons
  const tenderLinks = [
    { name: "Add Tender", path: "/admin/addtender", icon: "fas fa-file-contract" },
    { name: "Tenders", path: "/admin/tenders", icon: "fas fa-clipboard-list" },
  ];

  // Publishing Authority Section Links with different icons
  const pubAuthLinks = [
    { name: "Add Publishing Authority", path: "/admin/addpubauth", icon: "fas fa-building" },
    { name: "Publishing Authorities", path: "/admin/pubauths", icon: "fas fa-university" },
  ];

  // BOQ Section Links with different icons
  const boqLinks = [
    { name: "Add BOQ", path: "/admin/addboq", icon: "fas fa-file-invoice-dollar" },
    { name: "View BOQs", path: "/admin/viewboqs", icon: "fas fa-clipboard-list" },
    
  ];

  const attendanceLinks=[
    {name:"Mark Attendance",path:"/admin/attendance",icon:"fas fa-file-invoice-dollar"},
  ];

  const handleLinkClick = () => {
    setCollapseShow("hidden"); // Hide the sidebar when a link is clicked
  };

  return (
    <nav className="md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto md:flex-row md:flex-nowrap md:overflow-hidden shadow-xl bg-white flex flex-wrap items-center justify-between relative md:w-64 z-10 py-4 px-6">
      <div className="md:flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0 flex flex-wrap items-center justify-between w-full mx-auto">
        {/* Toggler */}
        <button
          className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
          type="button"
          onClick={() => setCollapseShow("bg-white m-2 py-3 px-6")}
        >
          <i className="fas fa-bars"></i>
        </button>

        {/* Other sections like Brand and User dropdown remain unchanged */}

        {/* Collapse */}
        <div
          className={
            "md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-4 md:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-auto items-center flex-1 rounded " +
            collapseShow
          }
        >
          {/* Sidebar sections */}
          <SidebarSection
            title="Auth Layout Pages"
            links={[
              { name: "Login", path: "/auth/login", icon: "fas fa-sign-in-alt" },
            ]}
            onLinkClick={handleLinkClick} // Pass the handler
          />
          <SidebarSection
            title="Employee Management"
            links={employeeLinks}
            onLinkClick={handleLinkClick} // Pass the handler
          />
          <SidebarSection
            title="Item Management"
            links={itemLinks}
            onLinkClick={handleLinkClick} // Pass the handler
          />
          <SidebarSection
            title="Product Management"
            links={productLinks}
            onLinkClick={handleLinkClick} // Pass the handler
          />
          <SidebarSection
            title="Tender Management"
            links={tenderLinks}
            onLinkClick={handleLinkClick} // Pass the handler
          />
          <SidebarSection
            title="Publishing Authority"
            links={pubAuthLinks}
            onLinkClick={handleLinkClick} // Pass the handler
          />
          <SidebarSection
            title="BOQ Management"
            links={boqLinks}
            onLinkClick={handleLinkClick} // Pass the handler
          />
          <SidebarSection
            title="Attendance Management"
            links={attendanceLinks}
            onLinkClick={handleLinkClick} // Pass the handler
          />
        </div>
      </div>
    </nav>
  );
}
