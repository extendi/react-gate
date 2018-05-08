/* eslint-disable */

import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundComponent = () => (
  <React.Fragment>
    <div className="container mt-5 text-center" style={{maxWidth: '500px'}}>
      <div className="alert alert-danger p-5">
        <h2>404</h2>
        <p className="mt-3 mb-0">Page not found</p>
      </div>
      <Link to="/home" className="btn btn-outline-secondary btn-lg mt-4">
        Return to home
      </Link>
    </div>
  </React.Fragment>
);

export default NotFoundComponent;
