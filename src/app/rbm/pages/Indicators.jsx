import {
  Fab,
  Tooltip,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Skeleton,
} from "@mui/material";
import { useHistory } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import ReactPaginate from "react-paginate";

import { getIndicators } from "../../../store/rbm/actions";
import { getUnits } from "../../../store/structure/actions";
import IndicatorCard from "../components/IndicatorCard";
import types from "../../../store/rbm/action-types";
import IndicatorForm from "../components/IndicatorForm";

const Indicator = (props) => {
  const history = useHistory();
  const {
    indicators,
    selectedExpectedResult,
    loading,
    getUnits,
    units,
    getIndicators,
    user,
  } = props;

  const [totalProgress, setTotalProgress] = useState(0);
  const [totalWeight, setTotalWeight] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [hasUnApprovedIndicators, setHasUnApprovedIndicators] = useState(false);
  const [showIndicatorForm, setShowIndicatorForm] = useState(false);

  const [filteredIndicators, setFilteredIndicators] = useState([...indicators]);

  const [searchTeam, setSearchTeam] = useState("");
  const dispatch = useDispatch();

  useEffect(
    () => {
      if (!selectedExpectedResult.id)
        return history.push("/rbm/expected-results");
      else if (!indicators.length) getIndicators(selectedExpectedResult.id);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedExpectedResult]
  );

  useEffect(() => {
    let weight = 0,
      score = 0,
      unApprovedIndicatorFound = false;
    filteredIndicators.forEach((indicator) => {
      score = score + (indicator.score * indicator.weight) / 100;
      weight = weight + indicator.weight;
      if (!indicator.isApproved) unApprovedIndicatorFound = true;
    });

    setTotalWeight(weight);
    setTotalProgress(score);
    setHasUnApprovedIndicators(unApprovedIndicatorFound);
  }, [indicators, filteredIndicators]);

  useEffect(
    () => {
      if (!units.length) getUnits();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    const filtered = [...indicators].filter(
      ({ name, unitName }) =>
        name.toLowerCase().includes(searchTeam.toLowerCase()) ||
        (!!unitName &&
          unitName.toLowerCase().includes(searchTeam.toLowerCase()))
    );
    setFilteredIndicators(filtered);

    paginate(filtered);
  }, [searchTeam, indicators]);

  const getNo = (idToSearch) => {
    return indicators.findIndex(({ id }) => id === idToSearch);
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
    paginate(filteredIndicators);
  }, [itemOffset, itemsPerPage, indicators, filteredIndicators]);

  const handlePageClick = (event) => {
    const newOffset =
      (event.selected * itemsPerPage) % filteredIndicators.length;

    setItemOffset(newOffset);
  };

  return (
    <>
      <div className="row no-gutter justify-content-center">
        <div className="col-12 col-lg-11 px-0 px-md-3">
          <h6 className="d-flex justify-content-between">
            <span>
              Indicators
              <Tooltip title="Total weight">
                <span
                  style={{ cursor: "pointer" }}
                  className={`badge badge-${
                    +totalWeight === 100 ? "success" : "danger"
                  } ml-1 py-1`}
                >
                  <i className="fas fa-weight-hanging mr-1"></i>{" "}
                  {totalWeight.toFixed(2)}
                </span>
              </Tooltip>
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
          <Card
            className="mb-3 py-3 "
            variant="outlined"
            style={{ backgroundColor: "#f6f8fa" }}
          >
            <CardHeader
              avatar={
                <IconButton
                  onClick={() => {
                    history.push("/rbm/expected-results");
                    dispatch({
                      type: types.SET_INDICATORS,
                      data: [],
                    });

                    dispatch({
                      type: types.SET_SELECTED_EXPECTED_RESULT,
                      data: {},
                    });
                  }}
                >
                  <span className="material-icons text-info">arrow_back</span>
                </IconButton>
              }
              subheader={
                <span className="font-weight-bold text-uppercase text-primary">
                  <i className="fas fa-folder-open mr-1 "></i>

                  {selectedExpectedResult.name}
                  {selectedExpectedResult.id && (
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

            <CardContent className="px-2 px-md-5">
              <div className="px-0 px-md-4">
                <div className="form-group mt-3 mb-2">
                  <input
                    type="text"
                    className="form-control"
                    value={searchTeam}
                    id="filter"
                    placeholder="Search..."
                    onChange={(e) => setSearchTeam(e.target.value)}
                  />
                </div>
                {paginatedItems &&
                  paginatedItems.map((indicator, index) => (
                    <IndicatorCard
                      key={indicator.id}
                      index={getNo(indicator.id)}
                      indicator={indicator}
                      setIsEditing={setIsEditing}
                      setShowIndicatorForm={setShowIndicatorForm}
                    />
                  ))}

                {!indicators.length && loading && (
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
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {indicators && !filteredIndicators[0] && !loading && (
        <div className="jumbotron jumbotron-fluid text-center">
          <div className="container">
            <p className="lead">No indicator found</p>
          </div>
        </div>
      )}

      <IndicatorForm
        totalWeight={totalWeight}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        showIndicatorForm={showIndicatorForm}
        setShowIndicatorForm={setShowIndicatorForm}
        expectedResultId={selectedExpectedResult.id}
      />

      {(user.position.isPlanner ||
        (!!user.actingPosition && !!user.actingPosition.isPlanner) ||
        user.position.isTechnicalHead ||
        (!!user.actingPosition && user.actingPosition.isTechnicalHead)) && (
        <div className="fab-container pr-4 pb-4">
          <Tooltip title="Add New Indicator" placement="top">
            <span className="fab-btn">
              <Fab color="primary" onClick={() => setShowIndicatorForm(true)}>
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
  indicators,
  selectedExpectedResult,
  loading,
  units,
  user,
  strongPassword,
}) => {
  return {
    indicators,
    selectedExpectedResult,
    loading,
    units,
    user,
    strongPassword,
  };
};
export default connect(mapStateToProps, {
  getIndicators,
  getUnits,
})(Indicator);
