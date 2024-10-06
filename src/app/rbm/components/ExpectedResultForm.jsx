import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
} from "@mui/material";

import React, { useLayoutEffect, useState } from "react";
import { connect } from "react-redux";
import { saveExpectedResult } from "../../../store/rbm/actions";
import NumberFormat from "react-number-format";

const ExpectedResultForm = (props) => {
  const {
    selectedExpectedResult,
    saveExpectedResult,
    closeExpectedResultForm,
    expectedResultFormOpen,
    isEditing,
    setIsEditing,
    loading,
    totalWeight,
  } = props;

  const [formData, setFormData] = useState({
    id: null,
    reference: "",
    name: "",
    weight: 0,
    budget: 0,
  });

  useLayoutEffect(() => {
    if (isEditing)
      setFormData({
        id: selectedExpectedResult.id,
        reference: selectedExpectedResult.reference,
        name: selectedExpectedResult.name,
        weight: selectedExpectedResult.weight,
        budget: selectedExpectedResult.budget,
      });
  }, [selectedExpectedResult, isEditing]);

  const onSave = () => {
    saveExpectedResult(
      formData,
      setFormData,
      setIsEditing,
      closeExpectedResultForm
    );
  };

  const onClose = () => {
    closeExpectedResultForm();
    setIsEditing(false);
    setError("");
    setFormData({
      id: null,
      reference: "",
      name: "",
      weight: 0,
      budget: 0,
    });
  };

  const [error, setError] = useState("");

  const checkWeight = (value) => {
    if (!isEditing && (+value < 0 || +value + +totalWeight > 100))
      setError(`Invalid weight. ${(100 - +totalWeight).toFixed(2)}% allowed`);
    else if (
      isEditing &&
      (+value < 0 ||
        +value + +totalWeight > 100 + +selectedExpectedResult.weight)
    )
      setError(
        `Invalid weight. ${(
          100 -
          +totalWeight +
          +selectedExpectedResult.weight
        ).toFixed(2)}% allowed`
      );
    else setError("");
  };

  return (
    <>
      <Dialog
        onClose={onClose}
        aria-labelledby="customized-dialog-title"
        open={expectedResultFormOpen}
        fullWidth
      >
        <DialogTitle className="text-primary">
          {isEditing ? "Edit" : "Add New"} Output
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
            autoFocus
            rows={4}
            name="name"
            label="Name"
            variant="outlined"
            placeholder="Output description"
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
            label="Reference"
            name="reference"
            variant="outlined"
            defaultChecked
            placeholder="Optional"
            className="mb-3"
            value={formData.reference}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start"></InputAdornment>
              ),
            }}
            onChange={(e) => {
              const reference = e.target.value;
              setFormData({
                ...formData,
                reference,
              });
            }}
          />
          <TextField
            error={!!error}
            fullWidth
            size="small"
            type="number"
            label="Weight"
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

          <NumberFormat
            fullWidth
            size="small"
            label="Budget"
            name="budget"
            variant="outlined"
            placeholder="Frw 0"
            className="mb-3"
            prefix={"Frw "}
            customInput={TextField}
            value={formData.budget}
            onBlur={() => {
              if (formData.budget === "")
                setFormData({
                  ...formData,
                  budget: 0,
                });
            }}
            onKeyDown={() => {
              if (+formData.budget === 0)
                setFormData({
                  ...formData,
                  budget: "",
                });
            }}
            onChange={(e) => {
              const budget = e.target.value.split("Frw ");
              setFormData({
                ...formData,
                budget: budget[1] ? budget[1].replace(/,/g, "") : 0,
              });
            }}
            thousandSeparator={true}
          />
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

const mapStateToProps = ({ selectedExpectedResult, loading }) => {
  return { selectedExpectedResult, loading };
};
export default connect(mapStateToProps, {
  saveExpectedResult,
})(ExpectedResultForm);
