import React, { useState } from "react";
import {
  Chip,
  ListItem,
  Divider,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Tooltip,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Typography
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import HelpIcon from "@mui/icons-material/Help";
import CheckIcon from "@mui/icons-material/Check";
const ITEM_HEIGHT = 60;

const EmployeeCard = (props) => {
  const { employee, index } = props;

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const checkDisabled = (employee) => {
    if (employee.isShared === true) return true;
    else return false;
  };

  const borderColor = (employee) => {
    let borderColor = "";
    if (employee.status !== "In service" && !employee.isActing) {
      borderColor = "danger";
    }
    if (employee.isShared || employee.isSharing || employee.isActing) {
      borderColor = "success";
    }
    if (
      !employee.position ||
      employee.idNumber.length !== 21 ||
      !employee.csrNumber ||
      !employee.phone ||
      !employee.email
    ) {
      borderColor = "danger";
    }

    return borderColor;
  };

  return (
    <>
      {index > 0 && <Divider variant="inset" component="li" />}

      <ListItem
        alignItems="flex-start"
        className={`text-${borderColor(employee)}`}
        secondaryAction={
          <IconButton
            size="small"
            className="ml-2"
            onClick={handleOpenMenu}
            onMouseMove={handleOpenMenu}
            aria-label="settings"
          >
            <Badge color="info">
              <span className="material-icons">more_vert</span>
            </Badge>
          </IconButton>
        }
      >
        <ListItemAvatar>
          <Avatar
            style={{ border: "1px solid #d1cbcb" }}
            alt={employee.lastName}
            src={`data:image/jpeg;base64,${employee.profileImage}`}
          />
        </ListItemAvatar>
        <ListItemText
          primary={
            <span>
              {employee.lastName + " " + employee.firstName}
              {(!employee.position ||
                employee.idNumber.length !== 21 ||
                !employee.csrNumber ||
                !employee.phone ||
                !employee.email) && (
                <Tooltip
                  style={{
                    color: "red",
                    position: "relative",
                    top: "7px",
                    width: "20px",
                  }}
                  title="Update Employee Details(Like: ID Number, Phone number,email or position.)"
                >
                  <HelpIcon />
                </Tooltip>
              )}
            </span>
          }
          secondary={
              <Typography component={'span'} variant={'body2'}>

              <div className="mr-4">
                <span className="d-flex align-items-center flex-wrap">
                  <Tooltip title="EmpID">
                    <span
                      className={`align-items-center px-1 border-${borderColor(
                        employee
                      )}  text-${borderColor(employee)}`}
                      style={{
                        border: "1px solid rgba(0, 0, 0, 0.12)",
                        cursor: "default",
                        fontSize: "13px",
                      }}
                    >
                      <strong>EmpID:</strong>
                      {employee.employeeId}
                    </span>
                  </Tooltip>

                  <Tooltip title="National ID">
                    <span
                      className={`align-items-center px-1 border-${borderColor(
                        employee
                      )}  text-${borderColor(employee)}`}
                      style={{
                        border: "1px solid rgba(0, 0, 0, 0.12)",
                        cursor: "default",
                        fontSize: "13px",
                      }}
                    >
                      <strong>National ID:</strong>
                      {employee.idNumber}
                    </span>
                  </Tooltip>

                  <Tooltip title="CSR No">
                    <span
                      className={`align-items-center px-1 border-${borderColor(
                        employee
                      )}  text-${borderColor(employee)}`}
                      style={{
                        border: "1px solid rgba(0, 0, 0, 0.12)",
                        cursor: "default",
                        fontSize: "13px",
                      }}
                    >
                      <strong>CSR No:</strong> {employee.csrNumber}
                    </span>
                  </Tooltip>

                  <Tooltip title="Level">
                    <span
                      className={`align-items-center px-1 border-${borderColor(
                        employee
                      )}  text-${borderColor(employee)}`}
                      style={{
                        border: "1px solid rgba(0, 0, 0, 0.12)",
                        cursor: "default",
                        fontSize: "13px",
                      }}
                    >
                      <strong>Level:</strong> {employee.levelId}
                    </span>
                  </Tooltip>

                  <Tooltip title="Status">
                    <span className="ml-2">
                      {employee.isActing && employee.statusId !== 0 ? (
                        <Chip
                          icon={<PersonIcon />}
                          label="Only Acting"
                          color="primary"
                          size="small"
                          variant="outlined"
                        />
                      ) : employee.isActing && employee.statusId === 0 ? (
                        <Chip
                          icon={<PersonIcon />}
                          label={employee.status + " (Acting)"}
                          color="primary"
                          size="small"
                          variant="outlined"
                        />
                      ) : (
                        <Chip
                          icon={<CheckIcon />}
                          label={employee.status}
                          color="primary"
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </span>
                  </Tooltip>
                </span>
              </div>
              </Typography>
          }
        />

        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleCloseMenu}
        
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: "auto",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              maxHeight: ITEM_HEIGHT * 4.5,
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 2,
              },
              "&:before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 15,
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
          <span>
            <MenuItem

              onClick={() => {
                handleCloseMenu();
              }}
              className="text-dark font-weight-light"
            >
              Details{!checkDisabled(employee) && "/Update"}
            </MenuItem>
            <Divider className="my-1" />
          </span>

          {!checkDisabled(employee) && !employee.isActing && (
            <span>
              <MenuItem
                onClick={() => {
                  handleCloseMenu();
                }}
                className="text-dark font-weight-light"
              >
                Transfer
              </MenuItem>
              <Divider className="my-1" />
            </span>
          )}

          {!checkDisabled(employee) && !employee.isActing && (
            <span>
              <MenuItem
                onClick={() => {
                  handleCloseMenu();
                }}
                className="text-dark font-weight-light"
              >
                Termination
              </MenuItem>
              <Divider className="my-1" />
            </span>
          )}

          {!checkDisabled(employee) && !employee.isActing && (
            <span>
              <MenuItem
                onClick={() => {
                  handleCloseMenu();
                }}
                className="text-dark font-weight-light"
              >
                Promotion
              </MenuItem>
              <Divider className="my-1" />
            </span>
          )}

          {!checkDisabled(employee) && (
            <span>
              <MenuItem
                onClick={() => {
                  handleCloseMenu();
                }}
                className="text-dark font-weight-light"
              >
                Payslip
              </MenuItem>
              <Divider className="my-1" />
            </span>
          )}

          {!checkDisabled(employee) && (
            <span>
              <MenuItem
                onClick={() => {
                  handleCloseMenu();
                }}
                className="text-dark font-weight-light"
              >
                Pay History
              </MenuItem>
              <Divider className="my-1" />
            </span>
          )}
          {!checkDisabled(employee) && (
            <span>
              <MenuItem
                onClick={() => {
                  handleCloseMenu();
                }}
                className="text-dark font-weight-light"
              >
                Deduction
              </MenuItem>
              <Divider className="my-1" />
            </span>
          )}

          {!checkDisabled(employee) && (
            <span>
              <MenuItem
                onClick={() => {
                  handleCloseMenu();
                }}
                className="text-dark font-weight-light"
              >
                Allowance
              </MenuItem>
              <Divider className="my-1" />
            </span>
          )}

          {!checkDisabled(employee) && (
            <span>
              <MenuItem
                onClick={() => {
                  handleCloseMenu();
                }}
                className="text-dark font-weight-light"
              >
                Forced Salary
              </MenuItem>
              <Divider className="my-1" />
            </span>
          )}

          {!checkDisabled(employee) && (
            <span>
              <MenuItem
                onClick={() => {
                  handleCloseMenu();
                }}
                className="text-dark font-weight-light"
              >
                Second Account
              </MenuItem>
              <Divider className="my-1" />
            </span>
          )}

          {!checkDisabled(employee) && (
            <span>
              <MenuItem
                onClick={() => {
                  handleCloseMenu();
                }}
                className="text-dark font-weight-light"
              >
                Set as Approval
              </MenuItem>
              <Divider className="my-1" />
            </span>
          )}

          {!checkDisabled(employee) && (
            <span>
              <MenuItem
                onClick={() => {
                  handleCloseMenu();
                }}
                className="text-dark font-weight-light"
              >
                Arrears
              </MenuItem>
              <Divider className="my-1" />
            </span>
          )}

          {!checkDisabled(employee) && (
            <span>
              <MenuItem
                onClick={() => {
                  handleCloseMenu();
                }}
                className="text-dark font-weight-light"
              >
                Employee Changes
              </MenuItem>
              <Divider className="my-1" />
            </span>
          )}

          {!checkDisabled(employee) && !employee.isActing && (
            <span>
              <MenuItem
                onClick={() => {
                  handleCloseMenu();
                }}
                className="text-dark font-weight-light"
              >
                Set Acting
              </MenuItem>
              <Divider className="my-1" />
            </span>
          )}

          {!checkDisabled(employee) && employee.isActing && (
            <span>
              <MenuItem
                onClick={() => {
                  handleCloseMenu();
                }}
                className="text-dark font-weight-light"
              >
                Stop Acting
              </MenuItem>
              <Divider className="my-1" />
            </span>
          )}
        </Menu>
      </ListItem>
    </>
  );
};

export default EmployeeCard;
