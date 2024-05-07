<template>
    <b-form @submit.prevent="postTweet">
        <b-form-group>
            <VueMentionable :keys="['@']" :items="mentionableUsers" @search="searchHandles($event)" offset="6" insert-space>
                <b-form-textarea id="tweetText" v-model="tweetText" placeholder="What's happening" rows="3" maxlength="320" spellcheck="false" required></b-form-textarea>
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
            </VueMentionable>
        </b-form-group>
        <b-button type="submit" variant="dark">Tweet</b-button>
        <small class="text-muted ml-3">{{ tweetText.length }}/320</small>
    </b-form>
</template>

<script>
import gql from 'graphql-tag';
import { QUERY_MYSELF, MUTATION_POST_TWEET } from '@/gql';

const SEARCH_USERS_BY_HANDLE_QUERY = gql`
    query($handle: String!) {
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
    name: 'PostTweetForm',
    data() {
        return {
            tweetText: '',
            mentionableUsers: [],
            loadingMentionableUsers: false
        };
    },
    methods: {
        async queryUsersByHandle(handle) {
            this.$apollo.query({
                query: SEARCH_USERS_BY_HANDLE_QUERY,
                variables: {
                    handle: handle
                },
            }).then((response) => this.mentionableUsers = response.data.searchUsersByHandle.map(obj => ({ key: obj.handle, value: obj.handle, firstName: obj.firstName, lastName: obj.lastName })));
        },
        postTweet() {
            this.$apollo.mutate({
                mutation: MUTATION_POST_TWEET,
                variables: {
                    content: this.tweetText
                },
                update: (store, { data: { postTweet } }) => {
                    let data = store.readQuery({ query: QUERY_MYSELF });
                    data.getMyself.tweets.unshift(postTweet);
                    store.writeQuery({ query: QUERY_MYSELF, data });
                }
            }).then(() => this.tweetText = '');
        },
        async searchHandles(searchText) {
            this.loadingMentionableUsers = true;
            await this.queryUsersByHandle(searchText);
            this.loadingMentionableUsers = false;
        }
    }
};
</script>

<style>
.mention-item {
    padding: 4px 10px;
    border-radius: 4px;
}

.mention-selected {
    background: rgb(235, 238, 238);
}
</style>
