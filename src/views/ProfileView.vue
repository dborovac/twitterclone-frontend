<template>
    <div>
        <b-container v-if="user && user.tweets" class="mt-4">
            <b-row>
                <b-col md="5">
                    <ProfileCard :user="user" />
                </b-col>
                <b-col md="7">
                    <b-card v-if="user.tweets.length > 0" title="My tweets card" class="mb-5" no-body>
                        <b-card-body>
                            <div v-for="tweet in user.tweets" :key="tweet.id">
                                <SingleTweet :tweet="tweet" />
                            </div>
                        </b-card-body>
                    </b-card>
                    <b-card v-else>
                        <div class="text-center">Nothing here</div>
                    </b-card>
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