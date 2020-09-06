import 'regenerator-runtime'
import Doz from 'doz'
import hotLocationReload from 'doz-hot-location-reload'
import metaTag from 'doz-metatag'
import isSSR from 'doz-ssr/plugin'
import CONFIG from './config'
import 'doz-router'
import 'animate.css'
import './app.css'
import './cmp/header'
import './cmp/pages/home'
import './cmp/pages/about'
import './cmp/pages/projects'
import './cmp/pages/contact'

// This causes the page to reload in the browser
// when there are changes during the development phase
hotLocationReload(module);

// Plugin used during Server Side Rendering
Doz.use(isSSR);

// Plugin that changes the meta tags
Doz.use(metaTag, {
    title: 'Rica.li',
    description: 'Magic development'
});

// Add configuration to all components,
// so it's possible call in this way this.CONFIG.FOO
Doz.mixin({
    CONFIG
});

new Doz({

    root: '#app',

    template(h) {
        return h`
            <app-header/>
            <main>
                <doz-router mode="history" d:id="router">
                    <app-home route="/"></app-home>
                    <app-about route="/about"></app-about>
                    <app-projects route="/projects"></app-projects>
                    <app-contact route="/contact"></app-contact>
                </doz-router>
            </main>
        `
    },

    onCreate() {
        // Every time a component is mounted on the DOM,
        // I update the list of links mapped with the "data-router-link" attribute
        this.app.on('componentMountAsync', () => {
            if (this.router) {
                this.router.bindLink();
            }
        });
    },

    onMountAsync() {
        if (window.SSR)
            window.SSR.ready();
    }

});
