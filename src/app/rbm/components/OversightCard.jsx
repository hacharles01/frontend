import {
  Tooltip,
  Card,
  Typography,
  CardHeader,
  CircularProgress,
  Box,
} from "@mui/material";
import React, { useEffect, useState } from "react";

import { connect } from "react-redux";
import {
  downloadInstitutionPerformanceReport,
  downloadInstitutionEmployeesPerformanceReport,
} from "../../../store/rbm/actions";

const OversightCard = (props) => {
  const {
    institution,
    downloadInstitutionPerformanceReport,
    downloadInstitutionEmployeesPerformanceReport,
    loading,
    index,
  } = props;

  const [score, setScore] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      setScore(institution.score);
    }, 500);
  }, [institution]);

  return (
    <>
      <Card
        className={`mb-3 pt-2 pb-1  `}
        variant="outlined"
        style={{
          border: !!institution.notAssigned
            ? "1px solid red"
            : "1px solid #17a2b8",
        }}
      >
        <CardHeader
          avatar={
            <Tooltip title="Progress">
              <Box
                sx={{
                  position: "relative",
                  display: "inline-flex",
                  cursor: "default",
                }}
              >
                <CircularProgress
                  className={`text-${
                    score < 50
                      ? "danger"
                      : score < 70
                      ? "warning"
                      : score < 100
                      ? "info"
                      : "success"
                  }`}
                  variant="determinate"
                  value={score}
                />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: "absolute",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    variant="caption"
                    component="div"
                    style={{ fontSize: "7px" }}
                    color="text.secondary"
                    className={`text-${
                      score < 50
                        ? "danger"
                        : score < 70
                        ? "warning"
                        : score < 100
                        ? "info"
                        : "success"
                    }`}
                  >
                    {`${score.toFixed(2)}%`}
                  </Typography>
                </Box>
              </Box>
            </Tooltip>
          }
          title={
            <span className="text-uppercase d-flex align-items-center flex-wrap">
              {index + 1}: {institution.name}
              {!!institution.notAssigned && (
                <span className="badge badge-warning ml-1 text-danger">
                  Unassigned indicator(s)
                </span>
              )}
              {institution.unApprovedIndicators > 0 && (
                <Tooltip title="Some indicators are not approved">
                  <span
                    className="material-icons text-danger ml-1"
                    style={{ cursor: "default" }}
                  >
                    error
                  </span>
                </Tooltip>
              )}
            </span>
          }
          subheader={
            <span className="">
              <Tooltip title="Weight">
                <span
                  style={{ cursor: "pointer" }}
                  className={`badge badge-${
                    institution.weight === 100 ? "success" : "danger"
                  } ml-1 py-1`}
                >
                  <i className="fas fa-weight-hanging mr-1"></i>{" "}
                  {institution.weight.toFixed(2)} %
                </span>
              </Tooltip>

              <span className="badge badge-secondary  py-1 ml-1">
                {institution.numOf} Outputs
              </span>

              <span className="badge badge-secondary  py-1 ml-1">
                {institution.numOfIndicators} Indicators
              </span>

              <span className="badge badge-secondary  py-1 ml-1">
                {institution.numOfActivities} Activities
              </span>

              <span className="badge badge-secondary  py-1 ml-1">
                {institution.dueActivities} Due activities
              </span>

              <span className="badge badge-primary  py-1 ml-1">
                {institution.reportedActivities} Reported activities
              </span>

              <span className="badge badge-primary  py-1 ml-1">
                {institution.scoredActivities} Scored activities
              </span>

              <span
                className={`badge   py-1 ml-1  badge-${
                  (institution.achievedTarget * 100) /
                    (institution.annualTarget || 1) <
                  50
                    ? "danger"
                    : (institution.achievedTarget * 100) /
                        (institution.annualTarget || 1) <
                      70
                    ? "warning"
                    : (institution.achievedTarget * 100) /
                        (institution.annualTarget || 1) <
                      90
                    ? "info"
                    : "success"
                } `}
              >
                {(
                  (institution.achievedTarget * 100) /
                  (institution.annualTarget || 1)
                ).toFixed(2)}
                % Target achieved
              </span>

              <div className="text-center float-right d-flex justify-content-center ">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm mt-2    mr-3 p-1"
                  disabled={loading}
                  onClick={() =>
                    downloadInstitutionPerformanceReport(institution)
                  }
                >
                  <i className="fas fa-download mr-1"></i> Institution
                </button>

                <button
                  type="button"
                  className="btn btn-secondary btn-sm mt-2   mr-3 p-1"
                  disabled={loading}
                  onClick={() =>
                    downloadInstitutionEmployeesPerformanceReport(institution)
                  }
                >
                  <i className="fas fa-download mr-1"></i>
                  Employees
                </button>
              </div>
            </span>
          }
        />
      </Card>
    </>
  );
};

const mapStateToProps = ({ loading, user }) => {
  return {
    loading,
    user,
  };
};

export default connect(mapStateToProps, {
  downloadInstitutionPerformanceReport,
  downloadInstitutionEmployeesPerformanceReport,
})(OversightCard);
