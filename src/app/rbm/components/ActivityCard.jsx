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

const ActivityCard = (props) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const {
    activity,
    index,
    setShowActivityForm,
    setIsEditing,
    deleteActivity,
    totalQuarterTarget,
    quarter,
    totalWeight,
    user,
    selectedIndicator,
    selectActivity,
    selectedActivity,
  } = props;
  const open = Boolean(anchorEl);

  const dispatch = useDispatch();
  const location = useLocation();

  //const location = window.location;

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);
  const [showEvaluationDialog, setShowEvaluationDialog] = useState(false);

  const isChild = () => {
    return (
      location.pathname === "/rbm/my-activities" &&
      (user.position.isSupervisor ||
        user.position.isTechnicalHead ||
        (!!user.actingPosition &&
          (user.actingPosition.isSupervisor ||
            user.actingPosition.isTechnicalHead))) &&
      user.unit.id !== activity.unitId &&
      (!user.actingUnit ||
        (!!user.actingUnit && user.actingUnit.id !== activity.unitId))
    );
  };

  return (
    <>
      <Card
        className="mb-3 py-3 "
        variant="outlined"
        style={{ backgroundColor: isChild() ? "#ffffff" : "#eef1f3" }}
      >
        <CardHeader
          className="py-0"
          avatar={
            <Tooltip title="Score">
              <span
                style={{ fontSize: "12px", cursor: "default" }}
                className={`font-weight-bold  text-${
                  activity.score -
                    (!!user&&user.position&&user.position.isSupervisor?activity.unitId!==user.unit.id?0:activity.supervisorTimePenalities:(activity.employeeTimePenalities || 0) +
                      (activity.employeeQualityPenalities || 0)) <
                  50
                    ? "danger"
                    : activity.score -
                        (!!user&&user.position&&user.position.isSupervisor?activity.unitId!==user.unit.id?0:activity.supervisorTimePenalities:(activity.employeeTimePenalities || 0) +
                          (activity.employeeQualityPenalities || 0)) <
                      70
                    ? "warning"
                    : activity.score -
                        (!!user&&user.position&&user.position.isSupervisor?activity.unitId!==user.unit.id?0:activity.supervisorTimePenalities:(activity.employeeTimePenalities || 0) +
                          (activity.employeeQualityPenalities || 0)) <
                      100
                    ? "info"
                    : "success"
                }`}
              >
                {(!!activity.scorePublished ||
                  user.position.isTechnicalHead ||
                  (!!user.actingPosition &&
                    user.actingPosition.isTechnicalHead)) && (
                  <>
                    {(
                      activity.score -
                      (
                        !!user&&user.position&&user.position.isSupervisor?activity.unitId!==user.unit.id?0:activity.supervisorTimePenalities:
                        (activity.employeeTimePenalities || 0) +
                        (activity.employeeQualityPenalities || 0))
                    ).toFixed(2)}{" "}
                    %
                  </>
                )}
              </span>
            </Tooltip>
          }
          action={
            <>
              {(user.position.isPlanner ||
                user.position.isTechnicalHead ||
                (!!user.actingPosition &&
                  user.actingPosition.isTechnicalHead) ||
                ((user.position.isSupervisor ||
                  (!!user.actingPosition &&
                    user.actingPosition.isSupervisor)) &&
                  (location.pathname === "/rbm/unit-indicators/activities" ||
                    location.pathname === "/rbm/my-activities")) ||
                (user.position.isEmployee &&
                  location.pathname === "/rbm/my-activities")) && (
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
                      invisible={
                        activity.status !== "Reported" ||
                        user.position.isEmployee ||
                        location.pathname !==
                          "/rbm/unit-indicators/activities" ||
                        isEmpty(selectedIndicator) ||
                        (!!selectedIndicator.unitId &&
                          selectedIndicator.unitId !== user.unit.id &&
                          (!user.actingUnit ||
                            (!!user.actingUnit &&
                              selectedIndicator.unitId !== user.actingUnit.id)))
                      }
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
                      onClick={() => {
                        handleCloseMenu();
                        dispatch({
                          type: types.SET_SELECTED_ACTIVITY,
                          data: activity,
                        });
                        setShowAssignmentForm(true);
                      }}
                      className="text-dark font-weight-light"
                    >
                      <span className="material-icons mr-2">people</span> Assign
                      activity
                    </MenuItem>
                    <Divider className="my-0" />

                    <MenuItem
                      disabled={
                        !activity.hasSubmission &&
                        location.pathname !== "/rbm/my-activities"
                      }
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
                        invisible={
                          activity.status !== "Reported" ||
                          user.position.isEmployee ||
                          location.pathname !==
                            "/rbm/unit-indicators/activities" ||
                          isEmpty(selectedIndicator) ||
                          (!!selectedIndicator.unitId &&
                            selectedIndicator.unitId !== user.unit.id &&
                            (!user.actingUnit ||
                              (!!user.actingUnit &&
                                selectedIndicator.unitId !==
                                  user.actingUnit.id)))
                        }
                      >
                        <span className="material-icons mr-2">
                          file_present
                        </span>{" "}
                        Go to reports
                      </Badge>
                    </MenuItem>

                    <Divider className="my-1" />

                    {(((user.position.isSupervisor ||
                      (!!user.actingPosition &&
                        user.actingPosition.isSupervisor)) &&
                      location.pathname === "/rbm/unit-indicators/activities" &&
                      (isEmpty(selectedIndicator) ||
                        (!!selectedIndicator.unitId &&
                          selectedIndicator.unitId === user.unit.id) ||
                        (!!user.actingUnit &&
                          selectedIndicator.unitId === user.actingUnit.id))) ||
                      user.position.isPlanner) && (
                      <span>
                        <MenuItem
                          onClick={() => {
                            handleCloseMenu();
                            dispatch({
                              type: types.SET_SELECTED_ACTIVITY,
                              data: activity,
                            });
                            setIsEditing(true);
                            setShowActivityForm(true);
                          }}
                          className="text-dark font-weight-light"
                        >
                          <span className="material-icons mr-2">edit</span> Edit
                        </MenuItem>
                        <Divider className="my-1" />
                      </span>
                    )}

                    {(((user.position.isSupervisor ||
                      (!!user.actingPosition &&
                        user.actingPosition.isSupervisor)) &&
                      location.pathname === "/rbm/unit-indicators/activities" &&
                      (isEmpty(selectedIndicator) ||
                        (!!selectedIndicator.unitId &&
                          selectedIndicator.unitId === user.unit.id) ||
                        (!!user.actingUnit &&
                          selectedIndicator.unitId === user.actingUnit.id))) ||
                      user.position.isPlanner) && (
                      <MenuItem
                        onClick={() => {
                          handleCloseMenu();
                          setConfirmDelete(true);
                        }}
                        className="text-danger font-weight-light"
                      >
                        <span className="material-icons mr-2">delete</span>{" "}
                        Delete
                      </MenuItem>
                    )}
                  </Menu>
                </Box>
              )}
            </>
          }
          title={
            <>
              <span className="text-uppercase">
                {index + 1}: {activity.name}{" "}
                {!!activity.assignments &&
                  !!!activity.assignments[0] &&
                  !isChild() && (
                    <span className="badge badge-warning ml-1 text-danger">
                      Unassigned
                    </span>
                  )}
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

                <span className="d-flex flex-wrap ">
                  <span className="text-info ">
                    Deadline:{" "}
                    {moment(
                      location.pathname === "/rbm/my-activities"
                        ? activity.endOn
                        : activity.supervisorEndOn
                    ).format("ll")}
                  </span>

                  <Badge
                    overlap="rectangular"
                    color="error"
                    badgeContent={
                      -(
                      !!user&&user.position&&user.position.isSupervisor?activity.unitId!==user.unit.id?0:activity.supervisorTimePenalities:
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
                {(user.position.isPlanner ||
                  user.position.isTechnicalHead ||
                  (!!user.actingPosition &&
                    user.actingPosition.isTechnicalHead) ||
                  ((user.position.isSupervisor ||
                    (!!user.actingPosition &&
                      user.actingPosition.isSupervisor)) &&
                    (location.pathname === "/rbm/unit-indicators/activities" ||
                      location.pathname === "/rbm/my-activities")) ||
                  (user.position.isEmployee &&
                    location.pathname === "/rbm/my-activities")) &&
                  !!activity.assignments &&
                  activity.assignments.map((assignment) => (
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
              {isChild() && (
                <span
                  className="px-1 mt-2 text-uppercase font-weight-thin text-dark "
                  style={{
                    border: "1px solid rgba(0, 0, 0, 0.12)",
                    cursor: "default",
                    fontSize: "12px",
                  }}
                >
                  <span>{activity.unitName}</span>
                </span>
              )}
            </span>
          }
        />
      </Card>

      <ConfirmationDialog
        confirmationDialog={confirmDelete}
        message="Are you sure you want to delete Activity?"
        setConfirmationDialog={setConfirmDelete}
        onYes={() => {
          deleteActivity(activity, setConfirmDelete);
        }}
      />

      <ActivityAssignmentForm
        totalWeight={totalWeight}
        totalQuarterTarget={totalQuarterTarget}
        quarter={quarter}
        selectedActivity={activity}
        assignments={activity.assignments || []}
        showAssignmentForm={showAssignmentForm}
        setShowAssignmentForm={setShowAssignmentForm}
      />
      {!isEmpty(selectedActivity) && (
        <EvaluationDialog
          isChild={
            !(
              isEmpty(selectedIndicator) ||
              (!!selectedIndicator.unitId &&
                selectedIndicator.unitId === user.unit.id) ||
              (!!user.actingUnit &&
                selectedIndicator.unitId === user.actingUnit.id)
            ) || isChild()
          }
          open={showEvaluationDialog}
          setOpen={setShowEvaluationDialog}
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
}) => {
  return { expectedResults, user, selectedIndicator, selectedActivity };
};
export default connect(mapStateToProps, { deleteActivity, selectActivity })(
  ActivityCard
);
