import React from "react";
import ErrorImg from "../../../assets/images/error.png";
import "./not_found.scss";
const NotFound = () => {
  return (
    <div className="center-flex">
      <div className="data-not-found">
        <img alt="error image" src={ErrorImg} />

        <h2>No alerts found</h2>
        <p>No alerts found</p>
      </div>
    </div>
  );
};

export default NotFound;
