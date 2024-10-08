import Vue from 'vue';
import VueRouter from 'vue-router';
import LoginView from './views/LoginView.vue';
import HomeView from './views/HomeView.vue';
import MyProfileView from './views/MyProfileView.vue';
import ProfileView from './views/ProfileView.vue';
import RegisterView from './views/RegisterView.vue';
import SuccessfulRegistrationView from './views/SuccessfulRegistrationView.vue';
import { apolloClient } from './main.js';

import { isAuthenticated, logout } from './auth';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    component: HomeView,
    name: 'Home',
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/:hashtag',
    name: 'Hashtag',
    component: HashtagView,
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/profile/me',
    name: 'My profile',
    component: MyProfileView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/profile/:id',
    name: 'Profile',
    component: ProfileView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView
  },
  {
    path: '/register/thank-you',
    name: 'SuccessfulRegistration',
    component: SuccessfulRegistrationView
  }
];

const router = new VueRouter({
  routes,
  mode: 'history'
});

router.beforeEach((to, from, next) => {
  const titleFromParams = to.params?.title;
  if (titleFromParams) {
    document.title = titleFromParams;
  } else {
    document.title = to.name;
  }
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (isAuthenticated()) {
      next();
    } else {
      logout();
      next({ name: 'Login' });
    }
  } else {
    next();
  }
});

import { QUERY_MYSELF } from './gql';
import HashtagView from './views/HashtagView.vue';

router.onReady(async () => {
  if (isAuthenticated()) {
    await apolloClient.query({
      query: QUERY_MYSELF
    });
  }
})

export default router;
