import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logOut } from "../../features/users/loginSlice";
import { userProfileAPI } from "../../features/users/getProfileSlice"; // Adjust API call accordingly
import { useEffect, useState } from "react";

function Navbar() {
  const isLoggedIn = JSON.parse(localStorage.getItem("isLoggedIn")) || false; // Parse localStorage as boolean
  const { user } = useSelector((state) => state.getProfile); // Assuming user data is stored in Redux state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    dispatch(userProfileAPI());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logOut());
    setIsDropdownOpen(false);
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  // Function to close the navbar
  const closeNavbar = () => {
    setIsDropdownOpen(false);
    const navbarToggler = document.querySelector(".navbar-toggler");
    const navbarCollapse = document.querySelector(".navbar-collapse");
    if (navbarCollapse.classList.contains("show")) {
      navbarToggler.click(); // Simulate toggler button click to close
    }
  };

  useEffect(() => {
    // Close the navbar when clicking outside
    const handleOutsideClick = (event) => {
      const navbarCollapse = document.querySelector(".navbar-collapse");
      if (
        navbarCollapse &&
        navbarCollapse.classList.contains("show") &&
        !navbarCollapse.contains(event.target)
      ) {
        closeNavbar();
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  return (
    <nav className="navbar navbar-expand-lg fixed-top">
      <div className="container-fluid" id="nav-container">
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/" onClick={closeNavbar}>
                Home
              </Link>
            </li>
            {!isLoggedIn ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/signup" onClick={closeNavbar}>
                    Signup
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/login" onClick={closeNavbar}>
                    Login
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/dashboard"
                    onClick={closeNavbar}
                  >
                    Dashboard
                  </Link>
                </li>

                <li className="nav-item dropdown">
                  <Link
                    className="nav-link dropdown-toggle"
                    href="#"
                    id="navbarDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    onClick={toggleDropdown}
                  >
                    Profile
                  </Link>
                  <ul
                    className={`dropdown-menu ${isDropdownOpen ? "show" : ""}`}
                    aria-labelledby="navbarDropdown"
                    data-bs-popper="static"
                  >
                    <li>
                      <Link
                        className="dropdown-item"
                        to="/profile"
                        onClick={closeNavbar}
                      >
                        Account
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="dropdown-item"
                        to="/change-password"
                        onClick={closeNavbar}
                      >
                        Change Password
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="dropdown-item"
                        onClick={() => {
                          handleLogout();
                          closeNavbar();
                        }}
                      >
                        Logout
                      </Link>
                    </li>
                  </ul>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/profile"
                    onClick={closeNavbar}
                  >
                    <img
                      src={user.data?.photo} // Placeholder if no photo
                      alt="Profile"
                      className="nav-photo"
                    />
                  </Link>
                </li>
              </>
            )}
            ;
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
