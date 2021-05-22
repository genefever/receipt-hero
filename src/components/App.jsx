import React from "react";
import Container from "react-bootstrap/Container";
import NavigationBar from "./NavigationBar";
import Home from "../routes/Home";
import Login from "../routes/Login";
import SignUp from "../routes/SignUp";
import NoMatch from "../routes/NoMatch";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
    body, #root, #root>div {
      height: 100%;
    }

    body {
      background-color: #F4F3EF; /*#f5f2f0;/* /* #f5eaea */
      // font-family: "Montserrat", sans-serif;
    }

    h1,h2,h3,h4,h5,h6 {
      font-family: "Montserrat";
      font-weight: 500;
    }

    .main-container {
      padding: 0 3%;
    }
`;

function App() {
  return (
    <>
      <GlobalStyle />
      <Router>
        <NavigationBar />
        <Container fluid className="main-container">
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/login" component={Login} />
            <Route path="/signup" component={SignUp} />
            <Route component={NoMatch} />
          </Switch>
        </Container>
      </Router>
    </>
  );
}

export default App;
