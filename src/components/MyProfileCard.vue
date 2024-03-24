<template>
    <b-container>
        <b-card v-if="profile !== null">
            <router-link to="/profile" style="text-decoration: none; color: inherit;">
                <div class="d-flex flex-row mb-4">
                    <div>
                        <b-avatar size="lg" variant="dark" rounded class="avatar-custom"></b-avatar>
                    </div>
                    <div class="ml-3">
                        <h5 class="m-0">{{ profile.firstName }} {{ profile.lastName }}</h5>
                        <p class="m-0">@{{ profile.handle }}</p>
                    </div>
                </div>
            </router-link>

            <b-row class="text-center">
                <b-col md="6">
                    <h5 class="mb-0">155</h5>
                    <small class="text-muted">FOLLOWERS</small>
                </b-col>
                <b-col md="6">
                    <h5 class="mb-0">300</h5>
                    <small class="text-muted">FOLLOWING</small>
                </b-col>
            </b-row>
        </b-card>
    </b-container>
</template>

<script>
import gql from 'graphql-tag';

export default {
    name: 'MyProfileCard',
    data() {
        return {
            profile: null
        }
    },
    methods: {
        async fetchProfile() {
            await this.$apollo.provider.defaultClient.query({
                query: gql`
                query GetMyself {
                    getMyself {
                        id
                        email
                        firstName
                        lastName
                        handle
                    }
                }
                `
            }).then(response => this.profile = response.data.getMyself);
        }
    },
    mounted() {
        this.fetchProfile();
    }
}
</script>