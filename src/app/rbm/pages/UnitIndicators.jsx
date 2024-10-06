import {
  Tooltip,
  Card,
  CardContent,
  CardHeader,
  Skeleton,
} from "@mui/material";
import { useHistory } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import ReactPaginate from "react-paginate";
import {
  getUnityIndicators,
  downloadUnitPerformanceReport,
} from "../../../store/rbm/actions";

import { getUnits } from "../../../store/structure/actions";
import IndicatorCard from "../components/IndicatorCard";
import types from "../../../store/rbm/action-types";
import IndicatorForm from "../components/IndicatorForm";

const UnitIndicators = (props) => {
  const history = useHistory();
  const {
    loading,
    getUnits,
    units,
    unitIndicators,
    getUnityIndicators,
    user,
    downloadUnitPerformanceReport,
  } = props;

  const [totalProgress, setTotalProgress] = useState(0);
  const [totalWeight, setTotalWeight] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [hasUnApprovedIndicators, setHasUnApprovedIndicators] = useState(false);

  const dispatch = useDispatch();

  useEffect(
    () => {
      if (!loading && !unitIndicators.length) getUnityIndicators(history);
      if (!units.length) getUnits();

      dispatch({
        type: types.SET_INDICATORS,
        data: [],
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const [showIndicatorForm, setShowIndicatorForm] = useState(false);

  const [filteredUnitIndicators, setFilteredUnitIndicators] = useState([
    ...unitIndicators,
  ]);

  const [searchTeam, setSearchTeam] = useState("");

  const [unitIndicatorsSummary, setUnitIndicatorsSummary] = useState({
    dueActivities: 0,
    allActivities: 0,
    reportedActivities: 0,
    scoredActivities: 0,
    targetAchieved: 0,
  });

  useEffect(() => {
    const filtered = [...unitIndicators].filter(
      ({ name, unitName }) =>
        name.toLowerCase().includes(searchTeam.toLowerCase()) ||
        (!!unitName &&
          unitName.toLowerCase().includes(searchTeam.toLowerCase()))
    );

    setFilteredUnitIndicators(filtered);
    paginate(filtered);
  }, [searchTeam, unitIndicators]);

  useEffect(() => {
    let weight = 0,
      score = 0,
      unApprovedIndicatorFound = false,
      dueActivities = 0,
      allActivities = 0,
      reportedActivities = 0,
      scoredActivities = 0,
      targetAchieved = 0,
      totalTarget = 0;
    filteredUnitIndicators.forEach((indicator) => {
      if (!!indicator.unitId) {
        score = score + (indicator.score * indicator.weight) / 100;
        weight = weight + indicator.weight;
        allActivities = allActivities + indicator.numOfActivities;
        dueActivities = dueActivities + indicator.dueActivities;
        reportedActivities = reportedActivities + indicator.reportedActivities;
        scoredActivities = scoredActivities + indicator.scoredActivities;
        targetAchieved = targetAchieved + indicator.achievedTarget;
        totalTarget = totalTarget + indicator.annualTarget;

        if (!indicator.isApproved) unApprovedIndicatorFound = true;
      }
    });

    setTotalWeight(weight);
    setTotalProgress((score * 100) / (weight || 1));

    setHasUnApprovedIndicators(unApprovedIndicatorFound);

    setUnitIndicatorsSummary({
      dueActivities,
      allActivities,
      reportedActivities,
      scoredActivities,
      targetAchieved: (targetAchieved * 100) / (totalTarget || 1),
    });
  }, [filteredUnitIndicators]);

  const getNo = (idToSearch) => {
    return unitIndicators.findIndex(({ id }) => id === idToSearch);
  };

  //PAGINATION
  const [paginatedItems, setPaginatedItems] = useState(null);
  const [pageCount, setPageCount] = useState(0);

  const [itemOffset, setItemOffset] = useState(0);

  const itemsPerPage = 10;

  const paginate = (items) => {
    const endOffset = itemOffset + itemsPerPage;
    setPaginatedItems(items.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(items.length / itemsPerPage));
  };

  useEffect(() => {
    paginate(filteredUnitIndicators);
  }, [itemOffset, itemsPerPage, unitIndicators, filteredUnitIndicators]);

  const handlePageClick = (event) => {
    const newOffset =
      (event.selected * itemsPerPage) % filteredUnitIndicators.length;

    setItemOffset(newOffset);
  };

  return (
    <>
      <div className="row no-gutter justify-content-center">
        <div className="col-12 col-lg-11 px-0 px-md-3">
          <h6 className="d-flex justify-content-between">
            <span>Unit indicators</span>

            {hasUnApprovedIndicators && (
              <Tooltip title="Some indicators are not approved">
                <span
                  className="material-icons text-danger"
                  style={{ cursor: "default" }}
                >
                  error
                </span>
              </Tooltip>
            )}
          </h6>
          <Card
            className="mb-3 py-3 "
            variant="outlined"
            style={{ backgroundColor: "#f6f8fa" }}
          >
            <CardHeader
              subheader={
                <span className="font-weight-bold text-uppercase text-primary">
                  <span className="">
                    <i className="fas fa-folder-open mr-1 "></i>
                    {user.unit.name}{" "}
                    {!!user.actingUnit && (
                      <span className="text-warning">
                        {" - "}
                        {user.actingUnit.id !== user.unit.id && (
                          <>{user.actingUnit.name} </>
                        )}
                        <span className="text-warning">{" (Acting)"} </span>
                      </span>
                    )}
                  </span>

                  {user.unit && user.unit.name && (
                    <Tooltip title="Unit progress">
                      <div
                        className="progress bg-white   mr-2"
                        style={{
                          border: "1px solid rgba(0, 0, 0, 0.12)",
                          cursor: "default",
                        }}
                      >
                        <div
                          className={`progress-bar  text-${
                            totalProgress < 5 ? "dark" : "light"
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
                            className={`${
                              totalProgress < 5 ? "ml-5 text-dark" : ""
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

            <div className="px-4 pb-3 ">
              <Card variant="outlined">
                <div className="row no-gutters summary-card justify-content-center py-3">
                  <div className="col-12 col-md-4 col-lg-1  align-items-center text-center py-2  summary-card  py-3 ">
                    <span className="d-block">Indicators</span>
                    <span className="font-weight-bold">
                      {filteredUnitIndicators.length}
                    </span>
                  </div>
                  <div className="col-12 col-md-4 col-lg-1  align-items-center text-center py-2  summary-card  py-3 ">
                    <span className="d-block">Activities</span>
                    <span className="font-weight-bold">
                      {unitIndicatorsSummary.allActivities}
                    </span>
                  </div>
                  <div className="col-12 col-md-4 col-lg-1  align-items-center text-center py-2  summary-card  py-3 ">
                    <span className="d-block">Due Activities</span>
                    <span className="font-weight-bold">
                      {unitIndicatorsSummary.dueActivities || 0}
                    </span>
                  </div>
                  <div className="col-12 col-md-4 col-lg-2  align-items-center text-center py-2  summary-card  py-3 ">
                    <span className="d-block">Reported Activities</span>
                    <span className="font-weight-bold">
                      {unitIndicatorsSummary.reportedActivities || 0}
                    </span>
                  </div>
                  <div className="col-12 col-md-4 col-lg-2 text-center py-2  summary-card  py-3 ">
                    <span className="d-block">Scored Activities</span>
                    <span className="font-weight-bold">
                      {unitIndicatorsSummary.scoredActivities || 0}
                    </span>
                  </div>
                  <div className="col-12 col-md-4 col-lg-2 text-center py-2  summary-card  py-3 ">
                    <span className="d-block">Target achieved</span>
                    <span className="font-weight-bold">
                      {unitIndicatorsSummary.targetAchieved.toFixed(2)}%
                    </span>
                  </div>
                  <div className="col-12 col-md-4 col-lg-1 text-center py-2  summary-card  py-3 ">
                    <span className="d-block">Progress</span>
                    <span className="font-weight-bold">
                      {" "}
                      {totalProgress.toFixed(2)}%
                    </span>
                  </div>

                  {(user.position.isPlanner ||
                    user.position.isRBMOversight ||
                    (!!user.actingPosition &&
                      !!user.actingPosition.isRBMOversight) ||
                    (!!user.actingPosition &&
                      !!user.actingPosition.isPlanner) ||
                    user.position.isTechnicalHead ||
                    (!!user.actingPosition &&
                      user.actingPosition.isTechnicalHead) ||
                    user.position.isSupervisor ||
                    (!!user.actingPosition &&
                      user.actingPosition.isSupervisor)) && (
                    <div className="col-12 col-md-4 col-lg-2 d-flex justify-content-center  align-items-center py-2  summary-card">
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm d-flex justify-content-center  align-items-center"
                        disabled={loading}
                        onClick={() => downloadUnitPerformanceReport(user.unit)}
                      >
                        <span className="material-icons">download</span>
                        <span className="material-icons">picture_as_pdf</span>
                      </button>
                    </div>
                  )}
                </div>
              </Card>
            </div>
            <CardContent className="px-2 px-md-4">
              <div className="form-group mt-2 mb-2">
                <input
                  type="text"
                  value={searchTeam}
                  className="form-control"
                  id="filter"
                  placeholder="Search..."
                  onChange={(e) => setSearchTeam(e.target.value)}
                />
              </div>
              {paginatedItems &&
                paginatedItems.map((indicator, index) => (
                  <React.Fragment key={indicator.id}>
                    {!!indicator.unitId && (
                      <IndicatorCard
                        isChildIndicator={
                          indicator.unitId !== user.unit.id &&
                          (!!!user.actingUnit ||
                            (!!user.actingUnit &&
                              indicator.unitId !== user.actingUnit.id))
                        }
                        index={getNo(indicator.id)}
                        indicator={indicator}
                        setIsEditing={setIsEditing}
                        setShowIndicatorForm={setShowIndicatorForm}
                      />
                    )}
                  </React.Fragment>
                ))}

              {!unitIndicators.length && loading && (
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
              <ReactPaginate
                breakLabel="..."
                nextLabel={
                  <>
                    <span className="pr-1 d-none d-md-inline">Next</span>
                    <i className="fas fa-angle-double-right"></i>
                  </>
                }
                previousLabel={
                  <>
                    <i className="fas fa-angle-double-left"></i>
                    <span className="pl-1  d-none d-md-inline">Previous</span>
                  </>
                }
                pageRangeDisplayed={3}
                marginPagesDisplayed={1}
                onPageChange={handlePageClick}
                pageCount={pageCount}
                renderOnZeroPageCount={null}
                containerClassName="pagination"
                pageLinkClassName="btn btn-outline-info btn-sm mr-1 ml-1 mt-1"
                previousLinkClassName="btn btn-outline-info btn-sm mr-1 ml-1 mt-1"
                nextLinkClassName="btn btn-outline-info btn-sm ml-1 mt-1"
                activeLinkClassName="active"
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {unitIndicators && !filteredUnitIndicators[0] && !loading && (
        <div className="jumbotron jumbotron-fluid text-center">
          <div className="container">
            <p className="lead">No indicator found.</p>
          </div>
        </div>
      )}

      <IndicatorForm
        totalWeight={totalWeight}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        showIndicatorForm={showIndicatorForm}
        setShowIndicatorForm={setShowIndicatorForm}
      />
    </>
  );
};

const mapStateToProps = ({
  unitIndicators,
  loading,
  units,
  user,
  selectedIndicator,
  strongPassword,
  unitIndicatorsSummary,
}) => {
  return {
    unitIndicators,
    loading,
    units,
    user,
    selectedIndicator,
    strongPassword,
    unitIndicatorsSummary,
  };
};
export default connect(mapStateToProps, {
  getUnityIndicators,
  getUnits,
  downloadUnitPerformanceReport,
})(UnitIndicators);
