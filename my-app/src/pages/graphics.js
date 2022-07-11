import Page from "./page"
import Grapher from "../helpers/grapher"
import Navbar from '../helpers/navbar';
import "../helpers/graph.css"
import {BsFillCircleFill,BsSuitDiamondFill} from "react-icons/bs";
//This webpage displays metrics graphs relative to the hashes
export default class GraphicsPage extends Page {
  render() {
    console.log("Loading graphs")
    return (
      <div className="GraphicsPage">
        <Navbar />
        <div class="header">
          <h2>Graphs</h2>
          <p>
            In here you can see metrics vs commit hashes on a line graph. 
            You can turn off some statistics by clicking on them on the legend.
            If a statistic is off it will be show with a {<BsSuitDiamondFill/>}  
            while if it is on it will be shown with a {<BsFillCircleFill/>} .
          </p>
        </div>
        <Grapher data={this.state.data} config={this.state.config}/>


      </div>
    );
  }
}