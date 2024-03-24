<template>
    <b-container class="mt-5">
        <b-row align-h="center">
            <b-col md="8">
                <b-card>
                    <b-form @submit.prevent="register">
                        <b-row>
                            <b-col md="6">
                                <b-form-group>
                                    <b-form-input placeholder="Email" v-model="email" type="email"
                                        required></b-form-input>
                                </b-form-group>
                            </b-col>
                            <b-col md="6">
                                <b-input-group prepend="@">
                                    <b-form-input placeholder="Handle" v-model="handle" required></b-form-input>
                                </b-input-group>
                            </b-col>
                        </b-row>

                        <b-row>
                            <b-col md="6">
                                <b-form-group>
                                    <b-form-input placeholder="First name (optional)"
                                        v-model="firstName"></b-form-input>
                                </b-form-group>
                            </b-col>
                            <b-col md="6">
                                <b-form-group>
                                    <b-form-input placeholder="Last name (optional)" v-model="lastName"></b-form-input>
                                </b-form-group>
                            </b-col>
                        </b-row>

                        <b-row>
                            <b-col md="6">
                                <b-form-group>
                                    <b-form-input placeholder="Password" v-model="password" type="password"
                                        required></b-form-input>
                                </b-form-group>
                            </b-col>
                            <b-col md="6">
                                <b-form-group>
                                    <b-form-input placeholder="Confirm password" v-model="matchingPassword"
                                        type="password" required></b-form-input>
                                </b-form-group>
                            </b-col>
                        </b-row>

                        <b-row class="mb-3">
                            <b-col md="6">
                                <b-form-group>
                                    <b-form-datepicker id="birthday-datepicker" v-model="birthday"
                                        placeholder="When is your birthday? (Optional)"></b-form-datepicker>
                                </b-form-group>
                            </b-col>
                        </b-row>

                        <b-button type="submit" variant="dark">Register</b-button>
                    </b-form>
                </b-card>
            </b-col>
        </b-row>
    </b-container>
</template>


<script>
import gql from 'graphql-tag';

export default {
    name: 'RegisterView',
    data() {
        return {
            email: '',
            handle: '',
            password: '',
            matchingPassword: '',
            firstName: '',
            lastName: '',
            birthday: ''
        };
    },
    methods: {
        async register() {
            const { email, handle, password, matchingPassword, birthday, firstName, lastName } = this;
            const input = {
                email,
                handle,
                password,
                matchingPassword,
                ...(birthday.trim() !== '' && { birthday }),
                ...(firstName.trim() !== '' && { firstName }),
                ...(lastName.trim() !== '' && { lastName })
            };

            await this.$apollo.provider.defaultClient.mutate({
                mutation: gql`
                mutation RegisterUser($request: RegistrationRequest!) {
                    register(request: $request) {
                        success
                    }
                }
                `,
                variables: {
                    request: input
                }
            }).then(() => {
                this.$router.push({ path: '/register/thank-you' })
            }
            )
        },
    },
};
</script>
