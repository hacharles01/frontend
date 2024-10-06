import { Skeleton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import ReactPaginate from "react-paginate";
import {
  getEmployeesEvaluations,
  downloadEmployeePerformanceReport,
} from "../../../store/rbm/actions";
import MonitorEmployeeCard from "../components/MonitorEmployeeCard";

const MonitorEmployees = (props) => {
  const {
    employeesEvaluations,
    loading,
    selectedFiscalYear,
    selectedUserEntity,
    getEmployeesEvaluations,
  } = props;

  useEffect(
    () => {
      if (!loading && !employeesEvaluations.length) getEmployeesEvaluations();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedFiscalYear, selectedUserEntity]
  );

  const [filteredEmployees, setFilteredEmployees] = useState([
    ...employeesEvaluations,
  ]);

  const [searchTeam, setSearchTeam] = useState("");

  useEffect(() => {
    const filtered = [...employeesEvaluations].filter(
      ({ firstName, lastName, unitName }) =>
        (firstName + lastName)
          .toLowerCase()
          .includes(searchTeam.toLowerCase()) ||
        unitName.toLowerCase().includes(searchTeam.toLowerCase())
    );
    setFilteredEmployees(filtered);
    paginate(filtered);
  }, [searchTeam, employeesEvaluations]);

  const getNo = (idToSearch) => {
    return employeesEvaluations.findIndex(({ id }) => id === idToSearch);
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

  return (
    <>
      <div className="mt-3">
        <h6 className="d-flex justify-content-between">
          <span>
            <span className="badge badge-secondary">
              {filteredEmployees.length}
            </span>{" "}
            Employees
          </span>
        </h6>

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
            <MonitorEmployeeCard
              key={employee.id}
              employee={employee}
              index={getNo(employee.id)}
            />
          ))}

        {!employeesEvaluations.length && loading && (
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

      {employeesEvaluations && !employeesEvaluations[0] && !loading && (
        <div className="jumbotron jumbotron-fluid text-center">
          <div className="container">
            <p className="lead">No employees found.</p>
          </div>
        </div>
      )}
    </>
  );
};

const mapStateToProps = ({
  employeesEvaluations,
  loading,
  selectedFiscalYear,
  selectedUserEntity,
}) => {
  return {
    employeesEvaluations,
    loading,
    selectedFiscalYear,
    selectedUserEntity,
  };
};
export default connect(mapStateToProps, {
  getEmployeesEvaluations,
  downloadEmployeePerformanceReport,
})(MonitorEmployees);
