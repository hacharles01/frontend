import { Tooltip, Card, CardContent, CardHeader } from "@mui/material";
import { useHistory } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  getRRAOverallEvaluations,
  downloadRRAEmployeeEvaluationReport,
} from "../../../store/rbm/actions";

import { CSVLink } from "react-csv";
import ReactPaginate from "react-paginate";

const RRAEvaluation = (props) => {
  const {
    user,
    loading,
    rraOverallEvaluations,
    getRRAOverallEvaluations,
    downloadRRAEmployeeEvaluationReport,
  } = props;

  useEffect(() => {
    getRRAOverallEvaluations();
  }, []);

  //Searching
  const [filteredItems, setFilteredItems] = useState([
    ...rraOverallEvaluations,
  ]);

  const [searchTeam, setSearchTeam] = useState("");

  useEffect(() => {
    const filtered = [...rraOverallEvaluations].filter(
      ({ firstName, lastName, positionName, unitName, grade }) =>
        (
          (firstName || "") +
          (lastName || "") +
          (positionName || "") +
          (unitName || "") +
          (grade || "")
        )
          .toLowerCase()
          .replace(/ /g, "")
          .includes(searchTeam.toLowerCase().replace(/ /g, ""))
    );
    setFilteredItems(filtered);

    paginate(filtered);
  }, [searchTeam, rraOverallEvaluations]);

  //PAGINATION
  const [paginatedItems, setPaginatedItems] = useState(null);
  const [pageCount, setPageCount] = useState(0);

  const [itemOffset, setItemOffset] = useState(0);

  const itemsPerPage = 20;

  const paginate = (items) => {
    const endOffset = itemOffset + itemsPerPage;
    setPaginatedItems(items.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(items.length / itemsPerPage));
  };

  useEffect(() => {
    paginate(filteredItems);
  }, [itemOffset, itemsPerPage, rraOverallEvaluations, filteredItems]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % filteredItems.length;

    setItemOffset(newOffset);
  };

  const getNo = (idToSearch) => {
    return rraOverallEvaluations.findIndex(
      ({ employeeId }) => employeeId === idToSearch
    );
  };

  return (
    <Card
      className=" "
      variant="outlined"
      style={{ backgroundColor: "#f6f8fa" }}
    >
      <CardHeader
        subheader={
          <span className="font-weight-bold text-uppercase text-primary">
            Overall evaluation report |{" "}
            <span className="text-dark">SEMESTER 2</span>
          </span>
        }
      />

      <CardContent className="px-0 px-md-4 pt-0">
        {+rraOverallEvaluations.length > 0 && (
          <div className="form-group  mb-2">
            <input
              type="text"
              className="form-control"
              value={searchTeam}
              id="filter"
              placeholder="Search..."
              onChange={(e) => setSearchTeam(e.target.value)}
            />
          </div>
        )}
        {(!loading || +rraOverallEvaluations.length > 0) &&
          (user.position.isTechnicalHead ||
            user.position.isPlanner ||
            user.employeeId === 78597 ||
            user.employeeId === 156680) && (
            <table className="table table-striped table-sm">
              <thead>
                <tr>
                  <th colSpan={7}>
                    <CSVLink
                      data={rraOverallEvaluations}
                      filename="Semester -1- Evaluation Report"
                      className="btn btn-secondary btn-sm d-inline-flex justify-content-center  align-items-center  btn-block"
                    >
                      <i className="fas fa-download mr-1"></i>
                      Download csv file
                    </CSVLink>
                  </th>
                  <th
                    colSpan={2}
                    style={{ backgroundColor: "#cce5ff" }}
                    className="text-center"
                  >
                    Key.Priorities
                  </th>
                  <th
                    colSpan={2}
                    style={{ backgroundColor: "#dee2e6" }}
                    className="text-center"
                  >
                    Indiv.Evaluation
                  </th>
                  <th
                    rowSpan={2}
                    colSpan={2}
                    style={{ backgroundColor: "#bbe9c6" }}
                  >
                    TotalScore
                  </th>
                </tr>
                <tr>
                  <th>
                    N<sup>o</sup>
                  </th>
                  <th>EmployeeId</th>
                  <th>Last Name</th>
                  <th>First Name</th>
                  <th>Position</th>
                  <th>Unit</th>
                  <th>Grade</th>
                  <th
                    style={{ backgroundColor: "#cce5ff" }}
                    className="text-center"
                  >
                    Weight
                  </th>
                  <th
                    style={{ backgroundColor: "#cce5ff" }}
                    className="text-center"
                  >
                    Score
                  </th>
                  <th
                    style={{ backgroundColor: "#dee2e6" }}
                    className="text-center"
                  >
                    Weight
                  </th>
                  <th
                    style={{ backgroundColor: "#dee2e6" }}
                    className="text-center"
                  >
                    Score
                  </th>
                </tr>
              </thead>
              {!!paginatedItems && (
                <tbody style={{ fontSize: "12px" }}>
                  {paginatedItems.map((item, index) => (
                    <tr key={item.employeeId}>
                      <td>{getNo(item.employeeId) + 1}</td>
                      <td>{item.employeeId}</td>
                      <td>{item.lastName}</td>
                      <td>{item.firstName}</td>
                      <td>{item.positionName}</td>
                      <td>{item.unitName}</td>
                      <td className="text-center">{item.grade}</td>
                      <td
                        style={{ backgroundColor: "#cce5ff" }}
                        className="text-center"
                      >
                        {item.keyWeight}
                      </td>
                      <td
                        style={{ backgroundColor: "#cce5ff" }}
                        className="text-center"
                      >
                        {item.keyScore}%
                      </td>
                      <td
                        style={{ backgroundColor: "#dee2e6" }}
                        className="text-center"
                      >
                        {item.individualWeight}
                      </td>
                      <td
                        style={{ backgroundColor: "#dee2e6" }}
                        className="text-center"
                      >
                        {item.individualScore}%
                      </td>
                      <td
                        className="text-center"
                        style={{
                          fontWeight: "bold",
                          backgroundColor: "#bbe9c6",
                        }}
                      >
                        {item.totalScore}%
                      </td>
                      <td className="text-right" style={{ width: "14px" }}>
                        <button
                          disabled={loading}
                          className="btn btn-secondary btn-sm p-1"
                          onClick={() =>
                            downloadRRAEmployeeEvaluationReport(
                              1,
                              item.employeeId,
                              item.lastName.toUpperCase(),
                              true
                            )
                          }
                        >
                          <i className="fas fa-download mr-1"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
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
  );
};

const mapStateToProps = ({ rraOverallEvaluations, loading, user }) => {
  return {
    loading,
    user,
    rraOverallEvaluations,
  };
};
export default connect(mapStateToProps, {
  getRRAOverallEvaluations,
  downloadRRAEmployeeEvaluationReport,
})(RRAEvaluation);
