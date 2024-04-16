import Vue from 'vue';
import VueRouter from 'vue-router';
import LoginView from './views/LoginView.vue';
import HomeView from './views/HomeView.vue';
import MyProfileView from './views/MyProfileView.vue';
import ProfileView from './views/ProfileView.vue';
import RegisterView from './views/RegisterView.vue';
import SuccessfulRegistrationView from './views/SuccessfulRegistrationView.vue';
import { apolloClient } from './main.js';
import store from './store';
import gql from 'graphql-tag';

import { isAuthenticated } from './auth';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    component: HomeView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/profile/me',
    name: 'MyProfile',
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
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (isAuthenticated()) {
      next();
    } else {
      next('login');
    }
  } else {
    next();
  }
});

const GET_MY_PROFILE_QUERY = gql`
    query GetMyself {
        getMyself {
            id
            email
            firstName
            lastName
            handle
            followers {
                id
                handle
            }
            followees {
                id
                handle
            }
        }
    }
`;

router.onReady(async () => {
  await apolloClient.query({
    query: GET_MY_PROFILE_QUERY
  }).then(response => store.dispatch('updateProfile', response.data.getMyself));
})

export default router;
