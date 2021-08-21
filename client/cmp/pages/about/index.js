import {component} from 'doz'
import style from './style.css'

const cfg = {

    template(h) {
        return h`
            <div class="animated fadeIn">
                 <h1>About</h1>
                 <img class="${style.avatar}" src="https://avatars0.githubusercontent.com/u/12598754?s=800" />
                 <h3 class="${style.name}">Fabio Ricali</h3>
                 <p>I work as web developer and web designer since 2003 based in Sicily.<br>I'm a lover of nature, steampunk art, technology and the sky.</p>
            </div>
        `
    }

};

component('app-about', cfg);

export default cfg;