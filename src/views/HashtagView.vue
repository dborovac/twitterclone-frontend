<template>
    <div>
        <b-container v-if="myProfile && tweetsTaggedWith" class="mt-4">
            <b-row>
                <b-col md="5">
                    <ProfileCard class="mb-4" :user="myProfile" />
                    <TrendingTopics />
                </b-col>
                <b-col md="7">
                    <TweetsContainer :tweets="tweetsTaggedWith" :title="this.$route.params.hashtag" :tweetCount="tweetCount" />
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
import { QUERY_MYSELF, QUERY_TWEETS_TAGGED_WITH, QUERY_TREND_FOR_HASHTAG } from '@/gql';

export default {
    name: 'HashtagView',
    data() {
        return {
            myProfile: {}
        }
    },
    apollo: {
        myProfile: {
            query: QUERY_MYSELF,
            update: data => data.getMyself
        },
        tweetsTaggedWith: {
            query: QUERY_TWEETS_TAGGED_WITH,
            variables() {
                return {
                    hashtag: this.$route.params.hashtag
                }
            },
            update: data => data.taggedWith
        },
        tweetCount: {
            query: QUERY_TREND_FOR_HASHTAG,
            variables() {
                return {
                    hashtag: this.$route.params.hashtag
                }
            },
            update: data => data.trendForHashtag.tweetCount
        }
    }
}
</script>