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
} from "@mui/material";
import { useHistory } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import { deleteExpectedResult } from "../../../store/rbm/actions";
import types from "../../../store/rbm/action-types";
import ConfirmationDialog from "./ConfirmationDialog";
import CurrencyFormat from "react-currency-format";

const ExpectedResultCard = (props) => {
  const {
    expectedResult,
    index,
    setIsEditing,
    openExpectedResultForm,
    deleteExpectedResult,
    user,
  } = props;
  const dispatch = useDispatch();
  const history = useHistory();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const [confirmationDialog, setConfirmationDialog] = useState(false);

  const [score, setScore] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      setScore(expectedResult.score);
    }, 500);
  }, [expectedResult]);

  return (
    <>
      <Card
        className={`mb-3  expected-result-card `}
        variant="outlined"
        style={{
          backgroundColor: !!expectedResult.notAssigned ? "#f7eded" : "#f6f8fa",
          border: !!expectedResult.notAssigned ? "1px solid red" : "",
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
              {(user.position.isPlanner ||
                (!!user.actingPosition && !!user.actingPosition.isPlanner) ||
                user.position.isTechnicalHead ||
                (!!user.actingPosition &&
                  user.actingPosition.isTechnicalHead)) && (
                <Box>
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
                    <Divider className="my-1" />
                    <MenuItem
                      onClick={() => {
                        dispatch({
                          type: types.SET_SELECTED_EXPECTED_RESULT,
                          data: expectedResult,
                        });

                        history.push("/rbm/expected-results/indicators");
                      }}
                      className="text-dark font-weight-light"
                    >
                      <span className="material-icons mr-2">launch</span> Go To
                      Indicators
                    </MenuItem>
                    <Divider className="my-1" />

                    <MenuItem
                      onClick={() => {
                        handleCloseMenu();
                        dispatch({
                          type: types.SET_SELECTED_EXPECTED_RESULT,
                          data: expectedResult,
                        });
                        setIsEditing(true);
                        openExpectedResultForm();
                      }}
                      className="text-dark font-weight-light"
                    >
                      <span className="material-icons mr-2">edit</span> Edit
                    </MenuItem>

                    <Divider className="my-1" />

                    <MenuItem
                      onClick={() => {
                        handleCloseMenu();
                        setConfirmationDialog(true);
                      }}
                      className="text-danger font-weight-light"
                    >
                      <span className="material-icons mr-2">delete</span> Delete
                    </MenuItem>
                  </Menu>
                </Box>
              )}
            </>
          }
          title={
            <span className="text-uppercase">
              {index + 1}: {expectedResult.name}
              {!!expectedResult.notAssigned && (
                <span className="badge badge-warning ml-1 text-danger">
                  Unassigned indicator(s)
                </span>
              )}
            </span>
          }
          subheader={
            <span className="">
              <Tooltip title="Weight">
                <span className="mr-2 text-info" style={{ cursor: "default" }}>
                  <i className="fas fa-weight-hanging mr-1"></i>
                  {expectedResult.weight} %
                </span>
              </Tooltip>
              <Tooltip title="Budget">
                <span className="mr-2 text-info" style={{ cursor: "default" }}>
                  {" | "}
                  <i className="fas fa-money-check-alt ml-1 mr-1"></i>{" "}
                  <CurrencyFormat
                    value={expectedResult.budget}
                    displayType={"text"}
                    thousandSeparator={true}
                    prefix={"Frw "}
                  />
                </span>
              </Tooltip>

              {expectedResult.reference && (
                <span className="mr-2 text-info">
                  {" | "}
                  <i className="fas fa-file-alt ml-1 mr-1"></i>{" "}
                  {expectedResult.reference}
                </span>
              )}

              {!(
                user.position.isEmployee &&
                (!!!user.actingPosition ||
                  (!!user.actingPosition && user.actingPosition.isEmployee))
              ) && (
                <Tooltip title="Go To Indicators">
                  <button
                    type="button"
                    className={`mt-2  float-right btn btn-link text-uppercase btn-sm d-flex align-items-center ${
                      expectedResult.numOfIndicators === 0
                        ? " text-danger"
                        : "text-info"
                    }`}
                    onClick={() => {
                      dispatch({
                        type: types.SET_SELECTED_EXPECTED_RESULT,
                        data: expectedResult,
                      });

                      history.push("/rbm/expected-results/indicators");
                    }}
                  >
                    {expectedResult.numOfIndicators} Indicator
                    {expectedResult.numOfIndicators > 1 ? "s" : ""}{" "}
                    {expectedResult.unApprovedIndicators > 0 && (
                      <span className="material-icons text-danger ml-1">
                        error
                      </span>
                    )}
                  </button>
                </Tooltip>
              )}

              {user.position.isEmployee &&
                (!!!user.actingPosition ||
                  (!!user.actingPosition &&
                    user.actingPosition.isEmployee)) && (
                  <button
                    style={{ cursor: "default" }}
                    type="button"
                    className={`mt-2  float-right btn btn-link text-uppercase btn-sm d-flex align-items-center ${
                      expectedResult.numOfIndicators === 0
                        ? " text-danger"
                        : "text-info"
                    }`}
                  >
                    {expectedResult.numOfIndicators} Indicator
                    {expectedResult.numOfIndicators > 1 ? "s" : ""}{" "}
                  </button>
                )}
            </span>
          }
        />
      </Card>

      <ConfirmationDialog
        confirmationDialog={confirmationDialog}
        message="Are you sure you want to delete output?"
        setConfirmationDialog={setConfirmationDialog}
        onYes={() => {
          deleteExpectedResult(expectedResult.id, setConfirmationDialog);
        }}
      />
    </>
  );
};

const mapStateToProps = ({ expectedResults, user }) => {
  return { expectedResults, user };
};
export default connect(mapStateToProps, { deleteExpectedResult })(
  ExpectedResultCard
);
