<template>
  <div class="login-container">
    <b-container class="mt-5">
      <b-row align-h="center">
        <b-col md="6">
          <b-card title="Login">
            <b-form @submit.prevent="login">
              <b-form-group id="input-group-1" label="Email" label-for="email">
                <b-form-input id="email" v-model="email" type="email" required></b-form-input>
              </b-form-group>

              <b-form-group id="input-group-2" label="Password" label-for="password">
                <b-form-input id="password" v-model="password" type="password" required></b-form-input>
              </b-form-group>

              <b-button type="submit" variant="primary">Login</b-button>
            </b-form>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import gql from 'graphql-tag';
import { login } from '../auth';

export default {
  name: 'LoginView',
  data() {
    return {
      email: '',
      password: '',
    };
  },
  methods: {
    async login() {
      await this.$apollo.provider.defaultClient.mutate({
        mutation: gql`
          mutation Login($request: LoginRequest!) {
            login(request: $request) {
              token
            }
          }
        `,
        variables: {
          request: {
            email: this.email,
            password: this.password
          }
        }
      }).then(response => {
          login(response.data.login.token);
          this.$router.push({ path: '/' });
        }
      )
    },
  },
};
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
