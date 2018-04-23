import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundComponent = () => (
  <React.Fragment>
    <div>
      <h2>404 NOT FOUND</h2>
      <Link to="/home">
        <button>Return to home</button>
      </Link>
    </div>
  </React.Fragment>
);

export default NotFoundComponent;
