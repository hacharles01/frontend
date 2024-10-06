import {
  Tooltip,
  Card,
  Typography,
  CardHeader,
  CircularProgress,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import React, { useEffect, useState } from "react";

import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DownloadIcon from "@mui/icons-material/Download";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

import { connect } from "react-redux";
import { downloadEmployeePerformanceReport } from "../../../store/rbm/actions";
import SubordinateActivitiesDialog from "./SubordinateActivitiesDialog";

const SubordinateEvaluationCard = (props) => {
  const { employee, downloadEmployeePerformanceReport, loading, index } = props;

  const [score, setScore] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      setScore(employee.score);
    }, 500);
  }, [employee]);

  const [anchorEl, setAnchorEl] = useState(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
                    {`${(score || 0).toFixed(2)}%`}
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
              <span className="d-block ">
                {employee.positionName}{" "}
                <strong className="text-info">
                  @{employee.unitName.toUpperCase()}
                </strong>
              </span>
              <span className=" d-flex justify-content-between">
                <span className="d-flex align-items-center text-dark ">
                  <span className="badge badge-secondary mr-1">
                    {employee.numOfActivities} Activities
                  </span>
                  <i className="fas fa-angle-right mr-1"></i>
                  <span className="badge badge-secondary">
                    {employee.dueActivities}
                  </span>
                  Due
                  {/* <ChevronRightIcon className="text-dark" /> */}
                  {/* <i className="fas fa-angle-right"></i> */}
                  <i className="fas fa-angle-right mx-1"></i>
                  <span className="badge badge-secondary">
                    {employee.reportedActivities}
                  </span>
                  Reported
                  <i className="fas fa-angle-right mx-1"></i>
                  <span className="badge badge-secondary">
                    {employee.scoredActivities}
                  </span>
                  Scored
                  <i className="fas fa-angle-right mx-1"></i>
                  <span
                    className={`badge mr-4  badge-${
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
                    % Target acheived
                  </span>
                  {/* <i className="fas fa-angle-right mx-1"></i> */}
                  <Tooltip title="Download">
                    <span>
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
                        <DownloadIcon style={{ fontSize: "18px" }} />
                        <PictureAsPdfIcon style={{ fontSize: "18px" }} />
                      </button>
                    </span>
                  </Tooltip>
                </span>

                <button
                  type="button"
                  className="btn btn-primary btn-sm d-flex justify-content-center mr-2 align-items-center"
                  disabled={loading}
                  onClick={() => setIsDialogOpen(true)}
                >
                  Evaluate
                </button>
              </span>
            </>
          }
        />
      </Card>

      <SubordinateActivitiesDialog
        employee={employee}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
      />
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
})(SubordinateEvaluationCard);
