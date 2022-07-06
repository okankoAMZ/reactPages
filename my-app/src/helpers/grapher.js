
import { Component,useState } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ErrorBar, ReferenceLine} from 'recharts';
import "./graph.css"

const THRESHOLDS = {procstat_cpu_usage:0.47,procstat_memory_rss:70000000}
const IGNORE_ATTRIBUTES = ["Data", "Hash", "Year", "CommitDate", "Period","Std"]
const N_STATS = 4
const MAX_COLOUR = 0xFF
const MIN_COLOUR = 0x11
const COLOUR_DIFF_CONST = Math.floor((MAX_COLOUR-MIN_COLOUR)/N_STATS)
const UNITS = {
    procstat_cpu_usage : "%",
    procstat_memory_rss: "B"
}

//@TODO Add interface
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
//@TODO Add interface
export function Graph(props){
    var metricLines = [] // list of react components
    var metricStatsNames = Object.keys(props.data[0]) // names of stats
    var mainColour = props.idx % 2 // main colour for that metric., red , green ,blue
    var i =0
    var basicVisibility = {}
    metricStatsNames.forEach((name)=>{basicVisibility[name]= true}) //init  stats visibility
    const [visibility,setVisibility] = useState(basicVisibility)
    metricStatsNames.forEach((name) => {
        if (!(IGNORE_ATTRIBUTES.includes(name))) {
            metricLines.push(
                <Line type="monotone" 
                dataKey={name} 
                stroke={getRandomColour(mainColour,i)}
                legendType= {visibility[name] ?"circle": "diamond"}
                style={{"display": visibility[name]?"block" : "none"}}
                activeDot={{r: visibility[name]? 7: 0 }}>
                {name.includes("Average") ? <ErrorBar dataKey="Std" direction="y" 
                style={{"display": visibility[name]?"block" : "none"}} /> : <></>}
                </Line>
            )
            //Draw each stats
            i++
        }
    })
    metricLines.push(<ReferenceLine y={THRESHOLDS[props.title]} 
        label="Threshold" stroke="blue" strokeDasharray="10 10" />) //Add a threshold line
    return (
        <div class="graph">
            <h2>{props.title}</h2>
            <LineChart width={1500} height={600} data={props.data} margin={{top:5,right:30}}>
                {metricLines}
                <Tooltip />
                <Legend verticalAlign="top" onClick={(data)=>{
                    console.log("clicked",data,visibility)
                    var lastVisibility = visibility[data["dataKey"]]
                    setVisibility({...visibility,[data["dataKey"]]:!lastVisibility})
                    console.log(visibility)
                }}/>
                <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
                <XAxis dataKey="Hash" label="Hash" height={100}/>
                <YAxis width={200} label ={UNITS[props.title]}/>
            </LineChart>
        </div>
    );
}
//@TODO Add interface
export default function Grapher(props) {
    var metrics = Object.keys(props.data)
    var graphs = []
    var j=0;
    metrics.forEach(element => {
        graphs.push(<Graph data={props.data[element]} idx = {j} title={element} />) // Add a graph
        j++;
    })
    return (
        <div id="graphArea" class="grapher">
            {graphs}
        </div>
    )
}

