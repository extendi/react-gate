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
        <h2 ClassName="mb-3">You are not authorized to access this route.</h2>
        { currentRole && <div>Your role is {currentRole} </div> }
        { loggedIn ? <div> You are logged in</div> : <div> You are not logged in.</div>}
        { permissionsActive ? <div> You have all permissions </div> : <div> You don&#39;t have all permissions.</div>}
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

