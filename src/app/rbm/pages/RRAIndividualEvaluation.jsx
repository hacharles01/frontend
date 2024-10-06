import { Tooltip, Card, CardContent, CardHeader } from "@mui/material";
import { useHistory } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { getRRAEvaluation } from "../../../store/rbm/actions";
import RRASemesterCard from "../components/RRASemesterCard";
import { isEmpty } from "lodash";

const RRAEvaluation = (props) => {
  const { user, loading, rraEvaluation, getRRAEvaluation } = props;

  const [s1Score, setS1Score] = useState(0);
  const [s2Score, setS2Score] = useState(0);
  const [totalProgress, setTotalProgress] = useState(0);

  useEffect(() => {
    getRRAEvaluation();
  }, []);

  useEffect(() => {
    if (!isEmpty(rraEvaluation)) {
      const { departmentScore, grade, individualScore } = rraEvaluation;

      if (!!departmentScore && !!grade && !!individualScore) {
        const s1Score =
          (departmentScore.s1Score * grade.keyWeight) / 100 +
          (individualScore.s1Score * grade.individualWeight) / 100;
        const s2Score =
          (departmentScore.s2Score * grade.keyWeight) / 100 +
          (individualScore.s2Score * grade.individualWeight) / 100;
        setS1Score(s1Score);
        setS2Score(s2Score);
        setTotalProgress((s1Score + s2Score) / 2);
      }
    }
  }, [rraEvaluation]);

  // setTotalProgress(s1Score);

  return (
    <Card
      className=" "
      variant="outlined"
      style={{ backgroundColor: "#f6f8fa" }}
    >
      <CardHeader
        subheader={
          <>
            {!!user && (
              <span className="font-weight-bold text-uppercase text-primary">
                <i className="fas fa-user mr-1 "></i>
                {user.firstName} {user.lastName} -{" "}
                <span className="text-dark">SEMESTER 2 SCORE</span>
                <Tooltip title="My Score">
                  <div
                    className="progress bg-white   mr-2"
                    style={{
                      border: "1px solid rgba(0, 0, 0, 0.12)",
                      cursor: "default",
                    }}
                  >
                    <div
                      className={`progress-bar  text-${
                        s1Score < 5 ? "dark" : "light"
                      }  bg-${
                        s1Score < 50
                          ? "danger"
                          : s1Score < 70
                          ? "warning"
                          : s1Score < 100
                          ? "info"
                          : "success"
                      }`}
                      role="progressbar"
                      style={{ width: s1Score + "%" }}
                      aria-valuenow={s1Score}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      <span
                        className={`ml-5 ${
                          s1Score < 0
                            ? "text-danger"
                            : s1Score < 5 && s1Score > 0
                            ? "text-dark"
                            : ""
                        }`}
                      >
                        {s1Score.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </Tooltip>
              </span>
            )}
          </>
        }
      />

      <CardContent className="px-0 px-md-4">
        {!isEmpty(rraEvaluation) && (
          <div className="row">
            {/* <div className="col-12">
              <RRASemesterCard
                number={1}
                semesterSore={s1Score}
                rraEvaluation={rraEvaluation}
              />
            </div> */}
            <div className="col-12">
              <RRASemesterCard
                number={2}
                semesterSore={s2Score}
                rraEvaluation={rraEvaluation}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const mapStateToProps = ({ rraEvaluation, loading, user }) => {
  return {
    loading,
    user,
    rraEvaluation,
  };
};
export default connect(mapStateToProps, {
  getRRAEvaluation,
})(RRAEvaluation);
