import { CHANGE_VISIBILITY } from "../types/menu";

export const changeVisibility = (visibility) => {
  return {
    type: CHANGE_VISIBILITY,
    payload: visibility,
  };
};
