import React, { useContext } from "react";
import NavigationBar from "./NavigationBar";
import Auth from "../routes/Auth";
import Home from "../routes/Home";
import User from "../routes/User";
import NoMatch from "../routes/NoMatch";
import ForgotPassword from "../routes/ForgotPassword";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { GlobalStyles } from "../styles/GlobalStyles";
import { lightTheme, darkTheme } from "../styles/Themes";
import { useDarkMode } from "../styles/useDarkMode";
import { Wrapper } from "./Container";
import { UserContext } from "../UserContext";
import { ConfigProvider } from "react-avatar";

function App() {
  const [theme, themeToggler, mountedComponent] = useDarkMode();
  const themeMode = theme === "light" ? lightTheme : darkTheme;

  const { userObject } = useContext(UserContext);

  if (!mountedComponent) return <div />;
  return (
    <ConfigProvider avatarRedirectUrl="https://avatar-redirect.appspot.com">
      <ThemeProvider theme={themeMode}>
        <GlobalStyles />
        <Router>
          <NavigationBar theme={theme} toggleTheme={themeToggler} />
          <Wrapper>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/login">
                {userObject ? <Redirect to="/" /> : <Auth isSignUp={false} />}
              </Route>
              <Route path="/signup">
                {userObject ? <Redirect to="/" /> : <Auth isSignUp={true} />}
              </Route>
              <Route path="/user/:id" component={User} />
              <Route path="/calculation/edit/:id" component={Home} />
              <Route path="/calculation/:id" component={Home} />
              <Route path="/forgot">
                {userObject ? (
                  <Redirect to="/" />
                ) : (
                  <ForgotPassword isResetPassword={false} />
                )}
              </Route>
              <Route path="/forgot/done">
                {userObject ? (
                  <Redirect to="/" />
                ) : (
                  <ForgotPassword isResetPassword={false} />
                )}
              </Route>
              <Route path="/reset/:token">
                {userObject ? (
                  <Redirect to="/" />
                ) : (
                  <ForgotPassword isResetPassword={true} />
                )}
              </Route>
              <Route path="/reset/:token/done">
                {userObject ? (
                  <Redirect to="/" />
                ) : (
                  <ForgotPassword isResetPassword={true} />
                )}
              </Route>
              <Route component={NoMatch} />
            </Switch>
          </Wrapper>
        </Router>
      </ThemeProvider>
    </ConfigProvider>
  );
}

export default App;
