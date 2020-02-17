import Vue from 'vue'
import App from './App.vue'

import {library} from '@fortawesome/fontawesome-svg-core';
import {faCoffee, faHeat} from '@fortawesome/pro-solid-svg-icons';
import {faFilm} from '@fortawesome/pro-light-svg-icons';
import {faPopcorn} from '@fortawesome/pro-duotone-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';

import dayjs from 'dayjs';

library.add(faCoffee, faFilm, faHeat, faPopcorn);

Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.config.productionTip = false;

Vue.filter('formatDate', function (value, dateFormat) {
    if (value) {
        return dayjs(String(value)).format(dateFormat);
    }
});

Vue.directive('focus', {
  inserted: function (el) {
    el.focus()
  }
});

new Vue({
    render: h => h(App),
}).$mount('#app')
