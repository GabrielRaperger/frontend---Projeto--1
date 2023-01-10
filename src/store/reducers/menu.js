import { CHANGE_VISIBILITY } from "../types/menu";

const INIT_STATE = { visible: false };

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case CHANGE_VISIBILITY:
      if (action.payload === undefined)
        return { ...state, visible: !state.visible };
      else return { ...state, visible: action.payload };
    default:
      return state;
  }
};
