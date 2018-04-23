import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => (
  <React.Fragment>
    <h1>Home</h1>
    <div>
      <Link to="/auth"><button> Auth route </button></Link>
      <Link to="/roleauth"><button> Role auth route </button></Link>
    </div>
  </React.Fragment>
);

export default Home;
