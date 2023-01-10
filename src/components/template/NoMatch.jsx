import React from "react";
import { useLocation } from "react-router";
import Content from "./Content";

export default function NoMatch() {
  let location = useLocation();
  return (
    <Content>
      <div>
        <h3>
          No match for <code>{location.pathname}</code>
        </h3>
      </div>
    </Content>
  );
}
