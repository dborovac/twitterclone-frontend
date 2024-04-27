import gql from 'graphql-tag';

export const GET_USER_QUERY = gql`
    query GetUserById($userId: String!) {
        getUserById(userId: $userId) {
            id
            email
            firstName
            lastName
            handle
            birthday
            followers {
                id
                handle
                firstName
                lastName
            }
            followees {
                id
                handle
                firstName
                lastName
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
                postedBy {
                    id
                    handle
                    firstName
                    lastName
                }
                likedBy {
                    id
                    firstName
                    lastName
                    handle
                }
                likedByMe
            }
        }
    }
`;

export const GET_MYSELF_QUERY = gql`
    query GetMyself {
        getMyself {
            id
            email
            firstName
            lastName
            handle
            birthday
            followers {
                id
                handle
                firstName
                lastName
            }
            followees {
                id
                handle
                firstName
                lastName
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
                postedBy {
                    id
                    handle
                    firstName
                    lastName
                }
                likedBy {
                    id
                    firstName
                    lastName
                    handle
                }
                likedByMe
            }
        }
    }
`;

export const GET_FOLLOWEE_TWEETS_QUERY = gql`
    query FolloweeTweets($cursorTimestamp: String) {
        followeeTweets(cursorTimestamp: $cursorTimestamp) {
            id
            content
            postedAt
            mentions {
                id
                handle
                firstName
                lastName
            }
            postedBy {
                id
                handle
                firstName
                lastName
            }
            likedBy {
                id
                firstName
                lastName
                handle
            }
            likedByMe
        }
    }
`;
