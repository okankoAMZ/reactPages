import Page from "./page"
import Grapher from "../helpers/grapher"

export default class GraphicsPage extends Page{
    render(){
        console.log("Loading graphs")
        return (
          <div className="GraphicsPage">
            <button onClick={() => {
              this.state.Receiver.cacheClear()
              }}> Clear </button>
            
            <Grapher data={this.state.data}/>
            
      
          </div>
        );
    }
}