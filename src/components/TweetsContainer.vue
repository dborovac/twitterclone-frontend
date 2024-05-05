<template>
    <div>
        <b-card v-if="tweets.length > 0" title="My tweets card" class="mb-5" no-body>
            <b-card-header v-if="title">
                <h5 class="m-0 d-inline">{{ title }}</h5>
                <div v-if="tweetCount" class="d-inline">
                    <span class="ml-2">•</span>
                    <span class="ml-2">{{ tweetCount }} tweets</span>
                </div>
            </b-card-header>
            <b-card-body>
                <div v-for="tweet in tweets" :key="tweet.id">
                    <SingleTweet :tweet="tweet" />
                </div>
            </b-card-body>
        </b-card>
        <b-card v-else>
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
        tweetCount: Number
    }
}
</script>
