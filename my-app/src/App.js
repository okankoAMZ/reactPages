import './App.css';
import React from 'react';
import {Outlet} from "react-router-dom"

import Navbar from './helpers/navbar';
class App extends React.Component{
  render(){
    return (
      <div>
        <Navbar/>
        <Outlet />
        <p style={{fontSize:"10px",textAlign:'center', bottom:"0px"}}>
        <div>Icons made by <a href="https://www.flaticon.com/authors/srip" title="srip">srip</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div><div>Icons made by <a href="https://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div><div>Icons made by <a href="https://www.flaticon.com/authors/pixel-perfect" title="Pixel perfect">Pixel perfect</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
        </p>
      </div>

  );
  }
}

export default App;
