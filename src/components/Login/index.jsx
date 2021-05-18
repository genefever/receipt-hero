import React from "react";
import "./Login.css";
import logo from "../../logo.svg";

function Login() {
  return (
    <main className="form-signin">
      <div className="card-body">
        <img
          className="mx-auto d-block mb-3"
          src={logo}
          width="72"
          height="72"
        />
        {/* Social buttons */}
        <button
          className="w-100 btn btn-lg btn-google btn-block mb-3"
          type="submit"
        >
          <i className="fab fa-google"></i> Log in with Google
        </button>
        <button
          className="w-100 btn btn-lg btn-facebook btn-block"
          type="submit"
        >
          <i className="fab fa-facebook-square"></i> Log in with Facebook
        </button>
        <div className="separator  my-3">or</div>
        <div className="card-signin">
          <form>
            {/* Email input */}
            <div className="form-floating mb-3">
              <input
                type="email"
                className="form-control"
                id="floatingInput"
                placeholder="name@example.com"
              />
              <label htmlFor="floatingInput">Email address</label>
            </div>

            {/* Password input */}
            <div className="form-floating">
              <input
                type="password"
                className="form-control"
                id="floatingPassword"
                placeholder="Password"
              />
              <label htmlFor="floatingPassword">Password</label>
            </div>

            {/* Forgot password link */}
            <div className="col mb-3 mt-1">
              <a href="#!">Forgot password?</a>
            </div>

            {/* Log in button */}
            <button className="w-100 btn btn-lg btn-primary" type="submit">
              Log in
            </button>
          </form>
        </div>
        {/* Sign up button */}
        <div className="text-center mt-4">
          <p>
            Don't have an account? <a href="#!">Sign up</a>
          </p>
        </div>
      </div>
    </main>
  );
}

export default Login;
