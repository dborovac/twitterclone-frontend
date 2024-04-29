<template>
    <div>
        <b-card v-if="tweets.length > 0" title="My tweets card" class="mb-5" no-body>
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
        tweets: Array
    }
}
</script>
