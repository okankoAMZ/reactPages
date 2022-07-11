import Page from './page'
import Navbar from '../helpers/navbar';
import './settings.css'
const CONFIG = "config"
export default class SettingsPage extends Page{
    render(){
        return(
            <div class="settings_page">
                <Navbar />
                <div class="title">
                    <h2>Settings</h2>
                </div>
                <div class = "setting_box">
                    <h3>General Settings</h3>
                    <br/>
                    <Setting title="Significant Figure" settingKey="sigfig" type="select" range={[2,8,1,'']}/>
                    <Setting title="Text Font Size" settingKey="textFontSize" type="select" range={[8,32,4,'px']}/>
                    <Setting title="Graph Font Size" settingKey="graphFontSize" type="select" range={[8,32,4,'px']}/>
                    <Setting title="Table Font Size" type="select" range={[8,32,4,'px']}/>
                    {/* <Setting title="Show Commit Date" settingKey="showCommitDate" type="checkbox"/> */}
                </div>

            <MetricSettingsBox data={this.state.data}/>
            </div>
        );
    }

}
function loadSetting(settingTag){
    var config =  JSON.parse(localStorage.getItem(CONFIG))
    if (config == null){
        return ""
    }
    return config[settingTag]
}
function saveSetting(settingTag,value){
    var config = JSON.parse(localStorage.getItem(CONFIG))
    if (config ==null){
        config = {}
    }
    config[settingTag] = value
    localStorage.setItem(CONFIG,JSON.stringify(config))
}
export function Setting(props){
    var key  = props.settingKey || props.title 
    var defaultValue = props.defaultValue || loadSetting(key)
    // const [defaultValue,setDefaultValue] = useState(prevValue)
    var inputType = <input type="text"/>
    switch(props.type){
        case "select":{
            if(props.range == undefined) {throw "Select requires a range like : [start,end,interval,unit]"}
            var options = []
            for(var i=props.range[0]; i< props.range[1]; i= i + props.range[2]){
                options.push(
                    <option selected={i == defaultValue? "selected": ""} 
                    value={i}>{`${i} ${props.range[3]}`}</option>
                )
            }
            inputType = <select onChange={event => {
                // setDefaultValue(event.target.value)
                console.log(event.target.value,typeof(event.target.value))
                saveSetting(key,event.target.value)
            }}>{options}</select>
            break
        }
        // case "checkbox":{
        //     if(defaultValue){
        //         inputType = <input type="checkbox" onChange={event => {
        //             // setDefaultValue(event.target.value)
        //             console.log(event.target.value,typeof(event.target.value))
        //             saveSetting(key,event.target.value=='on')
        //         }} defaultChecked/>
        //     }else{
        //         inputType = <input type="checkbox" onChange={event => {
        //             // setDefaultValue(event.target.value)
        //             console.log(event.target.value,typeof(event.target.value))
        //             saveSetting(key,event.target.value=='on')
        //         }}/>
        //     }
        //     break
        // }
        default:{
            inputType = <input type={props.type} onChange={event => {
                // setDefaultValue(event.target.value)
                console.log(event.target.value,typeof(event.target.value))
                // saveSetting(key,event.target.value)
                if(props.onSave == undefined){
                    saveSetting(key,event.target.value)
                }else{
                    props.onSave(key,event.target.value)
                }
            }} placeholder={defaultValue}/>
            break;
        }
    }
    return(
        <div class="setting">
            <label class="setting-left">{props.title}</label>
            {inputType}
        </div>
    )
}



function MetricSettingsBox(props){
    var metrics = Object.keys(props.data)
    var metricSpecificSettings = []
    var defaultValue = loadSetting("Thresholds")
    for(var metric of metrics){
        metricSpecificSettings.push(<Setting 
            title= {`${metric} Threshold`} 
            settingKey = {`${metric}`}
            onSave={(key,value)=>{
                defaultValue[key] = value
                saveSetting("Tresholds",defaultValue)
            }}
            defaultValue = {defaultValue[metric]}
            />)
    }
    return(
        <div class="metric_setting_box">
            <h3>Metric Settings</h3>
            <h2><br></br></h2>
            {metricSpecificSettings}
        </div>
    )
}