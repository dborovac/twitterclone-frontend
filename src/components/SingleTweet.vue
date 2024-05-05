<template>
	<b-card class="mb-2 mr-2">
		<router-link :to="{ name: 'Profile', params: { id: tweet.postedBy.id } }" style="text-decoration: none; color: inherit;">
			<div class="d-flex flex-row mb-2 align-items-center">
				<div>
					<b-avatar size="md" variant="dark" rounded class="avatar-custom"></b-avatar>
				</div>
				<div class="ml-2">
					<h6 class="m-0">{{ tweet.postedBy.firstName }} {{ tweet.postedBy.lastName }}</h6>
					<p class="m-0 text-muted">@{{ tweet.postedBy.handle }}</p>
				</div>
			</div>
		</router-link>
		<b-card-text>
			<span v-html="formatTweetContent(tweet.content, tweet.mentions, tweet.hashtags)" @click.prevent="click"></span>
		</b-card-text>
		<b-card-footer class="d-flex justify-content-between">
			<div>
				<LikeButton class="mr-1" :tweet="tweet" />
				<a id="reply-button" href="#" class="mr-4">
					<v-icon class="mr-1" name="hi-solid-reply" fill="#222831"></v-icon>
					Reply
				</a>
				<a id="share-button" href="#" @click="$bvModal.show(`bv-modal-share-tweet-${tweet.id}`)">
					<v-icon class="mr-1" name="bi-share-fill" fill="#222831"></v-icon>
					Share
				</a>
			</div>
			<div>
				<small class="text-muted">{{ formatDateTime(tweet.postedAt) }}</small>
			</div>
		</b-card-footer>
		<b-modal :id="`bv-modal-share-tweet-${tweet.id}`" hide-footer>
			<template #modal-title>Share this tweet</template>
			<div class="d-flex flex-column align-items-center">
				<div>
					<h5>Copy URL</h5>
				</div>
				<div class="mb-4">
					<b-input-group>
						<b-form-input :id="`popover-button-copy-tweet-${tweet.id}`" ref="urlInput" v-on:focus="onFocus($event)" readonly :value="tweetUrl"></b-form-input>
						<b-input-group-append>
							<b-button @click="copyUrl">
								<v-icon name="fa-clipboard-list" scale="1.1" fill="white"></v-icon>
							</b-button>
							<b-popover :target="`popover-button-copy-tweet-${tweet.id}`" :ref="`popover`" variant="success" triggers="focus" placement="bottom">
								✅ Copied to clipboard!
							</b-popover>
						</b-input-group-append>
					</b-input-group>
				</div>
				<div>
					<TwitterButton url="https://github.com" title="This is a tweet">
					</TwitterButton>
				</div>
				<div>
					<FacebookButton url="https://github.com" title="This is a tweet">
					</FacebookButton>
				</div>
				<div>
					<RedditButton url="https://github.com" title="This is a tweet">
					</RedditButton>
				</div>
				<div>
					<LinkedInButton url="https://github.com" title="This is a tweet">
					</LinkedInButton>
				</div>
			</div>
		</b-modal>
	</b-card>
</template>

<script>
import { formatDateTime } from '@/dateUtils';

export default {
	name: 'SingleTweet',
	props: {
		tweet: Object
	},
	computed: {
		tweetUrl() {
			return `localhost:3000/tweet/${this.tweet.id}`
		}
	},
	methods: {
		formatDateTime,
		formatTweetContent(content, mentions, hashtags) {
			mentions.forEach(mention => {
				content = content.replace('@' + mention.handle, '<a data-type="mention" href="' + mention.id + '">@' + mention.handle + '</a>');
			});
			hashtags.forEach(hashtag => {
				content = content.replace(hashtag.name, '<a data-type="hashtag" href="' + hashtag.name + '">' + hashtag.name + '</a>');
			});
			return content;
		},
		click(ev) {
			const type = ev.target.getAttribute("data-type");
			if (type === 'mention') {
				this.$router.push({ name: 'Profile', params: { id: ev.target.attributes.href.value } });
			}
			if (type === 'hashtag') {
				this.$router.push({ name: 'Hashtag', params: { hashtag: ev.target.attributes.href.value } })
			}
		},
		copyUrl() {
			this.$refs.popover.$emit('open');
			navigator.clipboard.writeText(this.tweetUrl);
		},
		onFocus(event) {
			event.target.select();
			navigator.clipboard.writeText(this.tweetUrl);
		}
	}
};
</script>

<style>
#reply-button, #share-button {
	color: #212529;
}
</style>
