<template>

    <b-row align-h="center" class="mt-5">
        <b-col md="2" lg="4">
            <b-card class="text-center">
                <v-icon name="bi-check-circle" scale="5" class="mb-3"></v-icon>
                <b-card-text class="mb-4">Thank you for registering. You can now log in with your email and password.</b-card-text>
                <router-link to="/login"><b-button variant="dark">Log in</b-button></router-link>
            </b-card>
        </b-col>
    </b-row>

</template>