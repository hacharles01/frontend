import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import React from "react";

import { connect } from "react-redux";

const ConfirmationDialog = (props) => {
  const { message, setConfirmationDialog, loading, confirmationDialog, onYes } =
    props;

  return (
    <>
      <Dialog
        onClose={() => {
          setConfirmationDialog(false);
        }}
        open={confirmationDialog}
      >
        <DialogTitle className="text-dark">
          Confirm
          <IconButton
            aria-label="close"
            onClick={() => {
              setConfirmationDialog(false);
            }}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <span className="material-icons">close</span>
          </IconButton>
        </DialogTitle>
        <DialogContent className="pb-0">{message}</DialogContent>
        <DialogActions className="d-flex justify-content-center py-4">
          <button
            onClick={onYes}
            type="button"
            disabled={loading}
            className="btn btn-primary text-uppercase  mr-3"
          >
            {loading ? "Wait..." : "Confirm"}
          </button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const mapStateToProps = ({ loading }) => {
  return { loading };
};
export default connect(mapStateToProps)(ConfirmationDialog);
