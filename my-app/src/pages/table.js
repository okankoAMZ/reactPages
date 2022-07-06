import  Page from "./page"
import Navbar from '../helpers/navbar';
import  TableGroup from '../helpers/BasicTable'
import '../helpers/table.css'
//@TODO Add interface
export default class TablePage extends Page{

    render(){
        return(
            <div class="table_page">
                <Navbar />
                <h2>TablePage</h2>
                {/* @TODO Add Gavins table here */}
                <TableGroup data={this.state.data} />
            </div>

        );
    }
}