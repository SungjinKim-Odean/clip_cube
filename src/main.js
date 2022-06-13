import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './plugins/router'
import store from './plugins/store'
import api from './api'
import StyleConfig from "./model/StyleConfig.js"
import rules from "./model/Rules.js"
import dictionary from "./model/Dictionary.js";

Vue.config.productionTip = false
Vue.prototype.$api = api;

Vue.prototype.$eventBus = new Vue();
Vue.prototype.$info = function(message) { Vue.prototype.$eventBus.$emit('info', message); }
Vue.prototype.$warn = function(title, reason) { Vue.prototype.$eventBus.$emit('warn', { title, reason }); }
Vue.prototype.$confirm = function(title, query, yes_action, yes_param, no_action, no_param) { Vue.prototype.$eventBus.$emit('confirm', {title, query, yes_action, yes_param, no_action, no_param});}
  
Vue.prototype.$styleConfig = StyleConfig;
Vue.prototype.$inputRules = rules;
Vue.prototype.$dictionary = dictionary;

new Vue({
    vuetify,
    router,
    store,
    render: h => h(App)
}).$mount('#app')
