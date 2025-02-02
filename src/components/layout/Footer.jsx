import "./Footer.css";

function Footer() {
  return (
    <>
      <div id="footer-container">
        <div className="footer-item">
          <span>&copy; 2025 Imran Ansari</span>
        </div>

        <div className="footer-item">
          <a
            className="link-tag contact-span"
            href="mailto:imransxcr53@gmail.com"
          >
            Contact: imransxcr53@gmail.com
          </a>
        </div>
        <div className="footer-item">
          <a
            className="link-tag"
            href="https://linkedin.com/in/imran693"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i id="icons" className="fa-brands fa-linkedin"></i>
          </a>

          <a
            className="link-tag"
            href="https://github.com/imran6932"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i id="icons" className="fa-brands fa-square-github"></i>
          </a>
        </div>
      </div>
    </>
  );
}

export default Footer;
