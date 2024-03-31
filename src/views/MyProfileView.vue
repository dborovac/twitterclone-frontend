<template>
    <div>
        <b-container class="mt-4">
            <b-row>
                <b-col md="5">
                    <ProfileCard :user="profile" />
                </b-col>
                <b-col md="7">
                    <div v-for="tweet in tweets" :key="tweet.id">
                        <SingleTweet :tweet="tweet" :user="profile" />
                    </div>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
import gql from 'graphql-tag';
import ProfileCard from '@/components/ProfileCard.vue';
import SingleTweet from '@/components/SingleTweet.vue';

export default {
    name: 'MyProfileView',
    components: {
        ProfileCard,
        SingleTweet
    },
    data() {
        return {
            tweets: []
        }
    },
    computed: {
        profile() {
            return this.$store.getters.getProfile;
        }
    },
    methods: {
        async fetchMyProfile() {
            await this.$apollo.provider.defaultClient.query({
                query: gql`
                    query GetMyself {
                        getMyself {
                            id
                            email
                            firstName
                            lastName
                            handle
                            followers {
                                id
                                handle
                            }
                            followees {
                                id
                                handle
                            }
                            tweets {
                                id
                                content
                                postedAt
                                mentions {
                                    id
                                    handle
                                    firstName
                                    lastName
                                }
                            }
                        }
                    }
                `
            }).then(response => {
                this.$store.dispatch('updateProfile', response.data.getMyself);
                this.tweets = response.data.getMyself.tweets;
            });
        }
    },
    mounted() {
        this.fetchMyProfile();
    }
}
</script>