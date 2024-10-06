import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Autocomplete,
  Box,
} from "@mui/material";

import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { getDegrees,getDegreeQualifications,saveOrUpdateQualification } from "../../../store/structure/actions";
import { showError } from "../../../app/toastify";

const experiences = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
  "15",
];

const AddOrUpdateQualificationDialag = (props) => {
  const {
    loading,
    isEditing,
    position,
    setIsEditing,
    degrees,
    degreeQualifications,
    showQualificationForm,
    setShowQualificationForm,
    setSelectedQualification,
    selectedQualification,
    getDegrees,
    getDegreeQualifications,
    saveOrUpdateQualification,
  } = props;

  const [formData, setFormData] = useState({
    degreeId: null,
    experience: null,
    qualificationId: null,
    positionId: position.id,
    degree:null,
    qualification:null
  });
  const [degree, setDegree] = useState(null);
  const [experience, setExperience] = useState(null);
  const [qualification, setQualification] = useState(null);
  

  const [errors, setErrors] = useState({
    degreeHasError: false,
    experienceHasError: false,
    qualificationHasError: false,
  });

  useEffect(
    () => {
      getDegrees();
      getDegreeQualifications(selectedQualification?selectedQualification.degreeId:'001');
      if (isEditing){
          setFormData({
            degreeId: selectedQualification.degreeId,
            experience: selectedQualification.experience.toString(),
            qualificationId: selectedQualification.qualificationId,
            positionId: position.id,
            degree:selectedQualification.degree,
            qualification:selectedQualification.qualification 
           });
      }
      else
        setFormData({
          degreeId: null,
          experience: null,
          qualificationId: null,
          positionId: position.id,
          degree:null,
          qualification:null
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedQualification, position, isEditing]
  );

  useEffect(
    () => {
      if (isEditing) {
        const degree = degrees.find(({ id }) => id === formData.degreeId);
        setDegree(degree);

        const experience = experiences.find(
          (experience) => experience === formData.experience
        );
        setExperience(experience);

        const qualification = degreeQualifications.find(
          ({id}) => id === formData.qualificationId
        );
        setQualification(qualification || null);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [degrees, experiences,degreeQualifications, formData, isEditing]
  );

  const formValidator = () => {
    const error = {
      degreeHasError: false,
      experienceHasError: false,
      hasError: false,
    };

    if (!formData.degreeId) {
      error.degreeHasError = true;
      error.hasError = true;
    }

    if (!formData.qualificationId) {
      error.qualificationHasError = true;
      error.hasError = true;
    }

    if (!formData.experience) {
      error.experienceHasError = true;
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

      formData.degree=degree.name;
      formData.qualification=qualification.name;
     
          saveOrUpdateQualification(
            formData,
            setFormData,
            setIsEditing,
            setShowQualificationForm,
            setSelectedQualification,
            isEditing
          );
    }
  };

  const onClose = () => {

    setFormData({
      degreeId: null,
      experience: null,
      qualificationId: null,
      positionId: position.id,
      degree:null,
      qualification:null
    });

    setShowQualificationForm(false);
    setIsEditing(false);
    setSelectedQualification(null);
    setDegree(null);
    setExperience(null);
    setQualification(null);
   
  };

  return (
    <>
      <Dialog
        onClose={onClose}
        aria-labelledby="customized-dialog-title"
        open={showQualificationForm}
        fullWidth
      >
        <DialogTitle className="text-primary">
          <Typography variant="overline" display="block">
            {isEditing ? "Edit Qualification" : "Add New Qualification"}{" "}
            {selectedQualification && (
              <strong> ( {selectedQualification.qualification} ) </strong>
            )}
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
          {!!degrees.length && (
            <Autocomplete
              size="small"
              id="degree"
              defaultValue={null}
              value={degree || null}
              options={degrees}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              onChange={(event, degree) => {
                setDegree(degree || null);
                const degreeId = degree.id;
                setQualification(null);
                getDegreeQualifications(degreeId);
                setFormData({ ...formData, degreeId });
               
              }}
              getOptionLabel={(option) => option.name}
              renderOption={(props, degree) => (
                <Box component="li" {...props}>
                  {degree.name}
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Degree"
                  inputProps={{
                    ...params.inputProps,
                  }}
                />
              )}
            />
          )}
          {errors.degreeHasError && (
            <div className="text-danger mb-2">Degree is required </div>
          )}

          {!!experiences.length && (
            <Autocomplete
              className="mt-3"
              size="small"
              id="experience"
              defaultValue={null}
              value={experience || null}
              options={experiences}
              isOptionEqualToValue={(option, value) => option === value}
              onChange={(event, experience) => {
                setExperience(experience || null);
                setFormData({ ...formData, experience });
              }}
              getOptionLabel={(option) => option + " Year(s)"}
              renderOption={(props, experience) => (
                <Box component="li" {...props}>
                  {experience} Year(s)
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Working Experience"
                  inputProps={{
                    ...params.inputProps,
                  }}
                />
              )}
            />
          )}
          {errors.experienceHasError && (
            <div className="text-danger mb-2">Working Experience is required </div>
          )}

          {!!degreeQualifications.length && (
               <Autocomplete
               size="small"
               className="mt-3"
               id="qualification"
               defaultValue={null}
               value={qualification || null}
               options={degreeQualifications}
               isOptionEqualToValue={(option, value) => option.id === value.id}
               onChange={(event, qualification) => {
                 setQualification(qualification || null);
                 const qualificationId = qualification.id;
                 setFormData({ ...formData, qualificationId });
               }}
               getOptionLabel={(option) => option.name}
               renderOption={(props, qualification) => (
                 <Box component="li" {...props}>
                   {qualification.name}
                 </Box>
               )}
               renderInput={(params) => (
                 <TextField
                   {...params}
                   label="Qualification"
                   inputProps={{
                     ...params.inputProps,
                   }}
                 />
               )}
             />
          )}
          {errors.qualificationHasError && (
            <div className="text-danger mb-2">Qualification is required </div>
          )}
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

const mapStateToProps = ({ loading, degrees,degreeQualifications }) => {
  return {
    loading,
    degrees,
    degreeQualifications,
  };
};
export default connect(mapStateToProps, {
  getDegrees,
  getDegreeQualifications,
  saveOrUpdateQualification
})(AddOrUpdateQualificationDialag);
