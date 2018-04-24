import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { changeRole, givePermissions } from '../actions';
import { RefreshConfig } from '../../../lib/react-gate';
import NotFound from './NotFound';

const mapDispatchToProps = dispatch => ({
  roleChanger: role => dispatch(changeRole(role)),
  add404: () => dispatch(RefreshConfig({ Component404: NotFound })),
  addPermissions: () => dispatch(givePermissions()),
});

const mapStateToProps = state => ({
  currentRole: state.user.role,
});

const Home = ({
  currentRole,
  roleChanger,
  add404,
  addPermissions,
}) => (
  <React.Fragment>
    <h1>React Gate Demo</h1>
    <div>
      <Link to="/auth"><button> Auth route </button></Link>
      <Link to="/roleauth"><button> Role auth route </button></Link>
      <Link to="/permissionsauth"><button> Permissions protected route </button></Link>
      <button onClick={() => roleChanger(currentRole === 'admin' ? 'basic' : 'admin')} >Change role</button>
      <button onClick={() => add404()}>Show 404</button>
      <button onClick={() => addPermissions()}>Give user the permissions</button>
    </div>
  </React.Fragment>
);

Home.propTypes = {
  currentRole: PropTypes.string.isRequired,
  roleChanger: PropTypes.func.isRequired,
  add404: PropTypes.func.isRequired,
  addPermissions: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
