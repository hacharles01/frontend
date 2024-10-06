import types from "./action-types";
import axios from "axios";
import { showSuccess, showError } from "../../app/toastify";

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

export const setUser = (data) => {
  return {
    type: types.SET_USER,
    data,
  };
};

export const login = (credentials, history, modelDismiss) => {
  return async (dispatch) => {
    try {
      if (isPasswordStrong(credentials.password))
        dispatch({ type: types.SET_STRONG_PASSWORD, data: true });
      else dispatch({ type: types.SET_STRONG_PASSWORD, data: false });

      dispatch({ type: types.START_LOADING });

      await axios.post("/api/auth/logins", credentials);

      dispatch({ type: types.END_LOADING });
      modelDismiss.click();

      history.push("/rbm");
    } catch (error) {
      dispatch({ type: types.SET_STRONG_PASSWORD, data: false });

      dispatch({ type: types.END_LOADING });
      showError(error);
    }
  };
};

export const resetPassword = (email) => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.START_LOADING });
      const { data } = await axios.post("/api/auth/reset-password", { email });

      showSuccess(data.message);

      dispatch({ type: types.END_LOADING });
    } catch (error) {
      dispatch({ type: types.END_LOADING });
      showError(error);
    }
  };
};

export const changePassword = (credentials, history) => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.START_LOADING });

      const { data } = await axios.post(
        "/api/auth/change-password",
        credentials
      );

      dispatch({ type: types.END_LOADING });

      dispatch({ type: types.SET_STRONG_PASSWORD, data: true });

      showSuccess(data.message);

      history.push("/");
    } catch (error) {
      dispatch({ type: types.SET_STRONG_PASSWORD, data: false });

      dispatch({ type: types.END_LOADING });
      showError(error);
    }
  };
};

export const register = (user, modelDismiss) => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.START_LOADING });
      const { data } = await axios.post("/api/auth/users", user);

      showSuccess(data.message);

      dispatch({ type: types.END_LOADING });

      modelDismiss.click();
    } catch (error) {
      dispatch({ type: types.END_LOADING });
      showError(error);
    }
  };
};

export const getUser = (history) => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get("/api/auth/users/me");

      dispatch({ type: types.SET_USER, data });
      setUser(data);
    } catch (error) {
      history.push("/");
      showError(error);
    }
  };
};

export const logout = (history) => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.START_LOADING });

      await axios.delete("/api/auth/logins");

      dispatch({ type: types.END_LOADING });

      history.push("/");

      dispatch({ type: types.CLEAN_STATE });
      dispatch({ type: types.LOGOUT });
    } catch (error) {
      dispatch({ type: types.END_LOADING });
      history.push("/");
    }
  };
};
