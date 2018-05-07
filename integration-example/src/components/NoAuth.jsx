/* eslint-disable */

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

const mapStateToProps = state => ({
  currentRole: state.user.role,
  authRoles: state.authProvider.roles,
});

const NoAuthComponent = ({ currentRole, authRoles }) => (
  <React.Fragment>
    <div className="container mt-5 text-center" style={{maxWidth: '500px'}}>
      <div className="alert alert-danger p-5">
        <h2>You are not authorized to access this route.</h2>
        { currentRole && <p className="mt-3 mb-0">Your role is {currentRole} </p> }
      </div>
      <Link to="/home" className="btn btn-outline-secondary btn-lg mt-4">
        Return to home
      </Link>
    </div>
  </React.Fragment>
);

NoAuthComponent.propTypes = {
  currentRole: PropTypes.string,
  authRoles: PropTypes.arrayOf(PropTypes.string),
};

NoAuthComponent.defaultProps = {
  currentRole: undefined,
  authRoles: [],
};

export default connect(mapStateToProps)(NoAuthComponent);

