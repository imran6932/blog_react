import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, page }) {
  const isLoggedIn = JSON.parse(localStorage.getItem("isLoggedIn")) || false; // Parse localStorage as boolean
  // console.log("isLoggedIn:", isLoggedIn, "Page:", page);

  if (isLoggedIn === null || isLoggedIn === false) {
    // Redirect to login if the user is not logged in
    if (
      page === "Login" ||
      page === "SignUp" ||
      page === "SingleUserPost" ||
      page === "Home"
    ) {
      // console.log("Allow access to Login or SignUp page or Single post");
      return children;
    } else {
      // console.log("isLoggedIn null or false redirect to login");
      return <Navigate to="/login" />;
    }
    // return children;
  }

  if (isLoggedIn === true) {
    // Redirect to dashboard if logged in and accessing Login or SignUp page
    if (page === "Login" || page === "SignUp") {
      // console.log("Redirect to /dashboard");
      return <Navigate to="/dashboard" />;
    }
    // console.log("Allow access to protected page");
    return children; // Allow access to protected route
  }

  // console.log("Default case: Redirect to page");
  return children;
}

export default ProtectedRoute;
