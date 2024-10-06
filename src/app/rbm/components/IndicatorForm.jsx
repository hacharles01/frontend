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
import { saveIndicator } from "../../../store/rbm/actions";

const IndicatorForm = (props) => {
  const {
    selectedIndicator,
    showIndicatorForm,
    setShowIndicatorForm,
    saveIndicator,
    isEditing,
    setIsEditing,
    loading,
    totalWeight,
    expectedResultId,
  } = props;

  const [formData, setFormData] = useState({
    id: null,
    name: "",
    measurementUnit: "",
    weight: 0,
    baseline: 0,
    annualTarget: 0,
    quarter1Target: 0,
    quarter2Target: 0,
    quarter3Target: 0,
    quarter4Target: 0,
  });

  useEffect(() => {
    if (isEditing)
      setFormData({
        id: selectedIndicator.id,
        name: selectedIndicator.name,
        measurementUnit: selectedIndicator.measurementUnit,
        weight: selectedIndicator.weight,
        baseline: selectedIndicator.baseline,
        annualTarget: selectedIndicator.annualTarget,
        quarter1Target: selectedIndicator.quarter1Target,
        quarter2Target: selectedIndicator.quarter2Target,
        quarter3Target: selectedIndicator.quarter3Target,
        quarter4Target: selectedIndicator.quarter4Target,
      });
    else
      setFormData({
        id: null,
        name: "",
        measurementUnit: "",
        weight: 0,
        baseline: 0,
        annualTarget: 0,
        quarter1Target: 0,
        quarter2Target: 0,
        quarter3Target: 0,
        quarter4Target: 0,
      });
  }, [selectedIndicator, isEditing]);

  const onSave = () => {
    saveIndicator(
      {
        ...formData,
        expectedResultId:
          selectedIndicator.expectedResultId || expectedResultId,
      },
      setFormData,
      setIsEditing,
      setShowIndicatorForm
    );
  };

  const onClose = () => {
    setShowIndicatorForm(false);
    setIsEditing(false);
    setError("");

    setFormData({
      id: null,
      name: "",
      measurementUnit: "",
      weight: 0,
      baseline: 0,
      annualTarget: 0,
      quarter1Target: 0,
      quarter2Target: 0,
      quarter3Target: 0,
      quarter4Target: 0,
    });
  };

  const [error, setError] = useState("");

  const checkWeight = (value) => {
    if (!isEditing && (+value < 0 || +value + +totalWeight > 100))
      setError(`Invalid weight. ${(100 - +totalWeight).toFixed(2)}% allowed`);
    else if (
      isEditing &&
      (+value < 0 || +value + +totalWeight > 100 + +selectedIndicator.weight)
    )
      setError(
        `Invalid weight. ${(
          100 -
          +totalWeight +
          +selectedIndicator.weight
        ).toFixed(2)}% allowed`
      );
    else setError("");
  };

  return (
    <>
      <Dialog
        onClose={onClose}
        aria-labelledby="customized-dialog-title"
        open={showIndicatorForm}
        fullWidth
      >
        <DialogTitle className="text-primary">
          {isEditing ? "Edit" : "Add New"} Indicator
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
            placeholder="Indicator description"
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
            fullWidth
            size="small"
            label="Measurement Unit"
            name="measurementUnit"
            variant="outlined"
            placeholder="Measurement Unit"
            className="mb-3"
            value={formData.measurementUnit}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start"></InputAdornment>
              ),
            }}
            onChange={(e) => {
              const measurementUnit = e.target.value;
              setFormData({
                ...formData,
                measurementUnit,
              });
            }}
          />
          <TextField
            error={!!error}
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
            helperText={error}
            value={formData.weight}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">%</InputAdornment>
              ),
            }}
            onBlur={() => {
              if (formData.weight === "")
                setFormData({
                  ...formData,
                  weight: 0,
                });
            }}
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
              setFormData({ ...formData, weight: weight || 0 });
            }}
          />

          <TextField
            fullWidth
            size="small"
            label="Baseline"
            name="baseline"
            type="number"
            variant="outlined"
            defaultChecked
            placeholder="Baseline"
            className="mb-3"
            value={formData.baseline}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start"></InputAdornment>
              ),
            }}
            onBlur={() => {
              if (formData.baseline === "")
                setFormData({
                  ...formData,
                  baseline: 0,
                });
            }}
            onKeyDown={() => {
              if (+formData.baseline === 0)
                setFormData({
                  ...formData,
                  baseline: "",
                });
            }}
            onChange={(e) => {
              const baseline = e.target.value;
              setFormData({
                ...formData,
                baseline: +baseline || 0,
              });
            }}
          />
          <TextField
            fullWidth
            size="small"
            label="Annual Target"
            type="number"
            name="annualTarget"
            variant="outlined"
            defaultChecked
            placeholder="Annual Target"
            className="mb-3"
            value={formData.annualTarget}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start"></InputAdornment>
              ),
            }}
            onBlur={() => {
              if (formData.annualTarget === "")
                setFormData({
                  ...formData,
                  annualTarget: 0,
                });
            }}
            onKeyDown={() => {
              if (+formData.annualTarget === 0)
                setFormData({
                  ...formData,
                  annualTarget: "",
                });
            }}
            onChange={(e) => {
              const annualTarget = e.target.value;
              setFormData({
                ...formData,
                annualTarget: +annualTarget || 0,
              });
            }}
          />
          <div className="row">
            <div className="col-6 col-md-3">
              <TextField
                fullWidth
                size="small"
                label="Q-1 Target"
                type="number"
                name="quarter1Target"
                variant="outlined"
                defaultChecked
                placeholder="Quarter-1 Target"
                className="mb-3"
                value={formData.quarter1Target}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start"></InputAdornment>
                  ),
                }}
                onBlur={() => {
                  if (formData.quarter1Target === "")
                    setFormData({
                      ...formData,
                      quarter1Target: 0,
                    });
                }}
                onKeyDown={() => {
                  if (+formData.quarter1Target === 0)
                    setFormData({
                      ...formData,
                      quarter1Target: "",
                    });
                }}
                onChange={(e) => {
                  const quarter1Target = e.target.value;
                  setFormData({
                    ...formData,
                    quarter1Target: +quarter1Target || 0,
                  });
                }}
              />
            </div>
            <div className="col-6 col-md-3">
              <TextField
                fullWidth
                size="small"
                type="number"
                label="Q-2 Target"
                name="quarter2Target"
                variant="outlined"
                defaultChecked
                placeholder="Quarter-2 Target"
                className="mb-3"
                value={formData.quarter2Target}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start"></InputAdornment>
                  ),
                }}
                onBlur={() => {
                  if (formData.quarter2Target === "")
                    setFormData({
                      ...formData,
                      quarter2Target: 0,
                    });
                }}
                onKeyDown={() => {
                  if (+formData.quarter2Target === 0)
                    setFormData({
                      ...formData,
                      quarter2Target: "",
                    });
                }}
                onChange={(e) => {
                  const quarter2Target = e.target.value;
                  setFormData({
                    ...formData,
                    quarter2Target: +quarter2Target || 0,
                  });
                }}
              />
            </div>
            <div className="col-6 col-md-3">
              <TextField
                fullWidth
                size="small"
                type="number"
                label="Q-3 Target"
                name="quarter3Target"
                variant="outlined"
                defaultChecked
                placeholder="Quarter-3 Target"
                className="mb-3"
                value={formData.quarter3Target}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start"></InputAdornment>
                  ),
                }}
                onBlur={() => {
                  if (formData.quarter3Target === "")
                    setFormData({
                      ...formData,
                      quarter3Target: 0,
                    });
                }}
                onKeyDown={() => {
                  if (+formData.quarter3Target === 0)
                    setFormData({
                      ...formData,
                      quarter3Target: "",
                    });
                }}
                onChange={(e) => {
                  const quarter3Target = e.target.value;
                  setFormData({
                    ...formData,
                    quarter3Target: +quarter3Target || 0,
                  });
                }}
              />
            </div>
            <div className="col-6 col-md-3">
              <TextField
                fullWidth
                size="small"
                type="number"
                label="Q-4 Target"
                name="quarter4Target"
                variant="outlined"
                defaultChecked
                placeholder="Quarter-4 Target"
                className="mb-3"
                value={formData.quarter4Target}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start"></InputAdornment>
                  ),
                }}
                onBlur={() => {
                  if (formData.quarter4Target === "")
                    setFormData({
                      ...formData,
                      quarter4Target: 0,
                    });
                }}
                onKeyDown={() => {
                  if (+formData.quarter4Target === 0)
                    setFormData({
                      ...formData,
                      quarter4Target: "",
                    });
                }}
                onChange={(e) => {
                  const quarter4Target = e.target.value;
                  setFormData({
                    ...formData,
                    quarter4Target: +quarter4Target || 0,
                  });
                }}
              />
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

const mapStateToProps = ({ selectedIndicator, loading }) => {
  return { selectedIndicator, loading };
};
export default connect(mapStateToProps, {
  saveIndicator,
})(IndicatorForm);
