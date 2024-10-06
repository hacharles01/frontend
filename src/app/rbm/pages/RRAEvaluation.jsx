import { Tooltip, Card, CardContent, CardHeader } from "@mui/material";
import {
  Link,
  Redirect,
  Route,
  Switch,
  useHistory,
  useLocation,
} from "react-router-dom";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { getRRAEvaluation } from "../../../store/rbm/actions";
import RRASemesterCard from "../components/RRASemesterCard";
import { isEmpty } from "lodash";
import RRAIndividualEvaluation from "./RRAIndividualEvaluation";
import RRAOverallEvaluation from "./RRAOverallEvaluation";

const RRAEvaluation = (props) => {
  const { user } = props;
  const location = useLocation();

  return (
    <>
      <div className="row no-gutter justify-content-center">
        <div className="col-12 col-lg-11 px-0 px-md-3">
          <h6 className="d-flex align-items-center">
            <span>RRA Evaluation</span>
            <Link
              to="/rbm/rra-evaluation/individual"
              type="button"
              className={`btn ml-3 btn-${
                location.pathname.includes("/rbm/rra-evaluation/individual")
                  ? "dark"
                  : "secondary"
              } btn-sm  mr-2`}
            >
              <span className="d-flex  align-items-center">INDIVIDUAL</span>
            </Link>
            {(user.position.isTechnicalHead ||
              user.position.isPlanner ||
              user.employeeId === 78597 ||
              user.employeeId === 79000 ||
              user.employeeId === 78449 ||
              user.employeeId === 129457 ||
              user.employeeId === 156680) && (
              <Link
                to="/rbm/rra-evaluation/overall"
                type="button"
                className={`btn ml-1 btn-${
                  location.pathname.includes("/rbm/rra-evaluation/overall")
                    ? "dark"
                    : "secondary"
                } btn-sm  mr-2`}
              >
                <span className="d-flex  align-items-center">OVERALL</span>
              </Link>
            )}
          </h6>
          <Switch>
            <Route
              path="/rbm/rra-evaluation/individual"
              component={RRAIndividualEvaluation}
            />
            <Route
              path="/rbm/rra-evaluation/overall"
              component={RRAOverallEvaluation}
            />

            <Route
              path="/rbm/rra-evaluation"
              component={() => <Redirect to="/rbm/rra-evaluation/individual" />}
            />
          </Switch>
        </div>
      </div>
    </>
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
