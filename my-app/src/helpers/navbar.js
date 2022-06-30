import {Link} from "react-router-dom"
import React from 'react';
import "./nav.css"
import {TiHomeOutline} from "react-icons/ti"
import {FaTable,FaChartLine} from "react-icons/fa"
export default function Navbar(){
    return(
        <div class="navbar">
            <ul>
                <li>
                    <Link to="home"><TiHomeOutline/>Home</Link>
                </li>
                <li>
                    <Link to="table"><FaTable/>Table</Link>
                </li>
                <li>
                    <Link to="graphics"><FaChartLine/>Graph</Link>
                </li>

            </ul>
        </div>
    );
}