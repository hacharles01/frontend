import { Box, Button, Menu, MenuItem } from "@mui/material";
import React from "react";
import { connect } from "react-redux";
import { selectFiscalYear } from "../../../store/rbm/actions";
import { useHistory } from "react-router-dom";

const FirscalYearSwitcher = (props) => {
  const { fiscalYears, selectedFiscalYear, selectFiscalYear } = props;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const history = useHistory();

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <Box className="mr-2">
        <Button
          variant="text"
          disableElevation
          onClick={handleOpenMenu}
          sx={{ textTransform: "capitalize" }}
          endIcon={
            <span className="material-icons text-light">
              keyboard_arrow_down
            </span>
          }
        >
          <span
            className={`text-dark mr-1 `}
            style={{
              fontFamily:
                '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"',
              fontSize: "1rem",
              fontWeight: "400",
              lineHeight: "1.5",
            }}
          >
            <span className="text-light ">{selectedFiscalYear.name} </span>
          </span>
          {selectedFiscalYear.active && (
            <span className=" font-weight-bold" style={{ color: "#00fc39" }}>
              (Active)
            </span>
          )}

          {!selectedFiscalYear.active && (
            <span className="font-weight-bold" style={{ color: "#ffff00" }}>
              (Closed)
            </span>
          )}
        </Button>

        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleCloseMenu}
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
          {fiscalYears.map((fiscalYear, index) => (
            <MenuItem
              key={fiscalYear.id}
              onClick={() => {
                selectFiscalYear(fiscalYear, history);
                handleCloseMenu();
              }}
            >
              <span
                className={`${
                  fiscalYear.active ? "font-weight-bold " : "font-weight-light"
                }`}
              >
                {fiscalYear.name}
                {fiscalYear.active && (
                  <span style={{ color: "green" }}>(Active)</span>
                )}

                {!fiscalYear.active && <span>(Closed)</span>}
              </span>
            </MenuItem>
          ))}
        </Menu>
      </Box>
    </>
  );
};

const mapStateToProps = ({ fiscalYears, selectedFiscalYear }) => {
  return { fiscalYears, selectedFiscalYear };
};
export default connect(mapStateToProps, { selectFiscalYear })(
  FirscalYearSwitcher
);
