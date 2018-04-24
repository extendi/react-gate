import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const ProtectedComponent = ({ onlyLogin, selectedPermissions, forRole }) => (
  <div>
    <h2>I am the protected component</h2>
    { onlyLogin && <p> Route rendered for all logged users </p>}
    { forRole && <p> Route rendered for user with role {forRole} </p>}
    { selectedPermissions.length > 0 ?
      <div>
          Requested permissions for this route <br />
        { selectedPermissions.map((p, index) => (
          <p key={index} > {p} </p>
          ))}
      </div>
    : <p> No permissions are requested for this route </p> }

    <Link to="/home">
      <button>Return to home</button>
    </Link>
  </div>
);

ProtectedComponent.defaultProps = {
  onlyLogin: false,
  selectedPermissions: [],
  forRole: undefined,
};

ProtectedComponent.propTypes = {
  onlyLogin: PropTypes.bool,
  selectedPermissions: PropTypes.arrayOf(PropTypes.string),
  forRole: PropTypes.string,
};

export default ProtectedComponent;
