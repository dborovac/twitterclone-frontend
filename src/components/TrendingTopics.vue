<template>
    <b-container>
        <b-card>
            <h5 class="mb-3">🔥 Trending topics</h5>
            <span v-for="(topic, index) in trendingTopics" :key="topic">
                <a style="display: inline;" href="#">#{{ topic }}</a>
                <span v-if="!isLastTopic(index)" style="word-break: break-all;">&nbsp;&nbsp;•&nbsp;&nbsp;</span>
            </span>
        </b-card>
    </b-container>
</template>

<script>
export default {
    name: 'TrendingTopics',
    data() {
        return {
            trendingTopics: ['politics', 'football', 'easter', 'europe', 'superbowl', 'education', 'technology', 'elections', 'gym', 'youtube', 'TikTokBan']
        }
    },
    methods: {
        isLastTopic(index) {
            return index === Object.keys(this.trendingTopics).length - 1;
        }
    }
}
</script>
