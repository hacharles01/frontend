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
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
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
} from "@mui/material";

import {
  getPositions,
  setSearchPositions,
} from "../../../store/structure/actions";
import PositionCard from "../components/PositionCard";
import AddPostionDialog from "../components/AddPostionDialog";

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
  { icon: <AddIcon />, name: "Add New Position", key: 1 },
  { icon: <ArrowCircleDownIcon />, name: "Pull shared position", key: 2 },
];

const Positions = (props) => {
  const {
    selectedUnit,
    getPositions,
    positions,
    loading,
    setSearchPositions,
    searchCurrentPositions,
  } = props;

  const theme = useTheme();
  const [open, setOpen] = useState(isMobile ? false : true);
  const [drawer, setDrawer] = useState(
    isMobile ? drawerMinWidth : drawerMaxWidth
  );
  const [showPostionForm, setShowPositionForm] = useState(false);

  useEffect(
    () => {
      if (selectedUnit && selectedUnit.unitId) {
        getPositions(selectedUnit.unitId);
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
      setSearchPositions(term, positions, searchCurrentPositions);
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
                Positions
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
                to="/structure/positions"
                className={`px-1 rounded`}
              >
                <span className="text-truncate  menu-item">Unit</span>
              </Link>
              <span className="material-icons text-light">chevron_right</span>
              <div
                style={{ textDecoration: "none", color: "#fff" }}
                to="/structure/positions"
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
              {positions.map((position, index) => (
                <PositionCard position={position} key={index} />
              ))}

              {!positions.length && !loading && (
                <div className="jumbotron jumbotron-fluid text-center mt-5">
                  <div className="container">
                    <p className="lead">No position found</p>
                  </div>
                </div>
              )}

              {selectedUnit && loading && !positions.length && (
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

            {showPostionForm && (
              <AddPostionDialog
                showPostionForm={showPostionForm}
                setShowPositionForm={setShowPositionForm}
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
                    setShowPositionForm(true);
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
  positions,
  loading,
  searchCurrentPositions,
}) => {
  return { selectedUnit, positions, loading, searchCurrentPositions };
};

export default connect(mapStateToProps, { getPositions, setSearchPositions })(
  Positions
);
