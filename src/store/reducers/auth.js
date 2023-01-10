import axios from "axios";
import { SET_USER } from "../types/auth";

const INIT_STATE = { user: null };

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case SET_USER:
      if (action.payload)
        axios.defaults.headers.common[
          "Authorization"
        ] = `bearer ${action.payload.token}`;
      else delete axios.defaults.headers.common["Authorization"];
      return { ...state, user: action.payload };
    default:
      return state;
  }
};
