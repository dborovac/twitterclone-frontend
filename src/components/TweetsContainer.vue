<template>
    <div>
        <div v-if="divOnly" class="tweets-container" v-infinite-scroll="onScrolledToBottom" infinite-scroll-immediate-check="false">
            <div v-for="tweet in tweets" :key="tweet.id">
                <SingleTweet :tweet="tweet" />
            </div>
        </div>
        <b-card v-if="tweets.length > 0 && !divOnly" class="mb-5" no-body>
            <b-card-header v-if="title">
                <h5 class="m-0 d-inline">{{ title }}</h5>
                <div v-if="tweetCount" class="d-inline">
                    <span class="ml-2">•</span>
                    <span class="ml-2">{{ tweetCount }} tweets</span>
                </div>
            </b-card-header>
            <b-card-body>
                <div class="tweets-container" v-infinite-scroll="onScrolledToBottom" infinite-scroll-immediate-check="false">
                    <div v-for="tweet in tweets" :key="tweet.id">
                        <SingleTweet :tweet="tweet" />
                    </div>
                </div>
            </b-card-body>
        </b-card>
        <b-card v-if="tweets.length === 0">
            <div class="text-center">Nothing here</div>
        </b-card>
    </div>
</template>

<script>
export default {
    name: 'TweetsContainer',
    props: {
        tweets: Array,
        title: String,
        tweetCount: Number,
        tweetsQuery: Object,
        divOnly: Boolean
    },
    methods: {
        onScrolledToBottom() {
            this.tweetsQuery.fetchMore({
                variables: {
                    pageRequest: {
                        first: 10,
                        offset: this.tweets.length
                    }
                },
                updateQuery: (previousResult, { fetchMoreResult }) => {
                    const oldTweets = previousResult[`${this.tweetsQuery.key}`];
                    const newTweets = fetchMoreResult[`${this.tweetsQuery.key}`];
                    const result = {};
                    result[`${this.tweetsQuery.key}`] = [...oldTweets, ...newTweets];
                    return result;
                }
            })
        }
    }
}
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
