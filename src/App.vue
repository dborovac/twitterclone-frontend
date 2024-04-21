<template>
	<div id="app">
		<b-navbar toggleable="lg" type="dark" variant="info" style="position: sticky; top: 0; z-index: 1000;">
			<b-container>
				<b-navbar-brand to="/">Twitter Clone</b-navbar-brand>

				<b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

				<b-collapse id="nav-collapse" is-nav>
					<b-navbar-nav class="ml-auto">
						<b-nav-form v-if="isAuthenticated()">
							<vue-bootstrap-typeahead
								ref="usersTypeahead"
								:data="users"
								v-model="searchQuery"
								:serializer="u => u.handle"
								placeholder="Find people you know"
								prepend="@"
								@hit="onHit($event)">
								<template slot="suggestion" slot-scope="{ htmlText, data }">
									<div class="d-flex flex-row p-1">
										<div>
											<b-avatar size="md" variant="dark" rounded class="avatar-custom"></b-avatar>
										</div>
										<div class="ml-2">
											<h6 class="m-0">{{ data.firstName + ' ' + data.lastName }}</h6>
											<p class="m-0" v-html="htmlText"></p>
										</div>
									</div>
								</template>
							</vue-bootstrap-typeahead>
						</b-nav-form>
						<b-nav-item v-if="isAuthenticated()" class="ml-3" to="/profile/me">My profile</b-nav-item>
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
import _ from 'underscore';

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
			users: [],
			searchQuery: '',
			selectedUser: null
		}
	},
	methods: {
		isAuthenticated,
		logout() {
			logout();
			this.$apollo.provider.defaultClient.clearStore();
			this.$store.reset();
			this.$router.push({ name: 'Login' });
		},
		searchUsers(searchQuery) {
			this.$apollo.query({
				query: SEARCH_USERS_QUERY,
				variables: {
					searchQuery: searchQuery
				}
			}).then(response => this.users = response.data.searchUsers);
		},
		onHit(user) {
			this.$router.push({ name: 'Profile', params: { id: user.id } });
			this.$refs.usersTypeahead.inputValue = '';
		}
	},
	watch: {
		searchQuery: _.debounce(function(val) { this.searchUsers(val) }, 500)
	}
}
</script>

<style>
* {
	font-family: "DM Sans", sans-serif;
}
</style>
