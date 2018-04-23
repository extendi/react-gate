import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { changeRole } from '../actions';

const mapDispatchToProps = dispatch => ({
  roleChanger: role => dispatch(changeRole(role)),
});

const mapStateToProps = state => ({
  currentRole: state.user.role,
});

const Home = ({ currentRole, roleChanger }) => (
  <React.Fragment>
    <h1>Home</h1>
    <div>
      <Link to="/auth"><button> Auth route </button></Link>
      <Link to="/roleauth"><button> Role auth route </button></Link>
      <button onClick={() => roleChanger(currentRole === 'admin' ? 'basic' : 'admin')} >Change role</button>
    </div>
  </React.Fragment>
);

Home.propTypes = {
  currentRole: PropTypes.string.isRequired,
  roleChanger: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
