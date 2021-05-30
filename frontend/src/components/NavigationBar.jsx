import React, { useContext } from "react";
import logo from "../assets/logo.svg";
import { LinkContainer } from "react-router-bootstrap";
import styled from "styled-components";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { StyledButton } from "./Button";
import { ThemeContext } from "styled-components";
import { FaPlus } from "react-icons/fa";

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
        className="border-0 pb-0"
        aria-controls="basic-navbar-nav"
      />
      {/* Logo */}
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
        {/* Left Navbar */}
        <Nav className="mr-auto">
          <LinkContainer to="/">
            <Nav.Link>
              <StyledButton $primary size="sm">
                <div className="d-flex align-items-center">
                  <FaPlus className="mr-1" /> Create
                </div>
              </StyledButton>
            </Nav.Link>
          </LinkContainer>
        </Nav>

        {/* Right Navbar */}
        <Nav className="mr-2">
          {/* Dark mode toggle */}
          <Nav.Item className="d-flex align-items-center mr-5">
            <button className="as-text" onClick={props.toggleTheme}>
              {themeContext.emoji}
            </button>
          </Nav.Item>

          {/* Auth Buttons */}

          <LinkContainer
            to={{
              pathname: "/login",
              state: { isSignup: false },
            }}
          >
            <Nav.Link>
              <StyledButton size="sm" variant="outline-light" className="px-3">
                Log in
              </StyledButton>
            </Nav.Link>
          </LinkContainer>

          <LinkContainer
            to={{
              pathname: "/signup",
              state: { isSignUp: true },
            }}
          >
            <Nav.Link>
              <StyledButton size="sm" variant="light" className="px-3">
                Sign up
              </StyledButton>
            </Nav.Link>
          </LinkContainer>
        </Nav>
      </StyledNavbar.Collapse>
    </StyledNavbar>
  );
}

export default NavigationBar;
