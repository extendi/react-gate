import React from 'react';
import { Link } from 'react-router-dom';

const ProtectedComponent = () => (
  <div>
    <h2>I am the protected component</h2>
    <Link to="/home">
      <button>Return to home</button>
    </Link>
  </div>
);

export default ProtectedComponent;
