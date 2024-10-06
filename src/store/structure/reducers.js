import { defaultState } from "./state";
import structure from "./action-types";
import commonTypes from "../common/action-types";
const types = { ...commonTypes, ...structure };

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

const treeUnits = (treeUnitsState = defaultState.treeUnits, action) => {
  switch (action.type) {
    case types.SET_TREE_UNITS:
      return action.data;

    case types.CLEAN_STATE:
      return defaultState.treeUnits;

    default:
      return treeUnitsState;
  }
};

const selectedUnit = (
  selectedUnitState = defaultState.selectedUnit,
  action
) => {
  switch (action.type) {
    case types.SELECTED_UNIT:
      return action.data;

    case types.CLEAN_STATE:
      return defaultState.selectedUnit;

    default:
      return selectedUnitState;
  }
};

const searchUnit = (searchUnitState = defaultState.searchUnit, action) => {
  switch (action.type) {
    case types.SEARCH_UNIT:
      return action.data;

    case types.CLEAN_STATE:
      return defaultState.searchUnit;

    default:
      return searchUnitState;
  }
};

const searchPosition = (
  searchPositionState = defaultState.searchPosition,
  action
) => {
  switch (action.type) {
    case types.SEARCH_POSITION:
      return action.data;

    case types.CLEAN_STATE:
      return defaultState.searchPosition;

    default:
      return searchPositionState;
  }
};
const searchCurrentPositions = (
  searchCurrentPositionsState = defaultState.searchCurrentPositions,
  action
) => {
  switch (action.type) {
    case types.SEARCH_CURRENT_POSITIONS:
      return action.data;

    case types.CLEAN_STATE:
      return defaultState.searchCurrentPositions;

    default:
      return searchCurrentPositionsState;
  }
};

const unitTypes = (unitTypesState = defaultState.unitTypes, action) => {
  switch (action.type) {
    case types.SET_UNIT_TYPES:
      return action.data;

    case types.CLEAN_STATE:
      return defaultState.unitTypes;

    default:
      return unitTypesState;
  }
};

const positions = (positionsState = defaultState.positions, action) => {
  switch (action.type) {
    case types.SET_POSITIONS:
      return action.data;

    case types.ADD_POSITION:
      const tmpPositionsStateState = [...positionsState];
      tmpPositionsStateState.unshift(action.data);
      return tmpPositionsStateState;

    case types.DELETE_POSITION:
      const tmpRemovePositions = [...positionsState];
      const index = tmpRemovePositions.findIndex(
        ({ id }) => id === action.data.id
      );

      tmpRemovePositions.splice(index, 1);

      return tmpRemovePositions;

    case types.UPDATE_POSITION: {
      const tmpPositionsStateState = [...positionsState];
      const index = tmpPositionsStateState.findIndex(
        ({ id }) => id === action.data.id
      );
      tmpPositionsStateState[index] = action.data;

      return tmpPositionsStateState;
    }

    case types.SET_POSITION_PLANNER || types.SET_POSITION_HEAD_UNITY: {
      const tmpPositionsStateState = [...positionsState];

      const index = tmpPositionsStateState.findIndex(
        ({ id }) => id === action.data.id
      );
      tmpPositionsStateState[index] = action.data;

      return tmpPositionsStateState;
    }

    case types.CLEAN_STATE:
      return defaultState.positions;

    default:
      return positionsState;
  }
};

const salaryStructures = (
  salaryStructuresState = defaultState.salaryStructures,
  action
) => {
  switch (action.type) {
    case types.GET_SALARY_STRUCTURE:
      return action.data;

    case types.CLEAN_STATE:
      return defaultState.salaryStructures;

    default:
      return salaryStructuresState;
  }
};

const employeeGroups = (
  employeeGroupsState = defaultState.employeeGroups,
  action
) => {
  switch (action.type) {
    case types.GET_EMPLOYEE_GROUPS:
      return action.data;

    case types.CLEAN_STATE:
      return defaultState.employeeGroups;

    default:
      return employeeGroupsState;
  }
};

const hiringModes = (hiringModesState = defaultState.hiringModes, action) => {
  switch (action.type) {
    case types.GET_HIRING_MODES:
      return action.data;

    case types.CLEAN_STATE:
      return defaultState.hiringModes;

    default:
      return hiringModesState;
  }
};

const echelons = (echelonsState = defaultState.echelons, action) => {
  switch (action.type) {
    case types.GET_ECHELONS:
      return action.data;

    case types.CLEAN_STATE:
      return defaultState.echelons;

    default:
      return echelonsState;
  }
};

const levels = (levelsState = defaultState.levels, action) => {
  switch (action.type) {
    case types.GET_LEVELS:
      return action.data;

    case types.CLEAN_STATE:
      return defaultState.levels;

    default:
      return levelsState;
  }
};

const positionEmployees = (
  positionEmployeesState = defaultState.positionEmployees,
  action
) => {
  switch (action.type) {
    case types.GET_POSITION_EMPLOYEES:
      return action.data;

    case types.CLEAN_STATE:
      return defaultState.positionEmployees;

    default:
      return positionEmployeesState;
  }
};

const supervisorPositions = (
  supervisorPositionsState = defaultState.supervisorPositions,
  action
) => {
  switch (action.type) {
    case types.GET_SUPERVISOR_POSITIONS:
      return action.data;

    case types.CLEAN_STATE:
      return defaultState.supervisorPositions;

    default:
      return supervisorPositionsState;
  }
};

const positionQualifications = (
  positionQualificationsState = defaultState.positionQualifications,
  action
) => {
  switch (action.type) {
    case types.GET_POSITION_QUALIFICATIONS:
      return action.data;

    case types.ADD_QUALIFICATION:
      const tmpPositionQualificationsState = [...positionQualificationsState];

      if(!tmpPositionQualificationsState.find( ({qualificationId})=> qualificationId === action.data.qualificationId)){
        tmpPositionQualificationsState.unshift(action.data);
      }

      return tmpPositionQualificationsState;

    case types.UPDATE_QUALIFICATION: {
      const tmpPositionQualificationsState = [...positionQualificationsState];
      const index = tmpPositionQualificationsState.findIndex(
        ({ qualificationId, positionId }) =>
          qualificationId === action.data.qualificationId &&
          positionId === action.data.positionId
      );
      tmpPositionQualificationsState[index] = action.data;

      return tmpPositionQualificationsState;
    }

    case types.DELETE_QUALIFICATION:
      const tmpRemoveQualifications = [...positionQualificationsState];
      const index = tmpRemoveQualifications.findIndex(
        ({ id }) => id === action.data.id
      );

      tmpRemoveQualifications.splice(index, 1);

      return tmpRemoveQualifications;

    case types.CLEAN_STATE:
      return defaultState.positionQualifications;

    default:
      return positionQualificationsState;
  }
};

const professionalCertificates = (
  professionalCertificatesState = defaultState.professionalCertificates,
  action
) => {
  switch (action.type) {
    case types.GET_PROFESSIONAL_CERTIFICATES:
      return action.data;

    case types.ADD_PROFESSIONAL_CERTIFICATE:
      const tmpProfessionalCertificatesState = [
        ...professionalCertificatesState,
      ];
     
      if(!tmpProfessionalCertificatesState.find( ({professionalCertificateId})=>  professionalCertificateId === action.data.professionalCertificateId)){
        tmpProfessionalCertificatesState.unshift(action.data);
      }
      
      return tmpProfessionalCertificatesState;

    case types.DELETE_PROFESSIONAL_CERTIFICATE:
      const tmpRemoveCertificate = [...professionalCertificatesState];
      const index = tmpRemoveCertificate.findIndex(
        ({ id }) => id === action.data.id
      );

      tmpRemoveCertificate.splice(index, 1);

      return tmpRemoveCertificate;

    case types.CLEAN_STATE:
      return defaultState.professionalCertificates;

    default:
      return professionalCertificatesState;
  }
};

const degrees = (degreesState = defaultState.degrees, action) => {
  switch (action.type) {
    case types.GET_DEGREES:
      return action.data;

    case types.CLEAN_STATE:
      return defaultState.degrees;

    default:
      return degreesState;
  }
};
const degreeQualifications = (
  degreeQualificationsState = defaultState.degreeQualifications,
  action
) => {
  switch (action.type) {
    case types.GET_DEGREE_QUALIFICATIONS:
      return action.data;

    case types.CLEAN_STATE:
      return defaultState.degreeQualifications;

    default:
      return degreeQualificationsState;
  }
};

const knowledges = (knowledgesState = defaultState.knowledges, action) => {
  switch (action.type) {
    case types.GET_KNOWLEDGE:
      return action.data;

    case types.CLEAN_STATE:
      return defaultState.knowledges;

    default:
      return knowledgesState;
  }
};

const certificateTypes = (
  certificateTypesState = defaultState.certificateTypes,
  action
) => {
  switch (action.type) {
    case types.GET_CERTIFICATE_TYPES:
      return action.data;

    case types.CLEAN_STATE:
      return defaultState.certificateTypes;

    default:
      return certificateTypesState;
  }
};

const professionalCertificateTypes = (
  professionalCertificateTypesState = defaultState.professionalCertificateTypes,
  action
) => {
  switch (action.type) {
    case types.GET_PROFESSIONAL_CERTIFICATE_TYPES:
      return action.data;

    case types.CLEAN_STATE:
      return defaultState.professionalCertificateTypes;

    default:
      return professionalCertificateTypesState;
  }
};

const positionKnowledges = (
  positionKnowledgesState = defaultState.positionKnowledges,
  action
) => {
  switch (action.type) {
    case types.GET_POSITION_KNOWLEDGES:
      return action.data;

    case types.ADD_POSITION_KNOWLEDGE:
      const tmpPositionKnowledgesState = [...positionKnowledgesState];
   
      if(!tmpPositionKnowledgesState.find( ({knowledgeId})=> knowledgeId === action.data.knowledgeId)){
          tmpPositionKnowledgesState.unshift(action.data);
      }
    
      return tmpPositionKnowledgesState;

    case types.DELETE_POSITION_KNOWLEDGE:
      const tmpRemovePositionKnowledges = [...positionKnowledgesState];
      const index = tmpRemovePositionKnowledges.findIndex(
        ({ id }) => id === action.data.id
      );

      tmpRemovePositionKnowledges.splice(index, 1);

      return tmpRemovePositionKnowledges;

    case types.CLEAN_STATE:
      return defaultState.positionKnowledges;

    default:
      return positionKnowledgesState;
  }
};


const searchEmployee = (
  searchEmployeeState = defaultState.searchEmployee,
  action
) => {
  switch (action.type) {
    case types.SEARCH_EMPLOYEES:
      return action.data;

    case types.CLEAN_STATE:
      return defaultState.searchEmployee;

    default:
      return searchEmployeeState;
  }
};
const searchCurrentEmployees = (
  searchCurrentEmployeesState = defaultState.searchCurrentEmployees,
  action
) => {
  switch (action.type) {
    case types.SEARCH_CURRENT_EMPLOYEES:
      return action.data;

    case types.CLEAN_STATE:
      return defaultState.searchCurrentEmployees;

    default:
      return searchCurrentEmployeesState;
  }
};

const employees = (employeesState = defaultState.employees, action) => {
  switch (action.type) {
    case types.SET_EMPLOYEES:
      return action.data;

    case types.ADD_EMPLOYEE:
      const tmpEmployeesState = [...employeesState];
      tmpEmployeesState.unshift(action.data);
      return tmpEmployeesState;

    case types.DELETE_POSITION:
      const tmpRemoveEmployee = [...employeesState];
      const index = tmpRemoveEmployee.findIndex(
        ({ id }) => id === action.data.id
      );

      tmpRemoveEmployee.splice(index, 1);

      return tmpRemoveEmployee;

    case types.UPDATE_EMPLOYEE: {
      const tmpEmployeesState = [...employeesState];
      const index = tmpEmployeesState.findIndex(
        ({ id }) => id === action.data.id
      );
      tmpEmployeesState[index] = action.data;

      return tmpEmployeesState;
    }


    case types.CLEAN_STATE:
      return defaultState.employees;

    default:
      return employeesState;
  }
};

const nationalIdDetail = (
  nationalIdDetailState = defaultState.nationalIdDetail,
  action
) => {
  switch (action.type) {
    case types.GET_NATIONAL_ID_DETAIL:
      return action.data;

    case types.CLEAN_STATE:
      return defaultState.nationalIdDetail;

    default:
      return nationalIdDetailState;
  }
};

export default {
  units,
  treeUnits,
  unitTypes,
  positions,
  selectedUnit,
  searchUnit,
  searchPosition,
  searchCurrentPositions,
  salaryStructures,
  employeeGroups,
  hiringModes,
  echelons,
  levels,
  positionEmployees,
  supervisorPositions,
  positionQualifications,
  degrees,
  degreeQualifications,
  professionalCertificates,
  knowledges,
  certificateTypes,
  professionalCertificateTypes,
  positionKnowledges,
  ///////////////////////////////////EMPLOYEEES
  searchEmployee,
  searchCurrentEmployees,
  employees,
  nationalIdDetail
};
