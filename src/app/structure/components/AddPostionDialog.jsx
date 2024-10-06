import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Autocomplete,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Typography,
} from "@mui/material";

import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  getSalaryStructure,
  savePosition,
  getEmployeeGroups,
  getHiringModes,
  getLevels,
  getEchelons
} from "../../../store/structure/actions";
import { showError } from "../../../app/toastify";

const AddPostionDialog = (props) => {
  const {
    loading,
    user,
    salaryStructures,
    employeeGroups,
    levels,
    echelons,
    selectedUnit,
    hiringModes,
    showPostionForm,

    getEmployeeGroups,
    getSalaryStructure,
    getHiringModes,
    setShowPositionForm,
    savePosition,
    getLevels,
    getEchelons
  } = props;

  const [positionForm, setPositionForm] = useState({
    hiringModeId: "",
    employeeGroupId: "",
    echelonId: "",
    indexValueId: "",
    salaryStructureId: "",
    number: 0,
    unitId: "",
    name: "",
    isOnStructure: false,
    levelId: "",
  });
  const [employeeGroup, setEmployeeGroup] = useState(null);
  const [hiringMode, setHiringMode] = useState(null);
  const [salaryStructure, setSalaryStructure] = useState(null);
  const [levelName, setLevelName] = useState(null);
  const [echelonName, setEchelonName] = useState(null);
  
  const [isOnStructure, setIsOnStructure] = useState(true);
  
  const [errors, setErrors] = useState({
    positionHasError: false,
    hiringModeHasError: false,
    employeeGroupHasError: false,
  });

  useEffect(
    () => {
      getSalaryStructure(user.RBM_institution.id);
      getEmployeeGroups();
      getHiringModes();
      getLevels();
      getEchelons();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user]
  );

  const selectSalaryStructure = (salaryStructure) => {

    if (salaryStructure) {
    
      positionForm.unitId = selectedUnit.unitId;

      positionForm.levelId = salaryStructure.levelId;
      positionForm.echelonId = salaryStructure.echelonId;
      positionForm.indexValueId = +salaryStructure.indexValueId;
      positionForm.salaryStructureId = salaryStructure.id;
      positionForm.name = salaryStructure.name;

      positionForm.indexValueId = salaryStructure.indexValueId;
      positionForm.number = +salaryStructure.number;

      const levelName =levels.find(({id})=>id===positionForm.levelId).name;
      const echelonName =echelons.find(({id})=>id===positionForm.echelonId).name;
  
      setLevelName(levelName);
      setEchelonName(echelonName);
    }
  };
  const formValidator = () => {
  
    const error = {
      positionHasError: false,
      hiringModeHasError: false,
      employeeGroupHasError: false,
      hasError:false
    };

    if (!salaryStructure) {
      error.positionHasError = true;
      error.hasError=true;
    }

    if (!employeeGroup) {
      error.employeeGroupHasError = true;
      error.hasError=true;
    }

    if (!hiringMode) {
      error.hiringModeHasError = true;
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
    if (!formValidator()) {
      positionForm.hiringModeId=hiringMode.id;
      positionForm.employeeGroupId=employeeGroup.id;
      positionForm.isOnStructure =isOnStructure;

      const hiringModeName = hiringModes.find(({id})=>id===positionForm.hiringModeId).name;
      const employeeGroupName = employeeGroups.find(({id})=>id===positionForm.employeeGroupId).name;
      
      const extraData={
        hiringModeName:hiringModeName,
        employeeGroupName:employeeGroupName,
        levelName:levelName,
        echelonName:echelonName,
        isShared:false
      }
      savePosition(positionForm,extraData,setShowPositionForm);

    }
  };

  const onClose = () => {
    setShowPositionForm(false);

    setPositionForm({
      hiringModeId: "",
      employeeGroupId: "",
      echelonId: "",
      indexValueId: "",
      salaryStructureId: "",
      number: 0,
      unitId: "",
      name: "",
      isOnStructure: true,
      levelId: "",
    });
  };

  return (
    <>
      <Dialog
        onClose={onClose}
        aria-labelledby="customized-dialog-title"
        open={showPostionForm}
        fullWidth
      >
        <DialogTitle className="text-primary">
          <Typography variant="overline" display="block">
            Add position @{selectedUnit.unitName}
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
          <div className="row">
            {!!salaryStructures.length && (
              <div className="col-12">
                <Autocomplete
                  size="small"
                  disablePortal
                  id="position-title"
                  defaultValue={null}
                  value={salaryStructure}
                  options={salaryStructures}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  onChange={(event, salaryStructure) => {
                    setSalaryStructure(salaryStructure || null);
                    selectSalaryStructure(salaryStructure);
                    const positionHasError = false;
                    setErrors({ ...errors, positionHasError });
                  }}
                  getOptionLabel={(option) => option.name  +
                    " (" +
                    levelName +
                    "." +
                    echelonName +
                    ")"}
                  renderOption={(props, salaryStructure) => (
                    <Box component="li" {...props}>
                      {salaryStructure.name}
                    </Box>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Position title"
                      inputProps={{
                        ...params.inputProps,
                        autoComplete: "new-password", // disable autocomplete and autofill
                      }}
                    />
                  )}
                />
                {errors.positionHasError && (
                  <div className="text-danger mt-2"> Position is required </div>
                )}
              </div>
            )}

            {salaryStructure && (
              <div className="col-12 mt-3">
                <TextField
                  style={{
                    backgroundColor: "#eee!important",
                    fontWeight: "700",
                  }}
                  fullWidth
                  disabled
                  size="small"
                  label="Level"
                  variant="outlined"
                  placeholder="Level"
                  value={levelName}
                />
              </div>
            )}

            {salaryStructure && (
              <div className="col-12 mt-3">
                <TextField
                  style={{
                    backgroundColor: "#eee!important",
                    fontWeight: "700",
                  }}
                  fullWidth
                  disabled
                  size="small"
                  label="Scale"
                  variant="outlined"
                  placeholder="Scale"
                  value={salaryStructure.echelonName}
                />
              </div>
            )}

            {salaryStructure && (
              <div className="col-12 mt-3">
                <TextField
                  style={{
                    backgroundColor: "#eee!important",
                    fontWeight: "700",
                  }}
                  fullWidth
                  disabled
                  size="small"
                  label="Index value"
                  variant="outlined"
                  placeholder="Index value"
                  value={salaryStructure.indexValueId}
                />
              </div>
            )}

            {salaryStructure && (
              <div className="col-12 mt-3">
                <TextField
                  style={{
                    backgroundColor: "#eee!important",
                    fontWeight: "700",
                  }}
                  fullWidth
                  disabled
                  size="small"
                  label="Number of Post"
                  variant="outlined"
                  placeholder="Number of Post"
                  value={salaryStructure.number}
                />
              </div>
            )}

            {!!employeeGroups.length && (
              <div className="col-12 mt-3">
                <Autocomplete
                  size="small"
                  id="employee-group"
                  defaultValue={null}
                  value={employeeGroup}
                  options={employeeGroups}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  onChange={(event, employeeGroup) => {
                    setEmployeeGroup(employeeGroup || null);
                    const employeeGroupHasError = false;
                    setErrors({ ...errors, employeeGroupHasError });
                  }}
                  getOptionLabel={(option) => option.name}
                  renderOption={(props, employeeGroup) => (
                    <Box component="li" {...props}>
                      {employeeGroup.name}
                    </Box>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Employment group"
                      inputProps={{
                        ...params.inputProps,
                        autoComplete: "new-password", // disable autocomplete and autofill
                      }}
                    />
                  )}
                />
                {errors.employeeGroupHasError && (
                  <div className="text-danger mt-2">
                    Employment group is required{" "}
                  </div>
                )}
              </div>
            )}

            {!!hiringModes.length && (
              <div className="col-12 mt-3">
                <Autocomplete
                  size="small"
                  id="hiring-mode"
                  defaultValue={null}
                  value={hiringMode}
                  options={hiringModes}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  onChange={(event, hiringMode) => {
                    setHiringMode(hiringMode || null);
                    const hiringModeHasError = false;
                    setErrors({ ...errors, hiringModeHasError });
                  }}
                  getOptionLabel={(option) => option.name}
                  renderOption={(props, hiringMode) => (
                    <Box component="li" {...props}>
                      {hiringMode.name}
                    </Box>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Hiring mode"
                      inputProps={{
                        ...params.inputProps,
                        autoComplete: "new-password", // disable autocomplete and autofill
                      }}
                    />
                  )}
                />
                {errors.hiringModeHasError && (
                  <div className="text-danger mt-2">
                    Hiring mode is required{" "}
                  </div>
                )}
              </div>
            )}

            <div className="col-12 mt-3">
              <FormControl>
                <FormLabel id="demo-controlled-radio-buttons-group">
                  Is it on structure?
                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  value={isOnStructure}
                  onChange={(event) => {
                    setIsOnStructure(
                      event.target.value === "true" ? true : false
                    );
                  }}
                >
                  <FormControlLabel
                    value={true}
                    control={<Radio />}
                    label="Yes"
                  />
                  <FormControlLabel
                    value={false}
                    control={<Radio />}
                    label="No"
                  />
                </RadioGroup>
              </FormControl>
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
  loading,
  salaryStructures,
  employeeGroups,
  hiringModes,
  echelons,
  levels,
  user,
}) => {
  return {
    loading,
    user,
    salaryStructures,
    employeeGroups,
    hiringModes,
    echelons,
    levels
  };
};
export default connect(mapStateToProps, {
  getSalaryStructure,
  getEmployeeGroups,
  getHiringModes,
  savePosition,
  getLevels,
  getEchelons
})(AddPostionDialog);
