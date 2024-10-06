import {
  Tooltip,
  Avatar,
  Card,
  CardHeader,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Divider,
  Chip,
  Badge,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { deleteActivity, selectActivity } from "../../../store/rbm/actions";
import types from "../../../store/rbm/action-types";
import ConfirmationDialog from "./ConfirmationDialog";
import defaultProfile from "../../assets/default-profile.jpg";

import moment from "moment";
import ActivityAssignmentForm from "./ActivityAssignmentForm";
import EvaluationDialog from "./EvaluationDialog";
import { isEmpty } from "lodash";
import EvaluationActivityDialog from "./EvaluationActivityDialog";

const EvaluationActivityCard = (props) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const {
    loading,
    activity,
    index,
    totalQuarterTarget,
    quarter,
    totalWeight,
    selectActivity,
    selectedActivity,
  } = props;
  const open = Boolean(anchorEl);

  const dispatch = useDispatch();
  const location = useLocation();

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const [showEvaluationDialog, setShowEvaluationDialog] = useState(false);

  return (
    <>
      <Card
        className="mb-3 py-3 "
        variant="outlined"
        style={{ backgroundColor: "#eef1f3" }}
      >
        <CardHeader
          className="py-0"
          avatar={
            <Tooltip title="Score">
              <span
                style={{ fontSize: "12px", cursor: "default" }}
                className={`font-weight-bold  text-${
                  activity.score -
                    ((activity.employeeTimePenalities || 0) +
                      (activity.employeeQualityPenalities || 0)) <
                  50
                    ? "danger"
                    : activity.score -
                        ((activity.employeeTimePenalities || 0) +
                          (activity.employeeQualityPenalities || 0)) <
                      70
                    ? "warning"
                    : activity.score -
                        ((activity.employeeTimePenalities || 0) +
                          (activity.employeeQualityPenalities || 0)) <
                      100
                    ? "info"
                    : "success"
                }`}
              >
                {(
                  activity.score -
                  ((activity.employeeTimePenalities || 0) +
                    (activity.employeeQualityPenalities || 0))
                ).toFixed(2)}{" "}
                %
              </span>
            </Tooltip>
          }
          action={
            <>
              <Box>
                <IconButton
                  size="small"
                  className="ml-2"
                  onClick={handleOpenMenu}
                  aria-label="settings"
                >
                  <Badge
                    color="error"
                    variant="dot"
                    invisible={activity.status !== "Reported"}
                  >
                    <span className="material-icons">more_vert</span>
                  </Badge>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  id="account-menu"
                  open={open}
                  onClose={handleCloseMenu}
                  PaperProps={{
                    elevation: 0,
                    sx: {
                      overflow: "visible",
                      filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                      mt: 1.5,
                      "& .MuiAvatar-root": {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                      },
                      "&:before": {
                        content: '""',
                        display: "block",
                        position: "absolute",
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: "background.paper",
                        transform: "translateY(-50%) rotate(45deg)",
                        zIndex: 0,
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                  <MenuItem disabled>MENUS</MenuItem>
                  <Divider className="my-1" />

                  <MenuItem
                    disabled={!activity.hasSubmission || loading}
                    onClick={() => {
                      selectActivity(
                        activity,
                        handleCloseMenu,
                        setShowEvaluationDialog
                      );
                    }}
                    className="text-dark font-weight-light"
                  >
                    <Badge
                      color="error"
                      variant="dot"
                      invisible={activity.status !== "Reported"}
                    >
                      <span className="material-icons mr-2">file_present</span>{" "}
                      {loading
                        ? "Loading..."
                        : !activity.hasSubmission
                        ? "No report"
                        : "Go to reports"}
                    </Badge>
                  </MenuItem>

                  <Divider className="my-1" />
                </Menu>
              </Box>
            </>
          }
          title={
            <>
              <span className="text-uppercase">
                {index + 1}: {activity.name}
              </span>
            </>
          }
          subheader={
            <span>
              <span className="d-flex align-items-center justify-content-between flex-wrap">
                <span className="d-flex flex-wrap">
                  <Tooltip title="Activity weight">
                    <span
                      className="  align-items-center px-1 text-info"
                      style={{
                        cursor: "default",
                      }}
                    >
                      <i className="fas fa-weight-hanging mr-1"></i>
                      {activity.weight} %
                    </span>
                  </Tooltip>
                  <Tooltip title="Activity target share">
                    <span
                      className="  align-items-center px-1 mr-2 text-info"
                      style={{
                        cursor: "default",
                      }}
                    >
                      Target share: {activity.targetShare}
                      {(activity.achievedTarget > 0 ||
                        activity.targetShare > 0) && (
                        <span>
                          {" "}
                          |{" "}
                          <span
                            className={`badge badge-${
                              activity.achievedTarget ===
                                activity.targetShare && activity.targetShare > 0
                                ? "success"
                                : activity.achievedTarget > activity.targetShare
                                ? "success"
                                : "secondary"
                            }`}
                          >
                            {activity.achievedTarget} Achieved{" "}
                          </span>
                        </span>
                      )}
                    </span>
                  </Tooltip>
                </span>

                <span className="d-flex flex-wrap">
                  <span className="text-info ">
                    Deadline: {moment(activity.endOn).format("ll")}
                  </span>

                  <Badge
                    overlap="rectangular"
                    color="error"
                    badgeContent={
                      -(
                        (activity.employeeTimePenalities || 0) +
                        (activity.employeeQualityPenalities || 0)
                      )
                    }
                  >
                    <span>
                      {activity.status === "Pending" && (
                        <span
                          className={`d-flex align-items-center badge badge-${
                            activity.isExtraDays ? "warning" : "dark"
                          } mx-3`}
                        >
                          <span
                            style={{ fontSize: "17px" }}
                            className="material-icons "
                          >
                            pending_actions
                          </span>
                          <span style={{ fontSize: "10px" }}> Pending...</span>
                        </span>
                      )}
                      {activity.status === "Scored" && (
                        <span
                          className={`d-flex align-items-center badge badge-success mx-3 `}
                        >
                          <span
                            style={{ fontSize: "17px" }}
                            className="material-icons "
                          >
                            done_all
                          </span>
                          <span style={{ fontSize: "10px" }}> Scored</span>
                        </span>
                      )}
                      {activity.status === "Reported" && (
                        <span
                          className={`d-flex align-items-center badge badge-${
                            activity.isExtraDays ? "warning" : "primary"
                          } mx-3`}
                        >
                          <span
                            style={{ fontSize: "17px" }}
                            className="material-icons "
                          >
                            file_present
                          </span>
                          <span style={{ fontSize: "10px" }}> Reported</span>
                        </span>
                      )}

                      {activity.status === "Rejected" && (
                        <span className="d-flex align-items-center badge badge-danger mx-3">
                          <span
                            style={{ fontSize: "17px" }}
                            className="material-icons   "
                          >
                            close
                          </span>
                          <span style={{ fontSize: "10px" }}> Rejected</span>
                        </span>
                      )}
                      {activity.status === "Overdue" && (
                        <span className="d-flex align-items-center badge badge-danger mx-3">
                          <span
                            style={{ fontSize: "17px" }}
                            className="material-icons"
                          >
                            error
                          </span>
                          <span style={{ fontSize: "10px" }}> Overdue</span>
                        </span>
                      )}
                    </span>
                  </Badge>
                </span>
              </span>
              <span className="d-flex align-items-center flex-wrap">
                {activity.assignments.map((assignment) => (
                  <Tooltip
                    key={assignment.id}
                    title={`${assignment.firstName} ${assignment.lastName}`}
                  >
                    <Chip
                      size="small"
                      // color="info"
                      className="border border-light mr-1"
                      avatar={
                        <Avatar
                          style={{ border: "1px solid #d1cbcb" }}
                          alt={assignment.firstName}
                          src={
                            assignment.profileImage
                              ? `data:image/jpeg;base64,${assignment.profileImage}`
                              : defaultProfile
                          }
                        />
                      }
                      label={assignment.firstName}
                      variant="outlined"
                    />
                  </Tooltip>
                ))}
              </span>
            </span>
          }
        />
      </Card>

      {!isEmpty(selectedActivity) && (
        <EvaluationActivityDialog
          open={showEvaluationDialog}
          setOpen={setShowEvaluationDialog}
          loading={loading}
          activity={activity}
        />
      )}
    </>
  );
};

const mapStateToProps = ({
  expectedResults,
  user,
  selectedIndicator,
  selectedActivity,
  loading,
}) => {
  return {
    expectedResults,
    user,
    selectedIndicator,
    selectedActivity,
    loading,
  };
};
export default connect(mapStateToProps, { deleteActivity, selectActivity })(
  EvaluationActivityCard
);
