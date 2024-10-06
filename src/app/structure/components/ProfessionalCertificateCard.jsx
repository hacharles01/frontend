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

import { connect } from "react-redux";
import { deleteProfessionalCertificate } from "../../../store/structure/actions";
import ConfirmationDialog from "../../rbm/components/ConfirmationDialog";

const ProfessionalCertificateCard = (props) => {
  const { professionalCertificate, deleteProfessionalCertificate } = props;
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [confirmRemoveCertificate, setConfirmRemoveCertificate] = useState(false);
  

  return (
    <>
      <Divider />

      <ListItem
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
        <ListItemText
          primary={
            <span>
              {" "}
              &nbsp;&nbsp;<strong className="text-info">Certificate:</strong> &nbsp;
              {professionalCertificate.professionalCertificate}{" "}
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
                      {professionalCertificate.experience} Year(s)
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
                setSelectedCertificate(professionalCertificate);
                setConfirmRemoveCertificate(true);
              }}
              className="text-danger font-weight-light"
            >
              Delete
            </MenuItem>
          </span>
        </Menu>
       
      </ListItem>

      {confirmRemoveCertificate && (
            <ConfirmationDialog
              confirmationDialog={confirmRemoveCertificate}
              message={`Are you sure you want to remove this Certificate @${selectedCertificate.professionalCertificate}?`}
              setConfirmationDialog={setConfirmRemoveCertificate}
              onYes={() => {
                deleteProfessionalCertificate(
                  selectedCertificate,
                  setConfirmRemoveCertificate,
                  setSelectedCertificate
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
  deleteProfessionalCertificate,
})(ProfessionalCertificateCard);
