import React from "react";
import NavigationBar from "./NavigationBar";
import Auth from "../routes/Auth";
import Home from "../routes/Home";
import UserReceipts from "../routes/UserReceipts";
import NoMatch from "../routes/NoMatch";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { GlobalStyles } from "../styles/GlobalStyles";
import { lightTheme, darkTheme } from "../styles/Themes";
import { useDarkMode } from "../styles/useDarkMode";
import { Wrapper } from "./Container";

function App() {
  const [theme, themeToggler, mountedComponent] = useDarkMode();
  const themeMode = theme === "light" ? lightTheme : darkTheme;

  if (!mountedComponent) return <div />;
  return (
    <ThemeProvider theme={themeMode}>
      <GlobalStyles />
      <Router>
        <NavigationBar theme={theme} toggleTheme={themeToggler} />
        <Wrapper>
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/login">
              <Auth isSignUp={false} />
            </Route>
            <Route path="/signup">
              <Auth isSignUp={true} />
            </Route>
            <Route path="/u" component={UserReceipts} />
            <Route component={NoMatch} />
          </Switch>
        </Wrapper>
      </Router>
    </ThemeProvider>
  );
}

export default App;
