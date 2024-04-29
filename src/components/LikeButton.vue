<template>
    <div @click="onLike" class="d-inline">
        <span :id="`popover-target-${tweet.id}`" class="mr-5">
            <v-icon :name="tweet.likedByMe ? 'fa-heart' : 'fa-regular-heart'" fill="#FF204E"></v-icon>
            {{ tweet.likedBy.length }}
        </span>
        <b-popover v-if="tweet.likedBy.length > 0" :target="`popover-target-${tweet.id}`" triggers="hover" title="Liked by">
            <div v-for="like in tweet.likedBy" :key="like.id">
                <b>{{ like.firstName + ' ' + like.lastName }}</b> @{{ like.handle }}
            </div>
            <a href="#" @click="$bvModal.show(`bv-modal-liked-by-list-${tweet.id}`)">Show all</a>
        </b-popover>
        <b-modal :id="`bv-modal-liked-by-list-${tweet.id}`" hide-footer scrollable>
            <template #modal-title>People who like this tweet</template>
            <div v-for="like in tweet.likedBy" :key="like.id">
                <CompactProfileInfo :userId="like.id" :withFollowButton="true" size="md"/>
            </div>
        </b-modal>
    </div>
</template>

<script>
import { GET_MYSELF_QUERY } from '@/gql';
import gql from 'graphql-tag';

const LIKE_TWEET_MUTATION = gql`
    mutation LikeTweet($tweetId: String!) {
        toggleLike(tweetId: $tweetId) {
            likedByMe
        }
    }
`;

const LIKED_BY_ME_FRAGMENT = gql`
    fragment LikedByMeFragment on Tweet {
        likedByMe
    }
`;

const LIKED_BY_FRAGMENT = gql`
    fragment LikedByFragment on Tweet {
        likedBy {
            id
            handle
            firstName
            lastName
        }
    }
`;

export default {
    name: 'LikeButton',
    props: {
        tweet: Object
    },
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
                    store.writeFragment({
                        id: cachedTweetId,
                        fragment: LIKED_BY_ME_FRAGMENT,
                        data: {
                            likedByMe: likedByMe,
                            __typename: __typename
                        }
                    });
                    let likes = store.readFragment({
                        id: cachedTweetId,
                        fragment: LIKED_BY_FRAGMENT
                    });
                    let updatedLikes;
                    if (likedByMe) {
                        updatedLikes = [...likes.likedBy, this.myProfile];
                    } else {
                        updatedLikes = likes.likedBy.filter(obj => obj.id !== this.myProfile.id);
                    }
                    store.writeFragment({
                        id: cachedTweetId,
                        fragment: LIKED_BY_FRAGMENT,
                        data: {
                            likedBy: updatedLikes,
                            __typename: __typename
                        }
                    });
                }
            });
        }
    }
}
</script>