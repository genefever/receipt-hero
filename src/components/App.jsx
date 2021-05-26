import React from "react";
import Container from "react-bootstrap/Container";
import NavigationBar from "./NavigationBar";
import Home from "../routes/Home";
import Login from "../routes/Login";
import SignUp from "../routes/SignUp";
import UserReceipts from "../routes/UserReceipts";
import NoMatch from "../routes/NoMatch";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { GlobalStyles } from "./styles/GlobalStyles";
import { lightTheme, darkTheme } from "./styles/Themes";
import { useDarkMode } from "./styles/useDarkMode";

function App() {
  const [theme, themeToggler, mountedComponent] = useDarkMode();
  const themeMode = theme === "light" ? lightTheme : darkTheme;

  if (!mountedComponent) return <div />;
  return (
    <ThemeProvider theme={themeMode}>
      <>
        <GlobalStyles />
        <Router>
          <NavigationBar theme={theme} toggleTheme={themeToggler} />
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
      </>
    </ThemeProvider>
  );
}

export default App;
