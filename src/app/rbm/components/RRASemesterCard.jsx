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
import { downloadRRAEmployeeEvaluationReport } from "../../../store/rbm/actions";
import ActivityCard from "./ActivityCard";
import ActivityForm from "./ActivityForm";

const RRASemesterCard = (props) => {
  const location = useLocation();

  const {
    loading,
    quarter,
    user,
    number,
    semesterSore,
    rraEvaluation,
    downloadRRAEmployeeEvaluationReport,
  } = props;

  return (
    <Card
      variant="outlined"
      style={{
        border: "1px solid #bcc0c5",
      }}
      className={`mb-3 `}
    >
      <CardHeader
        style={{
          backgroundColor: "#d6d9dc ",
        }}
        avatar={
          <Tooltip title="Semester Score">
            <Box
              sx={{
                position: "relative",
                display: "inline-flex",
                cursor: "default",
              }}
            >
              <CircularProgress
                className={`text-${
                  semesterSore < 60
                    ? "danger"
                    : semesterSore < 70
                    ? "warning"
                    : semesterSore < 80
                    ? "info"
                    : "success"
                }`}
                variant="determinate"
                value={semesterSore}
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
                    semesterSore < 60
                      ? "danger"
                      : semesterSore < 70
                      ? "warning"
                      : semesterSore < 80
                      ? "info"
                      : "success"
                  }`}
                >
                  {`${semesterSore.toFixed(2)}%`}
                </Typography>
              </Box>
            </Box>
          </Tooltip>
        }
        title={<>SEMESTER {number}</>}
        subheader={
          <>
            <span
              className={`badge badge-${
                semesterSore < 60
                  ? "danger"
                  : semesterSore < 70
                  ? "warning"
                  : semesterSore < 80
                  ? "info"
                  : "success"
              }`}
            >
              {semesterSore < 60
                ? "Unspecified"
                : semesterSore < 70
                ? "Inkangurirwamihigo"
                : semesterSore < 80
                ? "Inkomezamihigo"
                : "Indashyikirwa"}
            </span>{" "}
            category
          </>
        }
      />

      <CardContent style={{ paddingLeft: "5%", paddingRight: "5%" }}>
        <table className="table  table-sm  fixTableHead">
          <thead>
            <tr>
              <th style={{ width: "50%" }} className="text-right">
                GRADE {rraEvaluation?.grade?.grade}:
              </th>
              <th style={{ width: "10%" }}>Weight</th>
              <th style={{ width: "1%" }}></th>
              <th colSpan={3} className="text-center">
                Score
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th className="text-right">DEPARTMENTAL KEY PRIORITIES:</th>
              <td className="text-center">
                {rraEvaluation?.grade?.keyWeight / 100}
              </td>
              <th> x</th>
              <td className="text-center">
                {" "}
                {rraEvaluation?.departmentScore[`s${number}Score`]?.toFixed(2)}%
              </td>
              <th className="text-center"> =</th>

              <td className="text-center text-center bg-primary text-light">
                {(
                  (rraEvaluation?.grade?.keyWeight / 100) *
                  rraEvaluation?.departmentScore[`s${number}Score`]
                ).toFixed(2)}
                %
              </td>
            </tr>
            <tr>
              <th className="text-right">INDIVIDUAL EVALUATION:</th>
              <td className="text-center">
                {rraEvaluation?.grade?.individualWeight / 100}
              </td>
              <th> x</th>
              <td className="text-center">
                {rraEvaluation?.individualScore[`s${number}Score`]?.toFixed(2)}%
              </td>
              <th className="text-center"> =</th>
              <td className="text-center text-center bg-primary text-light">
                {(
                  (rraEvaluation?.grade?.individualWeight / 100) *
                  rraEvaluation?.individualScore[`s${number}Score`]
                ).toFixed(2)}
                %
              </td>
            </tr>
            <tr>
              <th className="text-right">TOTAL SCORE:</th>
              <td colSpan={5} className="text-center bg-primary text-light">
                {semesterSore.toFixed(2)}%
              </td>
            </tr>
          </tbody>
        </table>

        <button
          disabled={loading}
          type="button"
          className="btn btn-secondary btn-sm d-inline-flex justify-content-center  align-items-center  btn-block"
          onClick={() =>
            downloadRRAEmployeeEvaluationReport(
              number,
              user.employeeId,
              user.firstName.toUpperCase(),
              false
            )
          }
        >
          <i className="fas fa-download mr-1"></i>
          Download pdf report
        </button>
      </CardContent>
    </Card>
  );
};

const mapStateToProps = ({ loading, user }) => {
  return { loading, user };
};
export default connect(mapStateToProps, {
  downloadRRAEmployeeEvaluationReport,
})(RRASemesterCard);
