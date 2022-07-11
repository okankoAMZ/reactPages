import  Page from "./page"
import Navbar from '../helpers/navbar';
import  TableGroup from '../helpers/BasicTable'
import '../helpers/table.css'
//This the webpage that contains the metric tables.
export default class TablePage extends Page{

    render(){
        return(
            <div class="table_page">
                <Navbar />
                <h2>TablePage</h2>
                <TableGroup data={this.state.data} config={this.state.config} />
            </div>

        );
    }
}