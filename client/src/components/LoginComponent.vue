<template>
    <v-overlay :absolute="false" :value="overlay">
        <AlertComponent :class="{'mt-8 mb-0 pb-0': $vuetify.breakpoint.smAndDown}" v-if="alert" :type="alert_type" :text="alert_text" />
        <v-container v-if="form">
            <v-row>
                <v-col cols="12">
                    <v-card light class="elevation-20">
                        <v-toolbar dark color="red darken-4 d-flex justify-center">
                            <v-toolbar-title>Login</v-toolbar-title>
                        </v-toolbar>
                        <v-card-text>
                            <v-form>
                                <v-text-field
                                    v-model="email_or_username"
                                    prepend-icon="person"
                                    name="email_or_username"
                                    label="Email o Username"
                                    required
                                    id="email_or_username"
                                    type="text"
                                    autocomplete="username"
                                    :error-messages="email_or_username_errors"
                                    @input="$v.email_or_username.$touch()"
                                    @blur="$v.email_or_username.$touch()"
                                ></v-text-field>
                                <v-text-field
                                    v-model="password"
                                    prepend-icon="lock"
                                    name="password"
                                    label="Password"
                                    required
                                    id="password"
                                    type="password"
                                    autocomplete="current-password"
                                    :error-messages="password_errors"
                                    @input="$v.password.$touch()"
                                    @blur="$v.password.$touch()"
                                ></v-text-field>
                            </v-form>
                        </v-card-text>
                        <v-card-actions class="d-flex justify-space-between">
                            <v-btn dark @click="submit" width="45%" color="green">Conferma</v-btn>
                            <v-btn dark @click="close" width="45%" color="red lighten-1">Annulla</v-btn>
                        </v-card-actions>
                        <v-divider></v-divider>
                        <div class="d-flex justify-space-between align-center">
                            <span class="text-center ma-2 body-2">Non sei ancora registrato?</span>
                            <v-btn dark @click="register" width="45%" class="ma-2 align-self-center" color="light-blue darken-4">Registrati</v-btn>
                        </div>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </v-overlay>
</template>

<script>
    import { validationMixin } from "vuelidate";
    import { required, minLength } from "vuelidate/lib/validators";
    import EventBus from "../eventBus";
    import AlertComponent from "@/components/AlertComponent";

    export default {
        mixins: [ validationMixin ],
        validations: {
            email_or_username: { required, minLength: minLength(4) },
            password: { required, minLength: minLength(8) }
        },
        components: { AlertComponent },
        props: {
            overlay: { required: true },
            next_route: { type: String }
        },
        data: () => ({
            form: true,
            alert: false,
            alert_type: "",
            alert_text: "",
            email_or_username: "",
            password: ""
        }),
        computed: {
            email_or_username_errors() {
                var errors = [];
                if (!this.$v.email_or_username.$dirty) {
                    return errors;
                }
                !this.$v.email_or_username.required && errors.push("Il campo email/username è obbligatorio.");
                !this.$v.email_or_username.minLength && errors.push("L'email/username deve contenere minimo 4 caratteri.");
                return errors;
            },
            password_errors() {
                var errors = [];
                if (!this.$v.password.$dirty) {
                    return errors;
                }
                !this.$v.password.required && errors.push("Il campo password è obbligatorio.");
                !this.$v.password.minLength && errors.push("La password deve contenere minimo 8 caratteri.");
                return errors;
            }
        },
        methods: {
            async submit() {
                try {
                    this.$v.$touch();
                    if (!this.$v.$invalid) {
                        var response = await this.axios.post(this.serverHost + "/student/login", {
                            email_or_username: this.email_or_username,
                            password: this.password
                        });
                        this.form = false;
                        this.alert = true;
                        this.alert_text = response.data.description;
                        this.alert_type = "success";
                        EventBus.$emit("Login");
                        await new Promise(res => setTimeout(res, 2000));
                        this.close();
                        if (this.next_route != null) {
                            await this.$router.push(this.next_route).catch(() => {});
                        }
                    }
                } catch (err) {
                    this.alert = true;
                    this.alert_text = err.response.data.description;
                    this.alert_type = "error";
                }
            },
            register() {
                this.close();
                this.$router.push("/registration").catch(() => {});
            },
            close() {
                this.clear();
                this.$emit("update:overlay", false);
            },
            clear() {
                this.$v.$reset();
                this.form = true;
                this.alert = false;
                this.email_or_username = "";
                this.password = "";
            }
        }
    }
</script>