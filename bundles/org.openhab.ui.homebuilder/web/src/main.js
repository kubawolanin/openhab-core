import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'daemonite-material/css/material.css'
import 'vue-form-generator/dist/vfg.css'
import 'vue-multiselect/dist/vue-multiselect.min.css'
import Affix from 'vue-affix'
import App from './App.vue'
import BootstrapVue from 'bootstrap-vue/dist/bootstrap-vue.esm'
import fieldMultiselect from './fieldMultiselect.vue'
import Multiselect from 'vue-multiselect'
import Vue from 'vue'
import VueFormGenerator from 'vue-form-generator'
import VueI18n from 'vue-i18n'
import VueResource from 'vue-resource'

Vue.use(BootstrapVue);
Vue.use(VueFormGenerator);
Vue.use(Affix);
Vue.use(VueResource);
Vue.use(VueI18n);
Vue.component('multiselect', Multiselect);
Vue.component('fieldMultiselect', fieldMultiselect);

let i18n = new VueI18n({
    locale: 'en-UK'
});

const vm = new Vue({
    i18n,
    el: '#app',
    render: h => h(App)
});

