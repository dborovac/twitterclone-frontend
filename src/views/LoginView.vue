<template>
	<b-container>
		<b-row class="mt-5">
			<b-col md="6">
				<v-icon name="bi-twitter" scale="15" animation="float" speed="fast" fill="#17a2b8"></v-icon>
			</b-col>
			<b-col md="6">
				<b-card>
					<p>Don't have an account? <router-link :to="{ name: 'Register' }">Sign up</router-link></p>
					<hr>
					<b-form @submit.prevent="login">
						<b-form-group id="input-group-1">
							<b-form-input id="email" v-model="email" type="email" placeholder="Email" required></b-form-input>
						</b-form-group>

						<b-form-group id="input-group-2">
							<b-form-input id="password" v-model="password" type="password" placeholder="Password" required></b-form-input>
						</b-form-group>

						<b-button type="submit" variant="dark" class="mt-3">Login</b-button>
					</b-form>
				</b-card>
			</b-col>
		</b-row>
	</b-container>

</template>

<script>
import gql from 'graphql-tag';
import { login } from '../auth';

export default {
	name: 'LoginView',
	data() {
		return {
			email: '',
			password: ''
		};
	},
	methods: {
		async login() {
			await this.$apollo.provider.defaultClient.mutate({
				mutation: gql`
          		mutation($request: LoginRequest!) {
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
			});
		}
	},
};
</script>
