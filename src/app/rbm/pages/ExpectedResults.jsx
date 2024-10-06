import { Fab, Tooltip, Card, Skeleton } from "@mui/material";
import { useHistory } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import ReactPaginate from "react-paginate";
import types from "../../../store/rbm/action-types";

import {
  getExpectedResults,
  downloadInstitutionPerformanceReport,
  downloadInstitutionEmployeesPerformanceReport,
  getSubordinates,
} from "../../../store/rbm/actions";
import ExpectedResultCard from "../components/ExpectedResultCard";
import ExpectedResultForm from "../components/ExpectedResultForm";

const ExpectedResult = (props) => {
  const history = useHistory();
  const {
    expectedResults,
    getExpectedResults,
    selectedUserEntity,
    selectedFiscalYear,
    loading,
    user,
    downloadInstitutionPerformanceReport,
    getSubordinates,
  } = props;

  const [insititutionProgress, setInsititutionProgress] = useState(0);
  const [totalWeight, setTotalWeight] = useState(0);
  const [hasUnApprovedIndicators, setHasUnApprovedIndicators] = useState(false);
  const [filteredExpectedResults, setFilteredExpectedResults] = useState([
    ...expectedResults,
  ]);

  const [searchTeam, setSearchTeam] = useState("");

  const [expectedResultSummary, setExpectedResultSummary] = useState({
    allIndicators: 0,
    allActivities: 0,
    dueActivities: 0,
    reportedActivities: 0,
    scoredActivities: 0,
    targetAchieved: 0,
  });

  useEffect(
    () => {
      if (!loading && !expectedResults.length) getExpectedResults(history);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedUserEntity, selectedFiscalYear]
  );

  const [expectedResultFormOpen, setExpectedResultFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const openExpectedResultForm = () => {
    setExpectedResultFormOpen(true);
  };
  const closeExpectedResultForm = () => {
    setExpectedResultFormOpen(false);
    setIsEditing(false);
  };

  useEffect(
    () => {
      getSubordinates();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    const filtered = [...expectedResults].filter(({ name }) =>
      name.toLowerCase().includes(searchTeam.toLowerCase())
    );
    setFilteredExpectedResults(filtered);

    paginate(filtered);
  }, [searchTeam, expectedResults]);

  const dispatch = useDispatch();

  useEffect(
    () => {
      dispatch({
        type: types.SET_INDICATORS,
        data: [],
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    let score = 0,
      weight = 0,
      unApprovedIndicatorFound = false,
      allIndicators = 0,
      allActivities = 0,
      dueActivities = 0,
      reportedActivities = 0,
      scoredActivities = 0,
      targetAchieved = 0,
      totalTarget = 0;
    filteredExpectedResults.forEach((expectedResult) => {
      score = score + (expectedResult.score * expectedResult.weight) / 100;
      weight = weight + expectedResult.weight;

      allIndicators = allIndicators + expectedResult.numOfIndicators;
      allActivities = allActivities + expectedResult.numOfActivities;
      dueActivities = dueActivities + expectedResult.dueActivities;
      reportedActivities =
        reportedActivities + expectedResult.reportedActivities;
      scoredActivities = scoredActivities + expectedResult.scoredActivities;
      targetAchieved = targetAchieved + expectedResult.achievedTarget;
      totalTarget = totalTarget + expectedResult.annualTarget;

      if (expectedResult.unApprovedIndicators > 0)
        unApprovedIndicatorFound = true;
    });

    setInsititutionProgress((score * 100) / (weight || 1));

    setTotalWeight(weight.toFixed(2));
    setHasUnApprovedIndicators(unApprovedIndicatorFound);
    setExpectedResultSummary({
      allIndicators,
      allActivities,
      dueActivities,
      reportedActivities,
      scoredActivities,
      targetAchieved: (targetAchieved * 100) / (totalTarget || 1),
    });
  }, [filteredExpectedResults]);

  const onRefresh = () => {
    window.location.reload();
  };

  const getNo = (idToSearch) => {
    return expectedResults.findIndex(({ id }) => id === idToSearch);
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
    paginate(filteredExpectedResults);
  }, [itemOffset, itemsPerPage, expectedResults, filteredExpectedResults]);

  const handlePageClick = (event) => {
    const newOffset =
      (event.selected * itemsPerPage) % filteredExpectedResults.length;

    setItemOffset(newOffset);
  };

  return (
    <>
      <div className="row no-gutter justify-content-center">
        <div className="col-12 col-lg-11 px-0 px-md-3">
          <h6 className="d-flex justify-content-between">
            <span>
              Outputs
              {
                <Tooltip title="Total weight">
                  <span
                    style={{ cursor: "pointer" }}
                    className={`badge badge-${
                      100 - +totalWeight === 0 ? "success" : "danger"
                    } ml-1 py-1`}
                  >
                    <i className="fas fa-weight-hanging mr-1"></i> {totalWeight}
                  </span>
                </Tooltip>
              }
            </span>

            {hasUnApprovedIndicators &&
              (user.position.isPlanner ||
                (!!user.actingPosition && !!user.actingPosition.isPlanner) ||
                user.position.isTechnicalHead ||
                (!!user.actingPosition &&
                  user.actingPosition.isTechnicalHead)) && (
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

          {expectedResults && (
            <>
              <Tooltip title="Institutional progress">
                <div
                  className="progress bg-light "
                  style={{
                    border: "1px solid rgba(0, 0, 0, 0.12)",
                    cursor: "default",
                  }}
                >
                  <div
                    className={`progress-bar  text-${
                      insititutionProgress < 5 ? "dark" : "light"
                    } bg-${
                      insititutionProgress < 50
                        ? "danger"
                        : insititutionProgress < 70
                        ? "warning"
                        : insititutionProgress < 100
                        ? "info"
                        : "success"
                    }`}
                    role="progressbar"
                    style={{ width: insititutionProgress + "%" }}
                    aria-valuenow="25"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    <span
                      className={`${
                        insititutionProgress < 5 ? "ml-5 text-dark" : ""
                      }`}
                    >
                      {insititutionProgress.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </Tooltip>
              <div className=" mt-3 pb-3">
                <Card variant="outlined">
                  <div className="row no-gutters summary-card justify-content-center  py-3">
                    <div className="col-12 col-md-4 col-lg-1  align-items-center text-center py-2  summary-card  py-3">
                      <span className="d-block">Outputs</span>
                      <span className="font-weight-bold">
                        {filteredExpectedResults.length}
                      </span>
                    </div>
                    <div className="col-12 col-md-4 col-lg-1  align-items-center text-center py-2  summary-card  py-3">
                      <span className="d-block">Indicators</span>
                      <span className="font-weight-bold">
                        {expectedResultSummary.allIndicators || 0}
                      </span>
                    </div>

                    <div className="col-12 col-md-4 col-lg-1  align-items-center text-center py-2  summary-card  py-3">
                      <span className="d-block">Activities</span>
                      <span className="font-weight-bold">
                        {expectedResultSummary.allActivities || 0}
                      </span>
                    </div>

                    <div className="col-12 col-md-4 col-lg-2  align-items-center text-center py-2  summary-card  py-3">
                      <span className="d-block">Due Activities</span>
                      <span className="font-weight-bold">
                        {expectedResultSummary.dueActivities || 0}
                      </span>
                    </div>

                    <div className="col-12 col-md-4 col-lg-2  align-items-center text-center py-2  summary-card  py-3">
                      <span className="d-block">Reported Activities</span>
                      <span className="font-weight-bold">
                        {expectedResultSummary.reportedActivities || 0}
                      </span>
                    </div>

                    <div className="col-12 col-md-4 col-lg-2 text-center py-2  summary-card  py-3">
                      <span className="d-block">Scored Activities</span>
                      <span className="font-weight-bold">
                        {expectedResultSummary.scoredActivities || 0}
                      </span>
                    </div>
                    <div className="col-12 col-md-4 col-lg-1 text-center py-2  summary-card  py-3">
                      <span className="d-block">Target achieved</span>
                      <span className="font-weight-bold">
                        {expectedResultSummary.targetAchieved.toFixed(2)}%
                      </span>
                    </div>
                    <div className="col-12 col-md-4 col-lg-1 text-center py-2  summary-card  py-3">
                      <span className="d-block">Progress</span>
                      <span className="font-weight-bold">
                        {insititutionProgress.toFixed(2)}%
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
                        user.actingPosition.isTechnicalHead)) && (
                      <div className="col-12 col-md-4 col-lg-1  py-2   summary-card d-flex justify-content-center  align-items-center">
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm d-flex justify-content-center mr-2  align-items-center "
                          disabled={loading}
                          onClick={() =>
                            downloadInstitutionPerformanceReport(
                              selectedUserEntity
                            )
                          }
                        >
                          <span className="material-icons">download</span>
                          <span className="material-icons">picture_as_pdf</span>
                        </button>
                      </div>
                    )}
                  </div>
                </Card>
              </div>

              <div className="form-group mt-2 mb-2">
                <input
                  type="text"
                  className="form-control"
                  value={searchTeam}
                  id="filter"
                  placeholder="Search..."
                  onChange={(e) => setSearchTeam(e.target.value)}
                />
              </div>
            </>
          )}

          {paginatedItems &&
            paginatedItems.map((expectedResult, index) => (
              <ExpectedResultCard
                key={expectedResult.id}
                expectedResult={expectedResult}
                index={getNo(expectedResult.id)}
                setIsEditing={setIsEditing}
                openExpectedResultForm={openExpectedResultForm}
              />
            ))}

          {!expectedResults[0] && loading && !expectedResults.length && (
            <div>
              <Skeleton
                variant="rectangular"
                className="mb-3 mt-2"
                height={118}
              />
              <Skeleton variant="rectangular" className="mb-3" height={96} />
              <Skeleton variant="rectangular" className="mb-3" height={96} />
              <Skeleton variant="rectangular" className="mb-3" height={96} />
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
        </div>
      </div>

      {expectedResults && !filteredExpectedResults[0] && !loading && (
        <div className="jumbotron jumbotron-fluid text-center">
          <div className="container">
            <p className="lead">No output found.</p>
            <button
              onClick={onRefresh}
              type="button"
              className="btn btn-secondary"
            >
              Refresh
            </button>
          </div>
        </div>
      )}

      <ExpectedResultForm
        totalWeight={totalWeight}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        closeExpectedResultForm={closeExpectedResultForm}
        expectedResultFormOpen={expectedResultFormOpen}
      />

      {(user.position.isPlanner ||
        (!!user.actingPosition && !!user.actingPosition.isPlanner) ||
        user.position.isTechnicalHead ||
        (!!user.actingPosition && user.actingPosition.isTechnicalHead)) && (
        <div className="fab-container pr-4 pb-4">
          <Tooltip title="Add New Output" placement="top">
            <span className="fab-btn">
              <Fab color="primary" onClick={openExpectedResultForm}>
                <span className="material-icons">add</span>
              </Fab>
            </span>
          </Tooltip>
        </div>
      )}

      <br />
      <br />
      <br />
      <br />
    </>
  );
};

const mapStateToProps = ({
  expectedResults,
  selectedUserEntity,
  selectedFiscalYear,
  loading,
  user,
  strongPassword,
  subordinates,
}) => {
  return {
    expectedResults,
    selectedUserEntity,
    selectedFiscalYear,
    loading,
    user,
    strongPassword,
    subordinates,
  };
};
export default connect(mapStateToProps, {
  getExpectedResults,
  downloadInstitutionPerformanceReport,
  downloadInstitutionEmployeesPerformanceReport,
  getSubordinates,
})(ExpectedResult);
