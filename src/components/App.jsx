import React from "react";
import NavigationBar from "./NavigationBar";
import Home from "../routes/Home";
import Login from "../routes/Login";
import SignUp from "../routes/SignUp";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
    body {
      background-color: #f5f2f0; /* #f5eaea */
      font-family: "Montserrat", sans-serif;
    }

    h1,h2,h3,h4,h5,h6 {
      font-family: "Montserrat";
      font-weight: bold;
    }

`;

function App() {
  return (
    <>
      <GlobalStyle />
      <Router>
        <NavigationBar />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={SignUp} />
          {/* <Route component={NoMatch} /> */}
        </Switch>
      </Router>
    </>
  );
}

export default App;
