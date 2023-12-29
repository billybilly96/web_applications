<template>
    <v-overlay :absolute="false" :value="popup_type != null" >
        <AlertComponent v-if="alert" :type="alert_type" :text="alert_text" />
        <v-container v-if="form">
            <v-row :no-gutters="$vuetify.breakpoint.smAndDown">
                <v-col cols="12">
                    <v-card :min-width="$vuetify.breakpoint.smAndDown ? '18em' : '35em'" light class="elevation-20">
                        <v-toolbar dark color="red darken-4 d-flex justify-center">
                            <v-toolbar-title v-if="popup_type == 'degree_course'">Modifica Corso di Laurea</v-toolbar-title>
                            <v-toolbar-title v-else-if="popup_type == 'email'">Modifica Email</v-toolbar-title>
                            <v-toolbar-title v-else-if="popup_type == 'username'">Modifica Username</v-toolbar-title>
                            <v-toolbar-title v-else-if="popup_type == 'password'">Modifica Password</v-toolbar-title>
                        </v-toolbar>
                        <v-card-text>
                            <v-form>
                                <v-row :no-gutters="$vuetify.breakpoint.smAndDown">
                                    <v-col cols="12" v-if="popup_type == 'degree_course'">
                                        <v-autocomplete
                                            :dense="$vuetify.breakpoint.smAndDown"
                                            v-model="new_degree_course"
                                            name = "new_degree_course"
                                            id="new_degree_course"
                                            type="text"
                                            label="Inserisci il nuovo corso di laurea"
                                            required
                                            :items="available_degree_courses"
                                            :error-messages="new_degree_course_errors"
                                            @input="$v.new_degree_course.$touch()"
                                            @blur="$v.new_degree_course.$touch()"
                                        ></v-autocomplete>
                                    </v-col>
                                    <v-col cols="12" v-if="popup_type == 'email'">
                                        <v-text-field 
                                            v-model="new_email" 
                                            name="new_email" 
                                            id="new_email"
                                            type="email" 
                                            label="Inserisci la nuova email" 
                                            required
                                            :error-messages="new_email_errors"
                                            @input="$v.new_email.$touch()"
                                            @blur="$v.new_email.$touch()"
                                        ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" v-if="popup_type == 'username'">
                                        <v-text-field 
                                            v-model="new_username" 
                                            name="new_username" 
                                            id="new_username"
                                            type="text" 
                                            label="Inserisci il nuovo username" 
                                            required
                                            :error-messages="new_username_errors"
                                            @input="$v.new_username.$touch()"
                                            @blur="$v.new_username.$touch()"
                                        ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" v-if="popup_type == 'password'">
                                        <v-text-field 
                                            v-model="old_password" 
                                            name="old_password" 
                                            id="old_password"
                                            type="password" 
                                            label="Inserisci la password attuale" 
                                            autocomplete="old-password"
                                            required
                                            :error-messages="old_password_errors"
                                            @input="$v.old_password.$touch()"
                                            @blur="$v.old_password.$touch()"
                                        ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" v-if="popup_type == 'password'">
                                        <v-text-field 
                                            v-model="new_password" 
                                            id="new_password" 
                                            name="new_password"
                                            type="password" 
                                            label="Inserisci la nuova password" 
                                            autocomplete="new-password"
                                            required
                                            :error-messages="new_password_errors"
                                            @input="$v.new_password.$touch()"
                                            @blur="$v.new_password.$touch()"
                                        ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" v-if="popup_type == 'password'">
                                        <v-text-field 
                                            v-model="confirm_password" 
                                            id="confirm_password" 
                                            name="confirm_password"
                                            type="password" 
                                            label="Conferma la nuova password"
                                            autocomplete="confirm-password"
                                            required
                                            :error-messages="confirm_password_errors"
                                            @input="$v.confirm_password.$touch()"
                                            @blur="$v.confirm_password.$touch()"
                                        ></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-form>
                        </v-card-text>                           
                        <v-card-actions class="d-flex justify-space-between">
                            <v-btn dark @click="submit" width="45%" color="green">Conferma</v-btn>
                            <v-btn dark @click="reset" width="45%" color="red lighten-1">Annulla</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </v-overlay>
</template>

<script>
    import { validationMixin } from "vuelidate";
    import { required, minLength, sameAs } from "vuelidate/lib/validators";
    import universityMixin from "@/mixins/universityMixin";
    import styleMixin from "@/mixins/styleMixin";
    import AlertComponent from "@/components/AlertComponent";

    export default {
        mixins: [ validationMixin, universityMixin, styleMixin ],
        components: { AlertComponent },
        props: {
            popup_type: { required: true },
            logged_user: { required: true }
        },
        validations: {
            new_degree_course: { required },
            new_email: { required, validEmail: function(email) {
                var email_regex = /^([a-z0-9_.-]+)@([\da-z.-]+)\.([a-z.]{2,6})$/;
                return email_regex.test(email);
            } },
            new_username: { required, minLength: minLength(4), validUsername: function(username) {
                var username_regex = /^([a-zA-Z0-9])+$/;
                return username_regex.test(username);
            } },
            old_password: { required, minLength: minLength(8) },
            new_password: { required, minLength: minLength(8), validPassword: function(password) {
                var no_spaces_regex = /^\S*$/;
                var password_regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{0,})/;
                return no_spaces_regex.test(password) && password_regex.test(password);
            } },
            confirm_password: { required, sameAsNewPassword: sameAs('new_password') }
        },
        data: () => ({
            form: true,
            alert: false,
            alert_type: "",
            alert_text: "",
            new_degree_course: "",
            new_email: "",
            new_username: "",
            old_password: "",
            new_password: "",
            confirm_password: ""
        }),
        computed: {
            available_degree_courses() {
                return this.get_degree_courses();
            },
            new_degree_course_errors() {
                var errors = [];
                if (!this.$v.new_degree_course.$dirty) {
                    return errors;
                }
                !this.$v.new_degree_course.required && errors.push("Il campo nuovo corso di laurea è obbligatorio.");
                return errors;
            },
            new_email_errors() {
                var errors = [];
                if (!this.$v.new_email.$dirty) {
                    return errors;
                }
                !this.$v.new_email.required && errors.push("Il campo nuova email è obbligatorio.");
                !this.$v.new_email.validEmail && errors.push("La nuova email deve contenere un indirizzo valido e non sono ammessi spazi.");
                return errors;
            },
            new_username_errors() {
                var errors = [];
                if (!this.$v.new_username.$dirty) {
                    return errors;
                }
                !this.$v.new_username.required && errors.push("Il campo nuovo username è obbligatorio.");
                !this.$v.new_username.minLength && errors.push("Il nuovo username deve contenere almeno 4 caratteri.");
                !this.$v.new_username.validUsername && errors.push("Il nuovo username deve contenere solo lettere e/o numeri e non sono ammessi spazi.");
                return errors;
            },
            old_password_errors() {
                var errors = [];
                if (!this.$v.old_password.$dirty) {
                    return errors;
                }
                !this.$v.old_password.required && errors.push("Il campo password attuale è obbligatorio.");
                !this.$v.old_password.minLength && errors.push("La password attuale deve contenere almeno 8 caratteri.");
                return errors;
            },
            new_password_errors() {
                var errors = [];
                if (!this.$v.new_password.$dirty) {
                    return errors;
                }
                !this.$v.new_password.required && errors.push("Il campo nuova password è obbligatorio.");
                !this.$v.new_password.minLength && errors.push("La nuova password deve contenere almeno 8 caratteri.");
                !this.$v.new_password.validPassword && errors.push("La nuova password deve contenere una lettera maiuscola, una minuscola, un carattere speciale, un numero e non sono ammessi spazi.");
                return errors;
            },
            confirm_password_errors() {
                var errors = [];
                if (!this.$v.confirm_password.$dirty) {
                    return errors;
                }
                !this.$v.confirm_password.required && errors.push("Il campo conferma password è obbligatorio.");
                !this.$v.confirm_password.sameAsNewPassword && errors.push("La conferma della password deve essere uguale alla nuova password.");
                return errors;
            }
        },
        methods: {
            async submit() {
                try {
                    this.$v.$touch();
                    if (this.popup_type == "degree_course" && !this.$v.new_degree_course.$invalid) {
                        await this.submit_new_degree_course();
                    } else if (this.popup_type == "email" && !this.$v.new_email.$invalid) {
                        await this.submit_new_email();
                    } else if (this.popup_type == "username" && !this.$v.new_username.$invalid) {
                        await this.submit_new_username();
                    } else if (this.popup_type == "password" && !this.$v.old_password.$invalid && !this.$v.new_password.$invalid && !this.$v.confirm_password.$invalid) {
                        await this.submit_new_password();
                    }
                } catch (err) {
                    this.alert = true;
                    this.alert_type = "error";
                    this.alert_text = err.response.data.description;
                }
            },
            async submit_new_degree_course() {
                var response = await this.axios.put(this.serverHost + "/student", {
                    field: "degree_course",
                    degree_course: this.new_degree_course
                });
                this.form = false;
                this.alert= true;
                this.alert_type = "success";
                this.alert_text = response.data.description;
                this.logged_user.degree_course = this.new_degree_course;
                this.$emit("update:logged_user", this.logged_user);
                await new Promise(res => setTimeout(res, 2000));
                this.reset();
            },
            async submit_new_email() {
                var response = await this.axios.put(this.serverHost + "/student", {
                    field: "email",
                    email: this.new_email
                });
                this.form = false;
                this.alert= true;
                this.alert_type = "success";
                this.alert_text = response.data.description;
                this.logged_user.email = this.new_email;
                this.$emit("update:logged_user", this.logged_user);
                await new Promise(res => setTimeout(res, 2000));
                this.reset();
            },
            async submit_new_username() {
                var response = await this.axios.put(this.serverHost + "/student", {
                    field: "username",
                    username: this.new_username
                });
                this.form = false;
                this.alert= true;
                this.alert_type = "success";
                this.alert_text = response.data.description;
                this.logged_user.username = this.new_username;
                this.$emit("update:logged_user", this.logged_user);
                await new Promise(res => setTimeout(res, 2000));
                this.reset();
            },
            async submit_new_password() {
                var response = await this.axios.put(this.serverHost + "/student", {
                    field: "password",
                    old_password: this.old_password,
                    new_password: this.new_password
                });
                this.form = false;
                this.alert= true;
                this.alert_type = "success";
                this.alert_text = response.data.description;
                await new Promise(res => setTimeout(res, 2000));
                this.reset();
            },
            reset() {
                this.$v.$reset();
                this.alert = false;
                this.form = true;
                this.new_degree_course = "";
                this.new_email = "";
                this.new_username = "";
                this.old_password = "";
                this.new_password = "";
                this.confirm_password = "";
                this.$emit("update:popup_type", null);
            }
        }
    }
</script>