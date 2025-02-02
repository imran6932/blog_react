import "./Login.css";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  loginAPI,
  generateOTPAPI,
  clearError,
} from "../../features/users/loginSlice";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch();
  const { loading, error, isVerifyError, isLoggedIn } = useSelector(
    (state) => state.login
  );

  const navigate = useNavigate();

  // State to hold input values
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

    // Clear the error when the user starts typing
    if (errors[name]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is not valid";

    if (!formData.password) newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    // console.log("submit btn clicked");
    e.preventDefault();
    if (validate()) {
      dispatch(loginAPI(formData));
    }
  };

  // Set up a timeout to clear the error after 3 seconds
  useEffect(() => {
    if (error) {
      // console.log("isVerifyError", isVerifyError);
      setTimeout(() => {
        dispatch(clearError());
      }, 5000);
    }
    if (isVerifyError) {
      setFormData("");
      dispatch(generateOTPAPI({ email: formData.email }));
      setTimeout(() => {
        navigate("/verify-otp");
      }, 3000);
      // navigate("/verify-otp");
    }
    if (isLoggedIn === true) {
      setFormData("");
      navigate("/dashboard"); // Navigate to another page after submission
    }
  }, [error, isVerifyError, formData.email, isLoggedIn, navigate, dispatch]);

  return (
    <>
      <div className="login-container">
        <div className="col-sm-4 offset-4">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={formData.email || ""}
                onChange={handleChange}
                placeholder="Enter email address"
              ></input>
              {errors.email && (
                <p
                  style={{
                    color: "red",
                    fontSize: "0.8em",
                    marginTop: "10px",
                  }}
                >
                  {errors.email}
                </p>
              )}
            </div>
            <br />
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                value={formData.password || ""}
                onChange={handleChange}
                placeholder="Password"
              ></input>
              {errors.password && (
                <p
                  style={{
                    color: "red",
                    fontSize: "0.8em",
                    marginTop: "10px",
                  }}
                >
                  {errors.password}
                </p>
              )}
            </div>

            <div className="forgot-password">
              <Link to="/reset-password" className=" my-3">
                Forgot Password
              </Link>
            </div>
            <br />

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Login..." : "Login"}
            </button>
          </form>

          {error && (
            <p style={{ color: "red", fontSize: "0.8em", marginTop: "10px" }}>
              Error: {error}
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default Login;
