<template>
    <div>
        <b-container class="mt-4">
            <b-row>
                <b-col md="5">
                    <ProfileCard :user="myProfile" extended/>
                </b-col>
                <b-col md="7">
                    <TweetsContainer :tweets="myProfile.tweets" />
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