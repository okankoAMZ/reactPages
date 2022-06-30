
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ErrorBar } from 'recharts';
import "./graph.css"
const IGNORE_ATTRIBUTES = ["Data", "Hash", "Year", "CommitDate", "Period","Std"]
const N_STATS = 4
const MAX_COLOUR = 0xFF
const MIN_COLOUR = 0x11
const COLOUR_DIFF_CONST = Math.floor((MAX_COLOUR-MIN_COLOUR)/N_STATS)
function getRandomColour(seed,idx) {
    // at least 1 FF to make bright colours
    let coloursOptions = [MIN_COLOUR,MIN_COLOUR,MIN_COLOUR]
    coloursOptions[seed] += COLOUR_DIFF_CONST* idx
    var colour = "#"
    for(var i =0; i< 3; i++){
        colour += ((coloursOptions[i]).toString(16).slice(-2))
    }
    // console.log("Colour", colour,seed)

    return colour
}
export function Graph(props) {
    // console.log(props.data)
    var metricLines = []
    var metricStatsNames = Object.keys(props.data[0])
    var mainColour = props.idx % 2
    var i =0
    metricStatsNames.forEach((name) => {

        if (!(IGNORE_ATTRIBUTES.includes(name))) {
                // 
            
            metricLines.push(
                <Line type="monotone" 
                dataKey={name} 
                stroke={getRandomColour(mainColour,i)}
                legendType="circle"
                activeDot={{r:7}}>
                {name.includes("Average") ? <ErrorBar dataKey="Std" direction="y" /> : <></>}
                </Line>
            )
            i++
        }
    })
    // console.log(metricLines)
    return (
        <div class="graph">
            <h2>{props.title}</h2>
            <LineChart width={1000} height={500} data={props.data}>
                {metricLines}
                <Tooltip />
                <Legend verticalAlign="top" />
                
                <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
                <XAxis dataKey="Hash" />
                <YAxis />
            </LineChart>
        </div>
    );
}
export default function Grapher(props) {
    var metrics = Object.keys(props.data)
    var graphs = []
    var j=0;
    metrics.forEach(element => {
        // console.log(element)
        graphs.push(<Graph data={props.data[element]} idx = {j} title={element} />)
        j++;
    })
    return (
        <div id="graphArea" class="grapher">
            {graphs}
        </div>
    )
}

