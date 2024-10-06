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
import { downloadUnitPerformanceReport } from "../../../store/rbm/actions";

const MonitorUnityCard = (props) => {
  const { unit, downloadUnitPerformanceReport, loading, index } = props;

  const [score, setScore] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      setScore(unit.score);
    }, 500);
  }, [unit]);

  return (
    <>
      <Card
        className={`mb-3 pt-2 pb-1  `}
        variant="outlined"
        style={{
          border: !!unit.notAssigned ? "1px solid red" : "1px solid #17a2b8",
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
          action={
            <>
              {unit.unApprovedIndicators > 0 && (
                <Tooltip title="Some indicators are not approved">
                  <span
                    className="material-icons text-danger"
                    style={{ cursor: "default" }}
                  >
                    error
                  </span>
                </Tooltip>
              )}
            </>
          }
          title={
            <span className="text-uppercase">
              {index + 1}: {unit.name}
              {!!unit.notAssigned && (
                <span className="badge badge-warning mr-1 text-danger">
                  Unassigned indicator(s)
                </span>
              )}
            </span>
          }
          subheader={
            <span className="d-block">
              <span className="badge badge-secondary  py-1 mr-1">
                {unit.numOfIndicators} Indicators
              </span>

              <span className="badge badge-secondary  py-1 mr-1">
                {unit.numOfActivities} Activities
              </span>

              <span className="badge badge-secondary  py-1 mr-1">
                {unit.dueActivities} Due activities
              </span>

              <span className="badge badge-primary  py-1 mr-1">
                {unit.reportedActivities} Reported Activities
              </span>

              <span className="badge badge-primary  py-1 mr-1">
                {unit.scoredActivities} Scored activities
              </span>

              <span
                className={`badge   py-1 mr-1  badge-${
                  (unit.achievedTarget * 100) / (unit.annualTarget || 1) < 50
                    ? "danger"
                    : (unit.achievedTarget * 100) / (unit.annualTarget || 1) <
                      70
                    ? "warning"
                    : (unit.achievedTarget * 100) / (unit.annualTarget || 1) <
                      90
                    ? "info"
                    : "success"
                } `}
              >
                {(
                  (unit.achievedTarget * 100) /
                  (unit.annualTarget || 1)
                ).toFixed(2)}
                % Target achieved
              </span>

              <div className="text-center float-right mr-2 mt-3 d-flex justify-content-center ">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm d-flex justify-content-center  align-items-center"
                  disabled={loading}
                  onClick={() => downloadUnitPerformanceReport(unit)}
                >
                  <span className="material-icons">download</span>
                  <span className="material-icons">picture_as_pdf</span>
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
  downloadUnitPerformanceReport,
})(MonitorUnityCard);
