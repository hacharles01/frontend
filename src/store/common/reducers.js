import types from "./action-types";
import { defaultState } from "./state";

const loading = (loadingState = defaultState.loading, action) => {
  switch (action.type) {
    case types.START_LOADING:
      return true;

    case types.END_LOADING:
      return false;

    case types.CLEAN_STATE:
      return defaultState.loading;

    default:
      return loadingState;
  }
};

const strongPassword = (
  strongPasswordState = defaultState.strongPassword,
  action
) => {
  switch (action.type) {
    case types.SET_STRONG_PASSWORD:
      return action.data;

    case types.CLEAN_STATE:
      return defaultState.strongPassword;

    default:
      return strongPasswordState;
  }
};

const user = (userState = defaultState.user, action) => {
  switch (action.type) {
    case types.SET_USER:
      return action.data;

    case types.LOGOUT:
      return defaultState.user;

    default:
      return userState;
  }
};

export default { loading, strongPassword, user };
