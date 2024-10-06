import {
  Typography,
  ListItem,
  Divider,
  ListItemText,
  IconButton,
  Tooltip,
  Menu,
  Badge,
  MenuItem,
} from "@mui/material";
import React, { useState } from "react";
import AddOrUpdateQualificationDialag from "./AddOrUpdateQualificationDialag";

import { connect } from "react-redux";
import { deleteQualification } from "../../../store/structure/actions";
import ConfirmationDialog from "../../rbm/components/ConfirmationDialog";

const MinimumQualificationCard = (props) => {
  const { qualification, position, deleteQualification } = props;
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const [isEditing, setIsEditing] = useState(false);
  const [showQualificationForm, setShowQualificationForm] = useState(false);
  const [selectedQualification, setSelectedQualification] = useState(null);
  const [confirmRemoveQualification, setConfirmRemoveQualification] = useState(false);
  
  // const edit = () => {
  //   setSelectedQualification(qualification);
  //   setIsEditing(true);
  //   setShowQualificationForm(true);
  //   handleCloseMenu();
  // };

  return (
    <>
      <Divider />

      <ListItem
        secondaryAction={
          <IconButton
            size="small"
            className="ml-2"
            onClick={handleOpenMenu}
            aria-label="settings"
          >
            <Badge color="info">
              <span className="material-icons">more_vert</span>
            </Badge>
          </IconButton>
        }
      >
        <ListItemText
          primary={
            <span>
              {" "}
              &nbsp;&nbsp;<strong className="text-info">Degree:</strong> &nbsp;
              {qualification.degree}{" "}
            </span>
          }
          secondary={
            <React.Fragment>
              <Typography
                sx={{ display: "inline" }}
                component="span"
                variant="body2"
                color="text.primary"
              >
                <span className="d-flex align-items-center flex-wrap m-2">
                  <Tooltip title="Minimum Qualification">
                    <span
                      className={`align-items-center px-1 border-info`}
                      style={{
                        border: "1px solid rgba(0, 0, 0, 0.12)",
                        cursor: "default",
                        fontSize: "13px",
                      }}
                    >
                      <strong className="text-info">
                        Minimum Qualification:
                      </strong>{" "}
                      &nbsp;
                      {qualification.qualification}
                    </span>
                  </Tooltip>

                  <Tooltip title="Working Experience">
                    <span
                      className={`align-items-center px-1 border-success`}
                      style={{
                        border: "1px solid rgba(0, 0, 0, 0.12)",
                        cursor: "default",
                        fontSize: "13px",
                      }}
                    >
                      <strong className="text-success">
                        Working Experience:
                      </strong>{" "}
                      &nbsp;
                      {qualification.experience} Year(s)
                    </span>
                  </Tooltip>
                </span>
              </Typography>
            </React.Fragment>
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
          {/* <span>
            <MenuItem onClick={edit} className="text-dark font-weight-light">
              Edit
            </MenuItem>
            <Divider className="my-1" />
          </span> */}
          <span>
            <MenuItem
              onClick={() => {
                handleCloseMenu();
                setSelectedQualification(qualification);
                setConfirmRemoveQualification(true);
              }}
              className="text-danger font-weight-light"
            >
              Delete
            </MenuItem>
          </span>
        </Menu>
        {isEditing && (
          <AddOrUpdateQualificationDialag
            position={position}
            selectedQualification={selectedQualification}
            setIsEditing={setIsEditing}
            showQualificationForm={showQualificationForm}
            setShowQualificationForm={setShowQualificationForm}
            setSelectedQualification={setSelectedQualification}
            isEditing={isEditing}
          />
        )}
      </ListItem>

      {confirmRemoveQualification && (
            <ConfirmationDialog
              confirmationDialog={confirmRemoveQualification}
              message={`Are you sure you want to remove this qualification @${selectedQualification.qualification}?`}
              setConfirmationDialog={setConfirmRemoveQualification}
              onYes={() => {
                deleteQualification(
                  selectedQualification,
                  setConfirmRemoveQualification,
                  setSelectedQualification
                );
              }}
            />
          )}

    </>
  );
};

const mapStateToProps = ({ loading  }) => {
  return {
    loading
  };
};
export default connect(mapStateToProps, {
  deleteQualification,
})(MinimumQualificationCard);
