import {component} from 'doz'
import style from './style.css'

const cfg = {

    template(h) {
        return h`
            <div class="animated fadeIn">
                 <h1 class="${style.slogan}">I'm rica.li</h1>
                 <h2 class="${style.subtitle}">Web developer with passion for the web</h2>
            </div>
        `
    }

};

component('app-home', cfg);

export default cfg;