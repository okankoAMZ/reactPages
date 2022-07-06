import React from 'react';
import Receiver from "../helpers/reciever"
//@TODO Add interface
export default class Page extends React.Component{
    constructor(props){
        super(props)
        this.state = {
          Receiver : new Receiver("CWAPerformanceMetrics"),
          data : [],
          mounted : false,
        }
      }
      componentDidMount(){
        console.log("mounted")
        if(!this.state.mounted){
          this.state.Receiver.update().then(()=>{
            console.log(this.state.Receiver.CWAData, typeof(this.state.Receiver.CWAData))
            this.setState({data:this.state.Receiver.CWAData})
          
          })
        }
        this.setState({mounted:true})
      }
}