import { Tooltip, Card, CardContent, CardHeader } from "@mui/material";
import { useHistory } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  getMyActivities,
  downloadEmployeePerformanceReport,
  getSubordinates,
} from "../../../store/rbm/actions";
import QuarterCard from "../components/QuarterCard";

const MyActivities = (props) => {
  const history = useHistory();
  const {
    user,
    myActivities,
    myScores,
    loading,
    getMyActivities,
    downloadEmployeePerformanceReport,
    getSubordinates,
    subordinates,
    selectedFiscalYear,
  } = props;

  const [totalProgress, setTotalProgress] = useState(0);

  const [myActivitiesSummary, setMyActivitiesSummary] = useState({
    allActivities: 0,
    dueActivities: 0,
    reportedActivities: 0,
    scoredActivities: 0,
    targetAchieved: 0,
  });

  useEffect(() => {
    if (!loading && !myActivities.length) getMyActivities(history);
    if (!loading && !subordinates.length) getSubordinates();
  }, []);

  useEffect(() => {
    let weight = 0,
      score = 0,
      allActivities = 0,
      dueActivities = 0,
      reportedActivities = 0,
      scoredActivities = 0,
      targetAchieved = 0,
      totalTarget = 0;
    myActivities.forEach((myActivity) => {
      myActivity.activities.forEach((activity) => {
        allActivities = ++allActivities;
        if (activity.isDue) ++dueActivities;

        if (
          !!activity.scorePublished ||
          user.position.isTechnicalHead ||
          (!!user.actingPosition && user.actingPosition.isTechnicalHead)
        )
          targetAchieved = targetAchieved + activity.achievedTarget;
        totalTarget = totalTarget + activity.targetShare;

        if (
          activity.status === "Reported" ||
          activity.status === "Scored" ||
          activity.status === "Rejected"
        )
          reportedActivities++;
        if (activity.status === "Scored" || activity.status === "Rejected")
          ++scoredActivities;

        if (
          !!activity.scorePublished ||
          user.position.isTechnicalHead ||
          (!!user.actingPosition && user.actingPosition.isTechnicalHead)
        )
          score =
            score +
            ((activity.score -
              (!!user && user.position && user.position.isSupervisor
                ? activity.unitId !== user.unit.id
                  ? 0
                  : activity.supervisorTimePenalities
                : (activity.employeeTimePenalities || 0) +
                  (activity.employeeQualityPenalities || 0))) *
              activity.weight) /
              100;

        weight = weight + activity.weight;
      });
    });

    if ((score * 100) / (weight || 1) >= 90 && selectedFiscalYear.id === "2122")
      setTotalProgress((score * 100) / (weight || 1) - 8.0);
    else setTotalProgress((score * 100) / (weight || 1));

    setMyActivitiesSummary({
      allActivities,
      dueActivities,
      reportedActivities,
      scoredActivities,
      targetAchieved: (targetAchieved * 100) / (totalTarget || 1),
    });
  }, [myActivities]);

  return (
    <>
      <div className="row no-gutter justify-content-center">
        <div className="col-12 col-lg-11 px-0 px-md-3">
          <h6 className="d-flex justify-content-between">
            <span>Employee activities</span>
          </h6>
          <Card
            className=" "
            variant="outlined"
            style={{ backgroundColor: "#f6f8fa" }}
          >
            <CardHeader
              subheader={
                <>
                  {!!user && (
                    <span className="font-weight-bold text-uppercase text-primary">
                      <i className="fas fa-user mr-1 "></i>
                      {user.firstName} {user.lastName}
                      <Tooltip title="My Score">
                        <div
                          className="progress bg-white   mr-2"
                          style={{
                            border: "1px solid rgba(0, 0, 0, 0.12)",
                            cursor: "default",
                          }}
                        >
                          <div
                            className={`progress-bar  text-${
                              (myScores.totalScore || 0) < 5 ? "dark" : "light"
                            }  bg-${
                              (myScores.totalScore || 0) < 50
                                ? "danger"
                                : (myScores.totalScore || 0) < 70
                                ? "warning"
                                : (myScores.totalScore || 0) < 100
                                ? "info"
                                : "success"
                            }`}
                            role="progressbar"
                            style={{ width: (myScores.totalScore || 0) + "%" }}
                            aria-valuenow={myScores.totalScore || 0}
                            aria-valuemin="0"
                            aria-valuemax="100"
                          >
                            <span
                              className={`ml-5 ${
                                (myScores.totalScore || 0) < 0
                                  ? "text-danger"
                                  : (myScores.totalScore || 0) < 5 &&
                                    (myScores.totalScore || 0) > 0
                                  ? "text-dark"
                                  : ""
                              }`}
                            >
                              {(myScores.totalScore || 0).toFixed(2)}%
                            </span>
                          </div>
                        </div>
                      </Tooltip>
                    </span>
                  )}
                </>
              }
            />

            <div className="px-4 pb-3">
              <Card variant="outlined">
                <div className="row no-gutters summary-card justify-content-center py-3">
                  <div className="col-12 col-md-4 col-lg-1  align-items-center text-center py-2  summary-card py-3">
                    <span className="d-block">Activities</span>
                    <span className="font-weight-bold">
                      {myActivitiesSummary.allActivities || 0}
                    </span>
                  </div>
                  <div className="col-12 col-md-4 col-lg-1  align-items-center text-center py-2  summary-card py-3">
                    <span className="d-block">Due </span>
                    <span className="font-weight-bold">
                      {myActivitiesSummary.dueActivities || 0}
                    </span>
                  </div>
                  <div className="col-12 col-md-4 col-lg-1  align-items-center text-center py-2  summary-card py-3">
                    <span className="d-block">Reported</span>
                    <span className="font-weight-bold">
                      {myActivitiesSummary.reportedActivities || 0}
                    </span>
                  </div>
                  <div className="col-12 col-md-4 col-lg-2 text-center py-2  summary-card py-3">
                    <span className="d-block">Scored</span>
                    <span className="font-weight-bold">
                      {myActivitiesSummary.scoredActivities || 0}
                    </span>
                  </div>
                  <div className="col-12 col-md-4 col-lg-1 text-center py-2  summary-card py-3">
                    <span className="d-block">Target achieved</span>
                    <span className="font-weight-bold">
                      {(myActivitiesSummary.targetAchieved || 0).toFixed(2)}%
                    </span>
                  </div>

                  <div className="col-12 col-md-4 col-lg-2 text-center py-2  summary-card py-3">
                    <span className="d-block">Activity Score</span>
                    <span className="font-weight-bold">
                      {(myScores.activityScore || 0 || 0).toFixed(2)}/70
                    </span>
                  </div>

                  <div className="col-12 col-md-4 col-lg-2 text-center py-2  summary-card py-3">
                    <span className="d-block">Competency Score</span>
                    <span className="font-weight-bold">
                      {(myScores.competencyScore || 0 || 0).toFixed(2)}/30
                    </span>
                  </div>

                  <div className="col-12 col-md-4 col-lg-1 text-center py-2  summary-card py-3">
                    <span className="d-block">Total Score</span>
                    <span className="font-weight-bold">
                      {(myScores.totalScore || 0 || 0).toFixed(2)}%
                    </span>
                  </div>

                  {myActivitiesSummary.allActivities > 0 && (
                    <div className="col-12 col-md-4 col-lg-1 d-flex justify-content-center  align-items-center py-2  summary-card">
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm d-flex justify-content-center  align-items-center"
                        disabled={loading}
                        onClick={() => downloadEmployeePerformanceReport(user)}
                      >
                        <span className="material-icons">download</span>
                        <span className="material-icons">picture_as_pdf</span>
                      </button>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            <CardContent className="px-0 px-md-4">
              {myActivities.map((quarter, index) => (
                <QuarterCard
                  totalWeight={0}
                  quarter={quarter}
                  key={quarter.quarterId}
                />
              ))}

              {!loading && myActivitiesSummary.allActivities === 0 && (
                <div className="jumbotron jumbotron-fluid text-center">
                  <div className="container">
                    <p className="lead">
                      You don't have any activity assigned to you!
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = ({
  myActivities,
  myScores,
  loading,
  user,
  strongPassword,
  myActivitiesSummary,
  subordinates,
  selectedFiscalYear,
}) => {
  return {
    myActivities,
    myScores,

    loading,
    user,
    strongPassword,
    myActivitiesSummary,
    subordinates,
    selectedFiscalYear,
  };
};
export default connect(mapStateToProps, {
  getMyActivities,
  downloadEmployeePerformanceReport,
  getSubordinates,
})(MyActivities);
