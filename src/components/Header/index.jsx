import React from "react";
import "./Header.css";
import logo from "../../logo.svg";

function Header() {
  return (
    <nav className="navbar fixed-top navbar-expand-md navbar-dark">
      <div className="container">
        <button
          className="navbar-toggler p-0 border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarToggle"
          aria-controls="navbarToggle"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <a className="navbar-brand" href="/">
          <img src={logo} width="40" height="40" />
          receipt hero
        </a>
        <div className="collapse navbar-collapse" id="navbarToggle">
          <ul className="navbar-nav me-auto mb-2 mb-sm-0">
            <li className="nav-link">Dashboard</li>
          </ul>
        </div>
        <div className="text-end">
          <button className="btn btn-outline-light me-3">Log in</button>
          <button className="btn btn-primary" type="button">
            Sign up
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Header;
