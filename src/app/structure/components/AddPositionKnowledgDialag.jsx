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
  getknowledge,
  savePositionKnowledge,
} from "../../../store/structure/actions";
import { showError } from "../../../app/toastify";

const AddPositionKnowledgDialag = (props) => {
  const {
    loading,
    position,
    knowledges,
    showPositionKnowledgeForm,
    setShowPositionKnowledgeForm,
    getknowledge,
    savePositionKnowledge,
  } = props;

  const [formData, setFormData] = useState({
    knowledgeId: null,
    positionId: position.id,
    knowledgeName: null,
  });
  const [knowledge, setKnowledge] = useState(null);

  const [errors, setErrors] = useState({
    knowledgeHasError: false,
  });

  useEffect(
    () => {
      getknowledge();
      setKnowledge(null);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const formValidator = () => {
    const error = {
      knowledgeHasError: false,
      hasError: false,
    };

    if (!formData.knowledgeId) {
      error.knowledgeHasError = true;
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
      formData.knowledgeName = knowledge.name;

      savePositionKnowledge(
        formData,
        setFormData,
        setShowPositionKnowledgeForm
      );
    }
  };

  const onClose = () => {
    setFormData({
      knowledgeId: null,
      positionId: position.id,
      knowledgeName: null,
    });

    setShowPositionKnowledgeForm(false);
    setKnowledge(null);
  };

  return (
    <>
      <Dialog
        onClose={onClose}
        aria-labelledby="customized-dialog-title"
        open={showPositionKnowledgeForm}
        fullWidth
      >
        <DialogTitle className="text-primary">
          <Typography variant="overline" display="block">
            Add New Competencies and Key Technical Skills
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
          {!!knowledges.length && (
            <Autocomplete
              size="small"
              id="knowledge"
              defaultValue={null}
              value={knowledge || null}
              options={knowledges}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              onChange={(event, knowledge) => {
                setKnowledge(knowledge || null);
                if (knowledge) {
                  const knowledgeId = knowledge.id;
                  setFormData({ ...formData, knowledgeId });
                }
              }}
              getOptionLabel={(option) => option.name}
              renderOption={(props, knowledge) => (
                <Box component="li" {...props}>
                  {knowledge.name}
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Required Competencies and Key Technical Skills"
                  inputProps={{
                    ...params.inputProps,
                  }}
                />
              )}
            />
          )}
          {errors.knowledgeHasError && (
            <div className="text-danger mb-2">
              Competencies and Key Technical Skills is required{" "}
            </div>
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

const mapStateToProps = ({ loading, knowledges }) => {
  return {
    loading,
    knowledges
  };
};
export default connect(mapStateToProps, {
  getknowledge,
  savePositionKnowledge,
})(AddPositionKnowledgDialag);
