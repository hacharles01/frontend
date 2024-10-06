import {
  Tooltip,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Skeleton,
} from "@mui/material";
import { useHistory, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import {
  getIndicatorActivities,
  getSubordinates,
} from "../../../store/rbm/actions";
import QuarterCard from "../components/QuarterCard";
import types from "../../../store/rbm/action-types";

const Activities = (props) => {
  const history = useHistory();
  const location = useLocation();
  const {
    selectedIndicator,
    indicatorActivities,
    loading,
    getIndicatorActivities,
    getSubordinates,
    subordinates,
  } = props;

  const [totalProgress, setTotalProgress] = useState(0);
  const [totalWeight, setTotalWeight] = useState(0);
  const [numOfActivities, setNumOfActivities] = useState(0);

  const dispatch = useDispatch();

  useEffect(
    () => {
      if (!selectedIndicator.id) return history.push("/rbm/expected-results");
      getIndicatorActivities(selectedIndicator.id);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedIndicator]
  );

  useEffect(() => {
    let weight = 0,
      score = 0,
      numOfActivities = 0;
    indicatorActivities.forEach((quarter) => {
      numOfActivities = numOfActivities + quarter.activities.length;
      quarter.activities.forEach((activity) => {
        weight = weight + activity.weight;
        score =
          score +
          ((activity.score -
            ((activity.employeeTimePenalities || 0) +
              (activity.employeeQualityPenalities || 0))) *
            activity.weight) /
            100;
      });
    });

    setTotalWeight(weight.toFixed(2));
    setTotalProgress(score);
    setNumOfActivities(numOfActivities);
  }, [indicatorActivities]);

  useEffect(
    () => {
      if (!subordinates.length) getSubordinates();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <>
      <div className="row no-gutter justify-content-center">
        <div className="col-12 col-lg-11 px-0 px-md-3">
          <h6 className="d-flex justify-content-between">
            <span>
              Activities
              <Tooltip title="Total weight">
                <span
                  style={{ cursor: "pointer" }}
                  className={`badge badge-${
                    +totalWeight === 100 ? "success" : "danger"
                  } ml-1 py-1`}
                >
                  <i className="fas fa-weight-hanging mr-1"></i> {totalWeight}
                </span>
              </Tooltip>
            </span>
          </h6>
          <Card
            className="mb-3 py-3 "
            variant="outlined"
            style={{ backgroundColor: "#f6f8fa" }}
          >
            <CardHeader
              avatar={
                <IconButton
                  onClick={() => {
                    dispatch({
                      type: types.SET_INDICATOR_ACTIVITIES,
                      data: [],
                    });

                    dispatch({
                      type: types.SET_SELECTED_INDICATOR,
                      data: {},
                    });

                    if (location.pathname === "/rbm/unit-indicators/activities")
                      history.push("/rbm/unit-indicators");
                    else history.push("/rbm/expected-results/indicators");
                  }}
                >
                  <span className="material-icons text-info">arrow_back</span>
                </IconButton>
              }
              subheader={
                <span className="font-weight-bold text-uppercase text-primary">
                  <i className="fas fa-folder-open mr-1 "></i>

                  {selectedIndicator.name}
                  {selectedIndicator.id && (
                    <Tooltip title="Progress">
                      <div
                        className="progress bg-white   mr-2"
                        style={{
                          border: "1px solid rgba(0, 0, 0, 0.12)",
                          cursor: "default",
                        }}
                      >
                        <div
                          className={`progress-bar  text-${
                            totalProgress < 2 ? "dark" : "light"
                          }  bg-${
                            totalProgress < 50
                              ? "danger"
                              : totalProgress < 70
                              ? "warning"
                              : totalProgress < 100
                              ? "info"
                              : "success"
                          }`}
                          role="progressbar"
                          style={{ width: totalProgress + "%" }}
                          aria-valuenow={totalProgress}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        >
                          <span
                            className={`ml-5 ${
                              totalProgress < 0
                                ? "text-danger"
                                : totalProgress < 2 && totalProgress > 0
                                ? "text-dark"
                                : ""
                            }`}
                          >
                            {totalProgress.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    </Tooltip>
                  )}
                </span>
              }
            />

            <CardContent className="px-2 px-md-5">
              <div className="px-0 px-md-4">
                {indicatorActivities.map((quarter, index) => (
                  <QuarterCard
                    totalWeight={totalWeight}
                    quarter={quarter}
                    key={quarter.id}
                  />
                ))}
                {!indicatorActivities.length && loading && (
                  <div>
                    <Skeleton
                      variant="rectangular"
                      className="mb-3 mt-2"
                      height={118}
                    />
                    <Skeleton
                      variant="rectangular"
                      className="mb-3"
                      height={96}
                    />
                    <Skeleton
                      variant="rectangular"
                      className="mb-3"
                      height={96}
                    />
                    <Skeleton
                      variant="rectangular"
                      className="mb-3"
                      height={96}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {!loading &&
        numOfActivities === 0 &&
        location.pathname === "/rbm/expected-results/indicators/activities" && (
          <div className="jumbotron jumbotron-fluid text-center">
            <div className="container">
              <p className="lead">No activities found.</p>
            </div>
          </div>
        )}
    </>
  );
};

const mapStateToProps = ({
  selectedIndicator,
  indicatorActivities,
  subordinates,
  loading,
  strongPassword,
  user,
}) => {
  return {
    selectedIndicator,
    indicatorActivities,
    subordinates,
    user,
    loading,
    strongPassword,
  };
};
export default connect(mapStateToProps, {
  getIndicatorActivities,
  getSubordinates,
})(Activities);
