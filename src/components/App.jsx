import React from "react";
import Header from "./Header";
import Login from "./Login";
import SignUp from "./SignUp";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Header />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={SignUp} />
    </Router>
  );
}

export default App;
