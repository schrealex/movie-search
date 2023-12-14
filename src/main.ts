import './index.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faCircle } from "@fortawesome/free-regular-svg-icons";
import { faCoffee, faFilm, faMugHot, faStar, faTimes, faTv, faUser } from "@fortawesome/free-solid-svg-icons";

library.add(
    faCircle,
    faCoffee,
    faFilm,
    faMugHot,
    faStar,
    faTv,
    faUser,
    faTimes
);

const app = createApp(App)

app.directive('focus', (element) => {
    element.focus();
})

app.use(router)
app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app')
