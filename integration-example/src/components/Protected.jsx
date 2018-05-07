/* eslint-disable */

import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const ProtectedComponent = ({ onlyLogin, selectedPermissions, forRole }) => (

    
    <div className="container mt-5 text-center" style={{maxWidth: '500px'}}>
      <div className="alert alert-success p-5">
        
          <h2>You are authorized to access this route.</h2>
          { onlyLogin && <p className="mt-3 mb-0"> Route rendered for all logged users </p>}
          { forRole && <p className="mt-3 mb-0"> Your role is {forRole} </p>}
          { selectedPermissions.length > 0 ?
            <p className="mt-3 mb-0" >
                Your permissions are 
              { selectedPermissions.map((p, index) => (
                <code className="badge p-2 bg-white ml-2" key={index} > {p} </code>
                ))}
            </p>
          : <p> No permissions are requested for this route </p> }
  
      </div>
      <Link to="/home" className="btn btn-outline-secondary btn-lg mt-4">
        Return to home
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
