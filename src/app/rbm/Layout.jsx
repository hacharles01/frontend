import React, { useEffect, useState } from "react";
import {
  Redirect,
  Route,
  Switch,
  useHistory,
  Link,
  useLocation,
} from "react-router-dom";
import Drawer from "./components/Drawer";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import Activities from "./pages/Activities";
import MyActivities from "./pages/MyActivities";
import ExpectedResults from "./pages/ExpectedResults";
import Indicators from "./pages/Indicators";
import UnitIndicators from "./pages/UnitIndicators";
import isEmpty from "lodash/isEmpty";
import { connect } from "react-redux";
import showLoading from "../assets/loading.gif";

import { getUser } from "../../store/common/actions";
import {
  getFiscalYears,
  getUserEntities,
  getSelectedFiscalYear,
  getSelectedUserEntity,
} from "../../store/rbm/actions";

import MenuBar from "./components/MenuBar";
import Proflile from "../common/pages/Profile";
import MyAcount from "../common/pages/MyAcount";
import Oversight from "./pages/Oversight";
import Monitor from "./pages/Monitor";
import UserGuide from "./pages/UserGuide";
import WeakPasswordMessage from "../common/components/WeakPasswordMessage";
// import DateCountdown from "react-date-countdown-timer";
import SubordinatesEvaluations from "./pages/SubordinatesEvaluations";
import RRAEvaluation from "./pages/RRAEvaluation";
import EvaluationGuide from "./pages/EvaluationGuide";

function calculateTimeLeft(selectedFiscalYear) {
  const year = new Date().getFullYear();
  const deadLine = new Date(`${selectedFiscalYear.deadLine}`);
  deadLine.setDate(deadLine.getDate() + 1);

  const toDay = new Date();

  const difference = +deadLine - +toDay;

  // console.log(new Date(`${year}-10-1`));
  let timeLeft = {};

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  return timeLeft;
}

const Layout = (props) => {
  const history = useHistory();
  const location = useLocation();

  const {
    user,
    getUser,
    getFiscalYears,
    getUserEntities,
    getSelectedFiscalYear,
    getSelectedUserEntity,
    selectedUserEntity,
    selectedFiscalYear,
    fiscalYears,
    userEntities,
    strongPassword,
    loading,
  } = props;
  const [drawerState, setDrawerState] = useState(false);

  useEffect(
    () => {
      getUser(history);
      if (!fiscalYears.length) getFiscalYears();
      if (!userEntities.length) getUserEntities();
      if (isEmpty(selectedFiscalYear)) getSelectedFiscalYear();
      if (isEmpty(selectedUserEntity)) getSelectedUserEntity();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const [timeLeft, setTimeLeft] = useState(
    calculateTimeLeft(selectedFiscalYear)
  );
  useEffect(() => {
    const id = setTimeout(() => {
      setTimeLeft(calculateTimeLeft(selectedFiscalYear));
    }, 1000);

    return () => {
      clearTimeout(id);
    };
  });

  const timerComponents = Object.keys(timeLeft).map((interval, index) => {
    if (!timeLeft[interval]) {
      <span key={index}>00 {interval} </span>;
    }

    return (
      <span key={index}>
        {timeLeft[interval].toString().padStart(2, "0")} {interval}{" "}
      </span>
    );
  });

  return (
    <React.Fragment>
      {isEmpty(user) && (
        <div className="loader ">
          <img src={showLoading} height="128" alt="loading" />
        </div>
      )}
      {!isEmpty(user) && (
        <>
          <Header drawerState={drawerState} setDrawerState={setDrawerState} />

          <Drawer drawerState={drawerState} setDrawerState={setDrawerState} />
          <MenuBar />
          {!isEmpty(selectedFiscalYear) && selectedFiscalYear.showDeadLine && (
            <div
              className="alert alert-warning  py-0 mb-0 weak-password-div  text-center text-uppercase"
              style={{ borderBottomColor: "#ff5722", borderRadius: "0px" }}
            >
              {selectedFiscalYear.isMarqueeMessage && (
                <marquee behavior="" direction="">
                  <strong style={{ color: "red" }}>
                    {selectedFiscalYear.deadLineMessage}
                  </strong>
                </marquee>
              )}

              {!selectedFiscalYear.isMarqueeMessage && (
                <>
                  <span
                    className="mr-2 font-weight-bold"
                    style={{ color: "#078ece" }}
                  >
                    {selectedFiscalYear.deadLineMessage}:
                  </span>

                  <span className="font-weight-bold " style={{ color: "red" }}>
                    {timerComponents.length ? (
                      timerComponents
                    ) : (
                      <span>00 DAYS 00 HOURS 00 MINUTES 00 SECONDS</span>
                    )}
                  </span>
                </>
              )}
            </div>
          )}

          {!strongPassword && location.pathname !== "/rbm/my-account" && (
            <WeakPasswordMessage />
          )}

          <div
            className={`container-fluid ${
              location.pathname === "/rbm/user-guide"
                ? "pt-0 px-0"
                : "pt-2 px-4"
            } `}
            id="main-container"
          >
            <Switch>
              <Route path="/rbm/dashboard" component={Dashboard} />
              <Route path="/rbm/evaluate" component={SubordinatesEvaluations} />
              <Route path="/rbm/profile" component={Proflile} />
              <Route path="/rbm/my-account" component={MyAcount} />
              <Route path="/rbm/rra-evaluation" component={RRAEvaluation} />
              <Route
                path="/rbm/expected-results/indicators/activities"
                component={Activities}
              />
              <Route
                path="/rbm/expected-results/indicators"
                component={Indicators}
              />

              <Route path="/rbm/expected-results" component={ExpectedResults} />

              <Route
                path="/rbm/unit-indicators/activities"
                component={Activities}
              />
              <Route path="/rbm/my-activities" component={MyActivities} />
              <Route path="/rbm/unit-indicators" component={UnitIndicators} />
              <Route path="/rbm/oversight" component={Oversight} />
              <Route path="/rbm/monitor" component={Monitor} />
              <Route path="/rbm/user-guide" component={UserGuide} />
              <Route path="/rbm/evaluation-guide" component={EvaluationGuide} />

              <Route
                path="/rbm"
                component={() => <Redirect to="/rbm/expected-results" />}
              />
            </Switch>
          </div>
        </>
      )}
    </React.Fragment>
  );
};

const mapStateToProps = ({
  user,
  selectedUserEntity,
  selectedFiscalYear,
  fiscalYears,
  userEntities,
  strongPassword,
  loading,
}) => {
  return {
    user,
    selectedUserEntity,
    selectedFiscalYear,
    fiscalYears,
    userEntities,
    strongPassword,
    loading,
  };
};
export default connect(mapStateToProps, {
  getUser,
  getFiscalYears,
  getUserEntities,
  getSelectedFiscalYear,
  getSelectedUserEntity,
})(Layout);
