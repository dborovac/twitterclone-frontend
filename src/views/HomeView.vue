<template>
    <div>
        <b-container class="mt-4">
            <b-row>
                <b-col md="5">
                    <ProfileCard class="mb-4" :user="myProfile" />
                    <TrendingTopics />
                </b-col>
                <b-col md="7">
                    <b-card class="mb-4">
                        <PostTweetForm />
                    </b-card>

                    <b-card class="mb-5" no-body>
                        <b-card-header header-tag="nav">
                            <b-nav card-header tabs v-model="activeTab">
                                <b-nav-item :eventKey="1" @click="activeTab = 1" :active="activeTab === 1"><span style="color: #212529">Following</span></b-nav-item>
                                <b-nav-item :eventKey="2" @click="activeTab = 2" :active="activeTab === 2"><span style="color: #212529">My tweets</span></b-nav-item>
                            </b-nav>
                        </b-card-header>

                        <b-card-body v-if="activeTab === 1">
                            <div class="tweets-container" v-infinite-scroll="onScrolledToBottom" infinite-scroll-immediate-check="false">
                                <div v-for="tweet in followeeTweets" :key="tweet.id">
                                    <SingleTweet :tweet="tweet" />
                                </div>
                            </div>
                            <div class="text-center" v-if="followeeTweets.length === 0">Nothing here</div>
                        </b-card-body>

                        <b-card-body v-if="activeTab === 2">
                            <div class="tweets-container">
                                <div v-for="tweet in myProfile.tweets" :key="tweet.id">
                                    <SingleTweet :tweet="tweet" />
                                </div>
                            </div>
                            <div class="text-center" v-if="myProfile.tweets.length === 0">Nothing here</div>
                        </b-card-body>
                    </b-card>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
import { QUERY_MYSELF, QUERY_FOLLOWEE_TWEETS } from '@/gql';

export default {
    name: 'HomeView',
    data() {
        return {
            myProfile: {},
            followeeTweets: [],
            activeTab: 1,
            first: 5,
            offset: 0
        }
    },
    apollo: {
        followeeTweets: {
            query: QUERY_FOLLOWEE_TWEETS,
            variables() {
                return {
                    first: this.first,
                    offset: this.offset
                }
            }
        },
        myProfile: {
            query: QUERY_MYSELF,
            update: data => data.getMyself
        }
    },
    methods: {
        onScrolledToBottom() {
            this.$apollo.queries.followeeTweets.fetchMore({
                variables: {
                    first: this.first,
                    offset: this.followeeTweets.length
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