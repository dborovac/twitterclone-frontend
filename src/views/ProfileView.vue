<template>
    <div>
        <b-container v-if="user && user.tweets" class="mt-4">
            <b-row>
                <b-col md="5">
                    <ProfileCard class="mb-4" :user="user" extended/>
                    <TrendingTopics class="mb-4" />
                </b-col>
                <b-col md="7">
                    <TweetsContainer :tweets="user.tweets" />
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
import { QUERY_USER_BY_ID } from '@/gql';

export default {
    name: 'ProfileView',
    data() {
        return {
            user: {}
        }
    },
    apollo: {
        user: {
            query: QUERY_USER_BY_ID,
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