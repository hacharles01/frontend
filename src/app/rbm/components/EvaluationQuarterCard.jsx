import {
  Tooltip,
  Card,
  CardContent,
  Typography,
  CardHeader,
  IconButton,
  CircularProgress,
  Box,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useLocation } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { deleteIndicator, approveIndicator } from "../../../store/rbm/actions";
import ActivityForm from "./ActivityForm";
import EvaluationActivityCard from "./EvaluationActivityCard";

const EvaluationQuarterCard = (props) => {
  const location = useLocation();

  const { quarter, totalWeight, selectActivity, selectedActivity, loading } =
    props;

  const [totalProgress, setTotalProgress] = useState(0);
  const [totalQuarterTarget, setTotalQuarterTarget] = useState(0);
  const [achievedTarget, setAchievedTarget] = useState(0);

  useEffect(() => {
    let weight = 0,
      score = 0,
      achievedTarget = 0,
      quarterTarget = 0;
    quarter.activities.forEach((activity) => {
      weight = weight + activity.weight;
      quarterTarget = quarterTarget + activity.targetShare;
      achievedTarget = achievedTarget + activity.achievedTarget;
      score =
        score +
        ((activity.score -
          ((activity.employeeTimePenalities || 0) +
            (activity.employeeQualityPenalities || 0))) *
          activity.weight) /
          100;
    });

    setTotalProgress((score * 100) / (weight || 1));
    setAchievedTarget(achievedTarget);
    setTotalQuarterTarget(quarterTarget.toFixed(2));
    paginate(quarter.activities);
  }, [quarter, quarter.activities]);

  //Filter
  const [searchTeam, setSearchTeam] = useState("");

  const [filteredActivities, setFilteredActivities] = useState([
    ...quarter.activities,
  ]);

  useEffect(() => {
    const filtered = [...quarter.activities].filter(
      ({ name, unitName, assignments, status }) =>
        name.toLowerCase().includes(searchTeam.toLowerCase()) ||
        (!!unitName &&
          unitName.toLowerCase().includes(searchTeam.toLowerCase())) ||
        assignments.findIndex(
          ({ firstName, lastName }) =>
            (!!firstName &&
              firstName.toLowerCase().includes(searchTeam.toLowerCase())) ||
            (lastName &&
              lastName.toLowerCase().includes(searchTeam.toLowerCase()))
        ) >= 0 ||
        status.toLowerCase().includes(searchTeam.toLowerCase())
    );

    setFilteredActivities(filtered);
    paginate(filtered);
  }, [searchTeam, quarter.activities]);

  const getNo = (idToSearch) => {
    return quarter.activities.findIndex(({ id }) => id === idToSearch);
  };

  //PGINATING
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
    paginate(filteredActivities);
  }, [
    itemOffset,
    itemsPerPage,
    quarter,
    quarter.activities,
    filteredActivities,
  ]);

  const handlePageClick = (event) => {
    const newOffset =
      (event.selected * itemsPerPage) % filteredActivities.length;

    setItemOffset(newOffset);
  };

  return (
    <>
      <Card
        variant="outlined"
        style={{
          border:
            quarter.activities.length > 0 || quarter.target > 0
              ? "1px solid #bcc0c5 "
              : "",
        }}
        className={`mb-3 `}
      >
        <CardHeader
          style={{
            backgroundColor:
              quarter.activities.length > 0 || quarter.target > 0
                ? "#d6d9dc"
                : "#f6f8fa ",
          }}
          avatar={
            <Tooltip title="Quarter Score">
              <Box
                sx={{
                  position: "relative",
                  display: "inline-flex",
                  cursor: "default",
                }}
              >
                <CircularProgress
                  className={`text-${
                    totalProgress < 50
                      ? "danger"
                      : totalProgress < 70
                      ? "warning"
                      : totalProgress < 100
                      ? "info"
                      : "success"
                  }`}
                  variant="determinate"
                  value={totalProgress}
                />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: "absolute",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    variant="caption"
                    component="div"
                    style={{ fontSize: "7px" }}
                    color="text.secondary"
                    className={`text-${
                      totalProgress < 50
                        ? "danger"
                        : totalProgress < 70
                        ? "warning"
                        : totalProgress < 100
                        ? "info"
                        : "success"
                    }`}
                  >
                    {`${(totalProgress || 0).toFixed(2)}%`}
                  </Typography>
                </Box>
              </Box>
            </Tooltip>
          }
          title={
            <span className="d-flex">
              <strong
                style={{
                  backgroundColor: `${
                    quarter.activities.length > 0 || quarter.target > 0
                      ? ""
                      : "transparent"
                  }`,
                }}
                className={`text-${
                  quarter.activities.length > 0 || quarter.target > 0
                    ? "primary"
                    : "alert alert-light"
                } mr-1`}
              >
                QUARTER {quarter.quarterId}
              </strong>
            </span>
          }
          subheader={
            <span>
              <strong>Target: </strong>
              <>
                {quarter.target > 0 && (
                  <>
                    <span className={`badge badge-secondary `}>
                      {quarter.target} {quarter.measurementUnit}
                    </span>{" "}
                    <span className="d-none d-md-inline">
                      /{" "}
                      <span
                        className={`badge badge-${
                          achievedTarget < quarter.target
                            ? "info"
                            : achievedTarget === quarter.target
                            ? "success"
                            : "success"
                        } `}
                      >
                        {(achievedTarget || 0).toFixed(2)} Achieved
                      </span>
                    </span>
                  </>
                )}
                {quarter.target === 0 && (
                  <>
                    {quarter.target} {quarter.measurementUnit}
                  </>
                )}
              </>
              <>
                {totalQuarterTarget > 0 && (
                  <>
                    <span className={`badge badge-secondary `}>
                      {totalQuarterTarget} {quarter.measurementUnit}
                    </span>{" "}
                    <span className="d-none d-md-inline">
                      /{" "}
                      <span
                        className={`badge badge-${
                          achievedTarget < totalQuarterTarget
                            ? "info"
                            : achievedTarget === totalQuarterTarget
                            ? "success"
                            : "success"
                        } `}
                      >
                        {(achievedTarget || 0).toFixed(2)} Achieved
                      </span>
                    </span>
                  </>
                )}
                {totalQuarterTarget === 0 && (
                  <>
                    {totalQuarterTarget} {quarter.measurementUnit}
                  </>
                )}
              </>
            </span>
          }
        />

        <CardContent style={{ paddingLeft: "5%", paddingRight: "5%" }}>
          <div className="row d-flex align-items-center ">
            <div className="form-group   col-10">
              <input
                type="text"
                value={searchTeam}
                className="form-control"
                id="filter"
                placeholder="Search..."
                onChange={(e) => setSearchTeam(e.target.value)}
              />
            </div>

            <div className="form-group col-2">
              <select
                onClick={(e) => setSearchTeam(e.target.value)}
                className="form-control"
              >
                <option value="">All</option>
                <option value="Pending">Pending</option>
                <option value="Overdue">Overdue</option>
                <option value="Reported">Reported</option>
                <option value="Scored">Scored</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>
          {filteredActivities.length === 0 && (
            <div className="alert alert-danger text-center" role="alert">
              No activity found
            </div>
          )}

          {paginatedItems &&
            paginatedItems.map((activity, index) => (
              <EvaluationActivityCard
                totalWeight={totalWeight}
                totalQuarterTarget={totalQuarterTarget}
                quarter={quarter}
                activity={activity}
                index={getNo(activity.id)}
                key={activity.id}
              />
            ))}
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
    </>
  );
};

const mapStateToProps = ({ selectedIndicator, selectedFiscalYear, user }) => {
  return { selectedIndicator, selectedFiscalYear, user };
};
export default connect(mapStateToProps, { deleteIndicator, approveIndicator })(
  EvaluationQuarterCard
);
