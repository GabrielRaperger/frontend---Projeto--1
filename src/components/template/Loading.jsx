import "./Loading.css";
import React from "react";
import loading from "../../assets/loading.gif";

export default function StatCard(props) {
  return (
    <div class="loading">
      <img src={loading} alt="Loading" />
    </div>
  );
}
