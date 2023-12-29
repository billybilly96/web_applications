<template>
    <v-container>
        <AlertComponent v-if="alert" :type="alert_type" :text="alert_text" />
        <v-row class="justify-center" no-gutters>
            <v-col cols="12" md="6">
                <v-card class="elevation-12" :disabled="!form">
                    <v-toolbar dark color="red darken-4 d-flex justify-center">
                        <v-toolbar-title>Registrazione</v-toolbar-title>
                    </v-toolbar>
                    <v-card-text>
                        <v-form>
                            <v-text-field
                                v-model="name"
                                prepend-icon="person"
                                name="name"
                                label="Nome"
                                required
                                id="name"
                                type="text"
                                :error-messages="name_errors"
                                @input="$v.name.$touch()"
                                @blur="$v.name.$touch()"
                            ></v-text-field>
                            <v-text-field
                                v-model="surname"
                                prepend-icon="person"
                                name="surname"
                                label="Cognome"
                                required
                                id="surname"
                                type="text"
                                :error-messages="surname_errors"
                                @input="$v.surname.$touch()"
                                @blur="$v.surname.$touch()"
                            ></v-text-field>
                            <v-autocomplete
                                v-model="degree_course"
                                prepend-icon="menu_book"
                                name = "degree_course"
                                label="Corso di Laurea"
                                required
                                id="degree_course"
                                type="text"
                                :dense="$vuetify.breakpoint.smAndDown"
                                :items="available_degree_courses"
                                :error-messages="degree_course_errors"
                                @input="$v.degree_course.$touch()"
                                @blur="$v.degree_course.$touch()"
                            ></v-autocomplete>
                            <v-text-field
                                v-model="email"
                                prepend-icon="email"
                                name="email"
                                label="Email"
                                required
                                id="email"
                                type="email"
                                :error-messages="email_errors"
                                @input="$v.email.$touch()"
                                @blur="$v.email.$touch()"
                            ></v-text-field>
                            <v-text-field
                                v-model="username"
                                prepend-icon="person_pin"
                                name="username"
                                label="Username"
                                required
                                id="username"
                                type="text"
                                autocomplete="username"
                                :error-messages="username_errors"
                                @input="$v.username.$touch()"
                                @blur="$v.username.$touch()"
                            ></v-text-field>
                            <v-text-field
                                v-model="password"
                                prepend-icon="lock"
                                name="password"
                                label="Password"
                                required
                                id="password"
                                type="password"
                                autocomplete="new-password"
                                :error-messages="password_errors"
                                @input="$v.password.$touch()"
                                @blur="$v.password.$touch()"
                            ></v-text-field>
                            <v-text-field
                                v-model="confirm_password"
                                prepend-icon="lock"
                                name="confirm_password"
                                label="Conferma Password"
                                required
                                id="confirm_password"
                                type="password"
                                autocomplete="new-password"
                                :error-messages="confirm_password_erros"
                                @input="$v.confirm_password.$touch()"
                                @blur="$v.confirm_password.$touch()"
                            ></v-text-field>
                        </v-form>
                    </v-card-text>
                    <v-card-actions class="d-flex justify-space-between">
                        <v-btn dark @click="submit" width="45%" color="green" class="mb-2 ml-3">Conferma</v-btn>
                        <v-btn dark @click="reset" width="45%" color="red lighten-1" class="mb-2 mr-3">Reset</v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import { validationMixin } from "vuelidate";
    import { required, minLength, sameAs } from "vuelidate/lib/validators";
    import universityMixin from "@/mixins/universityMixin";
    import EventBus from "../eventBus";
    import AlertComponent from "@/components/AlertComponent";

    export default {
        mixins: [ validationMixin, universityMixin ],
        validations: {
            name: { required, validName: function(name) {
                var name_regex = /^[a-zA-Z']+$/;
                var name_no_spaces = name.replace(/\s/g, '');
                return name_no_spaces.length >= 2 && name_regex.test(name_no_spaces);                
            } },
            surname: { required, validSurname: function(surname) {
                var name_regex = /^[a-zA-Z']+$/;
                var surname_no_spaces = surname.replace(/\s/g, '');
                return surname_no_spaces.length >= 2 && name_regex.test(surname_no_spaces);
            } },
            degree_course: { required },
            email: { required, validEmail: function(email) {
                var email_regex = /^([a-z0-9_.-]+)@([\da-z.-]+)\.([a-z.]{2,6})$/;
                return email_regex.test(email);
            } },
            username: { required, minLength: minLength(4), validUsername: function(username) {
                var username_regex = /^([a-zA-Z0-9])+$/;
                return username_regex.test(username);
            } },
            password: { required, minLength: minLength(8), validPassword: function(password) {
                var no_spaces_regex = /^\S*$/;
                var password_regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{0,})/;
                return no_spaces_regex.test(password) && password_regex.test(password);
            } },
            confirm_password: { required, sameAsPassword: sameAs('password') }
        },
        components: { AlertComponent },
        data: () => ({
            alert: false,
            alert_type: "",
            alert_text: "",
            form: true,
            name: "",
            surname: "",
            degree_course: "",
            email: "",
            username: "",
            password: "",
            confirm_password: ""
        }),
        computed: {
            available_degree_courses() {
                return this.get_degree_courses();
            },
            name_errors() {
                var errors = [];
                if (!this.$v.name.$dirty) {
                    return errors;
                }
                !this.$v.name.required && errors.push("Il campo nome è obbligatorio.");
                !this.$v.name.validName && errors.push("Il nome deve contenere solo lettere (minimo 2) e/o spazi.");
                return errors;
            },
            surname_errors() {
                var errors = [];
                if (!this.$v.surname.$dirty) {
                    return errors;
                }
                !this.$v.surname.required && errors.push("Il campo cognome è obbligatorio.");
                !this.$v.surname.validSurname && errors.push("Il cognome deve contenere solo lettere (minimo 2) e/o spazi.");
                return errors;
            },
            degree_course_errors() {
                var errors = [];
                if (!this.$v.degree_course.$dirty) {
                    return errors;
                }
                !this.$v.degree_course.required && errors.push("Il campo corso di laurea è obbligatorio.");
                return errors;
            },
            email_errors() {
                var errors = [];
                if (!this.$v.email.$dirty) {
                    return errors;
                }
                !this.$v.email.required && errors.push("Il campo email è obbligatorio.");
                !this.$v.email.validEmail && errors.push("L'email deve contenere un indirizzo valido e non sono ammessi spazi.");
                return errors;
            },
            username_errors() {
                var errors = [];
                if (!this.$v.username.$dirty) {
                    return errors;
                }
                !this.$v.username.required && errors.push("Il campo username è obbligatorio.");
                !this.$v.username.minLength && errors.push("L'username deve contenere almeno 4 caratteri.");
                !this.$v.username.validUsername && errors.push("L'username deve contenere solo lettere e/o numeri e non sono ammessi spazi.");
                return errors;
            },
            password_errors() {
                var errors = [];
                if (!this.$v.password.$dirty) {
                    return errors;
                }
                !this.$v.password.required && errors.push("Il campo password è obbligatorio.");
                !this.$v.password.minLength && errors.push("La password deve contenere almeno 8 caratteri.");
                !this.$v.password.validPassword && errors.push("La password deve contenere una lettera maiuscola, una minuscola, un carattere speciale, un numero e non sono ammessi spazi.");
                return errors;
            },
            confirm_password_erros() {
                var errors = [];
                if (!this.$v.confirm_password.$dirty) {
                    return errors;
                }
                !this.$v.confirm_password.required && errors.push("Il campo conferma password è obbligatorio.");
                !this.$v.confirm_password.sameAsPassword && errors.push("La conferma della password deve essere uguale alla password.");
                return errors;
            }
        },
        methods: {
            async submit() {
                try {
                    this.$v.$touch();
                    if (!this.$v.$invalid) {
                        var response = await this.axios.post(this.serverHost + "/student", {
                            name: this.name,
                            surname: this.surname,
                            degree_course: this.degree_course,
                            email: this.email,
                            username: this.username,
                            password: this.password
                        });
                        this.alert = true;
                        this.alert_text = response.data.description;
                        this.alert_type = "success";
                        this.form = false;
                        EventBus.$emit("Login");
                        await new Promise(res => setTimeout(res, 2000));
                        await this.$router.push("/").catch(() => {
                            this.alert = false;
                            this.form = true;
                        });
                    }
                } catch (err) {
                    this.alert = true;
                    this.alert_text = err.response.data.description;
                    this.alert_type = "error";
                    this.form = true;
                }
            },
            reset() {
                this.$v.$reset();
                this.name = "";
                this.surname = "";
                this.degree_course = "",
                this.email = "";
                this.username = "";
                this.password = "";
                this.confirm_password = "";
            }
        }
    }
</script>