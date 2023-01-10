import "./AccordionHeader.css";
import React from "react";

export default function AccordionHeader(props) {
    return (
        <div className="accordion-header">
            <h1 className="accordion-header-icon">
                <i className={props.icon}></i>
            </h1>
            <div className="accordion-header-title ">
                <h5>{props.title}</h5>
            </div>
        </div>
    )
}