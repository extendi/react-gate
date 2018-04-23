import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { changeRole } from '../actions';
import { RefreshConfig } from '../../../lib/react-gate';
import NotFound from './NotFound';
console.log(RefreshConfig({ Component404: NotFound }))
const mapDispatchToProps = dispatch => ({
  roleChanger: role => dispatch(changeRole(role)),
  add404: config => dispatch(RefreshConfig(config)),
});

const mapStateToProps = state => ({
  currentRole: state.user.role,
});

const Home = ({ currentRole, roleChanger, add404 }) => (
  <React.Fragment>
    <h1>Home</h1>
    <div>
      <Link to="/auth"><button> Auth route </button></Link>
      <Link to="/roleauth"><button> Role auth route </button></Link>
      <button onClick={() => roleChanger(currentRole === 'admin' ? 'basic' : 'admin')} >Change role</button>
      <button onClick={() => add404({ Component404: NotFound })}>Show 404</button>
    </div>
  </React.Fragment>
);

Home.propTypes = {
  currentRole: PropTypes.string.isRequired,
  roleChanger: PropTypes.func.isRequired,
  add404: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
