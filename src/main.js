import Vue from 'vue'
import App from './App.vue'

import {library} from '@fortawesome/fontawesome-svg-core';
import {faPopcorn} from '@fortawesome/pro-duotone-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';

import dayjs from 'dayjs';

library.add(faPopcorn);

Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.config.productionTip = false;

Vue.filter('formatDate', function (value, dateFormat) {
    if (value) {
        return dayjs(String(value)).format(dateFormat);
    }
});

new Vue({
    render: h => h(App),
}).$mount('#app')
