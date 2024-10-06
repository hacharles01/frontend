import { defaultState } from "./state";
import rbmTypes from "./action-types";
import commonTypes from "../common/action-types";
const types = { ...commonTypes, ...rbmTypes };

const expectedResults = (
  expectedResultsState = defaultState.expectedResults,
  action
) => {
  switch (action.type) {
    case types.SET_EXPECTED_RESULTS:
      return action.data;

    case types.ADD_NEW_EXPECTED_RESULT: {
      const tmpExpectedResultsState = [...expectedResultsState];
      tmpExpectedResultsState.push(action.data);
      return tmpExpectedResultsState;
    }

    case types.UPDATE_EXPECTED_RESULT: {
      const tmpExpectedResultsState = [...expectedResultsState];
      const index = tmpExpectedResultsState.findIndex(
        ({ id }) => id === action.data.id
      );
      tmpExpectedResultsState[index] = action.data;

      return tmpExpectedResultsState;
    }

    case types.DELETE_EXPECTED_RESULT: {
      const tmpExpectedResultsState = [...expectedResultsState];
      const index = tmpExpectedResultsState.findIndex(
        ({ id }) => id === action.id
      );
      tmpExpectedResultsState.splice(index, 1);

      return tmpExpectedResultsState;
    }

    case types.CLEAN_STATE:
      return defaultState.expectedResults;

    default:
      return expectedResultsState;
  }
};

const selectedExpectedResult = (
  selectedExpectedResultState = defaultState.selectedExpectedResult,
  action
) => {
  switch (action.type) {
    case types.SET_SELECTED_EXPECTED_RESULT:
      return action.data;

    case types.CLEAN_STATE:
      return defaultState.selectedExpectedResult;

    default:
      return selectedExpectedResultState;
  }
};

const indicators = (indicatorsState = defaultState.indicators, action) => {
  switch (action.type) {
    case types.SET_INDICATORS:
      return action.data;

    case types.ADD_NEW_INDICATOR: {
      const tmpIndicatorsState = [...indicatorsState];
      tmpIndicatorsState.push(action.data);
      return tmpIndicatorsState;
    }

    case types.UPDATE_INDICATOR: {
      const tmpIndicatorsState = [...indicatorsState];
      const index = tmpIndicatorsState.findIndex(
        ({ id }) => id === action.data.id
      );
      tmpIndicatorsState[index] = action.data;

      return tmpIndicatorsState;
    }

    case types.DELETE_INDICATOR: {
      const tmpIndicatorsState = [...indicatorsState];
      const index = tmpIndicatorsState.findIndex(
        ({ id }) => id === action.data.id
      );
      tmpIndicatorsState.splice(index, 1);

      return tmpIndicatorsState;
    }

    case types.CLEAN_STATE:
      return defaultState.indicators;

    default:
      return indicatorsState;
  }
};

const unitIndicators = (
  unitIndicatorsState = defaultState.unitIndicators,
  action
) => {
  switch (action.type) {
    case types.SET_UNITY_INDICATORS:
      return action.data;

    case types.UPDATE_INDICATOR: {
      const tmpUnitIndicatorsState = [...unitIndicatorsState];
      const index = tmpUnitIndicatorsState.findIndex(
        ({ id }) => id === action.data.id
      );

      if (index >= 0) tmpUnitIndicatorsState[index] = action.data;

      return tmpUnitIndicatorsState;
    }

    case types.DELETE_INDICATOR: {
      const tmpUnitIndicatorsState = [...unitIndicatorsState];
      const index = tmpUnitIndicatorsState.findIndex(
        ({ id }) => id === action.data.id
      );

      if (index >= 0) tmpUnitIndicatorsState.splice(index, 1);

      return tmpUnitIndicatorsState;
    }

    case types.CLEAN_STATE:
      return defaultState.unitIndicators;

    default:
      return unitIndicatorsState;
  }
};

const selectedIndicator = (
  selectedIndicatorState = defaultState.selectedIndicator,
  action
) => {
  switch (action.type) {
    case types.SET_SELECTED_INDICATOR:
      return action.data;

    case types.CLEAN_STATE:
      return defaultState.selectedIndicator;

    default:
      return selectedIndicatorState;
  }
};

const indicatorActivities = (
  indicatorActivitiesState = defaultState.indicatorActivities,
  action
) => {
  switch (action.type) {
    case types.SET_INDICATOR_ACTIVITIES:
      return action.data;

    case types.ADD_NEW_ACTIVITY: {
      const tmpIndicatorActivitiesState = [...indicatorActivitiesState];

      const quarterIndex = tmpIndicatorActivitiesState.findIndex(
        ({ id }) => id === action.data.quarterTargetId
      );

      if (!tmpIndicatorActivitiesState[quarterIndex].activities)
        tmpIndicatorActivitiesState[quarterIndex].activities = [action.data];
      else
        tmpIndicatorActivitiesState[quarterIndex].activities.push(action.data);

      tmpIndicatorActivitiesState[quarterIndex].activities = [
        ...tmpIndicatorActivitiesState[quarterIndex].activities,
      ];

      tmpIndicatorActivitiesState[quarterIndex] = {
        ...tmpIndicatorActivitiesState[quarterIndex],
      };
      return tmpIndicatorActivitiesState;
    }

    case types.UPDATE_ACTIVITY: {
      const tmpIndicatorActivitiesState = [...indicatorActivitiesState];

      const quarterIndex = tmpIndicatorActivitiesState.findIndex(
        ({ id }) => id === action.data.quarterTargetId
      );

      const activities = [
        ...(tmpIndicatorActivitiesState[quarterIndex].activities || []),
      ];

      const activityIndex = activities.findIndex(
        ({ id }) => id === action.data.id
      );

      const assignments = activities[activityIndex].assignments || [];
      const evaluations = activities[activityIndex].evaluations || [];

      activities[activityIndex] = {
        ...action.data,
        assignments: [...assignments],
        evaluations: [...evaluations],
      };

      tmpIndicatorActivitiesState[quarterIndex] = {
        ...tmpIndicatorActivitiesState[quarterIndex],
        activities: [...activities],
      };

      return tmpIndicatorActivitiesState;
    }

    case types.DELETE_ACTIVITY: {
      const tmpIndicatorActivitiesState = [...indicatorActivitiesState];

      const quarterIndex = tmpIndicatorActivitiesState.findIndex(
        ({ id }) => id === action.data.quarterTargetId
      );

      const activityIndex = tmpIndicatorActivitiesState[
        quarterIndex
      ].activities.findIndex(({ id }) => id === action.data.id);

      tmpIndicatorActivitiesState[quarterIndex].activities.splice(
        activityIndex,
        1
      );

      tmpIndicatorActivitiesState[quarterIndex].activities = [
        ...tmpIndicatorActivitiesState[quarterIndex].activities,
      ];

      tmpIndicatorActivitiesState[quarterIndex] = {
        ...tmpIndicatorActivitiesState[quarterIndex],
      };

      return tmpIndicatorActivitiesState;
    }

    case types.ADD_ACTIVITY_ASSIGNMENT: {
      const tmpIndicatorActivitiesState = [...indicatorActivitiesState];

      const quarterIndex = tmpIndicatorActivitiesState.findIndex(
        ({ id }) => id === action.data.activity.quarterTargetId
      );

      const activities = [
        ...(tmpIndicatorActivitiesState[quarterIndex].activities || []),
      ];

      const activityIndex = activities.findIndex(
        ({ id }) => id === action.data.activity.id
      );

      const assignments = activities[activityIndex].assignments || [];

      assignments.push(action.data.assignment);

      activities[activityIndex] = {
        ...activities[activityIndex],
        assignments: [...assignments],
      };

      tmpIndicatorActivitiesState[quarterIndex] = {
        ...tmpIndicatorActivitiesState[quarterIndex],
        activities: [...activities],
      };

      return tmpIndicatorActivitiesState;
    }

    case types.REMOVE_ACTIVITY_ASSIGNMENT: {
      const tmpIndicatorActivitiesState = [...indicatorActivitiesState];

      const quarterIndex = tmpIndicatorActivitiesState.findIndex(
        ({ id }) => id === action.data.activity.quarterTargetId
      );

      const activities = [
        ...(tmpIndicatorActivitiesState[quarterIndex].activities || []),
      ];

      const activityIndex = activities.findIndex(
        ({ id }) => id === action.data.activity.id
      );

      const assignments = activities[activityIndex].assignments || [];

      const assignmentIndex = assignments.findIndex(
        ({ assignmentId }) => assignmentId === action.data.id
      );

      assignments.splice(assignmentIndex, 1);

      activities[activityIndex] = {
        ...activities[activityIndex],
        assignments: [...assignments],
      };

      tmpIndicatorActivitiesState[quarterIndex] = {
        ...tmpIndicatorActivitiesState[quarterIndex],
        activities: [...activities],
      };

      return tmpIndicatorActivitiesState;
    }

    case types.ADD_ACTIVITY_EVALUATION: {
      const tmpIndicatorActivitiesState = [...indicatorActivitiesState];

      const quarterIndex = tmpIndicatorActivitiesState.findIndex(
        ({ id }) => id === action.data.activity.quarterTargetId
      );

      if (quarterIndex < 0) return tmpIndicatorActivitiesState;

      const activities = [
        ...(tmpIndicatorActivitiesState[quarterIndex].activities || []),
      ];

      const activityIndex = activities.findIndex(
        ({ id }) => id === action.data.activity.id
      );

      // const submissions = activities[activityIndex].submissions || [];
      const assignments = activities[activityIndex].assignments || [];

      // if (submissions.length > 0)
      //   submissions[submissions.length - 1].evaluation = action.data.evaluation;

      activities[activityIndex] = {
        ...action.data.activity,
        // submissions: [...submissions],
        assignments: [...assignments],
      };

      tmpIndicatorActivitiesState[quarterIndex] = {
        ...tmpIndicatorActivitiesState[quarterIndex],
        activities: [...activities],
      };

      return tmpIndicatorActivitiesState;
    }

    case types.REMOVE_ACTIVITY_EVALUATION: {
      const tmpIndicatorActivitiesState = [...indicatorActivitiesState];

      const quarterIndex = tmpIndicatorActivitiesState.findIndex(
        ({ id }) => id === action.data.activity.quarterTargetId
      );

      if (quarterIndex < 0) return tmpIndicatorActivitiesState;

      const activities = [
        ...(tmpIndicatorActivitiesState[quarterIndex].activities || []),
      ];

      const activityIndex = activities.findIndex(
        ({ id }) => id === action.data.activity.id
      );

      // const submissions = activities[activityIndex].submissions || [];
      const assignments = activities[activityIndex].assignments || [];

      // if (submissions.length > 0)
      //   delete submissions[submissions.length - 1].evaluation;

      activities[activityIndex] = {
        ...action.data.activity,
        // submissions: [...submissions],
        assignments: [...assignments],
      };

      tmpIndicatorActivitiesState[quarterIndex] = {
        ...tmpIndicatorActivitiesState[quarterIndex],
        activities: [...activities],
      };

      return tmpIndicatorActivitiesState;
    }

    case types.CLEAN_STATE:
      return defaultState.indicatorActivities;

    default:
      return indicatorActivitiesState;
  }
};

const selectedActivity = (
  selectedActivityState = defaultState.selectedActivity,
  action
) => {
  switch (action.type) {
    case types.SET_SELECTED_ACTIVITY:
      return action.data;

    case types.CLEAN_STATE:
      return defaultState.selectedActivity;

    default:
      return selectedActivityState;
  }
};

const myActivities = (
  myActivitiesState = defaultState.myActivities,
  action
) => {
  switch (action.type) {
    case types.SET_MY_ACTIVITIES:
      return action.data;

    case types.ADD_ACTIVITY_SUBMISSION: {
      const tmpMyActivitiesState = [...myActivitiesState];

      const quarterIndex = tmpMyActivitiesState.findIndex(
        ({ quarterId }) => quarterId === action.data.activity.quarterId
      );

      const activities = [
        ...(tmpMyActivitiesState[quarterIndex].activities || []),
      ];

      const activityIndex = activities.findIndex(
        ({ id }) => id === action.data.activity.id
      );

      const assignments = activities[activityIndex].assignments || [];
      // const submissions = activities[activityIndex].submissions || [];

      // submissions.push(action.data.report);

      activities[activityIndex] = {
        ...action.data.activity,
        assignments: [...assignments],
        // status: "Reported",
      };

      tmpMyActivitiesState[quarterIndex] = {
        ...tmpMyActivitiesState[quarterIndex],
        activities: [...activities],
      };

      return tmpMyActivitiesState;
    }

    case types.REMOVE_ACTIVITY_SUBMISSION: {
      const tmpMyActivitiesState = [...myActivitiesState];

      const quarterIndex = tmpMyActivitiesState.findIndex(
        ({ quarterId }) => quarterId === action.data.activity.quarterId
      );

      const activities = [
        ...(tmpMyActivitiesState[quarterIndex].activities || []),
      ];

      const activityIndex = activities.findIndex(
        ({ id }) => id === action.data.activity.id
      );

      // const submissions = activities[activityIndex].submissions || [];

      // const submissionIndex = submissions.findIndex(
      //   ({ id }) => id === action.data.id
      // );

      //submissions.splice(submissionIndex, 1);

      activities[activityIndex] = {
        ...activities[activityIndex],
        submissions: [],
        status: action.data.activity.status,
      };

      tmpMyActivitiesState[quarterIndex] = {
        ...tmpMyActivitiesState[quarterIndex],
        activities: [...activities],
      };

      return tmpMyActivitiesState;
    }

    case types.ADD_ACTIVITY_EVALUATION: {
      const tmpMyActivitiesState = [...myActivitiesState];

      const quarterIndex = tmpMyActivitiesState.findIndex(
        ({ quarterId }) => quarterId === action.data.activity.quarterId
      );

      if (quarterIndex < 0) return tmpMyActivitiesState;

      const activities = [
        ...(tmpMyActivitiesState[quarterIndex].activities || []),
      ];

      const activityIndex = activities.findIndex(
        ({ id }) => id === action.data.activity.id
      );

      if (activityIndex < 0) return tmpMyActivitiesState;

      // const submissions = activities[activityIndex].submissions || [];
      const assignments = activities[activityIndex].assignments || [];

      // if (submissions.length > 0)
      //   submissions[submissions.length - 1].evaluation = action.data.evaluation;

      activities[activityIndex] = {
        ...action.data.activity,
        // submissions: [...submissions],
        assignments: [...assignments],
      };

      tmpMyActivitiesState[quarterIndex] = {
        ...tmpMyActivitiesState[quarterIndex],
        activities: [...activities],
      };

      return tmpMyActivitiesState;
    }

    case types.REMOVE_ACTIVITY_EVALUATION: {
      const tmpMyActivitiesState = [...myActivitiesState];

      const quarterIndex = tmpMyActivitiesState.findIndex(
        ({ quarterId }) => quarterId === action.data.activity.quarterId
      );

      if (quarterIndex < 0) return tmpMyActivitiesState;

      const activities = [
        ...(tmpMyActivitiesState[quarterIndex].activities || []),
      ];

      const activityIndex = activities.findIndex(
        ({ id }) => id === action.data.activity.id
      );

      if (activityIndex < 0) return tmpMyActivitiesState;

      // const submissions = activities[activityIndex].submissions || [];
      const assignments = activities[activityIndex].assignments || [];

      // if (submissions.length > 0)
      //   delete submissions[submissions.length - 1].evaluation;

      activities[activityIndex] = {
        ...action.data.activity,
        // submissions: [...submissions],
        assignments: [...assignments],
      };

      tmpMyActivitiesState[quarterIndex] = {
        ...tmpMyActivitiesState[quarterIndex],
        activities: [...activities],
      };

      return tmpMyActivitiesState;
    }

    case types.CLEAN_STATE:
      return defaultState.myActivities;

    default:
      return myActivitiesState;
  }
};

const subordinates = (
  subordinatesState = defaultState.subordinates,
  action
) => {
  switch (action.type) {
    case types.SET_SUBORDINATES:
      return action.data;

    case types.LOGOUT:
      return defaultState.subordinates;

    default:
      return subordinatesState;
  }
};

const fiscalYears = (fiscalYearsState = defaultState.fiscalYears, action) => {
  switch (action.type) {
    case types.SET_FISCAL_YEARS:
      return action.data;

    case types.LOGOUT:
      return defaultState.fiscalYears;

    default:
      return fiscalYearsState;
  }
};

const selectedFiscalYear = (
  selectedFiscalYearState = defaultState.selectedFiscalYear,
  action
) => {
  switch (action.type) {
    case types.SET_SELECTED_FISCAL_YEAR:
      return action.data;

    case types.LOGOUT:
      return defaultState.selectedFiscalYear;

    default:
      return selectedFiscalYearState;
  }
};

const userEntities = (
  userEntitiesState = defaultState.userEntities,
  action
) => {
  switch (action.type) {
    case types.SET_USER_ENTITIES:
      return action.data;

    case types.LOGOUT:
      return defaultState.userEntities;

    default:
      return userEntitiesState;
  }
};

const selectedUserEntity = (
  selectedUserEntityState = defaultState.selectedUserEntity,
  action
) => {
  switch (action.type) {
    case types.SET_SELECTED_USER_ENTITY:
      return action.data;

    case types.LOGOUT:
      return defaultState.selectedUserEntity;

    default:
      return selectedUserEntityState;
  }
};

const units = (unitsState = defaultState.units, action) => {
  switch (action.type) {
    case types.SET_UNITS:
      return action.data;

    case types.CLEAN_STATE:
      return defaultState.units;

    default:
      return unitsState;
  }
};

const institutionsEvaluations = (
  institutionsEvaluationsState = defaultState.institutionsEvaluations,
  action
) => {
  switch (action.type) {
    case types.SET_INSTITUTIONS_EVALUATIONS:
      return action.data;

    case types.CLEAN_STATE:
      return defaultState.institutionsEvaluations;

    default:
      return institutionsEvaluationsState;
  }
};

const unitsEvaluations = (
  unitsEvaluationsState = defaultState.unitsEvaluations,
  action
) => {
  switch (action.type) {
    case types.SET_UNITS_EVALUATIONS:
      return action.data;

    case types.CLEAN_STATE:
      return defaultState.unitsEvaluations;

    default:
      return unitsEvaluationsState;
  }
};

const employeesEvaluations = (
  employeesEvaluationsState = defaultState.employeesEvaluations,
  action
) => {
  switch (action.type) {
    case types.SET_EMPLOYEES_EVALUATIONS:
      return action.data;

    case types.CLEAN_STATE:
      return defaultState.employeesEvaluations;

    default:
      return employeesEvaluationsState;
  }
};

const subordinatesEvaluations = (
  subordinatesEvaluationsState = defaultState.subordinatesEvaluations,
  action
) => {
  switch (action.type) {
    case types.SET_SUBORDINATES_EVALUATIONS:
      return action.data;

    case types.UPDATE_SUBORDINATE_EVALUATIONS: {
      const tmpState = [...subordinatesEvaluationsState];

      const index = tmpState.findIndex(({ id }) => id === action.data.id);

      if (index < 0) return tmpState;

      tmpState[index] = { ...action.data };

      return tmpState;
    }

    case types.CLEAN_STATE:
      return defaultState.subordinatesEvaluations;

    default:
      return subordinatesEvaluationsState;
  }
};

const subordinateActivities = (
  subordinateActivitiesState = defaultState.subordinateActivities,
  action
) => {
  switch (action.type) {
    case types.SET_SUBORDINATE_ACTIVITIES:
      return action.data;

    case types.ADD_ACTIVITY_EVALUATION: {
      const tmpState = [...subordinateActivitiesState];

      const quarterIndex = tmpState.findIndex(
        ({ quarterId }) => quarterId === action.data.activity.quarterId
      );

      if (quarterIndex < 0) return tmpState;

      const activities = [...(tmpState[quarterIndex].activities || [])];

      const activityIndex = activities.findIndex(
        ({ id }) => id === action.data.activity.id
      );

      // const submissions = activities[activityIndex].submissions || [];
      const assignments = activities[activityIndex].assignments || [];

      // if (submissions.length > 0)
      //   submissions[submissions.length - 1].evaluation = action.data.evaluation;

      activities[activityIndex] = {
        ...action.data.activity,
        // submissions: [...submissions],
        assignments: [...assignments],
      };

      tmpState[quarterIndex] = {
        ...tmpState[quarterIndex],
        activities: [...activities],
      };

      return tmpState;
    }

    case types.REMOVE_ACTIVITY_EVALUATION: {
      const tmpState = [...subordinateActivitiesState];

      const quarterIndex = tmpState.findIndex(
        ({ quarterId }) => quarterId === action.data.activity.quarterId
      );

      if (quarterIndex < 0) return tmpState;

      const activities = [...(tmpState[quarterIndex].activities || [])];

      const activityIndex = activities.findIndex(
        ({ id }) => id === action.data.activity.id
      );

      // const submissions = activities[activityIndex].submissions || [];
      const assignments = activities[activityIndex].assignments || [];

      // if (submissions.length > 0)
      //   delete submissions[submissions.length - 1].evaluation;

      activities[activityIndex] = {
        ...action.data.activity,
        // submissions: [...submissions],
        assignments: [...assignments],
      };

      tmpState[quarterIndex] = {
        ...tmpState[quarterIndex],
        activities: [...activities],
      };

      return tmpState;
    }

    case types.CLEAN_STATE:
      return defaultState.subordinateActivities;

    default:
      return subordinateActivitiesState;
  }
};

const competenciesDescriptors = (
  competenciesDescriptorsState = defaultState.competenciesDescriptors,
  action
) => {
  switch (action.type) {
    case types.SET_COMPETENCIES_DESCRIPTORS:
      return action.data;

    case types.UPDATE_COMPETENCY_DESCRIPTOR: {
      const tmpState = [...competenciesDescriptorsState];

      const competencyIndex = tmpState.findIndex(
        ({ id }) => id === action.data.competencyId
      );

      if (competencyIndex < 0) return tmpState;

      const descriptorIndex = tmpState[competencyIndex].descriptors.findIndex(
        ({ id }) => id === action.data.id
      );

      if (descriptorIndex < 0) return tmpState;

      tmpState[competencyIndex].descriptors[descriptorIndex] = {
        ...action.data,
      };

      return tmpState;
    }

    case types.CLEAN_STATE:
      return defaultState.competenciesDescriptors;

    default:
      return competenciesDescriptorsState;
  }
};

const rraEvaluation = (
  rraEvaluationState = defaultState.rraEvaluation,
  action
) => {
  switch (action.type) {
    case types.SET_RRA_EVALUATION:
      return action.data;

    case types.CLEAN_STATE:
      return defaultState.rraEvaluation;

    default:
      return rraEvaluationState;
  }
};

const rraOverallEvaluations = (
  rraOverallEvaluationsState = defaultState.rraOverallEvaluations,
  action
) => {
  switch (action.type) {
    case types.SET_RRA_OVERALL_EVALUATIONS:
      return action.data;

    case types.UPDATE_RRA_OVERALL_EVALUATION: {
      const tmpState = [...rraOverallEvaluationsState];

      const index = tmpState.findIndex(
        ({ employeeId }) => employeeId === action.data.employeeId
      );

      if (index < 0) return tmpState;

      tmpState[index] = { ...action.data };

      return tmpState;
    }

    case types.CLEAN_STATE:
      return defaultState.rraOverallEvaluations;

    default:
      return rraOverallEvaluationsState;
  }
};

const myScores = (myScoresState = defaultState.myScores, action) => {
  switch (action.type) {
    case types.SET_MY_SCORES:
      return action.data;

    case types.CLEAN_STATE:
      return defaultState.myScores;

    default:
      return myScoresState;
  }
};

const subordnateScore = (
  subordnateScoreState = defaultState.subordnateScore,
  action
) => {
  switch (action.type) {
    case types.SET_SUBORDINATE_SCORES:
      return action.data;

    case types.CLEAN_STATE:
      return defaultState.subordnateScore;

    default:
      return subordnateScoreState;
  }
};

export default {
  expectedResults,
  selectedExpectedResult,
  indicators,
  unitIndicators,
  selectedIndicator,
  indicatorActivities,
  selectedActivity,
  myActivities,
  subordinates,
  fiscalYears,
  selectedFiscalYear,
  userEntities,
  selectedUserEntity,
  institutionsEvaluations,
  unitsEvaluations,
  employeesEvaluations,
  subordinatesEvaluations,
  subordinateActivities,
  competenciesDescriptors,
  rraEvaluation,
  rraOverallEvaluations,
  myScores,
  subordnateScore,
};
