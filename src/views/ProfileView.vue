<template>
    <div>
        <b-container class="mt-4">
            <b-row>
                <b-col md="8" class="offset-md-2">
                    <b-card v-for="(tweet, index) in tweets" :key="index" class="mb-2">
                        <b-card-text>{{ tweet.content }}</b-card-text>
                        <b-card-footer>
                            <small class="text-muted">Posted by *MYSELF* on {{ tweet.postedAt }}</small>
                        </b-card-footer>
                    </b-card>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
import gql from 'graphql-tag';

export default {
    name: 'ProfileView',
    data() {
        return {
            tweets: []
        }
    },
    methods: {
        async getMyProfile() {
            await this.$apollo.provider.defaultClient.query({
                query: gql`
                    query GetMyself {
                        getMyself {
                            id
                            handle
                            tweets {
                                content
                                postedAt
                            }
                        }
                    }
                `,
                context: {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            }).then(response => console.log(response))
        }
    },
    mounted() {
        this.getMyProfile();
    }
}
</script>