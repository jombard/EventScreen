import Vue from "vue";
import "./plugins/axios";
import "./plugins/bootstrap-vue";
import App from "./App.vue";
import store from "./store";
import moment from "moment";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faClock,
  faTags,
  faMapMarkerAlt,
  faHeart,
  faStar,
  faPencilAlt,
  faLock,
  faEquals,
  faAlignJustify
} from "@fortawesome/free-solid-svg-icons";
import {
  faHeart as farHeart,
  faSquare,
  faCheckSquare
} from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import * as VueGoogleMaps from "vue2-google-maps";

library.add(
  faClock,
  faTags,
  faMapMarkerAlt,
  faHeart,
  faStar,
  farHeart,
  faPencilAlt,
  faLock,
  faCheckSquare,
  faSquare,
  faEquals,
  faAlignJustify
);

Vue.component("font-awesome-icon", FontAwesomeIcon);

import "vue-multiselect/dist/vue-multiselect.min.css";
import "./assets/scss/custom.scss";

Vue.filter("msFormatDateTime", function(value) {
  if (value) {
    return moment(value).format("LL LTS");
  }
});
Vue.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyCQWEHV8wk0hIOg17AOzPo4A-6tiLdBIps"
  }
});

Vue.config.productionTip = false;

new Vue({
  store,
  render: h => h(App)
}).$mount("#app");
