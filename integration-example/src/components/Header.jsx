import React from 'react';

const Header = () => (
  <React.Fragment>
    <nav className="navbar navbar-expand-lg navbar-light" style={{ borderBottom: '1px solid #eaecef' }}>
      <a className="" href="/">
        <img src="reactgate_logo.svg" height="24" alt="" />
      </a>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarTogglerDemo02"
        aria-controls="navbarTogglerDemo02"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon" />
      </button>

      <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
        <ul className="navbar-nav ml-auto mt-2 mt-lg-0">
          <li className="nav-item">
            <a className="nav-link" href="https://extendi.github.io/react-gate/docs/" >Docs</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="https://github.com/extendi/react-gate">GitHub</a>
          </li>
        </ul>
      </div>
    </nav>
  </React.Fragment>
);

export default Header;
