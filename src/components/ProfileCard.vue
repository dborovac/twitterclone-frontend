<template>
    <b-container>
        <b-card v-if="user">
            <CompactProfileInfo class="mb-4" :userId="user.id" size="lg" withFollowButton />
            <div v-if="extended" class="mb-4">
                <p class="text-muted m-0">✉️ {{ user.email }}</p>
                <p v-if="user.birthday" class="text-muted m-0">🎁 {{ user.birthday }}</p>
                <p class="text-muted m-0">🌍 Belgrade, Serbia</p>
            </div>
            <b-row class="text-center">
                <b-col md="6">
                    <h5 v-if="user.followers" class="mb-0">{{ new Intl.NumberFormat().format(user.followers.length) }}</h5>
                    <small class="text-muted">FOLLOWERS</small>
                </b-col>
                <b-col md="6">
                    <h5 v-if="user.followees" class="mb-0">{{ new Intl.NumberFormat().format(user.followees.length) }}</h5>
                    <small class="text-muted">FOLLOWING</small>
                </b-col>
            </b-row>
        </b-card>
    </b-container>
</template>

<script>
export default {
    name: 'ProfileCard',
    props: {
        user: Object,
        extended: Boolean
    },
    data() {
        return {
            isHovered: false
        }
    }
}
</script>