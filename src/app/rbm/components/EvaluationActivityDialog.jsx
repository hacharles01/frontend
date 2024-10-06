import {
  Tooltip,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  Divider,
  FormControlLabel,
  Radio,
  FormLabel,
  RadioGroup,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import React, { useState } from "react";
import { connect } from "react-redux";
import {
  evaluateSubmission,
  removeEvaluation,
  removeSubmission,
  submitActivityReport,
  downloadActivityReportFile,
} from "../../../store/rbm/actions";

import ConfirmationDialog from "./ConfirmationDialog";

import moment from "moment";

import { showError } from "../../toastify";

const EvaluationActivityDialog = (props) => {
  const location = useLocation();

  const {
    selectedActivity,
    open,
    setOpen,
    loading,
    // submissions,
    evaluateSubmission,
    removeEvaluation,
    removeSubmission,
    user,
    submitActivityReport,
    downloadActivityReportFile,
    isChild,
    subordinates,
  } = props;
  const [confirm, setConfirm] = useState(false);
  const [evaluationFormData, setEvaluationFormData] = useState({
    submissionId: "",
    accepted: false,
    description: "",
    quality: null,
  });

  const onClose = () => {
    setEvaluationFormData({
      submissionId: "",
      accepted: false,
      description: "",
      quality: null,
    });
    setOpen(false);
  };

  const onSave = () => {
    evaluateSubmission(
      evaluationFormData,
      setConfirm,
      setEvaluationFormData,
      selectedActivity
    );
  };

  const [confirmRemoveEvaluation, setConfirmRemoveEvaluation] = useState(false);
  const [evaluationToBeRemoved, setEvaluationToBeRemoved] = useState(null);

  const [confirmRemoveSubmission, setConfirmRemoveSubmission] = useState(false);
  const [submissionToBeRemoved, setSubmissionToBeRemoved] = useState(null);

  const iAmAssigned = () => {
    if (
      !!selectedActivity &&
      !!selectedActivity.assignments &&
      selectedActivity.assignments.findIndex(
        ({ id }) => id === user.employeeId
      ) >= 0
    )
      return true;
    else return false;
  };

  return (
    <>
      <Dialog
        fullWidth
        maxWidth="sm"
        onClose={onClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle className="text-primary pb-0 mb-0 bg-light">
          Activity reports
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
          <Typography variant="subtitle1" gutterBottom component="div">
            <small className="text-dark d-block">{selectedActivity.name}</small>
            <Tooltip title="Activity target share">
              <small
                className=" align-items-center  mr-1 text-info"
                style={{
                  cursor: "default",
                }}
              >
                Target share: {selectedActivity.targetShare}{" "}
                {selectedActivity.measurementUnit}
              </small>
            </Tooltip>
            <small className="text-dark">
              {"| "}
              Planned from:
              <span className="text-info">
                {moment(selectedActivity.startOn).format("ll")}
              </span>{" "}
              {">"} To:
              <span className="text-info">
                {moment(
                  location.pathname === "/rbm/my-activities"
                    ? selectedActivity.endOn
                    : selectedActivity.supervisorEndOn
                ).format("ll")}
              </span>
            </small>
          </Typography>
          <Divider />
        </DialogTitle>
        <DialogContent>
          {(!selectedActivity.submissions ||
            (!!selectedActivity.submissions &&
              !!!selectedActivity.submissions[0])) && (
            <div className="alert alert-danger text-center" role="alert">
              No report found
            </div>
          )}

          {!!selectedActivity.submissions &&
            !!selectedActivity.submissions[0] &&
            selectedActivity.submissions.map((submission, index) => (
              <Card
                key={submission.id}
                variant="outlined"
                className="p-3 border border-info "
              >
                <div className="row justify-content-start mb-3">
                  <div className="col-11 text-info">
                    <small>
                      {moment(submission.createdOn).format("lll")} {"by"}{" "}
                      {!!submission.submittedBy && (
                        <>
                          <span className="d-none d-md-inline">
                            {submission.submittedBy.lastName}{" "}
                          </span>
                          {submission.submittedBy.firstName}
                        </>
                      )}
                      {!!!submission.submittedBy && (
                        <>
                          <span className="d-none d-md-inline">Anonymous</span>
                        </>
                      )}
                    </small>
                    <Card
                      variant="outlined"
                      className="rounded-left-bottom"
                      style={{ backgroundColor: "#f6f8fa" }}
                    >
                      <CardContent className=" pt-2 pb-2">
                        <div className="text-right">
                          {(!submission.submittedBy ||
                            (!!submission.submittedBy &&
                              user.employeeId === submission.submittedBy.id)) &&
                            location.pathname === "/rbm/my-activities" && (
                              <IconButton
                                disabled={!!submission.evaluation}
                                size="small"
                                color="error"
                                onClick={() => {
                                  setSubmissionToBeRemoved(submission.id);
                                  setConfirmRemoveSubmission(true);
                                }}
                              >
                                <span className="material-icons ">
                                  remove_circle_outline
                                </span>
                              </IconButton>
                            )}
                        </div>
                        <TextField
                          fullWidth
                          size="small"
                          multiline
                          rows={3}
                          name="name"
                          disabled
                          label="Employee message"
                          variant="standard"
                          value={submission.description}
                        />
                        {selectedActivity.targetShare > 0 && (
                          <span
                            className="badge badge-light mb-2"
                            style={{ backgroundColor: "transparent" }}
                          >
                            {submission.achievedTarget}{" "}
                            {selectedActivity.measurementUnit} completed
                          </span>
                        )}
                        {selectedActivity.targetShare === 0 && (
                          <>
                            {submission.completed && (
                              <span className="badge badge-success ">
                                Completed
                              </span>
                            )}
                            {!submission.completed && (
                              <span className=" badge badge-danger">
                                Not completed
                              </span>
                            )}
                          </>
                        )}
                        {!!submission.fileName && (
                          <Button
                            onClick={() =>
                              downloadActivityReportFile(submission)
                            }
                            size="small"
                            className="float-right"
                          >
                            <span className="material-icons">download</span>
                            Download file{" "}
                            <span className="text-danger ml-1 text-lowercase">
                              [
                              {
                                submission.fileName.split(".")[
                                  submission.fileName.split(".").length - 1
                                ]
                              }
                              ]
                            </span>
                          </Button>
                        )}
                        {!!!submission.fileName && (
                          <span className="float-right  badge badge-warning">
                            No file attached
                          </span>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
                {submission.evaluation && (
                  <div className="row justify-content-end mt-2">
                    <div className="col-11 text-right">
                      <small className="mr-4 text-info">
                        {moment(submission.evaluation.createdOn).format("lll")}{" "}
                        {"by"}{" "}
                        {!!submission.evaluation.evaluatedBy && (
                          <>
                            <span className="d-none d-md-inline">
                              {submission.evaluation.evaluatedBy.lastName}{" "}
                            </span>
                            {submission.evaluation.evaluatedBy.firstName}
                          </>
                        )}
                        {!!!submission.evaluation.evaluatedBy && (
                          <>
                            <span className="d-none d-md-inline">
                              Anonymous
                            </span>
                          </>
                        )}
                      </small>

                      <Card
                        variant="outlined"
                        className="rounded-right-bottom pb-2"
                        style={{ backgroundColor: "#e9ecef" }}
                      >
                        <CardContent>
                          <IconButton
                            onClick={() => {
                              setEvaluationToBeRemoved(submission.id);
                              setConfirmRemoveEvaluation(true);
                            }}
                            size="small"
                            color="error"
                          >
                            <span className="material-icons ">
                              remove_circle_outline
                            </span>
                          </IconButton>

                          <TextField
                            fullWidth
                            size="small"
                            disabled
                            multiline
                            rows={3}
                            name="name"
                            autoFocus
                            label="Supervisor comment"
                            variant="standard"
                            value={submission.evaluation.description}
                          />

                          {submission.evaluation.accepted && (
                            <div className="pb-2">
                              <span className="badge badge-success float-left mt-2 ">
                                <i className="fas fa-check-double"></i> Accepted
                              </span>
                              {!!submission.evaluation.qualityName && (
                                <span
                                  className={`badge float-right mt-2 badge-${
                                    +submission.evaluation.qualityValue === 0.95
                                      ? "success"
                                      : +submission.evaluation.qualityValue ===
                                        0.85
                                      ? "primary"
                                      : +submission.evaluation.qualityValue ===
                                        0.75
                                      ? "info"
                                      : +submission.evaluation.qualityValue ===
                                        0.6
                                      ? "warning"
                                      : "danger"
                                  }`}
                                >
                                  {submission.evaluation.qualityName} Quality
                                </span>
                              )}
                            </div>
                          )}
                          {!submission.evaluation.accepted && (
                            <span className="badge badge-danger float-left mt-2 ">
                              <i className="fas fa-times"></i> Rejected
                            </span>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}

                {(selectedActivity.status === "Reported" ||
                  selectedActivity.status === "Rejected") &&
                  !!!submission.evaluation && (
                    <>
                      {!iAmAssigned() && (
                        <div className="text-center">
                          <button
                            type="button"
                            onClick={() => {
                              setEvaluationFormData({
                                ...evaluationFormData,
                                accepted: true,
                                submissionId: submission.id,
                              });
                              setConfirm(true);
                            }}
                            className="btn btn-sm btn-success text-uppercase  px-4 mr-4"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => {
                              setEvaluationFormData({
                                ...evaluationFormData,
                                accepted: false,
                                submissionId: submission.id,
                              });
                              setConfirm(true);
                            }}
                            type="button"
                            className="btn  btn-sm btn-danger text-uppercase  px-4"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </>
                  )}
              </Card>
            ))}

          {!!selectedActivity.submissions &&
            !!selectedActivity.submissions[0] &&
            iAmAssigned() && (
              <div className="alert alert-danger text-center mt-1" role="alert">
                You cannot evaluate yourself
              </div>
            )}
        </DialogContent>
        <DialogActions className="d-flex justify-content-center pb-4"></DialogActions>
      </Dialog>

      <Dialog
        fullWidth
        maxWidth="xs"
        onClose={() => {
          setConfirm(false);
        }}
        open={confirm}
      >
        <DialogTitle className="text-dark">
          <span
            style={{ fontSize: "16px" }}
            className={`pr-4 text-${
              evaluationFormData.accepted ? "primary" : "danger"
            }`}
          >
            Are you sure to{" "}
            {evaluationFormData.accepted ? "accept " : "reject "} this report?
          </span>

          <IconButton
            aria-label="close"
            onClick={() => {
              setConfirm(false);
            }}
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
        <DialogContent className="pb-0">
          {evaluationFormData.accepted && (
            <FormControl fullWidth size="small" className="mt-2">
              <InputLabel id="demo-simple-select-label">
                Rank the quality of reported work
              </InputLabel>
              <Select
                size="small"
                value={evaluationFormData.quality}
                label="Rank the quality of reported work"
                onChange={(e) => {
                  const quality = e.target.value;
                  setEvaluationFormData({
                    ...evaluationFormData,
                    quality,
                  });
                }}
              >
                <MenuItem value={0.95}>Excellent(x0.95)</MenuItem>
                <MenuItem value={0.85}>Very Good(x0.85)</MenuItem>
                <MenuItem value={0.75}>Good(x0.75)</MenuItem>
                <MenuItem value={0.6}>Fair(x0.60)</MenuItem>
                <MenuItem value={0.4}>Poor(x0.40)</MenuItem>
              </Select>
            </FormControl>
          )}
          <TextField
            fullWidth
            size="small"
            multiline
            rows={5}
            name="description"
            autoFocus
            label="Motivate the ranking"
            className="mt-3"
            variant="outlined"
            onChange={(e) => {
              const description = e.target.value;
              setEvaluationFormData({
                ...evaluationFormData,
                description,
              });
            }}
          />
        </DialogContent>
        <DialogActions className="d-flex justify-content-center py-4">
          <button
            disabled={loading}
            onClick={onSave}
            type="button"
            className={`btn btn-sm btn-${
              evaluationFormData.accepted ? "success" : "danger"
            } text-uppercase  mr-3`}
          >
            {loading ? "Wait..." : "Yes, I confirm"}
          </button>
        </DialogActions>
      </Dialog>

      <ConfirmationDialog
        confirmationDialog={confirmRemoveEvaluation}
        message={`Are you sure you want to remove this evaluation?`}
        setConfirmationDialog={setConfirmRemoveEvaluation}
        onYes={() => {
          removeEvaluation(
            {
              submissionId: evaluationToBeRemoved,
            },
            selectedActivity,
            setConfirmRemoveEvaluation
          );
        }}
      />

      <ConfirmationDialog
        confirmationDialog={confirmRemoveSubmission}
        message={`Are you sure you want to remove this submission?`}
        setConfirmationDialog={setConfirmRemoveSubmission}
        onYes={() => {
          removeSubmission(
            {
              submissionId: submissionToBeRemoved,
            },
            selectedActivity,
            setConfirmRemoveSubmission
          );
        }}
      />
    </>
  );
};

const mapStateToProps = ({ loading, user, selectedActivity, subordinates }) => {
  return { loading, user, selectedActivity, subordinates };
};
export default connect(mapStateToProps, {
  evaluateSubmission,
  removeEvaluation,
  removeSubmission,
  downloadActivityReportFile,
  submitActivityReport,
})(EvaluationActivityDialog);
