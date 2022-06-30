
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip,Legend, ErrorBar} from 'recharts';

export function Graph (props){
    // console.log(props.data)
        return(
            <LineChart width={1000} height={500} data={props.data}>
                { ()=>{
                    return(
                        props.data.forEach(data=>{
                            if(data.includes(props.dataKey)){
                                return(
                                    <Line type="monotone" dataKey={data} stroke="#8884d8" />
                                )
                            }
                        })
                    )
                }}
                <Tooltip/>
                <Legend/>
                <ErrorBar dataKey = "std" direction="y"/>
                <CartesianGrid stroke="#ccc" strokeDasharray = "10 10" />
                <XAxis dataKey="Hash"/>
                <YAxis />
            </LineChart>
        );
}
export default function Grapher(props){
    console.log(props.metrics[0],props.data)
    props.data.forEach((data)=>{console.log("TEST", data[props.metrics[0]])})
    return(
        <div id="graphArea">
            <Graph data={props.data} dataKey={props.metrics[0]}/>
            {/* {
                ()=>{
                    return(
                        props.metrics.forEach(element => {
                            return(
                                <Graph data={props.data} dataKey={Object.keys(element)}/>
                            )
                        })
                    );
                }
            } */}
        </div>
    )
}

