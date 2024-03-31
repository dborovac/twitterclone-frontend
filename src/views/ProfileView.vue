<template>
    <div>
        <b-container class="mt-4">
            <b-row>
                <b-col md="5">
                    <ProfileCard :user="user" />
                </b-col>
                <b-col md="7">
                    <div v-for="tweet in tweets" :key="tweet.id">
                        <SingleTweet :tweet="tweet" :user="user" />
                    </div>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
import gql from 'graphql-tag';
import ProfileCard from '@/components/ProfileCard.vue';
import SingleTweet from '@/components/SingleTweet.vue';

const GET_USER_QUERY = gql`
    query GetUserById($userId: String!) {
        getUserById(userId: $userId) {
            id
            email
            firstName
            lastName
            handle
            birthday
            followers {
                id
                handle
            }
            followees {
                id
                handle
            }
            tweets {
                id
                content
                postedAt
                mentions {
                    id
                    handle
                }
            }
        }
    }
`;

export default {
    name: 'ProfileView',
    components: {
        ProfileCard,
        SingleTweet
    },
    data() {
        return {
            tweets: [],
            user: {}
        }
    },
    methods: {
        async getUserById() {
            await this.$apollo.query({
                query: GET_USER_QUERY,
                variables: {
                    userId: this.$route.params.id
                }
            }).then(response => {
                this.user = response.data.getUserById;
                this.tweets = this.user.tweets;
            });
        }
    },
    watch: {
        $route: function() {
            this.getUserById();
        }
    },
    mounted() {
        this.getUserById();
    }
}
</script>