import Vue from "vue";
import App from "./App.vue";
import { router } from "./router";
import vuetify from "./plugins/vuetify";
import axios from "axios";
import VueAxios from "vue-axios";
import moment from "moment";
import Notifications from "vue-notification";

import "material-design-icons-iconfont/dist/material-design-icons.css";
import "./registerServiceWorker";

Vue.config.productionTip = false;
Vue.use(VueAxios, axios);
Vue.use(Notifications);
Vue.prototype.moment = moment;
Vue.prototype.serverHost = process.env.NODE_ENV == "production" ? "" : "http://localhost:3000";

axios.defaults.withCredentials = true;

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount("#app");