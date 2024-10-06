import React, { useState, useEffect } from "react";
import { styled, useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";

import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";

import Typography from "@mui/material/Typography";

import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";

import { connect } from "react-redux";
import AddIcon from "@mui/icons-material/Add";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import { isMobile } from "react-device-detect";
import SearchBox from "../components/SearchBox";
import UnitDrawer from "../components/UnitDrawer";
import { Link } from "react-router-dom";
import {
  Skeleton,
  CardContent,
  SpeedDial,
  SpeedDialIcon,
  SpeedDialAction,
  List
} from "@mui/material";

import {
  getEmployees,
  setSearchEmployees,
} from "../../../store/structure/actions";
import EmployeeCard from "../components/EmployeeCard";
import AddEmployeeDialog from "../components/AddEmployeeDialog";

const drawerMaxWidth = 440;
const drawerMinWidth = 300;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open, drawer }) => ({
    flexGrow: 1,

    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawer}px`,

    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const actions = [
  { icon: <AddIcon />, name: "Add New Employee", key: 1 },
  { icon: <ArrowCircleDownIcon />, name: "Pull Existing employee", key: 2 },
  { icon: <CloudDownloadIcon />, name: "Export all employees", key: 2 },
];

const Employees = (props) => {
  const {
    selectedUnit,
    getEmployees,
    employees,
    loading,
    setSearchEmployees,
    searchCurrentEmployees,
  } = props;

  const theme = useTheme();
  const [open, setOpen] = useState(isMobile ? false : true);
  const [drawer, setDrawer] = useState(
    isMobile ? drawerMinWidth : drawerMaxWidth
  );
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);

  useEffect(
    () => {
      if (selectedUnit && selectedUnit.unitId) {
        getEmployees(selectedUnit.unitId);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedUnit]
  );

  const handleDrawerOpen = () => {
    setDrawer(isMobile ? drawerMinWidth : drawerMaxWidth);
    setOpen(!open);
  };
  const capitalizeFirst = (str) => {
    if (!str) return "";
    return (
      str.toLowerCase().charAt(0).toUpperCase() + str.slice(1).toLowerCase()
    );
  };

  const onSearch = (term) => {
    setTimeout(() => {
      setSearchEmployees(term, employees, searchCurrentEmployees);
    }, 200);
  };

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />

        <UnitDrawer open={open} drawer={drawer} />

        <Main open={open} drawer={drawer}>
          <AppBar position="static" elevation={0} className="app-bar">
            <Toolbar>
              {isMobile ? (
                <IconButton
                  onClick={handleDrawerOpen}
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="open drawer"
                  sx={{ mr: 0 }}
                >
                  <span className="material-icons">menu</span>
                </IconButton>
              ) : (
                ""
              )}
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ display: { xs: "none", sm: "block" } }}
              >
                Employees
              </Typography>

              <Box sx={{ flexGrow: 1 }} />
              <Box sx={{ display: { xs: "flex", md: "flex" } }}>
                <SearchBox
                  disabled={selectedUnit ? false : true}
                  onSearch={onSearch}
                  placeholder="Search…"
                />
              </Box>
            </Toolbar>
          </AppBar>
          {selectedUnit && (
            <div
              style={{
                backgroundColor: "rgb(7, 142, 206)",
                borderBottom: "1px solid rgb(7, 142, 206)",
                borderTop: "1px solid rgb(7, 142, 206)",
              }}
              className="d-flex bread-crumb align-items-center "
            >
              <Link
                style={{ textDecoration: "none", color: "#fff" }}
                to="/structure/employees"
                className={`px-1 rounded`}
              >
                <span className="text-truncate  menu-item">Unit</span>
              </Link>
              <span className="material-icons text-light">chevron_right</span>
              <div
                style={{ textDecoration: "none", color: "#fff" }}
                to="/structure/employees"
                className={`px-1 rounded active`}
              >
                <span
                  style={{
                    textDecoration: "initial",
                    color: "yellow",
                  }}
                >
                  {capitalizeFirst(selectedUnit.unitName)}
                </span>
              </div>
            </div>
          )}

          <div
            style={{
              padding: theme.spacing(1),
              height: "auto",
              maxHeight: "auto",
              margin: "1.5em",
              backgroundColor: "#fff",
              borderRadius: "0.5rem",
              overflow: "visible",
              boxShadow: "0 5px 5px 0 rgb(42 119 144 / 5%)",
              MozBoxShadow: "0 5px 5px 0 rgba(42,119,144,.05)",
            }}
          >
            <CardContent
              style={{
                padding: ".3em",
                height: "auto",
                maxHeight: "60vh",
                minHeight: "auto",
                overflow: "auto",
              }}
            >
              {!!employees.length && !loading && (
                  <List
                    sx={{
                      width: "100%",
                      maxWidth: "100%",
                      bgcolor: "background.paper",
                    }}
                  >
                    {employees.map((employee, index) => (
                      <EmployeeCard employee={employee} index={index} key={index} />
                    ))}
                  </List>
              )}

              {!employees.length && !loading && (
                <div className="jumbotron jumbotron-fluid text-center mt-5">
                  <div className="container">
                    <p className="lead">No employees found</p>
                  </div>
                </div>
              )}

              {selectedUnit && loading && !employees.length && (
                <div style={{ padding: theme.spacing(1) }}>
                  <Skeleton
                    variant="rectangular"
                    className="mb-3 mt-2"
                    height={118}
                  />
                  <Skeleton
                    variant="rectangular"
                    className="mb-3"
                    height={96}
                  />
                  <Skeleton
                    variant="rectangular"
                    className="mb-3"
                    height={96}
                  />
                </div>
              )}
            </CardContent>

            {showEmployeeForm && (
              <AddEmployeeDialog
                showEmployeeForm={showEmployeeForm}
                setShowEmployeeForm={setShowEmployeeForm}
                selectedUnit={selectedUnit}
              />
            )}
          </div>
        </Main>

        {selectedUnit && (
          <SpeedDial
            disabled={selectedUnit ? false : true}
            ariaLabel="SpeedDial openIcon example"
            sx={{ position: "absolute", bottom: 30, right: 40 }}
            icon={<SpeedDialIcon openIcon={<EditIcon />} />}
          >
            {actions.map((action) => (
              <SpeedDialAction
                key={action.name}
                icon={action.icon}
                tooltipTitle={action.name}
                onClick={() => {
                  if (action.key === 1) {
                    setShowEmployeeForm(true);
                  }
                }}
              />
            ))}
          </SpeedDial>
        )}
      </Box>
    </>
  );
};

const mapStateToProps = ({
  selectedUnit,
  employees,
  loading,
  searchCurrentEmployees,
}) => {
  return { selectedUnit, employees, loading, searchCurrentEmployees };
};

export default connect(mapStateToProps, { getEmployees, setSearchEmployees })(
  Employees
);
