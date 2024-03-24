import Vue from 'vue';
import VueRouter from 'vue-router';
import LoginView from './views/LoginView.vue';
import HomeView from './views/HomeView.vue';
import ProfileView from './views/ProfileView.vue';
import RegisterView from './views/RegisterView.vue';
import SuccessfulRegistrationView from './views/SuccessfulRegistrationView.vue';

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
    path: '/profile',
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

export default router;
