<template>
    <div class="d-flex flex-row mb-4 align-items-center">
        <div class="flex-column">
            <b-avatar :size="size" variant="dark" rounded class="avatar-custom"></b-avatar>
        </div>
        <div class="ml-2 flex-column">
            <div v-if="user.handle !== myProfile.handle">
                <router-link v-if="user.id" :to="{ name: 'Profile', params: { id: user.id } }" style="text-decoration: none; color: inherit;">
                    <h6 v-if="size === 'md'" class="m-0">{{ user.firstName }} {{ user.lastName }}</h6>
                    <h5 v-if="size === 'lg'" class="m-0">{{ user.firstName }} {{ user.lastName }}</h5>
                    <p class="m-0 text-muted">@{{ user.handle }}</p>
                </router-link>
            </div>
            <div v-else>
                <h6 v-if="size === 'md'" class="m-0">{{ user.firstName }} {{ user.lastName }}</h6>
                <h5 v-if="size === 'lg'" class="m-0">{{ user.firstName }} {{ user.lastName }}</h5>
                <p class="m-0 text-muted">@{{ user.handle }}</p>
            </div>
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
import { GET_MYSELF_QUERY, GET_USER_QUERY } from '@/gql';

const FOLLOW_MUTATION = gql`
    mutation Follow($userId: String!) {
        follow(userId: $userId) {
            followers {
                id
                handle
            }
        }
    }
`;

const UNFOLLOW_MUTATION = gql`
    mutation Unfollow($userId: String!) {
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
        withFollowButton: Boolean,
        size: String
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
            query: GET_MYSELF_QUERY,
            update: data => data.getMyself
        },
        user: {
            query: GET_USER_QUERY,
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