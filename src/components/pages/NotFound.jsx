import { Link } from "react-router-dom";
import "./NotFound.css";

function NotFound() {
  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <div className="not-found">
        <h1>404 - Page Not Found</h1>
        <p>Oops! The page you are looking for does not exist.</p>
      </div>
      <Link to="/" style={{ color: "blue", textDecoration: "underline" }}>
        Go back to Home
      </Link>
    </div>
  );
}

export default NotFound;
