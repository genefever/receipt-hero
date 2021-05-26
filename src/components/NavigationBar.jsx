import React, { useContext } from "react";
import logo from "../assets/logo.svg";
import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { StyledButton } from "./Button";
import { ThemeContext } from "styled-components";

const StyledNavbar = styled(Navbar)`
  background-color: ${({ theme }) => theme.navbar};
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
  line-height: 2rem;
  position: sticky;
`;

const StyledNavbarBrand = styled(Navbar.Brand)`
  font-family: Josefin Sans;
  font-size: 2rem;
`;

function NavigationBar(props) {
  const themeContext = useContext(ThemeContext);

  return (
    <StyledNavbar fixed="top" expand="md" variant="dark">
      <StyledNavbar.Toggle
        className="border-0 p-0"
        aria-controls="basic-navbar-nav"
      />
      <LinkContainer to="/">
        <StyledNavbarBrand>
          <img
            alt="logo"
            src={logo}
            width="30"
            height="30"
            className="d-inline-block align-top ml-2"
          />{" "}
          receipt hero
        </StyledNavbarBrand>
      </LinkContainer>
      <StyledNavbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <LinkContainer to="/">
            <Nav.Link>Home</Nav.Link>
          </LinkContainer>
        </Nav>

        {/* Dark mode toggle */}
        <Nav className="ml-auto mr-5">
          <Nav.Item>
            <button className="as-text" onClick={props.toggleTheme}>
              {themeContext.emoji}
            </button>
          </Nav.Item>
        </Nav>
      </StyledNavbar.Collapse>

      {/* Buttons */}
      <Link to="/login">
        <StyledButton variant="outline-light" className="ml-auto mr-2">
          Log in
        </StyledButton>
      </Link>

      <Link to="/signup">
        <StyledButton $primary>Sign up</StyledButton>
      </Link>
    </StyledNavbar>
  );
}

export default NavigationBar;
