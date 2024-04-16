<template>
    <div>
        <b-container class="mt-4">
            <b-row>
                <b-col md="5">
                    <ProfileCard :user="profile" />
                </b-col>
                <b-col md="7">
                    <b-card class="mb-4">
                        <PostTweetForm />
                    </b-card>

                    <b-card title="Tweets card" no-body>
                        <b-card-header header-tag="nav">
                            <b-nav card-header tabs v-model="activeTab">
                                <b-nav-item :eventKey="1" @click="activeTab = 1" :active="activeTab === 1 ? true : false">Following</b-nav-item>
                                <b-nav-item :eventKey="2" @click="activeTab = 2" :active="activeTab === 2 ? true : false">My tweets</b-nav-item>
                            </b-nav>
                        </b-card-header>

                        <b-card-body v-if="activeTab === 1" class="mb-4">
                            <div class="tweets-container mb-5" v-infinite-scroll="showMoreFolloweeTweets" infinite-scroll-immediate-check="false">
                                <div v-for="tweet in followeeTweets" :key="tweet.id">
                                    <SingleTweet :tweet="tweet" :user="tweet.postedBy" />
                                </div>
                            </div>
                        </b-card-body>

                        <b-card-body v-if="activeTab === 2" class="mb-4">
                            <div class="tweets-container mb-5">
                                <div v-for="tweet in myTweets" :key="tweet.id">
                                    <SingleTweet :tweet="tweet" :user="tweet.postedBy" />
                                </div>
                            </div>
                        </b-card-body>
                    </b-card>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
import gql from 'graphql-tag';
import ProfileCard from '@/components/ProfileCard.vue';
import SingleTweet from '@/components/SingleTweet.vue';
import PostTweetForm from '@/components/PostTweetForm.vue';

const GET_FOLLOWEE_TWEETS_QUERY = gql`
    query FolloweeTweets($cursorTimestamp: String) {
        followeeTweets(cursorTimestamp: $cursorTimestamp) {
            id
            content
            postedAt
            postedBy {
                id
                handle
                firstName
                lastName
            }
            mentions {
                id
                handle
                firstName
                lastName
            }
        }
    }
`;

const GET_MY_PROFILE_QUERY = gql`
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
        }
    }
`;

const GET_MY_TWEETS_QUERY = gql`
    query GetMyTweets {
        myTweets {
            id
            content
            postedAt
            postedBy {
                id
                handle
                firstName
                lastName
            }
            mentions {
                id
                handle
                firstName
                lastName
            }
        }
    }
`;

export default {
    name: 'HomeView',
    components: {
        ProfileCard,
        SingleTweet,
        PostTweetForm
    },
    computed: {
        profile() {
            return this.$store.getters.getProfile;
        }
    },
    data() {
        return {
            followeeTweets: [],
            myTweets: [],
            activeTab: 1
        }
    },
    apollo: {
        followeeTweets: {
            query: GET_FOLLOWEE_TWEETS_QUERY
        },
        myTweets: {
            query: GET_MY_TWEETS_QUERY
        }
    },
    methods: {
        async fetchMyProfile() {
            await this.$apollo.query({
                query: GET_MY_PROFILE_QUERY
            }).then(response => this.$store.dispatch('updateProfile', response.data.getMyself));
        },
        showMoreFolloweeTweets() {
            this.$apollo.queries.followeeTweets.fetchMore({
                variables: {
                    cursorTimestamp: this.followeeTweets.slice(-1)[0].postedAt
                },
                updateQuery: (previousResult, { fetchMoreResult }) => {
                    const oldTweets = previousResult.followeeTweets;
                    const newTweets = fetchMoreResult.followeeTweets;
                    return {
                        followeeTweets: [...oldTweets, ...newTweets]
                    }
                }
            })
        }
    },
    mounted() {
        this.fetchMyProfile();
    }
};
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