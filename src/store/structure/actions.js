import structure from "./action-types";
import axios from "axios";
import { showSuccess, showError } from "../../app/toastify";
import * as arrayToTree from "array-to-tree";

import commonTypes from "../common/action-types";

const types = { ...commonTypes, ...structure };

function arrangingPostions(data) {
  let tempRes = [...data];

  let temPositions1 = [];
  let temPositions2 = [];
  let temPositions3 = [];

  tempRes.forEach((e) => {
    if (e.isHeadOfInstitution || e.isHeadOfUnit) temPositions1.push({ ...e });
    else if (!e.isOnStructure || e.isShared) temPositions3.push({ ...e });
    else temPositions2.push({ ...e });
  });

  return [...temPositions1, ...temPositions2, ...temPositions3];
}


function arrangingEmployees(data) {

  let tempEmployees = [...data];
        let inServiceEmployees = [];
        let notInserveceEmployees = [];

        let notPlaced = [];
        let shared = [];

        tempEmployees.forEach((e) => {
          if (e.statusId !== 0 && !e.isActing) notInserveceEmployees.push(e);
          else if (!!!e.position) notPlaced.push(e);
          else if (e.isShared) {
            shared.push(e);
          } else inServiceEmployees.push(e);
        });

       return [
          ...inServiceEmployees,
          ...shared,
          ...notPlaced,
          ...notInserveceEmployees,
        ];
}

export const getUnits = () => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get("/api/structure/units");

      dispatch({
        type: types.SET_UNITS,
        data,
      });
    } catch (error) {
      showError(error);
    }
  };
};
//unit-types
export const getUnitTypes = () => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get("/api/structure/unit-types");

      dispatch({
        type: types.SET_UNIT_TYPES,
        data,
      });
    } catch (error) {
      showError(error);
    }
  };
};

export const getTreeUnits = (setExpandedNodes) => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get("/api/structure/units");

      const treeData = arrayToTree(data, {
        parentProperty: "parentUnitId",
        childrenProperty: "children",
        customID: "unitId",
      });

      dispatch({
        type: types.SET_UNITS,
        data: data,
      });

      dispatch({
        type: types.SET_TREE_UNITS,
        data: treeData[0] || {},
      });

      const ids = [];
      data.forEach(({ unitId }) => ids.push(unitId));
      setExpandedNodes([...ids]);
    } catch (error) {
      showError(error);
    }
  };
};

export const saveOrUpdateUnit = (
  unit,
  setFormData,
  setIsEditing,
  setShowUnitForm,
  setExpandedNodes,
  units,
  isEditing
) => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.START_LOADING });

      const formData = {
        unitName: unit.unitName,
        parentUnitId: unit.parentUnitId,
        unitTypeId: unit.unitTypeId,
        isOnStructure: unit.isOnStructure,
      };

      const { data } = !isEditing
        ? await axios.post("/api/structure/units", formData)
        : await axios.put("/api/structure/units/" + unit.unitId, formData);

      dispatch({ type: types.END_LOADING });
      showSuccess(!isEditing ? "Saved successfully" : "Updated successfully");

      setFormData({
        unitId: null,
        unitName: "",
        parentUnitId: "",
        unitTypeId: 0,
        isOnStructure: false,
      });
      setShowUnitForm(false);
      setIsEditing(false);

      const tmpUnits = [...units];
      if (isEditing) {
        const index = tmpUnits.findIndex(
          ({ unitId }) => unitId === data.unitId
        );
        tmpUnits[index] = data;
      } else tmpUnits.push(data);

      //units

      const treeData = arrayToTree(tmpUnits, {
        parentProperty: "parentUnitId",
        childrenProperty: "children",
        customID: "unitId",
      });

      dispatch({
        type: types.SET_UNITS,
        data: tmpUnits,
      });

      dispatch({
        type: types.SET_TREE_UNITS,
        data: treeData[0] || {},
      });

      const ids = [];
      tmpUnits.forEach(({ unitId }) => ids.push(unitId));
      setExpandedNodes([...ids]);
    } catch (error) {
      dispatch({ type: types.END_LOADING });
      showError(error);
    }
  };
};

//saveOrUpdateQualification

export const saveOrUpdateQualification = (
  formData,
  setFormData,
  setIsEditing,
  setShowQualificationForm,
  setSelectedQualification,
  isEditing
) => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.START_LOADING });

      const payload = {
        experience: formData.experience,
        qualificationId: formData.qualificationId,
        positionId: formData.positionId,
      };

      const { data } =  await axios.post("/api/structure/position-qualification", payload);

      dispatch({ type: types.END_LOADING });
      showSuccess(!isEditing ? "Saved successfully" : "Updated successfully");

    
      setShowQualificationForm(false);
      setSelectedQualification(null);
      setIsEditing(false);

      if (isEditing) {
        dispatch({
          type: types.UPDATE_QUALIFICATION,
          data: { ...data, ...formData },
        });
      } else {
        dispatch({
          type: types.ADD_QUALIFICATION,
          data: { ...data, ...formData },
        });
      }

      setFormData({
        degreeId: null,
        experience: null,
        qualificationId: null,
        positionId: null,
        degree: null,
        qualification: null,
        id: null,
      });

    } catch (error) {
      dispatch({ type: types.END_LOADING });
      showError(error);
    }
  };
};


export const saveProfessionalCertificate = (
  formData,
  setFormData,
  setShowProfessionalCertificateForm
) => {
  return async (dispatch) => {
    try {

      dispatch({ type: types.START_LOADING });

      const { data } =  await axios.post("/api/structure/professional-certificate", formData);

      dispatch({ type: types.END_LOADING });

      showSuccess("Saved successfully");

      setShowProfessionalCertificateForm(false);

        dispatch({
          type: types.ADD_PROFESSIONAL_CERTIFICATE,
          data: { ...data, ...formData },
        });
      

      setFormData({
        certificateTypeId: null,
        experience: null,
        professionalCertificateTypeId: null,
        positionId: null,
        professionalCertificateType: null,
      });

    } catch (error) {
      dispatch({ type: types.END_LOADING });
      showError(error);
    }
  };
};

//delete-position-qualification

export const deleteQualification = (
  formData,
  setConfirmRemoveQualification,
  setSelectedQualification
) => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.START_LOADING });

      const payload = {
        experience: formData.experience,
        qualificationId: formData.qualificationId,
        positionId: formData.positionId,
      };

      const { data } =  await axios.post("/api/structure/delete-position-qualification", payload);


      dispatch({ type: types.END_LOADING });
      showSuccess(data.message);

      dispatch({
        type: types.DELETE_QUALIFICATION,
        data: formData,
      });

      setConfirmRemoveQualification(false);
      setSelectedQualification(null);
    

    } catch (error) {
      dispatch({ type: types.END_LOADING });
      showError(error);
    }
  };
};

export const deleteUnit = (
  unitToBeRemoved,
  setConfirmRemoveUnit,
  setUnitToBeRemoved,
  setExpandedNodes,
  units
) => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.START_LOADING });

      const { data } = await axios.delete(
        "/api/structure/units/" + unitToBeRemoved.unitId
      );

      dispatch({ type: types.END_LOADING });
      showSuccess(data.message);

      setConfirmRemoveUnit(false);

      const tmpUnits = [...units];
      const index = tmpUnits.findIndex(
        ({ unitId }) => unitId === unitToBeRemoved.unitId
      );
      tmpUnits.splice(index, 1);

      const treeData = arrayToTree(tmpUnits, {
        parentProperty: "parentUnitId",
        childrenProperty: "children",
        customID: "unitId",
      });

      dispatch({
        type: types.SET_UNITS,
        data: tmpUnits,
      });

      dispatch({
        type: types.SET_TREE_UNITS,
        data: treeData[0] || {},
      });

      const ids = [];
      tmpUnits.forEach(({ unitId }) => ids.push(unitId));
      setExpandedNodes([...ids]);
      setUnitToBeRemoved("");
    } catch (error) {
      dispatch({ type: types.END_LOADING });
      showError(error);
    }
  };
};

export const setSelectedUnit = (unit) => {
  return (dispatch) => {
    dispatch({
      type: types.SELECTED_UNIT,
      data: unit,
    });
  };
};

export const setSearchUnit = (searchTeam, units, setExpandedNodes) => {
  return (dispatch) => {
    dispatch({
      type: types.SEARCH_UNIT,
      data: "",
    });

    let data = [...units].filter(({ unitName }) =>
      unitName.toLowerCase().includes(searchTeam.toLowerCase())
    );
    const treeData = arrayToTree(data, {
      parentProperty: "parentUnitId",
      childrenProperty: "children",
      customID: "unitId",
    });

    dispatch({
      type: types.SET_TREE_UNITS,
      data: treeData[0] || {},
    });

    const ids = [];
    data.forEach(({ unitId }) => ids.push(unitId));
    setExpandedNodes([...ids]);
  };
};
//setSearchPositions

export const setSearchPositions = (
  searchTeam,
  positions,
  searchCurrentPositions
) => {
  return (dispatch) => {
    dispatch({
      type: types.SEARCH_POSITION,
      data: "",
    });

    dispatch({
      type: types.SEARCH_CURRENT_POSITIONS,
      data: !!searchCurrentPositions.length
        ? searchCurrentPositions
        : positions,
    });

    let data = [];

    if (!searchTeam) {
      data = searchCurrentPositions;
    } else {
      data = [...positions].filter(({ name }) =>
        name.toLowerCase().includes(searchTeam.toLowerCase())
      );
    }

    dispatch({
      type: types.SET_POSITIONS,
      data,
    });
  };
};

export const getPositions = (unitId) => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.START_LOADING });

      dispatch({
        type: types.SET_POSITIONS,
        data: [],
      });

      dispatch({
        type: types.SEARCH_CURRENT_POSITIONS,
        data: [],
      }); 
      
      dispatch({
        type: types.SEARCH_POSITION,
        data: "",
      });

      const { data } = await axios.get("/api/structure/positions/" + unitId);

      dispatch({
        type: types.SET_POSITIONS,
        data: arrangingPostions(data),
      });
      dispatch({ type: types.END_LOADING });
    } catch (error) {
      dispatch({ type: types.END_LOADING });
      showError(error);
    }
  };
};

//savePosition

export const savePosition = (formData, extraData, setShowPositionForm) => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.START_LOADING });
      const { data } = await axios.post("/api/structure/positions", formData);

      const payload = { ...data, ...extraData };
      dispatch({
        type: types.ADD_POSITION,
        data: payload,
      });
      setShowPositionForm(false);
      dispatch({ type: types.END_LOADING });
    } catch (error) {
      dispatch({ type: types.END_LOADING });
      showError(error);
    }
  };
};
export const updatePosition = (
  positionId,
  formData,
  setShowUpdatePositionModal
) => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.START_LOADING });
      const { data } = await axios.put(
        "/api/structure/positions/" + positionId,
        formData
      );

      const payload = { ...data, ...formData };
      dispatch({
        type: types.UPDATE_POSITION,
        data: payload,
      });
      setShowUpdatePositionModal(false);
      dispatch({ type: types.END_LOADING });
      showSuccess("Updated successfully");
    } catch (error) {
      dispatch({ type: types.END_LOADING });
      showError(error);
    }
  };
};
//deletePosition

export const deletePosition = (
  positionToBeRemoved,
  setConfirmRemovePosition,
  setPositionToBeRemoved
) => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.START_LOADING });

      const { data } = await axios.delete(
        "/api/structure/positions/" + positionToBeRemoved.id
      );

      dispatch({ type: types.END_LOADING });
      showSuccess(data.message);

      setConfirmRemovePosition(false);

      dispatch({
        type: types.DELETE_POSITION,
        data: positionToBeRemoved,
      });

      setPositionToBeRemoved("");
    } catch (error) {
      dispatch({ type: types.END_LOADING });
      showError(error);
    }
  };
};
//deleteProfessionalCertificate

export const deleteProfessionalCertificate = (
  selectedCertificate,
  setConfirmRemoveCertificate,
  setSelectedCertificate
) => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.START_LOADING });

      const formData={
        experience: selectedCertificate.experience,
        professionalCertificateId: selectedCertificate.professionalCertificateId,
        positionId: selectedCertificate.positionId,
      }

     const { data } = await axios.post("/api/structure/delete-professional-certificate", formData);

      dispatch({ type: types.END_LOADING });
      showSuccess(data.message);

      setSelectedCertificate(null);
      setConfirmRemoveCertificate(false);

      dispatch({
        type: types.DELETE_PROFESSIONAL_CERTIFICATE,
        data: selectedCertificate,
      });

    } catch (error) {
      dispatch({ type: types.END_LOADING });
      showError(error);
    }
  };
};
//deletePositionKnowledge

export const deletePositionKnowledge = (
  selectedPositionKnowledge,
  setConfirmRemovePositionKnowledge,
  setSelectedPositionKnowledge
) => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.START_LOADING });

      const formData={
        knowledgeId: selectedPositionKnowledge.knowledgeId,
        positionId: selectedPositionKnowledge.positionId,
      }

     const { data } = await axios.post("/api/structure/delete-position-knowledge", formData);

      dispatch({ type: types.END_LOADING });
      showSuccess(data.message);

      dispatch({
        type: types.DELETE_POSITION_KNOWLEDGE,
        data: selectedPositionKnowledge,
      });

      setSelectedPositionKnowledge(null);
      setConfirmRemovePositionKnowledge(false);
    

    } catch (error) {
      dispatch({ type: types.END_LOADING });
      showError(error);
    }
  };
};


export const savePositionKnowledge = (
  formData,
  setFormData,
  setShowPositionKnowledgeForm
) => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.START_LOADING });

      const payload={
        knowledgeId: formData.knowledgeId,
        positionId: formData.positionId,
      }

     const { data } = await axios.post("/api/structure/position-knowledge", payload);

      dispatch({ type: types.END_LOADING });
      showSuccess(data.message);

     
      dispatch({
        type: types.ADD_POSITION_KNOWLEDGE,
        data: { ...data, ...formData },
      });

      setFormData({
        knowledgeId: null,
        positionId: null,
        knowledgeName:null
      });

      setShowPositionKnowledgeForm(false);
    

    } catch (error) {
      dispatch({ type: types.END_LOADING });
      showError(error);
    }
  };
};


export const setAsPlanner = (position) => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.START_LOADING });

      const { data } = await axios.put(
        "/api/structure/set-as-planner/" + position.id
      );

      dispatch({ type: types.END_LOADING });
      showSuccess(data.message);

      dispatch({
        type: types.SET_POSITION_PLANNER,
        data: position,
      });
    } catch (error) {
      dispatch({ type: types.END_LOADING });
      showError(error);
    }
  };
};
//set-as-head-unity
export const setAsHeadOfUnity = (position) => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.START_LOADING });

      const { data } = await axios.put(
        "/api/structure/set-as-head-unity/" + position.id
      );

      dispatch({ type: types.END_LOADING });
      showSuccess(data.message);

      dispatch({
        type: types.SET_POSITION_HEAD_UNITY,
        data: position,
      });
    } catch (error) {
      dispatch({ type: types.END_LOADING });
      showError(error);
    }
  };
};

/*
 * @Get SalaryStructure
 * GET /api/structure/salary-structures?mainEntityId
 */

export const getSalaryStructure = (mainEntityId) => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get(
        "/api/structure/salary-structures?mainEntityId=" + mainEntityId
      );

      dispatch({
        type: types.GET_SALARY_STRUCTURE,
        data,
      });
    } catch (error) {
      showError(error);
    }
  };
};

/*
 * @Get EmployeeGroup
 * GET /api/structure/employee-groups
 */

export const getEmployeeGroups = () => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get("/api/structure/employee-groups");

      dispatch({
        type: types.GET_EMPLOYEE_GROUPS,
        data,
      });
    } catch (error) {
      showError(error);
    }
  };
};

/*
 * @Get HiringMode
 * GET /api/structure/hiring-modes
 */

export const getHiringModes = () => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get("/api/structure/hiring-modes");

      dispatch({
        type: types.GET_HIRING_MODES,
        data,
      });
    } catch (error) {
      showError(error);
    }
  };
};

/*
 * @ Get PositionEmployees
 * GET /api/structure/position-employees
 */

export const getPositionEmployees = (positionId) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: types.GET_POSITION_EMPLOYEES,
        data: [],
      });
      dispatch({ type: types.START_LOADING });
      const { data } = await axios.get(
        "/api/structure/position-employees/" + positionId
      );

      dispatch({
        type: types.GET_POSITION_EMPLOYEES,
        data,
      });
      dispatch({ type: types.END_LOADING });
    } catch (error) {
      dispatch({ type: types.END_LOADING });
      showError(error);
    }
  };
};

/*
 * @ Get levels
 * GET /api/structure/levels
 */

export const getLevels = () => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get("/api/structure/levels");

      dispatch({
        type: types.GET_LEVELS,
        data,
      });
    } catch (error) {
      showError(error);
    }
  };
};

/*
 * @ Get Echelons
 * GET /api/structure/echelons
 */

export const getEchelons = () => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get("/api/structure/echelons");

      dispatch({
        type: types.GET_ECHELONS,
        data,
      });
    } catch (error) {
      showError(error);
    }
  };
};

/*
 * @Get SupervisorPositions
 * GET /api/structure/supervisor-positions
 */

export const getSupervisorPositions = () => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get("/api/structure/supervisor-positions");

      dispatch({
        type: types.GET_SUPERVISOR_POSITIONS,
        data,
      });
    } catch (error) {
      showError(error);
    }
  };
};

/*
 * @Get getPostionQualifications
 * GET /api/structure/position-qualifications
 */
export const getPostionQualifications = (positionId) => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get(
        "/api/structure/position-qualifications/" + positionId
      );

      dispatch({
        type: types.GET_POSITION_QUALIFICATIONS,
        data,
      });
    } catch (error) {
      showError(error);
    }
  };
};

/*
 * @Get getProfessionalCertificates
 * GET /api/structure/position-qualifications
 */
export const getProfessionalCertificates = (positionId) => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get(
        "/api/structure/professional-certificates/" + positionId
      );

      dispatch({
        type: types.GET_PROFESSIONAL_CERTIFICATES,
        data,
      });
    } catch (error) {
      showError(error);
    }
  };
};

/*
 * @Get getPositionKnowledges
 * GET /api/structure/position-knowledges
 */
export const getPositionKnowledges = (positionId) => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get(
        "/api/structure/position-knowledges/" + positionId
      );

      dispatch({
        type: types.GET_POSITION_KNOWLEDGES,
        data,
      });
    } catch (error) {
      showError(error);
    }
  };
};
/*
 * @Get getDegrees
 * GET /api/structure/degrees
 */
export const getDegrees = () => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get("/api/structure/degrees");

      dispatch({
        type: types.GET_DEGREES,
        data,
      });
    } catch (error) {
      showError(error);
    }
  };
};

/*
 * @Get DegreeQualifications
 * GET /api/structure/degree-qualifications
 */
export const getDegreeQualifications = (degreeId) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: types.GET_DEGREE_QUALIFICATIONS,
        data: [],
      });

      const { data } = await axios.get(
        "/api/structure/degree-qualifications/" + degreeId
      );

      dispatch({
        type: types.GET_DEGREE_QUALIFICATIONS,
        data,
      });
    } catch (error) {
      dispatch({
        type: types.GET_DEGREE_QUALIFICATIONS,
        data: [],
      });
      showError(error);
    }
  };
};

/*
 * @Get knowledge
 * GET /api/lookup/knowledge
 */
export const getknowledge = () => {
  return async (dispatch) => {
    try {
      dispatch({
        type: types.GET_KNOWLEDGE,
        data: [],
      });

      const { data } = await axios.get(
        "/api/lookup/knowledge"
      );

      dispatch({
        type: types.GET_KNOWLEDGE,
        data,
      });
    } catch (error) {
      dispatch({
        type: types.GET_KNOWLEDGE,
        data: [],
      });
      showError(error);
    }
  };
};


/*
 * @Get certificateTypes
 * GET /api/lookup/certificate-types
 */
export const getCertificateTypes = () => {
  return async (dispatch) => {
    try {
      dispatch({
        type: types.GET_CERTIFICATE_TYPES,
        data: [],
      });

      const { data } = await axios.get(
        "/api/lookup/certificate-types"
      );

      dispatch({
        type: types.GET_CERTIFICATE_TYPES,
        data,
      });
    } catch (error) {
      dispatch({
        type: types.GET_CERTIFICATE_TYPES,
        data: [],
      });
      showError(error);
    }
  };
};

/*
 * @Get professionalCertificateTypes
 * GET /api/lookup/professional-certificate-types/:certificateTypeId
 */
export const getProfessionalCertificateTypes = (certificateTypeId) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: types.GET_PROFESSIONAL_CERTIFICATE_TYPES,
        data: [],
      });

      const { data } = await axios.get(
        "/api/lookup/professional-certificate-types/"+certificateTypeId
      );

      dispatch({
        type: types.GET_PROFESSIONAL_CERTIFICATE_TYPES,
        data,
      });
    } catch (error) {
      dispatch({
        type: types.GET_PROFESSIONAL_CERTIFICATE_TYPES,
        data: [],
      });
      showError(error);
    }
  };
};


/********************************************* EMPLOYEEEEE***************************************** */


//setSearchEmployees

export const setSearchEmployees = (
  searchTeam,
  employees,
  searchCurrentEmployees
) => {
  return (dispatch) => {
    dispatch({
      type: types.SEARCH_EMPLOYEES,
      data: "",
    });

    dispatch({
      type: types.SEARCH_CURRENT_EMPLOYEES,
      data: !!searchCurrentEmployees.length
        ? searchCurrentEmployees
        : employees,
    });

    let data = [];

    if (!searchTeam) {
      data = searchCurrentEmployees;
    } else {
      data = [...employees].filter(({ firstName,lastName,employeeId }) =>
          firstName.toLowerCase().includes(searchTeam.toLowerCase()) 
      ||  lastName.toLowerCase().includes(searchTeam.toLowerCase())
      ||  employeeId.toString().toLowerCase().includes(searchTeam.toLowerCase())
     
      );
    }

    dispatch({
      type: types.SET_EMPLOYEES,
      data:arrangingEmployees(data),
    });
  };
};

export const getEmployees = (unitId) => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.START_LOADING });
      dispatch({
        type: types.SET_EMPLOYEES,
        data: [],
      }); 

      dispatch({
        type: types.SEARCH_CURRENT_EMPLOYEES,
        data: [],
      }); 
      
      dispatch({
        type: types.SEARCH_EMPLOYEES,
        data: "",
      });
  
      const { data } = await axios.get("/api/structure/employees/" + unitId);

      dispatch({
        type: types.SET_EMPLOYEES,
        data: arrangingEmployees(data),
      });
      dispatch({ type: types.END_LOADING });
    } catch (error) {
      dispatch({ type: types.END_LOADING });
      showError(error);
    }
  };
};


export const getNationalIdDetail = (idNumber) => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.START_LOADING });

      dispatch({
        type: types.GET_NATIONAL_ID_DETAIL,
        data: null,
      }); 

  
      const { data } = await axios.get("/api/external/nid-number-detail/" + idNumber);

      dispatch({
        type: types.GET_NATIONAL_ID_DETAIL,
        data: data,
      });
      dispatch({ type: types.END_LOADING });
    } catch (error) {
      dispatch({ type: types.END_LOADING });
      showError(error);
    }
  };
};
