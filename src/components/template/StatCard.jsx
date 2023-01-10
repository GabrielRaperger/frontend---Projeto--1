import "./StatCard.css";
import React from "react";
import If from "./If";

export default function StatCard(props) {
  return (
    <div className={`stat-card ${props.className}`}>
      <div className="stat-header">
        <span className="stat-title">{props.title}</span>
      </div>
      <div className="stat-body">
        <div className="stat-icon">
          <i className={props.icon}></i>
        </div>
        <div>
          <div className="stat-info">
            <span className="stat-title">{props.text}</span>
            <span className="stat-value">{props.value}</span>
          </div>
        </div>
      </div>
      <If test={props.hasExtra}>
        <div className="stat-footer">
          <div className="stat-footer-info">
            <i className="fa fa-circle-o text-success"></i>
            <span className="stat-title ms-2">{props.positive}</span>
          </div>
          <div className="stat-footer-info">
            <i className="fa fa-circle-o text-danger"></i>
            <span className="stat-title ms-2">{props.negative}</span>
          </div>
        </div>
      </If>
    </div>
  );
}
