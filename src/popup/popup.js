import Vue from 'vue'
import App from './App'
import '../custom.scss'
import './popup.scss'
import BootstrapVue from 'bootstrap-vue';

Vue.use(BootstrapVue);


global.browser = require('webextension-polyfill')
Vue.prototype.$browser = global.browser

/* eslint-disable no-new */
new Vue({
  el: '#app',
  
  
  render: h => h(App)
})
