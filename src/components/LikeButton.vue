<template>
    <div class="d-inline">
        <span :id="`popover-target-${tweet.id}`" @click="onLike" style="cursor: pointer;">
            <v-icon :name="tweet.likedByMe ? 'fa-heart' : 'fa-regular-heart'" fill="#FF204E"></v-icon>
            {{ tweet.numberOfLikes }}
        </span>
        <b-popover v-if="tweet.numberOfLikes > 0" :target="`popover-target-${tweet.id}`" triggers="hover"
            title="Liked by">
            <div v-for="like in tweet.likedBy" :key="like.id">
                <b>{{ like.firstName + ' ' + like.lastName }}</b> @{{ like.handle }}
            </div>
            <a href="#" @click="$bvModal.show(`bv-modal-liked-by-list-${tweet.id}`)">Show all</a>
        </b-popover>
        <b-modal :id="`bv-modal-liked-by-list-${tweet.id}`" hide-footer scrollable>
            <template #modal-title>People who like this tweet</template>
            <div v-for="like in tweet.likedBy" :key="like.id">
                <CompactProfileInfo class="mb-3" :userId="like.id" size="md" withFollowButton />
            </div>
            <a v-if="showLoadMoreButton" href="#" @click="onLoadMore">⟲ Load more</a>
        </b-modal>
    </div>
</template>

<script>
import { QUERY_MYSELF, FRAGMENT_BASIC_USER_DATA } from '@/gql';
import gql from 'graphql-tag';

const LIKE_TWEET_MUTATION = gql`
    mutation($tweetId: String!) {
        toggleLike(tweetId: $tweetId) {
            likedByMe
        }
    }
`;

const LIKES_FRAGMENT = gql`
    fragment LikesFragment on Tweet {
        likedBy(pageRequest: { first: 10, offset: 0 }) {
            ...BasicUserData
        }
        likedByMe
        numberOfLikes
    }
    ${FRAGMENT_BASIC_USER_DATA}
`;

const LIKED_BY_FRAGMENT = gql`
    fragment LikedByFragment on Tweet {
        likedBy(pageRequest: { first: 10, offset: 0 }) {
            ...BasicUserData
        }
    }
    ${FRAGMENT_BASIC_USER_DATA}
`;

export default {
    name: 'LikeButton',
    props: {
        tweet: Object
    },
    data() {
        return {
            myProfile: {},
            showLoadMoreButton: true
        }
    },
    apollo: {
        myProfile: {
            query: QUERY_MYSELF,
            update: data => data.getMyself
        }
    },
    methods: {
        onLike() {
            this.$apollo.mutate({
                mutation: LIKE_TWEET_MUTATION,
                variables: {
                    tweetId: this.tweet.id
                },
                update: (store, { data: { toggleLike: { likedByMe, __typename } } }) => {
                    const cachedTweetId = `${__typename}:${this.tweet.id}`;
                    let likes = store.readFragment({
                        id: cachedTweetId,
                        fragment: LIKES_FRAGMENT,
                        fragmentName: 'LikesFragment'
                    });
                    let updatedNumberOfLikes;
                    let updatedLikedBy;
                    if (likedByMe) {
                        updatedNumberOfLikes = likes.numberOfLikes + 1;
                        updatedLikedBy = [this.myProfile, ...likes.likedBy];
                    } else {
                        updatedNumberOfLikes = likes.numberOfLikes - 1;
                        updatedLikedBy = likes.likedBy.filter(obj => obj.id !== this.myProfile.id);
                    }
                    store.writeFragment({
                        id: cachedTweetId,
                        fragment: LIKES_FRAGMENT,
                        fragmentName: 'LikesFragment',
                        data: {
                            likedBy: updatedLikedBy,
                            numberOfLikes: updatedNumberOfLikes,
                            likedByMe: likedByMe,
                            __typename: __typename
                        }
                    });
                }
            });
        },
        onLoadMore() {
            this.$apollo.query({
                query: gql`
                    query {
                        tweetById(id: "${this.tweet.id}") {
                            likedBy(pageRequest: { first: 2, offset: ${this.tweet.likedBy.length} }) {
                                ...BasicUserData
                            }
                        }
                    }
                    ${FRAGMENT_BASIC_USER_DATA}
                `
            }).then((response) => {
                if (response.data.tweetById.likedBy.length === 0) {
                    this.showLoadMoreButton = false;
                    return;
                }
                const cachedTweetId = `Tweet:${this.tweet.id}`;
                let likes = this.$apollo.provider.defaultClient.cache.readFragment({
                    id: cachedTweetId,
                    fragment: LIKED_BY_FRAGMENT,
                    fragmentName: 'LikedByFragment'
                });
                let updatedLikedBy = [...likes.likedBy, ...response.data.tweetById.likedBy];
                this.$apollo.provider.defaultClient.cache.writeFragment({
                        id: cachedTweetId,
                        fragment: LIKED_BY_FRAGMENT,
                        fragmentName: 'LikedByFragment',
                        data: {
                            likedBy: updatedLikedBy,
                            __typename: 'Tweet'
                        }
                    });
            });
        }
    }
}
</script>