import React from "react";
import spaceman from "../assets/spaceman.svg";

function NoMatch() {
  return (
    <div className="d-flex flex-column justify-content-center mt-5">
      <h1 className="text-center mt-5">Page not found</h1>
      <img
        className="mx-auto d-block mt-4"
        src={spaceman}
        width="270"
        height="270"
        alt="logo"
      />
    </div>
  );
}

export default NoMatch;
