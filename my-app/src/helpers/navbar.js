import {Link} from "react-router-dom"
import React from 'react';
import "./nav.css"
import {FaHome,FaTable,FaChartLine} from "react-icons/fa"
import logo from '../icons/inverselogo.png'
//@TODO Add interface
export default function Navbar(){
    return(
        <div class="navbar">
            <ul>
                <li>
                    <img src={logo} class="logo"/>
                    {/* @ASK: should I make this to a button */}
                </li>
                <li>
                    <Link to="/"><FaHome/>Home</Link>
                </li>
                <li>
                    <Link to="/table"><FaTable/>Table</Link>
                </li>
                <li>
                    <Link to="/graphics"><FaChartLine/>Graph</Link>
                </li>

            </ul>
        </div>
    );
}