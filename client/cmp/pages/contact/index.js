import {component} from 'doz'
import style from './style.css'

const cfg = {

    template(h) {
        return h`
            <div class="animated fadeIn">
                 <h1>Contact</h1>
                 <h2>Get in touch or read my code</h2>
                 <p>
                    <a href="mailto:fabio@rica.li">fabio@rica.li</a> | 
                    <a href="https://www.linkedin.com/in/fabio-ricali-a808b39b/">Linkedin</a> | 
                    <a href="https://github.com/fabioricali">GitHub</a>
                </p>
            </div>
        `
    }

};

component('app-contact', cfg);

export default cfg;