<template>
	<div id="app">
		<b-navbar toggleable="lg" type="dark" variant="info">
			<b-container>
				<b-navbar-brand to="/">Twitter Clone</b-navbar-brand>

				<b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

				<b-collapse id="nav-collapse" is-nav>
					<b-navbar-nav class="ml-auto">
						<b-nav-form>
							<!-- <vue-bootstrap-autocomplete
								class="mr-sm-2"
								v-model="searchUsersText"
								:ieCloseFix="false"
								:data="searchedUsers"
								@hit="selectedUser = $event"
								placeholder="Search users"
								@input="search">
							</vue-bootstrap-autocomplete> -->
							<!-- <b-form-input v-if="isAuthenticated()" v-model="searchUsersText" @input="search"
								style="width: 15rem" size="sm" class="mr-sm-2"
								placeholder="Search users"></b-form-input> -->
						</b-nav-form>
						<b-nav-item v-if="isAuthenticated()" to="/profile/me">My profile</b-nav-item>
						<b-nav-item v-if="isAuthenticated()" @click="logout">Logout</b-nav-item>
					</b-navbar-nav>
				</b-collapse>
			</b-container>
		</b-navbar>

		<router-view></router-view>

		<link rel="preconnect" href="https://fonts.googleapis.com">
		<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
		<link
			href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap"
			rel="stylesheet">
	</div>
</template>

<script>
import { logout, isAuthenticated } from '@/auth';
import gql from 'graphql-tag';

const SEARCH_USERS_QUERY = gql`
	query SearchUsers($searchQuery: String!) {
		searchUsers(searchQuery: $searchQuery) {
			id
			handle
			firstName
			lastName
			birthday
			email
		}
	}
`;

export default {
	name: 'App',
	data() {
		return {
			searchUsersText: '',
			searchedUsers: [],
			searchedUsersPopup: false,
			selectedUser: {}
		}
	},
	methods: {
		logout() {
			logout();
			this.$apollo.provider.defaultClient.clearStore();
			this.$store.reset();
			this.$router.push({ name: 'Login' });
		},
		isAuthenticated,
		search() {
			this.$apollo.provider.defaultClient.query({
				query: SEARCH_USERS_QUERY,
				variables: {
					searchQuery: this.searchUsersText
				}
			}
			).then(response => {
				this.searchedUsers = response.data.searchUsers;
				this.searchedUsersPopup = true;
			});
		}
	}
}
</script>

<style>
* {
	font-family: "DM Sans", sans-serif;
}
</style>
