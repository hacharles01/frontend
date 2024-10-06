import React from "react";
import { Link, useLocation } from "react-router-dom";

const Breadcrumb = () => {
  const location = useLocation();

  return (
    <>
      <div className="d-flex bread-crumb align-items-center ">
        <Link
          style={{ textDecoration: "none", color: "#fff" }}
          to="/structure/units"
          className={` px-1 rounded   ${
            location.pathname.includes("/structure/units") ? " active  " : " "
          }`}
        >
          <span className="text-truncate  menu-item">Units</span>
        </Link>
        <span className="material-icons text-light">chevron_right</span>
        <Link
          style={{ textDecoration: "none", color: "#fff" }}
          to="/structure/positions"
          className={`px-1 rounded ${
            location.pathname.includes("/structure/positions")
              ? " active  "
              : " "
          }`}
        >
          <span className="text-truncate menu-item">Positions</span>
        </Link>
        <span className="material-icons  text-light">chevron_right</span>

        <Link
          style={{ textDecoration: "none", color: "#fff" }}
          to="/structure/employees"
          className={`  px-1 rounded  ${
            location.pathname.includes("/structure/employees") ? "active" : " "
          }`}
        >
          <span className="text-truncate  menu-item">Employees</span>
        </Link>
      </div>
    </>
  );
};

export default Breadcrumb;
