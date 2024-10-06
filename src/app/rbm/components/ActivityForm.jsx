import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
} from "@mui/material";

import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { saveActivity } from "../../../store/rbm/actions";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";

const ActivityForm = (props) => {
  const {
    loading,
    totalWeight,
    isEditing,
    setIsEditing,
    showActivityForm,
    setShowActivityForm,
    quarter,
    selectedActivity,
    totalQuarterTarget,
    saveActivity,
  } = props;

  const [formData, setFormData] = useState({
    id: null,
    name: "",
    weight: "",
    targetShare: "",
    startOn: quarter.startOn,
    endOn: quarter.endOn,
  });

  useEffect(
    () => {
      if (isEditing)
        setFormData({
          id: selectedActivity.id,
          name: selectedActivity.name,
          weight: selectedActivity.weight,
          targetShare: selectedActivity.targetShare,
          startOn: selectedActivity.startOn,
          endOn: selectedActivity.supervisorEndOn,
        });
      else
        setFormData({
          id: null,
          name: "",
          weight: "",
          targetShare: "",
          startOn: quarter.startOn,
          endOn: quarter.endOn,
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedActivity, isEditing]
  );

  const onSave = () => {
    saveActivity(
      {
        ...formData,
        quarterTargetId: quarter.id,
      },
      setFormData,
      setIsEditing,
      setShowActivityForm,
      quarter
    );
  };

  const [weighError, setWeighError] = useState("");
  const [targetShareError, setTargetShareError] = useState("");

  const onClose = () => {
    setShowActivityForm(false);
    setIsEditing(false);
    setWeighError("");
    setTargetShareError("");

    setFormData({
      id: null,
      name: "",
      weight: "",
      targetShare: "",
      startOn: quarter.startOn,
      endOn: quarter.endOn,
    });
  };

  const checkWeight = (value) => {
    if (!isEditing && (+value < 0 || +value + +totalWeight > 100))
      setWeighError(
        `Invalid weight. ${(100 - +totalWeight).toFixed(2)}% allowed`
      );
    else if (
      isEditing &&
      (+value < 0 || +value + +totalWeight > 100 + +selectedActivity.weight)
    )
      setWeighError(
        `Invalid weight. ${(
          100 -
          +totalWeight +
          +selectedActivity.weight
        ).toFixed(2)}% allowed`
      );
    else setWeighError("");
  };

  const checkTargetShare = (value) => {
    if (
      !isEditing &&
      (+value < 0 || +value + +totalQuarterTarget > +quarter.target)
    )
      setTargetShareError(
        `Invalid Target Share. ${(
          +quarter.target - +totalQuarterTarget
        ).toFixed(1)}% allowed`
      );
    else if (
      isEditing &&
      (+value < 0 ||
        +value + +totalQuarterTarget >
          +quarter.target + +selectedActivity.targetShare)
    )
      setTargetShareError(
        `Invalid Target Share. ${(
          +quarter.target -
          +totalQuarterTarget +
          +selectedActivity.targetShare
        ).toFixed(2)}% allowed`
      );
    else setTargetShareError("");
  };

  return (
    <>
      <Dialog
        onClose={onClose}
        aria-labelledby="customized-dialog-title"
        open={showActivityForm}
        fullWidth
      >
        <DialogTitle className="text-primary">
          {isEditing ? "Edit" : "Add New"} Activity
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
        <DialogContent dividers>
          <TextField
            fullWidth
            size="small"
            multiline
            rows={4}
            name="name"
            autoFocus
            label="Name"
            variant="outlined"
            placeholder="Activity description"
            className="mb-3"
            value={formData.name}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start"></InputAdornment>
              ),
            }}
            onChange={(e) => {
              const name = e.target.value;
              setFormData({ ...formData, name });
            }}
          />

          <TextField
            error={!!weighError}
            fullWidth
            size="small"
            label="Weight"
            type="number"
            min="0"
            max="100"
            name="weight"
            variant="outlined"
            placeholder="0"
            className="mb-3"
            helperText={weighError}
            value={formData.weight}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">%</InputAdornment>
              ),
            }}
            // onBlur={() => {
            //   if (formData.weight === "")
            //     setFormData({
            //       ...formData,
            //       weight: 0,
            //     });
            // }}
            onKeyDown={() => {
              if (+formData.weight === 0)
                setFormData({
                  ...formData,
                  weight: "",
                });
            }}
            onChange={(e) => {
              const weight = e.target.value;
              checkWeight(+weight);
              setFormData({ ...formData, weight: weight });
            }}
          />

          <TextField
            error={!!targetShareError}
            helperText={targetShareError}
            fullWidth
            size="small"
            type="number"
            label="Target share"
            name="targetShare"
            variant="outlined"
            defaultChecked
            placeholder="0"
            className="mb-3"
            value={formData.targetShare}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start"></InputAdornment>
              ),
            }}
            // onBlur={() => {
            //   if (formData.targetShare === "")
            //     setFormData({
            //       ...formData,
            //       targetShare: 0,
            //     });
            // }}
            onKeyDown={() => {
              if (+formData.targetShare === 0)
                setFormData({
                  ...formData,
                  targetShare: "",
                });
            }}
            onChange={(e) => {
              const targetShare = e.target.value;
              checkTargetShare(+targetShare);
              setFormData({
                ...formData,
                targetShare: +targetShare,
              });
            }}
          />
          <div className="row">
            <div className="col-12 col-md-6">
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DesktopDatePicker
                  allowSameDateSelection
                  minDate={new Date(quarter.startOn)}
                  maxDate={new Date(quarter.endOn)}
                  label="Start date [ mm/dd/yyyy ]"
                  value={formData.startOn}
                  onChange={(startOn) => {
                    setFormData({
                      ...formData,
                      startOn,
                    });
                  }}
                  renderInput={(params) => (
                    <TextField
                      fullWidth
                      size="small"
                      name="startOn"
                      variant="outlined"
                      className="mb-3"
                      {...params}
                    />
                  )}
                />
              </LocalizationProvider>
            </div>
            <div className="col-12 col-md-6">
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DesktopDatePicker
                  allowSameDateSelection
                  minDate={new Date(quarter.startOn)}
                  maxDate={new Date(quarter.endOn)}
                  label="End date [ mm/dd/yyyy ]"
                  value={formData.endOn}
                  onChange={(endOn) => {
                    setFormData({
                      ...formData,
                      endOn,
                    });
                  }}
                  renderInput={(params) => (
                    <TextField
                      fullWidth
                      size="small"
                      name="endOn"
                      variant="outlined"
                      className="mb-3"
                      {...params}
                    />
                  )}
                />
              </LocalizationProvider>
            </div>
          </div>
        </DialogContent>
        <DialogActions className="d-flex justify-content-center py-4">
          <button
            onClick={onSave}
            type="button"
            className="btn btn-primary text-uppercase  px-4"
            disabled={loading}
          >
            {loading ? "Wait..." : "Save"}
          </button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const mapStateToProps = ({
  selectedActivity,
  loading,
  selectedIndicator,
  selectedExpectedResult,
}) => {
  return {
    selectedActivity,
    loading,
    selectedIndicator,
    selectedExpectedResult,
  };
};
export default connect(mapStateToProps, {
  saveActivity,
})(ActivityForm);
