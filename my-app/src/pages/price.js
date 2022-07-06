import Page from "./page"
import Navbar from '../helpers/navbar';
import './price.css'


export default class PriceCalculatorPage extends Page{
    render(){
        return(
            <div class="PricePage">
                <Navbar/>
                <div class="Calculator">
                    <select>
                        <option>EC2</option>
                    </select>
                    <select>
                        <option>T4g</option>
                        <option>T3</option>
                        <option>T3a</option>
                        <option>T2</option>
                        <option>M6g</option>
                        <option>M6i</option>
                        <option>M5</option>
                        <option>M5a</option>
                        <option>Mn</option>
                        <option>M5zn</option>
                        <option>M4</option>
                        <option>A1</option>
                    </select>
                    <select>
                        <option>High</option>
                        <option>Average</option>
                        <option>Low</option>
                    </select>
                    <input type="text"/>
                    <button text="Estimate"/>

                    <label text="1$/hr"/>
                </div>
            </div>
        );
    }
}