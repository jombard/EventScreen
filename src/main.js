import Vue from 'vue'
import './plugins/axios'
import './plugins/bootstrap-vue'
import App from './App.vue'
import store from './store'
import moment from 'moment'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faClock, faTags, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faClock, faTags, faMapMarkerAlt)
Vue.component('font-awesome-icon', FontAwesomeIcon)

import 'vue-multiselect/dist/vue-multiselect.min.css'
import './assets/scss/custom.scss'

Vue.filter('msFormatDateTime', function(value) {
  if (value) {
    return moment(Number(value)).format('LL LTS')
  }
});


Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
