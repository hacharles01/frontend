import {
  Tooltip,
  Card,
  CardContent,
  Typography,
  CardHeader,
  IconButton,
  CircularProgress,
  Box,
  Button,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useLocation } from "react-router-dom";
import ReactPaginate from "react-paginate";
import {
  deleteIndicator,
  approveIndicator,
  publishScores,
} from "../../../store/rbm/actions";
import ActivityCard from "./ActivityCard";
import ActivityForm from "./ActivityForm";

const QuarterCard = (props) => {
  const location = useLocation();

  const {
    loading,
    quarter,
    selectedIndicator,
    totalWeight,
    selectedFiscalYear,
    user,
    publishScores,
  } = props;

  const [isEditing, setIsEditing] = useState(false);
  const [showActivityForm, setShowActivityForm] = useState(false);

  const [totalProgress, setTotalProgress] = useState(0);
  const [totalQuarterTarget, setTotalQuarterTarget] = useState(0);
  const [achievedTarget, setAchievedTarget] = useState(0);
  const [isApproved, setIsApproved] = useState(true);

  useEffect(() => {
    let approved = true;
    let weight = 0,
      score = 0,
      achievedTarget = 0,
      quarterTarget = 0;
    quarter.activities.forEach((activity) => {
      if (activity.status === "Scored" && !activity.scorePublished)
        approved = false;

      weight = weight + activity.weight;
      quarterTarget = quarterTarget + activity.targetShare;
      achievedTarget = achievedTarget + activity.achievedTarget;

      if (
        !!activity.scorePublished ||
        user.position.isTechnicalHead ||
        (!!user.actingPosition && user.actingPosition.isTechnicalHead)
      )
      score =
      score +
      ((activity.score -
        (
          !!user&&user.position&&user.position.isSupervisor?activity.unitId!==user.unit.id?0:activity.supervisorTimePenalities:
            (activity.employeeTimePenalities || 0) +
            (activity.employeeQualityPenalities || 0)
          )) *
        activity.weight) /
        100;
    });

    setIsApproved(approved);

    setTotalProgress((score * 100) / (weight || 1));
    setAchievedTarget(achievedTarget);
    setTotalQuarterTarget(quarterTarget.toFixed(2));
    paginate(quarter.activities);
  }, [quarter, quarter.activities]);

  // Filter
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
      {(!!quarter.activities[0] ||
        (location.pathname === "/rbm/unit-indicators/activities" &&
          (user.position.isSupervisor ||
            (!!user.actingPosition && user.actingPosition.isSupervisor))) ||
        user.position.isPlanner) && (
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
                      {`${totalProgress.toFixed(2)}%`}
                    </Typography>
                  </Box>
                </Box>
              </Tooltip>
            }
            action={
              <>
                {(((user.position.isSupervisor ||
                  (!!user.actingPosition &&
                    user.actingPosition.isSupervisor)) &&
                  !!selectedIndicator.unitId &&
                  location.pathname === "/rbm/unit-indicators/activities" &&
                  (selectedIndicator.unitId === user.unit.id ||
                    (!!user.actingUnit &&
                      selectedIndicator.unitId === user.actingUnit.id))) ||
                  user.position.isPlanner) && (
                  <Tooltip title="Add New Activity">
                    <IconButton
                      onClick={() => {
                        if (selectedFiscalYear.active)
                          setShowActivityForm(true);
                        else alert("Planning closed");
                      }}
                      color="info"
                    >
                      <span className="material-icons">add_box</span>
                    </IconButton>
                  </Tooltip>
                )}
              </>
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
                {location.pathname !== "/rbm/my-activities" &&
                  totalQuarterTarget !== quarter.target.toFixed(2) &&
                  !user.isEmployee && (
                    <Tooltip
                      title={`${quarter.target - totalQuarterTarget} Target${
                        quarter.target - totalQuarterTarget > 1 ? "s" : ""
                      } remaining`}
                    >
                      <span
                        className="material-icons text-danger"
                        style={{ cursor: "default" }}
                      >
                        error
                      </span>
                    </Tooltip>
                  )}
              </span>
            }
            subheader={
              <span>
                <strong>Target: </strong>
                {location.pathname !== "/rbm/my-activities" && (
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
                            {achievedTarget.toFixed(2)} Achieved
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
                )}
                {location.pathname === "/rbm/my-activities" && (
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
                            {achievedTarget.toFixed(2)} Achieved
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
                )}

                {(user.position.isSupervisor ||
                  (!!user.actingPosition &&
                    user.actingPosition.isSupervisor)) && (
                  <Button
                    disabled={loading || isApproved}
                    onClick={() => publishScores(quarter.quarterId)}
                    variant="contained"
                    color="success"
                    className="ml-2"
                  >
                    Publish Q{quarter.quarterId} Score
                  </Button>
                )}
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
                <ActivityCard
                  setIsEditing={setIsEditing}
                  totalWeight={totalWeight}
                  setShowActivityForm={setShowActivityForm}
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

          <ActivityForm
            totalWeight={totalWeight}
            totalQuarterTarget={totalQuarterTarget}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            showActivityForm={showActivityForm}
            setShowActivityForm={setShowActivityForm}
            quarter={quarter}
          />
        </Card>
      )}
    </>
  );
};

const mapStateToProps = ({
  selectedIndicator,
  selectedFiscalYear,
  user,
  loading,
}) => {
  return { selectedIndicator, selectedFiscalYear, user, loading };
};
export default connect(mapStateToProps, {
  deleteIndicator,
  approveIndicator,
  publishScores,
})(QuarterCard);
