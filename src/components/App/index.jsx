import React from "react";
import NavigationBar from "../NavigationBar";
import Home from "../../routes/Home";
import Login from "../../routes/Login";
import SignUp from "../../routes/SignUp";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <NavigationBar />
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={SignUp} />
        {/* <Route component={NoMatch} /> */}
      </Switch>
    </Router>
  );
}

export default App;
