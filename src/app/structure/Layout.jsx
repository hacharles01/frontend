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
import isEmpty from "lodash/isEmpty";
import { connect } from "react-redux";
import loading from "../assets/loading.gif";

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
import UserGuide from "./pages/UserGuide";
import Employees from "./pages/Employees";
import Positions from "./pages/Positions";
import Units from "./pages/Units";
import WeakPasswordMessage from "../common/components/WeakPasswordMessage";

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

  return (
    <React.Fragment>
      {isEmpty(user) && (
        <div className="loader ">
          <img src={loading} height="128" alt="loading" />
        </div>
      )}
      {!isEmpty(user) && (
        <>
          <Header drawerState={drawerState} setDrawerState={setDrawerState} />

          <Drawer drawerState={drawerState} setDrawerState={setDrawerState} />
          <MenuBar />
          {!strongPassword && location.pathname !== "/rbm/my-account" && (
            <WeakPasswordMessage />
          )}

          <div className={`container-fluid px-0 `} id="main-container">
            <Switch>
              <Route path="/structure/dashboard" component={Dashboard} />
              <Route path="/structure/user-guide" component={UserGuide} />
              <Route path="/structure/oversight" component={Oversight} />
              <Route path="/structure/units" component={Units} />
              <Route path="/structure/positions" component={Positions} />
              <Route path="/structure/employees" component={Employees} />
              <Route path="/structure/profile" component={Proflile} />
              <Route path="/structure/my-account" component={MyAcount} />

              <Route
                path="/structure"
                component={() => <Redirect to="/structure/dashboard" />}
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
}) => {
  return {
    user,
    selectedUserEntity,
    selectedFiscalYear,
    fiscalYears,
    userEntities,
    strongPassword,
  };
};
export default connect(mapStateToProps, {
  getUser,
  getFiscalYears,
  getUserEntities,
  getSelectedFiscalYear,
  getSelectedUserEntity,
})(Layout);
