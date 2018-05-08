import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

const mapStateToProps = state => ({
  currentRole: state.user.role,
  loggedIn: state.user.id,
  authRoles: state.authProvider.roles,
  permissionsActive: state.user.canRead && state.user.canWrite && state.user.canRead2 && state.user.canWrite2,
});

const NoAuthComponent = ({ currentRole, permissionsActive, loggedIn }) => (
  <React.Fragment>
    <div className="container mt-5 text-center" style={{ maxWidth: '500px' }}>
      <div className="alert alert-danger p-5">
        <h2>You are not authorized to access this route.</h2>
        { currentRole && <p className="mt-3 mb-0">Your role is {currentRole} </p> }
        { loggedIn ? <p> You are logged in</p> : <p> You are not logged in.</p>}
        { permissionsActive ? <p> You have all permissions </p> : <p> You don&#39;t have all permissions.</p>}
      </div>
      <Link to="/home" className="btn btn-outline-secondary btn-lg mt-4">
        Return to home
      </Link>
    </div>
  </React.Fragment>
);

NoAuthComponent.propTypes = {
  currentRole: PropTypes.string,
  loggedIn: PropTypes.number,
  permissionsActive: PropTypes.bool,
};

NoAuthComponent.defaultProps = {
  currentRole: undefined,
  loggedIn: undefined,
  permissionsActive: undefined,
};

export default connect(mapStateToProps)(NoAuthComponent);

