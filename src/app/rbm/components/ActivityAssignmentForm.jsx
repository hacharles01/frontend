import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Card,
  IconButton,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Autocomplete,
  Divider,
} from "@mui/material";

import { useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  saveActivityAssignment,
  removeActivityAssignment,
} from "../../../store/rbm/actions";
import { isEmpty } from "lodash";
import ConfirmationDialog from "./ConfirmationDialog";
import defaultProfile from "../../assets/default-profile.jpg";

import { showError } from "../../toastify";

const ActivityAssignmentForm = (props) => {
  const location = useLocation();
  const {
    selectedActivity,
    showAssignmentForm,
    setShowAssignmentForm,
    loading,
    subordinates,
    assignments,
    saveActivityAssignment,
    removeActivityAssignment,
    totalQuarterTarget,
    quarter,
    totalWeight,
    user,
  } = props;

  const [formData, setFormData] = useState(null);

  const onSave = () => {
    // if (+quarter.target - +totalQuarterTarget !== 0)
    //   return showError(
    //     `${+quarter.target - +totalQuarterTarget} Target${
    //       +quarter.target - +totalQuarterTarget > 1 ? "s" : ""
    //     } remaining`
    //   );

    // if (100 - +totalWeight !== 0)
    //   return showError(`${100 - +totalWeight} Weight remaining`);

    saveActivityAssignment(
      selectedActivity,
      { activityId: selectedActivity.id, employeeId: formData.id },
      setFormData
    );
  };

  const onClose = () => {
    setFormData(null);
    setShowAssignmentForm(false);
  };

  const [confirmRemoveAssignment, setConfirmRemoveAssignment] = useState(false);
  const [assignmentToBeRemoved, setAssignmentToBeRemoved] = useState(null);
  const [filteredSubordinates, setFilteredSubordinates] = useState([]);

  useEffect(() => {
    const tmpSubordinates = [];
    setAssignmentToBeRemoved(null);
    subordinates.forEach((subordinate) => {
      if (assignments.findIndex(({ id }) => id === subordinate.id) < 0)
        tmpSubordinates.push({
          ...subordinate,
          names: subordinate.lastName + " " + subordinate.firstName,
        });
    });
    setFilteredSubordinates(tmpSubordinates);
  }, [assignments, subordinates]);

  return (
    <>
      <Dialog
        onClose={onClose}
        aria-labelledby="customized-dialog-title"
        open={showAssignmentForm}
        fullWidth
      >
        <DialogTitle className="text-primary pb-0 mb-0">
          Activity
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <span className="material-icons">close</span>
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <div style={{ height: "65vh" }}>
            {selectedActivity.name}

            {((!!subordinates[0] &&
              (user.position.isSupervisor ||
                (user.actingPosition && user.actingPosition.isSupervisor)) &&
              location.pathname === "/rbm/unit-indicators/activities") ||
              !!subordinates[0] ||
              user.position.isPlanner) && (
              <div className="row mt-3 no-gutters  align-items-center">
                <div className="col-12 mb-2">
                  {" "}
                  <Autocomplete
                    disablePortal
                    size="small"
                    defaultValue={null}
                    value={formData}
                    options={filteredSubordinates}
                    getOptionLabel={(option) => option.names}
                    onChange={(event, newValue) => {
                      setFormData(newValue || null);
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label="Select employee" />
                    )}
                    renderOption={(props, option) => (
                      <Box component="li" {...props}>
                        <Avatar
                          style={{ border: "1px solid #d1cbcb" }}
                          alt={option.firstName}
                          className="mr-2"
                          src={
                            option.profileImage
                              ? `data:image/jpeg;base64,${option.profileImage}`
                              : defaultProfile
                          }
                        />
                        {option.names} {""}
                        {option.isMe && (
                          <span className="ml-2 badge badge-primary">Me</span>
                        )}
                      </Box>
                    )}
                  />
                </div>
                <div className="col-12 mb-2">
                  <button
                    onClick={onSave}
                    type="button"
                    disabled={
                      isEmpty(formData) || (loading && !confirmRemoveAssignment)
                    }
                    className="btn btn-primary btn-block btn-sm text-uppercase  "
                  >
                    {loading && !confirmRemoveAssignment ? "Wait..." : "Save"}
                  </button>
                </div>
              </div>
            )}

            {!subordinates[0] &&
              (user.position.isSupervisor ||
                (user.actingPosition && user.actingPosition.isSupervisor)) &&
              location.pathname === "/rbm/unit-indicators/activities" && (
                <div
                  className="alert alert-danger text-center mt-2"
                  role="alert"
                >
                  You don't have any subordinate
                </div>
              )}

            <Card elevation={0} className="  ">
              {!!assignments[0] && (
                <List component="nav" dense>
                  <div className="text-center text-primary pb-2">
                    People assigned
                  </div>
                  <Divider />
                  {assignments.map((assignment, index) => (
                    <React.Fragment key={assignment.id}>
                      <>
                        <ListItem
                          className=" pl-0"
                          secondaryAction={
                            <>
                              {(((user.position.isSupervisor ||
                                (user.actingPosition &&
                                  user.actingPosition.isSupervisor)) &&
                                location.pathname ===
                                  "/rbm/unit-indicators/activities") ||
                                user.position.isPlanner) && (
                                <IconButton
                                  edge="end"
                                  color="error"
                                  aria-label="delete"
                                  onClick={() => {
                                    setAssignmentToBeRemoved(
                                      assignment.assignmentId
                                    );
                                    setConfirmRemoveAssignment(true);
                                  }}
                                >
                                  <span className="material-icons">
                                    remove_circle_outline
                                  </span>
                                </IconButton>
                              )}
                            </>
                          }
                        >
                          <ListItemAvatar>
                            <Avatar
                              style={{ border: "1px solid #d1cbcb" }}
                              alt={assignment.firstName}
                              src={
                                assignment.profileImage
                                  ? `data:image/jpeg;base64,${assignment.profileImage}`
                                  : defaultProfile
                              }
                            />
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <span>
                                {assignment.lastName} {assignment.firstName}
                              </span>
                            }
                          />
                        </ListItem>
                        <Divider />
                      </>
                    </React.Fragment>
                  ))}
                </List>
              )}

              {!!!assignments[0] && (
                <div
                  className="alert alert-danger text-center mt-2"
                  role="alert"
                >
                  No one assigned
                </div>
              )}
            </Card>
          </div>
        </DialogContent>
      </Dialog>

      {confirmRemoveAssignment && (
        <ConfirmationDialog
          confirmationDialog={confirmRemoveAssignment}
          message={`Are you sure you want to remove indicator assignment?`}
          setConfirmationDialog={setConfirmRemoveAssignment}
          onYes={() => {
            removeActivityAssignment(
              selectedActivity,
              {
                id: assignmentToBeRemoved,
              },
              setConfirmRemoveAssignment,
              setFormData
            );
          }}
        />
      )}
    </>
  );
};

const mapStateToProps = ({ loading, subordinates, user }) => {
  return { loading, subordinates, user };
};
export default connect(mapStateToProps, {
  saveActivityAssignment,
  removeActivityAssignment,
})(ActivityAssignmentForm);
