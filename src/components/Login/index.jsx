import React from "react";
import "./Login.css";

function Login() {
  return (
    <div className="container">
      <div className="row">
        <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
          <div className="card card-signin my-5">
            <div className="card-body">
              <h5 className="card-title text-center">Log In</h5>
              <form className="form-signin">
                <div className="form-label-group">
                  <input
                    type="email"
                    id="inputEmail"
                    className="form-control"
                    placeholder="Email address"
                    required
                    autofocus
                  />
                  <label for="inputEmail">Email address</label>
                </div>

                <div className="form-label-group">
                  <input
                    type="password"
                    id="inputPassword"
                    className="form-control"
                    placeholder="Password"
                    required
                  />
                  <label for="inputPassword">Password</label>
                </div>

                <div className="form-check mb-3">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="flexCheckDefault"
                    value=""
                  />
                  <label className="form-check-label" for="flexCheckDefault">
                    Remember me
                  </label>
                </div>
                <button className="btn btn-primary col-12" type="submit">
                  Log in
                </button>
                <hr className="my-4" />
                <button className="btn btn-google col-12 mb-3" type="submit">
                  <i className="fab fa-google"></i> Log in with Google
                </button>
                <button className="btn btn-facebook col-12" type="submit">
                  <i className="fab fa-facebook-f"></i> Log in with Facebook
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
