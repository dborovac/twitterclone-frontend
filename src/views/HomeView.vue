<template>
    <div>
        <b-container class="mt-4">
            <b-row>
                <b-col md="5">
                    <ProfileCard class="mb-4" :user="myProfile" />
                    <TrendingTopics class="mb-4" />
                    <FollowRecommendations :numberOfRecommendations=5 />
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
                            <TweetsContainer :tweets="followeeTweets" :tweetsQuery="this.$apollo.queries.followeeTweets" divOnly />
                        </b-card-body>

                        <b-card-body v-if="activeTab === 2">
                            <TweetsContainer :tweets="myTweets" :tweetsQuery="this.$apollo.queries.myTweets" divOnly />
                        </b-card-body>
                    </b-card>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
import { QUERY_MYSELF, QUERY_FOLLOWEE_TWEETS, QUERY_MY_TWEETS } from '@/gql';

export default {
    name: 'HomeView',
    data() {
        return {
            myProfile: {},
            followeeTweets: [],
            activeTab: 1,
            first: 10,
            offset: 0
        }
    },
    apollo: {
        followeeTweets: {
            query: QUERY_FOLLOWEE_TWEETS,
            variables() {
                return {
                    pageRequest: {
                        first: this.first,
                        offset: this.offset
                    }
                }
            }
        },
        myProfile: {
            query: QUERY_MYSELF,
            update: data => data.getMyself
        },
        myTweets: {
            query: QUERY_MY_TWEETS,
            variables() {
                return {
                    pageRequest: {
                        first: this.first,
                        offset: this.offset
                    }
                }
            }
        }
    }
};
</script>
