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
    <div>
            You are not authorized to access this route. <br />
      { currentRole && <p>The role for this user: {currentRole} </p> }
      { authRoles.map((role, key) => (
        <p key={key} >Role available: {role} </p>
            ))}
      <Link to="/home">
        <button>Return to home</button>
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

