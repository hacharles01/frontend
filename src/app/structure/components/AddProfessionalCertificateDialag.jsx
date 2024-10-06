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
import {
  getCertificateTypes,
  getProfessionalCertificateTypes,
  saveProfessionalCertificate,
} from "../../../store/structure/actions";
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

const AddProfessionalCertificateDialag = (props) => {
  const {
    loading,
    position,
    certificateTypes,
    professionalCertificateTypes,
    showProfessionalCertificateForm,
    setShowProfessionalCertificateForm,
    getCertificateTypes,
    getProfessionalCertificateTypes,
    saveProfessionalCertificate,
  } = props;

  const [formData, setFormData] = useState({
    certificateTypeId: null,
    experience: null,
    professionalCertificateTypeId: null,
    positionId: position.id,
    professionalCertificateType: null,
  });
  const [certificateType, setCertificateType] = useState(null);
  const [experience, setExperience] = useState(null);
  const [professionalCertificateType, setProfessionalCertificateType] =
    useState(null);

  const [errors, setErrors] = useState({
    certificateTypeHasError: false,
    experienceHasError: false,
    professionalCertificateTypeHasError: false,
  });

  useEffect(
    () => {
      getCertificateTypes();

    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const formValidator = () => {
    const error = {
      certificateTypeHasError: false,
      experienceHasError: false,
      hasError: false,
    };

    if (!formData.certificateTypeId) {
      error.certificateTypeHasError = true;
      error.hasError = true;
    }

    if (!formData.professionalCertificateTypeId) {
      error.professionalCertificateTypeHasError = true;
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
      formData.professionalCertificate = professionalCertificateType.name;

      saveProfessionalCertificate(
        formData,
        setFormData,
        setShowProfessionalCertificateForm
      );
    }
  };

  const onClose = () => {
    setFormData({
      certificateTypeId: null,
      experience: null,
      professionalCertificateTypeId: null,
      positionId: position.id,
      professionalCertificateType: null,
    });

    setShowProfessionalCertificateForm(false);
    setCertificateType(null);
    setExperience(null);
    setProfessionalCertificateType(null);
  };

  return (
    <>
      <Dialog
        onClose={onClose}
        aria-labelledby="customized-dialog-title"
        open={showProfessionalCertificateForm}
        fullWidth
      >
        <DialogTitle className="text-primary">
          <Typography variant="overline" display="block">
            Add New Professional Certificate
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
          {!!certificateTypes.length && (
            <Autocomplete
              size="small"
              id="certificateType"
              defaultValue={null}
              value={certificateType || null}
              options={certificateTypes}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              onChange={(event, certificateType) => {
                setCertificateType(certificateType || null);
                const certificateTypeId = certificateType.id;
                setProfessionalCertificateType(null);
                getProfessionalCertificateTypes(certificateTypeId);
                setFormData({ ...formData, certificateTypeId });
              }}
              getOptionLabel={(option) => option.name}
              renderOption={(props, certificateType) => (
                <Box component="li" {...props}>
                  {certificateType.name}
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Category"
                  inputProps={{
                    ...params.inputProps,
                  }}
                />
              )}
            />
          )}
          {errors.certificateTypeHasError && (
            <div className="text-danger mb-2">Category is required </div>
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
            <div className="text-danger mb-2">
              Working Experience is required{" "}
            </div>
          )}

          {!!professionalCertificateTypes.length && (
            <Autocomplete
              size="small"
              className="mt-3"
              id="professionalCertificateType"
              defaultValue={null}
              value={professionalCertificateType || null}
              options={professionalCertificateTypes}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              onChange={(event, professionalCertificateType) => {
                setProfessionalCertificateType(
                  professionalCertificateType || null
                );
                const professionalCertificateTypeId =
                  professionalCertificateType.id;
                setFormData({ ...formData, professionalCertificateTypeId });
              }}
              getOptionLabel={(option) => option.name}
              renderOption={(props, professionalCertificateType) => (
                <Box component="li" {...props}>
                  {professionalCertificateType.name}
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Certificates"
                  inputProps={{
                    ...params.inputProps,
                  }}
                />
              )}
            />
          )}
          {errors.professionalCertificateTypeHasError && (
            <div className="text-danger mb-2">Certificate is required </div>
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

const mapStateToProps = ({
  loading,
  certificateTypes,
  professionalCertificateTypes,
}) => {
  return {
    loading,
    certificateTypes,
    professionalCertificateTypes,
  };
};
export default connect(mapStateToProps, {
  getCertificateTypes,
  getProfessionalCertificateTypes,
  saveProfessionalCertificate,
})(AddProfessionalCertificateDialag);
