<template>
    <div>
        <b-container class="mt-4">
            <b-row>
                <b-col md="5">
                    <ProfileCard :user="myProfile" />
                </b-col>
                <b-col md="7">
                    <div v-for="tweet in myProfile.tweets" :key="tweet.id">
                        <SingleTweet :tweet="tweet" />
                    </div>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
import { GET_MYSELF_QUERY } from '@/gql';

export default {
    name: 'MyProfileView',
    data() {
        return {
            myProfile: {}
        }
    },
    apollo: {
        myProfile: {
            query: GET_MYSELF_QUERY,
            update: data => data.getMyself
        }
    }
}
</script>