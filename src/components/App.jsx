import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import NavigationBar from "./NavigationBar";
import Home from "../routes/Home";
import Login from "../routes/Login";
import SignUp from "../routes/SignUp";
import UserReceipts from "../routes/UserReceipts";
import NoMatch from "../routes/NoMatch";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { createGlobalStyle } from "styled-components";

export const DarkModeContext = React.createContext();

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const GlobalStyle = createGlobalStyle`
      html, body, #root, #root>div {
        height: 100%;
      }

      body {
        background-color: ${darkMode ? "#181818" : "#F4F3EF"};
        // font-family: "Montserrat", sans-serif;
      }

      text {
        color:
      }

      h1,h2,h3,h4,h5,h6 {
        font-family: "Montserrat";
        font-weight: 500;
        color: ${darkMode ? "#E4E6EB" : "black"}
      }

      td, th {
        color: ${darkMode ? "#E4E6EB" : "black"}
      }

      .main-container {
        padding: 0 3%;
      }

      .as-text {
        background:none;
        border:none;
        margin:0;
        padding:0;
        cursor: pointer;
      }
  `;

  return (
    <>
      <DarkModeContext.Provider value={[darkMode, setDarkMode]}>
        <GlobalStyle />
        <Router>
          <NavigationBar />
          <Container fluid className="main-container">
            <Switch>
              <Route path="/" exact component={Home} />
              <Route path="/login" component={Login} />
              <Route path="/signup" component={SignUp} />
              <Route path="/u" component={UserReceipts} />
              <Route component={NoMatch} />
            </Switch>
          </Container>
        </Router>
      </DarkModeContext.Provider>
    </>
  );
}

export default App;
