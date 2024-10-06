import { Tooltip, Card, Skeleton } from "@mui/material";
import { getNodeText } from "@testing-library/react";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import ReactPaginate from "react-paginate";
import {
  getInstitutionsEvaluations,
  downloadAllInstitutionsPerformanceReport,
} from "../../../store/rbm/actions";
import OversightCard from "../components/OversightCard";

const Oversight = (props) => {
  const {
    institutionsEvaluations,
    getInstitutionsEvaluations,
    loading,
    selectedFiscalYear,
    downloadAllInstitutionsPerformanceReport,
  } = props;

  useEffect(
    () => {
      if (!loading && !institutionsEvaluations.length)
        getInstitutionsEvaluations();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedFiscalYear]
  );

  const [totalProgress, setTotalProgress] = useState(0);

  const [filteredInstitutions, setFilteredInstitutions] = useState([
    ...institutionsEvaluations,
  ]);

  const [totalSummary, setTotalSummary] = useState({
    allOutputs: 0,
    allIndicators: 0,
    reportedActivities: 0,
    allActivities: 0,
    dueActivities: 0,
    scoredActivities: 0,
    targetAchieved: 0,
  });

  const [searchTeam, setSearchTeam] = useState("");

  useEffect(() => {
    const filtered = [...institutionsEvaluations].filter(({ name }) =>
      name.toLowerCase().includes(searchTeam.toLowerCase())
    );
    setFilteredInstitutions(filtered);

    paginate(filtered);
  }, [searchTeam, institutionsEvaluations]);

  useEffect(() => {
    let score = 0,
      allIndicators = 0,
      allOutputs = 0,
      allActivities = 0,
      dueActivities = 0,
      reportedActivities = 0,
      scoredActivities = 0,
      targetAchieved = 0,
      totalTarget = 0;
    filteredInstitutions.forEach((institution) => {
      score = score + institution.score;

      allOutputs = allOutputs + institution.numOfExpectedResults;
      allIndicators = allIndicators + institution.numOfIndicators;
      allActivities = allActivities + institution.numOfActivities;
      dueActivities = dueActivities + institution.dueActivities;
      reportedActivities = reportedActivities + institution.reportedActivities;
      scoredActivities = scoredActivities + institution.scoredActivities;
      targetAchieved = targetAchieved + institution.achievedTarget;
      totalTarget = totalTarget + institution.annualTarget;
    });

    setTotalProgress(score / (filteredInstitutions.length || 1));

    setTotalSummary({
      allOutputs,
      allIndicators,
      allActivities,
      dueActivities,
      reportedActivities,
      scoredActivities,
      targetAchieved: (targetAchieved * 100) / (totalTarget || 1),
    });
  }, [filteredInstitutions]);

  const getNo = (idToSearch) => {
    return institutionsEvaluations.findIndex(({ id }) => id === idToSearch);
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
    paginate(filteredInstitutions);
  }, [itemOffset, itemsPerPage]);

  const handlePageClick = (event) => {
    const newOffset =
      (event.selected * itemsPerPage) % filteredInstitutions.length;

    setItemOffset(newOffset);
  };

  return (
    <>
      <div className="row no-gutter justify-content-center">
        <div className="col-12 col-lg-11 px-0 px-md-3">
          <h6 className="d-flex justify-content-between">
            <span>All Institutions</span>
          </h6>

          {!!filteredInstitutions && (
            <>
              <Tooltip title="Overall progress">
                <div
                  className="progress bg-light "
                  style={{
                    border: "1px solid rgba(0, 0, 0, 0.12)",
                    cursor: "default",
                  }}
                >
                  <div
                    className={`progress-bar  text-${
                      totalProgress < 5 ? "dark" : "light"
                    } bg-${
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
                    aria-valuenow="25"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    <span
                      className={`${totalProgress < 5 ? "ml-5 text-dark" : ""}`}
                    >
                      {totalProgress.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </Tooltip>
              <div className=" mt-3 pb-3 ">
                <Card variant="outlined">
                  <div className="row no-gutters summary-card  justify-content-center  py-3">
                    <div className="col-12 col-md-4 col-lg-1  align-items-center text-center py-2  summary-card  py-3">
                      <span className="d-block">Institutions</span>
                      <span className="font-weight-bold">
                        {filteredInstitutions.length}
                      </span>
                    </div>

                    <div className="col-12 col-md-4 col-lg-1  align-items-center text-center py-2  summary-card  py-3">
                      <span className="d-block">Outputs</span>
                      <span className="font-weight-bold">
                        {totalSummary.allOutputs}
                      </span>
                    </div>
                    <div className="col-12 col-md-4 col-lg-1  align-items-center text-center py-2  summary-card  py-3">
                      <span className="d-block">Indicators</span>
                      <span className="font-weight-bold">
                        {totalSummary.allIndicators || 0}
                      </span>
                    </div>

                    <div className="col-12 col-md-4 col-lg-1  align-items-center text-center py-2  summary-card  py-3">
                      <span className="d-block">Activities</span>
                      <span className="font-weight-bold">
                        {totalSummary.allActivities || 0}
                      </span>
                    </div>

                    <div className="col-12 col-md-4 col-lg-1  align-items-center text-center py-2  summary-card  py-3">
                      <span className="d-block">Due Activities</span>
                      <span className="font-weight-bold">
                        {totalSummary.dueActivities || 0}
                      </span>
                    </div>

                    <div className="col-12 col-md-4 col-lg-2  align-items-center text-center py-2  summary-card  py-3">
                      <span className="d-block">Reported Activities</span>
                      <span className="font-weight-bold">
                        {totalSummary.reportedActivities || 0}
                      </span>
                    </div>

                    <div className="col-12 col-md-4 col-lg-1 text-center py-2  summary-card  py-3">
                      <span className="d-block">Scored Activities</span>
                      <span className="font-weight-bold">
                        {totalSummary.scoredActivities || 0}
                      </span>
                    </div>
                    <div className="col-12 col-md-4 col-lg-2 text-center py-2  summary-card  py-3">
                      <span className="d-block">Target Achieved</span>
                      <span className="font-weight-bold">
                        {totalSummary.targetAchieved.toFixed(2)}%
                      </span>
                    </div>
                    <div className="col-12 col-md-4 col-lg-1 text-center py-2  summary-card  py-3">
                      <span className="d-block">Progress</span>
                      <span className="font-weight-bold">
                        {totalProgress.toFixed(2)}%
                      </span>
                    </div>

                    <div className="col-12 col-md-4 col-lg-2 text-center  py-2  summary-card">
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm "
                        disabled={loading}
                        onClick={() =>
                          downloadAllInstitutionsPerformanceReport()
                        }
                      >
                        <span className="d-flex  align-items-center">
                          <span className="material-icons mr-1">
                            picture_as_pdf
                          </span>
                          All Institutions
                        </span>
                      </button>
                    </div>
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
            paginatedItems.map((institution, index) => (
              <OversightCard
                key={institution.id}
                institution={institution}
                index={getNo(institution.id)}
              />
            ))}

          {!institutionsEvaluations.length && loading && (
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

      {institutionsEvaluations && !filteredInstitutions[0] && !loading && (
        <div className="jumbotron jumbotron-fluid text-center">
          <div className="container">
            <p className="lead">No institution found.</p>
          </div>
        </div>
      )}
    </>
  );
};

const mapStateToProps = ({
  institutionsEvaluations,
  loading,
  selectedFiscalYear,
}) => {
  return {
    institutionsEvaluations,
    loading,
    selectedFiscalYear,
  };
};
export default connect(mapStateToProps, {
  getInstitutionsEvaluations,
  downloadAllInstitutionsPerformanceReport,
})(Oversight);
