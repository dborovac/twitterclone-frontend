<template>
    <div class="d-flex flex-row align-items-center">
        <div class="flex-column">
            <b-avatar :size="size" variant="dark" rounded class="avatar-custom"></b-avatar>
        </div>
        <div class="ml-2 flex-column">
            <router-link v-if="user.id" :to="{ name: 'Profile', params: { id: user.id, title: `${user.firstName} ${user.lastName} @${user.handle}` } }" style="text-decoration: none; color: inherit;">
                <h6 v-if="size === 'md'" class="m-0">{{ user.firstName }} {{ user.lastName }}</h6>
                <h5 v-if="size === 'lg'" class="m-0">{{ user.firstName }} {{ user.lastName }}</h5>
                <p class="m-0 text-muted">@{{ user.handle }}</p>
            </router-link>
        </div>
        <div v-if="withFollowButton && user.handle !== myProfile.handle" class="flex-column ml-auto">
            <b-button v-if="isUserInMyFollowees(myProfile.followees, user.id)" pill
                :variant="getAttributeBasedOnHover().variant" @click="onUnfollow(user.id)" @mouseover="isFollowButtonHovered = true"
                @mouseleave="isFollowButtonHovered = false">{{ getAttributeBasedOnHover().text }}</b-button>
            <b-button v-else @click="onFollow(user.id)" pill variant="info">Follow</b-button>
        </div>
    </div>
</template>

<script>
import gql from 'graphql-tag';
import { QUERY_MYSELF, QUERY_USER_BY_ID, QUERY_FOLLOW_RECOMMENDATIONS } from '@/gql';

const FOLLOW_MUTATION = gql`
    mutation($userId: String!) {
        follow(userId: $userId) {
            followers {
                id
                handle
            }
        }
    }
`;

const UNFOLLOW_MUTATION = gql`
    mutation($userId: String!) {
        unfollow(userId: $userId) {
            followers {
                id
                handle
            }
        }
    }
`;

const FOLLOWERS_FRAGMENT = gql`
    fragment FollowersFragment on User {
        followers {
            id
            handle
            firstName
            lastName
        }
    }
`;

const FOLLOWEES_FRAGMENT = gql`
    fragment FolloweesFragment on User {
        followees {
            id
            handle
            firstName
            lastName
        }
    }
`;

export default {
    name: 'CompactProfileInfo',
    props: {
        userId: String,
        size: String,
        withFollowButton: Boolean
    },
    data() {
        return {
            myProfile: {},
            user: {},
            isFollowButtonHovered: false
        }
    },
    apollo: {
        myProfile: {
            query: QUERY_MYSELF,
            update: data => data.getMyself
        },
        user: {
            query: QUERY_USER_BY_ID,
            variables() {
                return {
                    userId: this.userId
                }
            },
            skip() {
                return this.userId === undefined
            },
            update: data => data.getUserById
        }
    },
    methods: {
        onFollow(userId) {
            this.$apollo.mutate({
                mutation: FOLLOW_MUTATION,
                variables: {
                    userId: userId
                },
                update: (store, { data: { follow: { __typename } } }) => {
                    const cachedUserId = `${__typename}:${userId}`;
                    const cachedUser = store.readFragment({
                        id: cachedUserId,
                        fragment: FOLLOWERS_FRAGMENT
                    });
                    store.writeFragment({
                        id: cachedUserId,
                        fragment: FOLLOWERS_FRAGMENT,
                        data: {
                            followers: [...cachedUser.followers, {
                                id: this.myProfile.id,
                                handle: this.myProfile.handle,
                                firstName: this.myProfile.firstName,
                                lastName: this.myProfile.lastName,
                                __typename: __typename
                            }],
                            __typename: __typename
                        }
                    });

                    const myCachedUserId = `${__typename}:${this.myProfile.id}`;
                    const myCachedUser = store.readFragment({
                        id: myCachedUserId,
                        fragment: FOLLOWEES_FRAGMENT
                    });
                    store.writeFragment({
                        id: myCachedUserId,
                        fragment: FOLLOWEES_FRAGMENT,
                        data: {
                            followees: [...myCachedUser.followees, {
                                id: this.user.id,
                                handle: this.user.handle,
                                firstName: this.user.firstName,
                                lastName: this.user.lastName,
                                __typename: __typename
                            }],
                            __typename: __typename
                        }
                    });

                    let followRecommendations = store.readQuery({ query: QUERY_FOLLOW_RECOMMENDATIONS, variables: { first: 5 } });
                    console.log(followRecommendations);
                }
            });
        },
        onUnfollow(userId) {
            this.$apollo.mutate({
                mutation: UNFOLLOW_MUTATION,
                variables: {
                    userId: userId
                },
                update: (store, { data: { unfollow: { __typename } } }) => {
                    const cachedUserId = `${__typename}:${userId}`;
                    const cachedUser = store.readFragment({
                        id: cachedUserId,
                        fragment: FOLLOWERS_FRAGMENT
                    });
                    store.writeFragment({
                        id: cachedUserId,
                        fragment: FOLLOWERS_FRAGMENT,
                        data: {
                            followers: cachedUser.followers.filter(obj => obj.id !== this.myProfile.id),
                            __typename: __typename
                        }
                    });

                    const myCachedUserId = `${__typename}:${this.myProfile.id}`;
                    const myCachedUser = store.readFragment({
                        id: myCachedUserId,
                        fragment: FOLLOWEES_FRAGMENT
                    });
                    store.writeFragment({
                        id: myCachedUserId,
                        fragment: FOLLOWEES_FRAGMENT,
                        data: {
                            followees: myCachedUser.followees.filter(obj => obj.id !== userId),
                            __typename: __typename
                        }
                    });

                    let followRecommendationsData = store.readQuery({ query: QUERY_FOLLOW_RECOMMENDATIONS, variables: { first: 5 } });
                    followRecommendationsData.followRecommendations.forEach(obj => obj.mutualFollowees = obj.mutualFollowees.filter(followee => followee.id !== userId));
                    store.writeQuery({ query: QUERY_FOLLOW_RECOMMENDATIONS, variables: { first: 5 }, data: followRecommendationsData });
                }
            });
        },
        getAttributeBasedOnHover() {
            if (this.isFollowButtonHovered) {
                return {
                    text: 'Unfollow',
                    variant: 'info'
                }
            }
            return {
                text: 'Following',
                variant: 'outline-info'
            }
        },
        isUserInMyFollowees(myFollowees, userId) {
            return myFollowees && myFollowees.find(obj => obj.id === userId)
        }
    }
}
</script>