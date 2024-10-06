import {
  Card,
  IconButton,
  Stack,
  Menu,
  MenuItem,
  Divider,
  Tooltip,
  Chip,
  Badge
} from "@mui/material";
import Shared from "@mui/icons-material/Share";
import PersonIcon from "@mui/icons-material/Person";
import React, { useState } from "react";
import { connect } from "react-redux";

import {deletePosition,setAsPlanner,setAsHeadOfUnity} from "../../../store/structure/actions";
import ConfirmationDialog from "../../rbm/components/ConfirmationDialog";
import ViewPositionEmployees from "../components/ViewPositionEmployees";
import UpdatePositionDialog from "../components/UpdatePositionDialog";
import { showError,showSuccess } from "../../toastify";

const PositionCard = (props) => {
  const { position, deletePosition, setAsPlanner,setAsHeadOfUnity } = props;
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [confirmRemovePosition, setConfirmRemovePosition] = useState(false);
  const [positionToBeRemoved, setPositionToBeRemoved] = useState(null);

  const [showPostionEmployeesModal, setShowPostionEmployeesModal] = useState(false);
  const [showUpdatePositionModal, setShowUpdatePositionModal] = useState(false);

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  const borderColor = (position) => {
    let borderColor = "dark";
    if (position.numberOfVacantPost > 0) {
      borderColor = "danger";
    }
    if (position.isHeadOfInstitution) {
      borderColor = "success";
    }
    if (position.isHeadOfUnit) {
      borderColor = "primary";
    }
    if (position.isHeadOfInstitution && position.isHeadOfUnit) {
      borderColor = "success";
    }
    return borderColor;
  };

  const checkDisabled = (position) => {
    if (position.isShared === false) return true;
    else return false;
  };
  const handleSetPlanner=(position)=>{
    position.isPlanner=!position.isPlanner;
     setAsPlanner(position);
  }

  const handleSetAsHeadOfUnity=(position)=>{
    position.isHeadOfUnit=!position.isHeadOfUnit;
    setAsHeadOfUnity(position);
  }

  
  return (
    <>
      <Card
        className={`mb-3 py-3 indicator-card border border-${borderColor(
          position
        )} `}
        variant="outlined"
        style={{
          backgroundColor: "#fff",
        }}
      >
        <div className="row">
          <div className="col-sm-10 col-xs-10 col-md-10 col-lg-10 justify-content-center">
            <div className="row">
              <div className="col-12 col-md-12 col-lg-12">
                <span
                  style={{ fontSize: "12px", cursor: "default" }}
                  className={`ml-2 font-weight-bold text-${borderColor(
                    position
                  )}`}
                >
                  {position.name}

                  <Stack direction="row" spacing={1} className="mt-2 ml-2">
                    {position.isHeadOfInstitution && (
                      <Chip
                        label="Head Of Institution"
                        color="success"
                        size="small"
                        variant="outlined"
                      />
                    )}
                    {position.isCBM && (
                      <Chip
                        label="CBM"
                        color="primary"
                        size="small"
                        variant="outlined"
                      />
                    )}

                    {position.isHeadOfUnit && (
                      <Chip
                        label="Head Of Unit"
                        color="primary"
                        size="small"
                        variant="outlined"
                      />
                    ) 
                    }

                    {position.isPlanner && (
                      <Chip
                        label="Planner"
                        color="primary"
                        size="small"
                        variant="outlined"
                      />
                    )}

                    {position.isTechnicalHead && (
                      <Chip
                        label="Technical Head"
                        color="primary"
                        size="small"
                        variant="outlined"
                      />
                    )}

                    {position.shared && (
                      <Chip
                        icon={<Shared />}
                        label="Shared"
                        color="success"
                        size="small"
                      />
                    )}

                    {position.sharing && (
                      <Chip
                        icon={<Shared />}
                        label="Sharing"
                        color="primary"
                        size="small"
                      />
                    )}

                    {position.hasActing && (
                      <Chip
                        icon={<PersonIcon />}
                        label="Acting"
                        color="primary"
                        size="small"
                        variant="outlined"
                      />
                    )}

                    {!position.isOnStructure && (
                      <Chip
                        label="Not on structure"
                        color="error"
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </Stack>
                </span>
              </div>
              <div className="col-12 col-md-12 col-lg-12">
                <span className="d-flex align-items-center flex-wrap m-2">
                  <Tooltip title="EmployementGroup">
                    <span
                      className={`align-items-center px-1 border-${borderColor(
                        position
                      )}  text-${borderColor(position)}`}
                      style={{
                        border: "1px solid rgba(0, 0, 0, 0.12)",
                        cursor: "default",
                        fontSize: "13px",
                      }}
                    >
                      <strong>EmployementGroup:</strong>
                      {position.employeeGroupName}
                    </span>
                  </Tooltip>

                  <Tooltip title="Level">
                    <span
                      className={`align-items-center px-1 border-${borderColor(
                        position
                      )}  text-${borderColor(position)}`}
                      style={{
                        border: "1px solid rgba(0, 0, 0, 0.12)",
                        cursor: "default",
                        fontSize: "13px",
                      }}
                    >
                      <strong>Level:</strong>
                      {position.levelName}.{position.echelonName}
                    </span>
                  </Tooltip>

                  <Tooltip title="IV">
                    <span
                      className={`align-items-center px-1 border-${borderColor(
                        position
                      )}  text-${borderColor(position)}`}
                      style={{
                        border: "1px solid rgba(0, 0, 0, 0.12)",
                        cursor: "default",
                        fontSize: "13px",
                      }}
                    >
                      <strong>IV:</strong> {position.indexValueId}
                    </span>
                  </Tooltip>

                  <Tooltip title="#Posts">
                    <span
                      className={`align-items-center px-1 border-${borderColor(
                        position
                      )}  text-${borderColor(position)}`}
                      style={{
                        border: "1px solid rgba(0, 0, 0, 0.12)",
                        cursor: "default",
                        fontSize: "13px",
                      }}
                    >
                      <strong>#Posts:</strong> {position.number}
                    </span>
                  </Tooltip>

                  <Tooltip title="HiringMode">
                    <span
                      className={`align-items-center px-1 border-${borderColor(
                        position
                      )}  text-${borderColor(position)}`}
                      style={{
                        border: "1px solid rgba(0, 0, 0, 0.12)",
                        cursor: "default",
                        fontSize: "13px",
                      }}
                    >
                      <strong>HiringMode:</strong> {position.hiringModeName}
                    </span>
                  </Tooltip>
                </span>
              </div>
            </div>
          </div>
          <div className="col-sm-2 col-xs-2 col-md-2 col-lg-2 justify-content-center  text-right">
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
            <Menu
              anchorEl={anchorEl}
              id="account-menu"
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
                    setShowUpdatePositionModal(true);
                  }}
                  className="text-dark font-weight-light"
                >
                Details{checkDisabled(position) && "/Update"}
                </MenuItem>
                <Divider className="my-1" />
              </span>

              <span>
                <MenuItem
                  onClick={() => {
                    handleCloseMenu();
                    setShowPostionEmployeesModal(true);
                  }}
                  className="text-dark font-weight-light"
                >
                  Employees
                </MenuItem>
                <Divider className="my-1" />
              </span>

              {checkDisabled(position) && (
                <span>
                  <MenuItem
                    onClick={() => {
                      handleCloseMenu();
                      handleSetAsHeadOfUnity(position);
                    }}
                    className="text-dark font-weight-light"
                  >
                    {position.isHeadOfUnit?'Unset':'Set'} as Head Of Unit
                  </MenuItem>
                  <Divider className="my-1" />
                </span>
              )
              }

              {checkDisabled(position) && (
                <span>
                  <MenuItem
                    onClick={() => {
                      handleCloseMenu();
                      handleSetPlanner(position);
                    
                    }}
                    className="text-dark font-weight-light"
                  >
                    {position.isPlanner?'Unset':'Set'} as {position.isPlanner ? "not" : ""} Planner
                  </MenuItem>
                  <Divider className="my-1" />
                </span>
              )
              }

              {checkDisabled(position) && (
                <span>
                  <MenuItem
                    onClick={() => {
                      handleCloseMenu();
                      console.log(position);
                      if (position.hiringModeId !== 1 && position.hiringModeId !== 4)
                      return showError(
                        "Hiring Mode of this position is not Recruitment"
                      );
              
                    if (position.numberOfVacantPost <= 0)
                      return showError("This position has no vacant post");
              
                    if (!position.description)
                      return showError("This position has no description");
              
                    showSuccess("Comming soon!");
                    }}
                    className="text-dark font-weight-light"
                  >
                    Request to Publish
                  </MenuItem>
                  <Divider className="my-1" />
                </span>
              )}

              {checkDisabled(position) && (
                <span>
                  <MenuItem
                    onClick={() => {
                        setPositionToBeRemoved(position);
                        setConfirmRemovePosition(true);
                        handleCloseMenu();
                    }}
                    className="text-danger font-weight-light"
                  >
                    Delete
                  </MenuItem>
                </span>
              )
              }

            </Menu>
          </div>
        </div>

        {confirmRemovePosition && (
              <ConfirmationDialog
                confirmationDialog={confirmRemovePosition}
                message={`Are you sure you want to remove this position @${positionToBeRemoved.name}?`}
                setConfirmationDialog={setConfirmRemovePosition}
                onYes={() => {
                    deletePosition(
                      positionToBeRemoved,
                      setConfirmRemovePosition,
                      setPositionToBeRemoved
                    );
                }}
              />
            )
          }

            {showPostionEmployeesModal && <ViewPositionEmployees 
             showPostionEmployeesModal={showPostionEmployeesModal}
             setShowPostionEmployeesModal={setShowPostionEmployeesModal}
             position={position} />}

            {showUpdatePositionModal && <UpdatePositionDialog 
             showUpdatePositionModal={showUpdatePositionModal}
             setShowUpdatePositionModal={setShowUpdatePositionModal}
             position={position} />}




      </Card>
    </>
  );
};

const mapStateToProps = ({ loading, user }) => {
  return {
    loading,
    user,
  };
};

export default connect(mapStateToProps, {deletePosition,setAsPlanner,setAsHeadOfUnity})(PositionCard);
