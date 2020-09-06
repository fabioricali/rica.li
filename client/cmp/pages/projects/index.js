import {component} from 'doz'
import projects from './list'
import style from './style.css'

const cfg = {

    template(h) {
        return h`
            <div class="animated fadeIn">
                 <h1>Projects</h1>
                 <h2>Most important open source projects</h2>
                 <ul class="${style.list}">
                 ${this.each(projects, item => h`<li><a href="${item.url}" target="_blank">${item.name}</a></li>`)}
                 </ul>
            </div>
        `
    }

};

component('app-projects', cfg);

export default cfg;