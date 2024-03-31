<template>
	<div id="app">
		<b-navbar toggleable="md" type="dark" variant="info">
			<b-container>
				<b-navbar-brand to="/">Twitter Clone</b-navbar-brand>

				<b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

				<b-collapse id="nav-collapse" is-nav>
					<b-navbar-nav class="ml-auto">
						<b-nav-item v-if="isAuthenticated()" to="/profile/me">Profile</b-nav-item>
						<b-nav-item v-if="isAuthenticated()" @click="logout">Logout</b-nav-item>
					</b-navbar-nav>
				</b-collapse>
			</b-container>
		</b-navbar>
		<router-view></router-view>
	</div>
</template>

<script>
import { logout, isAuthenticated } from '@/auth';

export default {
	name: 'App',
	methods: {
		logout() {
			logout();
			this.$apollo.provider.defaultClient.clearStore();
			this.$store.reset();
			this.$router.push({ name: 'Login' });
		},
		isAuthenticated
	}
}
</script>
