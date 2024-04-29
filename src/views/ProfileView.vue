<template>
    <div>
        <b-container v-if="user && user.tweets" class="mt-4">
            <b-row>
                <b-col md="5">
                    <ProfileCard :user="user" />
                </b-col>
                <b-col md="7">
                    <TweetsContainer :tweets="user.tweets" />
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
import { GET_USER_QUERY } from '@/gql';

export default {
    name: 'ProfileView',
    data() {
        return {
            user: {}
        }
    },
    apollo: {
        user: {
            query: GET_USER_QUERY,
            variables() {
                return {
                    userId: this.$route.params.id
                }
            },
            update: data => data.getUserById
        }
    }
}
</script>