import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import VueSession from 'vue-session'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Vuelidate from 'vuelidate'
import Amplify, * as AmplifyModules from 'aws-amplify'
import { AmplifyPlugin } from 'aws-amplify-vue'
import awsmobile from './aws-exports'
import 'native-toast/dist/native-toast.css'
Amplify.configure(awsmobile)

Vue.use(AmplifyPlugin, AmplifyModules)
Vue.use(VueAxios, axios)
Vue.use(Vuelidate)
Vue.use(VueSession)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
