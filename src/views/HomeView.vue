<template>
    <div>
        <b-container class="mt-4">
            <b-row>
                <b-col md="8" class="offset-md-2">
                    <b-card>
                        <b-form @submit.prevent="postTweet">
                            <b-form-group label="What's happening?" label-for="tweetText">
                                <b-form-textarea id="tweetText" v-model="tweetText" rows="3" maxlength="280"
                                    required></b-form-textarea>
                            </b-form-group>
                            <b-button type="submit" variant="info">Tweet</b-button>
                        </b-form>
                    </b-card>
                </b-col>
            </b-row>
        </b-container>

        <b-container class="mt-4">
            <b-row>
                <b-col md="8" class="offset-md-2">
                    <b-card v-for="(tweet, index) in tweets" :key="index" class="mb-2">
                        <b-card-text>{{ tweet.content }}</b-card-text>
                        <b-card-footer>
                            <small class="text-muted">Posted by *MYSELF* on {{ tweet.postedAt }}</small>
                        </b-card-footer>
                    </b-card>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
import gql from 'graphql-tag';

export default {
    data() {
        return {
            tweetText: '',
            tweets: []
        };
    },
    methods: {
        async postTweet() {
            await this.$apollo.provider.defaultClient.mutate({
                mutation: gql`
                    mutation PostTweet($request: PostTweetRequest!) {
                        postTweet(request: $request) {
                            success
                        }
                    }
                `,
                variables: {
                    request: {
                        content: this.tweetText
                    }
                },
                context: {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            }).then(() => {
                this.fetchTweets();
            })
        },
        async fetchTweets() {
            await this.$apollo.provider.defaultClient.query({
                query: gql`
                    query GetMyTweets {
                        getMyTweets {
                            content
                            postedAt
                        }
                    }
                `,
                context: {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            }).then(response => {
                this.tweets = response.data.getMyTweets;
            })
        }
    },
    mounted() {
        this.fetchTweets();
    }
};
</script>

<style scoped></style>