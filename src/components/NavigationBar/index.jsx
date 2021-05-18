import React from "react";
import logo from "../../logo.svg";
import { LinkContainer } from "react-router-bootstrap";
import Button from "react-bootstrap/Button";
import Nav from "react-bootstrap/Nav";
import { StyledNavbar, StyledNavbarBrand } from "./style";

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
          className="d-inline-block align-top"
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

      <Button>Log in</Button>
      <Button>Sign up</Button>
    </StyledNavbar>
  );
}

export default NavigationBar;
