import "./SignUp.css";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signupAPI, clearError } from "../../features/users/signupSlice";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const dispatch = useDispatch();
  const { isSignedUp, loading, error } = useSelector((state) => state.signup);
  const navigate = useNavigate();

  // State to hold input values
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    if (!formData.name.trim()) newErrors.name = "Name is required";

    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is not valid";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";

    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Confirm Password is required";
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const { confirmPassword, ...userData } = formData; // Exclude confirmPassword
      dispatch(signupAPI(userData));
    }
  };

  // Effect to clear error message and navigate on success
  useEffect(() => {
    if (error) {
      const timeout = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timeout); // Cleanup timeout
    }

    if (isSignedUp) {
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      navigate("/verify-otp");
    }
  }, [error, isSignedUp, navigate, dispatch]);
  return (
    <>
      <div className="signup-container">
        <div className="col-sm-4 offset-4">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter Full Name"
              ></input>
              {errors.name && (
                <p
                  style={{
                    color: "red",
                    fontSize: "0.8em",
                    marginTop: "10px",
                  }}
                >
                  {errors.name}
                </p>
              )}
            </div>
            <br />
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={formData.email}
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
                value={formData.password}
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
            <br />
            <div className="form-group">
              <label htmlFor="confirmpassword">Password</label>
              <input
                type="password"
                className="form-control"
                id="confirmpassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
              ></input>
              {errors.confirmPassword && (
                <p
                  style={{
                    color: "red",
                    fontSize: "0.8em",
                    marginTop: "10px",
                  }}
                >
                  {errors.confirmPassword}
                </p>
              )}
            </div>
            <br />

            <br />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Sign up"}
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

export default SignUp;
