<template>
    <b-container>
        <b-card v-if="user !== undefined && profile !== undefined">

            <div class="d-flex flex-row mb-4 align-items-center">
                <div class="flex-column">
                    <b-avatar size="lg" variant="dark" rounded class="avatar-custom"></b-avatar>
                </div>
                <div class="ml-2 flex-column">
                    <div v-if="this.$parent.$options.name !== 'HomeView'">
                        <h5 class="m-0">{{ user.firstName }} {{ user.lastName }}</h5>
                        <p class="m-0 text-muted">@{{ user.handle }}</p>
                    </div>
                    <div v-else>
                        <router-link to="/profile/me" style="text-decoration: none; color: inherit;">
                            <h5 class="m-0">{{ user.firstName }} {{ user.lastName }}</h5>
                            <p class="m-0 text-muted">@{{ user.handle }}</p>
                        </router-link>
                    </div>
                </div>
                <div v-if="user.handle !== profile.handle" class="flex-column ml-auto">
                    <b-button v-if="profile.followees.find(obj => obj.id === user.id)"
                        pill :variant="getAttributeBasedOnHover().variant"
                        @mouseover="isHovered = true"
                        @mouseleave="isHovered = false">{{ getAttributeBasedOnHover().text }}</b-button>
                    <b-button v-else @click="onFollow(user.id)" pill variant="info">Follow</b-button>
                </div>
            </div>

            <b-row class="text-center">
                <b-col md="6">
                    <h5 v-if="user.followers" class="mb-0">{{ user.followers.length }}</h5>
                    <small class="text-muted">FOLLOWERS</small>
                </b-col>
                <b-col md="6">
                    <h5 v-if="user && user.followees" class="mb-0">{{ user.followees.length }}</h5>
                    <small class="text-muted">FOLLOWING</small>
                </b-col>
            </b-row>
        </b-card>
    </b-container>
</template>

<script>
import gql from 'graphql-tag';

const FOLLOW_MUTATION = gql`
    mutation Follow($userId: String!) {
        follow(userId: $userId) {
            success
        }
    }
`;

export default {
    name: 'ProfileCard',
    props: {
        user: Object
    },
    data() {
        return {
            isHovered: false
        }
    },
    computed: {
        profile() {
            return this.$store.getters.getProfile;
        }
    },
    methods: {
        onFollow(userId) {
            this.$apollo.mutate({
                mutation: FOLLOW_MUTATION,
                variables: {
                    userId: userId
                }
            });
        },
        getAttributeBasedOnHover() {
            if (this.isHovered) {
                return {
                    text: 'Unfollow',
                    variant: 'info'
                }
            } else {
                return {
                    text: 'Following',
                    variant: 'outline-info'
                }
            }
        }
    }
}
</script>