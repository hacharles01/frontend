import React from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import defaultProfile from "../../assets/default-profile.jpg";

import {
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";

import { connect } from "react-redux";
import { logout } from "../../../store/common/actions";

const Drawer = (props) => {
  const { drawerState, setDrawerState, user, logout } = props;

  const location = useLocation();
  const history = useHistory();

  return (
    <React.Fragment>
      <div
        id="drawer"
        className={`position-fixed  ${drawerState ? "active" : ""}`}
      >
        <div>
          <div
            className="drawer-user "
            style={{ borderBottom: "1px solid #d8d9da" }}
          >
            {user.profileImage && (
              <img
                src={`data:image/png;base64,${user.profileImage}`}
                className="img-fluid rounded-circle mb-2"
                alt="Linda Miller"
              />
            )}
            {!user.profileImage && (
              <img
                src={defaultProfile}
                className="img-fluid rounded-circle mb-2"
                alt="Linda Miller"
              />
            )}
            <div>
              <Tooltip title="Go to your profile">
                <Link
                  to="/structure/profile"
                  style={{ color: "#b8ff07" }}
                  className="font-weight-bold text-uppercase"
                  onClick={() => {
                    setDrawerState(false);
                  }}
                >
                  {user.firstName} {user.lastName}
                </Link>
              </Tooltip>
            </div>
            <small className=" " style={{ color: "#ff0" }}>
              {user.position.name}
            </small>{" "}
            <br />
            <small style={{ color: "#fff" }}>
              {!!user.actingPosition && user.actingPosition.isTechnicalHead
                ? "| Ag.TECH_HEAD | "
                : ""}
              {!!user.actingPosition && user.actingPosition.isSupervisor
                ? "| Ag.SUPERVISOR | "
                : ""}
              {!!user.actingPosition && user.actingPosition.isPlanner
                ? "| Ag.PLANNER | "
                : ""}
              {!!user.actingPosition && user.actingPosition.isEmployee
                ? "| Ag.EMPLOYEE | "
                : ""}
            </small>
            <small style={{ color: "#fff" }}>
              {user.position.isTechnicalHead &&
              (!user.actingPosition ||
                (!!user.actingPosition && !user.position.isTechnicalHead))
                ? "| TECH_HEAD | "
                : ""}
              {user.position.isSupervisor &&
              (!user.actingPosition ||
                (!!user.actingPosition && !user.position.isSupervisor))
                ? "| SUPERVISOR | "
                : ""}
              {user.position.isPlanner &&
              (!user.actingPosition ||
                (!!user.actingPosition && !user.position.isPlanner))
                ? "| PLANNER | "
                : ""}
              {user.position.isEmployee &&
              (!user.actingPosition ||
                (!!user.actingPosition && !user.position.isEmployee))
                ? "| EMPLOYEE | "
                : ""}
            </small>
          </div>
          <div style={{ marginTop: "0px" }}>
            <div style={{ backgroundColor: "#e5cb05", height: "2px" }}></div>
            <div style={{ backgroundColor: "#199e05", height: "2px" }}></div>
          </div>
          <List>
            <ListItem
              disablePadding
              className={`nav-item  ${
                location.pathname.includes("/structure/units") ? "active" : ""
              }`}
              onClick={() => {
                setDrawerState(false);
              }}
            >
              <ListItemButton>
                <ListItemIcon className="item-icon text-dark">
                  <span className="material-icons">account_tree</span>
                </ListItemIcon>
                <Link to="/structure/units" className="text-dark">
                  <ListItemText primary="Units" className="pl-0"></ListItemText>
                </Link>
              </ListItemButton>
            </ListItem>
            <ListItem
              disablePadding
              className={`nav-item  ${
                location.pathname.includes("/structure/positions")
                  ? "active"
                  : ""
              }`}
              onClick={() => {
                setDrawerState(false);
              }}
            >
              <ListItemButton>
                <ListItemIcon className="item-icon text-dark">
                  <span className="material-icons">event_seat</span>
                </ListItemIcon>
                <Link to="/structure/positions" className="text-dark">
                  <ListItemText
                    primary="Positions"
                    className="pl-0"
                  ></ListItemText>
                </Link>
              </ListItemButton>
            </ListItem>

            <ListItem
              disablePadding
              className={`nav-item  ${
                location.pathname.includes("/structure/employees")
                  ? "active"
                  : ""
              }`}
              onClick={() => {
                setDrawerState(false);
              }}
            >
              <ListItemButton>
                <ListItemIcon className="item-icon text-dark">
                  <span className="material-icons">group</span>
                </ListItemIcon>
                <Link to="/structure/employees" className="text-dark">
                  <ListItemText
                    primary="Employees"
                    className="pl-0"
                  ></ListItemText>
                </Link>
              </ListItemButton>
            </ListItem>

            <ListItem
              disablePadding
              className={`nav-item  ${
                location.pathname.includes("/structure/user-guide")
                  ? "active"
                  : ""
              }`}
              onClick={() => {
                setDrawerState(false);
              }}
            >
              <ListItemButton>
                <ListItemIcon className="item-icon text-dark">
                  <span className="material-icons">local_library</span>
                </ListItemIcon>
                <Link to="/structure/user-guide" className="text-dark">
                  <ListItemText
                    primary="User-Guide"
                    className="pl-0"
                  ></ListItemText>
                </Link>
              </ListItemButton>
            </ListItem>

            {(user.position.isRBMOversight ||
              (!!user.actingPosition &&
                user.actingPosition.isRBMOversight)) && (
              <ListItem
                disablePadding
                className={`nav-item  ${
                  location.pathname.includes("/structure/oversight")
                    ? "active"
                    : ""
                }`}
                onClick={() => {
                  setDrawerState(false);
                }}
              >
                <ListItemButton>
                  <ListItemIcon className="item-icon text-info">
                    <span className="material-icons"> remove_red_eye</span>
                  </ListItemIcon>
                  <Link to="/structure/oversight" className="text-info">
                    <ListItemText
                      primary="Oversight"
                      className="pl-0"
                    ></ListItemText>
                  </Link>
                </ListItemButton>
              </ListItem>
            )}
          </List>
        </div>
        <Button
          className="btn btn-block mb-3 "
          color="error"
          style={{ position: "absolute", bottom: "0" }}
          onClick={() => logout(history)}
        >
          <i
            className="fas fa-sign-out-alt mr-2 "
            style={{ transform: "rotate(180deg)" }}
          ></i>
          Logout
        </Button>
      </div>

      <div
        id="drawer-void"
        className={`position-fixed ${drawerState ? "d-block" : "d-none"} `}
        onClick={() => {
          setDrawerState(false);
        }}
      ></div>
    </React.Fragment>
  );
};

const mapStateToProps = ({ user }) => {
  return { user };
};
export default connect(mapStateToProps, { logout })(Drawer);
