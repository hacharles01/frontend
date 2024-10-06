import { combineReducers } from "redux";

import commonReducers from "./common/reducers";

import rbmReducers from "./rbm/reducers";

import structureReducers from "./structure/reducers";

export default combineReducers({
  //---- COMMON ----//
  ...commonReducers,

  //---- RBM ----//
  ...rbmReducers,

  //----STRUCTURE ----//
  ...structureReducers,
});
