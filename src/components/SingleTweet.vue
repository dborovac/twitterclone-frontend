<template>
	<b-card class="mb-2 mr-2">
		<router-link :to="{ name: 'Profile', params: { id: user.id } }" style="text-decoration: none; color: inherit;">
			<div class="d-flex flex-row mb-2 align-items-center">
				<div>
					<b-avatar size="md" variant="dark" rounded class="avatar-custom"></b-avatar>
				</div>
				<div class="ml-2">
					<h6 class="m-0">{{ user.firstName }} {{ user.lastName }}</h6>
					<p class="m-0 text-muted">@{{ user.handle }}</p>
				</div>
			</div>
		</router-link>
		<b-card-text>
			<span v-html="formatTweetContent(tweet.content, tweet.mentions)" @click.prevent="click"></span>
		</b-card-text>
		<b-card-footer class="d-flex justify-content-between">
			<div>
				<v-icon name="fa-regular-heart" scale="1.1" fill="#FF204E" class="mr-2"></v-icon>
				<v-icon name="hi-solid-reply" scale="1.1" fill="#222831"></v-icon>
			</div>
			<div>
				<small class="text-muted">{{ formatDateTime(tweet.postedAt) }}</small>
			</div>
		</b-card-footer>
	</b-card>
</template>

<script>
import { formatDateTime } from '@/dateUtils';

export default {
	name: 'SingleTweet',
	props: {
		tweet: Object,
		user: Object
	},
	methods: {
		formatDateTime,
		formatTweetContent(content, mentions) {
			mentions.forEach(mention => {
				content = content.replace('@' + mention.handle, '<a href="' + mention.id + '">@' + mention.handle + '</a>');
			});
			return content;
		},
		click(ev) {
			if (ev.target.tagName === 'A') {
				this.$router.push({ name: 'Profile', params: { id: ev.target.attributes.href.value } });
			}
		}
	}
};
</script>