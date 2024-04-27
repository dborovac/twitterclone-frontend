import Vue from 'vue';
import VueApollo from 'vue-apollo';
import App from './App.vue';
import router from './router';

import LikeButton from './components/LikeButton.vue';
Vue.component("LikeButton", LikeButton);
import CompactProfileInfo from './components/CompactProfileInfo.vue';
Vue.component("CompactProfileInfo", CompactProfileInfo);
import PostTweetForm from './components/PostTweetForm.vue';
Vue.component("PostTweetForm", PostTweetForm);
import ProfileCard from './components/ProfileCard.vue';
Vue.component("ProfileCard", ProfileCard);
import SingleTweet from './components/SingleTweet.vue';
Vue.component("SingleTweet", SingleTweet);
import TrendingTopics from './components/TrendingTopics.vue';
Vue.component("TrendingTopics", TrendingTopics);

// Apollo
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
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
  cache: new InMemoryCache()
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

// vue-share-buttons
import TwitterButton from "vue-share-buttons/src/components/TwitterButton";
Vue.component("TwitterButton", TwitterButton);
import FacebookButton from "vue-share-buttons/src/components/FacebookButton";
Vue.component("FacebookButton", FacebookButton);
import RedditButton from "vue-share-buttons/src/components/RedditButton";
Vue.component("RedditButton", RedditButton);
import LinkedInButton from "vue-share-buttons/src/components/LinkedInButton";
Vue.component("LinkedInButton", LinkedInButton);

// floating-vue
import 'floating-vue/dist/style.css'

// Infinite scroll
import infiniteScroll from 'vue-infinite-scroll';
Vue.use(infiniteScroll);

// Mentionable
import { Mentionable } from 'vue-mention';
Vue.component("VueMentionable", Mentionable);

// vue-bootstrap-typeahead
import VueBootstrapTypeahead from 'vue-bootstrap-typeahead';
Vue.component('vue-bootstrap-typeahead', VueBootstrapTypeahead);

new Vue({
  apolloProvider,
  router,
  render: (h) => h(App),
}).$mount('#app');
