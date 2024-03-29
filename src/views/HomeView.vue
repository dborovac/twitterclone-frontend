<template>
    <div>
        <b-container class="mt-4">
            <b-row>
                <b-col md="4">
                    <MyProfileCard />
                </b-col>
                <b-col md="7">
                    <b-card class="mb-4">
                        <b-form @submit.prevent="postTweet">
                            <b-form-group>
                                <Mentionable :keys="['@']" :items="mentionableUsers" @apply="onApply($event)" @search="searchHandles($event)"
                                    offset="6" insert-space filtering-disabled>
                                    <b-form-textarea id="tweetText" v-model="tweetText" placeholder="What's happening"
                                        rows="3" maxlength="320" spellcheck="false" required></b-form-textarea>
                                    <template #item-@="{ item }">
                                        <div class="d-flex flex-row p-1">
                                            <div>
                                                <b-avatar size="md" variant="dark" rounded class="avatar-custom"></b-avatar>
                                            </div>
                                            <div class="ml-2">
                                                <h6 class="m-0">{{ item.firstName }} {{ item.lastName }}</h6>
                                                <p class="m-0 text-muted">@{{ item.key }}</p>
                                            </div>
                                        </div>
                                    </template>
                                    <template #no-result>
                                        <div class="p-1">
                                            {{ loadingMentionableUsers ? 'Loading...' : 'No result' }}
                                        </div>
                                    </template>
                                </Mentionable>
                            </b-form-group>
                            <b-button type="submit" variant="dark">Tweet</b-button>
                            <small class="text-muted ml-3">{{ tweetText.length }}/320</small>
                        </b-form>
                    </b-card>
                    <template v-if="$apollo.queries.tweets.loading">
                        <div class="d-flex justify-content-center">
                            <b-spinner variant="info"></b-spinner>
                        </div>
                    </template>
                    <template v-else>
                        <div class="tweets-container mb-5">
                            <div v-for="tweet in tweets" :key="tweet.id">
                                <SingleTweet :tweet="tweet"
                                    :user="{ firstName: 'John', lastName: 'Smith', handle: 'smitthy1123' }" />
                            </div>
                        </div>
                    </template>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
import gql from 'graphql-tag';
import MyProfileCard from '@/components/MyProfileCard.vue';
import SingleTweet from '@/components/SingleTweet.vue';
import { Mentionable } from 'vue-mention';

const GET_TWEETS_QUERY = gql`
    query GetMyTweets {
        tweets: getMyTweets {
            id
            content
            postedAt
        }
    }
`;

const POST_TWEET_MUTATION = gql`
    mutation PostTweet($content: String!) {
        postTweet(request: { content: $content }) {
            id
            content
            postedAt
        }
    }
`;

const SEARCH_USERS_BY_HANDLE_QUERY = gql`
    query SearchUsersByHandle($handle: String!) {
        searchUsersByHandle(handle: $handle) {
            id
            email
            handle
            firstName
            lastName
        }
    }
`;

export default {
    name: 'HomeView',
    components: {
        MyProfileCard,
        SingleTweet,
        Mentionable
    },
    data() {
        return {
            tweets: [],
            tweetText: '',
            mentionableUsers: [],
            loadingMentionableUsers: false
        }
    },
    apollo: {
        tweets: {
            query: GET_TWEETS_QUERY
        }
    },
    methods: {
        async queryUsersByHandle(handle) {
            this.$apollo.query({
                query: SEARCH_USERS_BY_HANDLE_QUERY,
                variables: {
                    handle: handle
                }
            }).then((response) => this.mentionableUsers = response.data.searchUsersByHandle.map(obj => ({ key: obj.handle, value: obj.handle, firstName: obj.firstName, lastName: obj.lastName })));
        },
        postTweet() {
            this.$apollo.mutate({
                mutation: POST_TWEET_MUTATION,
                variables: {
                    content: this.tweetText
                },
                update: (store, { data: { postTweet } }) => {
                    let data = store.readQuery({ query: GET_TWEETS_QUERY });
                    data = {
                        ...data,
                        tweets: [
                            postTweet,
                            ...data.tweets
                        ]
                    };
                    store.writeQuery({ query: GET_TWEETS_QUERY, data });
                }
            }).then(() => this.tweetText = '')
        },
        async searchHandles(searchText) {
            this.loadingMentionableUsers = true;
            await this.queryUsersByHandle(searchText);
            this.loadingMentionableUsers = false;
        },
        onApply(mention) {
            const fullMention = '@' + mention.key;
            const newTweetText = this.tweetText.replace(fullMention, '<span style="color: red;">' + fullMention + '</span>');
            this.tweetText = newTweetText;
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

.mention-item {
    padding: 4px 10px;
    border-radius: 4px;
}

.mention-selected {
    background: rgb(235, 238, 238);
}
</style>