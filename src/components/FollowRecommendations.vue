<template>
    <b-container>
        <b-card>
            <h5 class="mb-4">Who to follow</h5>
            <div v-for="(obj, index) in recommendations" :key="index">
                <div class="p-3 mb-2 border">
                    <CompactProfileInfo class="mb-1" :userId="obj.recommendation.id" size="md" withFollowButton />
                    •&nbsp;<small v-html="youBothFollowText(obj.mutualFollowees, obj.recommendation)" @click.prevent="click" class="text-muted"></small>
                </div>
                <b-modal :id="`bv-modal-mutual-followees-${obj.recommendation.id}`" hide-footer scrollable>
                    <template #modal-title>You both follow</template>
                    <div v-for="mutual in obj.mutualFollowees" :key="mutual.id">
                        <CompactProfileInfo class="mb-3" :userId="mutual.id" size="md" withFollowButton />
                    </div>
                </b-modal>
            </div>
        </b-card>
    </b-container>
</template>

<script>
import { QUERY_FOLLOW_RECOMMENDATIONS } from '@/gql';

export default {
    name: 'FollowRecommendations',
    props: {
        numberOfRecommendations: Number
    },
    data() {
        return {
            recommendations: []
        }
    },
    apollo: {
        recommendations: {
            query: QUERY_FOLLOW_RECOMMENDATIONS,
            variables() {
                return {
                    first: this.numberOfRecommendations
                }
            },
            update: data => data.followRecommendations
        }
    },
    methods: {
        youBothFollowText(mutualFollowees, recommendation) {
            const firstFollowee = mutualFollowees[0];
            const othersCount = mutualFollowees.length - 1;
            const firstFolloweeLink = `<a href="${firstFollowee.id}" data-type="first-followee" data-title="${firstFollowee.firstName} ${firstFollowee.lastName} @${firstFollowee.handle}">${firstFollowee.firstName}</a>`;
            const othersLink = `<a href="${recommendation.id}" data-type="others">${othersCount} other${othersCount != 1 ? 's' : ''}</a>`;
            if (othersCount === 0) {
                return `You both follow ${firstFolloweeLink}`;
            }
            return `You both follow ${firstFolloweeLink} including ${othersLink}`;
        },
        click(ev) {
            const type = ev.target.getAttribute("data-type");
            const title = ev.target.getAttribute("data-title");
            if (type === 'first-followee') {
                this.$router.push({ name: 'Profile', params: { id: ev.target.attributes.href.value, title: title }});
            }
            if (type === 'others') {
                this.$bvModal.show(`bv-modal-mutual-followees-${ev.target.attributes.href.value}`);
            }
        }
    }
}
</script>
