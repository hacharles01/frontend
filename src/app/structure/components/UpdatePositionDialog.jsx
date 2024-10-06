import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  TextField,
  InputAdornment,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Autocomplete,
  Box,
  DialogActions,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  getEmployeeGroups,
  getHiringModes,
  getSupervisorPositions,
  updatePosition,
} from "../../../store/structure/actions";
import { showError } from "../../../app/toastify";
import MinimumQualification from "../components/MinimumQualification";
import ProfessionalCertificate from "../components/ProfessionalCertificate";
import { useTheme } from "@mui/material/styles";
import AddOrUpdateQualificationDialag from "./AddOrUpdateQualificationDialag";
import AddProfessionalCertificateDialag from "./AddProfessionalCertificateDialag";
import PositionKnowledge from "./PositionKnowledge";
import AddPositionKnowledgDialag from "./AddPositionKnowledgDialag";

const UpdatePositionDialog = (props) => {
  const {
    position,
    loading,
    employeeGroups,
    hiringModes,
    supervisorPositions,
    showUpdatePositionModal,
    setShowUpdatePositionModal,
    getEmployeeGroups,
    getHiringModes,
    getSupervisorPositions,
    updatePosition,
  } = props;

  const [formData, setFormData] = useState({
    ...position,
  });

  const [employeeGroup, setEmployeeGroup] = useState(null);
  const [hiringMode, setHiringMode] = useState(null);
  const [supervisorPosition, setSupervisorPosition] = useState(null);

  const [isOnStructure, setIsOnStructure] = useState(position.isOnStructure);

  const [isEditing, setIsEditing] = useState(false);
  const [showQualificationForm, setShowQualificationForm] = useState(false);
  const [selectedQualification, setSelectedQualification] = useState(null);

  const [showProfessionalCertificateForm, setShowProfessionalCertificateForm] =
    useState(false);
  const [showPositionKnowledgeForm, setShowPositionKnowledgeForm] =
    useState(false);

  const theme = useTheme();

  const [errors, setErrors] = useState({
    supervisorPositionHasError: false,
    hiringModeHasError: false,
    employeeGroupHasError: false,
    descriptionHasError: false,
  });

  const onClose = () => {
    setShowUpdatePositionModal(false);
  };

  useEffect(
    () => {
      getEmployeeGroups();
      getHiringModes();
      getSupervisorPositions();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(
    () => {
      const hiringMode = hiringModes.find(
        ({ id }) => id === formData.hiringModeId
      );
      setHiringMode(hiringMode);

      const employeeGroup = employeeGroups.find(
        ({ id }) => id === formData.employeeGroupId
      );
      setEmployeeGroup(employeeGroup);

      const supervisorPosition = supervisorPositions.find(
        ({ id }) => id === formData.reportsToId
      );

      setSupervisorPosition(supervisorPosition);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [employeeGroups, hiringModes, supervisorPositions, formData]
  );

  const getSupervisors = () => {
    return supervisorPositions.filter(
      ({ isHeadOfUnit }) => isHeadOfUnit === true
    );
  };

  const checkDisabled = (position) => {
    if (position.isShared === false) return true;
    else return false;
  };
  //onSave

  const formValidator = () => {
    const error = {
      supervisorPositionHasError: false,
      hiringModeHasError: false,
      employeeGroupHasError: false,
      descriptionHasError: false,
      hasError: false,
    };

    if (!formData.description) {
      error.descriptionHasError = true;
      error.hasError = true;
    }

    if (!employeeGroup) {
      error.employeeGroupHasError = true;
      error.hasError = true;
    }

    if (!hiringMode) {
      error.hiringModeHasError = true;
      error.hasError = true;
    }

    if (!supervisorPosition) {
      error.supervisorPositionHasError = true;
      error.hasError = true;
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
      formData.hiringModeId = hiringMode.id;
      formData.employeeGroupId = employeeGroup.id;

      const hiringModeName = hiringMode.name;
      const employeeGroupName = employeeGroup.name;

      const payload = {
        description: formData.description,
        isOnStructure: isOnStructure,
        reportsToId: formData.reportsToId,
        hiringModeId: formData.hiringModeId,
        employeeGroupId: formData.employeeGroupId,
        hiringModeName: hiringModeName,
        employeeGroupName: employeeGroupName,
        levelName: position.levelName,
        echelonName: position.echelonName,
        isShared: false,
      };

      updatePosition(position.id, payload, setShowUpdatePositionModal);
    }
  };

  return (
    <>
      <Dialog
        onClose={onClose}
        aria-labelledby="customized-dialog-title"
        open={showUpdatePositionModal}
        fullWidth={true}
        maxWidth={"lg"}
      >
        <DialogTitle className="text-primary">
          <Typography variant="overline" display="block">
            <div className="headerorg mb-0">
              <div className="header_cont">
                <span className="ml-0">{position.name}</span>
                {!position.isOnStructure && (
                  <span
                    className="badge badge-pill badge-light ml-0"
                    style={{
                      fontweight: 100,
                      color: "red",
                      border: "1px solid red",
                    }}
                  >
                    Not on structure
                  </span>
                )}

                {!position.isShared ||
                  (position.isSharing && (
                    <span
                      className="badge badge-pill badge-light ml-2"
                      style={{
                        fontweight: 100,
                        color: "red",
                        border: "1px solid red",
                      }}
                    >
                      {" "}
                      <span style={{ fontSize: "10px" }}>
                        <i class="fas fa-share"></i>
                      </span>
                      Shared
                    </span>
                  ))}
              </div>
            </div>
            <div className="mt-0">
              <span
                className="ml-0"
                style={{
                  border: "1px solid #17a2b8",
                  borderRadius: "5px",
                  padding: "2px 5px",
                  fontsize: "12px",
                }}
              >
                Level:
                <strong style={{ color: "#088dce", fontSize: "12px" }}>
                  {position.levelName}.{position.echelonName}
                </strong>
              </span>
              <span
                className="ml-2"
                style={{
                  border: "1px solid #17a2b8",
                  borderRadius: "5px",
                  padding: "2px 5px",
                  fontsize: "12px",
                }}
              >
                IndexValue:
                <strong style={{ color: "#088dce", fontSize: "12px" }}>
                  {position.indexValueId}
                </strong>
              </span>

              <span
                className="ml-2"
                style={{
                  border: "1px solid #17a2b8",
                  borderRadius: "5px",
                  padding: "2px 5px",
                  fontsize: "12px",
                }}
              >
                <strong style={{ color: "#088dce", fontSize: "12px" }}>
                  {position.number}
                </strong>
                Post {position.number > 1 && "s"}
              </span>
            </div>
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
          <div
            className="elevated rounded p-3"
            style={{
              backgroundColor: "#fafafa",
              border: "1px solid #17a2b8",
            }}
          >
            <div className="row">
              <div className="col-12">
                <TextField
                  fullWidth
                  size="small"
                  multiline
                  rows={4}
                  name="description"
                  autoFocus
                  label="Job Responsibilities"
                  variant="outlined"
                  placeholder="Job Responsibilities"
                  readOnly={!checkDisabled(position)}
                  value={formData.description}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start"></InputAdornment>
                    ),
                  }}
                  onChange={(e) => {
                    const description = e.target.value;
                    setFormData({ ...formData, description });
                  }}
                />

                {errors.descriptionHasError && (
                  <div className="text-danger mt-2">
                    Description is required{" "}
                  </div>
                )}
              </div>

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
              <div className="col-3 col-md-3 col-lg-3 mt-3">
                {!!employeeGroups.length && (
                  <Autocomplete
                    size="small"
                    id="employee-group"
                    defaultValue={null}
                    value={employeeGroup || null}
                    options={employeeGroups}
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id
                    }
                    onChange={(event, employeeGroup) => {
                      //setEmployeeGroup(employeeGroup || null);
                      const employeeGroupId = employeeGroup.id;
                      setFormData({ ...formData, employeeGroupId });
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
                )}

                {errors.employeeGroupHasError && (
                  <div className="text-danger mt-2">
                    Employment group is required{" "}
                  </div>
                )}
              </div>
              <div className="col-3 col-md-3 col-lg-3 mt-3">
                {!!hiringModes.length && (
                  <Autocomplete
                    size="small"
                    id="hiring-mode"
                    defaultValue={null}
                    value={hiringMode || null}
                    options={hiringModes}
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id
                    }
                    onChange={(event, hiringMode) => {
                      // setHiringMode(hiringMode || null);
                      const hiringModeId = hiringMode.id;
                      setFormData({ ...formData, hiringModeId });
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
                )}

                {errors.hiringModeHasError && (
                  <div className="text-danger mt-2">
                    Hiring mode is required{" "}
                  </div>
                )}
              </div>
              <div className="col-6 col-md-6 col-lg-6 mt-3">
                {!!getSupervisors().length && (
                  <Autocomplete
                    size="small"
                    id="supervisor-position"
                    defaultValue={null}
                    value={supervisorPosition || null}
                    options={getSupervisors()}
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id
                    }
                    onChange={(event, supervisorPosition) => {
                      const reportsToId = supervisorPosition.id;
                      setFormData({ ...formData, reportsToId });
                    }}
                    getOptionLabel={(option) =>
                      option.name + "(" + option.unitName + ")"
                    }
                    renderOption={(props, supervisorPosition) => (
                      <Box component="li" {...props}>
                        {supervisorPosition.name}{" "}
                        <small style={{ color: "blue" }}>
                          ({supervisorPosition.unitName})
                        </small>
                      </Box>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Supervisor"
                        inputProps={{
                          ...params.inputProps,
                          autoComplete: "new-password", // disable autocomplete and autofill
                        }}
                      />
                    )}
                  />
                )}

                {errors.supervisorPositionHasError && (
                  <div className="text-danger mt-2">
                    Supervisor is required{" "}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div
            className="elevated rounded p-3 mt-3"
            style={{
              backgroundColor: "#fafafa",
              border: "1px solid #17a2b8",
            }}
          >
            <div className="row">
              <div className="col-8 col-md-8 col-lg-8">
                <h6 className="mb-2">Minimum Qualification</h6>
              </div>
              <div className="col-4 col-md-4 col-lg-4">
                <Button
                  onClick={() => {
                    setShowQualificationForm(true);
                    setSelectedQualification(null);
                  }}
                  style={{
                    float: "right",
                    borderRadius: "8px",
                    height: "35px",
                    padding: theme.spacing(1.5, 1.5, 1.5, 1.5),
                    border: `1px solid rgb(7, 142, 206)`,
                    display: "flex",
                    color: "#fff",
                    alignItems: "center",
                    fontSize: ".75rem",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    textTransform: "initial",
                    backgroundColor: "rgb(7, 142, 206)",
                    "&:hover": {
                      backgroundColor: "#f0f2f5",
                    },
                  }}
                  size="md"
                  startIcon={<AddIcon />}
                >
                  Add
                </Button>
              </div>
            </div>
            <MinimumQualification position={position} />
            <AddOrUpdateQualificationDialag
              position={position}
              selectedQualification={selectedQualification}
              setIsEditing={setIsEditing}
              showQualificationForm={showQualificationForm}
              setShowQualificationForm={setShowQualificationForm}
              setSelectedQualification={setSelectedQualification}
              isEditing={isEditing}
            />
          </div>

          <div
            className="elevated rounded p-3 mt-3"
            style={{
              backgroundColor: "#fafafa",
              border: "1px solid #17a2b8",
            }}
          >
            <div className="row">
              <div className="col-8 col-md-8 col-lg-8">
                <h6 className="mb-2">Professional Certificates</h6>
              </div>
              <div className="col-4 col-md-4 col-lg-4">
                <Button
                  onClick={() => {
                    setShowProfessionalCertificateForm(true);
                  }}
                  style={{
                    float: "right",
                    borderRadius: "8px",
                    height: "35px",
                    padding: theme.spacing(1.5, 1.5, 1.5, 1.5),
                    border: `1px solid rgb(7, 142, 206)`,
                    display: "flex",
                    color: "#fff",
                    alignItems: "center",
                    fontSize: ".75rem",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    textTransform: "initial",
                    backgroundColor: "rgb(7, 142, 206)",
                    "&:hover": {
                      backgroundColor: "#f0f2f5",
                    },
                  }}
                  size="md"
                  startIcon={<AddIcon />}
                >
                  Add
                </Button>
              </div>
            </div>
            <ProfessionalCertificate position={position} />
            <AddProfessionalCertificateDialag
              position={position}
              showProfessionalCertificateForm={showProfessionalCertificateForm}
              setShowProfessionalCertificateForm={
                setShowProfessionalCertificateForm
              }
            />
          </div>

          <div
            className="elevated rounded p-3 mt-3"
            style={{
              backgroundColor: "#fafafa",
              border: "1px solid #17a2b8",
            }}
          >
            <div className="row">
              <div className="col-8 col-md-8 col-lg-8">
                <h6 className="mb-2">
                  Required Competencies and Key Technical Skills
                </h6>
              </div>
              <div className="col-4 col-md-4 col-lg-4">
                <Button
                  onClick={() => {
                    setShowPositionKnowledgeForm(true);
                  }}
                  style={{
                    float: "right",
                    borderRadius: "8px",
                    height: "35px",
                    padding: theme.spacing(1.5, 1.5, 1.5, 1.5),
                    border: `1px solid rgb(7, 142, 206)`,
                    display: "flex",
                    color: "#fff",
                    alignItems: "center",
                    fontSize: ".75rem",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    textTransform: "initial",
                    backgroundColor: "rgb(7, 142, 206)",
                    "&:hover": {
                      backgroundColor: "#f0f2f5",
                    },
                  }}
                  size="md"
                  startIcon={<AddIcon />}
                >
                  Add
                </Button>
              </div>
            </div>
            <PositionKnowledge position={position} />

            <AddPositionKnowledgDialag
              position={position}
              showPositionKnowledgeForm={showPositionKnowledgeForm}
              setShowPositionKnowledgeForm={setShowPositionKnowledgeForm}
            />
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
  employeeGroups,
  hiringModes,
  supervisorPositions,
}) => {
  return {
    loading,
    employeeGroups,
    hiringModes,
    supervisorPositions,
  };
};
export default connect(mapStateToProps, {
  getEmployeeGroups,
  getHiringModes,
  getSupervisorPositions,
  updatePosition,
})(UpdatePositionDialog);
