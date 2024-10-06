import { Box, Button, Menu, MenuItem } from "@mui/material";
import React from "react";
import { connect } from "react-redux";
import { selectFiscalYear, selectUserEntity } from "../../../store/rbm/actions";
import { useHistory } from "react-router-dom";

const EntitySwitcher = (props) => {
  const {
    userEntities,
    selectedUserEntity,
    selectUserEntity,
    selectedFiscalYear,
  } = props;

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
      {userEntities.length > 1 && (
        <Box className="mr-2">
          <Button
            variant="text"
            disableElevation
            onClick={handleOpenMenu}
            sx={{ textTransform: "capitalize" }}
            endIcon={
              <>
                <span
                  className={`material-icons text-light d-inline d-md-none`}
                >
                  keyboard_arrow_down
                </span>
                <span
                  className={`material-icons text-dark d-none  d-md-inline`}
                >
                  keyboard_arrow_down
                </span>
              </>
            }
          >
            {selectedUserEntity.name && (
              <>
                <span className="text-truncate text-light d-inline d-md-none">
                  {selectedUserEntity.name.toUpperCase()}
                </span>
                <span className="text-truncate text-dark d-none  d-md-inline">
                  {selectedUserEntity.name.toUpperCase()}
                </span>
              </>
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
            {userEntities.map((entity, index) => (
              <MenuItem
                key={entity.id}
                onClick={() => {
                  selectUserEntity(entity, history, selectedFiscalYear);
                  handleCloseMenu();
                }}
              >
                <span className="text-truncate">{entity.name}</span>
              </MenuItem>
            ))}
          </Menu>
        </Box>
      )}

      {userEntities.length === 1 && (
        <Box className="mr-2">
          <Button
            variant="text"
            disabled
            disableElevation
            sx={{ textTransform: "capitalize" }}
          >
            {selectedUserEntity.name && (
              <>
                <span className="text-truncate text-uppercase text-light d-inline d-md-none badge badge-secondary p-2">
                  {selectedUserEntity.name}
                </span>
                <span className="text-truncate  text-uppercase  d-none  d-md-inline badge badge-secondary p-2">
                  {selectedUserEntity.name}
                </span>
              </>
            )}
          </Button>
        </Box>
      )}
    </>
  );
};

const mapStateToProps = ({
  userEntities,
  selectedUserEntity,
  selectedFiscalYear,
}) => {
  return { userEntities, selectedUserEntity, selectedFiscalYear };
};
export default connect(mapStateToProps, { selectUserEntity })(EntitySwitcher);
