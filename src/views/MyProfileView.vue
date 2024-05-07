<template>
    <div>
        <b-container v-if="myProfile && myProfile.tweets" class="mt-4">
            <b-row>
                <b-col md="5">
                    <ProfileCard class="mb-4" :user="myProfile" extended/>
                    <FollowRecommendations :numberOfRecommendations=5 />
                </b-col>
                <b-col md="7">
                    <TweetsContainer :tweets="myProfile.tweets" title="My tweets" :tweetCount="myProfile.tweets.length" />
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
import { QUERY_MYSELF } from '@/gql';

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
            update: data => data.getMyself
        }
    }
}
</script>