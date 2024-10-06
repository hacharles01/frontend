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
import { downloadEmployeePerformanceReport } from "../../../store/rbm/actions";

const MonitorEmployeeCard = (props) => {
  const { employee, downloadEmployeePerformanceReport, loading, index } = props;

  const [score, setScore] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      setScore(employee.score);
    }, 500);
  }, [employee]);

  return (
    <>
      <Card
        className={`mb-3 pt-2 pb-1  `}
        variant="outlined"
        style={{
          border: !!employee.notAssigned
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
            <span className="text-uppercase">
              {index + 1}: {employee.lastName} {employee.firstName}
            </span>
          }
          subheader={
            <>
              <span className="d-block">
                {employee.positionName}{" "}
                <strong className="text-dark ">
                  @{employee.unitName.toUpperCase()}
                </strong>
              </span>
              <span className="">
                <span className="badge badge-secondary mr-1 py-1">
                  {employee.numOfActivities} Activities
                </span>

                <span className="badge badge-secondary  py-1 mr-1">
                  {employee.dueActivities} Due activities
                </span>

                <span className="badge badge-secondary  py-1 mr-1">
                  {employee.reportedActivities} Reported activities
                </span>

                <span className="badge badge-secondary  py-1 mr-1">
                  {employee.scoredActivities} Scored activities
                </span>

                <span
                  className={`badge   py-1 mr-1  badge-${
                    (employee.achievedTarget * 100) /
                      (employee.targetShare || 1) <
                    50
                      ? "danger"
                      : (employee.achievedTarget * 100) /
                          (employee.targetShare || 1) <
                        70
                      ? "warning"
                      : (employee.achievedTarget * 100) /
                          (employee.targetShare || 1) <
                        90
                      ? "info"
                      : "success"
                  } `}
                >
                  {(
                    (employee.achievedTarget * 100) /
                    (employee.targetShare || 1)
                  ).toFixed(2)}
                  % Target achieved
                </span>

                <div className="text-center float-right mt-3 d-flex justify-content-center ">
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm d-flex justify-content-center  align-items-center"
                    disabled={loading}
                    onClick={() =>
                      downloadEmployeePerformanceReport({
                        ...employee,
                        employeeId: employee.id,
                      })
                    }
                  >
                    <span className="material-icons">download</span>
                    <span className="material-icons">picture_as_pdf</span>
                  </button>
                </div>
              </span>
            </>
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
  downloadEmployeePerformanceReport,
})(MonitorEmployeeCard);
