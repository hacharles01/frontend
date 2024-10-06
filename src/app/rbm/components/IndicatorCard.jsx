import {
  Tooltip,
  Card,
  Typography,
  CardHeader,
  IconButton,
  CircularProgress,
  Box,
  Menu,
  MenuItem,
  Divider,
  Badge,
} from "@mui/material";
import { Link, useHistory, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { deleteIndicator, approveIndicator } from "../../../store/rbm/actions";
import types from "../../../store/rbm/action-types";
import ConfirmationDialog from "./ConfirmationDialog";
import IndicatorAssignmentForm from "./IndicatorAssignmentForm";

const IndicatorCard = (props) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const {
    indicator,
    index,
    setIsEditing,
    setShowIndicatorForm,
    deleteIndicator,
    approveIndicator,
    user,
    isChildIndicator,
  } = props;

  const dispatch = useDispatch();
  const location = useLocation();

  const open = Boolean(anchorEl);

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmApproval, setConfirmApproval] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState(true);
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);
  const history = useHistory();

  const [score, setScore] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      setScore(indicator.score);
    }, 500);
  }, [indicator]);

  return (
    <>
      <Card
        className={`mb-3  ${
          isChildIndicator ? "" : "indicator-card border border-info"
        } `}
        variant="outlined"
        style={{
          backgroundColor: isChildIndicator ? "#f6f8fa" : "#fff",
          borderTop: isChildIndicator ? "none" : "",
          borderLeft: isChildIndicator ? "none" : "",
          borderRight: isChildIndicator ? "none" : "",
        }}
      >
        <CardHeader
          className="pb-0 pt-2"
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
            <Box className="d-flex align-items-center">
              <span className="d-none d-md-inline">
                {indicator.isApproved && (
                  <span className="d-flex align-items-center">
                    <span
                      style={{ color: "#00c81b" }}
                      className="material-icons mr-1  "
                    >
                      done_all
                    </span>
                    <span style={{ color: "#00c81b" }} className=" mr-3 ">
                      Approved
                    </span>
                  </span>
                )}
                {!indicator.isApproved &&
                  (user.position.isTechnicalHead ||
                    (!!user.actingPosition &&
                      user.actingPosition.isTechnicalHead)) && (
                    <button
                      onClick={() => {
                        setApprovalStatus(true);
                        setConfirmApproval(true);
                      }}
                      type="button"
                      className="btn btn-success text-uppercase btn-sm mr-3"
                    >
                      Approve
                    </button>
                  )}

                {!indicator.isApproved &&
                  !(
                    user.position.isTechnicalHead ||
                    (!!user.actingPosition &&
                      user.actingPosition.isTechnicalHead)
                  ) && (
                    <span className="d-flex align-items-center">
                      <span style={{ color: "red" }} className=" mr-3 ">
                        Not approved
                      </span>
                    </span>
                  )}
              </span>
              {(user.position.isPlanner ||
                (!!user.actingPosition && !!user.actingPosition.isPlanner) ||
                user.position.isTechnicalHead ||
                (!!user.actingPosition &&
                  user.actingPosition.isTechnicalHead)) && (
                <span>
                  <IconButton
                    size="small"
                    className="ml-2"
                    onClick={handleOpenMenu}
                    aria-label="settings"
                  >
                    <span className="material-icons">more_vert</span>
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
                    <Divider className="my-0" />
                    <MenuItem
                      onClick={() => {
                        handleCloseMenu();

                        dispatch({
                          type: types.SET_SELECTED_INDICATOR,
                          data: indicator,
                        });

                        if (location.pathname === "/rbm/unit-indicators")
                          history.push("/rbm/unit-indicators/activities");
                        else
                          history.push(
                            "/rbm/expected-results/indicators/activities"
                          );
                      }}
                      className="text-dark font-weight-light"
                    >
                      <span className="material-icons mr-2">launch</span> Go To
                      Activities
                    </MenuItem>
                    <Divider className="my-1" />

                    <MenuItem
                      onClick={() => {
                        handleCloseMenu();
                        dispatch({
                          type: types.SET_SELECTED_INDICATOR,
                          data: indicator,
                        });
                        setShowAssignmentForm(true);
                      }}
                      className="text-dark font-weight-light"
                    >
                      <span className="material-icons mr-2">share</span> Assign
                      indicator
                    </MenuItem>
                    <Divider className="my-1" />
                    {(user.position.isPlanner ||
                      (!!user.actingPosition &&
                        !!user.actingPosition.isPlanner) ||
                      user.position.isTechnicalHead ||
                      (!!user.actingPosition &&
                        user.actingPosition.isTechnicalHead)) && (
                      <span>
                        <MenuItem
                          onClick={() => {
                            handleCloseMenu();
                            dispatch({
                              type: types.SET_SELECTED_INDICATOR,
                              data: indicator,
                            });
                            setIsEditing(true);
                            setShowIndicatorForm(true);
                          }}
                          className="text-dark font-weight-light"
                        >
                          <span className="material-icons mr-2">edit</span> Edit
                        </MenuItem>
                        <Divider className="my-1" />
                      </span>
                    )}

                    {((indicator.isApproved && user.position.isTechnicalHead) ||
                      (!!user.actingPosition &&
                        user.actingPosition.isTechnicalHead)) && (
                      <span>
                        <MenuItem
                          onClick={() => {
                            setApprovalStatus(false);
                            handleCloseMenu();
                            setConfirmApproval(true);
                          }}
                          className="text-danger font-weight-light"
                        >
                          <span className="material-icons mr-2">close</span>{" "}
                          Disapprove
                        </MenuItem>
                        <Divider className="my-1" />
                      </span>
                    )}

                    {(user.position.isPlanner ||
                      (!!user.actingPosition &&
                        !!user.actingPosition.isPlanner) ||
                      user.position.isTechnicalHead ||
                      (!!user.actingPosition &&
                        user.actingPosition.isTechnicalHead)) && (
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
                </span>
              )}
            </Box>
          }
          title={
            <span className=" text-uppercase">
              {index + 1}: {indicator.name}
              {!!!indicator.unitId && (
                <span className="badge badge-warning ml-1 text-danger">
                  Unassigned
                </span>
              )}
            </span>
          }
          subheader={
            <span className="d-flex align-items-center flex-wrap">
              <Tooltip title="Indicator weight">
                <span
                  className="  align-items-center px-1 text-info "
                  style={{
                    border: "1px solid rgba(0, 0, 0, 0.12)",
                    cursor: "default",
                  }}
                >
                  <i className="fas fa-weight-hanging mr-1"></i>
                  {indicator.weight} %
                </span>
              </Tooltip>

              <span className="d-flex align-items-center flex-wrap">
                <Tooltip title="Measurement Unit">
                  <span
                    className=" d-flex align-items-center px-1 text-info"
                    style={{
                      border: "1px solid rgba(0, 0, 0, 0.12)",
                      cursor: "default",
                    }}
                  >
                    <strong>Unit:</strong>
                    {indicator.measurementUnit}
                  </span>
                </Tooltip>

                <Tooltip title="Baseline">
                  <span
                    className="d-flex align-items-center px-1 text-info "
                    style={{
                      border: "1px solid rgba(0, 0, 0, 0.12)",
                      cursor: "default",
                    }}
                  >
                    <strong>Baseline:</strong> {indicator.baseline}
                  </span>
                </Tooltip>

                <Tooltip title="Annual Target">
                  <span
                    className=" d-flex align-items-center px-1 text-info mr-2 "
                    style={{
                      border: "1px solid rgba(0, 0, 0, 0.12)",
                      cursor: "default",
                    }}
                  >
                    <strong>Target:</strong> {indicator.annualTarget}{" "}
                    {indicator.measurementUnit
                      .toLowerCase()
                      .charAt(0)
                      .toUpperCase() +
                      indicator.measurementUnit.slice(1).toLowerCase()}
                  </span>
                </Tooltip>

                {!!indicator.unitName && (
                  <span
                    className="px-1 font-weight-bold text-dark text-uppercase"
                    style={{
                      border: "1px solid rgba(0, 0, 0, 0.12)",
                      cursor: "default",
                    }}
                  >
                    <span>@{indicator.unitName}</span>
                  </span>
                )}
              </span>
            </span>
          }
        />
        <CardHeader
          className="ml-5 pt-2 py-2 pl-4"
          subheader={
            <span className="d-flex align-items-center  flex-wrap justify-content-between ">
              <span className="d-flex align-items-center  flex-wrap">
                <Tooltip title="Quarter-1 Target">
                  <span
                    className={`d-flex align-items-center  px-2 ${
                      indicator.quarter1Target > 0 ? "text-light" : "bg-light"
                    }`}
                    style={{
                      border: "1px solid rgba(0, 0, 0, 0.12)",
                      cursor: "default",

                      backgroundColor:
                        indicator.quarter1Target > 0 ? "#078ece" : "",
                    }}
                  >
                    Q<sub>1</sub>: {indicator.quarter1Target}{" "}
                    {indicator.quarter1Target > 0 && (
                      <>
                        {indicator.measurementUnit
                          .toLowerCase()
                          .charAt(0)
                          .toUpperCase() +
                          indicator.measurementUnit.slice(1).toLowerCase()}
                      </>
                    )}
                  </span>
                </Tooltip>
                <Tooltip title="Quarter-2 Target">
                  <span
                    className={`d-flex align-items-center  px-2 ${
                      indicator.quarter2Target > 0 ? " text-light" : "bg-light"
                    }`}
                    style={{
                      border: "1px solid rgba(0, 0, 0, 0.12)",
                      cursor: "default",
                      backgroundColor:
                        indicator.quarter2Target > 0 ? "#078ece" : "",
                    }}
                  >
                    Q<sub>2</sub>: {indicator.quarter2Target}{" "}
                    {indicator.quarter2Target > 0 && (
                      <>
                        {indicator.measurementUnit
                          .toLowerCase()
                          .charAt(0)
                          .toUpperCase() +
                          indicator.measurementUnit.slice(1).toLowerCase()}
                      </>
                    )}
                  </span>
                </Tooltip>
                <Tooltip title="Quarter-3 Target">
                  <span
                    className={`d-flex align-items-center  px-2 ${
                      indicator.quarter3Target > 0 ? " text-light" : "bg-light"
                    }`}
                    style={{
                      border: "1px solid rgba(0, 0, 0, 0.12)",
                      cursor: "default",
                      backgroundColor:
                        indicator.quarter3Target > 0 ? "#078ece" : "",
                    }}
                  >
                    Q<sub>3</sub>: {indicator.quarter3Target}{" "}
                    {indicator.quarter3Target > 0 && (
                      <>
                        {indicator.measurementUnit
                          .toLowerCase()
                          .charAt(0)
                          .toUpperCase() +
                          indicator.measurementUnit.slice(1).toLowerCase()}
                      </>
                    )}
                  </span>
                </Tooltip>
                <Tooltip title="Quarter-4 Target">
                  <span
                    className={`d-flex align-items-center  px-2 ${
                      indicator.quarter4Target > 0 ? " text-light" : "bg-light"
                    }`}
                    style={{
                      border: "1px solid rgba(0, 0, 0, 0.12)",
                      cursor: "default",
                      backgroundColor:
                        indicator.quarter4Target > 0 ? "#078ece" : "",
                    }}
                  >
                    Q<sub>4</sub>: {indicator.quarter4Target}{" "}
                    {indicator.quarter4Target > 0 && (
                      <>
                        {indicator.measurementUnit
                          .toLowerCase()
                          .charAt(0)
                          .toUpperCase() +
                          indicator.measurementUnit.slice(1).toLowerCase()}
                      </>
                    )}
                  </span>
                </Tooltip>
              </span>

              <span
                className={`d-flex align-items-center flex-wrap ${
                  user.position.isPlanner ||
                  (!!user.actingPosition && !!user.actingPosition.isPlanner) ||
                  user.position.isTechnicalHead ||
                  (!!user.actingPosition &&
                    !!user.actingPosition.isTechnicalHead)
                    ? "mr-4"
                    : ""
                } `}
              >
                <span className="d-inline d-md-none mt-2">
                  {indicator.isApproved && (
                    <span className="d-flex align-items-center">
                      <span
                        style={{ color: "#00c81b" }}
                        className="material-icons mr-1  "
                      >
                        done_all
                      </span>
                      <span style={{ color: "#00c81b" }} className=" mr-3 ">
                        Approved
                      </span>
                    </span>
                  )}
                  {!indicator.isApproved && user.position.isTechnicalHead && (
                    <button
                      onClick={() => {
                        setApprovalStatus(true);
                        setConfirmApproval(true);
                      }}
                      type="button"
                      className="btn btn-success text-uppercase btn-sm mr-3"
                    >
                      Approve
                    </button>
                  )}

                  {!indicator.isApproved &&
                    !(
                      user.position.isTechnicalHead ||
                      (!!user.actingPosition &&
                        !!user.actingPosition.isTechnicalHead)
                    ) && (
                      <span className="d-flex align-items-center">
                        <span style={{ color: "red" }} className=" mr-3 ">
                          Not approved
                        </span>
                      </span>
                    )}
                </span>

                <Tooltip
                  title="Go To Activities"
                  className={`${
                    user.position.isPlanner ||
                    (!!user.actingPosition &&
                      !!user.actingPosition.isPlanner) ||
                    user.position.isTechnicalHead ||
                    (!!user.actingPosition &&
                      !!user.actingPosition.isTechnicalHead)
                      ? "mr-3"
                      : ""
                  }`}
                >
                  <Link
                    to="#"
                    className=" mt-2   "
                    style={{ textDecoration: "none" }}
                  >
                    <button
                      type="button"
                      className={`btn text-uppercase btn-link btn-sm d-flex align-items-center ${
                        indicator.numOfActivities === 0
                          ? " text-danger"
                          : "text-info"
                      }`}
                      onClick={() => {
                        dispatch({
                          type: types.SET_SELECTED_INDICATOR,
                          data: indicator,
                        });

                        if (location.pathname === "/rbm/unit-indicators")
                          history.push("/rbm/unit-indicators/activities");
                        else
                          history.push(
                            "/rbm/expected-results/indicators/activities"
                          );
                      }}
                    >
                      <Badge
                        color="error"
                        variant="dot"
                        invisible={
                          !indicator.hasReportedActivity ||
                          user.position.isEmployee ||
                          location.pathname !== "/rbm/unit-indicators" ||
                          isChildIndicator
                        }
                      >
                        {indicator.numOfActivities} Activit
                        {indicator.numOfActivities > 1 ? "ies" : "y"}{" "}
                      </Badge>
                    </button>
                  </Link>
                </Tooltip>
              </span>
            </span>
          }
        />
      </Card>

      <ConfirmationDialog
        confirmationDialog={confirmDelete}
        message="Are you sure you want to delete Indicator?"
        setConfirmationDialog={setConfirmDelete}
        onYes={() => {
          deleteIndicator(indicator, setConfirmDelete);
        }}
      />

      <IndicatorAssignmentForm
        assignment={
          !!indicator.unitId
            ? {
                unitId: indicator.unitId,
                unitName: indicator.unitName,
                parentUnitId: indicator.parentUnitId,
              }
            : null
        }
        showAssignmentForm={showAssignmentForm}
        setShowAssignmentForm={setShowAssignmentForm}
      />

      <ConfirmationDialog
        color="danger"
        confirmationDialog={confirmApproval}
        message={`Are you sure you want to ${
          approvalStatus ? "approve" : "disapprove"
        } this indicator?`}
        setConfirmationDialog={setConfirmApproval}
        onYes={() => {
          approveIndicator(indicator.id, approvalStatus, setConfirmApproval);
        }}
      />
    </>
  );
};

const mapStateToProps = ({ expectedResults, user }) => {
  return { expectedResults, user };
};
export default connect(mapStateToProps, { deleteIndicator, approveIndicator })(
  IndicatorCard
);
