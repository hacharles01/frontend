import React from "react";
import Breadcrumb from "./Breadcrumb";
import ModulesMenu from "../../common/components/ModulesMenu";
import { Link, useLocation } from "react-router-dom";

const MenuBar = () => {
  const location = useLocation();

  return (
    <>
      <div className="d-none d-lg-block">
        <ModulesMenu />
      </div>

      <nav>
        <div
          className="py-1 d-flex flex-wrap justify-content-between mt-0  align-items-center px-4"
          style={{
            backgroundColor: "#078ece",
            borderBottom: "1px solid #078ece",
            borderTop: "1px solid #078ece",
          }}
        >
          <Breadcrumb />

          <div className="d-flex flex-wrap justify-content-end align-items-center pl-2">
            <Link
              style={{ textDecoration: "none", color: "#fff" }}
              to="/structure/user-guide"
              className={`  px-1 rounded mr-3 d-none d-md-inline  ${
                location.pathname.includes("/structure/user-guide")
                  ? "active"
                  : " "
              }`}
            >
              <span className="text-truncate font-weight-bold  menu-item d-flex">
                <span className="material-icons">local_library</span>
                User-Guide
              </span>
            </Link>
          </div>
        </div>
      </nav>
      {/* <div style={{ marginTop: "0px" }}>
        <div style={{ backgroundColor: "#e5cb05", height: "2px" }}></div>
        <div style={{ backgroundColor: "#199e05", height: "2px" }}></div>
      </div> */}
    </>
  );
};

export default MenuBar;
