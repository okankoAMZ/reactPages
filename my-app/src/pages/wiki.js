import Navbar from "../helpers/navbar";
import Page from "./page"
import "./wiki.css"


export default class WikiPage extends Page {
    render() {
        return (
            <div class="wiki_page">
                <Navbar />
                <h2>WikiPage</h2>
                <section>
                    <h3>Webpages Explained</h3>
                    <h4>Home</h4>
                    <p></p>
                    <h4>Table</h4>
                    <p></p>
                    <p>
                        Settings: <br/>
                        <ul>
                            <li></li>   
                        </ul>
                    </p>
                    <h4>Graph</h4>
                    <p></p>
                    <p>
                        Settings: <br/>
                        <ul>
                            <li>Test</li>
                        </ul>
                    </p>
                </section>
                <section>
                    <h3>How to add data</h3>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum orci odio, facilisis sed diam eget, convallis rhoncus eros. Nulla eu dapibus augue, at hendrerit nulla. Nulla facilisi. Sed congue sem at felis viverra, et rhoncus nisl egestas. Pellentesque id imperdiet ipsum, at egestas arcu. Aliquam quis varius risus, in pretium nulla. Sed ac diam lectus. Etiam eu malesuada nisi. Aenean et pulvinar odio, eu egestas tortor. Maecenas eget odio vitae eros condimentum mattis. Vestibulum tempor ullamcorper velit, varius euismod nisl tincidunt at. Maecenas laoreet ligula vitae augue blandit porta. Pellentesque consectetur tristique tempus. Etiam congue eros rhoncus fringilla elementum. Praesent dignissim et risus ut aliquam.</p>
                    <ul>

                    </ul>
                    <p>

                    </p>
                </section>
                <section>
                    <h3>Test Enviorment</h3>
                    <p>
                    Curabitur sit amet luctus justo, eu maximus mi. Pellentesque lacinia tempor diam, quis blandit ex. Vestibulum tincidunt, ante ac fermentum tristique, ex libero tempus lorem, et molestie velit lectus eget risus. Maecenas posuere augue eu bibendum consectetur. Suspendisse id mauris elit. Nulla volutpat quis tellus at efficitur. Fusce vel neque eu urna congue tempus. Morbi eget ligula enim. Ut tortor orci, convallis quis magna a, volutpat vulputate ex. Curabitur ac interdum elit. Suspendisse tempus volutpat blandit. Curabitur vel blandit augue.
                    </p>
                </section>
                <section>
                    <h3>Troubleshooting</h3> 
                </section>

            </div>
        );
    }
}