import Vue from 'vue';
import VueApollo from 'vue-apollo';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import App from './App.vue';
import { BootstrapVue } from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import router from './router';
import store from './store';

Vue.use(VueApollo);

const httpLink = createHttpLink({
  uri: 'http://localhost:4000/',
});

const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
});

Vue.use(BootstrapVue);

new Vue({
  apolloProvider,
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');