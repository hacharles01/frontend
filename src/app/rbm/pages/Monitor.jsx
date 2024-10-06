import React from "react";
import { Link } from "react-router-dom";
import { Switch, Route, Redirect, useLocation } from "react-router-dom";
import MonitorEmployees from "./MonitorEmployees";
import MonitorUnities from "./MonitorUnities";
import { connect } from "react-redux";

import {
  downloadInstitutionPerformanceReport,
  downloadInstitutionEmployeesPerformanceReport,
} from "../../../store/rbm/actions";

const Monitor = (props) => {
  const location = useLocation();

  const {
    selectedUserEntity,
    loading,
    downloadInstitutionEmployeesPerformanceReport,
  } = props;

  return (
    <>
      <div className="row no-gutter justify-content-center">
        <div className="col-12 col-lg-11 px-0 px-md-3">
          <h6 className="d-flex justify-content-between">
            <span>Monitor progress</span>
          </h6>
          <Link
            to="/rbm/monitor/units"
            type="button"
            className={`btn btn-${
              location.pathname.includes("/rbm/monitor/units")
                ? "dark"
                : "secondary"
            } btn-sm  mr-2`}
          >
            <span className="d-flex  align-items-center">UNITS</span>
          </Link>
          <Link
            to="/rbm/monitor/employees"
            type="button"
            className={`btn btn-${
              location.pathname.includes("/rbm/monitor/employees")
                ? "dark"
                : "secondary"
            } btn-sm  mr-2`}
          >
            <span className="d-flex  align-items-center">EMPLOYEES</span>
          </Link>
          <button
            type="button"
            className="btn btn-secondary btn-sm d-flex justify-content-center mr-2 align-items-center float-right"
            disabled={loading}
            onClick={() =>
              downloadInstitutionEmployeesPerformanceReport(selectedUserEntity)
            }
          >
            <span className="material-icons mr-1">download</span>
            <span>Employees </span>
            <span className="d-none d-md-inline ml-1"> performance report</span>
          </button>
          <Switch>
            <Route path="/rbm/monitor/units" component={MonitorUnities} />
            <Route path="/rbm/monitor/employees" component={MonitorEmployees} />

            <Route
              path="/rbm/monitor"
              component={() => <Redirect to="/rbm/monitor/units" />}
            />
          </Switch>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = ({ loading, selectedUserEntity, user }) => {
  return {
    loading,
    selectedUserEntity,
    user,
  };
};
export default connect(mapStateToProps, {
  downloadInstitutionPerformanceReport,
  downloadInstitutionEmployeesPerformanceReport,
})(Monitor);
