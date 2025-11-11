import "./Navbar.css";

function Navbar({ language, setLanguage }) {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-logo">
          <img
            src="https://raw.githubusercontent.com/sododaido/my-images-2/refs/heads/main/%E0%B8%94%E0%B8%B5%E0%B9%84%E0%B8%8B%E0%B8%99%E0%B9%8C%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%A2%E0%B8%B1%E0%B8%87%E0%B9%84%E0%B8%A1%E0%B9%88%E0%B9%84%E0%B8%94%E0%B9%89%E0%B8%95%E0%B8%B1%E0%B9%89%E0%B8%87%E0%B8%8A%E0%B8%B7%E0%B9%88%E0%B8%AD-Photoroom.png"
            alt="EasySpace Logo"
            className="logo-img"
          />
          <span className="navbar-title">EasySpace</span>
        </div>

        <div className="language-switcher">
          <button
            className={`lang-btn ${language === "th" ? "active" : ""}`}
            onClick={() => setLanguage("th")}
          >
            TH
          </button>
          <button
            className={`lang-btn ${language === "en" ? "active" : ""}`}
            onClick={() => setLanguage("en")}
          >
            EN
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
