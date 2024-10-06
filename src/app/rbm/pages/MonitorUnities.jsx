import { Skeleton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import ReactPaginate from "react-paginate";
import {
  getUnitsEvaluations,
  downloadUnitPerformanceReport,
} from "../../../store/rbm/actions";
import MonitorUnityCard from "../components/MonitorUnityCard";

const MonitorUnities = (props) => {
  const {
    unitsEvaluations,
    loading,
    selectedFiscalYear,
    selectedUserEntity,
    getUnitsEvaluations,
  } = props;

  useEffect(
    () => {
      if (!loading && !unitsEvaluations.length) getUnitsEvaluations();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedFiscalYear, selectedUserEntity]
  );

  const [filteredUnits, setFilteredUnits] = useState([...unitsEvaluations]);

  const [searchTeam, setSearchTeam] = useState("");

  useEffect(() => {
    const filtered = [...unitsEvaluations].filter(({ name }) =>
      name.toLowerCase().includes(searchTeam.toLowerCase())
    );
    setFilteredUnits(filtered);

    paginate(filtered);
  }, [searchTeam, unitsEvaluations]);

  const getNo = (idToSearch) => {
    return unitsEvaluations.findIndex(({ id }) => id === idToSearch);
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
    paginate(filteredUnits);
  }, [itemOffset, itemsPerPage]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % filteredUnits.length;

    setItemOffset(newOffset);
  };

  return (
    <>
      <div className="mt-3">
        <h6 className="d-flex justify-content-between ">
          <span>
            <span className="badge badge-secondary">
              {filteredUnits.length}
            </span>{" "}
            Units
          </span>
        </h6>

        {!!filteredUnits && (
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
          paginatedItems.map((unit, index) => (
            <MonitorUnityCard
              key={unit.id}
              unit={unit}
              index={getNo(unit.id)}
            />
          ))}

        {!unitsEvaluations.length && loading && (
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

      {filteredUnits && !filteredUnits[0] && !loading && (
        <div className="jumbotron jumbotron-fluid text-center">
          <div className="container">
            <p className="lead">No units found.</p>
          </div>
        </div>
      )}
    </>
  );
};

const mapStateToProps = ({
  unitsEvaluations,
  loading,
  selectedFiscalYear,
  selectedUserEntity,
}) => {
  return {
    unitsEvaluations,
    loading,
    selectedFiscalYear,
    selectedUserEntity,
  };
};
export default connect(mapStateToProps, {
  getUnitsEvaluations,
  downloadUnitPerformanceReport,
})(MonitorUnities);
