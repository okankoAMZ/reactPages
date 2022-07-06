import React from 'react';
import {Outlet} from "react-router-dom"
import Navbar from './helpers/navbar';
//@TODO remove NO LONGER need it
class App extends React.Component{
  render(){
    return (
      <div>
        <Navbar/>
        <Outlet />
      </div>

  );
  }
}

export default App;
