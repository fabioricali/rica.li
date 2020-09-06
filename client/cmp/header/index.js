import {component} from 'doz'
import './style.css'

const cfg = {

    template() {
        return `
            <header>
                <nav>
                    <ul>
                        <li>
                            <a data-router-link href="/">Home</a>
                        </li><li>
                            <a data-router-link href="/projects">Projects</a>
                        </li><li>
                            <a data-router-link href="/about">About</a>
                        </li><li>
                            <a data-router-link href="/contact">Contact</a>
                        </li>
                    </ul>   
                </nav>
            </header>
        `
    }

};

component('app-header', cfg);

export default cfg;