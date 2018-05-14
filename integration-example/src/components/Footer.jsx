import React from 'react';

const Footer = () => (
  <React.Fragment>
    <footer className="page-footer text-center mt-5 pt-5">
      <div className="container text-soft">
        <a href="https://www.extendi.it" className="text-soft">
          <img
            src="https://avatars.io/twitter/extendi"
            width="20"
            alt="twitter logo"
            height="20"
            className="rounded-circle mr-2"
            style={{ position: 'relative', top: '-2px' }}
          />Created by Extendi
        </a>
        <span className="mx-2">&middot;</span>
        <a href="https://extendi.github.io/react-gate/docs">Docs</a>
        <span className="mx-2">&middot;</span>
        <a href="https://github.com/extendi/react-gate">GitHub</a>
      </div>
    </footer>
  </React.Fragment>
);

export default Footer;
