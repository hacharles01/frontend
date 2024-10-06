import React from "react";
import Breadcrumb from "../components/Breadcrumb";
import EntitySwitcher from "../components/EntitySwitcher";
import FirscalYearSwitcher from "../components/FirscalYearSwitcher";
import { Link, useLocation } from "react-router-dom";
import ModulesMenu from "../../common/components/ModulesMenu";

const MenuBar = () => {
  const location = useLocation();

  return (
    <>
      {/* <div className="d-none d-lg-block">
        <ModulesMenu />
      </div> */}
      <nav>
        <div
          className="py-1 d-flex flex-wrap justify-content-between mt-0  align-items-center px-4"
          style={{
            backgroundColor: "#078ece",
            borderBottom: "1px solid #078ece",
            borderTop: "1px solid #078ece",
          }}
        >
          <span className="d-none d-md-inline">
            <Breadcrumb />
          </span>

          <div className="d-flex flex-wrap justify-content-end align-items-center pl-2">
            <Link
              style={{ textDecoration: "none", color: "#fff" }}
              to="/rbm/evaluation-guide"
              className={`px-1 rounded mr-3 d-none d-md-inline  ${
                location.pathname.includes("/rbm/evaluation-guide")
                  ? "active"
                  : " "
              }`}
            >
              <span className="text-truncate font-weight-bold  menu-item">
                Evaluation-Guide
              </span>
            </Link>
            <Link
              style={{ textDecoration: "none", color: "#fff" }}
              to="/rbm/user-guide"
              className={`  px-1 rounded mr-3 d-none d-md-inline  ${
                location.pathname.includes("/rbm/user-guide") ? "active" : " "
              }`}
            >
              <span className="text-truncate font-weight-bold  menu-item">
                User-Guide
              </span>
            </Link>
            <span className="d-inline d-md-none">
              <EntitySwitcher />
            </span>
            <FirscalYearSwitcher />
          </div>
          <span className="  mt-3 d-inline d-md-none">
            <Breadcrumb />
          </span>
        </div>
      </nav>
      <div style={{ marginTop: "0px" }}>
        <div style={{ backgroundColor: "#e5cb05", height: "2px" }}></div>
        <div style={{ backgroundColor: "#199e05", height: "2px" }}></div>
      </div>
    </>
  );
};

export default MenuBar;
