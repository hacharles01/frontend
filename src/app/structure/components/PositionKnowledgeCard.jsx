import {
  ListItem,
  Divider,
  ListItemText,
  IconButton,
  Menu,
  Badge,
  MenuItem,
} from "@mui/material";
import React, { useState } from "react";

import { connect } from "react-redux";
import { deletePositionKnowledge } from "../../../store/structure/actions";
import ConfirmationDialog from "../../rbm/components/ConfirmationDialog";

const PositionKnowledgeCard = (props) => {
  const { positionKnowledge, deletePositionKnowledge } = props;
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const [selectedPositionKnowledge, setSelectedPositionKnowledge] = useState(null);
  const [confirmRemovePositionKnowledge, setConfirmRemovePositionKnowledge] = useState(false);
  

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
              {positionKnowledge.knowledgeName}
            </span>
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
                setSelectedPositionKnowledge(positionKnowledge);
                setConfirmRemovePositionKnowledge(true);
              }}
              className="text-danger font-weight-light"
            >
              Delete
            </MenuItem>
          </span>
        </Menu>
       
      </ListItem>

      {confirmRemovePositionKnowledge && (
            <ConfirmationDialog
              confirmationDialog={confirmRemovePositionKnowledge}
              message={`Are you sure you want to remove this Knowledge @${selectedPositionKnowledge.knowledgeName}?`}
              setConfirmationDialog={setConfirmRemovePositionKnowledge}
              onYes={() => {
                deletePositionKnowledge(
                  selectedPositionKnowledge,
                  setConfirmRemovePositionKnowledge,
                  setSelectedPositionKnowledge
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
  deletePositionKnowledge,
})(PositionKnowledgeCard);
