import axios from "axios";
import download from "downloadjs";
import { showSuccess, showError } from "../../app/toastify";
import { setUser } from "../common/actions";
import rbmTypes from "./action-types";
import commonTypes from "../common/action-types";

const types = { ...commonTypes, ...rbmTypes };

export const getFiscalYears = () => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get("/api/rbm/fiscal-years");

      dispatch({ type: types.SET_FISCAL_YEARS, data });

      setUser(data);
    } catch (error) {
      dispatch({ type: types.END_LOADING });
      showError(error);
    }
  };
};

export const selectFiscalYear = (fiscalYear, history) => {
  return async (dispatch) => {
    try {
      await axios.post("/api/rbm/select-fiscal-year", {
        id: fiscalYear.id,
      });

      dispatch({
        type: types.SET_EXPECTED_RESULTS,
        data: [],
      });

      dispatch({
        type: types.SET_UNITY_INDICATORS,
        data: [],
      });

      dispatch({
        type: types.SET_MY_ACTIVITIES,
        data: [],
      });

      dispatch({
        type: types.SET_INSTITUTIONS_EVALUATIONS,
        data: [],
      });

      dispatch({
        type: types.SET_UNITS_EVALUATIONS,
        data: [],
      });

      dispatch({
        type: types.SET_EMPLOYEES_EVALUATIONS,
        data: [],
      });

      dispatch({
        type: types.SET_SELECTED_FISCAL_YEAR,
        data: { ...fiscalYear },
      });
      history.push("/rbm/expected-results");
    } catch (error) {
      showError(error);
    }
  };
};

export const getSelectedFiscalYear = () => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get("/api/rbm/selected-fiscal-year");

      dispatch({
        type: types.SET_SELECTED_FISCAL_YEAR,
        data,
      });
    } catch (error) {
      showError(error);
    }
  };
};

export const getUserEntities = () => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get("/api/rbm/user-entities");

      dispatch({ type: types.SET_USER_ENTITIES, data });

      setUser(data);
    } catch (error) {
      showError(error);
    }
  };
};

export const selectUserEntity = (userEntity, history, selectedFiscalYear) => {
  return async (dispatch) => {
    try {
      await axios.post("/api/rbm/select-user-entity", {
        id: userEntity.id,
      });

      await axios.post("/api/rbm/select-fiscal-year", {
        id: selectedFiscalYear.id,
      });

      dispatch({
        type: types.SET_EXPECTED_RESULTS,
        data: [],
      });

      dispatch({
        type: types.SET_SELECTED_USER_ENTITY,
        data: { ...userEntity },
      });

      history.push("/rbm/expected-results");
    } catch (error) {
      showError(error);
    }
  };
};

export const getSelectedUserEntity = () => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get("/api/rbm/selected-user-entity");

      dispatch({
        type: types.SET_SELECTED_USER_ENTITY,
        data,
      });
    } catch (error) {
      showError(error);
    }
  };
};

export const getExpectedResults = (history) => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.START_LOADING });

      dispatch({
        type: types.SET_EXPECTED_RESULTS,
        data: [],
      });

      const { data } = await axios.get("/api/rbm/expected-results");

      dispatch({
        type: types.SET_EXPECTED_RESULTS,
        data,
      });

      dispatch({
        type: types.SET_SELECTED_EXPECTED_RESULT,
        data: {},
      });

      dispatch({ type: types.END_LOADING });

      history.push("/rbm/expected-results");
    } catch (error) {
      dispatch({ type: types.END_LOADING });
      showError(error);
    }
  };
};

export const saveExpectedResult = (
  expectedResult,
  setFormData,
  setIsEditing,
  closeExpectedResultForm
) => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.START_LOADING });

      const { data } = await axios.post(
        "/api/rbm/expected-results",
        expectedResult
      );

      dispatch({ type: types.END_LOADING });
      showSuccess("Saved successfully");

      closeExpectedResultForm();
      setIsEditing(false);

      setTimeout(() => {
        setFormData({
          id: null,
          reference: "",
          name: "",
          weight: 0,
          budget: 0,
        });

        if (expectedResult.id)
          dispatch({
            type: types.UPDATE_EXPECTED_RESULT,
            data,
          });
        else
          dispatch({
            type: types.ADD_NEW_EXPECTED_RESULT,
            data,
          });
      }, 500);
    } catch (error) {
      dispatch({ type: types.END_LOADING });
      showError(error);
    }
  };
};

export const deleteExpectedResult = (id, setConfirmationDialog) => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.START_LOADING });

      const { data } = await axios.delete("/api/rbm/expected-results/" + id);

      setConfirmationDialog(false);
      dispatch({ type: types.END_LOADING });

      dispatch({
        type: types.DELETE_EXPECTED_RESULT,
        id,
      });
      showSuccess(data.message);
    } catch (error) {
      dispatch({ type: types.END_LOADING });
      showError(error);
    }
  };
};

export const getIndicators = (expectedResultId) => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.START_LOADING });

      const { data } = await axios.get(
        "/api/rbm/indicators/" + expectedResultId
      );

      dispatch({ type: types.END_LOADING });

      dispatch({
        type: types.SET_INDICATORS,
        data,
      });

      dispatch({
        type: types.SET_SELECTED_INDICATOR,
        data: {},
      });
    } catch (error) {
      dispatch({ type: types.END_LOADING });
      showError(error);
    }
  };
};

export const saveIndicator = (
  indicator,
  setFormData,
  setIsEditing,
  setShowIndicatorForm
) => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.START_LOADING });

      const { data } = await axios.post("/api/rbm/indicators", indicator);

      dispatch({ type: types.END_LOADING });
      showSuccess("Saved successfully");

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

      setShowIndicatorForm(false);
      setIsEditing(false);

      if (!!indicator.id)
        dispatch({
          type: types.UPDATE_INDICATOR,
          data: data.indicator,
        });
      else
        dispatch({
          type: types.ADD_NEW_INDICATOR,
          data: data.indicator,
        });

      dispatch({
        type: types.UPDATE_EXPECTED_RESULT,
        data: data.expectedResult,
      });
    } catch (error) {
      dispatch({ type: types.END_LOADING });
      showError(error);
    }
  };
};

export const deleteIndicator = (indicator, setConfirmationDialog) => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.START_LOADING });

      const { data } = await axios.delete(
        "/api/rbm/indicators/" + indicator.id
      );

      setConfirmationDialog(false);
      dispatch({ type: types.END_LOADING });

      dispatch({
        type: types.DELETE_INDICATOR,
        data: {
          id: indicator.id,
          expectedResultId: indicator.expectedResultId,
        },
      });

      dispatch({
        type: types.UPDATE_EXPECTED_RESULT,
        data: data.expectedResult,
      });

      showSuccess("Deleted successfully");
    } catch (error) {
      dispatch({ type: types.END_LOADING });
      showError(error);
    }
  };
};

export const approveIndicator = (id, approvalStatus, setConfirmationDialog) => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.START_LOADING });

      const { data } = await axios.put("/api/rbm/indicators/" + id, {
        approvalStatus,
      });

      setConfirmationDialog(false);
      dispatch({ type: types.END_LOADING });

      dispatch({
        type: types.UPDATE_INDICATOR,
        data: data.indicator,
      });

      dispatch({
        type: types.UPDATE_EXPECTED_RESULT,
        data: data.expectedResult,
      });

      showSuccess(approvalStatus ? "Approved" : "Disapproved");
    } catch (error) {
      dispatch({ type: types.END_LOADING });
      showError(error);
    }
  };
};

export const saveIndicatorAssignment = (assignmentData, pathname) => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.START_LOADING });

      const { data } = await axios.post(
        "/api/rbm/indicator-assignments",
        assignmentData
      );

      dispatch({ type: types.END_LOADING });

      dispatch({
        type: types.SET_SELECTED_INDICATOR,
        data: data.indicator,
      });

      dispatch({
        type: types.UPDATE_INDICATOR,
        data: data.indicator,
      });

      dispatch({
        type: types.UPDATE_EXPECTED_RESULT,
        data: data.expectedResult,
      });

      if (pathname !== "/rbm/unit-indicators")
        dispatch({
          type: types.SET_UNITY_INDICATORS,
          data: [],
        });

      showSuccess("Saved successfully");
    } catch (error) {
      dispatch({ type: types.END_LOADING });
      showError(error);
    }
  };
};

export const removeIndicatorAssignment = (
  { indicatorId, unitId },
  setConfirmRemoveAssignment,
  setFormData,
  setParentUnits,
  pathname
) => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.START_LOADING });

      const { data } = await axios.delete(
        "/api/rbm/indicator-assignments/" + indicatorId + "/" + unitId
      );

      setConfirmRemoveAssignment(false);
      setFormData({});
      setParentUnits([]);

      dispatch({ type: types.END_LOADING });

      dispatch({
        type: types.SET_SELECTED_INDICATOR,
        data: data.indicator,
      });

      dispatch({
        type: types.UPDATE_INDICATOR,
        data: data.indicator,
      });

      dispatch({
        type: types.UPDATE_EXPECTED_RESULT,
        data: data.expectedResult,
      });

      if (pathname !== "/rbm/unit-indicators")
        dispatch({
          type: types.SET_UNITY_INDICATORS,
          data: [],
        });

      showSuccess("Removed successfully");
    } catch (error) {
      dispatch({ type: types.END_LOADING });
      showError(error);
    }
  };
};

export const getIndicatorActivities = (indicatorId) => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.START_LOADING });

      dispatch({
        type: types.SET_INDICATOR_ACTIVITIES,
        data: [],
      });

      const { data } = await axios.get(
        "/api/rbm/quarter-activities/" + indicatorId
      );

      dispatch({ type: types.END_LOADING });

      dispatch({
        type: types.SET_INDICATOR_ACTIVITIES,
        data,
      });
    } catch (error) {
      dispatch({ type: types.END_LOADING });
      showError(error);
    }
  };
};

export const saveActivity = (
  activity,
  setFormData,
  setIsEditing,
  setShowActivityForm,
  quarter
) => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.START_LOADING });

      const { data } = await axios.post("/api/rbm/activities", activity);

      dispatch({ type: types.END_LOADING });
      showSuccess("Saved successfully");

      setFormData({
        id: null,
        name: "",
        weight: "",
        targetShare: "",
        startOn: quarter.startOn,
        endOn: quarter.endOn,
      });

      setShowActivityForm(false);
      setIsEditing(false);

      if (!!activity.id)
        dispatch({
          type: types.UPDATE_ACTIVITY,
          data: data.activity,
        });
      else
        dispatch({
          type: types.ADD_NEW_ACTIVITY,
          data: data.activity,
        });

      dispatch({
        type: types.UPDATE_INDICATOR,
        data: data.indicator,
      });

      dispatch({
        type: types.UPDATE_EXPECTED_RESULT,
        data: data.expectedResult,
      });
    } catch (error) {
      dispatch({ type: types.END_LOADING });
      showError(error);
    }
  };
};

export const deleteActivity = (activity, setConfirmationDialog) => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.START_LOADING });

      const { data } = await axios.delete("/api/rbm/activities/" + activity.id);

      dispatch({ type: types.END_LOADING });
      setConfirmationDialog(false);

      showSuccess("Deleted successfully");

      dispatch({
        type: types.DELETE_ACTIVITY,
        data: {
          expectedResultId: activity.expectedResultId,
          indicatorId: activity.indicatorId,
          quarterTargetId: activity.quarterTargetId,
          id: activity.id,
        },
      });

      dispatch({
        type: types.UPDATE_INDICATOR,
        data: data.indicator,
      });

      dispatch({
        type: types.UPDATE_EXPECTED_RESULT,
        data: data.expectedResult,
      });
    } catch (error) {
      dispatch({ type: types.END_LOADING });
      showError(error);
    }
  };
};

export const getSubordinates = () => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get("/api/rbm/subordinates");

      dispatch({
        type: types.SET_SUBORDINATES,
        data,
      });
    } catch (error) {
      showError(error);
    }
  };
};

export const saveActivityAssignment = (
  activity,
  assignmentData,
  setFormData
) => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.START_LOADING });

      const { data } = await axios.post(
        "/api/rbm/activity-assignments",
        assignmentData
      );

      setFormData(null);

      dispatch({ type: types.END_LOADING });

      dispatch({
        type: types.UPDATE_INDICATOR,
        data: data.indicator,
      });

      dispatch({
        type: types.UPDATE_EXPECTED_RESULT,
        data: data.expectedResult,
      });

      dispatch({
        type: types.ADD_ACTIVITY_ASSIGNMENT,
        data: { activity, assignment: data.assignment },
      });

      showSuccess("Saved successfully");
    } catch (error) {
      dispatch({ type: types.END_LOADING });
      showError(error);
    }
  };
};

export const removeActivityAssignment = (
  activity,
  { id },
  setConfirmRemoveAssignment,
  setFormData
) => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.START_LOADING });

      const { data } = await axios.delete(
        "/api/rbm/activity-assignments/" + id
      );

      setConfirmRemoveAssignment(false);
      setFormData(null);

      dispatch({ type: types.END_LOADING });

      dispatch({
        type: types.REMOVE_ACTIVITY_ASSIGNMENT,
        data: { activity, id },
      });

      dispatch({
        type: types.UPDATE_INDICATOR,
        data: data.indicator,
      });

      dispatch({
        type: types.UPDATE_EXPECTED_RESULT,
        data: data.expectedResult,
      });

      showSuccess("Removed successfully");
    } catch (error) {
      dispatch({ type: types.END_LOADING });
      showError(error);
    }
  };
};

export const evaluateSubmission = (
  { submissionId, accepted, description, quality },
  setConfirm,
  setFormData,
  selectedActivity
) => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.START_LOADING });

      const { data } = await axios.post("/api/rbm/submission-evaluations", {
        submissionId,
        accepted,
        description,
        quality,
      });

      dispatch({ type: types.END_LOADING });

      showSuccess(
        `${accepted ? "Submission accepted" : "Submission rejected"}`
      );

      setConfirm(false);
      setFormData({ submissionId: "", accepted: false, description: "" });

      dispatch({
        type: types.ADD_ACTIVITY_EVALUATION,
        data: { activity: data.activity, evaluation: data.evaluation },
      });

      dispatch({
        type: types.SET_SUBORDINATE_SCORES,
        data: data.subordnateScore,
      });

      dispatch({
        type: types.SET_SELECTED_ACTIVITY,
        data: {
          ...data.activity,
          assignments: selectedActivity.assignments,
          submissions: [
            { ...selectedActivity.submissions[0], evaluation: data.evaluation },
          ],
        },
      });

      dispatch({
        type: types.UPDATE_INDICATOR,
        data: data.indicator,
      });

      dispatch({
        type: types.UPDATE_EXPECTED_RESULT,
        data: data.expectedResult,
      });
    } catch (error) {
      dispatch({ type: types.END_LOADING });
      showError(error);
    }
  };
};

export const removeEvaluation = (
  { submissionId },
  selectedActivity,
  setConfirm
) => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.START_LOADING });

      const { data } = await axios.delete(
        "/api/rbm/submission-evaluations/" + submissionId
      );

      dispatch({ type: types.END_LOADING });

      showSuccess(`Evaluation removed`);

      setConfirm(false);

      dispatch({
        type: types.REMOVE_ACTIVITY_EVALUATION,
        data: { activity: data.activity, submissionId },
      });

      dispatch({
        type: types.SET_SUBORDINATE_SCORES,
        data: data.subordnateScore,
      });

      delete selectedActivity.submissions[0].evaluation;

      dispatch({
        type: types.SET_SELECTED_ACTIVITY,
        data: {
          ...data.activity,
          assignments: selectedActivity.assignments,
          submissions: [{ ...selectedActivity.submissions[0] }],
        },
      });

      dispatch({
        type: types.UPDATE_INDICATOR,
        data: data.indicator,
      });

      dispatch({
        type: types.UPDATE_EXPECTED_RESULT,
        data: data.expectedResult,
      });
    } catch (error) {
      dispatch({ type: types.END_LOADING });
      showError(error);
    }
  };
};

export const getUnityIndicators = (history) => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.START_LOADING });

      dispatch({
        type: types.SET_UNITY_INDICATORS,
        data: [],
      });

      const { data } = await axios.get("/api/rbm/unit-indicators");

      dispatch({
        type: types.SET_UNITY_INDICATORS,
        data,
      });

      dispatch({
        type: types.SET_SELECTED_INDICATOR,
        data: {},
      });

      dispatch({ type: types.END_LOADING });

      history.push("/rbm/unit-indicators");
    } catch (error) {
      dispatch({ type: types.END_LOADING });
      showError(error);
    }
  };
};

export const getMyActivities = (history) => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.START_LOADING });

      const { data } = await axios.get("/api/rbm/my-activities");

      dispatch({
        type: types.SET_MY_ACTIVITIES,
        data: data.myActivities,
      });

      dispatch({
        type: types.SET_MY_SCORES,
        data: data.myScores,
      });

      dispatch({
        type: types.SET_SELECTED_ACTIVITY,
        data: {},
      });

      dispatch({ type: types.END_LOADING });

      // history.push("/rbm/my-activities");
    } catch (error) {
      dispatch({ type: types.END_LOADING });
      showError(error);
    }
  };
};

export const publishScores = (quarterId) => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.START_LOADING });

      const { data } = await axios.post("/api/rbm/publish-scores/" + quarterId);

      dispatch({
        type: types.SET_MY_ACTIVITIES,
        data,
      });

      dispatch({
        type: types.SET_SELECTED_ACTIVITY,
        data: {},
      });

      dispatch({ type: types.END_LOADING });

      // history.push("/rbm/my-activities");
    } catch (error) {
      dispatch({ type: types.END_LOADING });
      showError(error);
    }
  };
};

export const getSubordinateActivities = (employeeId) => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.START_LOADING });

      dispatch({
        type: types.SET_SUBORDINATE_SCORES,
        data: {},
      });

      dispatch({
        type: types.SET_SUBORDINATE_ACTIVITIES,
        data: [],
      });

      const { data } = await axios.get(
        "/api/rbm/subordinate-activities/" + employeeId
      );

      dispatch({
        type: types.SET_SUBORDINATE_SCORES,
        data: data.subordnateScore,
      });

      dispatch({
        type: types.SET_SUBORDINATE_ACTIVITIES,
        data: data.subordnateActivities,
      });

      dispatch({
        type: types.SET_SELECTED_ACTIVITY,
        data: {},
      });

      dispatch({ type: types.END_LOADING });
    } catch (error) {
      dispatch({ type: types.END_LOADING });
      showError(error);
    }
  };
};

export const selectActivity = (
  activity,
  handleCloseMenu,
  setShowEvaluationDialog
) => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.START_LOADING });

      const { data } = await axios.get("/api/rbm/submissions/" + activity.id);

      dispatch({ type: types.END_LOADING });

      dispatch({
        type: types.SET_SELECTED_ACTIVITY,
        data: { ...activity, submissions: data },
      });

      handleCloseMenu();
      setShowEvaluationDialog(true);
    } catch (error) {
      dispatch({ type: types.END_LOADING });
      showError(error);
    }
  };
};

export const submitActivityReport = (
  activity,
  reportData,
  setReportFormData
) => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.START_LOADING });

      const { data } = await axios.post("/api/rbm/submissions", reportData);

      dispatch({ type: types.END_LOADING });

      setReportFormData({
        achievedTarget: "",
        completed: "",
        description: "",
        file: "",
      });

      dispatch({
        type: types.ADD_ACTIVITY_SUBMISSION,
        data: { activity: data.activity },
      });

      dispatch({
        type: types.SET_SELECTED_ACTIVITY,
        data: {
          ...data.activity,
          status: "Reported",
          submissions: [data.submission],
        },
      });

      dispatch({
        type: types.UPDATE_INDICATOR,
        data: data.indicator,
      });

      dispatch({
        type: types.UPDATE_EXPECTED_RESULT,
        data: data.expectedResult,
      });
    } catch (error) {
      dispatch({ type: types.END_LOADING });
      showError(error);
    }
  };
};

export const removeSubmission = (
  { submissionId },
  selectedActivity,
  setConfirm
) => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.START_LOADING });

      const { data } = await axios.delete(
        "/api/rbm/submissions/" + submissionId
      );

      dispatch({ type: types.END_LOADING });

      showSuccess(`submission removed`);

      setConfirm(false);

      dispatch({
        type: types.REMOVE_ACTIVITY_SUBMISSION,
        data: { activity: data.activity, id: submissionId },
      });

      dispatch({
        type: types.SET_SELECTED_ACTIVITY,
        data: {
          ...data.activity,
          status: data.activity.status,
          assignments: selectedActivity.assignments,
          submissions: [],
        },
      });

      dispatch({
        type: types.UPDATE_INDICATOR,
        data: data.indicator,
      });

      dispatch({
        type: types.UPDATE_EXPECTED_RESULT,
        data: data.expectedResult,
      });
    } catch (error) {
      dispatch({ type: types.END_LOADING });
      showError(error);
    }
  };
};

export const downloadActivityReportFile = (submission) => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.START_LOADING });

      const { data } = await axios.get(
        "/api/rbm/activity-reports-files/" + submission.fileName,
        { responseType: "blob" }
      );

      download(
        new Blob([data]),
        submission.originalFileName,
        submission.fileMimeType
      );

      dispatch({ type: types.END_LOADING });
    } catch (error) {
      dispatch({ type: types.END_LOADING });
      showError("File not found");
    }
  };
};

export const getInstitutionsEvaluations = () => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.START_LOADING });

      const { data } = await axios.get("/api/rbm/institutions-evaluations");

      dispatch({ type: types.END_LOADING });

      dispatch({
        type: types.SET_INSTITUTIONS_EVALUATIONS,
        data,
      });
    } catch (error) {
      dispatch({ type: types.END_LOADING });

      showError(error);
    }
  };
};

export const getUnitsEvaluations = () => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.START_LOADING });

      const { data } = await axios.get("/api/rbm/unit-evaluations");

      dispatch({ type: types.END_LOADING });

      dispatch({
        type: types.SET_UNITS_EVALUATIONS,
        data,
      });
    } catch (error) {
      dispatch({ type: types.END_LOADING });

      showError(error);
    }
  };
};

export const getEmployeesEvaluations = () => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.START_LOADING });

      const { data } = await axios.get("/api/rbm/employee-evaluations");

      dispatch({ type: types.END_LOADING });

      dispatch({
        type: types.SET_EMPLOYEES_EVALUATIONS,
        data,
      });
    } catch (error) {
      dispatch({ type: types.END_LOADING });

      showError(error);
    }
  };
};

export const getSubordinatesEvaluations = () => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.START_LOADING });

      const { data } = await axios.get("/api/rbm/subordinates-evaluations");

      dispatch({ type: types.END_LOADING });

      dispatch({
        type: types.SET_SUBORDINATES_EVALUATIONS,
        data,
      });
    } catch (error) {
      dispatch({ type: types.END_LOADING });

      showError(error);
    }
  };
};

export const getSingleSubordinateEvaluations = (employeeId) => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.START_LOADING });

      const { data } = await axios.get(
        "/api/rbm/subordinates-evaluations/" + employeeId
      );

      dispatch({ type: types.END_LOADING });

      dispatch({
        type: types.UPDATE_SUBORDINATE_EVALUATIONS,
        data,
      });
    } catch (error) {
      dispatch({ type: types.END_LOADING });

      showError(error);
    }
  };
};

export const getCompetenciesDescriptors = (employeeId) => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.START_LOADING });

      dispatch({
        type: types.SET_COMPETENCIES_DESCRIPTORS,
        data: [],
      });

      const { data } = await axios.get(
        "/api/rbm/competencies-descriptors/" + employeeId
      );

      dispatch({ type: types.END_LOADING });

      dispatch({
        type: types.SET_COMPETENCIES_DESCRIPTORS,
        data,
      });
    } catch (error) {
      dispatch({ type: types.END_LOADING });

      showError(error);
    }
  };
};

export const confirmCompetenciesDescriptors = (
  employeeId,
  setConfirmEvaluateCompetencies
) => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.START_LOADING });

      const { data } = await axios.put(
        "/api/rbm/confirm-competencies-descriptors/" + employeeId
      );

      setConfirmEvaluateCompetencies(false);

      dispatch({ type: types.END_LOADING });

      dispatch({
        type: types.SET_COMPETENCIES_DESCRIPTORS,
        data: data.competencies,
      });

      dispatch({
        type: types.SET_SUBORDINATE_SCORES,
        data: data.subordnateScore,
      });
    } catch (error) {
      dispatch({ type: types.END_LOADING });

      showError(error);
    }
  };
};

export const saveCompetenciesEvaluations = (payload) => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.START_LOADING });

      const { data } = await axios.post(
        "/api/rbm/competencies-evaluations",
        payload
      );

      dispatch({ type: types.END_LOADING });

      dispatch({
        type: types.UPDATE_COMPETENCY_DESCRIPTOR,
        data: data,
      });

      // showSuccess("Saved Seccessfully");
    } catch (error) {
      dispatch({ type: types.END_LOADING });

      showError(error);
    }
  };
};

export const downloadAllInstitutionsPerformanceReport = () => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.START_LOADING });

      const { data } = await axios.get("/api/rbm-reports/institutions", {
        responseType: "blob",
      });

      download(
        new Blob([data]),
        "PUBLIC_INSTITUTIONS_PERFORMANCE_REPORT.pdf",
        ".pdf"
      );

      dispatch({ type: types.END_LOADING });
    } catch (error) {
      dispatch({ type: types.END_LOADING });
      showError("File not found");
    }
  };
};

export const downloadInstitutionPerformanceReport = (institution) => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.START_LOADING });

      const { data } = await axios.get(
        "/api/rbm-reports/institution/" + institution.id,
        {
          responseType: "blob",
        }
      );

      download(
        new Blob([data]),
        `INSTITUTIONAL_PERFORMANCE_REPORT.pdf`,
        ".pdf"
      );

      dispatch({ type: types.END_LOADING });
    } catch (error) {
      dispatch({ type: types.END_LOADING });
      showError("File not found");
    }
  };
};

export const downloadInstitutionEmployeesPerformanceReport = (institution) => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.START_LOADING });

      const { data } = await axios.get(
        "/api/rbm-reports/institution-employees/" + institution.id,
        {
          responseType: "blob",
        }
      );

      download(new Blob([data]), `EMPLOYEES_PERFORMANCE_REPORT.pdf`, ".pdf");

      dispatch({ type: types.END_LOADING });
    } catch (error) {
      dispatch({ type: types.END_LOADING });
      showError("File not found");
    }
  };
};

export const downloadUnitPerformanceReport = (unit) => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.START_LOADING });

      const { data } = await axios.get("/api/rbm-reports/unit/" + unit.id, {
        responseType: "blob",
      });

      download(new Blob([data]), `UNIT_PERFORMANCE_REPORT.pdf`, ".pdf");

      dispatch({ type: types.END_LOADING });
    } catch (error) {
      dispatch({ type: types.END_LOADING });
      showError("File not found");
    }
  };
};

export const downloadEmployeePerformanceReport = (user) => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.START_LOADING });

      const { data } = await axios.get(
        "/api/rbm-reports/employee/" + user.employeeId,
        {
          responseType: "blob",
        }
      );

      download(new Blob([data]), `EMPLOYEE_PERFORMANCE_REPORT.pdf`, ".pdf");

      dispatch({ type: types.END_LOADING });
    } catch (error) {
      dispatch({ type: types.END_LOADING });
      showError("File not found");
    }
  };
};

export const getRRAEvaluation = () => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.START_LOADING });

      const { data } = await axios.get("/api/rbm/rra-evaluation");

      dispatch({
        type: types.SET_RRA_EVALUATION,
        data,
      });

      dispatch({ type: types.END_LOADING });
    } catch (error) {
      dispatch({ type: types.END_LOADING });
      showError(error);
    }
  };
};

export const getRRAOverallEvaluations = () => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.START_LOADING });

      const { data } = await axios.get("/api/rbm/rra-overall-evaluations");

      dispatch({
        type: types.SET_RRA_OVERALL_EVALUATIONS,
        data,
      });

      dispatch({ type: types.END_LOADING });
    } catch (error) {
      dispatch({ type: types.END_LOADING });
      showError(error);
    }
  };
};

export const downloadRRAEmployeeEvaluationReport = (
  semester,
  employeeId,
  firstName,
  doUpdate
) => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.START_LOADING });

      const { data } = await axios.get(
        "/api/rbm-reports/rra-employee-evaluation/" +
          semester +
          "/" +
          employeeId,
        {
          responseType: "blob",
        }
      );

      if (doUpdate) {
        const { data } = await axios.get(
          "/api/rbm/single-rra-evaluation/" + employeeId
        );

        dispatch({
          type: types.UPDATE_RRA_OVERALL_EVALUATION,
          data,
        });
      }

      download(
        new Blob([data]),
        `${firstName}_INDIVIDUAL_EVALUATION_REPORT.pdf`,
        ".pdf"
      );

      dispatch({ type: types.END_LOADING });
    } catch (error) {
      dispatch({ type: types.END_LOADING });
      showError("File not found");
    }
  };
};
