<template>
    <div>
        <b-container class="mt-4">
            <b-row>
                <b-col md="4">
                    <MyProfileCard />
                </b-col>
                <b-col md="6">
                    <div v-for="(tweet, index) in tweets" :key="index">
                        <SingleTweet :tweet="tweet" :user="{firstName: 'John', lastName: 'Smith', handle: 'smitthy1123'}" />
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
    name: 'ProfileView',
    components: {
        MyProfileCard,
        SingleTweet
    },
    data() {
        return {
            tweets: []
        }
    },
    methods: {
        async getMyTweets() {
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
        this.getMyTweets();
    }
}
</script>