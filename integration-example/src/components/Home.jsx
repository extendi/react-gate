import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { changeRole, togglePermissions, userReset, userLogout } from '../actions';
import { RefreshConfig } from '../../../lib/react-gate';
import NotFound from './NotFound';
/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */

const mapDispatchToProps = dispatch => ({
  roleChanger: role => dispatch(changeRole(role)),
  add404: () => dispatch(RefreshConfig({ Component404: NotFound })),
  remove404: () => dispatch(RefreshConfig({ Component404: undefined })),
  togglePerm: () => dispatch(togglePermissions()),
  logout: () => dispatch(userLogout()),
  resetUser: () => dispatch(userReset()),
});

const mapStateToProps = state => ({
  currentRole: state.user.role,
  logoutStatus: state.user.id,
  active404: state.authProvider.Component404,
  permissionsActive: state.user.canRead && state.user.canWrite && state.user.canRead2 && state.user.canWrite2,
});

const Home = ({
  currentRole,
  roleChanger,
  logout,
  resetUser,
  logoutStatus,
  add404,
  remove404,
  permissionsActive,
  togglePerm,
  active404,
}) => (
  <React.Fragment>
    <div className="container mt-sm-5 px-5 pt-5 text-center">
      <img src="/reactgate_logo_h.svg" className="img-fluid" alt="Logo" />
      <p className="text-softest h3 font-weight-normal mt-4">Authentication for React applications</p>
    </div>

    <div className="container p-md-5" style={{ maxWidth: '500px' }}>
      <div className="card border-3 bg-soft border-soft mt-5" style={{ borderWidth: '3px' }}>
        <div className="card-body p-md-5">
          <h4 className="h5 mb-3 text-soft">Demo Settings</h4>
          <div className="form-inline justify-content-between">
            <span>Make me admin:</span>
            <input
              type="button"
              id="id-name--1"
              className={`switch-input ${currentRole === 'admin' ? 'active' : ''}`}
              onClick={() => roleChanger(currentRole === 'admin' ? 'basic' : 'admin')}
            />
            <label
              htmlFor="id-name--1"
              className="switch-label my-2"
            />
          </div>
          <div className="form-inline justify-content-between mt-3">
            <span>Give me permissions:</span>
            <input
              type="button"
              id="id-name--2"
              className={`switch-input ${permissionsActive ? 'active' : ' '}`}
              onClick={() => togglePerm()}
            />
            <label
              htmlFor="id-name--2"
              className="switch-label my-2"
            />
          </div>
          <div className="form-inline justify-content-between mt-3">
            <span>Redirect to 404:</span>
            <input
              type="button"
              id="id-name--3"
              className={`switch-input ${active404 ? 'active' : ' '}`}
              onClick={() => (active404 ? remove404() : add404())}
            />
            <label
              htmlFor="id-name--3"
              className="switch-label my-2"
            />
          </div>
          <div className="form-inline justify-content-between mt-3">
            <span>Logged in</span>
            <input
              type="button"
              id="id-name--4"
              className={`switch-input ${logoutStatus ? 'active' : ' '}`}
              onClick={() => (logoutStatus ? logout() : resetUser())}
            />
            <label
              htmlFor="id-name--4"
              className="switch-label my-2"
            />
          </div>
        </div>

      </div>
    </div>


    <div className="container text-center my-5" style={{ maxWidth: '800px' }}>
      <div className="row">
        <div className="col-md-4">
          <Link to="/roleauth" className="btn btn-block btn-success btn-lg my-2">Test roles</Link>

          <p className="text-softer mt-3 mx-auto" >Admin only area.</p>
        </div>
        <div className="col-md-4">
          <Link to="/permissionsauth" className="btn btn-block btn-success btn-lg my-2">Test permissions</Link>
          <p className="text-softer mt-3 mx-auto">Admin with permissions area. </p>
        </div>
        <div className="col-md-4">
          <Link to="/auth" className="btn btn-block btn-success btn-lg my-2">Public area</Link>
          <p className="text-softer mt-3 mx-auto">Anyone can access it.</p>
        </div>
      </div>
    </div>


  </React.Fragment>

);

Home.propTypes = {
  currentRole: PropTypes.string.isRequired,
  roleChanger: PropTypes.func.isRequired,
  add404: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  resetUser: PropTypes.func.isRequired,
  remove404: PropTypes.func.isRequired,
  togglePerm: PropTypes.func.isRequired,
  permissionsActive: PropTypes.bool,
  logoutStatus: PropTypes.number.isRequired,
  active404: PropTypes.func,
};

Home.defaultProps = {
  permissionsActive: false,
  active404: undefined,
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
