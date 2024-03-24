<template>
    <div>
        <b-container class="mt-4">
            <b-row>
                <b-col md="4">
                    <MyProfileCard />
                </b-col>
                <b-col md="6">
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
                    <div v-for="(tweet, index) in tweets" :key="index">
                        <SingleTweet :tweet="tweet" />
                    </div>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
import gql from 'graphql-tag';
import MyProfileCard from '@/components/MyProfileCard.vue';
import SingleTweet from '@/components/SingleTweet.vue';

export default {
    name: 'HomeView',
    components: {
        MyProfileCard,
        SingleTweet
    },
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
                `
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
