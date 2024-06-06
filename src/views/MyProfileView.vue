<template>
    <div>
        <b-container v-if="myProfile && myTweets" class="mt-4">
            <b-row>
                <b-col md="5">
                    <ProfileCard class="mb-4" :user="myProfile" extended/>
                    <FollowRecommendations :numberOfRecommendations=5 />
                </b-col>
                <b-col md="7">
                    <TweetsContainer :tweets="myTweets" title="My tweets" :tweetCount="myTweets.length" :tweetsQuery="this.$apollo.queries.myTweets" />
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
import { QUERY_MYSELF, QUERY_MY_TWEETS } from '@/gql';

export default {
    name: 'MyProfileView',
    data() {
        return {
            myProfile: {}
        }
    },
    apollo: {
        myProfile: {
            query: QUERY_MYSELF,
            update: data => data.getMyself,
        },
        myTweets: {
            query: QUERY_MY_TWEETS,
            variables() {
                return {
                    pageRequest: {
                        first: 10,
                        offset: 0
                    }
                }
            }
        }
    }
}
</script>