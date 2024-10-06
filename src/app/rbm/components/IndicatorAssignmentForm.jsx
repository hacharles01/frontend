import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Card,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Autocomplete,
  Divider,
} from "@mui/material";

import { useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  saveIndicatorAssignment,
  removeIndicatorAssignment,
} from "../../../store/rbm/actions";

import ConfirmationDialog from "./ConfirmationDialog";

const IndicatorAssignmentForm = (props) => {
  const location = useLocation();

  const {
    selectedIndicator,
    showAssignmentForm,
    setShowAssignmentForm,
    loading,
    units,
    assignment,
    saveIndicatorAssignment,
    removeIndicatorAssignment,
    user,
  } = props;

  const [formData, setFormData] = useState(
    !!assignment ? { ...assignment } : {}
  );

  const [prentUnits, setParentUnits] = useState(
    !!assignment ? [assignment] : []
  );

  const onSave = () => {
    saveIndicatorAssignment(
      {
        indicatorId: selectedIndicator.id,
        unitId: formData.unitId,
      },
      location.pathname
    );
  };

  const onClose = () => {
    setShowAssignmentForm(false);
  };

  useEffect(
    () => {
      const lastUnit = prentUnits[prentUnits.length - 1] || {};
      const parentUnitIndex = units.findIndex(
        ({ unitId }) => unitId === lastUnit.parentUnitId
      );

      if (parentUnitIndex >= 0) {
        setParentUnits([...prentUnits, units[parentUnitIndex]]);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [prentUnits, formData, showAssignmentForm]
  );

  const [confirmRemoveAssignment, setConfirmRemoveAssignment] = useState(false);
  const [assignmentToBeRemoved, setAssignmentToBeRemoved] = useState(null);

  return (
    <>
      <Dialog
        onClose={onClose}
        aria-labelledby="customized-dialog-title"
        open={showAssignmentForm}
        fullWidth
      >
        <DialogTitle className="text-primary ">
          Indicator Assignments
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
        <DialogContent className="">
          <div style={{ height: "60vh" }}>
            {selectedIndicator.name}
            {!assignment &&
              (user.position.isPlanner ||
                (!!user.actingPosition && !!user.actingPosition.isPlanner) ||
                user.position.isTechnicalHead ||
                (!!user.actingPosition &&
                  !!user.actingPosition.isTechnicalHead)) && (
                <Autocomplete
                  disablePortal
                  size="small"
                  id="combo-box-demo"
                  options={units}
                  getOptionLabel={(option) => option.unitName}
                  className="mt-4"
                  onChange={(event, newValue) => {
                    setFormData(newValue || {});
                    setParentUnits([newValue || []]);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Select unit for assignment" />
                  )}
                />
              )}

            <Card
              elevation={0}
              className="d-flex align-items-center justify-content-center"
            >
              <List component="nav">
                {prentUnits[0] && prentUnits[0].unitName && !assignment && (
                  <div className="alert alert-danger text-center" role="alert">
                    Remember to save changes
                  </div>
                )}
                {prentUnits[0] && prentUnits[0].unitName && (
                  <div className="text-center text-primary">
                    Units {!!assignment ? "" : "to be"} assigned
                  </div>
                )}
                <Divider />
                {prentUnits.map((unit, index) => (
                  <React.Fragment key={unit.unitId}>
                    {unit.unitName && (
                      <>
                        <ListItem
                          className=" pl-0"
                          secondaryAction={
                            <span>
                              {!!assignment &&
                                (user.position.isPlanner ||
                                  (!!user.actingPosition &&
                                    !!user.actingPosition.isPlanner) ||
                                  user.position.isTechnicalHead ||
                                  (!!user.actingPosition &&
                                    !!user.actingPosition.isTechnicalHead)) && (
                                  <IconButton
                                    disabled={index !== 0}
                                    edge="end"
                                    color="error"
                                    aria-label="delete"
                                    onClick={() => {
                                      setAssignmentToBeRemoved(unit.unitId);
                                      setConfirmRemoveAssignment(true);
                                    }}
                                  >
                                    <span className="material-icons">
                                      remove_circle_outline
                                    </span>
                                  </IconButton>
                                )}
                            </span>
                          }
                        >
                          <ListItemAvatar>
                            <Avatar>{prentUnits.length - index}</Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <span
                                className={`font-weight-${
                                  index === 0 ? "bold" : "light"
                                }`}
                              >
                                {unit.unitName}
                              </span>
                            }
                          />
                        </ListItem>
                        <Divider />
                      </>
                    )}
                  </React.Fragment>
                ))}
              </List>
            </Card>
          </div>
        </DialogContent>
        <DialogActions className="d-flex justify-content-center py-4">
          {(user.position.isPlanner ||
            (!!user.actingPosition && !!user.actingPosition.isPlanner) ||
            user.position.isTechnicalHead ||
            (!!user.actingPosition &&
              !!user.actingPosition.isTechnicalHead)) && (
            <button
              onClick={onSave}
              type="button"
              className="btn btn-primary text-uppercase  px-4"
              disabled={
                !!assignment ||
                !(prentUnits[0] && prentUnits[0].unitName) ||
                (loading && !confirmRemoveAssignment)
              }
            >
              {loading && !confirmRemoveAssignment ? "Wait..." : "Save"}
            </button>
          )}
        </DialogActions>
      </Dialog>

      <ConfirmationDialog
        confirmationDialog={confirmRemoveAssignment}
        message={`Are you sure you want to remove indicator assignment?`}
        setConfirmationDialog={setConfirmRemoveAssignment}
        onYes={() => {
          removeIndicatorAssignment(
            {
              indicatorId: selectedIndicator.id,
              unitId: assignmentToBeRemoved,
            },
            setConfirmRemoveAssignment,
            setFormData,
            setParentUnits,
            location.pathname
          );
        }}
      />
    </>
  );
};

const mapStateToProps = ({ loading, selectedIndicator, units, user }) => {
  return { loading, selectedIndicator, units, user };
};
export default connect(mapStateToProps, {
  saveIndicatorAssignment,
  removeIndicatorAssignment,
})(IndicatorAssignmentForm);
