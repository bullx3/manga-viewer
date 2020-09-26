import Vue from 'vue'
import App from './App'

import '../custom.scss'
import './viewer.scss'
import BootstrapVue from 'bootstrap-vue';

Vue.use(BootstrapVue);


global.browser = require('webextension-polyfill')
Vue.prototype.$browser = global.browser

new Vue({
  el: '#app',
  
  render: h => h(App)
})

