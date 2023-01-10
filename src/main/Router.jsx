import React from "react";
import { Routes, Route } from "react-router";
import routes from "../config/routes";

export default (props) => {
  return (
    <Routes>
      {routes.map((route, index) => {
        return (
          <Route
            key={index}
            exact={route.exact}
            path={route.path}
            element={route.element}
          />
        );
      })}
    </Routes>
  );
};
