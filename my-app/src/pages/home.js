import Page from "./page"
import './homepage.css'
import Navbar from '../helpers/navbar';
//This webpage provides information about the project
export default class Home extends Page {
    render() {
        document.body.style.setProperty("--fontSize",parseInt(this.state.config.textFontSize).toString()+"px")
        document.body.style.setProperty("--h3fontSize",(parseInt(this.state.config.textFontSize)+4).toString()+"px")
        document.body.style.setProperty("--h2fontSize",(parseInt(this.state.config.textFontSize)+8).toString()+"px")
        return (
            <div class="homepage">
                <Navbar/>
                <h2>HomePage</h2>
                {/* @TODO: Add more text */}
                <section>
                    <h3>About CWA Performance Tracking</h3>
                    <p>
                        The CloudWatch Agent performance tracker provides
                        data on the resource usage of the CWA itself.
                        It is currently designed and configured to be run on
                        Amazon Linux on EC2. The aim of this tracker is to
                        provide information on expected resource usage of
                        the CWA so resources can be accurately allocated
                        to the CWA.
                    </p>
                </section>
                <section>
                    <h3>Need Assistance?</h3>
                    <p>
                        Detail/link where to report or cut
                        a ticket to our team if an issue comes up.
                    </p>
                </section>
                <section>
                    <h3>Intended Use</h3>
                    <p>
                        This project captures CPU average usage,
                        CPU peak usage, CPU min usage, etc.
                    </p>
                </section>
                <section>
                    <h3> FAQ</h3>
                    <p>
                        Q: Graphs or Table are not updated, when I refresh? 
                        <br/>A: Hit this button <button
                        title="Click"
                        style={{width:"50px",height:"16px"}}
                         onClick={()=>{
                             this.state.Receiver.cacheClear()
                         }}/> 
                    </p>
                </section>
            </div>

        );
    }
}