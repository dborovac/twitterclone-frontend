<template>
    <b-container>
        <b-card>
            <h5 class="mb-3">🔥 Trending topics</h5>
            <span v-for="(topic, index) in trendingTopics" :key="topic.hashtagName">
                <router-link :to="{ name: 'Hashtag', params: { hashtag: topic.hashtagName, title: topic.hashtagName } }">{{ topic.hashtagName }}</router-link>
                <span v-if="!isLastTopic(index)" style="word-break: break-all;">&nbsp;&nbsp;•&nbsp;&nbsp;</span>
            </span>
        </b-card>
    </b-container>
</template>

<script>
import { QUERY_TOP_HASHTAG_OCCURRENCES } from '@/gql';

export default {
    name: 'TrendingTopics',
    apollo: {
        trendingTopics: {
            query: QUERY_TOP_HASHTAG_OCCURRENCES,
            variables: {
                top: 10
            },
            update: data => data.topHashtagOccurrences
        }
    },
    methods: {
        isLastTopic(index) {
            return index === Object.keys(this.trendingTopics).length - 1;
        }
    }
}
</script>
