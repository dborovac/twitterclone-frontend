<template>
    <div>
        <b-container class="mt-4">
            <b-row>
                <b-col md="4">
                    <MyProfileCard />
                </b-col>
                <b-col md="7">
                    <b-card class="mb-4">
                        <b-form @submit.prevent="postTweet">
                            <b-form-group>
                                <b-form-textarea id="tweetText" v-model="tweetText" placeholder="What's happening"
                                    rows="3" maxlength="320" required></b-form-textarea>
                            </b-form-group>
                            <b-button type="submit" variant="dark">Tweet</b-button>
                            <small class="text-muted ml-3">{{ tweetText.length }}/320</small>
                        </b-form>
                    </b-card>
                    <template v-if="$apollo.queries.tweets.loading">
                        <div class="d-flex justify-content-center">
                            <b-spinner variant="info"></b-spinner>
                        </div>
                    </template>
                    <template v-else>
                        <div class="tweets-container mb-5">
                            <div v-for="tweet in tweets" :key="tweet.id">
                                <SingleTweet :tweet="tweet" :user="{ firstName: 'John', lastName: 'Smith', handle: 'smitthy1123' }" />
                            </div>
                        </div>
                    </template>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
import gql from 'graphql-tag';
import MyProfileCard from '@/components/MyProfileCard.vue';
import SingleTweet from '@/components/SingleTweet.vue';

const GET_TWEETS_QUERY = gql`
    query GetMyTweets {
        tweets: getMyTweets {
            id
            content
            postedAt
        }
    }
`;

const POST_TWEET_MUTATION = gql`
    mutation PostTweet($content: String!) {
        postTweet(request: { content: $content }) {
            id
            content
            postedAt
        }
    }
`;

export default {
    name: 'HomeView',
    components: {
        MyProfileCard,
        SingleTweet
    },
    data: () => ({
        tweets: [],
        tweetText: ''
    }),
    apollo: {
        tweets: {
            query: GET_TWEETS_QUERY
        }
    },
    methods: {
        postTweet() {
            this.$apollo.mutate({
                mutation: POST_TWEET_MUTATION,
                variables: {
                    content: this.tweetText
                },
                update: (store, { data: { postTweet } }) => {
                    let data = store.readQuery({ query: GET_TWEETS_QUERY });
                    data = {
                        ...data,
                        tweets: [
                            postTweet,
                            ...data.tweets
                        ]
                    };
                    store.writeQuery({ query: GET_TWEETS_QUERY, data });
                }
            }).then(() => this.tweetText = '')
        }
    }
};
</script>

<style>
.tweets-container {
    max-height: 80vh;
    overflow-y: auto;
}
.tweets-container::-webkit-scrollbar {
    display: none;
}
.tweets-container {
    scrollbar-width: thin;
    scrollbar-color: #ccc transparent;
}

.tweets-container::-webkit-scrollbar-track {
    background-color: #f1f1f1;
}

.tweets-container::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 10px;
}

.tweets-container::-webkit-scrollbar-thumb:hover {
    background-color: #555;
}
</style>