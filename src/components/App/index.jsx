import React from "react";
import Header from "../Header";
import Home from "../../routes/Home";
import Login from "../../routes/Login";
import SignUp from "../../routes/SignUp";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Header />
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={SignUp} />
      </Switch>
    </Router>
  );
}

export default App;
