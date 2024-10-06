import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import defaultProfile from "../../assets/default-profile.jpg";
import logo from "../../assets/logo-small.png";
import appeal from "../../assets/icons/appeal.png";
import career from "../../assets/icons/career.png";
import contract from "../../assets/icons/contract.png";
import discipline from "../../assets/icons/discipline.png";
import exit from "../../assets/icons/exit.png";
import leave from "../../assets/icons/leave.png";
import payroll from "../../assets/icons/payroll.png";
import rbm from "../../assets/icons/rbm.png";
import recruitment from "../../assets/icons/recruitment.png";
import structure from "../../assets/icons/structure.png";
import talent from "../../assets/icons/talent.png";
import training from "../../assets/icons/training.png";

import {
  AppBar,
  Avatar,
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";

import { connect } from "react-redux";
import { logout } from "../../../store/common/actions";

const Header = (props) => {
  const history = useHistory();
  const { drawerState, setDrawerState, user, logout } = props;

  const [anchorElUser, setAnchorElUser] = useState(null);
  const userMenuOpen = Boolean(anchorElUser);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const [anchorElModules, setAnchorElModules] = useState(null);
  const modulesMenuOpen = Boolean(anchorElModules);

  const handleOpenModulesMenu = (event) => {
    setAnchorElModules(event.currentTarget);
  };

  const handleCloseModulesMenu = () => {
    setAnchorElModules(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" elevation={0} className="app-bar">
        <Toolbar className="pr-2">
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            className="mr-2"
            onClick={() => {
              setDrawerState(!drawerState);
            }}
          >
            <span className="material-icons">menu</span>
          </IconButton>
          <Typography component="div" sx={{ flexGrow: 1 }} className="left">
            <img
              src={logo}
              className="brand_logo mr-2 d-none d-md-inline"
              alt="Logo"
            />
            <strong>
              <span style={{ color: "#078ece", fontWeight: "bolder" }}>
                IPPIS
              </span>{" "}
              |
            </strong>

            <span className="ml-2 d-none d-md-inline text-dark text-uppercase font-weight-bold">
              organizational structure
            </span>
          </Typography>

          {!!user.actingPosition && (
            <div className="roles text-primary  d-flex">
              <>
                {user.actingPosition.isSupervisor && (
                  <span className=" d-flex ">
                    <span className="  role text-truncate">Ag.SUPERVISOR</span>
                    <span className="material-icons ">arrow_left</span>{" "}
                  </span>
                )}

                {user.actingPosition.isPlanner && (
                  <span className=" d-flex ">
                    <span className="  role text-truncate"> Ag.PLANNER</span>
                    <span className="material-icons ">arrow_left</span>{" "}
                  </span>
                )}

                {user.actingPosition.isTechnicalHead && (
                  <span className=" d-flex ">
                    <span className="  role text-truncate"> Ag.TECH_HEAD</span>
                    <span className="material-icons ">arrow_left</span>{" "}
                  </span>
                )}

                {user.actingPosition.isEmployee && (
                  <span className=" d-flex ">
                    <span className="  role text-truncate"> Ag.EMPLOYEE</span>
                    <span className="material-icons ">arrow_left</span>{" "}
                  </span>
                )}
              </>
            </div>
          )}

          <div className="roles text-primary  d-flex">
            <>
              {user.position.isSupervisor &&
                (!user.actingPosition ||
                  (!!user.actingPosition && !user.position.isSupervisor)) && (
                  <span className=" d-flex ">
                    <span className="  role text-truncate">SUPERVISOR</span>
                    <span className="material-icons">arrow_left</span>{" "}
                  </span>
                )}

              {user.position.isPlanner &&
                (!user.actingPosition ||
                  (!!user.actingPosition && !user.position.isPlanner)) && (
                  <span className=" d-flex ">
                    <span className="  role text-truncate">PLANNER</span>
                    <span className="material-icons ">arrow_left</span>{" "}
                  </span>
                )}

              {user.position.isTechnicalHead &&
                (!user.actingPosition ||
                  (!!user.actingPosition &&
                    !user.position.isTechnicalHead)) && (
                  <span className=" d-flex ">
                    <span className="  role text-truncate">TECH_HEAD</span>
                    <span className="material-icons ">arrow_left</span>{" "}
                  </span>
                )}

              {user.position.isEmployee &&
                (!user.actingPosition ||
                  (!!user.actingPosition && !user.position.isEmployee)) && (
                  <span className=" d-flex ">
                    <span className="  role text-truncate">EMPLOYEE</span>
                    <span className="material-icons ">arrow_left</span>{" "}
                  </span>
                )}
            </>
          </div>

          <IconButton onClick={handleOpenUserMenu} className="p-0 ">
            {!user.profileImage && (
              <Avatar alt="Profile picture" src={defaultProfile} />
            )}
            {user.profileImage && (
              <Avatar
                style={{ border: "1px solid #d1cbcb" }}
                alt={user.firstName}
                src={`data:image/png;base64,${user.profileImage}`}
              />
            )}
          </IconButton>
          <Menu
            anchorEl={anchorElUser}
            id="account-menu"
            open={userMenuOpen}
            onClose={handleCloseUserMenu}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                "&:before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem disabled>
              {user.firstName.toUpperCase()} {user.lastName.toUpperCase()}
            </MenuItem>
            <Divider />

            <MenuItem
              onClick={() => {
                handleCloseUserMenu();
                history.push("/rbm/profile");
              }}
            >
              <ListItemIcon>
                <span className="material-icons ">person</span>
              </ListItemIcon>
              Profile
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleCloseUserMenu();
                history.push("/rbm/my-account");
              }}
            >
              <ListItemIcon>
                <span className="material-icons">lock</span>
              </ListItemIcon>
              My account
            </MenuItem>
            <Divider />

            <MenuItem className="text-danger" onClick={() => logout(history)}>
              <ListItemIcon className="text-danger">
                <span className="material-icons">logout</span>
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>

          <span className="d-inline d-lg-none">
            <IconButton
              edge="start"
              size="small"
              color="inherit"
              aria-label="menu"
              className="ml-2"
              onClick={handleOpenModulesMenu}
            >
              <span className="material-icons">more_vert</span>
            </IconButton>
            <Menu
              anchorEl={anchorElModules}
              open={modulesMenuOpen}
              onClose={handleCloseModulesMenu}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflowY: "scroll",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem disabled>IPPIS MODULES</MenuItem>
              <Divider />

              <MenuItem
                disabled
                onClick={() => {
                  handleCloseModulesMenu();
                }}
              >
                <ListItemIcon>
                  <img src={recruitment} width="20" alt="" />
                </ListItemIcon>
                Recruitment
              </MenuItem>

              <MenuItem
                onClick={() => {
                  handleCloseModulesMenu();
                  history.push("/structure");
                }}
              >
                <ListItemIcon>
                  <img src={structure} width="20" alt="" />
                </ListItemIcon>
                Org. Structure
              </MenuItem>

              <MenuItem
                disabled
                onClick={() => {
                  handleCloseModulesMenu();
                }}
              >
                <ListItemIcon>
                  <img src={payroll} width="20" alt="" />
                </ListItemIcon>
                Payroll
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleCloseModulesMenu();
                  history.push("/rbm");
                }}
              >
                <ListItemIcon>
                  <img src={rbm} width="20" alt="" />
                </ListItemIcon>
                RBM
              </MenuItem>
              <MenuItem
                disabled
                onClick={() => {
                  handleCloseModulesMenu();
                }}
              >
                <ListItemIcon>
                  <img src={training} width="20" alt="" />
                </ListItemIcon>
                Training
              </MenuItem>
              <MenuItem
                disabled
                onClick={() => {
                  handleCloseModulesMenu();
                }}
              >
                <ListItemIcon>
                  <img src={career} width="20" alt="" />
                </ListItemIcon>
                Career
              </MenuItem>
              <MenuItem
                disabled
                onClick={() => {
                  handleCloseModulesMenu();
                }}
              >
                <ListItemIcon>
                  <img src={talent} width="20" alt="" />
                </ListItemIcon>
                Talents
              </MenuItem>
              <MenuItem
                disabled
                onClick={() => {
                  handleCloseModulesMenu();
                }}
              >
                <ListItemIcon>
                  <img src={leave} width="20" alt="" />
                </ListItemIcon>
                Leave & Abscence
              </MenuItem>

              <MenuItem
                disabled
                onClick={() => {
                  handleCloseModulesMenu();
                }}
              >
                <ListItemIcon>
                  <img src={discipline} width="20" alt="" />
                </ListItemIcon>
                Discipline
              </MenuItem>

              <MenuItem
                disabled
                onClick={() => {
                  handleCloseModulesMenu();
                }}
              >
                <ListItemIcon>
                  <img src={appeal} width="20" alt="" />
                </ListItemIcon>
                E-Appeal
              </MenuItem>

              <MenuItem
                disabled
                onClick={() => {
                  handleCloseModulesMenu();
                }}
              >
                <ListItemIcon>
                  <img src={exit} width="20" alt="" />
                </ListItemIcon>
                Exit
              </MenuItem>
            </Menu>
          </span>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

const mapStateToProps = ({
  user,
  selectedUserEntity,
  strongPassword,
  loading,
}) => {
  return { user, selectedUserEntity, strongPassword, loading };
};
export default connect(mapStateToProps, { logout })(Header);
