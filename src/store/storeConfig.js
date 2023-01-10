import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/auth";
import menuReducer from "./reducers/menu";

function configStore() {
  return configureStore({
    reducer: {
      auth: authReducer,
      menu: menuReducer,
    },
  });
}

export default configStore;
