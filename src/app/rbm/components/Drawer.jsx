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
                  to="/rbm/profile"
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
              {!!user.actingPosition &&
              user.actingPosition.isTechnicalHead &&
              !user.position.isTechnicalHead
                ? "| Ag.TECH_HEAD | "
                : ""}
              {!!user.actingPosition &&
              user.actingPosition.isSupervisor &&
              !user.position.isSupervisor
                ? "| Ag.SUPERVISOR | "
                : ""}
              {!!user.actingPosition &&
              user.actingPosition.isPlanner &&
              !user.position.isPlanner
                ? "| Ag.PLANNER | "
                : ""}
              {!!user.actingPosition &&
              user.actingPosition.isEmployee &&
              !user.position.isEmployee
                ? "| Ag.EMPLOYEE | "
                : ""}
            </small>
            <small style={{ color: "#fff" }}>
              {user.position.isTechnicalHead ? "| TECH_HEAD | " : ""}
              {user.position.isSupervisor ? "| SUPERVISOR | " : ""}
              {user.position.isPlanner ? "| PLANNER | " : ""}
              {user.position.isEmployee ? "| EMPLOYEE | " : ""}
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
                location.pathname.includes("/rbm/expected-results")
                  ? "active"
                  : ""
              }`}
              onClick={() => {
                setDrawerState(false);
              }}
            >
              <ListItemButton>
                <ListItemIcon className="item-icon text-dark">
                  <span className="material-icons">trending_up</span>
                </ListItemIcon>
                <Link to="/rbm/expected-results" className="text-dark">
                  <ListItemText
                    primary="Outputs"
                    className="pl-0"
                  ></ListItemText>
                </Link>
              </ListItemButton>
            </ListItem>
            <ListItem
              disablePadding
              className={`nav-item  ${
                location.pathname.includes("/rbm/unit-indicators")
                  ? "active"
                  : ""
              }`}
              onClick={() => {
                setDrawerState(false);
              }}
            >
              <ListItemButton>
                <ListItemIcon className="item-icon text-dark">
                  <span className="material-icons">account_tree</span>
                </ListItemIcon>
                <Link to="/rbm/unit-indicators" className="text-dark">
                  <ListItemText
                    primary="Unit Indicators"
                    className="pl-0"
                  ></ListItemText>
                </Link>
              </ListItemButton>
            </ListItem>

            <ListItem
              disablePadding
              className={`nav-item  ${
                location.pathname.includes("/rbm/my-activities") ? "active" : ""
              }`}
              onClick={() => {
                setDrawerState(false);
              }}
            >
              <ListItemButton>
                <ListItemIcon className="item-icon text-dark">
                  <span className="material-icons">list</span>
                </ListItemIcon>
                <Link to="/rbm/my-activities" className="text-dark">
                  <ListItemText
                    primary="My Activities"
                    className="pl-0"
                  ></ListItemText>
                </Link>
              </ListItemButton>
            </ListItem>

            {(user.position.isSupervisor ||
              (!!user.actingPosition && user.actingPosition.isSupervisor) ||
              user.position.isTechnicalHead ||
              (!!user.actingPosition &&
                user.actingPosition.isTechnicalHead)) && (
              <ListItem
                disablePadding
                className={`nav-item  ${
                  location.pathname.includes("/rbm/evaluate") ? "active" : ""
                }`}
                onClick={() => {
                  setDrawerState(false);
                }}
              >
                <ListItemButton>
                  <ListItemIcon className="item-icon text-info">
                    <span className="material-icons">checklist_rtl</span>
                  </ListItemIcon>
                  <Link to="/rbm/evaluate" className="text-info">
                    <ListItemText
                      primary="Evaluate"
                      className="pl-0"
                    ></ListItemText>
                  </Link>
                </ListItemButton>
              </ListItem>
            )}

            <ListItem
              disablePadding
              className={`nav-item  ${
                location.pathname.includes("/rbm/user-guide") ? "active" : ""
              }`}
              onClick={() => {
                setDrawerState(false);
              }}
            >
              <ListItemButton>
                <ListItemIcon className="item-icon text-dark">
                  <span className="material-icons">local_library</span>
                </ListItemIcon>
                <Link to="/rbm/user-guide" className="text-dark">
                  <ListItemText
                    primary="User-Guide"
                    className="pl-0"
                  ></ListItemText>
                </Link>
              </ListItemButton>
            </ListItem>

            {(user.position.isPlanner ||
              (!!user.actingPosition && user.actingPosition.isPlanner) ||
              user.position.isTechnicalHead ||
              (!!user.actingPosition && user.actingPosition.isTechnicalHead) ||
              user.position.isRBMOversight ||
              (!!user.actingPosition &&
                user.actingPosition.isRBMOversight)) && (
              <ListItem
                disablePadding
                className={`nav-item  ${
                  location.pathname.includes("/rbm/monitor") ? "active" : ""
                }`}
                onClick={() => {
                  setDrawerState(false);
                }}
              >
                <ListItemButton>
                  <ListItemIcon className="item-icon text-info">
                    <span className="material-icons">preview</span>
                  </ListItemIcon>
                  <Link to="/rbm/monitor" className="text-info">
                    <ListItemText
                      primary="Monitor progress"
                      className="pl-0"
                    ></ListItemText>
                  </Link>
                </ListItemButton>
              </ListItem>
            )}

            {(user.position.isRBMOversight ||
              (!!user.actingPosition &&
                user.actingPosition.isRBMOversight)) && (
              <ListItem
                disablePadding
                className={`nav-item  ${
                  location.pathname.includes("/rbm/oversight") ? "active" : ""
                }`}
                onClick={() => {
                  setDrawerState(false);
                }}
              >
                <ListItemButton>
                  <ListItemIcon className="item-icon text-info">
                    <span className="material-icons"> remove_red_eye</span>
                  </ListItemIcon>
                  <Link to="/rbm/oversight" className="text-info">
                    <ListItemText
                      primary="RBM Oversight"
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
