import React from "react";
import { Link, useLocation } from "react-router-dom";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { connect } from "react-redux";

const Breadcrumb = (props) => {
  const location = useLocation();

  const { user } = props;

  return (
    <>
      <div className="d-flex bread-crumb align-items-center ">
        <Link
          style={{ textDecoration: "none", color: "#fff" }}
          to="/rbm/expected-results"
          className={`px-1 rounded   ${
            location.pathname.includes("/rbm/expected-results")
              ? " active  "
              : " "
          }`}
        >
          <span className="text-truncate  menu-item">Outputs</span>
        </Link>

        <ChevronRightIcon className="text-light" />

        <Link
          style={{ textDecoration: "none", color: "#fff" }}
          to="/rbm/unit-indicators"
          className={`px-1 rounded ${
            location.pathname.includes("/rbm/unit-indicators")
              ? " active  "
              : " "
          }`}
        >
          <span className="text-truncate menu-item">Unit Indicators</span>
        </Link>

        {(user.position.isSupervisor ||
          (!!user.actingPosition && user.actingPosition.isSupervisor) ||
          user.position.isTechnicalHead ||
          (!!user.actingPosition && user.actingPosition.isTechnicalHead)) && (
          <>
            <ChevronRightIcon className="text-light" />

            <Link
              style={{ textDecoration: "none", color: "#fff" }}
              to="/rbm/evaluate"
              className={`px-1 rounded ${
                location.pathname.includes("/rbm/evaluate") ? "active" : ""
              }`}
            >
              <span className="text-truncate menu-item font-weight-bold">
                Evaluate
              </span>
            </Link>
          </>
        )}

        <ChevronRightIcon className="text-light" />

        <Link
          style={{ textDecoration: "none", color: "#fff" }}
          to="/rbm/my-activities"
          className={`  px-1 rounded  ${
            location.pathname.includes("/rbm/my-activities") ? "active" : " "
          }`}
        >
          <span className="text-truncate  menu-item">My activities</span>
        </Link>

        {!!user.institution &&
          user.institution.id === "1203000001-090000000000000001" && (
            <>
              <ChevronRightIcon className="text-light" />

              <Link
                style={{ textDecoration: "none", color: "#fff" }}
                to="/rbm/rra-evaluation"
                className={`  px-1 rounded  ${
                  location.pathname.includes("/rbm/rra-evaluation")
                    ? "active"
                    : " "
                }`}
              >
                <span className="text-truncate  menu-item">RRA EVALUATION</span>
              </Link>
            </>
          )}
      </div>
    </>
  );
};

const mapStateToProps = ({ user }) => {
  return { user };
};
export default connect(mapStateToProps)(Breadcrumb);
