import Vue from 'vue'
import App from './App.vue'
import  Venues  from './Venues.vue';
import  userVenues  from './userVenues.vue';
import  Venue  from './Venue.vue';
import  User  from './User.vue';
import Vuetify from 'vuetify'
Vue.use(Vuetify);
import VueCookie from 'vue-cookie';
Vue.use(VueCookie);

// app.js
import BootstrapVue from 'bootstrap-vue'
Vue.use(BootstrapVue);
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import VueRouter  from  'vue-router';
Vue.use(VueRouter);
import  VueResource  from  'vue-resource';
Vue.use(VueResource);

// import Vuelidate from 'vuelidate'
// Vue.use(Vuelidate)

const routes = [
  {
    path : "/api/v1/venues",
    name : "venues",
    component : Venues
  },
  {
    path : "/api/v1/myVenues",
    name : "userVenues",
    component : userVenues
  },
  {
    path : "/api/v1/venues/:venueId",
    name : "venue",
    component : Venue
  },
  {
    path : "/api/v1/venues/:cityName",
    name : "city",
    component : Venues
  },
  {
    path : "/api/v1/users/:id",
    name : "user",
    component : User
  }
];

const router  =  new  VueRouter ({
  routes : routes,
  mode :  'history'
});

new Vue({
  el: '#app',
  router : router,
  render: h => h(App)
});
