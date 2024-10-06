import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Typography,
  Autocomplete,
  Box
} from "@mui/material";

import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  saveOrUpdateUnit,
  getUnitTypes,
} from "../../../store/structure/actions";
import { showError } from "../../../app/toastify";

const AddOrUpdateUnitDialog = (props) => {
  const {
    loading,
    isEditing,
    unitTypes,
    units,
    setIsEditing,
    showUnitForm,
    setShowUnitForm,
    parentUnit,
    selectedUnit,
    saveOrUpdateUnit,
    setExpandedNodes,
    getUnitTypes,
  } = props;

  const [formData, setFormData] = useState({
    unitId: null,
    unitName: "",
    parentUnitId: "",
    unitTypeId: 0,
    isOnStructure: true,
  });
  const [unitType, setUnitType] = useState(null);

  const [errors, setErrors] = useState({
    unitNameHasError: false,
    unitTypeHasError: false,
  });

  useEffect(
    () => {
      getUnitTypes();
      if (isEditing)
        setFormData({
          unitId: selectedUnit.unitId,
          unitName: selectedUnit.unitName,
          parentUnitId: selectedUnit.parentUnitId,
          unitTypeId: selectedUnit.unitTypeId,
          isOnStructure: selectedUnit.isOnStructure,
        });
      else
        setFormData({
          unitId: null,
          unitName: "",
          parentUnitId: parentUnit.unitId,
          unitTypeId: 0,
          isOnStructure: true,
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedUnit, parentUnit, isEditing]
  );

  useEffect(
    () => {
     
      if (isEditing){
        const unitType = unitTypes.find(
          ({ id }) => id === formData.unitTypeId
        );
        setUnitType(unitType);
      }
     
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [unitTypes,formData, isEditing]
  );

  const formValidator = () => {
  
    const error = {
      unitNameHasError: false,
      unitTypeHasError: false,
      hasError:false
    };

    if (!formData.unitName) {
      error.unitNameHasError = true;
      error.hasError=true;
    }

   if (!formData.unitTypeId || formData.unitTypeId === 0){
      error.unitTypeHasError = true;
      error.hasError=true;
    }

    setErrors(error);

    if (error.hasError) {
      showError("Please fill out all required fields");
      return true;
    }
    return false;
  };

  const onSave = () => {
    if (
      isEditing &&
      selectedUnit &&
      selectedUnit.unitName === formData.unitName &&
      selectedUnit.unitTypeId === formData.unitTypeId &&
      selectedUnit.isOnStructure === formData.isOnStructure
    ) {
      showError("No update yet");
      return false;
    }
    if (!formValidator()) {

          saveOrUpdateUnit(
            formData,
            setFormData,
            setIsEditing,
            setShowUnitForm,
            setExpandedNodes,
            units,
            isEditing
          );
    }

 
  };

  const onClose = () => {
    setShowUnitForm(false);
    setIsEditing(false);

    setFormData({
      unitId: null,
      unitName: "",
      parentUnitId: "",
      unitTypeId: 0,
      isOnStructure: true,
    });
  };

  return (
    <>
      <Dialog
        onClose={onClose}
        aria-labelledby="customized-dialog-title"
        open={showUnitForm}
        fullWidth
      >
        <DialogTitle className="text-primary">
          <Typography variant="overline" display="block">
            {isEditing ? "Edit" : "Add New"} Unit @
            {isEditing ? selectedUnit.unitName : parentUnit.unitName}
          </Typography>
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
            rows={4}
            name="unitName"
            autoFocus
            label="Unit name"
            variant="outlined"
            placeholder="Unit name"
            className="mb-3"
            value={formData.unitName}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start"></InputAdornment>
              ),
            }}
            onChange={(e) => {
              const unitName = e.target.value;
              setFormData({ ...formData, unitName });
            }}

          />
          {errors.unitNameHasError && (
              <div className="text-danger mb-2">
                Unit name is required{" "}
              </div>
            )}

     
            {!!unitTypes.length && (
             
                <Autocomplete
                  size="small"
                  id="unit-type"
                  defaultValue={null}
                  value={unitType || null}
                  options={unitTypes}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  onChange={(event, unitType) => {
                    setUnitType(unitType || null);
                    const unitTypeId =unitType.id;
                    setFormData({ ...formData, unitTypeId });
                  }}
                  getOptionLabel={(option) => option.name}
                  renderOption={(props, unitType) => (
                    <Box component="li" {...props}>
                       {unitType.name}
                    </Box>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Unit Type"
                      inputProps={{
                        ...params.inputProps,
                      }}
                      />
                    )}
                  />
             
              )}
              {errors.unitTypeHasError && (
              <div className="text-danger mb-2">
                Unit type is required{" "}
              </div>
            )}

          <FormControl>
            <FormLabel id="demo-controlled-radio-buttons-group">
              Is it on structure?
            </FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
              value={formData.isOnStructure}
              onChange={(event) => {
                formData.isOnStructure =
                  event.target.value === "true" ? true : false;
                setFormData({ ...formData });
              }}
            >
              <FormControlLabel value={true} control={<Radio />} label="Yes" />
              <FormControlLabel value={false} control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>
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

const mapStateToProps = ({ loading, unitTypes, units }) => {
  return {
    loading,
    unitTypes,
    units,
  };
};
export default connect(mapStateToProps, {
  saveOrUpdateUnit,
  getUnitTypes,
})(AddOrUpdateUnitDialog);
