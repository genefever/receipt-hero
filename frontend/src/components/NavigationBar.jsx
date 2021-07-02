import React, { useContext, useState } from "react";
import logo from "../assets/logo.svg";
import { Link } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import styled from "styled-components";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import { StyledButton } from "./Button";
import { ThemeContext } from "styled-components";
import { UserContext } from "../UserContext";
import { FaPlus } from "react-icons/fa";
import * as api from "../api";
import {
  createAvatarComponent,
  SrcSource,
  GoogleSource,
  FacebookSource,
} from "react-avatar";

const Avatar = createAvatarComponent({
  sources: [SrcSource, GoogleSource, FacebookSource],
});

const StyledNavbar = styled(Navbar)`
  background-color: ${({ theme }) => theme.navbar};
  padding-top: 0.15rem;
  padding-bottom: 0.15rem;
  line-height: 2rem;
  position: sticky;
`;

const StyledNavbarBrand = styled(Navbar.Brand)`
  font-family: Josefin Sans;
  font-size: 2rem;
`;

function NavigationBar(props) {
  const { userObject } = useContext(UserContext);
  const themeContext = useContext(ThemeContext);

  // Toggle dropdown on hover
  const [showDropdown, setShowDropdown] = useState(false);
  function handleOpen() {
    setShowDropdown(true);
  }
  function handleClose() {
    setShowDropdown(false);
  }

  async function logout() {
    const res = await api.logout();

    if (res.status === 200) {
      window.location.href = "/";
    }
  }

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
            className="d-inline-block align-top ml-3"
          />{" "}
          receipt hero
        </StyledNavbarBrand>
      </LinkContainer>

      <StyledNavbar.Collapse id="basic-navbar-nav">
        {/* Left Navbar */}
        <Nav className="mr-auto">
          {/* Create Button */}
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
          <Nav.Item className="d-flex align-items-center mr-4">
            <button className="as-text" onClick={props.toggleTheme}>
              {themeContext.emoji}
            </button>
          </Nav.Item>

          {/* Auth Buttons */}
          {userObject ? (
            // User is logged in
            <NavDropdown
              title={
                <Avatar
                  googleId={userObject.googleId}
                  facebookId={userObject.facebookId}
                  name={`${userObject.firstName} ${userObject.lastName}`}
                  round={true}
                  size="33"
                  className="mr-1"
                />
              }
              id="navbarScrollingDropdown"
              alignRight
              show={showDropdown}
              onMouseEnter={handleOpen}
              onMouseLeave={handleClose}
              className="mr-3"
            >
              <NavDropdown.Item as={Link} to={"/user/" + userObject._id}>
                My profile
              </NavDropdown.Item>

              <NavDropdown.Item as={Link} to="/user/settings">
                Settings
              </NavDropdown.Item>

              <NavDropdown.Divider />
              <NavDropdown.Item onClick={logout}>Log out</NavDropdown.Item>
            </NavDropdown>
          ) : (
            // User is not logged in
            <>
              <LinkContainer
                to={{
                  pathname: "/login",
                  state: { isSignup: false },
                }}
              >
                <Nav.Link>
                  <StyledButton
                    size="sm"
                    variant="outline-light"
                    className="px-3"
                  >
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
            </>
          )}
        </Nav>
      </StyledNavbar.Collapse>
    </StyledNavbar>
  );
}

export default NavigationBar;
