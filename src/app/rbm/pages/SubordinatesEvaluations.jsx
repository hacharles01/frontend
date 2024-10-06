import { Card, Skeleton, Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import ReactPaginate from "react-paginate";
import {
  getSubordinatesEvaluations,
  downloadEmployeePerformanceReport,
  getSubordinates,
} from "../../../store/rbm/actions";
import SubordinateEvaluationCard from "../components/SubordinateEvaluationCard";

const SubordinatesEvaluations = (props) => {
  const {
    subordinatesEvaluations,
    loading,
    selectedFiscalYear,
    selectedUserEntity,
    getSubordinatesEvaluations,
    getSubordinates,
    subordinates,
  } = props;

  useEffect(
    () => {
      if (!loading && !subordinatesEvaluations.length)
        getSubordinatesEvaluations();

      if (!loading && !subordinates.length) getSubordinates();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedFiscalYear, selectedUserEntity]
  );

  const [filteredEmployees, setFilteredEmployees] = useState([
    ...subordinatesEvaluations,
  ]);

  const [searchTeam, setSearchTeam] = useState("");

  useEffect(() => {
    const filtered = [...subordinatesEvaluations].filter(
      ({ firstName, lastName, unitName }) =>
        (firstName + lastName)
          .toLowerCase()
          .includes(searchTeam.toLowerCase()) ||
        unitName.toLowerCase().includes(searchTeam.toLowerCase())
    );
    setFilteredEmployees(filtered);
    paginate(filtered);
  }, [searchTeam, subordinatesEvaluations]);

  const getNo = (idToSearch) => {
    return subordinatesEvaluations.findIndex(({ id }) => id === idToSearch);
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
    paginate(filteredEmployees);
  }, [itemOffset, itemsPerPage]);

  const handlePageClick = (event) => {
    const newOffset =
      (event.selected * itemsPerPage) % filteredEmployees.length;

    setItemOffset(newOffset);
  };

  const [summaryActivities, setSummaryActivities] = useState({
    allActivities: 0,
    dueActivities: 0,
    reportedActivities: 0,
    scoredActivities: 0,
  });

  useEffect(() => {
    let allActivities = 0,
      dueActivities = 0,
      reportedActivities = 0,
      scoredActivities = 0;

    subordinatesEvaluations.forEach((employee) => {
      allActivities = allActivities + employee.numOfActivities;
      dueActivities = dueActivities + employee.dueActivities;
      reportedActivities = reportedActivities + employee.reportedActivities;
      scoredActivities = scoredActivities + employee.scoredActivities;
    });

    setSummaryActivities({
      allActivities,
      dueActivities,
      reportedActivities,
      scoredActivities,
    });
  }, [subordinatesEvaluations]);

  return (
    <>
      <div className="row no-gutter justify-content-center">
        <div className="col-12 col-lg-11 px-0 px-md-3">
          {/* <h6 className="d-flex justify-content-between">
            <span>Evaluate</span>
          </h6> */}
          <div className="mt-3">
            <Card variant="outlined">
              <div className="row no-gutters summary-card justify-content-center py-3">
                <div className="col-12 col-md-4 col-lg-2  align-items-center text-center py-2  summary-card  py-3 ">
                  <span className="d-block">Subordinates</span>
                  <span className="font-weight-bold">
                    {filteredEmployees.length}
                  </span>
                </div>
                <div className="col-12 col-md-4 col-lg-2  align-items-center text-center py-2  summary-card  py-3 ">
                  <span className="d-block">Activities</span>
                  <span className="font-weight-bold">
                    {summaryActivities.allActivities}
                  </span>
                </div>
                <div className="col-12 col-md-4 col-lg-2  align-items-center text-center py-2  summary-card  py-3 ">
                  <span className="d-block">Due Activities</span>
                  <span className="font-weight-bold">
                    {summaryActivities.dueActivities || 0}
                  </span>
                </div>
                <div className="col-12 col-md-4 col-lg-2  align-items-center text-center py-2  summary-card  py-3 ">
                  <span className="d-block">Reported Activities</span>
                  <span className="font-weight-bold">
                    {summaryActivities.reportedActivities || 0}
                  </span>
                </div>
                <div className="col-12 col-md-4 col-lg-2 text-center py-2  summary-card  py-3 ">
                  <span className="d-block">Scored Activities</span>
                  <span className="font-weight-bold">
                    {summaryActivities.scoredActivities || 0}
                  </span>
                </div>
              </div>
            </Card>
          </div>

          <div className="mt-3">
            {!!filteredEmployees && (
              <>
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
              paginatedItems.map((employee, index) => (
                <SubordinateEvaluationCard
                  key={employee.id}
                  employee={employee}
                  index={getNo(employee.id)}
                />
              ))}

            {!subordinatesEvaluations.length && loading && (
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

          {subordinatesEvaluations && !subordinatesEvaluations[0] && !loading && (
            <div className="jumbotron jumbotron-fluid text-center">
              <div className="container">
                <p className="lead">No subordinate found.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const mapStateToProps = ({
  subordinatesEvaluations,
  loading,
  selectedFiscalYear,
  selectedUserEntity,
  subordinates,
}) => {
  return {
    subordinatesEvaluations,
    loading,
    selectedFiscalYear,
    selectedUserEntity,
    subordinates,
  };
};
export default connect(mapStateToProps, {
  getSubordinatesEvaluations,
  downloadEmployeePerformanceReport,
  getSubordinates,
})(SubordinatesEvaluations);
