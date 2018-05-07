/* eslint-disable */
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
    <div className="container mt-sm-5 px-5 pt-5 text-center">
      <img src="/reactgate_logo_h.svg" className="img-fluid" />
      <p className="text-softest h3 font-weight-normal mt-4">Authentication for React applications</p>
    </div>
    
    
  
    <div className="container p-md-5" style={{maxWidth: '500px'}}>
      <div className="card border-3 bg-soft border-soft mt-5" style={{borderWidth: '3px'}}>
        <div className="card-body p-md-5">
          <h4 className="h5 mb-3 text-soft">Demo Settings</h4>
          <div className="form-inline justify-content-between">
              <span>Make me admin:</span>
              <input type="checkbox" id="id-name--1" className={`switch-input ${currentRole === 'admin' ? 'active':''}`}/><label for="id-name--1" className="switch-label my-2" onClick={() => roleChanger(currentRole === 'admin' ? 'basic':'admin')}></label>
          </div>
          <div className="form-inline justify-content-between mt-3">
              <span>Give me permissions:</span>
              <input type="checkbox" id="id-name--2" className={`switch-input`} /><label for="id-name--2" className="switch-label my-2"  onClick={() => addPermissions()}></label>
          </div>
          <div className="form-inline justify-content-between mt-3">
              <span>Redirect to 404:</span>
              <input type="checkbox" id="id-name--3" className={`switch-input`} /><label for="id-name--3" className="switch-label my-2" onClick={() => add404()} ></label>
          </div>
        </div>

      </div>
    </div>
      

    <div className="container text-center my-5" style={{maxWidth: '800px'}}>
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
  addPermissions: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
