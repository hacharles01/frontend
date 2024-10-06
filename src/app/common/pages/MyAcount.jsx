import { InputAdornment, TextField } from "@mui/material";
import React, { useState } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";

import { changePassword } from "../../../store/common/actions";

const MyAcount = (props) => {
  const { user, loading, changePassword } = props;

  const history = useHistory();

  const isPasswordStrong = (password) => {
    if (
      password &&
      password.length > 7 &&
      // eslint-disable-next-line no-useless-escape
      /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password) &&
      /\d/.test(password) &&
      /[a-z]/.test(password) &&
      /[A-Z]/.test(password)
    )
      return true;
    return false;
  };

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [error, setError] = useState("");
  const [confirmError, setConfirmError] = useState("");

  const checkPassworMatch = (password) => {
    if (!!password && formData.newPassword !== password)
      setConfirmError(`Password confirmation failed`);
    else setConfirmError("");
  };

  const checkStrongPassword = (password) => {
    if (!!password && !isPasswordStrong(password)) setError(`Weak password`);
    else setError("");
  };

  const onSave = () => {
    changePassword(formData, history);
  };

  return (
    <div className="row mt-3 justify-content-center px-4">
      <div className="col-12 col-md-6 text-center">
        Change account password
        <div
          className="rounded mt-2 p-4"
          style={{ backgroundColor: "#f6f8fa" }}
        >
          <TextField
            fullWidth
            size="small"
            name="email"
            autoFocus
            label="Email"
            variant="outlined"
            placeholder="Email"
            className="mb-3 "
            style={{ backgroundColor: "#eee" }}
            disabled
            value={user.email}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <span className="material-icons">alternate_email</span>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            size="small"
            name="oldPassword"
            type="password"
            autoFocus
            label="Old Password"
            variant="outlined"
            placeholder="Old Password"
            className="mb-3"
            value={formData.oldPassword}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <span className="material-icons">lock</span>
                </InputAdornment>
              ),
            }}
            onChange={(e) => {
              const oldPassword = e.target.value;
              setFormData({ ...formData, oldPassword });
            }}
          />
          <TextField
            error={!!error}
            helperText={error}
            fullWidth
            size="small"
            name="newPassword"
            autoFocus
            type="password"
            label="New Password"
            variant="outlined"
            placeholder="New Password"
            className="mb-3"
            value={formData.newPassword}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <span className="material-icons">password</span>
                </InputAdornment>
              ),
            }}
            onChange={(e) => {
              const newPassword = e.target.value;
              checkStrongPassword(newPassword);
              setFormData({ ...formData, newPassword, confirmNewPassword: "" });
              setConfirmError("");
            }}
          />
          <TextField
            error={!!confirmError}
            helperText={confirmError}
            fullWidth
            size="small"
            type="password"
            name="confirmNewPassword"
            autoFocus
            label="Confirm New Password"
            variant="outlined"
            placeholder="Confirm New Password"
            className="mb-3"
            value={formData.confirmNewPassword}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <span className="material-icons">password</span>
                </InputAdornment>
              ),
            }}
            onChange={(e) => {
              const confirmNewPassword = e.target.value;
              checkPassworMatch(confirmNewPassword);
              setFormData({ ...formData, confirmNewPassword });
            }}
          />
          <div className="alert alert-danger">
            Password must contain at least 8 characters with Capital letter,
            Small letter, (1/more) Digit(s) and (1/more) special character(s).
          </div>
        </div>
        <div className="d-flex justify-content-center py-4">
          <button
            onClick={onSave}
            type="button"
            className="btn btn-primary text-uppercase  px-4"
            disabled={
              loading || error || confirmError || !!!formData.confirmNewPassword
            }
          >
            {loading ? "Wait..." : "Change password"}
          </button>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({ user, loading }) => {
  return { user, loading };
};
export default connect(mapStateToProps, { changePassword })(MyAcount);
