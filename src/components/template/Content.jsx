import "./Content.css";
import React from "react";

export default (props) => {
  return (
    <React.Fragment>
      <main className="content container-fluid">
        <div className="p-3 content-box">{props.children}</div>
      </main>
    </React.Fragment>
  );
};
