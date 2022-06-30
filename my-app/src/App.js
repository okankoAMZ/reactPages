import logo from './logo.svg';
import './App.css';
import Receiver from './reciever';
import Grapher from './grapher';
import React from 'react';
import { TemporaryCredentials } from 'aws-sdk';
class App extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      Receiver : new Receiver("Testing"),
      data : [],
    }
  }
  render(){
  
  return (
    <div className="App">
      <button onClick={() => {
        this.state.Receiver.update().then(()=>{
          console.log(this.state.Receiver.CWAData, typeof(this.state.Receiver.CWAData))
          // var temp = {}
          // this.state.Receiver.CWAData.forEach((element)=>{
          //   // var metrics = Object.keys(element)
          //   // metrics.forEach((metricName)=>{
          //   //   if(metricName == "Hash" || metricName == "Year" || metricName =="CommitDate"){
          //   //     return
          //   //   }
          //   //   metricValues = element[metricName].M
          //   //   temp[metricName] =  []
          //   //   temp[metricName].push()
              
          //   // })
          //   console.log(element)
          //   return
          // })
          this.setState({data:this.state.Receiver.CWAData})
        
        })
        }}> Fetch </button>
      <button onClick={() => {
        this.state.Receiver.cacheClear()
        }}> Clear </button>
      <p>{this.state.data.length}</p>
      
      {/* <Grapher data={this.state.data} metrics={["procstat_cpu_usage"]}/> */}
      

    </div>
  );
  }
}

export default App;
