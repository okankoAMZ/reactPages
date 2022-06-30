import Page from "./page"
import '../helpers/homepage.css'

export default class Home extends Page {
    render() {
        return (
            <div class="homepage">
                <h2>HomePage</h2>
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
            </div>

        );
    }
}