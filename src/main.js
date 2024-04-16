import Vue from 'vue';
import VueApollo from 'vue-apollo';
import App from './App.vue';
import router from './router';
import store from './store';

// Apollo
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context'
Vue.use(VueApollo);
const httpLink = createHttpLink({
  uri: 'http://localhost:4000/',
});
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  return {
      headers: {
          ...headers,
          authorization: token ? `Bearer ${token}` : null
      }
  }
});
export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
});

// Bootstrap
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import { BootstrapVue } from 'bootstrap-vue';
Vue.use(BootstrapVue);

// oh-vue-icons
import { OhVueIcon, addIcons } from 'oh-vue-icons';
import * as FaIcons from "oh-vue-icons/icons/fa";
import * as BiIcons from "oh-vue-icons/icons/bi";
import * as HiIcons from "oh-vue-icons/icons/hi";
const Fa = Object.values({ ...FaIcons });
const Bi = Object.values({ ...BiIcons });
const Hi = Object.values({ ...HiIcons });
addIcons(...Fa);
addIcons(...Bi);
addIcons(...Hi);
Vue.component("v-icon", OhVueIcon);

// floating-vue
import 'floating-vue/dist/style.css'

// Infinite scroll
import infiniteScroll from 'vue-infinite-scroll';
Vue.use(infiniteScroll);

new Vue({
  apolloProvider,
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
