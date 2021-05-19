import React from "react";
import logo from "../assets/logo.svg";
import { LinkContainer } from "react-router-bootstrap";
import styled from "styled-components";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { StyledButton } from "./Button";

const StyledNavbar = styled(Navbar)`
  background-color: #5b5656;
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
  line-height: 2rem;
  position: sticky;
`;

const StyledNavbarBrand = styled(Navbar.Brand)`
  font-family: Josefin Sans;
  font-size: 2rem;
`;

function NavigationBar() {
  return (
    <StyledNavbar fixed="top" expand="md" variant="dark">
      <StyledNavbar.Toggle
        className="border-0 p-0"
        aria-controls="basic-navbar-nav"
      />
      <StyledNavbarBrand href="#home">
        <img
          alt="logo"
          src={logo}
          width="30"
          height="30"
          className="d-inline-block align-top ml-2"
        />{" "}
        receipt hero
      </StyledNavbarBrand>
      <StyledNavbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <LinkContainer to="/">
            <Nav.Link href="#">Home</Nav.Link>
          </LinkContainer>
        </Nav>
      </StyledNavbar.Collapse>

      {/* Buttons */}
      <StyledButton variant="outline-light" className="ml-auto mr-2">
        Log in
      </StyledButton>
      <StyledButton $primary>Sign up</StyledButton>
    </StyledNavbar>
  );
}

export default NavigationBar;
