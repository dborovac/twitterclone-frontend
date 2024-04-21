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
            }
            followees {
                id
                handle
            }
            tweets {
                id
                content
                postedAt
                mentions {
                    id
                    handle
                }
            }
        }
    }
`;