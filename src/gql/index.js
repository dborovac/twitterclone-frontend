import gql from 'graphql-tag';

export const FRAGMENT_BASIC_USER_DATA = gql`
    fragment BasicUserData on User {
        id
        handle
        firstName
        lastName
    }
`;

export const FRAGMENT_USER_DATA = gql`
    fragment UserData on User {
        id
        email
        firstName
        lastName
        handle
        birthday
        followers {
            ...BasicUserData
        }
        followees {
            ...BasicUserData
        }
    }
    ${FRAGMENT_BASIC_USER_DATA}
`;

export const FRAGMENT_TWEET_DATA = gql`
    fragment TweetData on Tweet {
        id
        content
        postedAt
        postedBy {
            ...BasicUserData
        }
        mentions {
            ...BasicUserData
        }
        likedBy(pageRequest: { first: 10, offset: 0 }) {
            ...BasicUserData
        }
        likedByMe
        numberOfLikes
        hashtags {
            id
            name
        }
    }
    ${FRAGMENT_BASIC_USER_DATA}
`;

export const MUTATION_POST_TWEET = gql`
    mutation($content: String!) {
      postTweet(request: { content: $content }) {
        ...TweetData
      }
    }
    ${FRAGMENT_TWEET_DATA}
`;

export const QUERY_USER_BY_ID = gql`
    query($userId: String!) {
        getUserById(userId: $userId) {
            ...UserData
            tweets {
                ...TweetData
            }
        }
    }
    ${FRAGMENT_USER_DATA}
    ${FRAGMENT_TWEET_DATA}
`;

export const QUERY_MYSELF = gql`
    query {
        getMyself {
            ...UserData
            tweets {
                ...TweetData
            }
        }
    }
    ${FRAGMENT_USER_DATA}
    ${FRAGMENT_TWEET_DATA}
`;

export const QUERY_FOLLOWEE_TWEETS = gql`
    query($pageRequest: PageRequest!) {
        followeeTweets(pageRequest: $pageRequest) {
            ...TweetData
        }
    }
    ${FRAGMENT_TWEET_DATA}
`;

export const QUERY_TWEETS_TAGGED_WITH = gql`
    query($hashtag: String!) {
        taggedWith(hashtag: $hashtag) {
            ...TweetData
        }
    }
    ${FRAGMENT_TWEET_DATA}
`;

export const QUERY_TREND_FOR_HASHTAG = gql`
    query($hashtag: String!) {
        trendForHashtag(hashtag: $hashtag) {
            hashtag {
                id
                name
            }
            tweetCount
        }
    }
`;

export const QUERY_FOLLOW_RECOMMENDATIONS = gql`
    query($first: Int!) {
        followRecommendations(first: $first) {
            recommendation {
                ...BasicUserData
            }
            relevance
            mutualFollowees {
                ...BasicUserData
            }
        }
    }
    ${FRAGMENT_BASIC_USER_DATA}
`;

export const QUERY_TOP_HASHTAG_OCCURRENCES = gql`
    query($top: Int!) {
        topHashtagOccurrences(top: $top) {
            hashtagName
            occurrences
        }
    }
`;
