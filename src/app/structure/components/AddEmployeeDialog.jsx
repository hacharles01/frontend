import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  Box,
  Autocomplete,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { getNationalIdDetail } from "../../../store/structure/actions";
import { showError } from "../../../app/toastify";
import MaskedInput from "react-text-mask";

const AddEmployeeDialog = (props) => {
  const {
    loading,
    user,
    showEmployeeForm,
    setShowEmployeeForm,
    nationalIdDetail,
    getNationalIdDetail,
  } = props;

  const [employeeForm, setEmployeeForm] = useState({
    idNumber: "",
    lastName: "",
    firstName: "",
    civilStatus: "",
    countryBirth: "",
    gender: "",
    fatherName: "",
    motherName: "",
    birthDate: "",
    birthPlace: "",
    photo:""
  });

  const [errors, setErrors] = useState({
    idNumberHasError: false,
  });

  useEffect(
    () => {
      if (nationalIdDetail) {
      
        setEmployeeForm({
          idNumber: nationalIdDetail.documentNumber,
          lastName: nationalIdDetail.surnames,
          firstName: nationalIdDetail.foreName,
          civilStatus: nationalIdDetail.maritalStatus,
          countryBirth: nationalIdDetail.countryOfBirth,
          gender: nationalIdDetail.sex,
          fatherName: nationalIdDetail.fatherNames,
          motherName: nationalIdDetail.motherNames,
          birthDate: nationalIdDetail.motherNames,
          birthPlace: nationalIdDetail.placeOfBirth,
          photo:nationalIdDetail.photo
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [nationalIdDetail]
  );

  const onSave = () => {};

  const onClose = () => {
    setShowEmployeeForm(false);
    setEmployeeForm({});
  };

  return (
    <>
      <Dialog
        onClose={onClose}
        aria-labelledby="customized-dialog-title"
        open={showEmployeeForm}
        fullWidth={true}
        maxWidth={"lg"}
      >
        <DialogTitle className="text-primary">
          <Typography variant="overline" display="block">
            Add New Employee
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
            className="elevated rounded p-3 mt-3"
            style={{
              backgroundColor: "#fafafa",
              border: "1px solid #17a2b8",
            }}
          >
            <div className="row">
              <div className="col-12 text-left">
                <h6 className="mb-2">Personal Information</h6>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-sm-2 col-xs-12 col-md-2 col-lg-2 justify-content-center  text-center">
                <div
                  className="mt-0 rounded"
                  style={{
                    border: "1px solid #a6d3df",
                    minHeight: "140px",
                    overflow: "hidden",
                  }}
                >
                  { nationalIdDetail &&  <img
                        src={'data:image/jpg;base64,' + nationalIdDetail.photo}
                        width="100%"
                      /> }
                </div>

                <label className="text-center" style={{ fontSize: "10px" }}>
                  Profile Picture
                </label>
              </div>

              <div className="col-sm-5 col-xs-12 col-md-5 col-lg-5 justify-content-center">
              <SearchIcon className="searchIcon" />
                <MaskedInput
                  mask={[
                    /[1-3]/,
                    " ",
                    /[1-2]/,
                    /[0|9]/,
                    /\d/,
                    /\d/,
                    " ",
                    /[7-8]/,
                    " ",
                    /\d/,
                    /\d/,
                    /\d/,
                    /\d/,
                    /\d/,
                    /\d/,
                    /\d/,
                    " ",
                    /\d/,
                    " ",
                    /\d/,
                    /\d/,
                  ]}
                  className="form-control mb-3"
                  placeholder="Search ID Number"
                  guide={false}
                  id="my-input-id"
                  onBlur={(e) => {
                    
                  }}
                  onChange={(e) => {
                    const idLength = e.target.value.length;
                    if(idLength === 21){
                      getNationalIdDetail(e.target.value);
                    }
                  }}
                />
                

                {errors.idNumberHasError && (
                  <div className="text-danger mb-2">ID Number is required </div>
                )}

                <TextField
                  fullWidth
                  size="small"
                  rows={4}
                  name="lastName"
                  disabled={true}
                  autoFocus
                  label="Last Name"
                  style={{
                    backgroundColor: "#e9ecef",
                    border: "1px solid #e9ecef",
                    borderRadius: "5px",
                  }}
                  variant="outlined"
                  className="mb-3"
                  value={employeeForm.lastName}
                  onChange={(e) => {
                    const lastName = e.target.value;
                    setEmployeeForm({ ...employeeForm, lastName });
                  }}
                />

                <TextField
                  fullWidth
                  size="small"
                  rows={4}
                  name="firstName"
                  disabled={true}
                  autoFocus
                  label="First Name"
                  style={{
                    backgroundColor: "#e9ecef",
                    border: "1px solid #e9ecef",
                    borderRadius: "5px",
                  }}
                  variant="outlined"
                  className="mb-3"
                  value={employeeForm.firstName}
                  onChange={(e) => {
                    const firstName = e.target.value;
                    setEmployeeForm({ ...employeeForm, firstName });
                  }}
                />

                <TextField
                  fullWidth
                  size="small"
                  rows={4}
                  name="civilStatus"
                  disabled={true}
                  autoFocus
                  label="Civil Status"
                  style={{
                    backgroundColor: "#e9ecef",
                    border: "1px solid #e9ecef",
                    borderRadius: "5px",
                  }}
                  variant="outlined"
                  className="mb-3"
                  value={employeeForm.civilStatus}
                  onChange={(e) => {
                    const civilStatus = e.target.value;
                    setEmployeeForm({ ...employeeForm, civilStatus });
                  }}
                />

                <TextField
                  fullWidth
                  size="small"
                  rows={4}
                  name="gender"
                  disabled={true}
                  autoFocus
                  label="Gender"
                  style={{
                    backgroundColor: "#e9ecef",
                    border: "1px solid #e9ecef",
                    borderRadius: "5px",
                    color:'#000!important'
                  }}
                  variant="outlined"
                  className="mb-3 font-weight-bold"
                  value={employeeForm.gender}
                  onChange={(e) => {
                    const gender = e.target.value;
                    setEmployeeForm({ ...employeeForm, gender });
                  }}
                />
              </div>

              <div className="col-sm-5 col-xs-12 col-md-5 col-lg-5 justify-content-center  text-center">
                <TextField
                  fullWidth
                  size="small"
                  rows={4}
                  name="fatherName"
                  value={employeeForm.fatherName}
                  disabled={true}
                  autoFocus
                  label="Father Name"
                  style={{
                    backgroundColor: "#e9ecef",
                    border: "1px solid #e9ecef",
                    borderRadius: "5px",
                  }}
                  variant="outlined"
                  className="mb-3"
                  onChange={(e) => {
                    const fatherName = e.target.value;
                    setEmployeeForm({ ...employeeForm, fatherName });
                  }}
                />

                <TextField
                  fullWidth
                  size="small"
                  rows={4}
                  name="motherName"
                  value={employeeForm.motherName}
                  disabled={true}
                  autoFocus
                  label="Mother Name"
                  style={{
                    backgroundColor: "#e9ecef",
                    border: "1px solid #e9ecef",
                    borderRadius: "5px",
                  }}
                  variant="outlined"
                  className="mb-3"
                  onChange={(e) => {
                    const motherName = e.target.value;
                    setEmployeeForm({ ...employeeForm, motherName });
                  }}
                />

                <TextField
                  fullWidth
                  size="small"
                  rows={4}
                  name="countryBirth"
                  value={employeeForm.countryBirth}
                  disabled={true}
                  autoFocus
                  label="Country of Birth"
                  style={{
                    backgroundColor: "#e9ecef",
                    border: "1px solid #e9ecef",
                    borderRadius: "5px",
                  }}
                  variant="outlined"
                  className="mb-3"
                  onChange={(e) => {
                    const countryBirth = e.target.value;
                    setEmployeeForm({ ...employeeForm, countryBirth });
                  }}
                />

                <TextField
                  fullWidth
                  size="small"
                  rows={4}
                  name="birthDate"
                  value={employeeForm.birthDate}
                  disabled={true}
                  autoFocus
                  label="Birth Date"
                  style={{
                    backgroundColor: "#e9ecef",
                    border: "1px solid #e9ecef",
                    borderRadius: "5px",
                  }}
                  variant="outlined"
                  className="mb-3"
                  onChange={(e) => {
                    const birthDate = e.target.value;
                    setEmployeeForm({ ...employeeForm, birthDate });
                  }}
                />

                <TextField
                  fullWidth
                  size="small"
                  rows={4}
                  name="birthPlace"
                  value={employeeForm.birthPlace}
                  disabled={true}
                  autoFocus
                  label="Place of Birth"
                  style={{
                    backgroundColor: "#e9ecef",
                    border: "1px solid #e9ecef",
                    borderRadius: "5px",
                  }}
                  variant="outlined"
                  className="mb-3"
                  onChange={(e) => {
                    const birthPlace = e.target.value;
                    setEmployeeForm({ ...employeeForm, birthPlace });
                  }}
                />
              </div>
            </div>
          </div>
        </DialogContent>
       {nationalIdDetail &&
       <DialogActions className="d-flex justify-content-center py-4">
       <button
         onClick={onSave}
         type="button"
         className="btn btn-primary text-uppercase  px-4"
         disabled={loading}
       >
         {loading ? "Wait..." : "Save"}
       </button>
     </DialogActions>} 
      </Dialog>
    </>
  );
};

const mapStateToProps = ({ loading, nationalIdDetail }) => {
  return {
    loading,
    nationalIdDetail,
  };
};
export default connect(mapStateToProps, { getNationalIdDetail })(
  AddEmployeeDialog
);
