import {
  Tooltip,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogTitle,
  IconButton,
  DialogActions,
  DialogContent,
  Divider,
  Badge,
  MenuItem,
  Avatar,
  Menu,
  CircularProgress,
  Typography,
  Chip,
  Tabs,
  Tab,
  Button,
  Alert,
} from "@mui/material";
import moment from "moment";
import { useHistory, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import {
  getSubordinateActivities,
  downloadEmployeePerformanceReport,
  getSubordinates,
  selectActivity,
  getSubordinatesEvaluations,
  evaluateSubmission,
  removeEvaluation,
  removeSubmission,
  submitActivityReport,
  downloadActivityReportFile,
  competenciesDescriptors,
  getCompetenciesDescriptors,
  saveCompetenciesEvaluations,
  getSingleSubordinateEvaluations,
  confirmCompetenciesDescriptors,
} from "../../../store/rbm/actions";
import { Box } from "@mui/system";
import ReactPaginate from "react-paginate";
import defaultProfile from "../../assets/default-profile.jpg";
import { isEmpty } from "lodash";
import EvaluationActivityDialog from "./EvaluationActivityDialog";
import EvaluationQuarterCard from "./EvaluationQuarterCard";
import PropTypes from "prop-types";
import SubordinateActivities from "./SubordinateActivities";
import EmployeeCompentencies from "./EmployeeCompentencies";
import ConfirmationDialog from "./ConfirmationDialog";

const SubordinateActivitiesDialog = (props) => {
  const history = useHistory();

  const {
    subordinateActivities,
    subordnateScore,
    loading,
    getSubordinateActivities,
    getSubordinatesEvaluations,
    downloadEmployeePerformanceReport,
    getSubordinates,
    subordinates,
    isDialogOpen,
    setIsDialogOpen,
    employee,
    selectActivity,
    selectedActivity,
    competenciesDescriptors,
    getCompetenciesDescriptors,
    saveCompetenciesEvaluations,
    getSingleSubordinateEvaluations,
    confirmCompetenciesDescriptors,
  } = props;

  const dispatch = useDispatch();

  const [activityScore, setActivityScore] = useState(0);
  const [compentencyScore, setCompentencyScore] = useState(0);
  const [totalProgress, setTotalProgress] = useState(0);
  const [competenciesApproved, setCompetenciesApproved] = useState(false);

  useEffect(() => {
    if (isDialogOpen && !!employee) {
      getSubordinateActivities(employee.id);
      getCompetenciesDescriptors(employee.id);
    }

    if (!isDialogOpen && !subordinates.length) getSubordinates();
  }, [isDialogOpen]);

  const onSaveCompetenciesEvaluations = (payload) => {
    saveCompetenciesEvaluations(payload);
  };

  // useEffect(() => {
  //   let weight = 0,
  //     score = 0;
  //   subordinateActivities.forEach((myActivity) => {
  //     myActivity.activities.forEach((activity) => {
  //       score =
  //         score +
  //         ((activity.score -
  //           ((activity.employeeTimePenalities || 0) +
  //             (activity.employeeQualityPenalities || 0))) *
  //           activity.weight) /
  //           100;

  //       weight = weight + activity.weight;
  //     });
  //   });
  //   score = (score * 100) / (weight || 1);

  //   let compentencyScore = 0;
  //   let approved = false;

  //   competenciesDescriptors.forEach((competency) => {
  //     competency.descriptors.forEach((descriptor) => {
  //       if (!!descriptor.isAdded && !!descriptor.approved) {
  //         compentencyScore = compentencyScore + descriptor.score * 10;

  //         approved = true;
  //       }
  //     });
  //   });

  //   if (approved) setCompetenciesApproved(true);
  //   else setCompetenciesApproved(false);

  //   setActivityScore(score * 0.7);
  //   setCompentencyScore((compentencyScore / 4) * 0.3 * 0.9);

  //   setTotalProgress(score * 0.7 + (compentencyScore / 4) * 0.3 * 0.9);
  // }, [subordinateActivities, competenciesDescriptors]);

  useEffect(() => {
    if (!!isDialogOpen) {
      let approved = false;
      competenciesDescriptors.forEach((competency) => {
        competency.descriptors.forEach((descriptor) => {
          if (!!descriptor.isAdded && !!descriptor.approved) {
            approved = true;
          }
        });
      });

      if (approved) setCompetenciesApproved(true);
      else setCompetenciesApproved(false);
    }
  }, [isDialogOpen]);

  const onClose = () => {
    setIsDialogOpen(false);
    if (!!employee) getSingleSubordinateEvaluations(employee.id);
  };

  const [tabValue, setTabValue] = useState(0);
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const [canEvaluate, setCanEvaluate] = useState(false);
  const [activeTab, setActiveTab] = useState("");

  useEffect(() => {
    const curDate = moment().format("MM-DD");

    if (curDate >= "04-01" && curDate <= "07-31") setCanEvaluate(true);
  }, []);

  const [confirmEvaluateCompetencies, setConfirmEvaluateCompetencies] =
    useState(false);

  return (
    <>
      <Dialog fullWidth maxWidth="xl" onClose={onClose} open={isDialogOpen}>
        <DialogTitle className="text-primary pb-0 mb-0">
          <span>
            <i className="fas fa-user mr-1 "></i>
            {employee.firstName} {employee.lastName}
            <span className="font-weight-bold text-uppercase text-primary">
              <Tooltip title="Overall score">
                <div
                  className="progress bg-white  mt-1"
                  style={{
                    border: "1px solid rgba(0, 0, 0, 0.12)",
                    cursor: "default",
                  }}
                >
                  <div
                    className={`progress-bar  text-${
                      (subordnateScore?.totalScore || 0) < 5 ? "dark" : "light"
                    }  bg-${
                      (subordnateScore?.totalScore || 0) < 50
                        ? "danger"
                        : (subordnateScore?.totalScore || 0) < 70
                        ? "warning"
                        : (subordnateScore?.totalScore || 0) < 100
                        ? "info"
                        : "success"
                    }`}
                    role="progressbar"
                    style={{
                      width:
                        (subordnateScore?.totalScore || 0) < 0
                          ? "0%"
                          : (subordnateScore?.totalScore || 0) + "%",
                    }}
                    aria-valuenow={
                      (subordnateScore?.totalScore || 0) < 0
                        ? "0"
                        : subordnateScore?.totalScore || 0
                    }
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    <span
                      className={`ml-5 ${
                        (subordnateScore?.totalScore || 0) < 0
                          ? "text-danger"
                          : (subordnateScore?.totalScore || 0) < 5 &&
                            (subordnateScore?.totalScore || 0) > 0
                          ? "text-dark"
                          : ""
                      }`}
                    >
                      {(subordnateScore?.totalScore || 0).toFixed(2)}%
                    </span>
                  </div>
                </div>
              </Tooltip>
            </span>
            {/* {!canEvaluate && (
              <Alert severity="error" className="mt-2">
                Competencies evaluation is locked. It will be done during the 4
                <sup>th</sup> quarter
              </Alert>
            )} */}
            <Box
              sx={{ width: "100%", bgcolor: "background.paper" }}
              className="mb-3"
            >
              <Tabs value={tabValue} onChange={handleTabChange} centered>
                <Tab
                  onClick={() => setActiveTab("activities")}
                  label={
                    <>
                      Evaluate Activities (70%)
                      <span
                        className={`badge px-2 badge-${
                          ((subordnateScore?.activityScore || 0) * 100) / 70 <
                          50
                            ? "danger"
                            : ((subordnateScore?.activityScore || 0) * 100) /
                                70 <
                              70
                            ? "warning"
                            : ((subordnateScore?.activityScore || 0) * 100) /
                                70 <
                              100
                            ? "info"
                            : "success"
                        }`}
                      >
                        {(subordnateScore?.activityScore || 0).toFixed(2)}/70
                      </span>
                    </>
                  }
                  {...a11yProps(0)}
                />
                <Tab
                  onClick={() => setActiveTab("competencies")}
                  label={
                    <>
                      Evaluate Competencies (30%)
                      {!!(subordnateScore?.competencyScore || 0) && (
                        <span
                          className={`badge px-2 badge-${
                            ((subordnateScore?.competencyScore || 0) * 100) /
                              30 <
                            50
                              ? "danger"
                              : ((subordnateScore?.competencyScore || 0) *
                                  100) /
                                  30 <
                                70
                              ? "warning"
                              : ((subordnateScore?.competencyScore || 0) *
                                  100) /
                                  30 <
                                80
                              ? "info"
                              : "success"
                          }`}
                        >
                          {(subordnateScore?.competencyScore || 0).toFixed(2)}
                          /30
                        </span>
                      )}
                      {!(subordnateScore?.competencyScore || 0) && (
                        <span className="badge px-2 badge-secondary">
                          Not evaluated
                        </span>
                      )}
                    </>
                  }
                  {...a11yProps(1)}
                />
              </Tabs>
            </Box>
          </span>

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
        <DialogContent>
          <div style={{ minHeight: "67vh" }}>
            <TabPanel value={tabValue} index={0}>
              <SubordinateActivities
                subordinateActivities={subordinateActivities}
                subordinates={subordinates}
                loading={loading}
              />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <EmployeeCompentencies
                employee={employee}
                competenciesDescriptors={competenciesDescriptors}
                onSaveCompetenciesEvaluations={onSaveCompetenciesEvaluations}
                competenciesApproved={competenciesApproved}
              />
            </TabPanel>
          </div>
        </DialogContent>
        <DialogActions className="py-3 d-flex justify-content-center">
          {activeTab === "competencies" && (
            <Button
              disabled={loading}
              onClick={() => setConfirmEvaluateCompetencies(true)}
              variant="contained"
            >
              Confirm Competencies Evaluation
            </Button>
          )}
        </DialogActions>
        <ConfirmationDialog
          confirmationDialog={confirmEvaluateCompetencies}
          message="Are you sure you want to confirm competencies evaluation?"
          setConfirmationDialog={setConfirmEvaluateCompetencies}
          onYes={() => {
            confirmCompetenciesDescriptors(
              employee.id,
              setConfirmEvaluateCompetencies
            );
          }}
        />
      </Dialog>
    </>
  );
};

const mapStateToProps = ({
  subordinateActivities,
  subordnateScore,
  loading,
  user,
  strongPassword,
  subordinateActivitiesSummary,
  subordinates,
  selectedActivity,
  competenciesDescriptors,
}) => {
  return {
    subordinateActivities,
    subordnateScore,
    loading,
    user,
    strongPassword,
    subordinateActivitiesSummary,
    subordinates,
    selectedActivity,
    competenciesDescriptors,
  };
};
export default connect(mapStateToProps, {
  getSubordinateActivities,
  downloadEmployeePerformanceReport,
  getSubordinates,
  selectActivity,
  getSubordinatesEvaluations,
  evaluateSubmission,
  removeEvaluation,
  removeSubmission,
  submitActivityReport,
  downloadActivityReportFile,
  getCompetenciesDescriptors,
  saveCompetenciesEvaluations,
  getSingleSubordinateEvaluations,
  confirmCompetenciesDescriptors,
})(SubordinateActivitiesDialog);

export const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
};

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

export const a11yProps = (index) => {
  return {
    id: `tab-${index}`,
    "aria-controls": `tabpanel-${index}`,
  };
};
